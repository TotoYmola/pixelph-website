# PixelPH Membership Queue API — V5.3.2

The FiveM queue uses:

`GET https://pixelph.com/api/membership/queue?discord_id=DISCORD_ID`

Required request header:

`Authorization: Bearer <MEMBERSHIP_API_KEY>`

## Cloudflare

Create a secret/variable:

- Name: `MEMBERSHIP_API_KEY`
- Value: exactly the same secret used in `server.cfg`

## FiveM server.cfg

```cfg
sv_maxclients 100

set pixelph_membership_api "https://pixelph.com/api/membership/queue"
set pixelph_membership_key "SAME_VALUE_AS_CLOUDFLARE_MEMBERSHIP_API_KEY"

add_ace group.admin pixelph.queue.staff allow

ensure pixelph_queue
```

## Queue policy

- Regular / City Priority population band: 0–80
- Prime Access reserved band: up to 90
- Staff/Admin reserve: up to 100

Priority ordering:
- Staff/Admin: 1000
- Prime Access: 500
- City Priority: 200
- Regular: 0

The endpoint now returns the exact fields consumed by `pixelph_queue v1.0`:
`tier`, `membership_tier`, `active`, and `status`.
