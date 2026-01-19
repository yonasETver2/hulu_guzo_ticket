import { query } from "@/lib/db_hulu_guzo_admin";

export async function GET() {
  try {
    // Call the stored procedure
    const [rows] = await query("CALL GetProvidersNamePhone()");

    // Extract result set
    const providers =
      Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;
    const providerList = Array.isArray(providers) ? providers : [providers];

    // Sort by transporter_name alphabetically (case-insensitive)
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
    console.error("Error fetching providers:", error);
    return new Response(JSON.stringify({ error: "Database query failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
