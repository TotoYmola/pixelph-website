/* Streams gallery image bytes out of the R2 bucket bound as GALLERY_BUCKET.
   Objects are stored under short, server-generated keys (never a client
   filename), so this route only ever needs the single path segment. */
export async function onRequestGet({ env, params, request }) {
  if (!env.GALLERY_BUCKET) return new Response('Gallery storage not configured', { status: 503 });

  const key = String(params.key || '');
  if (!/^[a-zA-Z0-9_-]+\.(webp|jpg|png)$/.test(key)) return new Response('Not found', { status: 404 });

  const ifNoneMatch = request.headers.get('if-none-match');
  const object = await env.GALLERY_BUCKET.get(key);
  if (!object) return new Response('Not found', { status: 404 });

  const etag = object.httpEtag;
  if (ifNoneMatch && etag && ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers: { etag } });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  if (etag) headers.set('etag', etag);

  return new Response(object.body, { headers });
}
