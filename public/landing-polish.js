/* PixelPH — homepage-only polish
   V6: the nav scroll state, progress bar and reveal observer moved into
   script.js so every page shares them. What remains here is specific to the
   landing page: the one orchestrated title-card entrance and a very small
   amount of hero parallax. Both are skipped for prefers-reduced-motion. */

(() => {
  const hero = document.querySelector('.v2-hero');
  if (!hero) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* One orchestrated entrance, run once, driven by CSS. */
  const start = () => document.body.classList.add('hero-ready');
  if (reduceMotion) {
    document.body.classList.add('hero-ready', 'hero-instant');
  } else if (document.readyState === 'complete') {
    requestAnimationFrame(start);
  } else {
    window.addEventListener('load', () => requestAnimationFrame(start), { once: true });
  }

  if (reduceMotion) return;

  /* Hero media drifts slightly slower than the page. Transform only, so it
     stays on the compositor and costs nothing measurable. */
  const media = hero.querySelector('.hero-media');
  if (!media) return;

  let queued = false;
  const update = () => {
    const y = window.scrollY || 0;
    if (y > window.innerHeight * 1.2) return;
    const shift = Math.min(y * 0.14, 90);
    media.style.transform = `translate3d(0,${shift}px,0) scale(${1 + Math.min(y / 9000, 0.035)})`;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        update();
        queued = false;
      });
    },
    { passive: true }
  );
  update();
})();
