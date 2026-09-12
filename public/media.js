/* PixelPH — media layer
   Every image and video slot on the site degrades to a composed atmospheric
   plate when the real file is not present yet, so the page never shows a
   broken-image icon and never looks unfinished.

   Contract:
   - <div class="ph-frame" data-media="path/to/file.webp"> wraps the media.
   - If an <img>/<video> inside it fails to load, the frame gains
     .media-missing and the CSS plate underneath becomes the visual.
   - Hero video sources use data-src instead of src, so the file is only
     fetched when it makes sense (desktop-width, motion allowed, no data
     saver). Mobile and reduced-motion visitors get the poster image only. */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------ still image fallback --- */
  const markMissing = (el) => el.closest('.ph-frame')?.classList.add('media-missing');

  const watch = (el) => {
    if (el.dataset.phWatched) return;
    el.dataset.phWatched = '1';
    /* Images that already failed before this script ran. */
    if (el.tagName === 'IMG' && el.complete && el.naturalWidth === 0) markMissing(el);
    el.addEventListener('error', () => markMissing(el));
  };

  document.querySelectorAll('.ph-frame img, .ph-frame video').forEach(watch);

  /* ----------------------------------------------------------- hero video --- */
  const video = document.querySelector('video[data-hero-video]');
  if (video) {
    const sources = [...video.querySelectorAll('source[data-src]')];
    const conn = navigator.connection || {};
    const saveData = conn.saveData === true;
    const slow = /(^|-)2g$/.test(conn.effectiveType || '');
    const narrow = window.matchMedia('(max-width: 820px)').matches;
    const allowed = !reduceMotion && !saveData && !slow && !narrow;

    if (allowed && sources.length) {
      sources.forEach((s) => {
        s.src = s.dataset.src;
        s.removeAttribute('data-src');
      });
      video.load();
      const start = () => video.play().catch(() => { /* autoplay refused: poster stays */ });
      if (video.readyState >= 2) start();
      else video.addEventListener('loadeddata', start, { once: true });

      /* Stop decoding while the hero is off screen. */
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(
          (entries) =>
            entries.forEach((entry) => {
              if (entry.isIntersecting) video.play().catch(() => {});
              else video.pause();
            }),
          { threshold: 0.01 }
        ).observe(video);
      }
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) video.pause();
        else if (video.getBoundingClientRect().bottom > 0) video.play().catch(() => {});
      });
    } else {
      /* Poster-only mode. Remove the element so nothing is requested. */
      video.removeAttribute('autoplay');
      const poster = video.getAttribute('poster');
      const frame = video.closest('.ph-frame') || video.parentElement;
      if (poster && frame) {
        const img = document.createElement('img');
        img.src = poster;
        img.alt = video.getAttribute('data-poster-alt') || '';
        img.decoding = 'async';
        img.className = 'hero-poster';
        frame.insertBefore(img, video);
        watch(img);
      }
      video.remove();
    }
  }

  /* --------------------------------------------- inline ambient clips ------ */
  /* Smaller looping clips (film strip etc.) only load on wide viewports with
     motion enabled; otherwise their poster or plate is used. */
  document.querySelectorAll('video[data-ambient]').forEach((clip) => {
    const narrow = window.matchMedia('(max-width: 820px)').matches;
    const conn = navigator.connection || {};
    if (reduceMotion || narrow || conn.saveData === true) {
      const poster = clip.getAttribute('poster');
      const frame = clip.closest('.ph-frame') || clip.parentElement;
      if (poster && frame) {
        const img = document.createElement('img');
        img.src = poster;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        frame.insertBefore(img, clip);
        watch(img);
      }
      clip.remove();
      return;
    }
    clip.querySelectorAll('source[data-src]').forEach((s) => {
      s.src = s.dataset.src;
      s.removeAttribute('data-src');
    });
    clip.load();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) clip.play().catch(() => {});
            else clip.pause();
          }),
        { threshold: 0.15 }
      ).observe(clip);
    }
  });
})();
