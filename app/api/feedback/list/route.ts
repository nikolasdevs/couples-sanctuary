import { NextResponse } from "next/server";
import { Pool } from "pg";

declare global {
  var feedbackPool: Pool | undefined;
}

const pool =
  globalThis.feedbackPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.feedbackPool = pool;
}

export async function GET(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database connection is not configured." },
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const rating = searchParams.get("rating");
    const feeling = searchParams.get("feeling");
    const closer = searchParams.get("closer");

    let query =
      "SELECT id, rating, feeling, closer, message, source, created_at FROM feedback";
    const params: (string | number)[] = [];
    const conditions: string[] = [];

    if (rating && rating !== "all") {
      conditions.push(`rating = $${params.length + 1}`);
      params.push(Number(rating));
    }

    if (feeling && feeling !== "all") {
      conditions.push(`feeling = $${params.length + 1}`);
      params.push(feeling);
    }

    if (closer && closer !== "all") {
      conditions.push(`closer = $${params.length + 1}`);
      params.push(closer);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);

    const statsResult = await pool.query(
      "SELECT COUNT(*) as total, AVG(rating) as avg_rating FROM feedback",
    );

    const stats = statsResult.rows[0] as {
      total: string;
      avg_rating: string | null;
    };

    return NextResponse.json({
      feedbacks: result.rows,
      stats: {
        total: parseInt(stats.total, 10),
        avgRating: stats.avg_rating ? parseFloat(stats.avg_rating) : 0,
      },
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    console.error("Feedback list error:", errorMessage, err);

    return NextResponse.json(
      {
        error: "Unable to fetch feedback.",
        ...(process.env.NODE_ENV === "development" && { detail: errorMessage }),
      },
      { status: 500 },
    );
  }
}
