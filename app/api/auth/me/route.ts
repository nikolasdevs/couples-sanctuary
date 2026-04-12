import { pool } from "@/lib/db";
import { ensureAuthTables } from "@/lib/authDb";
import { getAuthUser } from "@/lib/auth";
import { apiError } from "@/lib/apiError";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return apiError("Not authenticated.", "UNAUTHORIZED", 401);
    }

    await ensureAuthTables();

    const userResult = await pool.query(
      "SELECT id, email, name, created_at FROM users WHERE id = $1",
      [auth.userId],
    );

    if (userResult.rows.length === 0) {
      return apiError("User not found.", "NOT_FOUND", 404);
    }

    const user = userResult.rows[0];

    const coupleResult = await pool.query(
      `SELECT c.id, c.invite_code, c.status,
              c.user_a_id, c.user_b_id,
              pa.name AS partner_a_name, pb.name AS partner_b_name
       FROM couples c
       LEFT JOIN users pa ON pa.id = c.user_a_id
       LEFT JOIN users pb ON pb.id = c.user_b_id
       WHERE c.user_a_id = $1 OR c.user_b_id = $1
       ORDER BY c.created_at DESC LIMIT 1`,
      [auth.userId],
    );

    const couple = coupleResult.rows[0] ?? null;

    let partnerName: string | null = null;
    if (couple && couple.status === "active") {
      partnerName =
        couple.user_a_id === auth.userId
          ? couple.partner_b_name
          : couple.partner_a_name;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at,
      },
      couple: couple
        ? {
            id: couple.id,
            status: couple.status,
            inviteCode: couple.status === "pending" ? couple.invite_code : null,
            partnerName,
          }
        : null,
    });
  } catch (err) {
    console.error("Auth me error:", err);
    return apiError("Unable to fetch user.", "INTERNAL_ERROR", 500);
  }
}
