import { pool } from "@/lib/db";

// Promise-based guard: concurrent cold-start requests share one setup promise
// instead of all firing duplicate queries. If setup fails, the promise is
// cleared so the next request can retry.
let _ensurePromise: Promise<void> | null = null;

export function ensureAuthTables(): Promise<void> {
  if (!_ensurePromise) {
    _ensurePromise = _doEnsure().catch((err) => {
      _ensurePromise = null;
      throw err;
    });
  }
  return _ensurePromise;
}

async function _doEnsure(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS couples (
      id BIGSERIAL PRIMARY KEY,
      user_a_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      user_b_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
      invite_code VARCHAR(8) UNIQUE,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_couples_invite ON couples(invite_code);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_couples_users
      ON couples(user_a_id, user_b_id);
  `);
}

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateInviteCode(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => CHARS[b % CHARS.length])
    .join("");
}
