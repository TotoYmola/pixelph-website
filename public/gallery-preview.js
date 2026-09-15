/* PixelPH — homepage "Inside the city" featured gallery preview.
   Stays hidden (see [hidden] in pixelph-v6.css) until featured images are
   confirmed to exist, so a fresh install with an empty gallery never shows
   a broken or empty homepage section. */
(function () {
  const section = document.getElementById('galleryPreview');
  const grid = document.getElementById('galleryPreviewGrid');
  if (!section || !grid) return;

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  async function load() {
    try {
      const r = await fetch('/api/gallery?featured=1&limit=6', { headers: { accept: 'application/json' }, cache: 'no-store' });
      const j = await r.json();
      const images = j.images || [];
      if (!images.length) return;

      grid.innerHTML = images
        .map(
          (img, idx) => `
        <a class="gallery-preview-card${idx === 0 ? ' lead' : ''}" href="pages/gallery.html">
          <img src="${esc(img.thumb)}" alt="${esc(img.title)}" loading="lazy" decoding="async">
          <span class="gallery-preview-cap">
            <span class="gallery-preview-cat">${esc(img.categoryLabel)}</span>
            <span>${esc(img.title)}</span>
          </span>
        </a>`
        )
        .join('');
      section.hidden = false;
    } catch {
      /* Leave the section hidden — no broken preview on a failed fetch. */
    }
  }

  load();
})();
