CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name  VARCHAR(100),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS canvas_nodes (
  id          VARCHAR(100) PRIMARY KEY,
  position_x  FLOAT NOT NULL DEFAULT 0,
  position_y  FLOAT NOT NULL DEFAULT 0,
  width       FLOAT,
  height      FLOAT,
  label       TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_by  INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS canvas_edges (
  id          VARCHAR(100) PRIMARY KEY,
  source_id   VARCHAR(100) NOT NULL REFERENCES canvas_nodes(id) ON DELETE CASCADE,
  target_id   VARCHAR(100) NOT NULL REFERENCES canvas_nodes(id) ON DELETE CASCADE,
  label       TEXT,
  animated    BOOLEAN DEFAULT FALSE,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_by  INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notes (
  id          SERIAL PRIMARY KEY,
  panel_key   VARCHAR(30) NOT NULL UNIQUE,
  content     TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_by  INTEGER REFERENCES users(id)
);

INSERT INTO notes (panel_key, content)
VALUES ('biz_dev', ''), ('project_mgmt', ''), ('financials', '')
ON CONFLICT (panel_key) DO NOTHING;
