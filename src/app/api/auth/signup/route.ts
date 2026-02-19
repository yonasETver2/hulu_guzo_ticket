import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, username, userType, password, confirmPassword } =
      await req.json();

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user via Postgres function
    await query(
      `
      SELECT * FROM signUpUser(
        $1::text,
        $2::text,
        $3::text,
        $4::text
      )
      `,
      [email, username, userType, hashedPassword]
    );

    return NextResponse.json(
      { success: true, message: "User signed up successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
