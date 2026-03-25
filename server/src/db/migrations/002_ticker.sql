CREATE TABLE IF NOT EXISTS activity_log (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  event_type  VARCHAR(50) NOT NULL,
  entity_type VARCHAR(30) NOT NULL,
  entity_id   VARCHAR(100),
  summary     TEXT NOT NULL,
  user_note   TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_occurred ON activity_log (occurred_at DESC);
