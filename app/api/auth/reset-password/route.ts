import { pool } from "@/lib/db";
import { ensureResetTable } from "@/lib/resetDb";
import { signToken, setAuthCookie } from "@/lib/auth";
import { apiError } from "@/lib/apiError";
import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { hash } from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { token, password } = body as {
      token?: string;
      password?: string;
    };

    if (!token || typeof token !== "string") {
      return apiError("Reset token is required.", "VALIDATION_ERROR", 400);
    }
    if (!password || typeof password !== "string" || password.length < 8) {
      return apiError(
        "Password must be at least 8 characters.",
        "VALIDATION_ERROR",
        400,
      );
    }

    await ensureResetTable();

    const tokenHash = createHash("sha256").update(token).digest("hex");

    const result = await pool.query(
      `SELECT id, user_id FROM password_reset_tokens
       WHERE token_hash = $1 AND used = FALSE AND expires_at > NOW()`,
      [tokenHash],
    );

    if (result.rows.length === 0) {
      return apiError(
        "This reset link is invalid or has expired.",
        "INVALID_TOKEN",
        400,
      );
    }

    const { id: tokenId, user_id: userId } = result.rows[0] as {
      id: number;
      user_id: number;
    };

    const passwordHash = await hash(password, 12);

    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      passwordHash,
      userId,
    ]);

    await pool.query(
      "UPDATE password_reset_tokens SET used = TRUE WHERE id = $1",
      [tokenId],
    );

    const userResult = await pool.query(
      "SELECT email FROM users WHERE id = $1",
      [userId],
    );
    const email = (userResult.rows[0] as { email: string }).email;

    const jwtToken = await signToken({ userId, email });
    const response = NextResponse.json({ ok: true, token: jwtToken });
    return setAuthCookie(response, jwtToken);
  } catch (err) {
    console.error("Reset password error:", err);
    return apiError("Unable to reset password.", "INTERNAL_ERROR", 500);
  }
}
