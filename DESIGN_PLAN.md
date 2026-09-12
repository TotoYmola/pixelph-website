# PixelPH V6 — Internal Change Plan (working notes)

## 1. Inventory of V5.13 (audited before any change)

**Public pages:** `/index.html`, `/404.html`, `/pages/{about,rules,rulebook,reputation,membership,showroom,whitelist,join,account}.html`
**Staff:** `/admin.html` (+ `/pages/admin.html` meta-refresh redirect to `/admin`)

**JavaScript:**
| File | Role | Hard dependencies (MUST NOT RENAME) |
|---|---|---|
| `script.js` | global config + mobile menu + smooth scroll + `.reveal` observer | `PIXELPH` object, `toggleMobileMenu()`, `#mobileMenu`, `.hidden`, `[data-connect-link]`, `[data-discord-link]`, `.reveal`/`.visible` |
| `landing-polish.js` | nav scroll state, progress bar, hero pointer parallax | `.v2-nav`/`.nav-scrolled`, `#pixelphScrollProgress`, `.scroll-mark`/`.is-hidden`, `.v2-hero`, `.hero-logo`, `.mobile-nav a` |
| `opening-countdown.js` | **countdown timing + connect lock** | `#cityOpeningCountdown`, `#cityOpenMessage`, `#cdDays/#cdHours/#cdMinutes/#cdSeconds`, `[data-connect-link]`, `.countdown-connect-locked`; sets `root.style.display='block'` and `live.style.display='flex'` |
| `server-status.js` | FiveM player count | `#playerCount`, `#maxPlayers`, `#serverStatusPill`, `.offline`, `.live-dot` |
| `whitelist.js` | application form + integrity metrics | `#statusArea`, `#whitelistForm`, `#authArea`, `#authCopy`, `[data-track]`, `.char-count` (**must be a sibling inside the same parent as the textarea**), `.status-box` + `.pending/.approved/.rejected`, `.badge`, `.hidden`, field `name` attrs |
| `membership.js` | membership status card | `#membershipStatus`, `#membershipStatusTitle`, `#membershipStatusCopy`, `#membershipAccountBtn`, `.signed-out/.inactive/.active` |
| `account.js` | player dashboard | `#accountStatus`, `#accountCopy`, `#accountActions`, `#historyList`, `#membershipActive`, `#queueAccess`, `.account-status`, `.history-item`, `.admin-status`, `.membership-active-*`, `.membership-empty`, `.queue-pill`, `.review-muted` |
| `admin-v51.js` | staff review dashboard | all `#admin*`, `#stat*`, `#review*`, `.admin-*`, `.integrity-*`, `.answer-block`, `.quick-reasons` |
| rulebook inline script | rule search | `#ruleSearch`, `.rule-search-item`, `.rules-category` |

**APIs / backend (NOT TOUCHED):** `functions/_lib/{auth,discord}.js`, `functions/api/auth/{login,callback,logout}.js`, `functions/api/applications/{index,me,history}.js`, `functions/api/admin/applications{,/[id]}.js`, `functions/api/membership/{me,queue}.js`, `functions/api/whitelist{,/[discordId]}.js`, `schema.sql`, migrations, `server-integration/pixelph_whitelist/*`, `_headers`, `_redirects`.

**Whitelist logic:** Discord OAuth → `/api/applications` POST with `integrity` payload (behaviour metrics + shingle similarity) → D1 → staff DM/channel notify. Client-side integrity metric collection lives in `whitelist.js` and is driven by `[data-track]`. Preserved verbatim.

**Membership/queue logic:** `/api/membership/queue` returns priority 1000 admin / 500 prime_access / 200 city_priority / 0 regular. Capacity presented on site: 80 regular + 10 prime reserve + 10 staff reserve = 100. Preserved verbatim.

**Countdown logic:** target `2026-09-18T20:00:00+08:00`, hard-coded in both `script.js` (`PIXELPH.openingTime`) and `opening-countdown.js`. Live message inline-hidden until zero. Preserved verbatim.

**Shared CSS:** single sheet `pixelph-v3-fixed.css` (55 KB, accreted across V3→V5.13, with three literally duplicated blocks). `styles.css` and `v2.css` are orphaned legacy — referenced by nothing.

## 2. Change strategy

- New design-system stylesheet `pixelph-v6.css` for **all public pages**.
- `admin.html` keeps pointing at `pixelph-v3-fixed.css`, untouched → staff dashboard is provably unaffected.
- Every JS-referenced id/class/selector above is preserved. Markup around them is recomposed, not renamed.
- Media handled as layered CSS backgrounds + `<img loading=lazy>` in framed containers, so missing files degrade to an intentional atmospheric plate instead of a broken image.

## 3. Design plan

### Subject
A whitelisted Philippine serious-RP city. Its real vernacular is civic and documentary: IDs, city codes, dispatch logs, district signage, application dossiers. That — not "gaming" — is where the visual language comes from.

### Colour (6 core values)
- `--ink #05070A` — base. Cool blue-black, not a tinted grey.
- `--ink-2 #0A0F13` — raised surface.
- `--slate #1A2328` — edges and hairlines.
- `--mint #00D7C2` — PixelPH brand. Preserved exactly. Used as *light*: hairlines, one indicator, small type. Never as a large fill.
- `--sodium #E8A24A` — sodium-vapour streetlight. Atmosphere + cautions.
- `--bone #EEF2F1` — text.

Reasoning: near-black + one bright accent is the stock "dark landing page", and mint-only would make the whole site read as a single hue. Real night cities are lit by *two* sources — cold moonlight and warm sodium lamps. Giving the site a warm second light lets chapters differ from each other atmospherically while mint stays the brand.

### Type
- **Archivo** (variable) — display + UI. A signage-lineage grotesque; set very heavy and very tight for titles.
- **Literata** (variable) — reading text, pull quotes, rulebook body. Screen-designed, sturdy serif; makes the City Code read like a published handbook rather than a wiki.
Two families, unmistakably different in class. Deliberately not Inter/Oswald/Bebas.

### Layout
Asymmetric, left-aligned editorial on a 12-column grid with a persistent thin left rail running through sections (a curb line / film edge). Section types alternate so no component repeats:

```
  HERO full-bleed plate        SPLIT 7/5 sticky        QUIET BAND
 ┌───────────────────┐      ┌──────────┬──────┐      ┌───────────────┐
 │ ▌ title card      │      │ ▌ type   │ img  │      │ ▌  large      │
 │ ▌ lead            │      │ ▌ sticky │ tall │      │ ▌  statement  │
 │ ▌ countdown  CTAs │      │ ▌ list   │ mask │      │ ▌  + 3 facts  │
 │ ─ city plate ─    │      └──────────┴──────┘      └───────────────┘
 └───────────────────┘
  CHAPTER (alt sides)         PULL-QUOTE plate        GALLERY rail
 ┌──────┬────────────┐      ┌───────────────┐      ┌──┬──┬──┬──┬──┐
 │ img  │ 01 DISTRICT│      │   centred     │      │  │  │  │  │ →│
 │ full │ headline   │      │   quote       │      └──┴──┴──┴──┴──┘
 │ bleed│ 3 facts    │      │  ─ 3 stats ─  │       scroll-snap
 └──────┴────────────┘      └───────────────┘
```

Centring is reserved for exactly two moments — the hero title card and the single pull-quote plate — so that when something is centred it reads as deliberate.

### Principles
1. **Two lights, one brand.** Cold base, warm sodium atmosphere, mint only as a system colour.
2. **Numbering only where there is a sequence.** The five city chapters and the whitelist steps are sequences; nothing else gets 01/02/03.
3. **No eyebrow above every heading.** Caps labels appear only on chapter plates, where they name a district. Elsewhere a headline stands on its own or takes a short serif lead-in.
4. **One motion device.** A single masked image reveal, reused; one orchestrated hero entrance. No hover-lift on every card, no arrows in button labels.
5. **Media-first frames.** Every image slot is a composed plate that looks intentional empty.

### Revisions made to this plan before building
- Dropped the accented-single-word headline (`<span class="accent">`) that V5.13 used on every page; hierarchy now comes from scale and weight. It is the most recognisable generated-page tell.
- Dropped the tracked-caps kicker above every section for the same reason, kept `.section-kicker` in CSS so `account.js`/admin markup still renders.
- Dropped the uniform rounded-card grid; each section now has a different composition.
- Replaced middle-dot meta strings with hairline-separated label/value plates.
