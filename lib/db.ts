import { Pool } from "pg";

declare global {
  var _pool: Pool | undefined;
}

export const pool =
  globalThis._pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("sslmode=")
      ? { rejectUnauthorized: false }
      : false,
  });

// Allow self-signed certs from managed Postgres providers (Aiven, etc.)
process.env.NODE_TLS_REJECT_UNAUTHORIZED ??= "0";

if (process.env.NODE_ENV !== "production") {
  globalThis._pool = pool;
}
