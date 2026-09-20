#!/usr/bin/env python3
"""
PixelPH V6 — City Code (rulebook) rebuild.

Reads the approved V5.13 rulebook, lifts every .rules-category section and the
closing standard notice out of it *byte for byte*, and re-seats them in the new
document chrome. No rule text, example, keybind or policy wording is altered:
this script only changes what surrounds them.

Run from the project root:   python3 tools/build_rulebook.py
"""
import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
SOURCE = ROOT / "reference" / "rulebook-v513-source.html"
TARGET = PUBLIC / "pages" / "rulebook.html"

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_pages import head, nav, footer, CSS_V  # noqa: E402

CATEGORY_RE = re.compile(
    r'<section class="rules-category"[^>]*>.*?</section>', re.S
)
NOTICE_RE = re.compile(r'<div class="notice warn">.*?</div>', re.S)
H2_RE = re.compile(r"<h2>(.*?)</h2>", re.S)
ID_RE = re.compile(r'id="([^"]+)"')


def strip_tags(fragment):
    return html.unescape(re.sub(r"<[^>]+>", "", fragment)).strip()


def main():
    src = SOURCE.read_text(encoding="utf-8")

    categories = CATEGORY_RE.findall(src)
    if len(categories) < 5:
        raise SystemExit(f"Expected the full set of rule sections, found {len(categories)}")

    notice = NOTICE_RE.search(src)
    if not notice:
        raise SystemExit("Closing PixelPH standard notice not found in source")

    # Build the contents list from the sections themselves, so it can never
    # drift out of sync with the document.
    toc = []
    for block in categories:
        cat_id = ID_RE.search(block).group(1)
        title = strip_tags(H2_RE.search(block).group(1))
        toc.append((cat_id, title))

    rule_count = sum(block.count("rule-search-item") for block in categories)

    toc_html = "\n".join(
        f'        <a href="#{cid}">{html.escape(title)}</a>' for cid, title in toc
    )

    body = f"""
<main id="page-main" class="page-shell">

<section class="page-hero">
  <div class="page-hero-bg ph-frame tone-cold" data-media="assets/media/city/city-courthouse-02.webp">
<span class="plate-skyline" aria-hidden="true"></span>
    <img src="../assets/media/city/city-courthouse-02.webp" alt="" loading="lazy" decoding="async">
  </div>
  <div class="v2-wrap">
    <div class="rail">
      <p class="lead-in">The PixelPH City Code</p>
      <h1>Server rules</h1>
      <p>PixelPH&rsquo;s independent Serious RP rulebook: written for our city, our systems, and our long-term roleplay standard.</p>
    </div>
  </div>
</section>

<section class="page-section">
  <div class="v2-wrap faq full-rulebook">
    <div class="rules-layout">

      <aside class="rules-sidebar" aria-label="Rule categories">
        <nav class="rules-category-nav">
{toc_html}
        </nav>
        <div class="rules-sidebar-more">
          <p>Also in the City Code</p>
          <a href="commandbook.html">Command Book</a>
          <a href="keybinds.html">Keybinds</a>
        </div>
      </aside>

      <div class="rules-content">
        <div class="rules-search-wrap">
          <div class="rules-search-field">
            <i class="fas fa-magnifying-glass" aria-hidden="true"></i>
            <input aria-label="Search PixelPH rules" autocomplete="off" class="rules-search" id="ruleSearch" placeholder="Search the City Code &mdash; metagaming, 4-man, NLR, gang war&hellip;" type="search">
            <button class="rules-search-clear" type="button" aria-label="Clear search"><i class="fas fa-xmark" aria-hidden="true"></i></button>
          </div>
          <div class="rules-search-count" role="status" aria-live="polite"></div>
        </div>

        <div class="rules-reading-guide">
          <span>Browse by section.</span>
          <span>Search any term to filter the whole document.</span>
          <span>Around fifteen minutes end to end.</span>
        </div>

        <div class="rules-no-results">
          <strong>Nothing matches that term.</strong>
          Try a shorter phrase, or clear the search to read the City Code in full. If a situation genuinely is not covered, ask staff in Discord.
        </div>

{chr(10).join(categories)}

        {notice.group(0)}
      </div>

    </div>
  </div>
</section>

</main>
"""

    parts = [
        head(
            "Full City Code | PixelPH",
            "Complete PixelPH Serious Roleplay rules and gameplay standards.",
            "../",
        ),
        '<body class="v2-body rules-page">',
        '<a class="skip-link" href="#page-main">Skip to content</a>',
        '<div id="pixelphScrollProgress" aria-hidden="true"></div>',
        nav("../", "rules"),
        body.strip(),
        '<button class="to-top" type="button" aria-label="Back to top"><i class="fas fa-arrow-up" aria-hidden="true"></i></button>',
        footer("../"),
        f'<script src="../script.js?v={CSS_V}"></script>',
        f'<script src="../media.js?v={CSS_V}"></script>',
        f'<script src="../rulebook.js?v={CSS_V}"></script>',
        "</body>\n</html>",
    ]

    TARGET.write_text("\n".join(parts) + "\n", encoding="utf-8")
    print(f"wrote {TARGET.relative_to(ROOT)}")
    print(f"  sections: {len(toc)}")
    print(f"  rule entries: {rule_count}")
    for cid, title in toc:
        print(f"    #{cid} — {title}")


if __name__ == "__main__":
    main()
