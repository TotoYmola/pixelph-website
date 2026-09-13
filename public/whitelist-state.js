/* ---------------------------------------------------------------------------
   whitelist-state.js — presentation only.

   whitelist.js owns everything that matters: the API calls, the integrity
   metrics, the field handling, and the decision about whether the form is
   shown. This file does not touch any of that. It only watches the classes
   whitelist.js already sets on #statusArea and #whitelistForm, and adjusts
   the LAYOUT and the supporting copy around them.

   The problem it solves: in a terminal state (approved, pending, or a final
   rejection) the form is hidden, which left a two-column grid with one small
   box in it and a very large empty column beside a sidebar still explaining
   how to apply. Those states now render as a single centred column with
   state-appropriate next steps.

   Deliberately absent: any connect button. The opening countdown owns when
   connecting unlocks, and duplicating that here could unlock it early. The
   opening time is stated as text instead.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var shell = document.querySelector('.form-shell');
  var statusArea = document.getElementById('statusArea');
  var form = document.getElementById('whitelistForm');
  var next = document.getElementById('applicationNext');
  if (!shell || !statusArea || !form || !next) return;

  var OPENING = '18 September 2026, 8:00 PM PHT';
  var DISCORD = 'https://discord.gg/te5mRyvFVc';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function steps(title, items, actions) {
    var html = '<h3>' + esc(title) + '</h3><ol class="next-steps">';
    items.forEach(function (t) {
      html += '<li>' + t + '</li>';
    });
    html += '</ol>';
    if (actions && actions.length) {
      html += '<div class="btn-row next-actions">' + actions.join('') + '</div>';
    }
    return html;
  }

  var CODE = '<a href="rules.html" class="ghost-btn">Read the City Code</a>';
  var DISC =
    '<a href="' + DISCORD + '" class="ghost-btn" target="_blank" rel="noopener">Open Discord</a>';

  var COPY = {
    approved: function () {
      return steps(
        'What happens next',
        [
          'The city opens <b>' + OPENING + '</b>. Connecting stays locked until then.',
          'Connect using the same Discord account you applied with. A different account will not be recognised.',
          'Read the City Code before your first scene. Approval is the start of the standard, not an exemption from it.'
        ],
        [CODE, DISC]
      );
    },
    pending: function () {
      return steps(
        'While you wait',
        [
          'Every application is read by a person, so review is not instant.',
          'Do not submit a second application. One active application per Discord account, and duplicates slow the queue down for everyone.',
          'Staff will reach you through Discord, so keep direct messages open on the account you applied with.'
        ],
        [CODE, DISC]
      );
    },
    closed: function () {
      return steps(
        'If you want this reviewed again',
        [
          'The reason above is the staff decision on this application.',
          'Open a ticket in Discord if you believe the decision was made on incorrect information.',
          'Re-reading the City Code is the most useful thing you can do before any future attempt.'
        ],
        [DISC, CODE]
      );
    },
    signedout: function () {
      return steps(
        'Before you sign in',
        [
          'Your application is tied to your Discord identity, which is also what the in-city whitelist checks.',
          'Read the City Code first. The application asks you to show how you roleplay, not to recite rules back.',
          'Set aside twenty minutes or so. The written answers are the part staff actually weigh.'
        ],
        [CODE]
      );
    }
  };

  function currentState() {
    var c = statusArea.classList;
    var formOpen = !form.classList.contains('hidden');

    if (c.contains('approved')) return { key: 'approved', formOpen: formOpen };
    if (c.contains('pending')) return { key: 'pending', formOpen: formOpen };
    if (c.contains('revoked')) return { key: 'closed', formOpen: formOpen };
    if (c.contains('rejected')) {
      /* whitelist.js reveals the form only when a re-application is allowed,
         so the form's own visibility tells us which kind of rejection this
         is without duplicating that rule. */
      return { key: formOpen ? 'rejected' : 'closed', formOpen: formOpen };
    }
    if (formOpen) return { key: 'applying', formOpen: true };
    /* No status class and no form: either signed out or the service call
       failed. Both read better as a single centred column. */
    return { key: 'signedout', formOpen: false };
  }

  var applied = null;

  function render() {
    var s = currentState();
    var sig = s.key + '|' + s.formOpen;
    if (sig === applied) return;
    applied = sig;

    shell.setAttribute('data-app-state', s.key);
    shell.setAttribute('data-form', s.formOpen ? 'open' : 'closed');

    var build = COPY[s.key];
    if (build) {
      next.innerHTML = build();
      next.hidden = false;
    } else {
      next.innerHTML = '';
      next.hidden = true;
    }
  }

  new MutationObserver(render).observe(statusArea, {
    attributes: true,
    attributeFilter: ['class'],
    childList: true
  });
  new MutationObserver(render).observe(form, {
    attributes: true,
    attributeFilter: ['class']
  });

  render();
})();
