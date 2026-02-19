import { query } from "@/lib/db_hulu_guzo";

export async function GET(request: Request) {
  try {
    // Get providerID from query string if passed
    const url = new URL(request.url);
    const providerIDParam = url.searchParams.get("providerID");
    const providerID = providerIDParam ? parseInt(providerIDParam) : null;

    // Call Postgres function
    const result = await query(`SELECT * FROM get_city_by_provider($1)`, [
      providerID,
    ]);

    const cities = result.rows ?? [];

    // Sort cityList by city_name alphabetically (case-insensitive)
    cities.sort((a, b) =>
      a.city_name.toLowerCase().localeCompare(b.city_name.toLowerCase())
    );

    return new Response(JSON.stringify(cities), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error fetching cities:", error);
    return new Response(
      JSON.stringify({
        error: "Database query failed",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
