/* PixelPH — public City Gallery page.
   Fetches published gallery images once, filters client-side by category,
   and drives a simple lightbox with keyboard + prev/next support. */
(function () {
  const $ = (id) => document.getElementById(id);
  const grid = $('galleryGrid');
  const loading = $('galleryLoading');
  const empty = $('galleryEmpty');
  const catsWrap = $('galleryCategories');
  const lb = $('galleryLightbox');
  const lbImg = $('galleryLbImage');
  const lbTitle = $('galleryLbTitle');
  const lbDesc = $('galleryLbDesc');
  const lbCat = $('galleryLbCategory');
  if (!grid) return;

  let images = [];
  let filtered = [];
  let activeCat = 'all';
  let activeIndex = -1;

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function renderCategories(categories) {
    const extra = categories
      .map((c) => `<button class="gallery-cat" data-cat="${esc(c.slug)}" type="button">${esc(c.label)}</button>`)
      .join('');
    catsWrap.insertAdjacentHTML('beforeend', extra);
    catsWrap.querySelectorAll('.gallery-cat').forEach((btn) =>
      btn.addEventListener('click', () => {
        catsWrap.querySelectorAll('.gallery-cat').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeCat = btn.dataset.cat;
        render();
      })
    );
  }

  function render() {
    filtered = activeCat === 'all' ? images : images.filter((i) => i.category === activeCat);
    grid.innerHTML = filtered
      .map(
        (img, idx) => `
      <button class="gallery-card${img.featured ? ' featured' : ''}" type="button" data-idx="${idx}">
        <span class="gallery-card-media">
          <img src="${esc(img.thumb)}" alt="${esc(img.title)}" loading="lazy" decoding="async">
        </span>
        <span class="gallery-card-meta">
          <span class="gallery-card-cat">${esc(img.categoryLabel)}</span>
          <span class="gallery-card-title">${esc(img.title)}</span>
        </span>
        ${img.featured ? '<span class="gallery-badge"><i class="fas fa-star" aria-hidden="true"></i> Featured</span>' : ''}
      </button>`
      )
      .join('');
    grid.querySelectorAll('[data-idx]').forEach((b) => b.addEventListener('click', () => openLightbox(parseInt(b.dataset.idx, 10))));
    empty.classList.toggle('hidden', filtered.length !== 0);
    grid.classList.toggle('hidden', filtered.length === 0);
  }

  function openLightbox(idx) {
    if (idx < 0 || idx >= filtered.length) return;
    activeIndex = idx;
    const img = filtered[idx];
    lbImg.src = img.image;
    lbImg.alt = img.title;
    lbTitle.textContent = img.title;
    lbDesc.textContent = img.description || '';
    lbDesc.classList.toggle('hidden', !img.description);
    lbCat.textContent = img.categoryLabel;
    lb.classList.remove('hidden');
    document.body.classList.add('gallery-lb-open');
  }

  function closeLightbox() {
    lb.classList.add('hidden');
    document.body.classList.remove('gallery-lb-open');
    activeIndex = -1;
  }

  function step(delta) {
    if (activeIndex === -1 || !filtered.length) return;
    const next = (activeIndex + delta + filtered.length) % filtered.length;
    openLightbox(next);
  }

  lb?.querySelector('.gallery-lb-close')?.addEventListener('click', closeLightbox);
  lb?.querySelector('.gallery-lb-prev')?.addEventListener('click', () => step(-1));
  lb?.querySelector('.gallery-lb-next')?.addEventListener('click', () => step(1));
  lb?.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (lb?.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });

  async function load() {
    try {
      const r = await fetch('/api/gallery', { headers: { accept: 'application/json' }, cache: 'no-store' });
      const j = await r.json();
      images = j.images || [];
      loading.classList.add('hidden');
      if (!images.length) {
        empty.classList.remove('hidden');
        return;
      }
      renderCategories(j.categories || []);
      grid.classList.remove('hidden');
      render();
    } catch {
      loading.classList.add('hidden');
      empty.classList.remove('hidden');
    }
  }

  load();
})();
