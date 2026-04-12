import { pool } from "@/lib/db";
import { ensureSyncTables, generateCode } from "@/lib/syncDb";
import { CreateSyncSchema } from "@/lib/schemas";
import { apiError, zodError } from "@/lib/apiError";
import { NextResponse } from "next/server";

/**
 * POST /api/sync — create a new sync session
 * Body: { type: "checkin" | "compatibility", weekKey?: string }
 */
export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return apiError("Database not configured.", "DB_NOT_CONFIGURED", 500);
    }

    const raw = await request.json();
    const parsed = CreateSyncSchema.safeParse(raw);
    if (!parsed.success) return zodError(parsed.error);

    const { type, weekKey: rawWeekKey } = parsed.data;
    const weekKey =
      type === "checkin" && typeof rawWeekKey === "string"
        ? rawWeekKey
        : null;

    await ensureSyncTables();

    let code = "";
    for (let i = 0; i < 5; i++) {
      code = generateCode();
      try {
        await pool.query(
          `INSERT INTO sync_sessions (code, type, week_key) VALUES ($1, $2, $3)`,
          [code, type, weekKey],
        );
        break;
      } catch (err: unknown) {
        const pgErr = err as { code?: string };
        if (pgErr.code === "23505" && i < 4) continue;
        throw err;
      }
    }

    return NextResponse.json({ code });
  } catch (err) {
    console.error("Sync create error:", err);
    return apiError("Unable to create sync session.", "INTERNAL_ERROR", 500);
  }
}
