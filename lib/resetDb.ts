import { pool } from "@/lib/db";

let _ensurePromise: Promise<void> | null = null;

export function ensureResetTable(): Promise<void> {
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
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash VARCHAR(64) NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 hour'),
      used BOOLEAN NOT NULL DEFAULT FALSE
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_reset_tokens_hash
      ON password_reset_tokens(token_hash);
  `);
}
