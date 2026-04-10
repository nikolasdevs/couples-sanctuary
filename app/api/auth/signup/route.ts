import { pool } from "@/lib/db";
import { ensureAuthTables } from "@/lib/authDb";
import { signToken, setAuthCookie } from "@/lib/auth";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      name?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const name = body.name?.trim() || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    await ensureAuthTables();

    // Check if email already exists
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await hash(password, 12);

    const result = await pool.query(
      "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id",
      [email, passwordHash, name.slice(0, 100)],
    );

    const userId = result.rows[0].id;
    const token = await signToken({ userId, email });

    const response = NextResponse.json({
      user: { id: userId, email, name: name.slice(0, 100) },
    });

    return setAuthCookie(response, token);
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Unable to create account." },
      { status: 500 },
    );
  }
}
