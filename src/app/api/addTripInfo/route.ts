import { query } from "@/lib/db_hulu_guzo_user";

// Format 12-hour time → 24-hour TIME
function formatTimeToPostgres(timeStr: string | null) {
  if (!timeStr) return null;
  const [time, meridiem] = timeStr.split(" ");
  if (!time || !meridiem) return null;

  let [hours, minutes] = time.split(":").map(Number);
  if (meridiem.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (meridiem.toUpperCase() === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}

// Format date → YYYY-MM-DD
function formatDateToPostgres(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);

  // Use local year, month, date
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // month is 0-indexed
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      trips,
      payment_unique_id,
      first_trip_payment,
      round_trip_payment,
      total_payment,
      payment_type,
      tiket_optained_at,
      travel_status,
      user_id,
    } = body;

    // ----------------------------
    // Validate input
    // ----------------------------
    if (!Array.isArray(trips) || trips.length === 0) {
      return new Response(
        JSON.stringify({ message: "Trips data is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!user_id) {
      return new Response(
        JSON.stringify({
          message: "Invalid sign_up_id: user not logged in or session expired",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!payment_unique_id || !total_payment || !payment_type) {
      return new Response(
        JSON.stringify({
          message:
            "Missing required fields: payment_unique_id, total_payment, payment_type",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ----------------------------
    // Verify user_id exists in sign_up table
    // ----------------------------
    const userCheck = await query(
      `SELECT sign_up_id FROM sign_up WHERE sign_up_id = $1`,
      [user_id]
    );

    if (userCheck.rows.length === 0) {
      return new Response(
        JSON.stringify({
          message: "Invalid sign_up_id: user does not exist",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ----------------------------
    // Prepare trips JSON for Postgres
    // ----------------------------
    const tripsFormatted = trips.map((trip: any) => ({
      provider_id: trip.provider_id,
      date_departure: formatDateToPostgres(trip.date),
      departure_time: formatTimeToPostgres(trip.time),
      price_per_passenger: trip.price_per_passenger,
      seats:
        trip.seats?.length > 0
          ? trip.seats
          : trip.passengers.map((p: any) => ({
              seat_number: p.seat,
              pos_row: p.seat_row,
              pos_col: p.seat_col,
            })),
      passengers: trip.passengers.map((p: any) => ({
        firstName: p.firstName,
        middleName: p.middleName,
        lastName: p.lastName,
        fullName: p.fullName,
        phone: p.phone,
        nationalID: p.nationalID,
        sex: p.sex,
        station: p.station,
        seat: p.seat,
        seat_row: p.seat_row,
        seat_col: p.seat_col,
      })),
      source_city: trip.source_city,
      destination_city: trip.destination_city,
      trip_sort_date: trip.trip_sort_date,
      bus_code: trip.bus_code,
    }));

    // ----------------------------
    // Call Postgres function
    // ----------------------------
    const result = await query(
      `
      SELECT *
      FROM assign_trips_json (
        $1::jsonb,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9
      )
      `,
      [
        JSON.stringify(tripsFormatted),
        payment_unique_id,
        first_trip_payment ?? 0,
        round_trip_payment ?? 0,
        total_payment,
        payment_type,
        tiket_optained_at ?? new Date().toISOString(),
        travel_status ?? "Pending",
        user_id,
      ]
    );

    return new Response(
      JSON.stringify({ success: true, result: result.rows }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Failed to save trips:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message ?? "Internal Server Error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
