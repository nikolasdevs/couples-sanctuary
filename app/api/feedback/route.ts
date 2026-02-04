import { NextResponse } from "next/server";
import { Pool } from "pg";

const MAX_MESSAGE_LENGTH = 1000;

declare global {
  var feedbackPool: Pool | undefined;
}

const pool =
  globalThis.feedbackPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? true
        : {
            rejectUnauthorized: false,
          },
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.feedbackPool = pool;
}

async function ensureFeedbackTable() {
  // Create table if it doesn't exist
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

  // Add columns if they don't exist (migration)
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
      return NextResponse.json(
        { error: "Database connection is not configured." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as {
      rating?: number;
      feeling?: string;
      closer?: string;
      message?: string;
      source?: string;
    };

    const rating = Number(body.rating);
    const feeling = typeof body.feeling === "string" ? body.feeling.trim() : "";
    const closer = typeof body.closer === "string" ? body.closer.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const source = typeof body.source === "string" ? body.source : "unknown";

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Please provide a rating between 1 and 5." },
        { status: 400 },
      );
    }

    if (!feeling) {
      return NextResponse.json(
        { error: "Please select how the experience felt." },
        { status: 400 },
      );
    }

    if (!closer) {
      return NextResponse.json(
        { error: "Please select if it brought you closer." },
        { status: 400 },
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: "Message is too long." },
        { status: 400 },
      );
    }

    await ensureFeedbackTable();

    await pool.query(
      "INSERT INTO feedback (rating, feeling, closer, message, source) VALUES ($1, $2, $3, $4, $5)",
      [rating, feeling, closer, message || null, source],
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    console.error("Feedback submission error:", errorMessage, err);

    return NextResponse.json(
      {
        error: "Unable to process feedback.",
        ...(process.env.NODE_ENV === "development" && { detail: errorMessage }),
      },
      { status: 500 },
    );
  }
}
