import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function saveBase64Image(base64: string) {
  const buffer = Buffer.from(base64.split(",")[1], "base64");
  const fileName = `ticket-${Date.now()}.png`;
  const dir = path.join(process.cwd(), "public", "tickets");

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, fileName), buffer);

  return `${process.env.NEXT_PUBLIC_BASE_URL}/tickets/${fileName}`;
}

export async function POST(req: Request) {
  const { channel, phone, image, ticketNumbers } = await req.json();

  // TELEGRAM
  if (channel === "telegram") {
    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: Number(phone),
          photo: image,
          caption: `Ticket\n${ticketNumbers.join(", ")}`,
        }),
      }
    );
  }

  // WHATSAPP
  if (channel === "whatsapp") {
    const imageUrl = saveBase64Image(image);

    await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.TWILIO_SID}:${process.env.TWILIO_TOKEN}`
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: "whatsapp:+14155238886",
          To: `whatsapp:${phone}`,
          MediaUrl: imageUrl,
          Body: "Your Ticket",
        }),
      }
    );
  }

  return NextResponse.json({ success: true });
}
