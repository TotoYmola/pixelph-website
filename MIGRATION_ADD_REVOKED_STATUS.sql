-- PixelPH whitelist migration: add 'revoked' to the applications status CHECK.
-- Run ONCE in Cloudflare D1 Console before deploying this build.
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

CREATE TABLE applications_new (
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
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected','revoked')),
  integrity_score INTEGER NOT NULL DEFAULT 0,
  integrity_json TEXT,
  review_reason TEXT,
  reviewed_by TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT INTO applications_new SELECT * FROM applications;
DROP TABLE applications;
ALTER TABLE applications_new RENAME TO applications;
CREATE INDEX IF NOT EXISTS idx_applications_discord ON applications(discord_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status,created_at DESC);
COMMIT;
PRAGMA foreign_keys=ON;
