import { json } from '../_lib/auth.js';

export async function onRequestGet({ request, env }) {
  if (!env.FIVEM_API_KEY) return json({ error: 'API not configured' }, 503);

  const auth = request.headers.get('authorization') || '';
  if (auth !== `Bearer ${env.FIVEM_API_KEY}`) return json({ error: 'Unauthorized' }, 401);

  if (!env.DB) return json({ error: 'Database not configured' }, 503);

  const url = new URL(request.url);
  const discordId = (url.searchParams.get('discord_id') || '').trim();
  if (!/^\d{15,25}$/.test(discordId)) {
    return json({ error: 'Missing or invalid discord_id' }, 400);
  }

  const app = await env.DB.prepare(
    "SELECT status, character_name, review_reason, updated_at FROM applications WHERE discord_id=? ORDER BY created_at DESC LIMIT 1"
  ).bind(discordId).first();

  return json({
    ok: true,
    discord_id: discordId,
    approved: app?.status === 'approved',
    status: app?.status || 'none',
    character_name: app?.character_name || null,
    review_reason: app?.review_reason || null,
    updated_at: app?.updated_at || null,
  });
}
