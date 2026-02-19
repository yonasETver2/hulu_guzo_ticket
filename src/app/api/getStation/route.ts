// src/app/api/getStation/route.ts
import { query } from "@/lib/db_hulu_guzo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const source_city = searchParams.get("source_city");
    const destination_city = searchParams.get("destination_city");
    const provider_id = searchParams.get("provider_id");

    if (!source_city || !destination_city || !provider_id) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Call the Postgres function instead of MySQL procedure
    const result = await query(
      `SELECT * FROM get_stations_by_route($1::text, $2::text, $3::int)`,
      [source_city, destination_city, Number(provider_id)],
    );

    const stations = result.rows ?? [];

    return new Response(JSON.stringify(stations), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error fetching stations:", error);
    return new Response(
      JSON.stringify({
        error: "Database query failed",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
