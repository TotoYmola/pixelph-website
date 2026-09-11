# PixelPH Website V3 — Full Whitelist Edition

Includes:
- PixelPH cinematic homepage
- City opening countdown: September 18, 2026 at 8:00 PM PHT
- Live FiveM player/capacity status
- Direct Cfx.re join link (`zjja5ap`)
- PixelPH Discord link
- Unified About, Rules, Rulebook, Join, Membership, 404 pages
- SEO/social preview/favicon
- Whitelist application page with Discord OAuth scaffold
- Cloudflare D1 application storage
- Staff approval/rejection dashboard
- Application integrity signals for copied/automated-answer review
- FiveM server-side whitelist bridge
- Mobile responsive layout and cleaned navigation

See `CLOUDFLARE_SETUP.md` for the one-time backend setup.

## V3 display repair
This build uses a new stylesheet filename (`pixelph-v3-fixed.css`) and restores the `v2-body` compatibility class to prevent the new HTML from being paired with an older cached V2 stylesheet. This fixes the exposed mobile menu, cramped desktop navigation, dark/invisible heading text, and broken hero layout seen after the prior deployment.
