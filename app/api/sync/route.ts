import { pool } from "@/lib/db";
import { ensureSyncTables, generateCode } from "@/lib/syncDb";
import { NextResponse } from "next/server";

/**
 * POST /api/sync — create a new sync session
 * Body: { type: "checkin" | "compatibility", weekKey?: string }
 */
export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database not configured." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as {
      type?: string;
      weekKey?: string;
    };

    const type = body.type;
    if (type !== "checkin" && type !== "compatibility") {
      return NextResponse.json(
        { error: "type must be 'checkin' or 'compatibility'." },
        { status: 400 },
      );
    }

    const weekKey =
      type === "checkin" && typeof body.weekKey === "string"
        ? body.weekKey.slice(0, 20)
        : null;

    await ensureSyncTables();

    // Generate a unique code (retry on collision)
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
        if (pgErr.code === "23505" && i < 4) continue; // unique violation, retry
        throw err;
      }
    }

    return NextResponse.json({ code });
  } catch (err) {
    console.error("Sync create error:", err);
    return NextResponse.json(
      { error: "Unable to create sync session." },
      { status: 500 },
    );
  }
}
