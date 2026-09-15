import { readSession, isAdmin, json } from '../../../_lib/auth.js';
import { slugifyCategory, sniffImageType, extForType, mapRow, MAX_IMAGE_BYTES, MAX_THUMB_BYTES } from '../../../_lib/gallery.js';

async function requireAdmin(request, env) {
  const user = await readSession(request, env);
  if (!isAdmin(env, user)) return { error: json({ error: 'Staff access required.' }, 403) };
  return { user };
}

async function readOptionalImagePart(form, field, maxBytes) {
  const file = form.get(field);
  if (!file || typeof file === 'string' || file.size === 0) return null;
  if (file.size > maxBytes) return { error: `${field} is too large (max ${Math.round(maxBytes / 1024 / 1024)}MB)` };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffImageType(bytes);
  if (!type) return { error: `${field} must be a JPEG, PNG, or WebP image` };
  return { bytes, type };
}

export async function onRequestPost({ request, env, params }) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  if (!env.DB) return json({ error: 'Database not configured' }, 503);

  const existing = await env.DB.prepare('SELECT * FROM gallery_images WHERE id = ?').bind(params.id).first();
  if (!existing) return json({ error: 'Image not found' }, 404);

  let form;
  try { form = await request.formData(); } catch { return json({ error: 'Invalid request' }, 400); }

  const title = String(form.get('title') ?? existing.title).trim().slice(0, 140) || existing.title;
  const description = String(form.get('description') ?? existing.description ?? '').trim().slice(0, 2000);
  const category = form.has('category') ? slugifyCategory(form.get('category')) : existing.category;
  const featured = form.has('featured') ? (['1', 'true', 'on'].includes(String(form.get('featured')).toLowerCase()) ? 1 : 0) : existing.featured;
  const published = form.has('published') ? (['1', 'true', 'on'].includes(String(form.get('published')).toLowerCase()) ? 1 : 0) : existing.published;

  let imageKey = existing.image_key;
  let thumbKey = existing.thumb_key;
  let width = existing.width;
  let height = existing.height;
  const oldKeysToDelete = [];

  if (env.GALLERY_BUCKET) {
    const image = await readOptionalImagePart(form, 'image', MAX_IMAGE_BYTES);
    if (image && image.error) return json({ error: image.error }, 400);
    const thumb = await readOptionalImagePart(form, 'thumb', MAX_THUMB_BYTES);
    if (thumb && thumb.error) return json({ error: thumb.error }, 400);

    if (image) {
      const newKey = `${existing.id}-${Date.now()}.${extForType(image.type)}`;
      await env.GALLERY_BUCKET.put(newKey, image.bytes, { httpMetadata: { contentType: image.type } });
      oldKeysToDelete.push(imageKey);
      imageKey = newKey;
      width = parseInt(form.get('width'), 10) || width;
      height = parseInt(form.get('height'), 10) || height;
    }
    if (thumb) {
      const newKey = `${existing.id}-${Date.now()}-thumb.${extForType(thumb.type)}`;
      await env.GALLERY_BUCKET.put(newKey, thumb.bytes, { httpMetadata: { contentType: thumb.type } });
      oldKeysToDelete.push(thumbKey);
      thumbKey = newKey;
    }
  }

  const now = new Date().toISOString();
  await env.DB.prepare(
    `UPDATE gallery_images SET title=?,description=?,category=?,image_key=?,thumb_key=?,width=?,height=?,featured=?,published=?,updated_at=? WHERE id=?`
  ).bind(title, description, category, imageKey, thumbKey, width, height, featured, published, now, existing.id).run();

  if (oldKeysToDelete.length && env.GALLERY_BUCKET) {
    await Promise.all(oldKeysToDelete.map((k) => env.GALLERY_BUCKET.delete(k).catch(() => {})));
  }

  const row = await env.DB.prepare('SELECT * FROM gallery_images WHERE id = ?').bind(existing.id).first();
  return json({ image: mapRow(row) });
}

export async function onRequestDelete({ request, env, params }) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  if (!env.DB) return json({ error: 'Database not configured' }, 503);

  const existing = await env.DB.prepare('SELECT * FROM gallery_images WHERE id = ?').bind(params.id).first();
  if (!existing) return json({ error: 'Image not found' }, 404);

  await env.DB.prepare('DELETE FROM gallery_images WHERE id = ?').bind(params.id).run();

  if (env.GALLERY_BUCKET) {
    await Promise.all([
      env.GALLERY_BUCKET.delete(existing.image_key).catch(() => {}),
      env.GALLERY_BUCKET.delete(existing.thumb_key).catch(() => {})
    ]);
  }

  return json({ ok: true, deleted: true });
}
