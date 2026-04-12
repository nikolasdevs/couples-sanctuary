import { pool } from "@/lib/db";
import { ensureSyncTables } from "@/lib/syncDb";
import { apiError } from "@/lib/apiError";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ code: string }>;
}

/**
 * GET /api/sync/[code] — check session status & get responses when ready
 */
export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    if (!process.env.DATABASE_URL) {
      return apiError("Database not configured.", "DB_NOT_CONFIGURED", 500);
    }

    const { code } = await context.params;
    const cleanCode = code.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);

    await ensureSyncTables();

    const sessionRes = await pool.query(
      `SELECT id, type, week_key, status, expires_at FROM sync_sessions WHERE code = $1`,
      [cleanCode],
    );

    if (sessionRes.rows.length === 0) {
      return apiError("Session not found.", "NOT_FOUND", 404);
    }

    const session = sessionRes.rows[0] as {
      id: string;
      type: string;
      week_key: string | null;
      status: string;
      expires_at: string;
    };

    if (new Date(session.expires_at) < new Date()) {
      await pool.query(
        `UPDATE sync_sessions SET status = 'expired' WHERE id = $1`,
        [session.id],
      );
      return apiError("Session expired.", "SESSION_EXPIRED", 410);
    }

    const respRes = await pool.query(
      `SELECT partner, name, responses FROM sync_responses WHERE session_id = $1 ORDER BY partner`,
      [session.id],
    );

    const partners: Record<string, { name: string; responses: unknown }> = {};
    for (const row of respRes.rows as {
      partner: string;
      name: string;
      responses: unknown;
    }[]) {
      partners[row.partner] = { name: row.name, responses: row.responses };
    }

    return NextResponse.json({
      type: session.type,
      weekKey: session.week_key,
      status: session.status,
      partnerA: partners["A"] ?? null,
      partnerB: partners["B"] ?? null,
    });
  } catch (err) {
    console.error("Sync status error:", err);
    return apiError("Unable to fetch session.", "INTERNAL_ERROR", 500);
  }
}
