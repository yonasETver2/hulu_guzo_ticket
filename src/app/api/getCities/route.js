import { query } from "@/lib/db_hulu_guzo_admin";


const providerID = null;

export async function GET() {
  try {
    // Pass providerID as parameter
    const [rows] = await query("CALL GetCityByProvider(?)", [providerID]);

    // Handle result
    const cities =
      Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;
    const cityList = Array.isArray(cities) ? cities : [cities];

    // Sort cityList by city_name alphabetically (case-insensitive)
    cityList.sort((a, b) =>
      a.city_name.toLowerCase().localeCompare(b.city_name.toLowerCase())
    );

    return new Response(JSON.stringify(cityList), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return new Response(JSON.stringify({ error: "Database query failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
