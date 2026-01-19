import { query } from "@/lib/db_hulu_guzo_user";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      sourceCityFirst = null,
      destinationCityFirst = null,
      tripTypeFirst = "one-way",
      dateFirst = null,
      passengerCountFirst = null,
      sourceCityRound = null,
      destinationCityRound = null,
      dateRound = null,
      passengerCountRound = null,
    } = body;

    if (
      !sourceCityFirst ||
      !destinationCityFirst ||
      !dateFirst ||
      !passengerCountFirst
    ) {
      return new Response(
        JSON.stringify({ message: "Missing required fields for first trip" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const params = [
      sourceCityFirst,
      destinationCityFirst,
      dateFirst,
      passengerCountFirst,
      sourceCityRound,
      destinationCityRound,
      dateRound,
      passengerCountRound,
    ];

    // ✅ FIX: do NOT destructure
    const result: any = await query(
      "CALL GetTripOptions(?, ?, ?, ?, ?, ?, ?, ?)",
      params
    );

    // MySQL CALL returns nested arrays
    const rows =
      Array.isArray(result) && Array.isArray(result[0])
        ? result[0]
        : result;

    const trips =
      Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;

    const grouped: Record<string, Record<string, any[]>> = {};

    trips.forEach((trip: any) => {
      const providerId = trip.provider_id;
      const tripType = trip.trip_type;

      if (!grouped[providerId]) grouped[providerId] = {};
      if (!grouped[providerId][tripType])
        grouped[providerId][tripType] = [];

      grouped[providerId][tripType].push(trip);
    });

    return new Response(JSON.stringify(grouped), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
