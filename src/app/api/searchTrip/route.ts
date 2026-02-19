// app/api/getTripOptions/route.ts
import { query } from "@/lib/db_hulu_guzo_user";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      sourceCityFirst,
      destinationCityFirst,
      tripTypeFirst = "one-way",
      dateFirst,
      passengerCountFirst,
      sourceCityRound = null,
      destinationCityRound = null,
      dateRound = null,
      passengerCountRound = null,
    } = body;

    // Validate required fields for first trip
    if (
      !sourceCityFirst ||
      !destinationCityFirst ||
      !dateFirst ||
      !passengerCountFirst
    ) {
      return new Response(
        JSON.stringify({ message: "Missing required fields for first trip" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // If tripTypeFirst is "two-way", ensure round-trip fields are provided
    if (tripTypeFirst === "two-way") {
      if (
        !sourceCityRound ||
        !destinationCityRound ||
        !dateRound ||
        !passengerCountRound
      ) {
        return new Response(
          JSON.stringify({ message: "Missing required fields for round trip" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    // Call PostgreSQL function
    const result = await query(
      `
      SELECT * FROM get_trip_options (
        $1::text, $2::text, $3::date, $4::int,
        $5::text, $6::text, $7::date, $8::int
      )
      `,
      [
        sourceCityFirst,
        destinationCityFirst,
        dateFirst,
        passengerCountFirst,
        sourceCityRound,
        destinationCityRound,
        dateRound,
        passengerCountRound,
      ],
    );

    const trips = result.rows ?? [];

    // Group trips by provider_id and trip_type
    const grouped: Record<string, Record<string, any[]>> = {};
    trips.forEach((trip) => {
      const { provider_id, trip_type } = trip;
      if (!grouped[provider_id]) grouped[provider_id] = {};
      if (!grouped[provider_id][trip_type])
        grouped[provider_id][trip_type] = [];
      grouped[provider_id][trip_type].push(trip);
    });

    return new Response(JSON.stringify(grouped), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
