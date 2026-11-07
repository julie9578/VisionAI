ALTER TABLE posts ADD COLUMN author_id INTEGER REFERENCES users(id);

CREATE TABLE IF NOT EXISTS post_interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('comment', 'like', 'bookmark')),
  content TEXT CHECK (content IS NULL OR length(content) BETWEEN 1 AND 2000),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_post_interactions_post_type_created
  ON post_interactions(post_id, interaction_type, created_at);
CREATE INDEX IF NOT EXISTS idx_post_interactions_user_type
  ON post_interactions(user_id, interaction_type);
CREATE UNIQUE INDEX IF NOT EXISTS idx_post_interactions_unique_reactions
  ON post_interactions(post_id, user_id, interaction_type)
  WHERE interaction_type IN ('like', 'bookmark');