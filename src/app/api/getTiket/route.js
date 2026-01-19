// app/api/getTiket/route.js
import { query } from "@/lib/db_hulu_guzo_user";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("userId");

    if (!user_id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User ID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const results = await query("CALL GetUserTickets(?)", [user_id]);
    const tickets = results[0];

    const ticketsWithLogo = tickets.map((t) => {
      if (t.provider_logo && t.provider_logo_format) {
        let buffer;

        if (t.provider_logo instanceof Buffer) {
          buffer = t.provider_logo;
        } else if (t.provider_logo.buffer) {
          buffer = Buffer.from(t.provider_logo.buffer);
        } else if (t.provider_logo instanceof Uint8Array) {
          buffer = Buffer.from(t.provider_logo);
        } else {
          console.warn("Unknown image format for ticket", t.tiket_number);
          return t;
        }

        t.provider_logo = `data:${
          t.provider_logo_format
        };base64,${buffer.toString("base64")}`;
      }
      return t;
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Tickets fetched successfully",
        data: ticketsWithLogo,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
