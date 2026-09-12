(() => {
  const nav = document.querySelector('.v2-nav');
  const progress = document.getElementById('pixelphScrollProgress');
  const scrollMark = document.querySelector('.scroll-mark');
  const hero = document.querySelector('.v2-hero');
  const heroLogo = document.querySelector('.hero-logo');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateScrollUI = () => {
    const y = window.scrollY || 0;
    nav?.classList.toggle('nav-scrolled', y > 18);
    scrollMark?.classList.toggle('is-hidden', y > 80);
    if (progress) {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.style.width = `${Math.min(100, (y / max) * 100)}%`;
    }
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) requestAnimationFrame(() => { updateScrollUI(); ticking = false; });
    ticking = true;
  }, { passive: true });
  updateScrollUI();

  if (!reduceMotion && hero && heroLogo && window.matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      heroLogo.style.transform = `translate3d(${x * 5}px,${y * 4}px,0)`;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { heroLogo.style.transform = ''; });
  }

  document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', () => {
    document.getElementById('mobileMenu')?.classList.add('hidden');
  }));
})();
