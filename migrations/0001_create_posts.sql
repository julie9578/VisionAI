CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL CHECK (category IN ('free', 'recommend', 'guide', 'recruit', 'notice')),
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 160),
  content TEXT NOT NULL CHECK (length(content) BETWEEN 1 AND 10000),
  author TEXT NOT NULL CHECK (length(author) BETWEEN 1 AND 40),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category_created_at ON posts(category, created_at DESC);