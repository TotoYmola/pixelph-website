# PixelPH Website V5.2 — Whitelist Staff Notification

This package builds on the working V3 whitelist pipeline and adds the production-facing operations layer.

Included:
- Cinematic PixelPH homepage
- City opening countdown: September 18, 2026 at 8:00 PM PHT
- Connect buttons locked on the website until opening time
- Discord OAuth whitelist application
- D1 application storage and history
- Staff `/admin` review dashboard
- Approve / reject with quick rejection templates
- Behavior + copy-similarity integrity screening (staff-reviewed, not automatic AI rejection)
- Automatic Discord role sync foundation on approval/rejection
- Applicant Discord DM notifications foundation
- `My PixelPH` account/status/history page
- FiveM whitelist API + `pixelph_whitelist` server resource
- Rejected/pending/no-application blocked; approved allowed
- Live FiveM status/player count
- PixelPH Discord and Cfx.re direct join integration

See `CLOUDFLARE_SETUP.md` for the remaining Discord bot variables and production hardening.


V5.2 addition:
- New whitelist submissions post a best-effort notification to Discord channel `1548176627446321172` with applicant, character, integrity score/signals, and `/admin` review link.

V5.13: Final landing-page polish — scroll-state nav, subtle progress indicator, hero/title motion, refined hover depth, staggered reveals, mobile/reduced-motion safeguards. No backend or rules logic changed.
