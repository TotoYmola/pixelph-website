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
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected','revoked')),
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

CREATE TABLE IF NOT EXISTS membership_entitlements (
  id TEXT PRIMARY KEY,
  discord_id TEXT NOT NULL,
  package_key TEXT NOT NULL CHECK(package_key IN ('city_priority','prime_access','business_patron','signature_look','signature_vehicle','signature_ped')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','cancelled','expired')),
  starts_at TEXT,
  expires_at TEXT,
  metadata_json TEXT,
  granted_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_membership_discord ON membership_entitlements(discord_id,status,expires_at);
CREATE INDEX IF NOT EXISTS idx_membership_package ON membership_entitlements(package_key,status,expires_at);

CREATE TABLE IF NOT EXISTS gallery_images (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'city',
  image_key TEXT NOT NULL,
  thumb_key TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  featured INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_gallery_published ON gallery_images(published,display_order,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_featured ON gallery_images(featured,published,display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_images(category,published,display_order);
