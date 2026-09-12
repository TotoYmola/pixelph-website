/* PixelPH — shared site behaviour
   V6: navigation state, scroll progress, reveal observer and back-to-top were
   consolidated here so every page behaves the same. The PIXELPH config object,
   the global toggleMobileMenu() function and the [data-connect-link] /
   [data-discord-link] / .reveal contracts are unchanged from V5.13. */

const PIXELPH = {
  discord: 'https://discord.gg/te5mRyvFVc',
  cfxJoin: 'https://cfx.re/join/zjja5ap',
  serverAddress: 'play.pixelph.com:30120',
  openingTime: '2026-09-18T20:00:00+08:00'
};

/* Called from inline onclick handlers in the markup — must stay global. */
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  const willOpen = menu.classList.contains('hidden');
  menu.classList.toggle('hidden', !willOpen);
  document.body.classList.toggle('nav-open', willOpen);
  document.querySelectorAll('.nav-toggle').forEach((btn) => {
    btn.setAttribute('aria-expanded', String(willOpen));
    const icon = btn.querySelector('i');
    if (icon) icon.className = willOpen ? 'fas fa-xmark' : 'fas fa-bars';
  });
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu && !menu.classList.contains('hidden')) toggleMobileMenu();
}

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Owner helper: ?media=debug reveals which file each frame expects --- */
  if (/[?&]media=debug/.test(location.search)) {
    document.addEventListener('DOMContentLoaded', () =>
      document.body.classList.add('media-debug')
    );
  }

  /* ---------------------------------------------------------------- nav ---- */
  const nav = document.querySelector('.v2-nav');
  const progress = document.getElementById('pixelphScrollProgress');
  const scrollMark = document.querySelector('.scroll-mark');
  let toTop = null;

  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset || 0;
    nav?.classList.toggle('nav-scrolled', y > 16);
    scrollMark?.classList.toggle('is-hidden', y > 90);
    toTop?.classList.toggle('is-visible', y > 900);
    if (progress) {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.style.width = Math.min(100, (y / max) * 100) + '%';
    }
  };

  let queued = false;
  window.addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        onScroll();
        queued = false;
      });
    },
    { passive: true }
  );
  onScroll();

  /* Close the mobile sheet on Escape or when the viewport grows to desktop. */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
  const wide = window.matchMedia('(min-width: 1001px)');
  wide.addEventListener?.('change', (e) => {
    if (e.matches) closeMobileMenu();
  });

  document.addEventListener('DOMContentLoaded', () => {
    toTop = document.querySelector('.to-top');

    /* --------------------------------------------------- link wiring ---- */
    document.querySelectorAll('[data-connect-link]').forEach((a) => (a.href = PIXELPH.cfxJoin));
    document.querySelectorAll('[data-discord-link]').forEach((a) => (a.href = PIXELPH.discord));
    document.querySelectorAll('[data-server-address]').forEach((el) => {
      el.textContent = PIXELPH.serverAddress;
    });

    /* Same-page anchors scroll smoothly and close the mobile sheet. */
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const hash = a.getAttribute('href');
        if (!hash || hash === '#') return;
        let target = null;
        try { target = document.querySelector(hash); } catch (_) { return; }
        if (!target) return;
        e.preventDefault();
        closeMobileMenu();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });

    document.querySelectorAll('.mobile-nav a').forEach((a) =>
      a.addEventListener('click', closeMobileMenu)
    );

    /* Mark the current page in both navigations. */
    const here = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
    document.querySelectorAll('.nav-links a[href], .mobile-nav a[href]').forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#') || a.hasAttribute('data-discord-link')) return;
      try {
        const path = new URL(href, location.href).pathname
          .replace(/index\.html$/, '')
          .replace(/\/$/, '');
        if (path === here) a.classList.add('active');
      } catch (_) { /* relative oddities are simply skipped */ }
    });

    /* ------------------------------------------------ reveal on scroll ---- */
    const revealables = document.querySelectorAll('.reveal, .reveal-mask');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealables.forEach((el) => el.classList.add('visible'));
    } else {
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }),
        { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
      );
      revealables.forEach((el) => io.observe(el));

      /* Watchdog. A reveal is decoration; content staying hidden is a
         failure. If anything is still unrevealed after 2.5s -- a missed
         observer callback, a zero-height ancestor, a printing or
         screenshot context that never scrolls -- show it unconditionally. */
      window.setTimeout(() => {
        revealables.forEach((el) => {
          if (!el.classList.contains('visible')) {
            el.classList.add('visible');
            io.unobserve(el);
          }
        });
      }, 2500);
    }

    /* ----------------------------------------------------- back to top ---- */
    toTop?.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    );

    document.querySelectorAll('.rail-scroll').forEach((rail) => {
      rail.setAttribute('tabindex', '0');
      rail.setAttribute('role', 'group');
    });

    onScroll();
  });
})();
