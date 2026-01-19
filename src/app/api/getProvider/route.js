import { query } from "@/lib/db_hulu_guzo_admin";

export async function GET() {
  try {
    // Pass providerID as parameter
    const [rows] = await query("CALL GetTransportProviders()");

    // Handle result
    const providers =
      Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;
    const providerList = Array.isArray(providers) ? providers : [providers];

    

    // Sort cityList by city_name alphabetically (case-insensitive)
    providerList.sort((a, b) =>
      a.transporter_name
        .toLowerCase()
        .localeCompare(b.transporter_name.toLowerCase())
    );

    return new Response(JSON.stringify(providerList), {
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
