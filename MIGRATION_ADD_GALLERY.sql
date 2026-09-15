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

CREATE INDEX IF NOT EXISTS idx_gallery_published
ON gallery_images(published, display_order, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gallery_featured
ON gallery_images(featured, published, display_order);

CREATE INDEX IF NOT EXISTS idx_gallery_category
ON gallery_images(category, published, display_order);
