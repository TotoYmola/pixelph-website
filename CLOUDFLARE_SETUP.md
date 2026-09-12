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
