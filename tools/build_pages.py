#!/usr/bin/env python3
"""
PixelPH V6 page builder.

Assembles the shared chrome (head, navigation, footer) so that every page
carries an identical header and footer, then writes the static HTML that
Cloudflare Pages serves. Page *content* lives in content_*.py next to this
file; only the chrome lives here.

Run from the project root:   python3 tools/build_pages.py
"""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
CSS_V = "20260912-v6"

# --------------------------------------------------------------------------
# Shared chrome
# --------------------------------------------------------------------------

NAV = [
    # (key, label, href-without-prefix)
    ("about", "About", "pages/about.html"),
    ("rules", "City Code", "pages/rules.html"),
    ("reputation", "Reputation", "pages/reputation.html"),
    ("membership", "Membership", "pages/membership.html"),
    ("showroom", "Showroom", "pages/showroom.html"),
]


def head(title, description, prefix, *, noindex=False, css_extra="", canonical=None):
    robots = '\n<meta name="robots" content="noindex,nofollow">' if noindex else ""
    canon = f'\n<link rel="canonical" href="{canonical}">' if canonical else ""
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<script>document.documentElement.className+=" js"</script>
<!-- Scroll reveals are scoped to html.js, so if scripting fails or the
     bundle 404s the page renders fully visible instead of blank. -->
<title>{title}</title>
<meta name="description" content="{description}">
<meta name="theme-color" content="#05070a">{robots}{canon}
<link rel="icon" href="{prefix}favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Literata:ital,opsz,wght@0,7..72,300..600;1,7..72,300..500&display=swap">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
<link rel="stylesheet" href="{prefix}pixelph-v6.css?v={CSS_V}">{css_extra}
</head>"""


def nav(prefix, active, *, cta="apply"):
    """Primary navigation. `active` is a NAV key, or None."""
    items = []
    mobile = []
    home_href = prefix if prefix else "/"
    items.append(f'      <a href="{home_href}">Home</a>')
    mobile.append(f'    <a href="{home_href}">Home</a>')
    for key, label, href in NAV:
        cls = ' class="active"' if key == active else ""
        items.append(f'      <a{cls} href="{prefix}{href}">{label}</a>')
        mobile.append(f'    <a{cls} href="{prefix}{href}">{label}</a>')
    items.append(
        '      <a data-discord-link href="#" target="_blank" rel="noopener">Discord</a>'
    )

    if cta == "apply":
        items.append(
            f'      <a href="{prefix}pages/whitelist.html" class="nav-cta nav-apply">Apply</a>'
        )
        mobile.append(f'    <a href="{prefix}pages/whitelist.html">Apply for whitelist</a>')
    elif cta == "account":
        items.append(
            f'      <a href="{prefix}pages/account.html" class="nav-cta">My PixelPH</a>'
        )
        mobile.append(f'    <a href="{prefix}pages/account.html">My PixelPH</a>')
    mobile.append(
        '    <a data-discord-link href="#" target="_blank" rel="noopener">Discord</a>'
    )

    return f"""<header class="v2-nav">
  <div class="v2-wrap nav-inner">
    <a href="{home_href}" class="brand" aria-label="PixelPH home">
      <img src="{prefix}pixelph-mark.png" alt="" width="32" height="32">
      <span>Pixel<span>PH</span></span>
    </a>
    <button class="nav-toggle" onclick="toggleMobileMenu()" aria-label="Open navigation" aria-controls="mobileMenu" aria-expanded="false"><i class="fas fa-bars"></i></button>
    <nav class="nav-links" aria-label="Primary">
{chr(10).join(items)}
    </nav>
  </div>
  <div id="mobileMenu" class="mobile-nav hidden">
{chr(10).join(mobile)}
  </div>
</header>"""


def footer(prefix):
    return f"""<footer class="v2-footer">
  <div class="v2-wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <div class="brand"><img src="{prefix}pixelph-mark.png" alt="" width="27" height="27"><span>Pixel<span>PH</span></span></div>
        <p>A whitelisted Philippine FiveM serious roleplay city built around long-term characters and consequences that stick.</p>
        <a data-discord-link href="#" target="_blank" rel="noopener" class="ghost-btn"><i class="fab fa-discord" aria-hidden="true"></i> Join Discord</a>
      </div>
      <div class="footer-col">
        <h3>The city</h3>
        <a href="{prefix}pages/about.html">About PixelPH</a>
        <a href="{prefix}pages/reputation.html">Reputation</a>
        <a href="{prefix}pages/rules.html">City Code</a>
        <a href="{prefix}pages/rulebook.html">Full rulebook</a>
      </div>
      <div class="footer-col">
        <h3>Join</h3>
        <a href="{prefix}pages/join.html">How to join</a>
        <a href="{prefix}pages/whitelist.html">Whitelist application</a>
        <a href="{prefix}pages/account.html">My PixelPH</a>
      </div>
      <div class="footer-col">
        <h3>Support the city</h3>
        <a href="{prefix}pages/membership.html">Membership</a>
        <a href="{prefix}pages/showroom.html">Showroom</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 PixelPH. All rights reserved.</span>
      <span class="footer-addr" data-server-address>play.pixelph.com:30120</span>
    </div>
  </div>
</footer>"""


def page(
    *,
    path,
    title,
    description,
    active,
    body,
    prefix="../",
    body_class="v2-body",
    cta="apply",
    scripts=(),
    noindex=False,
    css_extra="",
    skip_target="#page-main",
    show_nav=True,
    show_footer=True,
):
    tags = ['<script src="%sscript.js?v=%s"></script>' % (prefix, CSS_V)]
    tags += ['<script src="%smedia.js?v=%s"></script>' % (prefix, CSS_V)]
    for s in scripts:
        tags.append('<script src="%s%s"></script>' % (prefix, s))

    parts = [head(title, description, prefix, noindex=noindex, css_extra=css_extra)]
    parts.append(f'<body class="{body_class}">')
    parts.append(f'<a class="skip-link" href="{skip_target}">Skip to content</a>')
    parts.append('<div id="pixelphScrollProgress" aria-hidden="true"></div>')
    if show_nav:
        parts.append(nav(prefix, active, cta=cta))
    parts.append(body.strip())
    if show_footer:
        parts.append(footer(prefix))
    parts.append("\n".join(tags))
    parts.append("</body>\n</html>")

    out = PUBLIC / path
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(parts) + "\n", encoding="utf-8")
    return out


def main():
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import content_pages

    written = content_pages.build(page)
    for p in written:
        print("wrote", p.relative_to(ROOT))


if __name__ == "__main__":
    main()
