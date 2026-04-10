import { pool } from "@/lib/db";

let _ensured = false;

export async function ensureSyncTables() {
  if (_ensured) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sync_sessions (
      id BIGSERIAL PRIMARY KEY,
      code VARCHAR(8) UNIQUE NOT NULL,
      type VARCHAR(20) NOT NULL,
      week_key VARCHAR(20),
      status VARCHAR(20) NOT NULL DEFAULT 'waiting',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '48 hours')
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sync_responses (
      id BIGSERIAL PRIMARY KEY,
      session_id BIGINT NOT NULL REFERENCES sync_sessions(id) ON DELETE CASCADE,
      partner VARCHAR(1) NOT NULL,
      name VARCHAR(100) NOT NULL DEFAULT '',
      responses JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(session_id, partner)
    );
  `);

  // Index for fast code lookup
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_sync_sessions_code ON sync_sessions(code);
  `);

  _ensured = true;
}

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1 for readability

export function generateCode(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => CHARS[b % CHARS.length])
    .join("");
}
