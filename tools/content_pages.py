#!/usr/bin/env python3
"""PixelPH V6 — inner page content.

All policy copy, product names, prices, capacity figures, priority weights,
form fields and API hooks are carried over from V5.13 unchanged. Only the
presentation around them is new.
"""

# ==========================================================================
# ABOUT
# ==========================================================================
ABOUT = """
<main id="page-main" class="page-shell">

<section class="page-hero">
  <div class="page-hero-bg ph-frame tone-cold" data-media="assets/media/city/city-aerial-01.webp">
<span class="plate-skyline" aria-hidden="true"></span>
    <img src="../assets/media/city/city-aerial-01.webp" alt="" loading="lazy" decoding="async">
  </div>
  <div class="v2-wrap">
    <div class="rail">
      <p class="lead-in">About PixelPH</p>
      <h1>Serious roleplay, built around people</h1>
      <p>PixelPH is a whitelisted Philippine FiveM community focused on believable characters, long-term progression, and player-driven stories.</p>
    </div>
  </div>
</section>

<section class="band">
  <div class="v2-wrap split">
    <div class="split-copy rail">
      <h2 class="t-headline">Roleplay comes before grinding.</h2>
      <p class="prose">We want a city where roleplay comes before grinding. Systems exist to create interactions, decisions, conflict, cooperation, and stories &mdash; not to replace them.</p>
      <p class="prose">Characters are expected to grow over time. Careers, homes, possessions, reputation, and relationships are treated as part of one continuous journey.</p>
    </div>
    <div class="split-media reveal-mask">
      <div class="ph-frame ar-portrait tone-mint" data-media="assets/media/lifestyle/city-life-02.webp">
<span class="plate-skyline" aria-hidden="true"></span>
        <img src="../assets/media/lifestyle/city-life-02.webp" alt="Residents of PixelPH in conversation" loading="lazy" decoding="async">
      </div>
    </div>
  </div>
</section>

<section class="band band-hair">
  <div class="v2-wrap">
    <div class="sec-head">
      <div class="rail">
        <h2 class="t-section">What the city is built on</h2>
      </div>
      <p>Four commitments that shape how PixelPH is designed, moderated and grown.</p>
    </div>
    <div class="content-grid">
      <article class="content-card">
        <div class="icon"><i class="fas fa-compass" aria-hidden="true"></i></div>
        <h2>Our direction</h2>
        <p>We want a city where roleplay comes before grinding. Systems exist to create interactions, decisions, conflict, cooperation, and stories&mdash;not to replace them.</p>
      </article>
      <article class="content-card">
        <div class="icon"><i class="fas fa-seedling" aria-hidden="true"></i></div>
        <h2>Long-term progression</h2>
        <p>Characters are expected to grow over time. Careers, homes, possessions, reputation, and relationships are treated as part of one continuous journey.</p>
      </article>
      <article class="content-card">
        <div class="icon"><i class="fas fa-users" aria-hidden="true"></i></div>
        <h2>Community standards</h2>
        <p>Whitelist review helps protect the quality of the city. We value mature roleplay, respect for other players, and the ability to create scenes that everyone can build on.</p>
      </article>
      <article class="content-card">
        <div class="icon"><i class="fas fa-screwdriver-wrench" aria-hidden="true"></i></div>
        <h2>Built for PixelPH</h2>
        <p>The city combines custom systems and carefully integrated resources around one consistent experience, from civilian life and emergency services to criminal progression.</p>
      </article>
    </div>
  </div>
</section>

<section class="quote-plate">
  <div class="ph-frame tone-deep" data-media="assets/media/city/city-night-03.webp">
<span class="plate-skyline" aria-hidden="true"></span>
    <img src="../assets/media/city/city-night-03.webp" alt="" loading="lazy" decoding="async">
  </div>
  <div class="quote-inner">
    <blockquote>Whitelist review is not gatekeeping for its own sake. It is how the city stays worth entering.</blockquote>
    <cite>PixelPH staff</cite>
  </div>
</section>

<section class="band">
  <div class="v2-wrap sec-head">
    <div class="rail">
      <h2 class="t-section">Ready to apply?</h2>
      <p class="prose">Read the City Code first, then write your application in your own words.</p>
      <div class="btn-row" style="margin-top:26px">
        <a href="whitelist.html" class="primary-btn">Start your application</a>
        <a href="rules.html" class="ghost-btn">Read the City Code</a>
      </div>
    </div>
  </div>
</section>

</main>
"""

# ==========================================================================
# RULES OVERVIEW  (all pillar copy preserved verbatim from V5.13)
# ==========================================================================
RULES_PILLARS = [
    ("Character &amp; city standards",
     "Stay in character, keep IC information inside the city, use believable characters, and protect active scenes."),
    ("Gameplay integrity",
     "No cheats, exploits, duplication, mechanic abuse, multi-character asset transfers, or unauthorized real-money trading."),
    ("Life, injury &amp; recovery",
     "Violence needs context. Value your life, escalate properly, respect injuries, recovery, and the New Life Rule."),
    ("Criminal scene standards",
     "Criminal scenes must create RP. Standard PvP-oriented criminal activity uses a four-person active participant limit unless explicitly exempted."),
    ("Organizations &amp; territory",
     "Gangs build reputation through RP. Territory, wars, alliances, representation, and conflict must have story and clear boundaries."),
    ("Emergency &amp; government scenes",
     "Emergency and whitelisted roles are part of the story. Respect their scenes and never abuse privileged job mechanics."),
    ("Scene protection",
     "No camping, repeated targeting, third-party scene insertion, restart abuse, or other behavior designed only to farm outcomes."),
    ("Reports &amp; evidence",
     "Finish scenes when reasonably possible, then use official tickets with full context and evidence. Keep staff cases confidential."),
]

_rules_rows = "\n".join(
    f"""      <li>
        <a href="rulebook.html">
          <span class="ci-n">{i:02d}</span>
          <div>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
          <span class="ci-go" aria-hidden="true"><i class="fas fa-arrow-right"></i></span>
        </a>
      </li>"""
    for i, (title, body) in enumerate(RULES_PILLARS, start=1)
)

RULES = f"""
<main id="page-main" class="page-shell">

<section class="page-hero">
  <div class="page-hero-bg ph-frame tone-cold" data-media="assets/media/city/city-courthouse-01.webp">
<span class="plate-skyline" aria-hidden="true"></span>
    <img src="../assets/media/city/city-courthouse-01.webp" alt="" loading="lazy" decoding="async">
  </div>
  <div class="v2-wrap">
    <div class="rail">
      <p class="lead-in">The PixelPH City Code</p>
      <h1>Story before victory</h1>
      <p>PixelPH is a Serious Roleplay community built around believable characters, meaningful consequences, and long-term stories. Every player is responsible for knowing the City Code.</p>
      <div class="btn-row" style="margin-top:30px">
        <a class="primary-btn" href="rulebook.html">Read the full City Code</a>
        <a class="ghost-btn" data-discord-link href="#" rel="noopener" target="_blank">Ask in Discord</a>
      </div>
    </div>
  </div>
</section>

<section class="band-tight">
  <div class="v2-wrap">
    <div class="notice">
      <i class="fas fa-scale-balanced" aria-hidden="true"></i>
      <div>
        <strong>The PixelPH standard</strong>
        <p>Character before Player. Story before Victory. Consequences before Convenience. A technical loophole does not override the intent of Serious RP.</p>
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="v2-wrap">
    <div class="sec-head">
      <div class="rail">
        <h2 class="t-section">Eight sections, one standard</h2>
      </div>
      <p>An overview of what the City Code covers. Each section links through to the full text, where every rule is written out with its examples.</p>
    </div>
    <ul class="code-index">
{_rules_rows}
    </ul>
  </div>
</section>

<section class="band band-hair">
  <div class="v2-wrap sec-head">
    <div class="rail">
      <h2 class="t-section">Read it properly before you apply</h2>
      <p class="prose">The full City Code is searchable and reads in about fifteen minutes. Most rejected applications come from players who skipped it.</p>
      <div class="btn-row" style="margin-top:26px">
        <a class="primary-btn" href="rulebook.html">Open the full City Code</a>
        <a class="ghost-btn" href="whitelist.html">Apply for whitelist</a>
      </div>
    </div>
  </div>
</section>

</main>
"""

# ==========================================================================
# REPUTATION
# ==========================================================================
REPUTATION = """
<main id="page-main" class="page-shell reputation-shell">

<section class="page-hero reputation-hero">
  <div class="page-hero-bg ph-frame tone-deep" data-media="assets/media/criminal/underground-meeting-01.webp">
<span class="plate-skyline" aria-hidden="true"></span>
    <img src="../assets/media/criminal/underground-meeting-01.webp" alt="" loading="lazy" decoding="async">
  </div>
  <div class="v2-wrap">
    <div class="rail">
      <p class="lead-in">Reputation &amp; progression</p>
      <h1>Your name carries weight</h1>
      <p>PixelPH progression is built around reputation, relationships, and information. Opportunities are earned through roleplay &mdash; not unlocked by a menu, a donation, or a shortcut.</p>
      <div class="reputation-hero-meta">
        <span><i class="fas fa-user-secret" aria-hidden="true"></i> Contact-driven progression</span>
        <span><i class="fas fa-book-open" aria-hidden="true"></i> Persistent clues &amp; notes</span>
        <span><i class="fas fa-route" aria-hidden="true"></i> Multi-stage opportunities</span>
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="v2-wrap">
    <div class="sec-head">
      <div class="rail">
        <h2 class="t-headline">Nobody knows you yet.</h2>
      </div>
      <p>That is the starting condition, and it is deliberate. Everything below happens to your character in the city, at the pace other people decide to trust you.</p>
    </div>

    <div class="arc" aria-label="How reputation develops">
      <div class="arc-stage">
        <b>Unknown</b>
        <p>A face with no history. Doors are closed, and nobody has a reason to open them.</p>
      </div>
      <div class="arc-stage">
        <b>Contacts</b>
        <p>Somebody puts your name forward. Small work, watched closely, easy to lose.</p>
      </div>
      <div class="arc-stage">
        <b>Trust</b>
        <p>You did what you said. People start speaking about you when you are not in the room.</p>
      </div>
      <div class="arc-stage">
        <b>Reputation</b>
        <p>Your track record travels ahead of you &mdash; the good parts and the rest of it.</p>
      </div>
      <div class="arc-stage">
        <b>Opportunities</b>
        <p>Work that was never on any list becomes possible, because of who will vouch for you.</p>
      </div>
    </div>
  </div>
</section>

<section class="band band-hair">
  <div class="v2-wrap">
    <div class="reputation-intro sec-head">
      <div class="rail">
        <h2 class="t-section">Progression that feels like part of the city.</h2>
      </div>
      <p>Instead of seeing every activity on day one, characters build trust and discover leads over time. Your decisions, contacts, and reputation determine which doors begin to open.</p>
    </div>

    <div class="reputation-grid">
      <article>
        <i class="fas fa-handshake" aria-hidden="true"></i><span>01</span>
        <h3>Build reputation</h3>
        <p>Complete legitimate and underground roleplay, work with contacts, and develop a track record tied to your character.</p>
      </article>
      <article>
        <i class="fas fa-phone" aria-hidden="true"></i><span>02</span>
        <h3>Meet the right people</h3>
        <p>NPC and phone-based contacts can introduce opportunities when your reputation and previous actions support it.</p>
      </article>
      <article>
        <i class="fas fa-note-sticky" aria-hidden="true"></i><span>03</span>
        <h3>Collect information</h3>
        <p>Important clues, instructions, and discoveries can be saved in your character's notebook instead of disappearing after a session.</p>
      </article>
      <article>
        <i class="fas fa-lock-open" aria-hidden="true"></i><span>04</span>
        <h3>Unlock new paths</h3>
        <p>Higher-risk opportunities become available naturally as your character proves they can be trusted with more sensitive work.</p>
      </article>
    </div>

    <div class="reputation-flow">
      <div class="reputation-flow-copy rail">
        <h2>Small risks can lead to bigger ones.</h2>
        <p class="prose">The underground is designed as a connected progression instead of a collection of isolated robbery markers. Early activity may expose a clue, a contact, or a lead that points toward a more complex opportunity later.</p>
        <div class="reputation-rule">
          <i class="fas fa-eye-slash" aria-hidden="true"></i>
          <div>
            <strong>No public recipe book.</strong>
            <p>Exact methods, clue locations, requirements, and procedures stay inside the city so discovery remains part of RP.</p>
          </div>
        </div>
      </div>
      <div class="reputation-ladder" aria-label="Underground progression path">
        <div class="rep-step"><b>Street</b><span>Early opportunities</span></div>
        <i class="fas fa-chevron-down" aria-hidden="true"></i>
        <div class="rep-step"><b>Trusted</b><span>Better contacts &amp; intel</span></div>
        <i class="fas fa-chevron-down" aria-hidden="true"></i>
        <div class="rep-step"><b>Connected</b><span>Coordinated operations</span></div>
        <i class="fas fa-chevron-down" aria-hidden="true"></i>
        <div class="rep-step"><b>High risk</b><span>Advanced opportunities</span></div>
      </div>
    </div>

    <div class="notebook-panel">
      <div class="reveal-mask">
        <div class="ph-frame ar-photo tone-sodium" data-media="assets/media/criminal/notebook-clues-01.webp">
<span class="plate-skyline" aria-hidden="true"></span>
          <img src="../assets/media/criminal/notebook-clues-01.webp" alt="A character's notebook of clues and contacts" loading="lazy" decoding="async">
        </div>
      </div>
      <div class="rail">
        <h2>Information you can actually keep.</h2>
        <p class="prose">Clues and useful information can persist with your character in a notebook-style system. Pages can become part of planning, investigation, teamwork, and long-term storylines.</p>
        <div class="notebook-tags">
          <span>Persistent pages</span>
          <span>Character-linked</span>
          <span>Clue progression</span>
          <span>Share through RP</span>
        </div>
      </div>
    </div>

    <div class="reputation-disclaimer">
      <i class="fas fa-scale-balanced" aria-hidden="true"></i>
      <div>
        <strong>Reputation is not immunity.</strong>
        <p>Higher reputation does not protect a character from police, consequences, loss, or server rules. It only represents earned trust and progression within supported systems.</p>
      </div>
    </div>
  </div>
</section>

<section class="band band-hair">
  <div class="v2-wrap sec-head">
    <div class="rail">
      <h2 class="t-section">Start at unknown.</h2>
      <p class="prose">Everyone does. Submit your application and the first contact you make will be in character.</p>
      <div class="btn-row" style="margin-top:26px">
        <a href="whitelist.html" class="primary-btn">Apply for whitelist</a>
        <a href="rules.html" class="ghost-btn">Read the City Code</a>
      </div>
    </div>
  </div>
</section>

</main>
"""

# ==========================================================================
# MEMBERSHIP
# Products, priority weights, capacity split and all API hooks unchanged.
# Prices (PHP 200 / PHP 500 per 30 days) supplied by the owner.
# ==========================================================================
MEMBERSHIP = """
<main id="page-main" class="page-shell membership-shell">

<section class="page-hero membership-hero">
  <div class="page-hero-bg ph-frame tone-mint" data-media="assets/media/city/city-night-04.webp">
<span class="plate-skyline" aria-hidden="true"></span>
    <img src="../assets/media/city/city-night-04.webp" alt="" loading="lazy" decoding="async">
  </div>
  <div class="v2-wrap">
    <div class="rail">
      <p class="lead-in">Support the city</p>
      <h1>Membership</h1>
      <p>Membership is focused on queue access only &mdash; built for convenience without changing RP rules, economy, or in-city advantages.</p>
      <div class="membership-hero-meta">
        <span><i class="fas fa-shield-halved" aria-hidden="true"></i> Queue access only</span>
        <span><i class="fas fa-scale-balanced" aria-hidden="true"></i> No pay-to-win benefits</span>
        <span><i class="fas fa-user-lock" aria-hidden="true"></i> Linked to your Discord account</span>
      </div>
    </div>
  </div>
</section>

<section class="page-section">
  <div class="v2-wrap">

    <div id="membershipStatus" class="membership-status-card">
      <div>
        <div class="section-kicker">My membership</div>
        <h2 id="membershipStatusTitle">Sign in to view your active packages</h2>
        <p id="membershipStatusCopy">Your supporter access and expiry dates will appear here once activated.</p>
      </div>
      <a id="membershipAccountBtn" class="ghost-btn" href="/pages/account.html">Open My PixelPH</a>
    </div>

    <div class="membership-section-head">
      <div class="rail">
        <h2>Priority that respects the queue.</h2>
      </div>
      <p>Priority access changes your place in line. It never kicks connected players and cannot bypass a truly full server.</p>
    </div>

    <div class="membership-grid priority-grid">
      <article class="membership-card city-priority">
        <div class="membership-card-top">
          <span class="membership-type">Queue priority</span>
          <i class="fas fa-road" aria-hidden="true"></i>
        </div>
        <h3>City Priority</h3>
        <div class="membership-price-tag"><b>&#8369;200</b><span>per 30 days</span></div>
        <p class="membership-lead">Move ahead of regular whitelisted players when the city queue is active.</p>
        <ul>
          <li>Priority weight: <strong>200</strong></li>
          <li>30-day access model</li>
          <li>No reserved slot allocation</li>
          <li>Below Prime Access and Staff</li>
        </ul>
        <div class="membership-card-footer">
          <span class="membership-price">30-day access &middot; Tebex</span>
          <button class="primary-btn" type="button" disabled title="Tebex package link pending">Tebex checkout</button>
        </div>
      </article>

      <article class="membership-card prime-access featured">
        <div class="membership-ribbon">Highest player priority</div>
        <div class="membership-card-top">
          <span class="membership-type">Reserved access</span>
          <i class="fas fa-bolt" aria-hidden="true"></i>
        </div>
        <h3>Prime Access</h3>
        <div class="membership-price-tag"><b>&#8369;500</b><span>per 30 days</span></div>
        <p class="membership-lead">Highest player queue priority below PixelPH staff, with access to Prime reserved capacity when available.</p>
        <ul>
          <li>Priority weight: <strong>500</strong></li>
          <li>30-day access model</li>
          <li>Uses the <strong>10 Prime reserved slots</strong></li>
          <li>Never consumes Staff-only reserve</li>
          <li>No player is kicked to make room</li>
        </ul>
        <div class="membership-card-footer">
          <span class="membership-price">30-day access &middot; Tebex</span>
          <button class="primary-btn" type="button" disabled title="Tebex package link pending">Tebex checkout</button>
        </div>
      </article>
    </div>

    <div class="membership-section-head">
      <div class="rail">
        <h2>How the 100 slots are split.</h2>
      </div>
      <p>Reserved capacity exists so the city does not lock out its staff or its supporters during peak hours. It does not add slots.</p>
    </div>

    <div class="queue-capacity">
      <div><span>80</span><small>Regular capacity</small></div>
      <div><span>10</span><small>Prime reserve</small></div>
      <div><span>10</span><small>Staff reserve</small></div>
      <div class="queue-total"><span>100</span><small>Total slots</small></div>
    </div>

    <div class="membership-section-head">
      <div class="rail">
        <h2>What membership does, and what it never does.</h2>
      </div>
      <p>If you are weighing this up, this is the part that matters. Membership buys you time in a queue. Nothing else.</p>
    </div>

    <div class="fairplay">
      <div class="fairplay-yes">
        <h3><i class="fas fa-check" aria-hidden="true"></i> What you get</h3>
        <ul>
          <li>A better position in the connection queue during busy hours</li>
          <li>For Prime Access, eligibility for the 10 Prime reserved slots</li>
          <li>A 30-day access period tied to your Discord account</li>
          <li>Your membership status visible on My PixelPH</li>
        </ul>
      </div>
      <div class="fairplay-no">
        <h3><i class="fas fa-ban" aria-hidden="true"></i> What it never gives you</h3>
        <ul>
          <li>No money, items, vehicles, property or economy boost</li>
          <li>No combat, handling, visibility or performance advantage</li>
          <li>No exemption from any rule, ruling or staff decision</li>
          <li>No whitelist approval &mdash; that is reviewed separately and on merit</li>
          <li>No priority in roleplay scenes, reports or staff tickets</li>
        </ul>
      </div>
    </div>

    <div class="showroom-bridge">
      <div>
        <h2>Looking for character, vehicle or business commissions?</h2>
        <p>Custom exclusives now live in the PixelPH Showroom and are handled through Discord. They are not part of Membership or queue access.</p>
      </div>
      <a class="primary-btn" href="showroom.html"><i class="fas fa-store" aria-hidden="true"></i> Enter Showroom</a>
    </div>

    <div class="membership-disclaimer">
      <i class="fas fa-circle-info" aria-hidden="true"></i>
      <div>
        <strong>Membership does not replace whitelist approval.</strong>
        <p>All members follow the same city rules, staff decisions, and roleplay standards. Reserved access only applies while eligible capacity is available; at a true 100/100 population, entry still requires a player to leave.</p>
      </div>
    </div>

  </div>
</section>

</main>
"""

# ==========================================================================
# SHOWROOM  (four products, copy and constraints unchanged)
# ==========================================================================
SHOWROOM_ITEMS = [
    ("Business commission", "fas fa-building", "Business Commission",
     "assets/media/businesses/showroom-business-01.webp",
     "For approved player-owned businesses that want a more distinctive presence in PixelPH.",
     ["Branding and visual presentation requests",
      "Scope reviewed with staff before fulfillment",
      "No free cash, stock, ownership advantage, or economy boost"],
     "Discuss your concept with staff"),
    ("Exclusive hair", "fas fa-scissors", "Signature Look",
     "assets/media/characters/showroom-look-01.webp",
     "Character-focused exclusive hair selections for players who want a recognizable visual identity.",
     ["Character-linked request",
      "Reviewed for visual quality and RP fit",
      "Availability confirmed through staff"],
     "Preview and request through Discord"),
    ("Lore-friendly vehicle", "fas fa-car-side", "Signature Vehicle",
     "assets/media/vehicles/showroom-vehicle-01.webp",
     "A curated lore-friendly vehicle commission designed around character identity, not performance advantage.",
     ["Lore-friendly models only",
      "No OP handling, armor, or unrealistic performance",
      "Vehicle class and balance reviewed by staff"],
     "Ask staff about current vehicle availability"),
    ("Exclusive ped", "fas fa-person", "Signature Ped",
     "assets/media/characters/showroom-ped-01.webp",
     "An exclusive custom ped or character model for a distinct RP identity, subject to fair-play review.",
     ["Serious RP appropriate models only",
      "No hitbox, visibility, or combat advantage",
      "No troll or inappropriate models"],
     "Submit your reference through Discord"),
]

_tones = ["tone-sodium", "tone-mint", "tone-cold", "tone-deep"]
_showroom_cards = "\n".join(
    f"""      <article class="membership-card showroom-card">
        <div class="ph-frame {_tones[i % len(_tones)]}" data-media="{media}">
<span class="plate-skyline" aria-hidden="true"></span>
          <img src="../{media}" alt="" loading="lazy" decoding="async">
        </div>
        <div class="showroom-card-inner">
          <div class="membership-card-top">
            <span class="membership-type">{kind}</span>
            <i class="{icon}" aria-hidden="true"></i>
          </div>
          <h3>{name}</h3>
          <p>{blurb}</p>
          <ul>
{chr(10).join(f'            <li>{b}</li>' for b in bullets)}
          </ul>
          <div class="showroom-card-footer">
            <span>{footer}</span>
            <a data-discord-link class="ghost-btn" href="#" target="_blank" rel="noopener"><i class="fab fa-discord" aria-hidden="true"></i> Open Discord</a>
          </div>
        </div>
      </article>"""
    for i, (kind, icon, name, media, blurb, bullets, footer) in enumerate(SHOWROOM_ITEMS)
)

SHOWROOM = f"""
<main id="page-main" class="page-shell membership-shell">

<section class="page-hero membership-hero showroom-hero">
  <div class="page-hero-bg ph-frame tone-sodium" data-media="assets/media/vehicles/showroom-hero-01.webp">
<span class="plate-skyline" aria-hidden="true"></span>
    <img src="../assets/media/vehicles/showroom-hero-01.webp" alt="" loading="lazy" decoding="async">
  </div>
  <div class="v2-wrap">
    <div class="rail">
      <p class="lead-in">Curated PixelPH exclusives</p>
      <h1>Showroom</h1>
      <p>A display space for custom commissions that shape identity and presentation without creating gameplay advantages. Browse the categories, then open a Discord ticket to discuss availability, requirements, and fulfillment.</p>
      <div class="membership-hero-meta">
        <span><i class="fas fa-eye" aria-hidden="true"></i> Showroom only</span>
        <span><i class="fab fa-discord" aria-hidden="true"></i> Transactions via Discord</span>
        <span><i class="fas fa-shield-halved" aria-hidden="true"></i> Staff-reviewed</span>
      </div>
    </div>
  </div>
</section>

<section class="page-section">
  <div class="v2-wrap">
    <div class="showroom-notice">
      <i class="fas fa-circle-info" aria-hidden="true"></i>
      <div>
        <strong>No direct checkout on this page.</strong>
        <p>Every showroom request is reviewed and completed through PixelPH Discord. Availability, scope, pricing, and delivery are confirmed by staff before any transaction.</p>
      </div>
    </div>

    <div class="membership-section-head">
      <div class="rail">
        <h2>Build a distinct identity in the city.</h2>
      </div>
      <p>Each collection is curated around Serious RP. Exclusivity is visual and narrative &mdash; never a shortcut to money, power, combat, or staff privilege.</p>
    </div>

    <div class="membership-grid supporter-grid showroom-grid">
{_showroom_cards}
    </div>

    <div class="membership-disclaimer">
      <i class="fas fa-scale-balanced" aria-hidden="true"></i>
      <div>
        <strong>Showroom exclusives do not provide RP immunity or gameplay privilege.</strong>
        <p>All requests remain subject to PixelPH rules, staff approval, technical compatibility, and availability. Membership queue access is handled separately on the Membership page.</p>
      </div>
    </div>
  </div>
</section>

</main>
"""

# ==========================================================================
# WHITELIST
# The form is reproduced field for field: names, minlength, maxlength,
# required, data-track and the .char-count sibling inside each .field are all
# exactly as whitelist.js expects.
# ==========================================================================
WHITELIST = """
<main id="page-main" class="page-shell">

<section class="page-hero">
  <div class="page-hero-bg ph-frame tone-cold" data-media="assets/media/city/city-gate-01.webp">
<span class="plate-skyline" aria-hidden="true"></span>
    <img src="../assets/media/city/city-gate-01.webp" alt="" loading="lazy" decoding="async">
  </div>
  <div class="v2-wrap">
    <div class="rail">
      <p class="lead-in">Whitelist application</p>
      <h1>Show us how you roleplay</h1>
      <p>Applications are reviewed by staff. Write naturally and in your own words. We use integrity signals to flag copied or highly automated submissions for review, but staff makes the final decision.</p>
    </div>
  </div>
</section>

<section class="page-section">
  <div class="v2-wrap form-shell">

    <aside class="content-card side-card">
      <div class="icon"><i class="fab fa-discord" aria-hidden="true"></i></div>
      <h2>Discord verification</h2>
      <p id="authCopy">Sign in with Discord before submitting so your application is tied to the same identity used by the FiveM whitelist.</p>
      <div id="authArea"><a href="/api/auth/login" class="primary-btn">Sign in with Discord</a></div>

      <hr>

      <h3>Before you apply</h3>
      <ul>
        <li>Read the rules and full rulebook.</li>
        <li>Use your own words and examples.</li>
        <li>Do not submit copied application answers.</li>
        <li>One active application per Discord account.</li>
      </ul>
      <a href="rules.html" class="ghost-btn">Read the City Code</a>
    </aside>

    <div>
      <div id="statusArea" class="status-box" style="margin-bottom:22px">Checking your application status&hellip;</div>

      <form id="whitelistForm" class="form-card hidden">
        <div class="form-legend">
          <b>Applicant record</b>
          <span>Every field is read by a person.</span>
        </div>

        <div class="form-row">
          <div class="field">
            <label for="wlCharacterName">Character name</label>
            <input id="wlCharacterName" name="character_name" maxlength="60" required placeholder="First Last">
          </div>
          <div class="field">
            <label for="wlAge">Age</label>
            <input id="wlAge" name="age" type="number" min="18" max="99" required>
          </div>
        </div>

        <div class="field">
          <label for="wlExperience">Roleplay experience</label>
          <textarea id="wlExperience" name="rp_experience" minlength="120" maxlength="1500" required data-track placeholder="Tell us what kind of roleplay you have done and what you learned from it."></textarea>
          <div class="char-count"></div>
        </div>

        <div class="field">
          <label for="wlConcept">Character concept</label>
          <textarea id="wlConcept" name="character_concept" minlength="180" maxlength="1800" required data-track placeholder="Who is your character? What do they want, what are their flaws, and how do you plan to build their story?"></textarea>
          <div class="char-count"></div>
        </div>

        <div class="field">
          <label for="wlScenarioConflict">Scenario: You are losing an argument and another player insults your character. What do you do?</label>
          <textarea id="wlScenarioConflict" name="scenario_conflict" minlength="140" maxlength="1600" required data-track placeholder="Explain how you would keep the scene in character and handle the conflict."></textarea>
          <div class="char-count"></div>
        </div>

        <div class="field">
          <label for="wlScenarioMeta">Scenario: Your friend tells you in Discord where a rival is hiding. What can your character do with that information?</label>
          <textarea id="wlScenarioMeta" name="scenario_meta" minlength="120" maxlength="1400" required data-track placeholder="Explain your reasoning."></textarea>
          <div class="char-count"></div>
        </div>

        <div class="field">
          <label for="wlWhy">Why PixelPH?</label>
          <textarea id="wlWhy" name="why_pixelph" minlength="120" maxlength="1400" required data-track placeholder="What kind of stories do you want to create here?"></textarea>
          <div class="char-count"></div>
        </div>

        <div class="field field-check">
          <label><input type="checkbox" name="ack" required> I confirm these answers are my own and I understand copied or dishonest submissions may be rejected.</label>
        </div>

        <button class="primary-btn" type="submit"><i class="fas fa-paper-plane"></i> Submit Application</button>
        <p class="legal-note" style="margin-top:18px">Integrity checks are used as review signals, not as the sole basis for an automated rejection.</p>
      </form>
    </div>

  </div>
</section>

</main>
"""

# ==========================================================================
# HOW TO JOIN
# ==========================================================================
JOIN = """
<main id="page-main" class="page-shell">

<section class="page-hero">
  <div class="page-hero-bg ph-frame tone-mint" data-media="assets/media/city/city-entry-01.webp">
<span class="plate-skyline" aria-hidden="true"></span>
    <img src="../assets/media/city/city-entry-01.webp" alt="" loading="lazy" decoding="async">
  </div>
  <div class="v2-wrap">
    <div class="rail">
      <p class="lead-in">How to join</p>
      <h1>PixelPH is whitelisted</h1>
      <p>You cannot skip the application by using the server address directly. Entry is checked server-side against approved Discord IDs.</p>
    </div>
  </div>
</section>

<section class="page-section">
  <div class="v2-wrap">
    <div class="steps">
      <div class="step">
        <h3>Join Discord</h3>
        <p>Join the PixelPH Discord so staff can identify your account and contact you about your application.</p>
        <a data-discord-link href="#" target="_blank" rel="noopener" class="ghost-btn">Open Discord</a>
      </div>
      <div class="step">
        <h3>Apply</h3>
        <p>Answer the whitelist questions in your own words. Low-effort or copied submissions may be rejected.</p>
        <a href="whitelist.html" class="primary-btn">Start application</a>
      </div>
      <div class="step">
        <h3>Get approved</h3>
        <p>Once approved, your Discord identity is allowed through the FiveM whitelist gate. Then connect through the website or FiveM.</p>
        <a data-connect-link href="#" target="_blank" rel="noopener" class="ghost-btn">Connect</a>
      </div>
    </div>
  </div>
</section>

<section class="band band-hair">
  <div class="v2-wrap sec-head">
    <div class="rail">
      <h2 class="t-section">Read the City Code first.</h2>
      <p class="prose">It is the single best thing you can do for your application.</p>
      <div class="btn-row" style="margin-top:26px">
        <a href="rulebook.html" class="primary-btn">Open the City Code</a>
      </div>
    </div>
  </div>
</section>

</main>
"""

# ==========================================================================
# MY PIXELPH  (all account.js hooks preserved)
# ==========================================================================
ACCOUNT = """
<main id="page-main" class="page-shell">

<section class="page-hero">
  <div class="v2-wrap">
    <div class="rail">
      <p class="lead-in">Player access</p>
      <h1>My PixelPH</h1>
      <p>Your whitelist, membership, and city access in one place.</p>
      <div class="btn-row" style="margin-top:26px">
        <a class="quiet-btn" href="/api/auth/logout">Sign out</a>
      </div>
    </div>
  </div>
</section>

<section class="page-section">
  <div class="v2-wrap account-grid">

    <div class="account-card">
      <div class="section-kicker">Whitelist status</div>
      <div id="accountStatus" class="account-status">Loading&hellip;</div>
      <p id="accountCopy" class="review-muted"></p>
      <div id="accountActions" class="hero-actions" style="border:0;margin-top:18px"></div>
    </div>

    <div class="account-card">
      <div class="section-kicker">City access</div>
      <h3>PixelPH Serious RP</h3>
      <p class="review-muted">Approved players can connect when the city is live.</p>
      <p class="footer-addr" style="margin:16px 0" data-server-address>play.pixelph.com:30120</p>
      <a data-connect-link class="primary-btn" href="#">Connect to PixelPH</a>
    </div>

    <div class="account-card membership-account-card" style="grid-column:1/-1">
      <div class="membership-account-head">
        <div>
          <div class="section-kicker">Membership</div>
          <h3>Your supporter access</h3>
        </div>
        <a class="ghost-btn" href="/pages/membership.html">View membership</a>
      </div>
      <div id="membershipActive" class="membership-active-list"><p class="review-muted">Loading membership&hellip;</p></div>
      <div id="queueAccess" class="queue-access-summary"></div>
    </div>

    <div class="account-card" style="grid-column:1/-1">
      <div class="section-kicker">Application history</div>
      <div id="historyList" class="history-list"><p class="review-muted">Loading history&hellip;</p></div>
    </div>

  </div>
</section>

</main>
"""

# ==========================================================================
# 404
# ==========================================================================
NOT_FOUND = """
<main id="page-main" class="nf">
  <div class="nf-inner rail">
    <div class="nf-code">404</div>
    <h1>This address is not on the city map</h1>
    <p class="prose">The page may have moved, or the link may be out of date. These are the places worth trying.</p>
    <div class="btn-row" style="margin-top:30px">
      <a href="/" class="primary-btn">Back to the city</a>
      <a href="/pages/whitelist.html" class="ghost-btn">Whitelist application</a>
      <a href="/pages/rulebook.html" class="ghost-btn">City Code</a>
    </div>
  </div>
</main>
"""


# ==========================================================================
# BUILD
# ==========================================================================
def build(page):
    out = []

    out.append(page(
        path="pages/about.html",
        title="About | PixelPH",
        description="Learn what PixelPH Serious Roleplay is built around.",
        active="about",
        body=ABOUT,
    ))

    out.append(page(
        path="pages/rules.html",
        title="City Code | PixelPH",
        description="PixelPH Serious Roleplay City Code and official gameplay standards.",
        active="rules",
        body_class="v2-body rules-page",
        body=RULES,
    ))

    out.append(page(
        path="pages/reputation.html",
        title="Reputation & Progression | PixelPH",
        description="Discover PixelPH reputation, underground progression, contacts, clues, and serious RP progression without pay-to-win shortcuts.",
        active="reputation",
        body_class="v2-body reputation-page",
        cta="account",
        body=REPUTATION,
    ))

    out.append(page(
        path="pages/membership.html",
        title="Membership | PixelPH",
        description="PixelPH queue priority and reserved access memberships.",
        active="membership",
        body_class="v2-body membership-page",
        cta="account",
        body=MEMBERSHIP,
        scripts=["membership.js?v=20260912-100slots"],
    ))

    out.append(page(
        path="pages/showroom.html",
        title="Showroom | PixelPH",
        description="PixelPH Showroom for staff-reviewed business, character, vehicle, and ped commissions handled through Discord.",
        active="showroom",
        body_class="v2-body membership-page showroom-page",
        cta="account",
        body=SHOWROOM,
    ))

    out.append(page(
        path="pages/whitelist.html",
        title="Whitelist Application | PixelPH",
        description="Apply for the PixelPH Serious Roleplay whitelist.",
        active=None,
        cta="account",
        body=WHITELIST,
        scripts=["whitelist.js?v=20260912-v6"],
    ))

    out.append(page(
        path="pages/join.html",
        title="How to Join | PixelPH",
        description="How to apply and join the whitelisted PixelPH FiveM server.",
        active=None,
        body=JOIN,
    ))

    out.append(page(
        path="pages/account.html",
        title="My PixelPH | Player Dashboard",
        description="Your PixelPH whitelist, membership and city access.",
        active=None,
        prefix="/",
        cta="account",
        noindex=True,
        body=ACCOUNT,
        scripts=[
            "opening-countdown.js?v=20260912-countdown-v542",
            "account.js?v=20260912-membership-v1",
        ],
    ))

    out.append(page(
        path="404.html",
        title="404 | PixelPH",
        description="This page could not be found on PixelPH.",
        active=None,
        prefix="/",
        noindex=True,
        body=NOT_FOUND,
    ))

    return out
