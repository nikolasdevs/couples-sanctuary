import { pool } from "@/lib/db";
import { ensureResetTable } from "@/lib/resetDb";
import { ensureAuthTables } from "@/lib/authDb";
import { apiError } from "@/lib/apiError";
import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";
import { createHash, randomBytes } from "crypto";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://sanctuary.visit2nigeria.com";

function getMailer() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("GMAIL_USER or GMAIL_APP_PASSWORD not configured");
  return createTransport({ service: "gmail", auth: { user, pass } });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : null;

    if (!email) {
      return apiError("Email is required.", "VALIDATION_ERROR", 400);
    }

    await ensureAuthTables();
    await ensureResetTable();

    const result = await pool.query(
      "SELECT id, name FROM users WHERE email = $1",
      [email],
    );

    // Always return success — never reveal whether the email exists.
    if (result.rows.length === 0) {
      return NextResponse.json({ ok: true });
    }

    const user = result.rows[0] as { id: number; name: string };

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");

    // Invalidate any existing unused tokens for this user.
    await pool.query(
      "UPDATE password_reset_tokens SET used = TRUE WHERE user_id = $1 AND used = FALSE",
      [user.id],
    );

    await pool.query(
      "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, NOW() + INTERVAL '1 hour')",
      [user.id, tokenHash],
    );

    const resetUrl = `${APP_URL}/reset-password?token=${rawToken}`;

    await getMailer().sendMail({
      from: `Couples Sanctuary <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
          <h2 style="margin-bottom:8px;">Reset your password</h2>
          <p>Hi ${user.name},</p>
          <p>Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
          <a href="${resetUrl}"
             style="display:inline-block;margin:24px 0;padding:12px 24px;background:#e11d48;color:#fff;border-radius:9999px;text-decoration:none;font-weight:600;">
            Reset Password
          </a>
          <p style="color:#71717a;font-size:13px;">
            If you didn't request a password reset you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return apiError("Unable to send reset email.", "INTERNAL_ERROR", 500);
  }
}
