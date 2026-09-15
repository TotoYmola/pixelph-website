import { json } from '../../_lib/auth.js';
import { mapRow, categoryLabel } from '../../_lib/gallery.js';

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ images: [], categories: [] });

  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const featuredOnly = url.searchParams.get('featured') === '1';
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '', 10) || 200, 1), 200);

  let sql = 'SELECT * FROM gallery_images WHERE published = 1';
  const binds = [];
  if (category && category !== 'all') {
    sql += ' AND category = ?';
    binds.push(category);
  }
  if (featuredOnly) sql += ' AND featured = 1';
  sql += ' ORDER BY display_order ASC, created_at DESC LIMIT ?';
  binds.push(limit);

  const [rowsResult, catResult] = await Promise.all([
    env.DB.prepare(sql).bind(...binds).all(),
    env.DB.prepare('SELECT DISTINCT category FROM gallery_images WHERE published = 1 ORDER BY category ASC').all()
  ]);

  const images = (rowsResult.results || []).map(mapRow);
  const categories = (catResult.results || []).map((x) => ({ slug: x.category, label: categoryLabel(x.category) }));

  return json({ images, categories }, 200, { 'cache-control': 'public, max-age=60' });
}
