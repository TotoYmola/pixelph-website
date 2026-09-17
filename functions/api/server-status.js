import { json } from '../_lib/auth.js';

/* PixelPH — live FiveM server status proxy.
   Public, read-only. Queries our own FXServer's /dynamic.json directly
   (never the FiveM master-list API, and never /players.json — that would
   expose the live player list, which we deliberately never surface here).

   Host/port are configurable via FIVEM_SERVER_HOST / FIVEM_SERVER_PORT
   (Cloudflare Pages -> Settings -> Environment variables). If unset, this
   falls back to the connect address already published on the homepage
   (play.pixelph.com:30120) — confirm that is really the FXServer's direct
   address, not just a marketing string, and override the env vars if not.

   Note: the FXServer's DDoS-protection panel must have a generic TCP
   filter (not an app-aware "FiveM" protocol filter) on this port's TCP
   traffic, or Cloudflare's outbound requests get silently dropped as
   non-player traffic. See CLOUDFLARE_SETUP.md.

   Never throws: any failure (server offline, unreachable, timeout,
   malformed JSON) resolves to a clean { online:false } response so the
   page can never break because the game server is down. */

const DEFAULT_HOST = 'play.pixelph.com';
const DEFAULT_PORT = '30120';
const DEFAULT_MAX_PLAYERS = 100;
const FETCH_TIMEOUT_MS = 4500;
const CACHE_SECONDS = 15;

function offlinePayload() {
  return { online: false, players: 0, maxPlayers: DEFAULT_MAX_PLAYERS };
}

async function queryFxServer(host, port) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const r = await fetch(`http://${host}:${port}/dynamic.json`, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
      cf: { cacheTtl: 0 }
    });
    if (!r.ok) return offlinePayload();

    const d = await r.json();
    const clients = Number(d?.clients);
    const maxClients = Number(d?.sv_maxclients);

    return {
      online: true,
      players: Number.isFinite(clients) ? Math.max(0, Math.floor(clients)) : 0,
      maxPlayers: Number.isFinite(maxClients) && maxClients > 0 ? Math.floor(maxClients) : DEFAULT_MAX_PLAYERS
    };
  } catch {
    return offlinePayload();
  } finally {
    clearTimeout(timer);
  }
}

export async function onRequestGet({ request, env }) {
  try {
    const cache = caches.default;
    const cached = await cache.match(request);
    if (cached) return cached;

    const host = String(env.FIVEM_SERVER_HOST || DEFAULT_HOST).trim();
    const port = String(env.FIVEM_SERVER_PORT || DEFAULT_PORT).trim();

    const data = host && port ? await queryFxServer(host, port) : offlinePayload();

    const response = json(data, 200, { 'cache-control': `public, max-age=${CACHE_SECONDS}` });
    await cache.put(request, response.clone());
    return response;
  } catch {
    return json(offlinePayload(), 200, { 'cache-control': 'public, max-age=5' });
  }
}
