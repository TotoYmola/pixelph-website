# PixelPH V4 production setup

The core whitelist website, D1, Discord OAuth, staff dashboard, and FiveM allow/deny bridge are already supported by this build.

## Cloudflare D1 binding
Bind the existing D1 database to Pages using exactly:

`DB`

Your current database name may be `pixelph_whitelist`; the binding name is what the Functions code uses.

## Required environment variables
- `DISCORD_CLIENT_ID` = Discord application Client ID
- `DISCORD_CLIENT_SECRET` = Discord OAuth secret (Secret)
- `SESSION_SECRET` = long random secret (Secret)
- `ADMIN_DISCORD_IDS` = comma-separated numeric Discord user IDs for staff reviewers
- `FIVEM_API_KEY` = long random secret shared only with the FiveM whitelist resource

OAuth callback in Discord Developer Portal:

`https://pixelph.com/api/auth/callback`

## Discord automation (new in V4)
The same Discord application can also host the bot used for automatic whitelist role sync and DMs.

Add these variables:
- `DISCORD_BOT_TOKEN` = bot token (Secret)
- `DISCORD_GUILD_ID` = your PixelPH Discord server ID
- `DISCORD_WHITELIST_ROLE_ID` = the role ID that approved applicants should receive

Bot permissions needed in the PixelPH Discord server:
- View Channels
- Send Messages
- Manage Roles

Important: the bot's highest role must be ABOVE the Whitelisted role in Discord role hierarchy.

Behavior:
- Application submitted -> best-effort Discord DM confirming receipt
- Approved -> adds Whitelisted role + sends approval DM
- Rejected -> removes Whitelisted role (if present) + sends rejection reason by DM
- If Discord role/DM sync fails, the whitelist database decision still saves and the staff dashboard shows a warning

## Staff dashboard
Recommended URL:

`https://pixelph.com/admin`

Staff access is enforced server-side using `ADMIN_DISCORD_IDS`.

## My PixelPH
Authenticated player status/history page:

`https://pixelph.com/pages/account.html`

## FiveM whitelist bridge
Use the included `server-integration/pixelph_whitelist` resource and:

```cfg
set pixelph_whitelist_api "https://pixelph.com/api/whitelist"
set pixelph_whitelist_key "SAME_VALUE_AS_CLOUDFLARE_FIVEM_API_KEY"
set pixelph_whitelist_fail_open 0
# set pixelph_whitelist_debug 1
ensure pixelph_whitelist
```

`fail_open 0` is recommended for production whitelisting.

## Integrity screening V4
This build does NOT claim to definitively detect AI-written text. Instead it records and scores review signals that are more defensible:
- completion time
- paste activity
- typing/input activity
- active field focus time
- cross-application phrase similarity

High-risk submissions are flagged for staff review. Staff remains the final decision maker.

## Opening countdown
City opening is configured for:

`September 18, 2026 • 8:00 PM PHT (UTC+8)`

Before that time, website connect buttons are visually locked. When the timer reaches zero, they unlock automatically and the hero changes to `PIXELPH CITY IS NOW LIVE`.

## Production security
The `FIVEM_API_KEY` used during chat/testing has been visible during setup. Before public launch, rotate it in BOTH Cloudflare and `server.cfg`, then restart `pixelph_whitelist`.

## City Gallery (new)
The public Gallery, the homepage "Inside the city" preview, and the staff Gallery Manager (`/gallery-admin.html`) reuse the existing D1 database and Discord staff auth — no new secrets are needed for those. Image bytes need one new binding:

### Cloudflare R2 bucket binding
1. Create an R2 bucket (Cloudflare dashboard → R2 → Create bucket), e.g. `pixelph-gallery`.
2. In the Pages project → Settings → Functions → R2 bucket bindings, add a binding named exactly:

   `GALLERY_BUCKET`

   pointing at that bucket. Same idea as the existing `DB` binding — no wrangler.toml is used in this project, so this is configured in the dashboard.
3. Run `MIGRATION_ADD_GALLERY.sql` against the existing `DB` database (dashboard D1 console "Execute query", or `wrangler d1 execute pixelph_whitelist --remote --file=./MIGRATION_ADD_GALLERY.sql`). It only adds a new `gallery_images` table and indexes — it does not touch `applications` or `membership_entitlements`.

Until `GALLERY_BUCKET` is bound, the public gallery page and homepage preview simply stay empty (no error shown to visitors), and the Gallery Manager's upload button returns a clear "Gallery storage is not configured" message instead of failing silently.

### How images are served
Uploaded images are never Base64/inline and never stored in D1 — only their R2 object key is. The admin uploader resizes each screenshot in the browser (canvas, WebP with a JPEG fallback) into an optimized "full" image (max 2200px) and a small thumbnail (max 640px) before upload, so the Worker never has to run server-side image processing (not available in the Pages Functions runtime). Both are stored in `GALLERY_BUCKET` under short, server-generated keys (never the original filename) and served back through `/gallery-media/:key`, a Pages Function that streams the object with a one-year immutable cache header.
