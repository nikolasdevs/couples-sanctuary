import { pool } from "@/lib/db";
import { ensureSyncTables } from "@/lib/syncDb";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ code: string }>;
}

/**
 * POST /api/sync/[code]/respond — submit a partner's responses
 * Body: { partner: "A" | "B", name: string, responses: Record<string, unknown> }
 */
export async function POST(
  request: Request,
  context: RouteContext,
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database not configured." },
        { status: 500 },
      );
    }

    const { code } = await context.params;
    const cleanCode = code.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);

    const body = (await request.json()) as {
      partner?: string;
      name?: string;
      responses?: Record<string, unknown>;
    };

    const partner = body.partner;
    if (partner !== "A" && partner !== "B") {
      return NextResponse.json(
        { error: "partner must be 'A' or 'B'." },
        { status: 400 },
      );
    }

    if (!body.responses || typeof body.responses !== "object") {
      return NextResponse.json(
        { error: "responses is required." },
        { status: 400 },
      );
    }

    const name =
      typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";

    await ensureSyncTables();

    // Find session
    const sessionRes = await pool.query(
      `SELECT id, status, expires_at FROM sync_sessions WHERE code = $1`,
      [cleanCode],
    );

    if (sessionRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Session not found." },
        { status: 404 },
      );
    }

    const session = sessionRes.rows[0] as {
      id: string;
      status: string;
      expires_at: string;
    };

    if (new Date(session.expires_at) < new Date()) {
      return NextResponse.json({ error: "Session expired." }, { status: 410 });
    }

    if (session.status === "complete") {
      return NextResponse.json(
        { error: "Session already complete." },
        { status: 409 },
      );
    }

    // Upsert response
    await pool.query(
      `INSERT INTO sync_responses (session_id, partner, name, responses)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (session_id, partner)
       DO UPDATE SET responses = $4, name = $3`,
      [session.id, partner, name, JSON.stringify(body.responses)],
    );

    // Check if both partners have now responded
    const countRes = await pool.query(
      `SELECT COUNT(DISTINCT partner) as cnt FROM sync_responses WHERE session_id = $1`,
      [session.id],
    );

    const count = parseInt((countRes.rows[0] as { cnt: string }).cnt, 10);
    if (count >= 2) {
      await pool.query(
        `UPDATE sync_sessions SET status = 'complete' WHERE id = $1`,
        [session.id],
      );
    }

    return NextResponse.json({ ok: true, complete: count >= 2 });
  } catch (err) {
    console.error("Sync respond error:", err);
    return NextResponse.json(
      { error: "Unable to save response." },
      { status: 500 },
    );
  }
}
