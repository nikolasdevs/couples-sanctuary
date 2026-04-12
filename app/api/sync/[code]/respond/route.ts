import { pool } from "@/lib/db";
import { ensureSyncTables } from "@/lib/syncDb";
import { SyncRespondSchema } from "@/lib/schemas";
import { apiError, zodError } from "@/lib/apiError";
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
      return apiError("Database not configured.", "DB_NOT_CONFIGURED", 500);
    }

    const { code } = await context.params;
    const cleanCode = code.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);

    const raw = await request.json();
    const parsed = SyncRespondSchema.safeParse(raw);
    if (!parsed.success) return zodError(parsed.error);

    const { partner, name, responses } = parsed.data;

    await ensureSyncTables();

    const sessionRes = await pool.query(
      `SELECT id, status, expires_at FROM sync_sessions WHERE code = $1`,
      [cleanCode],
    );

    if (sessionRes.rows.length === 0) {
      return apiError("Session not found.", "NOT_FOUND", 404);
    }

    const session = sessionRes.rows[0] as {
      id: string;
      status: string;
      expires_at: string;
    };

    if (new Date(session.expires_at) < new Date()) {
      return apiError("Session expired.", "SESSION_EXPIRED", 410);
    }

    if (session.status === "complete") {
      return apiError("Session already complete.", "SESSION_COMPLETE", 409);
    }

    await pool.query(
      `INSERT INTO sync_responses (session_id, partner, name, responses)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (session_id, partner)
       DO UPDATE SET responses = $4, name = $3`,
      [session.id, partner, name.trim().slice(0, 100), JSON.stringify(responses)],
    );

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
    return apiError("Unable to save response.", "INTERNAL_ERROR", 500);
  }
}
