import { readSession, isAdmin, json } from '../../../_lib/auth.js';

export async function onRequestPost({ request, env }) {
  const user = await readSession(request, env);
  if (!isAdmin(env, user)) return json({ error: 'Staff access required.' }, 403);
  if (!env.DB) return json({ error: 'Database not configured' }, 503);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request' }, 400); }
  const order = Array.isArray(body?.order) ? body.order : null;
  if (!order || !order.length) return json({ error: 'order array is required' }, 400);

  const now = new Date().toISOString();
  const stmts = order
    .filter((x) => x && typeof x.id === 'string' && Number.isFinite(x.order))
    .map((x) => env.DB.prepare('UPDATE gallery_images SET display_order = ?, updated_at = ? WHERE id = ?').bind(x.order, now, x.id));

  if (!stmts.length) return json({ error: 'No valid entries in order array' }, 400);
  await env.DB.batch(stmts);

  return json({ ok: true, updated: stmts.length });
}
