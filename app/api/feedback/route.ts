import { NextResponse } from "next/server";
import { Pool } from "pg";
import { FeedbackSchema } from "@/lib/schemas";
import { apiError, zodError } from "@/lib/apiError";

declare global {
  var feedbackPool: Pool | undefined;
}

const pool =
  globalThis.feedbackPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.feedbackPool = pool;
}

async function ensureFeedbackTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS feedback (
      id BIGSERIAL PRIMARY KEY,
      rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
      feeling VARCHAR(50),
      closer VARCHAR(50),
      message TEXT,
      source TEXT NOT NULL DEFAULT 'unknown',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    ALTER TABLE feedback
    ADD COLUMN IF NOT EXISTS rating SMALLINT CHECK (rating >= 1 AND rating <= 5);
  `);

  await pool.query(`
    ALTER TABLE feedback
    ADD COLUMN IF NOT EXISTS feeling VARCHAR(50);
  `);

  await pool.query(`
    ALTER TABLE feedback
    ADD COLUMN IF NOT EXISTS closer VARCHAR(50);
  `);
}

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return apiError(
        "Database connection is not configured.",
        "DB_NOT_CONFIGURED",
        500,
      );
    }

    const raw = await request.json();
    const parsed = FeedbackSchema.safeParse(raw);
    if (!parsed.success) return zodError(parsed.error);

    const { rating, feeling, closer, message, source } = parsed.data;

    await ensureFeedbackTable();

    await pool.query(
      "INSERT INTO feedback (rating, feeling, closer, message, source) VALUES ($1, $2, $3, $4, $5)",
      [rating, feeling, closer, message || null, source],
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Feedback submission error:", err);
    return apiError("Unable to process feedback.", "INTERNAL_ERROR", 500);
  }
}
