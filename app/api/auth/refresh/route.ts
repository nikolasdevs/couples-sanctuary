import { getAuthUser, signToken, setAuthCookie } from "@/lib/auth";
import { apiError } from "@/lib/apiError";
import { NextResponse } from "next/server";

/**
 * POST /api/auth/refresh
 * Validates the current token (Bearer or cookie) and issues a fresh one with a
 * new 30-day expiry. No body required — the existing token is the credential.
 * Mobile clients should call this before the token expires to stay logged in.
 */
export async function POST(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return apiError("Not authenticated.", "UNAUTHORIZED", 401);
    }

    const token = await signToken({ userId: auth.userId, email: auth.email });

    const response = NextResponse.json({ token });
    return setAuthCookie(response, token);
  } catch (err) {
    console.error("Token refresh error:", err);
    return apiError("Unable to refresh token.", "INTERNAL_ERROR", 500);
  }
}
