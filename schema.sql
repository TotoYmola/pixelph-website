CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  discord_id TEXT NOT NULL,
  discord_username TEXT NOT NULL,
  character_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  rp_experience TEXT NOT NULL,
  character_concept TEXT NOT NULL,
  scenario_conflict TEXT NOT NULL,
  scenario_meta TEXT NOT NULL,
  why_pixelph TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
  integrity_score INTEGER NOT NULL DEFAULT 0,
  integrity_json TEXT,
  review_reason TEXT,
  reviewed_by TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_applications_discord ON applications(discord_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status,created_at DESC);
