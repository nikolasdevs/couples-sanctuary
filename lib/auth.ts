import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "sanctuary_token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");
  return new TextEncoder().encode(secret);
}

export interface AuthPayload {
  userId: number;
  email: string;
}

/** Create a signed JWT */
export async function signToken(payload: AuthPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_MAX_AGE}s`)
    .sign(getSecret());
}

/** Verify and decode a JWT */
export async function verifyToken(
  token: string,
): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: payload.userId as number,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

/** Set the auth cookie on a Response */
export function setAuthCookie(
  response: Response,
  token: string,
): Response {
  response.headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${TOKEN_MAX_AGE}`,
  );
  return response;
}

/** Clear the auth cookie */
export function clearAuthCookie(response: Response): Response {
  response.headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
  );
  return response;
}

/** Read the current user from the request (for API routes).
 *  Checks Authorization: Bearer header first, then falls back to cookie. */
export async function getAuthUser(
  request: Request,
): Promise<AuthPayload | null> {
  // 1. Check Authorization header (mobile / external clients)
  const authHeader = request.headers.get("authorization") ?? "";
  if (authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.slice(7);
    if (bearerToken) {
      const payload = await verifyToken(bearerToken);
      if (payload) return payload;
    }
  }

  // 2. Fall back to cookie (browser / web app)
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`),
  );
  if (!match) return null;
  return verifyToken(match[1]);
}

/** Read the current user from Next.js cookies() (for server components) */
export async function getServerUser(): Promise<AuthPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
