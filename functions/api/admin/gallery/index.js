import { readSession, isAdmin, json } from '../../../_lib/auth.js';
import { slugifyCategory, sniffImageType, extForType, mapRow, MAX_IMAGE_BYTES, MAX_THUMB_BYTES } from '../../../_lib/gallery.js';

async function requireAdmin(request, env) {
  const user = await readSession(request, env);
  if (!isAdmin(env, user)) return { error: json({ error: 'Staff access required.' }, 403) };
  return { user };
}

export async function onRequestGet({ request, env }) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  if (!env.DB) return json({ error: 'Database not configured' }, 503);

  const r = await env.DB.prepare('SELECT * FROM gallery_images ORDER BY display_order ASC, created_at DESC').all();
  return json({ images: (r.results || []).map(mapRow) });
}

async function readImagePart(form, field, maxBytes) {
  const file = form.get(field);
  if (!file || typeof file === 'string') return { error: `${field} file is required` };
  if (file.size > maxBytes) return { error: `${field} is too large (max ${Math.round(maxBytes / 1024 / 1024)}MB)` };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffImageType(bytes);
  if (!type) return { error: `${field} must be a JPEG, PNG, or WebP image` };
  return { bytes, type };
}

export async function onRequestPost({ request, env }) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  if (!env.DB) return json({ error: 'Database not configured' }, 503);
  if (!env.GALLERY_BUCKET) return json({ error: 'Gallery storage is not configured. Bind an R2 bucket named GALLERY_BUCKET to this Pages project.' }, 503);

  let form;
  try { form = await request.formData(); } catch { return json({ error: 'Invalid upload' }, 400); }

  const title = String(form.get('title') || '').trim().slice(0, 140);
  if (!title) return json({ error: 'Title is required' }, 400);
  const description = String(form.get('description') || '').trim().slice(0, 2000);
  const category = slugifyCategory(form.get('category'));
  const featured = ['1', 'true', 'on'].includes(String(form.get('featured') || '').toLowerCase()) ? 1 : 0;
  const published = ['0', 'false', 'off'].includes(String(form.get('published') || '1').toLowerCase()) ? 0 : 1;
  const width = parseInt(form.get('width'), 10) || null;
  const height = parseInt(form.get('height'), 10) || null;

  const image = await readImagePart(form, 'image', MAX_IMAGE_BYTES);
  if (image.error) return json({ error: image.error }, 400);
  const thumb = await readImagePart(form, 'thumb', MAX_THUMB_BYTES);
  if (thumb.error) return json({ error: thumb.error }, 400);

  const id = crypto.randomUUID();
  const imageKey = `${id}.${extForType(image.type)}`;
  const thumbKey = `${id}-thumb.${extForType(thumb.type)}`;

  await Promise.all([
    env.GALLERY_BUCKET.put(imageKey, image.bytes, { httpMetadata: { contentType: image.type } }),
    env.GALLERY_BUCKET.put(thumbKey, thumb.bytes, { httpMetadata: { contentType: thumb.type } })
  ]);

  try {
    const next = await env.DB.prepare('SELECT COALESCE(MAX(display_order),-1)+1 AS n FROM gallery_images').first();
    const now = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO gallery_images (id,title,description,category,image_key,thumb_key,width,height,featured,published,display_order,created_by,created_at,updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(id, title, description, category, imageKey, thumbKey, width, height, featured, published, next.n, auth.user.id, now, now).run();

    const row = await env.DB.prepare('SELECT * FROM gallery_images WHERE id = ?').bind(id).first();
    return json({ image: mapRow(row) }, 201);
  } catch (e) {
    await Promise.all([
      env.GALLERY_BUCKET.delete(imageKey).catch(() => {}),
      env.GALLERY_BUCKET.delete(thumbKey).catch(() => {})
    ]);
    return json({ error: 'Failed to save gallery image' }, 500);
  }
}
