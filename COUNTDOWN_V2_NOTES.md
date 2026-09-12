# PixelPH Countdown V2

Updated the homepage opening countdown to a cinematic event-style presentation.

- Target remains September 18, 2026 at 8:00 PM PHT.
- Digital countdown blocks for Days / Hours / Minutes / Seconds.
- Animated skyline, glow, particles, and light sweep using CSS only.
- Responsive mobile layout.
- Connect links remain locked until countdown reaches zero.
- At zero, countdown hides, “PixelPH City Is Now Live” appears, and connect links unlock.
- Existing whitelist, membership, showroom, staff notification, and membership queue API files were left intact.


## V5.4.2 cache-safe live-state fix
- Forces the live message to `display:none` before opening time.
- Removes the inline hide only when the countdown reaches zero.
- Bumps CSS and JS cache-busting query strings so Cloudflare/browser cannot reuse the previous cached assets.
