import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { identifier, otp, newPassword } = await req.json();

  // Find OTP in otp_store
  const otpResults: any = await query(
    "SELECT * FROM otp_store WHERE email=? AND otp=? AND expires_at > NOW()",
    [identifier, otp]
  );

  if (!otpResults[0]) {
    return NextResponse.json({
      success: false,
      message: "Invalid or expired OTP.",
    });
  }

  // Find user
  const userResults: any = await query(
    "SELECT * FROM sign_up WHERE email_adress=? OR user_name=?",
    [identifier, identifier]
  );

  if (!userResults[0]) {
    return NextResponse.json({
      success: false,
      message: "User not found.",
    });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  // Update password
  await query("UPDATE sign_up SET usr_password=? WHERE sign_up_id=?", [
    hashed,
    userResults[0].sign_up_id,
  ]);

  // Delete used OTP
  await query("DELETE FROM otp_store WHERE id=?", [otpResults[0].id]);

  return NextResponse.json({ success: true });
}
