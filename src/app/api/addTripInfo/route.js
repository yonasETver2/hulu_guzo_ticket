import { query } from "@/lib/db_hulu_guzo_user";

// Format 12-hour time (02:30 PM) to 24-hour TIME (HH:MM:SS)
function formatTimeToMySQL(timeStr) {
  if (!timeStr) return null;
  const [time, meridiem] = timeStr.split(" ");
  if (!time || !meridiem) return null;

  let [hours, minutes] = time.split(":").map(Number);
  if (meridiem.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (meridiem.toUpperCase() === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:00`;
}

// Format date string (e.g., "Wednesday, November 19, 2025") to YYYY-MM-DD
function formatDateToMySQL(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.trips || !Array.isArray(body.trips) || body.trips.length === 0) {
      return new Response(
        JSON.stringify({ message: "Trips data is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const {
      payment_unique_id,
      first_trip_payment,
      round_trip_payment,
      total_payment,
      payment_type,
      tiket_optained_at,
      travel_status,
      user_id,
    } = body;

    if (!payment_unique_id || !total_payment || !payment_type) {
      return new Response(
        JSON.stringify({
          message:
            "Missing required payment fields: payment_unique_id, total_payment, payment_type",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Format trips JSON to match procedure expectations
    const tripsFormatted = body.trips.map((trip) => ({
      provider_id: trip.provider_id,
      date_departure: formatDateToMySQL(trip.date),
      departure_time: formatTimeToMySQL(trip.time),
      price_per_passenger: trip.price_per_passenger,
      seats:
        trip.seats && trip.seats.length > 0
          ? trip.seats
          : trip.passengers.map((p) => ({
              seat_number: p.seat,
              pos_row: p.seat_row,
              pos_col: p.seat_col,
            })),
      passengers: trip.passengers.map((p) => ({
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

    // console.log(
    //   "Trips JSON being sent to MySQL:",
    //   JSON.stringify(tripsFormatted, null, 2)
    // );

    const rows = await query(
      "CALL AssignTripsJSON(?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        JSON.stringify(tripsFormatted),
        payment_unique_id,
        first_trip_payment ?? 0,
        round_trip_payment ?? 0,
        total_payment,
        payment_type,
        tiket_optained_at ?? new Date().toISOString(),
        travel_status ?? "Pending",
        user_id ?? null,
      ]
    );

    const result =
      Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to save trips:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
