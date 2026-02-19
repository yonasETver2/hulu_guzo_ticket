import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { identifier, otp, newPassword } = await req.json();

  // 1️⃣ Find OTP in otp_store
  const otpResult = await query(
    `
    SELECT *
    FROM otp_store
    WHERE email = $1
      AND otp = $2
      AND expires_at > NOW()
    `,
    [identifier, otp]
  );

  const otpRow = otpResult.rows[0];
  if (!otpRow) {
    return NextResponse.json({
      success: false,
      message: "Invalid or expired OTP.",
    });
  }

  // 2️⃣ Find user
  const userResult = await query(
    `
    SELECT *
    FROM sign_up
    WHERE email_adress = $1
       OR user_name = $1
    `,
    [identifier]
  );

  const user = userResult.rows[0];
  if (!user) {
    return NextResponse.json({
      success: false,
      message: "User not found.",
    });
  }

  // 3️⃣ Hash new password
  const hashed = await bcrypt.hash(newPassword, 10);

  // 4️⃣ Update password
  await query(
    `
    UPDATE sign_up
    SET usr_password = $1
    WHERE sign_up_id = $2
    `,
    [hashed, user.sign_up_id]
  );

  // 5️⃣ Delete used OTP
  await query(
    `
    DELETE FROM otp_store
    WHERE id = $1
    `,
    [otpRow.id]
  );

  return NextResponse.json({ success: true });
}
