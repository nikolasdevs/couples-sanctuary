import { pool } from "@/lib/db";
import { ensureAuthTables } from "@/lib/authDb";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

/** POST /api/couples/join — accept a couple invite */
export async function POST(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 },
      );
    }

    const body = (await request.json()) as { code?: string };
    const code = body.code?.trim().toUpperCase();

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: "Invalid invite code." },
        { status: 400 },
      );
    }

    await ensureAuthTables();

    // Check if user is already in an active couple
    const existingCouple = await pool.query(
      `SELECT id FROM couples
       WHERE (user_a_id = $1 OR user_b_id = $1) AND status = 'active'`,
      [auth.userId],
    );

    if (existingCouple.rows.length > 0) {
      return NextResponse.json(
        { error: "You are already paired with a partner." },
        { status: 409 },
      );
    }

    // Find the pending invite
    const invite = await pool.query(
      `SELECT id, user_a_id FROM couples
       WHERE invite_code = $1 AND status = 'pending'`,
      [code],
    );

    if (invite.rows.length === 0) {
      return NextResponse.json(
        { error: "Invite not found or already used." },
        { status: 404 },
      );
    }

    const couple = invite.rows[0];

    // Can't pair with yourself
    if (couple.user_a_id === auth.userId) {
      return NextResponse.json(
        { error: "You cannot join your own invite." },
        { status: 400 },
      );
    }

    // Accept the invite
    await pool.query(
      `UPDATE couples SET user_b_id = $1, status = 'active', invite_code = NULL
       WHERE id = $2`,
      [auth.userId, couple.id],
    );

    return NextResponse.json({ ok: true, coupleId: couple.id });
  } catch (err) {
    console.error("Couple join error:", err);
    return NextResponse.json(
      { error: "Unable to join couple." },
      { status: 500 },
    );
  }
}
