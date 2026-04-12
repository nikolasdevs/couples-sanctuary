import { pool } from "@/lib/db";
import { ensureAuthTables } from "@/lib/authDb";
import { getAuthUser } from "@/lib/auth";
import { JoinCoupleSchema } from "@/lib/schemas";
import { apiError, zodError } from "@/lib/apiError";
import { NextResponse } from "next/server";

/** POST /api/couples/join — accept a couple invite */
export async function POST(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return apiError("Not authenticated.", "UNAUTHORIZED", 401);
    }

    const raw = await request.json();
    const parsed = JoinCoupleSchema.safeParse(raw);
    if (!parsed.success) return zodError(parsed.error);

    const { code } = parsed.data;

    await ensureAuthTables();

    const existingCouple = await pool.query(
      `SELECT id FROM couples
       WHERE (user_a_id = $1 OR user_b_id = $1) AND status = 'active'`,
      [auth.userId],
    );

    if (existingCouple.rows.length > 0) {
      return apiError(
        "You are already paired with a partner.",
        "ALREADY_PAIRED",
        409,
      );
    }

    const invite = await pool.query(
      `SELECT id, user_a_id FROM couples
       WHERE invite_code = $1 AND status = 'pending'`,
      [code],
    );

    if (invite.rows.length === 0) {
      return apiError("Invite not found or already used.", "NOT_FOUND", 404);
    }

    const couple = invite.rows[0];

    if (couple.user_a_id === auth.userId) {
      return apiError("You cannot join your own invite.", "SELF_INVITE", 400);
    }

    await pool.query(
      `UPDATE couples SET user_b_id = $1, status = 'active', invite_code = NULL
       WHERE id = $2`,
      [auth.userId, couple.id],
    );

    return NextResponse.json({ ok: true, coupleId: couple.id });
  } catch (err) {
    console.error("Couple join error:", err);
    return apiError("Unable to join couple.", "INTERNAL_ERROR", 500);
  }
}
