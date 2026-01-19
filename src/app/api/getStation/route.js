// src/app/api/getStation/route.js
import { query } from "@/lib/db_hulu_guzo_admin";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const source_city = searchParams.get("source_city");
    const destination_city = searchParams.get("destination_city");
    const provider_id = searchParams.get("provider_id");

    if (!source_city || !destination_city || !provider_id) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const [rows] = await query("CALL GetStationsByRoute(?, ?, ?)", [
      source_city,
      destination_city,
      provider_id,
    ]);

    const stations =
      Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;

    return new Response(JSON.stringify(stations), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching stations:", error);
    return new Response(JSON.stringify({ error: "Database query failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
