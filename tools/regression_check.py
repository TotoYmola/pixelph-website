#!/usr/bin/env python3
"""
PixelPH V6 — regression check.

Verifies that the visual redesign did not break any of the contracts the
existing JavaScript, forms and APIs depend on. Run from the project root:

    python3 tools/regression_check.py
"""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

failures = []
warnings = []
checks = 0


def check(ok, label, detail=""):
    global checks
    checks += 1
    if not ok:
        failures.append(f"{label}{(' — ' + detail) if detail else ''}")


def warn(ok, label, detail=""):
    if not ok:
        warnings.append(f"{label}{(' — ' + detail) if detail else ''}")


PAGES = {
    "index.html": PUBLIC / "index.html",
    "404.html": PUBLIC / "404.html",
    "admin.html": PUBLIC / "admin.html",
    "pages/about.html": PUBLIC / "pages/about.html",
    "pages/rules.html": PUBLIC / "pages/rules.html",
    "pages/rulebook.html": PUBLIC / "pages/rulebook.html",
    "pages/reputation.html": PUBLIC / "pages/reputation.html",
    "pages/membership.html": PUBLIC / "pages/membership.html",
    "pages/showroom.html": PUBLIC / "pages/showroom.html",
    "pages/whitelist.html": PUBLIC / "pages/whitelist.html",
    "pages/join.html": PUBLIC / "pages/join.html",
    "pages/account.html": PUBLIC / "pages/account.html",
    "pages/admin.html": PUBLIC / "pages/admin.html",
}
SRC = {name: p.read_text(encoding="utf-8") for name, p in PAGES.items() if p.exists()}
for name in PAGES:
    check(name in SRC, f"page exists: {name}")

CSS = (PUBLIC / "pixelph-v6.css").read_text(encoding="utf-8")
LEGACY_CSS = (PUBLIC / "pixelph-v3-fixed.css").read_text(encoding="utf-8")

# --------------------------------------------------------------------------
# 1. Well-formed markup
# --------------------------------------------------------------------------
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "source", "track", "wbr"}


class Nest(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag not in VOID:
            self.stack.append((tag, self.getpos()))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack:
            self.errors.append(f"stray </{tag}> at {self.getpos()}")
            return
        if self.stack[-1][0] != tag:
            for i in range(len(self.stack) - 1, -1, -1):
                if self.stack[i][0] == tag:
                    self.errors.append(
                        f"</{tag}> at {self.getpos()} closed over "
                        f"<{self.stack[-1][0]}> opened at {self.stack[-1][1]}"
                    )
                    del self.stack[i:]
                    return
            self.errors.append(f"unmatched </{tag}> at {self.getpos()}")
        else:
            self.stack.pop()


for name, src in SRC.items():
    p = Nest()
    p.feed(src)
    check(not p.errors, f"markup nesting: {name}", "; ".join(p.errors[:3]))
    check(not p.stack, f"all tags closed: {name}",
          ", ".join(f"<{t}>" for t, _ in p.stack[:5]))

# --------------------------------------------------------------------------
# 2. JavaScript contracts — every id/selector the scripts require
# --------------------------------------------------------------------------
REQUIRED_IDS = {
    "index.html": ["pixelphScrollProgress", "mobileMenu", "cityOpeningCountdown",
                   "cityOpenMessage", "cdDays", "cdHours", "cdMinutes", "cdSeconds",
                   "playerCount", "maxPlayers", "serverStatusPill"],
    "pages/whitelist.html": ["statusArea", "whitelistForm", "authArea", "authCopy",
                             "mobileMenu"],
    "pages/membership.html": ["membershipStatus", "membershipStatusTitle",
                              "membershipStatusCopy", "membershipAccountBtn",
                              "mobileMenu"],
    "pages/account.html": ["accountStatus", "accountCopy", "accountActions",
                           "historyList", "membershipActive", "queueAccess"],
    "pages/rulebook.html": ["ruleSearch", "mobileMenu"],
    "admin.html": ["adminMessage", "adminDashboard", "adminRows", "adminSearch",
                   "reviewPanel", "reviewBackdrop", "adminEmpty", "adminList",
                   "statPending", "statApproved", "statRejected", "statRevoked",
                   "statFlagged"],
}
for page, ids in REQUIRED_IDS.items():
    src = SRC.get(page, "")
    for i in ids:
        check(f'id="{i}"' in src, f"{page}: #{i} present")

# Whitelist form must keep every field name, bound and tracking hook
WL = SRC.get("pages/whitelist.html", "")
FIELDS = [
    ("character_name", None, 60, False),
    ("age", None, None, False),
    ("rp_experience", 120, 1500, True),
    ("character_concept", 180, 1800, True),
    ("scenario_conflict", 140, 1600, True),
    ("scenario_meta", 120, 1400, True),
    ("why_pixelph", 120, 1400, True),
]
for name, mn, mx, tracked in FIELDS:
    check(f'name="{name}"' in WL, f"whitelist field name={name}")
    m = re.search(r"<(?:input|textarea)[^>]*name=\"%s\"[^>]*>" % name, WL)
    check(bool(m), f"whitelist field element name={name}")
    if m:
        tag = m.group(0)
        check("required" in tag, f"whitelist {name} required")
        if mn:
            check(f'minlength="{mn}"' in tag, f"whitelist {name} minlength={mn}")
        if mx:
            check(f'maxlength="{mx}"' in tag, f"whitelist {name} maxlength={mx}")
        if tracked:
            check("data-track" in tag, f"whitelist {name} data-track")
check('name="ack"' in WL and "required" in WL, "whitelist ack checkbox required")
check(WL.count('class="char-count"') == 5, "whitelist has 5 .char-count nodes",
      f"found {WL.count('class=\"char-count\"')}")
# .char-count must be a sibling of its textarea inside the same .field
fields = re.findall(r'<div class="field">(.*?)</div>\s*</div>|<div class="field">(.*?)</div>', WL, re.S)
for blob in re.findall(r'<div class="field">(.*?)<div class="char-count">', WL, re.S):
    check("<textarea" in blob, "char-count sits in the same .field as its textarea")
check('<a href="/api/auth/login"' in WL, "whitelist Discord OAuth login link intact")
check('type="submit"' in WL and "Submit Application" in WL,
      "whitelist submit button label matches whitelist.js reset text")

# Countdown markup must survive display:block / display:flex from JS
IDX = SRC.get("index.html", "")
check('id="cityOpenMessage"' in IDX and 'hidden style="display:none"' in IDX,
      "live message stays inline-hidden before opening")
check("city-countdown" in CSS, "countdown styling present")
check(re.search(r"\.city-open-message\{[^}]*align-items", CSS) is not None,
      "live message styled for display:flex")
check(re.search(r"\.city-countdown\{[^}]*display\s*:", CSS) is None,
      "countdown root has no CSS display that would fight JS display:block")

# Shared link hooks
for page in ["index.html", "pages/join.html", "pages/account.html"]:
    check("data-connect-link" in SRC.get(page, ""), f"{page}: [data-connect-link] present")
for page in SRC:
    if page in ("admin.html", "pages/admin.html", "404.html"):
        continue
    check("data-discord-link" in SRC[page], f"{page}: [data-discord-link] present")
    check("toggleMobileMenu()" in SRC[page], f"{page}: mobile nav toggle wired")
    check('id="mobileMenu"' in SRC[page], f"{page}: mobile menu container present")

# --------------------------------------------------------------------------
# 3. Class contracts — classes written by JS must exist in a loaded stylesheet
# --------------------------------------------------------------------------
JS_WRITTEN_CLASSES = {
    # script.js / landing-polish.js
    "nav-scrolled": CSS, "is-hidden": CSS, "visible": CSS, "hidden": CSS,
    "nav-open": CSS, "media-debug": CSS, "hero-ready": CSS, "is-visible": CSS,
    # opening-countdown.js
    "countdown-connect-locked": CSS,
    # server-status.js
    "offline": CSS, "live-dot": CSS,
    # whitelist.js
    "status-box": CSS, "pending": CSS, "approved": CSS, "rejected": CSS,
    "badge": CSS, "ghost-btn": CSS, "primary-btn": CSS,
    # membership.js
    "signed-out": None, "inactive": CSS, "active": CSS,
    # account.js
    "account-status": CSS, "history-item": CSS, "admin-status": CSS,
    "membership-active-item": CSS, "membership-active-type": CSS,
    "membership-empty": CSS, "queue-pill": CSS, "prime": CSS, "city": CSS,
    "review-muted": CSS,
    # rulebook.js
    "is-current": CSS, "has-query": CSS, "no-results": CSS,
    # admin-v51.js (legacy sheet)
    "admin-tab": LEGACY_CSS, "review-drawer": LEGACY_CSS,
    "integrity-badge": LEGACY_CSS, "review-open": LEGACY_CSS,
}
for cls, sheet in JS_WRITTEN_CLASSES.items():
    if sheet is None:
        continue  # intentionally unstyled state class
    check(f".{cls}" in sheet, f"class .{cls} defined in its stylesheet")

# --------------------------------------------------------------------------
# 4. Local asset references resolve (or are intentional media placeholders)
# --------------------------------------------------------------------------
MEDIA_PREFIX = ("assets/media/", "../assets/media/", "/assets/media/")
missing_real = []
media_slots = set()
for name, src in SRC.items():
    base = (PUBLIC / name).parent
    for attr in re.findall(r'(?:src|href|poster|data-src)="([^"]+)"', src):
        if attr.startswith(("http://", "https://", "//", "#", "mailto:", "data:")):
            continue
        if attr.startswith("/api/"):
            continue
        clean = attr.split("?")[0].split("#")[0]
        if not clean:
            continue
        if any(m in clean for m in ("assets/media/",)):
            media_slots.add(clean.lstrip("./").replace("../", ""))
            continue
        target = (PUBLIC / clean.lstrip("/")) if clean.startswith("/") else (base / clean)
        # Cloudflare Pages serves clean URLs, so /admin resolves admin.html
        pretty = Path(str(target) + ".html")
        if not target.exists() and not pretty.exists():
            missing_real.append(f"{name} -> {attr}")
check(not missing_real, "all non-media local assets resolve", "; ".join(missing_real[:6]))

# --------------------------------------------------------------------------
# 5. Stylesheet wiring
# --------------------------------------------------------------------------
for name, src in SRC.items():
    if name in ("admin.html", "pages/admin.html"):
        continue
    check("pixelph-v6.css" in src, f"{name}: loads pixelph-v6.css")
    check("pixelph-v3-fixed.css" not in src, f"{name}: no longer loads the old sheet")
check("pixelph-v3-fixed.css" in SRC.get("admin.html", ""),
      "admin.html still loads its original stylesheet (left untouched)")
check("pixelph-v6.css" not in SRC.get("admin.html", ""),
      "admin.html is not affected by the redesign")

# --------------------------------------------------------------------------
# 6. Branding hygiene and placeholder text
# --------------------------------------------------------------------------
for name, src in SRC.items():
    low = src.lower()
    check("prodigy" not in low, f"{name}: no Prodigy branding")
    check("prestige" not in low, f"{name}: no Prestige branding")
    check("lorem ipsum" not in low, f"{name}: no lorem ipsum")
    check("todo" not in low and "fixme" not in low, f"{name}: no TODO/FIXME left")
    check("placeholder-text" not in low, f"{name}: no placeholder markers")

# --------------------------------------------------------------------------
# 7. Preserved figures
# --------------------------------------------------------------------------
MEM = SRC.get("pages/membership.html", "")
for token in [">80<", ">10<", ">100<", "<strong>200</strong>", "<strong>500</strong>",
              "10 Prime reserved slots", "Regular capacity", "Prime reserve",
              "Staff reserve", "Total slots"]:
    check(token in MEM, f"membership keeps figure/label: {token}")
check("City Priority" in MEM and "Prime Access" in MEM, "both membership products present")
check(MEM.count('title="Tebex package link pending"') == 2,
      "both Tebex buttons keep their disabled state and title")

SHOW = SRC.get("pages/showroom.html", "")
for prod in ["Business Commission", "Signature Look", "Signature Vehicle", "Signature Ped"]:
    check(prod in SHOW, f"showroom keeps product: {prod}")

check("2026-09-18T20:00:00+08:00" in (PUBLIC / "opening-countdown.js").read_text(),
      "countdown target date unchanged")
check("2026-09-18T20:00:00+08:00" in (PUBLIC / "script.js").read_text(),
      "PIXELPH.openingTime unchanged")
check("18 September 2026" in IDX and "8:00 PM PHT" in IDX,
      "homepage states the opening date and time")

# --------------------------------------------------------------------------
# 8. Overflow / responsive hygiene
# --------------------------------------------------------------------------
check("overflow-x:hidden" in CSS.replace(" ", ""), "body clips horizontal overflow")
check("prefers-reduced-motion" in CSS, "reduced motion respected in CSS")
check("prefers-reduced-motion" in (PUBLIC / "script.js").read_text(),
      "reduced motion respected in script.js")
check("prefers-reduced-motion" in (PUBLIC / "media.js").read_text(),
      "reduced motion respected in media.js")
for name, src in SRC.items():
    if name in ("admin.html", "pages/admin.html"):
        continue
    check('name="viewport"' in src, f"{name}: viewport meta present")
warn_widths = [n for n, s in SRC.items() if re.search(r'width:\s*\d{4,}px', s)]
warn(not warn_widths, "no hard-coded four-digit pixel widths inline",
     ", ".join(warn_widths))

# --------------------------------------------------------------------------
# 9. Accessibility basics
# --------------------------------------------------------------------------
for name, src in SRC.items():
    if name in ("admin.html", "pages/admin.html"):
        continue
    check(src.count("<h1") == 1, f"{name}: exactly one h1",
          f"found {src.count('<h1')}")
    check("skip-link" in src, f"{name}: skip link present")
    imgs = re.findall(r"<img[^>]*>", src)
    check(all("alt=" in i for i in imgs), f"{name}: every img has alt",
          f"{sum(1 for i in imgs if 'alt=' not in i)} missing")
check("focus-visible" in CSS, "visible keyboard focus styles present")
check('aria-expanded' in IDX, "nav toggle exposes aria-expanded")

# --------------------------------------------------------------------------
# 10. Backend untouched
# --------------------------------------------------------------------------
for f in ["functions/_lib/auth.js", "functions/_lib/discord.js",
          "functions/api/applications/index.js", "functions/api/applications/me.js",
          "functions/api/applications/history.js", "functions/api/auth/login.js",
          "functions/api/auth/callback.js", "functions/api/auth/logout.js",
          "functions/api/admin/applications.js", "functions/api/admin/applications/[id].js",
          "functions/api/membership/me.js", "functions/api/membership/queue.js",
          "functions/api/whitelist.js", "functions/api/whitelist/[discordId].js",
          "schema.sql", "public/_headers", "public/_redirects",
          "public/admin-v51.js", "public/admin.html", "public/account.js",
          "public/membership.js", "public/whitelist.js",
          "public/opening-countdown.js", "public/server-status.js",
          "public/pixelph-v3-fixed.css",
          "server-integration/pixelph_whitelist/server.lua"]:
    check((ROOT / f).exists(), f"preserved file present: {f}")

# --------------------------------------------------------------------------
# Report
# --------------------------------------------------------------------------
print(f"\nMedia slots referenced ({len(media_slots)}):")
for slot in sorted(media_slots):
    print("  " + slot)

print(f"\n{checks} checks run.")
if warnings:
    print(f"\n{len(warnings)} warning(s):")
    for w in warnings:
        print("  ! " + w)
if failures:
    print(f"\n{len(failures)} FAILURE(S):")
    for f in failures:
        print("  x " + f)
    sys.exit(1)
print("\nAll checks passed.")
