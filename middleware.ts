import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Restrict allowed origins via env var for production.
// For native mobile clients, CORS doesn't apply — they are exempt by browsers.
// Set ALLOWED_ORIGINS="https://your-domain.com,https://staging.your-domain.com"
// Leave unset (or "*") during development to allow all web origins.
const rawOrigins = process.env.ALLOWED_ORIGINS;
const allowedOrigins = rawOrigins
  ? new Set(rawOrigins.split(",").map((o) => o.trim()))
  : null; // null = wildcard (dev only)

function corsHeaders(origin: string | null): Record<string, string> {
  let allowOrigin = "*";

  if (allowedOrigins && origin) {
    allowOrigin = allowedOrigins.has(origin) ? origin : allowedOrigins.values().next().value ?? "*";
  }

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    ...(allowOrigin !== "*" && { "Vary": "Origin" }),
  };
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers });
  }

  const response = NextResponse.next();
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
