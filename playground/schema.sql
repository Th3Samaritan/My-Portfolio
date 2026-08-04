CREATE TABLE IF NOT EXISTS gym_users (
  username       TEXT PRIMARY KEY,
  joined_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  iv             TEXT NOT NULL,
  encrypted      TEXT NOT NULL,
  password_hash  TEXT NOT NULL DEFAULT '',
  admin_recovery TEXT DEFAULT NULL,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
