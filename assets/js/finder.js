/* Flexora.Ai - Tool Finder (free-text search).
   Reads TOOLS_DATA (assets/js/tools-data.js, auto-generated from /data/tools/*.json).
   Self-contained: does not rely on the `tools` global from site.js, so load order
   only needs tools-data.js before this file (site.js can load in any order relative
   to this one, though the shared page chrome expects tools-data.js -> site.js -> finder.js). */
(function () {
  'use strict';

  var input = document.getElementById('ftInput');
  var form = document.getElementById('ftForm');
  if (!input || !form) return;

  var grid = document.getElementById('ftGrid');
  var scan = document.getElementById('ftScan');
  var note = document.getElementById('ftNote');
  var freeOnly = document.getElementById('ftFreeOnly');
  var chips = document.getElementById('ftChips');

  var esc = function (v) { return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var slugify = function (s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); };
  var cap = function (s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var raw = (typeof TOOLS_DATA !== 'undefined' && Array.isArray(TOOLS_DATA)) ? TOOLS_DATA : [];
  var tools = raw.map(function (t) { var o = Object.assign({}, t); o.slug = t.slug || slugify(t.name); return o; });

  if (!tools.length) {
    grid.innerHTML = '<div class="empty-note">Add tools in /data/tools and rebuild tools-data.js to power the Finder.</div>';
    return;
  }

  var STOP = ['i', 'a', 'an', 'the', 'to', 'for', 'my', 'of', 'in', 'on', 'and', 'or', 'with', 'that', 'this',
    'need', 'want', 'help', 'me', 'am', 'im', 'is', 'are', 'can', 'you', 'please', 'some', 'something', 'find', 'looking'];

  function tokenize(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
      .filter(function (w) { return w.length > 2 && STOP.indexOf(w) === -1; });
  }

  // Rough category guesser, used only when a free-text query matches nothing directly.
  var CAT_HINTS = {
    writing: ['write', 'writing', 'blog', 'copy', 'copywriting', 'essay', 'article', 'grammar', 'paraphrase', 'content'],
    image: ['image', 'photo', 'picture', 'graphic', 'background', 'upscale', 'avatar', 'logo'],
    video: ['video', 'clip', 'clips', 'footage', 'caption', 'captions', 'edit', 'reel', 'reels'],
    coding: ['code', 'coding', 'developer', 'programming', 'bug', 'debug', 'review', 'github', 'script'],
    seo: ['seo', 'keyword', 'keywords', 'rank', 'ranking', 'backlink', 'search', 'serp'],
    audio: ['audio', 'voice', 'voiceover', 'podcast', 'speech', 'music', 'sound', 'transcribe', 'transcript'],
    design: ['design', 'ui', 'ux', 'mockup', 'prototype', 'palette', 'theme', 'sketch'],
    productivity: ['plan', 'planning', 'schedule', 'task', 'tasks', 'email', 'inbox', 'notes', 'organize', 'week'],
    automation: ['automate', 'automation', 'workflow', 'workflows', 'integrate', 'integration', 'connect', 'zapier']
  };
  function guessCategory(tokensSet) {
    var best = null, bestScore = 0;
    Object.keys(CAT_HINTS).forEach(function (cat) {
      var score = CAT_HINTS[cat].reduce(function (n, w) { return n + (tokensSet.indexOf(w) > -1 ? 1 : 0); }, 0);
      if (score > bestScore) { best = cat; bestScore = score; }
    });
    return best;
  }

  // Weighted match score across a tool's searchable fields; also collects which
  // query terms actually hit, so the UI can show "matched on: ...".
  function scoreTool(tool, qTokens) {
    var matched = {};
    var score = 0;
    var fields = [
      { text: tool.name, weight: 4 },
      { text: (tool.tags || []).join(' '), weight: 3 },
      { text: tool.cat, weight: 3 },
      { text: tool.bestFor, weight: 2.5 },
      { text: (tool.features || []).join(' '), weight: 2 },
      { text: tool.desc, weight: 1 }
    ];
    qTokens.forEach(function (tok) {
      fields.forEach(function (f) {
        var hay = String(f.text || '').toLowerCase();
        if (hay.indexOf(tok) > -1) {
          score += f.weight;
          matched[tok] = true;
        }
      });
    });
    return { score: score, matched: Object.keys(matched) };
  }

  function cardHTML(t, matchedTerms, idx) {
    var chipsHtml = (matchedTerms && matchedTerms.length)
      ? '<div class="match-chips">' + matchedTerms.slice(0, 4).map(function (m) { return '<span class="match-chip">' + esc(m) + '</span>'; }).join('') + '</div>'
      : '';
    var cmp = '<a class="card-compare" href="compare.html?a=' + encodeURIComponent(t.slug) + '">Compare →</a>';
    var visit = t.url ? '<a class="fcard-visit" href="' + esc(t.url) + '" target="_blank" rel="noopener nofollow">Visit ↗</a>' : '';
    return (
      '<div class="fcard" style="' + (reduceMotion ? '' : 'animation-delay:' + (idx * 70) + 'ms') + '">' +
      '<div class="fcard-shine"></div>' +
      '<div class="card-top">' +
      '<div class="card-icon">' + esc(t.icon || t.name.charAt(0)) + '</div>' +
      '<div><div class="card-name">' + esc(t.name) + '</div><div class="card-cat">' + esc(cap(t.cat)) + '</div></div>' +
      '</div>' +
      '<p>' + esc(t.desc) + '</p>' +
      chipsHtml +
      '<div class="card-foot"><span class="pill ' + (t.free ? 'free' : '') + '">' + (t.free ? 'Free plan' : 'Paid') + '</span>' +
      (t.isNew ? '<span class="pill new">New</span>' : '') + cmp + visit + '</div>' +
      '</div>'
    );
  }

  function tilt(card) {
    if (reduceMotion) return;
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--rx', ((y - 0.5) * -8) + 'deg');
      card.style.setProperty('--ry', ((x - 0.5) * 8) + 'deg');
      card.style.setProperty('--mx', (x * 100) + '%');
      card.style.setProperty('--my', (y * 100) + '%');
    });
    card.addEventListener('mouseleave', function () {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }

  function renderCards(list, matchedByslug) {
    grid.innerHTML = list.map(function (t, i) { return cardHTML(t, matchedByslug[t.slug], i); }).join('');
    Array.prototype.forEach.call(grid.querySelectorAll('.fcard'), tilt);
  }

  var SCAN_MESSAGES = [
    'Reading what you need…',
    'Matching against the directory…',
    'Ranking the closest tools…'
  ];

  function runScan(cb) {
    if (reduceMotion) { cb(); return; }
    scan.classList.add('show');
    var msgEl = scan.querySelector('.ft-scan-msg');
    var i = 0;
    msgEl.textContent = SCAN_MESSAGES[0];
    var t = setInterval(function () {
      i = (i + 1) % SCAN_MESSAGES.length;
      msgEl.textContent = SCAN_MESSAGES[i];
    }, 220);
    setTimeout(function () {
      clearInterval(t);
      scan.classList.remove('show');
      cb();
    }, 650);
  }

  function search(query) {
    var qTokens = tokenize(query);
    if (!qTokens.length) {
      note.textContent = 'Type a few words about what you need — the more specific, the better the match.';
      grid.innerHTML = '';
      return;
    }

    var scored = tools.map(function (t) { return Object.assign({ tool: t }, scoreTool(t, qTokens)); })
      .filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score || (b.tool.rating || 0) - (a.tool.rating || 0) || a.tool.name.localeCompare(b.tool.name); });

    var wantFree = freeOnly && freeOnly.checked;
    if (wantFree) {
      var freeFiltered = scored.filter(function (r) { return r.tool.free; });
      if (freeFiltered.length) scored = freeFiltered;
    }

    var matchedByslug = {};
    scored.forEach(function (r) { matchedByslug[r.tool.slug] = r.matched; });

    if (scored.length) {
      note.innerHTML = 'Found <b>' + scored.length + '</b> tool' + (scored.length === 1 ? '' : 's') + ' that fit what you described.';
      runScan(function () { renderCards(scored.slice(0, 6).map(function (r) { return r.tool; }), matchedByslug); });
      return;
    }

    // No direct hits: fall back to a category guess so the person still gets something useful.
    var guessed = guessCategory(qTokens);
    if (guessed) {
      var inCat = tools.filter(function (t) { return t.cat === guessed && (!wantFree || t.free); });
      if (!inCat.length) inCat = tools.filter(function (t) { return t.cat === guessed; });
      note.innerHTML = 'No exact match, but this sounds like <b>' + esc(cap(guessed)) + '</b> — here are the best tools in that category.';
      runScan(function () { renderCards(inCat.slice(0, 6), {}); });
      return;
    }

    note.innerHTML = 'No match yet. Try describing the task differently, or browse a category below.';
    grid.innerHTML = '<div class="empty-note">Nothing matched "' + esc(query) + '". Try a different phrase, or use the quick chips above.</div>';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    search(input.value.trim());
  });

  if (chips) {
    chips.querySelectorAll('[data-q]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        input.value = chip.getAttribute('data-q');
        search(input.value);
        input.focus();
      });
    });
  }

  // ?q= deep link support (e.g. shared from the homepage hero search)
  var q = new URLSearchParams(location.search).get('q');
  if (q) { input.value = q; search(q); }
})();
