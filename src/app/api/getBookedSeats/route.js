import { query } from "@/lib/db_hulu_guzo_user";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const providerID = searchParams.get("provider_id");
    const departureDate = searchParams.get("departure_date"); // YYYY-MM-DD
    const departureTime = searchParams.get("departure_time"); // HH:MM:SS
    const tripType = searchParams.get("trip_type"); // "first" or "round"
    const busCode = searchParams.get("bus_code"); // new param

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
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // PostgreSQL function call
    const result = await query(
      `
      SELECT * FROM get_booked_seats (
        $1::int,
        $2::date,
        $3::time,
        $4::text,
        $5::text
      )
      `,
      [Number(providerID), departureDate, departureTime, tripType, busCode],
    );

    const seats = result.rows; // Postgres returns rows array

    return new Response(JSON.stringify(seats), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching booked seats:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Database query failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
