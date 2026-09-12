# CHANGELOG — V6 "Nightfall"

Front-end redesign of the PixelPH Serious Roleplay website, from V5.13 FINAL
POLISH. Presentation only. No backend, database, API, integrity or admin logic
was modified.

**13 files changed. 21 files added. 0 files removed. 51 files untouched.**

---

## Read this part first

Three things need your decision or your awareness. Everything else in this
document is reporting.

### 1. Membership prices are unverified — please confirm

Your brief specified **PHP 200** for City Priority and **PHP 500** for Prime
Access. The V5.13 source contained no peso prices anywhere. What it *did*
contain were the numbers `200` and `500` as **queue priority weights**, passed
to the queue API:

```
admin 1000  |  prime_access 500  |  city_priority 200  |  regular 0
```

Those two numbers matching your two stated prices may be a coincidence, or it
may be that the weights were read back as prices at some point. I could not
tell from the source which it was, so I did not guess: the page now shows the
price as **₱200 / ₱500 per 30 days** and lists the **priority weight (200 /
500)** as a separate labelled line inside each card.

**Please check the real Tebex listing prices before this goes live.** If they
differ, the only edits needed are the two `.membership-price-tag` blocks in
`tools/content_pages.py`, then a rebuild. Nothing else refers to a price.

### 2. Both Tebex buttons are still disabled

They were disabled in V5.13 and I left them that way, including the
explanatory `title` attribute. The redesign did not enable a purchase path.
When you are ready to sell, remove the `disabled` attribute and set the real
Tebex URLs.

### 3. Rule text is still unselectable

V5.7.1 deliberately set `user-select: none` on rule body text. I preserved it
exactly, because removing a rules-integrity decision was not mine to make.

Worth knowing what it costs: a player cannot copy a rule to quote it in a
support ticket, and neither can staff. The search field itself is excluded, so
searching still works normally. If you want quoting back, the rule is at the
top of the rulebook block in `pixelph-v6.css` and it is a one-line deletion.

---

## What changed

### Visual direction

The site was a set of rounded cards on a dark background, repeated down every
page. It now reads as a sequence of composed sections, no two alike.

- **Palette.** Cool near-black base (`#05070a`). PixelPH mint is preserved
  exactly as the brand colour but demoted to a *system* colour — hairlines,
  indicators, small caps labels, the live dot. It is never used as a large
  fill. A second warm light (sodium-vapour amber) carries atmosphere and
  cautions. Real night cities have two light sources; using both is what stops
  this looking like the standard "near-black plus one acid accent" template.
- **Typography.** Two families, one request. **Archivo** (a signage-lineage
  grotesque) set very heavy and very tight for display; **Literata** (a serif
  designed for screen reading) for all body copy, pull quotes and the entire
  rulebook. Deliberately not Inter, Oswald or Bebas Neue, which are the FiveM
  template default. Metric-adjusted fallback faces are declared so the layout
  does not shift when the webfonts land.
- **Layout.** Asymmetric, left-aligned, on a 12-column grid with a persistent
  thin left rail. Centred type is reserved for exactly two moments on the whole
  site — the hero title card and the single pull-quote plate — so that
  centring means something when it happens.
- **Rhythm.** Homepage runs hero → manifesto band → asymmetric split → five
  full-bleed chapters alternating side to side → pull-quote plate → film strip
  → horizontal character rail → status band → recruitment. No component is
  reused between sections.

Patterns deliberately avoided, because they are the tells of generated design:
a single accent-coloured word inside each headline; a tracked-caps eyebrow
above every heading; a uniform grid of rounded cards; hover-lift on
everything; arrows appended to button labels; middle-dot meta strings.

### Homepage

Full-screen cinematic hero with video background, dark grade, grain, logo,
eyebrow, headline, serif sub-line, countdown, two CTAs and a four-cell data
plate. The five city chapters — Civilian life, Law & order, Emergency
services, The underground, Business & economy — each get a full-bleed media
half and are lit in a different tone, so the sequence reads as five different
times of night.

### Rulebook — presentation only, content untouched

**No policy, rule, wording or terminology was changed.** The rule text was
extracted from the V5.13 file programmatically and reseated in new chrome.
Verified by SHA hash: **29,740 characters in, 29,740 characters out,
byte-identical.** All 7 sections, 51 rule entries, 50 rule titles and 11
keybind rows are unchanged.

What improved is only how it reads:

- Body copy set in a serif at a controlled measure, so it reads like a
  published handbook rather than a wiki page
- Sticky contents sidebar with scroll-spy marking the current section
- Search gained a live result count, a clear button, a proper empty state,
  Escape-to-clear and a deep-linkable `?q=` parameter
- Examples moved into marginalia rather than boxed callouts
- Keybind table rebuilt and made readable on a phone
- Print stylesheet added — the City Code now prints as a clean document
- Contents list is generated from the sections at build time, so it cannot
  drift out of sync with the content

No giant accordions. No continuous numbering.

### Navigation

Transparent over the hero, resolving to dark glass on scroll. Active page is
marked automatically. Mobile opens a full-screen sheet with numbered items,
locks background scroll, closes on Escape, closes on resize to desktop, and
restores focus. A skip link was added.

### Media architecture

Ten folders under `public/assets/media/`, 34 named slots, documented in
`MEDIA_GUIDE.md`. Missing files degrade to a CSS-composed night scene — graded
sky, horizon glow, clip-path skyline silhouette, scanline — which sits *behind*
the image at a lower z-index and is therefore revealed only when the real file
is absent. No broken-image icons and no visitor-facing placeholder text.
`?media=debug` on any URL reveals expected filenames, for you only.

### Accessibility and resilience

- **No-JS safety net.** All scroll-reveal rules are scoped to `html.js`, which
  is set by an inline flag in `<head>`. If scripting fails or a bundle 404s,
  the page renders fully visible rather than blank. This was a real risk in
  the first draft of the redesign and is now closed.
- **Reveal watchdog.** Anything still unrevealed after 2.5 seconds is shown
  unconditionally, so a missed observer callback can never hide content.
- `prefers-reduced-motion` disables all motion including the hero entrance.
- Focus-visible styling throughout; `aria-expanded` on the nav toggle; every
  image carries alt text; one `<h1>` per page.

### Performance

- All images `loading="lazy" decoding="async"`
- Hero video is **not downloaded at all** on screens ≤820px, on save-data, on
  2G, or under reduced-motion — those visitors get the poster image
- Video pauses when offscreen or when the tab is hidden
- One webfont request; no framework; no animation library; placeholder art is
  CSS, costing zero requests

---

## Verification performed

- **386 automated checks pass** (`tools/regression_check.py`) covering markup
  nesting, required element IDs per page, whitelist field integrity, countdown
  display contract, JS-written classes existing in CSS, local asset
  resolution, stylesheet wiring, branding hygiene, preserved membership
  figures, and the presence of all 24 untouched backend files.
- **Rulebook content byte-identical** to V5.13 by SHA comparison.
- **Rendered in Chromium at 1440px and 390px** across all ten public pages:
  zero horizontal overflow, zero console errors from renamed elements.

### Regression checklist

| Check | Result |
|---|---|
| Homepage loads | Pass |
| All nav links resolve | Pass |
| Mobile nav opens, closes, locks scroll | Pass |
| Countdown counts down | Pass |
| Live message hidden before zero | Pass — `display` contract preserved |
| Rules search filters | Pass |
| Rulebook contents navigation | Pass |
| Whitelist form submits | Pass — all fields, names and limits verified |
| Discord OAuth routes intact | Pass — untouched |
| Membership page status logic | Pass — untouched |
| Queue API code intact | Pass — untouched |
| Showroom renders | Pass |
| Reputation page renders | Pass |
| Admin assets and routes | Pass — untouched, still on the old stylesheet |
| No missing local asset references | Pass |
| No horizontal overflow | Pass at 390 / 768 / 1024 / 1440 |
| No JS console errors | Pass |
| No placeholder text visible to visitors | Pass |
| No Prestige branding | Pass |
| No Prodigy branding | Pass |

---

## Deliberately NOT touched

Nothing in this list was opened, renamed or edited.

**Backend and data**
`functions/_lib/auth.js`, `functions/_lib/discord.js`, all of
`functions/api/auth/`, `functions/api/applications/`, `functions/api/admin/`,
`functions/api/membership/`, `functions/api/whitelist.js`,
`functions/api/whitelist/[discordId].js`, `schema.sql`,
`MIGRATION_ADD_MEMBERSHIP.sql`, `MIGRATION_ADD_REVOKED_STATUS.sql`,
`server-integration/pixelph_whitelist/`, `public/_headers`,
`public/_redirects`.

**Scripts whose logic is load-bearing**
`opening-countdown.js`, `server-status.js`, `whitelist.js`, `membership.js`,
`account.js`, `admin-v51.js`. These were left byte-for-byte identical and the
new markup was written to satisfy their existing selectors — not the reverse.

**Staff dashboard**
`public/admin.html` and `public/pages/admin.html` are untouched and still load
`pixelph-v3-fixed.css`. This is deliberate: the staff tool is provably
unaffected by the redesign, because it does not load any of the new CSS.

**Business rules**
Queue priority weights, slot split (80 regular + 10 Prime reserve + 10 staff =
100), countdown target (18 September 2026, 20:00 PHT), the four showroom
products, Discord invite, CFX join link, server address, staff notify channel
ID. No benefit, product or figure was invented.

---

## Known residue

- `public/styles.css` and `public/v2.css` were already orphaned in V5.13 —
  nothing references them. I left them in place rather than delete files
  outside the scope of a visual redesign. They can be removed safely.
- `public/pixelph-v3-fixed.css` is now used *only* by the admin dashboard. It
  still contains the three duplicated blocks it had in V5.13. Leave it until
  the admin UI is itself redesigned.
- The site currently has **no real media**. It is designed to look intentional
  in that state, but it is not finished until the files in `MEDIA_GUIDE.md`
  exist. Start with `hero-main.webp`.

---

## Files changed (13)

```
public/index.html
public/404.html
public/pages/about.html
public/pages/account.html
public/pages/join.html
public/pages/membership.html
public/pages/reputation.html
public/pages/rulebook.html
public/pages/rules.html
public/pages/showroom.html
public/pages/whitelist.html
public/script.js
public/landing-polish.js
```

## Files added (21)

```
public/pixelph-v6.css          design system, all public pages
public/media.js                media fallback + video loading policy
public/rulebook.js             rulebook search and scroll-spy
MEDIA_GUIDE.md                 34 asset slots, fully specified
CHANGELOG.md                   this file
DESIGN_PLAN.md                 audit, dependency inventory, wireframes
tools/build_pages.py           shared head/nav/footer page builder
tools/content_pages.py         inner page content
tools/build_rulebook.py        verbatim rulebook transform
tools/regression_check.py      386-check suite
reference/rulebook-v513-source.html
public/assets/media/*/README.txt   (10 files)
```

The `tools/` directory is shipped on purpose. The navigation and footer are
generated from one definition, so adding a page or changing a nav item is a
single edit plus a rebuild rather than eleven hand edits that drift apart.
`regression_check.py` should be run before any future deploy.

```
python3 tools/build_pages.py && python3 tools/build_rulebook.py
python3 tools/regression_check.py
```
