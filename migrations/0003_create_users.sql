CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nickname TEXT NOT NULL CHECK (length(nickname) BETWEEN 2 AND 30),
  email TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK (length(email) BETWEEN 3 AND 254),
  gender TEXT NOT NULL CHECK (gender IN ('female', 'male', 'nonbinary', 'prefer_not_to_say')),
  address_ciphertext TEXT NOT NULL,
  address_iv TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  last_login_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);