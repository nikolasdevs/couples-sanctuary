import { Pool } from "pg";

// Must be set before any TLS connection is made (Aiven uses self-signed certs)
if (!process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

declare global {
  var _pool: Pool | undefined;
}

function buildConnectionString() {
  let url = process.env.DATABASE_URL ?? "";
  // pg v8.x treats sslmode=require as verify-full; switch to no-verify
  // so self-signed certs from managed providers (Aiven, etc.) are accepted.
  url = url.replace(/sslmode=require\b/, "sslmode=no-verify");
  return url;
}

export const pool =
  globalThis._pool ??
  new Pool({
    connectionString: buildConnectionString(),
    ssl: process.env.DATABASE_URL?.includes("sslmode=")
      ? { rejectUnauthorized: false }
      : false,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis._pool = pool;
}
