# PixelPH Media Guide — V6 "Nightfall"

Everything here is a **slot**, not a file. The site is built to look finished
with none of these present, so there is no deadline and no broken state. Drop
files in as you capture them; each one replaces its placeholder plate the
moment it exists. Nothing else needs changing.

---

## How the placeholder system works

Every image sits inside a `.ph-frame`. Behind the image is a CSS-drawn night
scene: a graded sky, a light source, a horizon glow, a skyline silhouette and
a fine scanline. The real photo renders **on top** of that plate at a higher
z-index, so the plate is only ever seen while the file is missing.

If a file 404s, `media.js` marks the frame `.media-missing` and the plate
simply stays visible. There is no broken-image icon, no alt-text box, no
"image coming soon" text shown to visitors. Each section is tinted by a tone
class (`tone-mint`, `tone-cold`, `tone-sodium`, `tone-ember`, `tone-deep`) so
the five city chapters read as five different times of night even when the
site is completely empty of real media.

**Seeing which file a frame wants:** append `?media=debug` to any URL
(e.g. `https://pixelph.com/?media=debug`). Every frame prints the exact
filename it is looking for. This is a URL flag, not a setting — visitors will
never see it unless they type it themselves.

---

## Global capture notes

Read these once; they apply to every slot below.

**Format.** Export `.webp` at quality 80–85. The markup is written for a
single file per slot, so keep the exact filenames — no `-final`, no `@2x`, no
`.png`. If you later want AVIF, the frames accept a `<picture>` swap without
any CSS change.

**Resolution.** Shoot and export wider than you think. Full-bleed slots are
cropped by `object-fit: cover`, so surplus width is used, not wasted. Do not
upscale — a sharp 1920px file beats a soft 2560px one.

**Composition for cropping.** This is the one that bites people. Every
full-bleed frame crops differently at different widths: wide and short on
desktop, closer to square on tablet, and a tall 16:10 box on phones. **Keep
your subject in the middle 50% horizontally and the middle 60% vertically.**
Anything important near an edge will be cut off on some device.

**Exposure.** Shoot darker than feels right. Every frame has a vignette and a
legibility scrim over it, and text sits on top of several. A correctly
exposed daylight screenshot will look blown out and will fight the type. Night
and dusk material suits this design far better than midday.

**HUD.** Turn off the FiveM HUD, minimap, chat, nameplates and any scoreboard
before capturing. A visible HUD is the single fastest way to make a site look
like a template.

**People.** Get permission before using recognisable characters, and avoid
capturing other players' names in frame.

---

## Video

Two video slots. Both are optional — each degrades to its poster image, and
each poster degrades to a CSS plate, so a missing video costs you nothing but
motion.

### `assets/media/videos/hero-cinematic.mp4` + `.webm`
- **Where:** homepage hero, full-screen background behind the headline.
- **Resolution:** 1920×1080 minimum. 2560×1440 is better.
- **Aspect:** 16:9, cropped hard on mobile.
- **Length:** 12–25 seconds, cut to loop cleanly. No hard cut at the seam.
- **Audio:** strip it entirely. The video plays muted and the file is smaller
  without an audio track.
- **Target size:** keep the MP4 under about 4 MB. This is a background, not a
  feature film; heavy files hurt the first impression more than they help it.
- **Content:** slow drifting movement — a car crossing an intersection, rain on
  a windscreen, a slow pull down a lit street. Avoid fast cuts, avoid action,
  avoid anything with a focal point that moves, because the headline sits over
  the left of the frame and needs a calm area behind it.
- **Mobile:** the video is **not downloaded at all** on screens ≤820px, on
  save-data connections, on 2G, or under reduced-motion. Those visitors get
  `hero-main.webp` instead. Design the poster to stand alone.

### `assets/media/videos/city-loop-01.mp4` + `.webm`
- **Where:** homepage film strip, a wide band between the pull-quote and the
  character rail.
- **Resolution:** 1920×640 or wider; it is cropped to a letterbox.
- **Aspect:** roughly 3:1 in the strip.
- **Length:** 8–15 seconds, looping.
- **Content:** ambient city texture — traffic, neon, a wet road. No subject.
- **Mobile:** same rule as above; falls back to `city-night-02.webp`.

---

## Posters

These two do double duty: video poster *and* the mobile replacement for the
video. They matter more than their count suggests.

| File | Resolution | Aspect | Purpose |
|---|---|---|---|
| `assets/media/hero/hero-main.webp` | 2560×1440 | 16:9 | Homepage hero poster and the full mobile hero image |
| `assets/media/city/city-night-02.webp` | 1920×640 | 3:1 | Film strip poster and mobile replacement |

`hero-main.webp` is the single most important file in this list. It is what
most phone visitors will see as their first impression of PixelPH. Treat it as
a key art frame, not a screenshot: strong silhouette, deep shadows, one clear
light source, generous empty space in the **left half and lower third** where
the logo, headline and countdown sit.

---

## Homepage

| File | Resolution | Aspect | Where it appears | Cropping note |
|---|---|---|---|---|
| `assets/media/city/city-night-01.webp` | 1200×1800 | 2:3 portrait | "Not a map you spawn on" split section | The only portrait slot on the homepage. A tall street or a building face works; a landscape shot will crop badly. |
| `assets/media/lifestyle/city-life-01.webp` | 1920×1280 | 3:2 | Chapter 01, Civilian life | Ordinary city life — a shop, a queue, a courier. Deliberately unglamorous. |
| `assets/media/police/police-01.webp` | 1920×1280 | 3:2 | Chapter 02, Law & order | Procedure, not a firefight: a traffic stop, a scene cordon, an interview. |
| `assets/media/ems/ems-01.webp` | 1920×1280 | 3:2 | Chapter 03, Emergency services | Treatment in progress. Keep it serious; this section is about consequence. |
| `assets/media/criminal/criminal-underground-01.webp` | 1920×1280 | 3:2 | Chapter 04, The underground | Suggestive, not explanatory. A lit doorway, a parked car, a handover at distance. **Do not show anything that reveals a method or location.** |
| `assets/media/businesses/business-01.webp` | 1920×1280 | 3:2 | Chapter 05, Business & economy | A business actually operating, with people in it. |
| `assets/media/city/city-skyline-01.webp` | 2400×1350 | 16:9 | Behind the pull-quote plate | Heavily darkened and overlaid by large type. Pick something with a clean, simple silhouette. |
| `assets/media/characters/character-01.webp` | 900×1200 | 3:4 | "Your story" rail, tile 1 | Character portraits. Vary the four — different people, clothing, settings, times of night. |
| `assets/media/characters/character-02.webp` | 900×1200 | 3:4 | Rail, tile 2 | |
| `assets/media/characters/character-03.webp` | 900×1200 | 3:4 | Rail, tile 3 | |
| `assets/media/characters/character-04.webp` | 900×1200 | 3:4 | Rail, tile 4 | |
| `assets/media/vehicles/vehicle-01.webp` | 900×1200 | 3:4 | Rail, tile 5 | A vehicle as someone's possession — parked, in context — not a showroom render. |
| `assets/media/hero/hero-apply.webp` | 1920×1080 | 16:9 | Final recruitment section | Sits behind the closing call to action. Keep the centre calm. |

The five chapter images alternate sides down the page, so they are seen in
sequence. Shooting them in one session at a consistent time of night will make
that sequence feel composed rather than collected.

---

## Page headers

Each inner page opens with a wide, low banner. These are cropped very short —
roughly 4:1 on desktop — so put the subject dead centre vertically.

| File | Resolution | Aspect | Page |
|---|---|---|---|
| `assets/media/city/city-aerial-01.webp` | 2400×1000 | 12:5 | About |
| `assets/media/city/city-courthouse-01.webp` | 2400×1000 | 12:5 | Rules |
| `assets/media/city/city-courthouse-02.webp` | 2400×1000 | 12:5 | City Code / rulebook — shoot a *different* angle from the Rules one |
| `assets/media/criminal/underground-meeting-01.webp` | 2400×1000 | 12:5 | Reputation — figures at distance, faces unclear |
| `assets/media/city/city-night-04.webp` | 2400×1000 | 12:5 | Membership |
| `assets/media/vehicles/showroom-hero-01.webp` | 2400×1000 | 12:5 | Showroom |
| `assets/media/city/city-gate-01.webp` | 2400×1000 | 12:5 | Whitelist — an entrance or threshold reads well here |
| `assets/media/city/city-entry-01.webp` | 2400×1000 | 12:5 | Join |

---

## Remaining inner-page slots

| File | Resolution | Aspect | Where | Note |
|---|---|---|---|---|
| `assets/media/city/city-night-03.webp` | 1920×1280 | 3:2 | About, mid-page | |
| `assets/media/lifestyle/city-life-02.webp` | 900×1200 | 3:4 | About, portrait slot | |
| `assets/media/criminal/notebook-clues-01.webp` | 1600×1200 | 4:3 | Reputation, notebook panel | Suggest record-keeping — a phone screen, a written page — **with nothing legible**. No real clue text, no coordinates. |
| `assets/media/characters/showroom-look-01.webp` | 1200×1500 | 4:5 | Showroom, Signature Look | |
| `assets/media/vehicles/showroom-vehicle-01.webp` | 1200×1500 | 4:5 | Showroom, Signature Vehicle | |
| `assets/media/characters/showroom-ped-01.webp` | 1200×1500 | 4:5 | Showroom, Signature Ped | |
| `assets/media/businesses/showroom-business-01.webp` | 1200×1500 | 4:5 | Showroom, Business Commission | |

The four showroom tiles are the only place the site shows purchasable items.
Shoot them consistently — same framing logic, same light — or the section will
look like four unrelated screenshots.

---

## Priority order

If you are capturing in one session and want the biggest visible return first:

1. `hero-main.webp` — first impression, and the entire mobile hero
2. `hero-cinematic.mp4` / `.webm` — the cinematic opening on desktop
3. The five chapter images — the main body of the homepage
4. `city-skyline-01.webp` and `city-night-01.webp` — the two large homepage moments
5. The eight page headers — makes the inner pages feel like the same site
6. The four showroom tiles
7. The character rail and the remaining fills

Steps 1–3 alone will carry the site.

---

## Checklist before you upload

- Filename matches this guide exactly, including the `.webp` extension
- HUD, minimap and chat are off
- Subject sits inside the middle 50% horizontally and middle 60% vertically
- Exposure is on the dark side
- No other player's name is readable
- Nothing in frame reveals a heist method, a clue answer, or a location
- Video has no audio track and loops without a visible seam
