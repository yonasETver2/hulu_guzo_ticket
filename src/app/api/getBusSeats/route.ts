import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db_hulu_guzo";

interface Seat {
  seat_number: string;
  pos_row: number;
  pos_col: number;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const provider_id = searchParams.get("provider_id");
    const bus_code = searchParams.get("bus_code");

    if (!provider_id || !bus_code) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Get bus_category_id
    const busRowResult = await query(
      `SELECT bus_category_id FROM register_bus 
       WHERE provider_id = $1 AND bus_code = $2 
       LIMIT 1`,
      [provider_id, bus_code],
    ) as { rows: { bus_category_id: string }[] };

    const busRow = busRowResult.rows[0];
    if (!busRow) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    const bus_category_id = busRow.bus_category_id;

    // Fetch seat layout
    const seatsResult = await query(
      `SELECT seat_number, pos_row, pos_col 
       FROM bus_seat 
       WHERE provider_id = $1 AND bus_category_id = $2 
       ORDER BY pos_row, pos_col`,
      [provider_id, bus_category_id],
    ) as { rows: Seat[] };

    const seats = seatsResult.rows ?? [];

    return NextResponse.json({ seats });
  } catch (error: any) {
    console.error("Error fetching bus seats:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
