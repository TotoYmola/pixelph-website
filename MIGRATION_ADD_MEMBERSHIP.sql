CREATE TABLE IF NOT EXISTS membership_entitlements (
  id TEXT PRIMARY KEY,
  discord_id TEXT NOT NULL,
  package_key TEXT NOT NULL CHECK(package_key IN (
    'city_priority','prime_access','business_patron','signature_look','signature_vehicle','signature_ped'
  )),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','cancelled','expired')),
  starts_at TEXT,
  expires_at TEXT,
  metadata_json TEXT,
  granted_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_membership_discord
ON membership_entitlements(discord_id, status, expires_at);

CREATE INDEX IF NOT EXISTS idx_membership_package
ON membership_entitlements(package_key, status, expires_at);
