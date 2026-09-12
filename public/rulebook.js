/* PixelPH — City Code reader
   Replaces the inline search snippet from V5.13. The search contract is
   unchanged: #ruleSearch toggles the [hidden] attribute on .rule-search-item
   entries and on .rules-category sections. Added on top of that: a result
   count, a clear control, an empty state, a deep-linkable ?q= parameter and
   a scroll-spy on the contents list. No rule text is altered. */

(() => {
  const input = document.getElementById('ruleSearch');
  const wrap = document.querySelector('.rules-search-wrap');
  const content = document.querySelector('.rules-content');
  const countEl = document.querySelector('.rules-search-count');
  const clearBtn = document.querySelector('.rules-search-clear');
  const items = [...document.querySelectorAll('.rule-search-item')];
  const cats = [...document.querySelectorAll('.rules-category')];
  const navLinks = [...document.querySelectorAll('.rules-category-nav a')];

  /* Cache lowercase text once instead of on every keystroke. */
  const haystacks = items.map((el) => el.textContent.toLowerCase());
  const total = items.length;

  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

  function apply(term) {
    const q = term.trim().toLowerCase();
    let shown = 0;

    items.forEach((el, i) => {
      const match = !q || haystacks[i].includes(q);
      el.hidden = !match;
      if (match) shown++;
    });

    cats.forEach((cat) => {
      const any = [...cat.querySelectorAll('.rule-search-item')].some((x) => !x.hidden);
      cat.hidden = !any;
    });

    wrap?.classList.toggle('has-query', q.length > 0);
    content?.classList.toggle('no-results', q.length > 0 && shown === 0);

    if (countEl) {
      if (!q) countEl.innerHTML = `${plural(total, 'rule')} across ${plural(cats.length, 'section')}`;
      else if (shown === 0) countEl.innerHTML = 'No matching rules';
      else countEl.innerHTML = `<b>${shown}</b> of ${total} rules match`;
    }
  }

  if (input) {
    /* Deep link support: /pages/rulebook.html?q=metagaming */
    const preset = new URLSearchParams(location.search).get('q');
    if (preset) input.value = preset;

    apply(input.value);
    input.addEventListener('input', () => apply(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      input.value = '';
      apply('');
    });

    clearBtn?.addEventListener('click', () => {
      input.value = '';
      apply('');
      input.focus();
    });
  }

  /* ------------------------------------------------------------ scroll spy */
  if (navLinks.length && cats.length && 'IntersectionObserver' in window) {
    const byId = new Map(
      navLinks
        .map((a) => [(a.getAttribute('href') || '').replace('#', ''), a])
        .filter(([id]) => id)
    );

    let current = null;
    const setCurrent = (id) => {
      if (id === current) return;
      current = id;
      navLinks.forEach((a) => a.classList.remove('is-current'));
      byId.get(id)?.classList.add('is-current');
    };

    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setCurrent(visible[0].target.id);
      },
      { rootMargin: '-38% 0px -52% 0px', threshold: 0 }
    );
    cats.forEach((cat) => cat.id && spy.observe(cat));

    /* Keep the mobile contents strip scrolled to the active section. */
    const strip = document.querySelector('.rules-category-nav');
    if (strip) {
      const mo = new MutationObserver(() => {
        const active = strip.querySelector('.is-current');
        if (!active || window.innerWidth > 1000) return;
        const left = active.offsetLeft - strip.clientWidth / 2 + active.offsetWidth / 2;
        strip.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
      });
      mo.observe(strip, { attributes: true, subtree: true, attributeFilter: ['class'] });
    }
  }
})();
