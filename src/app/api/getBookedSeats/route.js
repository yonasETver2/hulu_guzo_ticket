import { query } from "@/lib/db_hulu_guzo_user";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const providerID = searchParams.get("provider_id");
    const departureDate = searchParams.get("departure_date"); // YYYY-MM-DD
    const departureTime = searchParams.get("departure_time"); // HH:MM:SS
    const tripType = searchParams.get("trip_type"); // "first" or "round"
    const busCode = searchParams.get("bus_code"); // ✅ new param

    // Validate required params
    if (
      !providerID ||
      !departureDate ||
      !departureTime ||
      !tripType ||
      !busCode
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required query parameters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call stored procedure with 5 params
    const [rows] = await query("CALL GetBookedSeats(?, ?, ?, ?, ?)", [
      Number(providerID),
      departureDate,
      departureTime,
      tripType,
      busCode, // ✅ added
    ]);

    // Handle MySQL nested array result
    const seats =
      Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;

    return new Response(JSON.stringify(seats), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching booked seats:", error);
    return new Response(JSON.stringify({ error: "Database query failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
