/* PixelPH — gallery shared helpers (server-side).
   Categories are free-text slugs on purpose: adding a new one is just typing
   it in the Gallery Manager, no code or migration required. This map only
   supplies a nicer display label for the categories PixelPH expects; any
   other slug still works and falls back to a title-cased version of itself. */
const CATEGORY_LABELS = {
  city: 'City',
  businesses: 'Businesses',
  police: 'Police',
  ems: 'EMS',
  vehicles: 'Vehicles',
  housing: 'Housing',
  jobs: 'Jobs',
  events: 'Events',
  nightlife: 'Nightlife',
  community: 'Community'
};

export function slugifyCategory(value) {
  const s = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return s || 'city';
}

export function categoryLabel(slug) {
  if (CATEGORY_LABELS[slug]) return CATEGORY_LABELS[slug];
  return String(slug || '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'City';
}

/* Real image formats only, verified by magic bytes — never trust a client
   Content-Type header on its own. */
export function sniffImageType(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return 'image/webp';
  return null;
}

export function extForType(type) {
  return type === 'image/png' ? 'png' : type === 'image/jpeg' ? 'jpg' : 'webp';
}

export function mapRow(r) {
  return {
    id: r.id,
    title: r.title,
    description: r.description || '',
    category: r.category,
    categoryLabel: categoryLabel(r.category),
    image: `/gallery-media/${r.image_key}`,
    thumb: `/gallery-media/${r.thumb_key}`,
    width: r.width || null,
    height: r.height || null,
    featured: !!r.featured,
    published: !!r.published,
    order: r.display_order,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

export const MAX_IMAGE_BYTES = 7 * 1024 * 1024;
export const MAX_THUMB_BYTES = 2 * 1024 * 1024;
