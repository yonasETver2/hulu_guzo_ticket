import { query } from "@/lib/db_hulu_guzo_user";
import { NextResponse } from "next/server";

export async function GET(req) {
  // <-- remove ": Request"
  try {
    const { searchParams } = new URL(req.url);
    const payment_unique_id = searchParams.get("paymentId");

    if (!payment_unique_id) {
      return NextResponse.json(
        {
          success: false,
          status: "EXPIRED",
          message: "Payment ID is required",
        },
        { status: 400 }
      );
    }

    const rows = await query("CALL CheckPaymentStatus(?)", [payment_unique_id]);
    const row = rows[0][0];

    if (!row || !row.p_status) {
      return NextResponse.json(
        {
          success: false,
          status: "EXPIRED",
          message: "Payment expired or trip canceled",
        },
        { status: 200 }
      );
    }

    const status = (row.p_status || "PENDING").toUpperCase();

    let message = "";
    if (status === "PAID") message = "Payment successfully completed";
    else if (status === "PENDING") message = "Waiting for payment";
    else message = "Payment expired or trip canceled";

    return NextResponse.json(
      { success: status === "PAID", status, message },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        status: "EXPIRED",
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
