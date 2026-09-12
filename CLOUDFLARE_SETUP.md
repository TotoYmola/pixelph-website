# PixelPH whitelist backend setup

The website itself will still deploy as static pages immediately. The whitelist application/approval backend becomes live after these Cloudflare steps.

## 1) Create D1 database
Create a D1 database named `pixelph-whitelist`, then run `schema.sql` against it.

In the PixelPH Pages project, bind that database to the variable name:

`DB`

## 2) Create a Discord OAuth application
In Discord Developer Portal, create an application and add this redirect URL:

`https://pixelph.com/api/auth/callback`

Add these Cloudflare Pages environment variables/secrets:

- `DISCORD_CLIENT_ID` = Discord app client ID
- `DISCORD_CLIENT_SECRET` = Discord app client secret
- `SESSION_SECRET` = long random secret
- `ADMIN_DISCORD_IDS` = comma-separated Discord user IDs allowed to review applications
- `FIVEM_API_KEY` = long random key used only between FiveM and the website API

## 3) Deploy
Push the whole project to the same GitHub `main` branch. Keep Pages output directory as `/public`.

Cloudflare Pages automatically detects the root `/functions` directory for Pages Functions.

## 4) Staff review page
Staff page:

`https://pixelph.com/pages/admin.html`

Only Discord IDs listed in `ADMIN_DISCORD_IDS` can load applications or approve/reject them.

## 5) FiveM whitelist bridge
Copy `server-integration/pixelph_whitelist` to your FiveM resources folder, then add to `server.cfg`:

```cfg
set pixelph_whitelist_api "https://pixelph.com/api/whitelist"
set pixelph_whitelist_key "SAME_VALUE_AS_CLOUDFLARE_FIVEM_API_KEY"
set pixelph_whitelist_fail_open 0
# Optional while testing:
# set pixelph_whitelist_debug 1
ensure pixelph_whitelist
```

`fail_open 0` means players are blocked if the whitelist API is down. This is safer for a whitelisted city.

## Application integrity / AI answers
The application records typing duration, input activity, and paste behavior as an **integrity score** for staff review. A high score is a warning, not an automatic rejection. Automated AI detectors can falsely flag human writing, so final rejection remains a staff decision.
