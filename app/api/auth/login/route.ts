import { pool } from "@/lib/db";
import { ensureAuthTables } from "@/lib/authDb";
import { signToken, setAuthCookie } from "@/lib/auth";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    await ensureAuthTables();

    const result = await pool.query(
      "SELECT id, email, name, password_hash FROM users WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const user = result.rows[0];
    const valid = await compare(password, user.password_hash);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const token = await signToken({ userId: user.id, email: user.email });

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });

    return setAuthCookie(response, token);
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Unable to log in." },
      { status: 500 },
    );
  }
}
