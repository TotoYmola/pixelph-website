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

   Never throws: any failure (server offline, unreachable, timeout,
   malformed JSON) resolves to a clean { online:false } response so the
   page can never break because the game server is down.

   TEMPORARY DIAGNOSTICS (2026-09-17): append ?debug=1 to get an extra
   "_diag" field describing exactly what happened server-side (host/port
   used, elapsed time, HTTP status if any, and the raw error name/message
   if the fetch threw). Debug requests bypass the edge cache so every call
   is a fresh live attempt. Normal requests (no ?debug=1) are completely
   unaffected — same response shape as before. Remove this block once the
   FiveM connectivity issue is resolved. */

const DEFAULT_HOST = 'play.pixelph.com';
const DEFAULT_PORT = '30120';
const DEFAULT_MAX_PLAYERS = 100;
const FETCH_TIMEOUT_MS = 4500;
const CACHE_SECONDS = 15;

function offlinePayload() {
  return { online: false, players: 0, maxPlayers: DEFAULT_MAX_PLAYERS };
}

/* Debug-only control test: does Cloudflare's network reach this hostname
   at all on a normal, unrestricted port? If this succeeds fast while the
   :30120 request above times out, the failure is specific to that port —
   not general DNS/routing/reachability to the host. */
async function controlProbe(host) {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const r = await fetch(`https://${host}/`, { signal: controller.signal, method: 'HEAD' });
    return { target: `https://${host}/`, elapsedMs: Date.now() - started, outcome: 'reached', httpStatus: r.status };
  } catch (e) {
    return { target: `https://${host}/`, elapsedMs: Date.now() - started, outcome: e?.name === 'AbortError' ? 'timeout' : 'fetch-exception', errorName: e?.name || null, errorMessage: e?.message || String(e) };
  } finally {
    clearTimeout(timer);
  }
}

async function queryFxServer(host, port) {
  const url = `http://${host}:${port}/dynamic.json`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const started = Date.now();
  const diag = { url, startedAt: new Date(started).toISOString() };

  try {
    const r = await fetch(url, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
      cf: { cacheTtl: 0 }
    });
    diag.elapsedMs = Date.now() - started;
    diag.httpStatus = r.status;
    diag.phase = 'fetch-completed';

    if (!r.ok) {
      diag.outcome = 'non-2xx-response';
      return { payload: offlinePayload(), diag };
    }

    const text = await r.text();
    diag.bodyPreview = text.slice(0, 300);

    let d;
    try {
      d = JSON.parse(text);
    } catch (parseErr) {
      diag.outcome = 'json-parse-error';
      diag.errorMessage = String(parseErr?.message || parseErr);
      return { payload: offlinePayload(), diag };
    }

    const clients = Number(d?.clients);
    const maxClients = Number(d?.sv_maxclients);
    diag.outcome = 'success';
    diag.parsedClients = d?.clients;
    diag.parsedMaxClients = d?.sv_maxclients;

    return {
      payload: {
        online: true,
        players: Number.isFinite(clients) ? Math.max(0, Math.floor(clients)) : 0,
        maxPlayers: Number.isFinite(maxClients) && maxClients > 0 ? Math.floor(maxClients) : DEFAULT_MAX_PLAYERS
      },
      diag
    };
  } catch (e) {
    diag.elapsedMs = Date.now() - started;
    diag.phase = 'fetch-threw';
    diag.outcome = e?.name === 'AbortError' ? 'timeout' : 'fetch-exception';
    diag.errorName = e?.name || null;
    diag.errorMessage = e?.message || String(e);
    diag.errorCause = e?.cause ? String(e.cause?.message || e.cause) : null;
    console.error('PixelPH server-status fetch failed', { url, name: diag.errorName, message: diag.errorMessage, cause: diag.errorCause });
    return { payload: offlinePayload(), diag };
  } finally {
    clearTimeout(timer);
  }
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const debug = url.searchParams.get('debug') === '1';

  try {
    const cache = caches.default;
    if (!debug) {
      const cached = await cache.match(request);
      if (cached) return cached;
    }

    const host = String(env.FIVEM_SERVER_HOST || DEFAULT_HOST).trim();
    const port = String(env.FIVEM_SERVER_PORT || DEFAULT_PORT).trim();

    let payload, diag;
    if (host && port) {
      const result = await queryFxServer(host, port);
      payload = result.payload;
      diag = result.diag;
    } else {
      payload = offlinePayload();
      diag = { outcome: 'no-host-or-port-configured', host, port };
    }

    if (debug) {
      const control = await controlProbe(host);
      return json({ ...payload, _diag: { ...diag, envHostSet: Boolean(env.FIVEM_SERVER_HOST), envPortSet: Boolean(env.FIVEM_SERVER_PORT), hostUsed: host, portUsed: port, controlProbe: control } }, 200, { 'cache-control': 'no-store' });
    }

    const response = json(payload, 200, { 'cache-control': `public, max-age=${CACHE_SECONDS}` });
    await cache.put(request, response.clone());
    return response;
  } catch (e) {
    if (debug) {
      return json({ ...offlinePayload(), _diag: { outcome: 'handler-exception', errorMessage: String(e?.message || e) } }, 200, { 'cache-control': 'no-store' });
    }
    return json(offlinePayload(), 200, { 'cache-control': 'public, max-age=5' });
  }
}
