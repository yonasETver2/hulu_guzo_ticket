import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body?.email?.trim();

    console.log("Email received:", email);

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email or username required" },
        { status: 400 },
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiry: 3 minutes
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    // Save OTP in Postgres (Neon)
    await query(
      `
      INSERT INTO otp_store (email, otp, expires_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (email)
      DO UPDATE SET otp = EXCLUDED.otp,
                    expires_at = EXCLUDED.expires_at
      `,
      [email, otp, expiresAt],
    );

    // Send OTP using Resend
    const data = await resend.emails.send({
      from: "Your App <onboarding@resend.dev>",
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 3 minutes.</p>`,
    });

    console.log("Resend response:", data);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (err: any) {
    console.error("Send OTP error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 },
    );
  }
}
