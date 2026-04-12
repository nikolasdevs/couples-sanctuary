import { pool } from "@/lib/db";
import { ensureAuthTables, generateInviteCode } from "@/lib/authDb";
import { getAuthUser } from "@/lib/auth";
import { apiError } from "@/lib/apiError";
import { NextResponse } from "next/server";

/** POST /api/couples/invite — create a couple invite */
export async function POST(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return apiError("Not authenticated.", "UNAUTHORIZED", 401);
    }

    await ensureAuthTables();

    const existing = await pool.query(
      `SELECT id, status, invite_code FROM couples
       WHERE (user_a_id = $1 OR user_b_id = $1)
       ORDER BY created_at DESC LIMIT 1`,
      [auth.userId],
    );

    if (existing.rows.length > 0) {
      const couple = existing.rows[0];
      if (couple.status === "active") {
        return apiError(
          "You are already paired with a partner.",
          "ALREADY_PAIRED",
          409,
        );
      }
      if (couple.status === "pending") {
        return NextResponse.json({ inviteCode: couple.invite_code });
      }
    }

    let code = "";
    for (let i = 0; i < 5; i++) {
      code = generateInviteCode();
      try {
        await pool.query(
          "INSERT INTO couples (user_a_id, invite_code, status) VALUES ($1, $2, 'pending')",
          [auth.userId, code],
        );
        break;
      } catch (err: unknown) {
        const pgErr = err as { code?: string };
        if (pgErr.code === "23505" && i < 4) continue;
        throw err;
      }
    }

    return NextResponse.json({ inviteCode: code });
  } catch (err) {
    console.error("Couple invite error:", err);
    return apiError("Unable to create invite.", "INTERNAL_ERROR", 500);
  }
}
