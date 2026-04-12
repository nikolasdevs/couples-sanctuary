import { pool } from "@/lib/db";
import { ensureAuthTables } from "@/lib/authDb";
import { signToken, setAuthCookie } from "@/lib/auth";
import { LoginSchema } from "@/lib/schemas";
import { apiError, zodError } from "@/lib/apiError";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const parsed = LoginSchema.safeParse(raw);
    if (!parsed.success) return zodError(parsed.error);

    const { email: rawEmail, password } = parsed.data;
    const email = rawEmail.trim().toLowerCase();

    await ensureAuthTables();

    const result = await pool.query(
      "SELECT id, email, name, password_hash FROM users WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return apiError("Invalid email or password.", "INVALID_CREDENTIALS", 401);
    }

    const user = result.rows[0];
    const valid = await compare(password, user.password_hash);

    if (!valid) {
      return apiError("Invalid email or password.", "INVALID_CREDENTIALS", 401);
    }

    const token = await signToken({ userId: user.id, email: user.email });

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });

    return setAuthCookie(response, token);
  } catch (err) {
    console.error("Login error:", err);
    return apiError("Unable to log in.", "INTERNAL_ERROR", 500);
  }
}
