console.info('PixelPH Gallery Manager v1');
const $ = (id) => document.getElementById(id);
const msg = $('galleryAdminMessage');
const dash = $('galleryAdminDashboard');
const grid = $('gaGrid');
const empty = $('gaEmpty');
const filterSel = $('gaFilter');
const catOptions = $('gaCategoryOptions');
const editPanel = $('gaEditPanel');
const editBackdrop = $('gaEditBackdrop');

let images = [];
let selectedFiles = []; // [{id, file, title, previewUrl}]
let activeFilter = 'all';

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
function fmtDate(v) {
  if (!v) return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? esc(v) : d.toLocaleString();
}

/* ------------------------------------------------------- image resizing --- */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not read image'));
    img.src = URL.createObjectURL(file);
  });
}

async function resizeToBlob(file, maxDim, quality) {
  const img = await loadImage(file);
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;
  if (width > maxDim || height > maxDim) {
    if (width >= height) {
      height = Math.round(height * (maxDim / width));
      width = maxDim;
    } else {
      width = Math.round(width * (maxDim / height));
      height = maxDim;
    }
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(img, 0, 0, width, height);
  URL.revokeObjectURL(img.src);

  const webp = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
  if (webp) return { blob: webp, width, height, ext: 'webp' };
  const jpeg = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
  return { blob: jpeg, width, height, ext: 'jpg' };
}

/* --------------------------------------------------------------- access --- */
async function loadAccess() {
  msg.className = 'notice';
  msg.textContent = 'Checking staff access…';
  try {
    const r = await fetch('/api/admin/gallery', { headers: { accept: 'application/json' }, cache: 'no-store' });
    let j = {};
    try { j = await r.json(); } catch {}
    if (!r.ok) throw new Error(j.error || (r.status === 403 ? 'Staff access required. Make sure this Discord account is listed in ADMIN_DISCORD_IDS.' : 'Unable to load gallery.'));
    images = j.images || [];
    msg.classList.add('hidden');
    dash.classList.remove('hidden');
    renderFilters();
    renderGrid();
  } catch (e) {
    msg.className = 'notice danger admin-access-error';
    msg.innerHTML = `<strong>Gallery Manager unavailable.</strong><br>${esc(e.message)}<div class="hero-actions" style="margin-top:14px"><a class="primary-btn" href="/api/auth/login?admin=1">Staff Discord Login</a><a class="ghost-btn" href="/">Back to Website</a></div>`;
  }
}

/* ---------------------------------------------------------- file picker --- */
$('gaFiles').addEventListener('change', (e) => {
  const files = Array.from(e.target.files || []);
  selectedFiles = files.map((file, i) => ({
    id: `f${Date.now()}_${i}`,
    file,
    title: file.name.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim() || 'PixelPH screenshot',
    previewUrl: URL.createObjectURL(file),
    status: 'pending'
  }));
  renderFileList();
});

function renderFileList() {
  const list = $('gaFileList');
  $('gaUploadBtn').disabled = selectedFiles.length === 0;
  if (!selectedFiles.length) { list.innerHTML = ''; return; }
  list.innerHTML = selectedFiles
    .map(
      (f) => `
    <div class="gallery-admin-file" data-file="${esc(f.id)}">
      <img src="${esc(f.previewUrl)}" alt="">
      <input type="text" class="ga-file-title" data-file-title="${esc(f.id)}" value="${esc(f.title)}" maxlength="140">
      <span class="ga-file-status" data-file-status="${esc(f.id)}">${f.status === 'pending' ? '' : f.status}</span>
      <button type="button" class="ga-file-remove" data-file-remove="${esc(f.id)}" aria-label="Remove"><i class="fas fa-xmark"></i></button>
    </div>`
    )
    .join('');
  list.querySelectorAll('[data-file-title]').forEach((el) =>
    el.addEventListener('input', () => {
      const item = selectedFiles.find((x) => x.id === el.dataset.fileTitle);
      if (item) item.title = el.value;
    })
  );
  list.querySelectorAll('[data-file-remove]').forEach((el) =>
    el.addEventListener('click', () => {
      selectedFiles = selectedFiles.filter((x) => x.id !== el.dataset.fileRemove);
      renderFileList();
    })
  );
}

function setFileStatus(id, text) {
  const el = document.querySelector(`[data-file-status="${CSS.escape(id)}"]`);
  if (el) el.textContent = text;
}

$('gaUploadBtn').addEventListener('click', async () => {
  if (!selectedFiles.length) return;
  const btn = $('gaUploadBtn');
  btn.disabled = true;
  const label = btn.innerHTML;
  const category = String($('gaCategory').value || 'city').trim() || 'city';
  const description = $('gaDescription').value || '';
  const featured = $('gaFeatured').checked;
  const published = $('gaPublished').checked;

  let ok = 0, fail = 0;
  for (const item of selectedFiles) {
    setFileStatus(item.id, 'Uploading…');
    try {
      const full = await resizeToBlob(item.file, 2200, 0.85);
      const thumb = await resizeToBlob(item.file, 640, 0.8);
      const fd = new FormData();
      fd.append('title', item.title || 'PixelPH screenshot');
      fd.append('description', description);
      fd.append('category', category);
      fd.append('featured', featured ? '1' : '0');
      fd.append('published', published ? '1' : '0');
      fd.append('width', String(full.width));
      fd.append('height', String(full.height));
      fd.append('image', full.blob, `image.${full.ext}`);
      fd.append('thumb', thumb.blob, `thumb.${thumb.ext}`);
      const r = await fetch('/api/admin/gallery', { method: 'POST', body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Upload failed');
      setFileStatus(item.id, 'Done');
      ok++;
    } catch (e) {
      setFileStatus(item.id, `Failed: ${e.message}`);
      fail++;
    }
  }

  $('gaUploadStatus').textContent = `Uploaded ${ok} of ${selectedFiles.length} image(s).${fail ? ` ${fail} failed — see status above.` : ''}`;
  btn.disabled = false;
  btn.innerHTML = label;
  if (ok) {
    $('gaFiles').value = '';
    selectedFiles = [];
    renderFileList();
    await loadAccess();
  }
});

/* ------------------------------------------------------------- filters --- */
function renderFilters() {
  const cats = [...new Set(images.map((i) => i.category))].sort();
  const prevFilter = activeFilter;
  filterSel.innerHTML = '<option value="all">All categories</option>' + cats.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
  filterSel.value = cats.includes(prevFilter) ? prevFilter : 'all';
  activeFilter = filterSel.value;
  catOptions.innerHTML = ['city', 'businesses', 'police', 'ems', 'vehicles', 'housing', 'jobs', 'events', 'nightlife', 'community', ...cats]
    .filter((v, i, a) => a.indexOf(v) === i)
    .map((c) => `<option value="${esc(c)}">`)
    .join('');
}
filterSel.addEventListener('change', () => {
  activeFilter = filterSel.value;
  renderGrid();
});

/* ----------------------------------------------------------------- grid --- */
function renderGrid() {
  const list = activeFilter === 'all' ? images : images.filter((i) => i.category === activeFilter);
  empty.classList.toggle('hidden', list.length !== 0);
  grid.classList.toggle('hidden', list.length === 0);
  grid.innerHTML = list
    .map(
      (img) => `
    <div class="gallery-admin-card" data-card="${esc(img.id)}">
      <div class="gallery-admin-card-media"><img src="${esc(img.thumb)}" alt=""></div>
      <div class="gallery-admin-card-body">
        <div class="gallery-admin-card-top">
          <strong>${esc(img.title)}</strong>
          <span class="gallery-admin-card-cat">${esc(img.categoryLabel)}</span>
        </div>
        <div class="gallery-admin-card-flags">
          <button type="button" class="ga-flag ${img.featured ? 'on' : ''}" data-toggle-featured="${esc(img.id)}"><i class="fas fa-star"></i> Featured</button>
          <button type="button" class="ga-flag ${img.published ? 'on' : ''}" data-toggle-published="${esc(img.id)}"><i class="fas fa-eye"></i> Published</button>
        </div>
        <div class="gallery-admin-card-actions">
          <button type="button" class="ghost-btn" data-move-up="${esc(img.id)}" aria-label="Move up"><i class="fas fa-arrow-up"></i></button>
          <button type="button" class="ghost-btn" data-move-down="${esc(img.id)}" aria-label="Move down"><i class="fas fa-arrow-down"></i></button>
          <button type="button" class="ghost-btn" data-edit="${esc(img.id)}">Edit</button>
          <button type="button" class="danger-btn" data-delete="${esc(img.id)}">Delete</button>
        </div>
      </div>
    </div>`
    )
    .join('');

  grid.querySelectorAll('[data-toggle-featured]').forEach((b) => b.addEventListener('click', () => toggleField(b.dataset.toggleFeatured, 'featured')));
  grid.querySelectorAll('[data-toggle-published]').forEach((b) => b.addEventListener('click', () => toggleField(b.dataset.togglePublished, 'published')));
  grid.querySelectorAll('[data-move-up]').forEach((b) => b.addEventListener('click', () => move(b.dataset.moveUp, -1)));
  grid.querySelectorAll('[data-move-down]').forEach((b) => b.addEventListener('click', () => move(b.dataset.moveDown, 1)));
  grid.querySelectorAll('[data-edit]').forEach((b) => b.addEventListener('click', () => openEdit(b.dataset.edit)));
  grid.querySelectorAll('[data-delete]').forEach((b) => b.addEventListener('click', () => deleteImage(b.dataset.delete)));
}

async function quickUpdate(id, fields) {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
  const r = await fetch(`/api/admin/gallery/${encodeURIComponent(id)}`, { method: 'POST', body: fd });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || 'Update failed');
  return j.image;
}

async function toggleField(id, field) {
  const item = images.find((x) => x.id === id);
  if (!item) return;
  try {
    const updated = await quickUpdate(id, { [field]: item[field] ? '0' : '1' });
    Object.assign(item, updated);
    renderGrid();
  } catch (e) {
    alert(e.message);
  }
}

async function move(id, dir) {
  const idx = images.findIndex((x) => x.id === id);
  const swapWith = idx + dir;
  if (idx === -1 || swapWith < 0 || swapWith >= images.length) return;
  [images[idx], images[swapWith]] = [images[swapWith], images[idx]];
  const order = images.map((img, i) => ({ id: img.id, order: i }));
  try {
    await fetch('/api/admin/gallery/reorder', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ order })
    });
    images.forEach((img, i) => { img.order = i; });
    renderGrid();
  } catch (e) {
    alert('Reorder failed: ' + e.message);
  }
}

async function deleteImage(id) {
  const item = images.find((x) => x.id === id);
  if (!item) return;
  if (!confirm(`Delete "${item.title}"? This removes the image permanently.`)) return;
  try {
    const r = await fetch(`/api/admin/gallery/${encodeURIComponent(id)}`, { method: 'DELETE' });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || 'Delete failed');
    images = images.filter((x) => x.id !== id);
    renderFilters();
    renderGrid();
    closeEdit();
  } catch (e) {
    alert(e.message);
  }
}

/* ----------------------------------------------------------------- edit --- */
let editReplacement = null;

function openEdit(id) {
  const img = images.find((x) => x.id === id);
  if (!img) return;
  editReplacement = null;
  editPanel.innerHTML = `
    <div class="review-head">
      <div><div class="section-kicker">EDIT GALLERY IMAGE</div><h2>${esc(img.title)}</h2><p>${esc(img.categoryLabel)} &bull; added ${fmtDate(img.createdAt)}</p></div>
      <button class="drawer-close" type="button" aria-label="Close">&times;</button>
    </div>
    <img src="${esc(img.image)}" alt="" style="width:100%;border-radius:10px;margin:18px 0;border:1px solid var(--line)">
    <div class="field"><label for="geTitle">Title</label><input id="geTitle" value="${esc(img.title)}" maxlength="140"></div>
    <div class="field"><label for="geDescription">Description</label><textarea id="geDescription" placeholder="Optional">${esc(img.description)}</textarea></div>
    <div class="field"><label for="geCategory">Category</label><input id="geCategory" list="gaCategoryOptions" value="${esc(img.category)}"></div>
    <div class="gallery-admin-toggles">
      <label><input type="checkbox" id="geFeatured" ${img.featured ? 'checked' : ''}> Featured</label>
      <label><input type="checkbox" id="gePublished" ${img.published ? 'checked' : ''}> Published</label>
    </div>
    <div class="field"><label for="geReplace">Replace image (optional)</label><input id="geReplace" type="file" accept="image/png,image/jpeg,image/webp"></div>
    <div class="admin-actions review-actions">
      <button class="primary-btn" id="geSave" type="button"><i class="fa-solid fa-check"></i> Save changes</button>
      <button class="danger-btn" id="geDelete" type="button"><i class="fa-solid fa-trash"></i> Delete</button>
    </div>`;
  editPanel.classList.remove('hidden');
  editBackdrop.classList.remove('hidden');
  document.body.classList.add('review-open');
  editPanel.querySelector('.drawer-close').addEventListener('click', closeEdit);
  editBackdrop.addEventListener('click', closeEdit, { once: true });
  $('geReplace').addEventListener('change', (e) => { editReplacement = e.target.files[0] || null; });
  $('geSave').addEventListener('click', () => saveEdit(id));
  $('geDelete').addEventListener('click', () => deleteImage(id));
}

function closeEdit() {
  editPanel.classList.add('hidden');
  editBackdrop.classList.add('hidden');
  document.body.classList.remove('review-open');
  editReplacement = null;
}

async function saveEdit(id) {
  const btn = $('geSave');
  const label = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving…';
  try {
    const fd = new FormData();
    fd.append('title', $('geTitle').value);
    fd.append('description', $('geDescription').value);
    fd.append('category', $('geCategory').value);
    fd.append('featured', $('geFeatured').checked ? '1' : '0');
    fd.append('published', $('gePublished').checked ? '1' : '0');
    if (editReplacement) {
      const full = await resizeToBlob(editReplacement, 2200, 0.85);
      const thumb = await resizeToBlob(editReplacement, 640, 0.8);
      fd.append('width', String(full.width));
      fd.append('height', String(full.height));
      fd.append('image', full.blob, `image.${full.ext}`);
      fd.append('thumb', thumb.blob, `thumb.${thumb.ext}`);
    }
    const r = await fetch(`/api/admin/gallery/${encodeURIComponent(id)}`, { method: 'POST', body: fd });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || 'Update failed');
    const idx = images.findIndex((x) => x.id === id);
    if (idx !== -1) images[idx] = j.image;
    renderFilters();
    renderGrid();
    closeEdit();
  } catch (e) {
    alert(e.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = label;
  }
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeEdit(); });
loadAccess();
