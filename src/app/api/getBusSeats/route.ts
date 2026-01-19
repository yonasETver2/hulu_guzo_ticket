import { NextResponse } from "next/server";
import { query } from "@/lib/db_hulu_guzo_admin";

// Define a type for the result row
interface BusRow {
  bus_category_id: string; // Adjust this based on the actual type of `bus_category_id`
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const provider_id = searchParams.get("provider_id");
    const bus_code = searchParams.get("bus_code");

    if (!provider_id || !bus_code) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Get bus_category_id from register_bus
    const busRow = await query(
      `SELECT bus_category_id FROM register_bus 
       WHERE provider_id = ? AND bus_code = ? LIMIT 1`,
      [provider_id, bus_code]
    );

    // Cast busRow to BusRow[] (assuming it returns an array of BusRow)
    if (Array.isArray(busRow) && busRow.length > 0) {
      const bus_category_id = (busRow[0] as BusRow).bus_category_id;

      // Fetch seat layout dynamically
      const seats = await query(
        `SELECT seat_number, pos_row, pos_col 
         FROM bus_seat 
         WHERE provider_id = ? AND bus_category_id = ? 
         ORDER BY pos_row, pos_col`,
        [provider_id, bus_category_id]
      );

      return NextResponse.json({ seats });
    } else {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching bus seats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
