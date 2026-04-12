import { pool } from "@/lib/db";
import { ensureAuthTables } from "@/lib/authDb";
import { signToken, setAuthCookie } from "@/lib/auth";
import { SignupSchema } from "@/lib/schemas";
import { apiError, zodError } from "@/lib/apiError";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const parsed = SignupSchema.safeParse(raw);
    if (!parsed.success) return zodError(parsed.error);

    const { password, name: rawName } = parsed.data;
    const email = parsed.data.email.trim().toLowerCase();
    const name = rawName.trim().slice(0, 100);

    await ensureAuthTables();

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );
    if (existing.rows.length > 0) {
      return apiError(
        "An account with this email already exists.",
        "CONFLICT",
        409,
      );
    }

    const passwordHash = await hash(password, 12);

    const result = await pool.query(
      "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id",
      [email, passwordHash, name],
    );

    const userId = result.rows[0].id;
    const token = await signToken({ userId, email });

    const response = NextResponse.json({
      user: { id: userId, email, name },
      token,
    });

    return setAuthCookie(response, token);
  } catch (err) {
    console.error("Signup error:", err);
    return apiError("Unable to create account.", "INTERNAL_ERROR", 500);
  }
}
