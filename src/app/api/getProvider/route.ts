import { query } from "@/lib/db_hulu_guzo";

export async function GET() {
  try {
    const result = await query(`SELECT * FROM get_transport_providers()`);
    //console.log("Raw DB rows:", result.rows); // <- log DB output
    const rows = result.rows ?? [];

    const providers = rows.map((row) => ({
      id: row.provider_id,
      en: row.transporter_name,
      am: row.transporter_name_amh,
      logo: row.image_data
        ? `data:${row.image_type};base64,${Buffer.from(row.image_data).toString("base64")}`
        : "",
      type: row.image_type,
    }));

    //console.log("Mapped providers:", providers); // <- log mapped data

    return new Response(JSON.stringify({ providers }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error fetching transport providers:", error);
    return new Response(
      JSON.stringify({
        error: "Database query failed",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
