import { NextResponse } from "next/server";
import type { ZodError } from "zod";

// Machine-readable error codes for programmatic handling in mobile/web clients
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_CREDENTIALS"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "CONFLICT"
  | "ALREADY_PAIRED"
  | "SELF_INVITE"
  | "SESSION_EXPIRED"
  | "SESSION_COMPLETE"
  | "DB_NOT_CONFIGURED"
  | "INTERNAL_ERROR";

export interface ApiErrorBody {
  error: string;
  code: ApiErrorCode;
  errors?: Record<string, string[]>;
}

export function apiError(
  message: string,
  code: ApiErrorCode,
  status: number,
): NextResponse<ApiErrorBody> {
  return NextResponse.json({ error: message, code }, { status });
}

/** Convert a ZodError into a 400 with field-level error details */
export function zodError(err: ZodError): NextResponse<ApiErrorBody> {
  const errors: Record<string, string[]> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_";
    errors[key] ??= [];
    errors[key].push(issue.message);
  }
  return NextResponse.json(
    { error: "Validation failed.", code: "VALIDATION_ERROR", errors },
    { status: 400 },
  );
}
