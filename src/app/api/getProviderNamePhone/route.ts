// src/app/api/getProviderNamePhone/route.ts
import { query } from "@/lib/db_hulu_guzo";

export async function GET() {
  try {
    // ✅ Query the correct table and columns
    const result = await query(`
      SELECT
        id AS transporter_id,
        transporter_name,
        transporter_name_amh,
        phone
      FROM transport_providers
      ORDER BY LOWER(transporter_name)
    `);

    const providers = result.rows ?? [];

    return new Response(JSON.stringify(providers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error fetching providers:", error);

    return new Response(
      JSON.stringify({
        error: "Database query failed",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
