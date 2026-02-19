import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db_hulu_guzo";

interface BusRow {
  category_type: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const provider_id = searchParams.get("provider_id");
  const bus_code = searchParams.get("bus_code");

  if (!provider_id || !bus_code) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const result = await query(
      `SELECT category_type 
       FROM register_bus 
       WHERE provider_id = $1 AND bus_code = $2
       LIMIT 1`,
      [provider_id, bus_code],
    ) as { rows: BusRow[] };

    const rows = result.rows;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    return NextResponse.json({ busType: rows[0].category_type });
  } catch (error: any) {
    console.error("Error fetching bus type:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 },
    );
  }
}
