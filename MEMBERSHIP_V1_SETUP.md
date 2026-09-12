# PixelPH Membership V1 Setup

## 1) Run the D1 migration first
Open Cloudflare D1 -> `pixelph_whitelist` -> Console and run the contents of:

`MIGRATION_ADD_MEMBERSHIP.sql`

This creates `membership_entitlements` without changing the existing whitelist tables.

## 2) Deploy the website package
Deploy the package to the same Cloudflare Pages project after the migration succeeds.

## 3) What is live in this build
- New Membership page with City Priority, Prime Access, Business Patron, Signature Look, Signature Vehicle, Signature Ped.
- My PixelPH now shows active membership packages and expiry dates.
- Membership is separate from whitelist approval.
- Queue membership API is ready for FiveM integration.

## 4) Queue API contract
`GET /api/membership/queue?discord_id=<DISCORD_ID>`

Header:
`Authorization: Bearer <FIVEM_API_KEY>`

Returns one of:
- Admin: priority 1000, admin reserved class, 10 reserved slots.
- Prime Access: priority 500, Prime reserved class, 10 reserved slots.
- City Priority: priority 200, no reserved slot.
- Regular: priority 0.

Capacity design: 180 regular + 10 Prime reserve + 10 Staff reserve = 200 total.

This endpoint does not kick connected players. A real 200/200 server remains full until a slot becomes free.

## 5) Temporary manual entitlement example
Use this only for testing until the staff membership controls/payment workflow are added.

```sql
INSERT INTO membership_entitlements (
  id, discord_id, package_key, status, starts_at, expires_at, metadata_json, granted_by, created_at, updated_at
) VALUES (
  'test-prime-001',
  'YOUR_DISCORD_ID',
  'prime_access',
  'active',
  datetime('now'),
  datetime('now', '+30 days'),
  NULL,
  'manual-test',
  datetime('now'),
  datetime('now')
);
```

To remove the test entitlement:
```sql
DELETE FROM membership_entitlements WHERE id='test-prime-001';
```
