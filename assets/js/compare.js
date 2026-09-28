/* Flexora.Ai - compare page logic.
   Reads TOOLS_DATA (assets/js/tools-data.js, auto-generated from /data/tools/*.json).
   Load order on the page:  tools-data.js  ->  site.js  ->  compare.js            */
(function () {
  'use strict';

  var A = document.getElementById('cmpA');
  var B = document.getElementById('cmpB');
  if (!A || !B) return;

  var stage = document.getElementById('cmpStage');
  var table = document.getElementById('cmpTable');
  var verdict = document.getElementById('cmpVerdict');
  var similar = document.getElementById('cmpSimilar');
  var popular = document.getElementById('cmpPopular');

  /* ---------- helpers ---------- */
  function esc(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function slugify(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
  function safeUrl(u) { return /^https?:\/\//i.test(u || '') ? u : ''; }
  function toast(msg) { if (typeof showToast === 'function') showToast(msg); }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- data ---------- */
  var raw = (typeof TOOLS_DATA !== 'undefined' && Array.isArray(TOOLS_DATA)) ? TOOLS_DATA : [];
  var tools = raw.map(function (t) {
    var o = Object.assign({}, t);
    o.slug = t.slug || slugify(t.name);
    return o;
  });
  var bySlug = {};
  tools.forEach(function (t) { bySlug[t.slug] = t; });

  if (tools.length < 2) {
    stage.innerHTML = '<div class="empty-note">Add at least two tools in <b>/data/tools</b> and run the build to use the comparison.</div>';
    A.disabled = B.disabled = true;
    return;
  }

  /* ---------- dropdowns (grouped by category) ---------- */
  var cats = [];
  tools.forEach(function (t) { if (cats.indexOf(t.cat) === -1) cats.push(t.cat); });
  var optionsHTML = cats.map(function (c) {
    return '<optgroup label="' + esc(cap(c)) + '">' +
      tools.filter(function (t) { return t.cat === c; })
        .map(function (t) { return '<option value="' + esc(t.slug) + '">' + esc(t.name) + '</option>'; }).join('') +
      '</optgroup>';
  }).join('');
  A.innerHTML = optionsHTML;
  B.innerHTML = optionsHTML;

  /* ---------- "who wins this row" ---------- */
  var EASE_RANK = { easy: 1, moderate: 2, advanced: 3 };
  function priceNum(t) {
    if (t.free) return 0;
    var m = String(t.price || '').match(/(\d+(\.\d+)?)/);
    return m ? parseFloat(m[1]) : null;
  }
  function lower(x, y) { return (x == null || y == null || x === y) ? null : (x < y ? 'a' : 'b'); }
  function has(arr) { return Array.isArray(arr) && arr.length > 0; }

  var ROWS = [
    { label: 'Category', get: function (t) { return cap(t.cat); } },
    { label: 'Pricing', get: function (t) { return t.price || (t.free ? 'Free plan' : 'Paid'); }, win: function (a, b) { return lower(priceNum(a), priceNum(b)); } },
    { label: 'Free plan', get: function (t) { return t.free ? 'Yes' : 'No'; }, win: function (a, b) { return a.free === b.free ? null : (a.free ? 'a' : 'b'); } },
    { label: 'Best for', get: function (t) { return t.bestFor || null; } },
    { label: 'Ease of use', get: function (t) { return t.ease || null; }, win: function (a, b) { return lower(EASE_RANK[String(a.ease).toLowerCase()], EASE_RANK[String(b.ease).toLowerCase()]); } },
    { label: 'Rating', get: function (t) { return t.rating ? t.rating + ' / 5' : null; }, win: function (a, b) { return (a.rating && b.rating && a.rating !== b.rating) ? (a.rating > b.rating ? 'a' : 'b') : null; } },
    { label: 'Key features', get: function (t) { return has(t.features) ? t.features.join(' · ') : null; } },
    { label: 'Pros', get: function (t) { return has(t.pros) ? t.pros.join(' · ') : null; } },
    { label: 'Cons', get: function (t) { return has(t.cons) ? t.cons.join(' · ') : null; } },
    { label: 'Website', html: true, get: function (t) { var u = safeUrl(t.url); return u ? '<a class="u-teal-bold" href="' + esc(u) + '" target="_blank" rel="noopener nofollow">Visit →</a>' : null; } }
  ];

  /* ---------- 3D cards ---------- */
  function cardHTML(t, side) {
    return '<div class="cmp-card enter-' + side + '">' +
      '<div class="cmp-card-shine"></div>' +
      '<div class="cmp-icon">' + esc(t.icon || t.name.charAt(0)) + '</div>' +
      '<h3>' + esc(t.name) + '</h3>' +
      '<span class="cmp-cat mono">' + esc(cap(t.cat)) + '</span>' +
      '<p>' + esc(t.desc) + '</p>' +
      '<div class="cmp-pills">' +
        '<span class="pill ' + (t.free ? 'free' : '') + '">' + (t.free ? 'Free plan' : 'Paid') + '</span>' +
        (t.isNew ? '<span class="pill new">New</span>' : '') +
      '</div></div>';
  }
  function tilt(card) {
    if (reduceMotion) return;
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.transform = 'rotateX(' + ((y - 0.5) * -12) + 'deg) rotateY(' + ((x - 0.5) * 12) + 'deg) translateZ(14px)';
      card.style.setProperty('--mx', (x * 100) + '%');
      card.style.setProperty('--my', (y * 100) + '%');
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  }

  /* ---------- render ---------- */
  function render() {
    var a = bySlug[A.value], b = bySlug[B.value];
    if (!a || !b) return;

    stage.innerHTML = cardHTML(a, 'a') + '<div class="cmp-vs"><span>VS</span></div>' + cardHTML(b, 'b');
    Array.prototype.forEach.call(stage.querySelectorAll('.cmp-card'), tilt);

    var scoreA = 0, scoreB = 0, measured = 0;
    var body = ROWS.map(function (r) {
      var va = r.get(a), vb = r.get(b);
      if (va == null && vb == null) return '';
      var w = r.win ? r.win(a, b) : null;
      if (w) { measured++; if (w === 'a') scoreA++; else scoreB++; }
      function cell(v, side) {
        var content = v == null ? '<span class="cmp-na">—</span>' : (r.html ? v : esc(v));
        return '<td class="' + (w === side ? 'win' : '') + '">' + content + (w === side ? ' <span class="cmp-badge">Better</span>' : '') + '</td>';
      }
      return '<tr><td class="feat">' + r.label + '</td>' + cell(va, 'a') + cell(vb, 'b') + '</tr>';
    }).join('');
    table.innerHTML = '<tr><th></th><th>' + esc(a.name) + '</th><th>' + esc(b.name) + '</th></tr>' + body;

    /* verdict */
    var msg;
    if (!measured || scoreA === scoreB) {
      msg = '<b>' + esc(a.name) + '</b> and <b>' + esc(b.name) + '</b> are evenly matched on the measures we track. Choose based on the <b>best-for</b> use case.';
    } else {
      var win = scoreA > scoreB ? a : b, lose = scoreA > scoreB ? b : a;
      msg = '<b>' + esc(win.name) + '</b> comes out ahead of ' + esc(lose.name) + ' on <b>' + Math.max(scoreA, scoreB) + '</b> of ' + measured + ' measures.' +
        (lose.bestFor ? ' Still, ' + esc(lose.name) + ' is the better fit for <i>' + esc(lose.bestFor) + '</i>.' : '');
    }
    verdict.innerHTML = '<div class="cmp-verdict"><span class="mono">QUICK VERDICT</span><p>' + msg + '</p></div>';

    /* similar tools (auto-computed by the build script) */
    var slugs = (a.similar && a.similar.length) ? a.similar : tools.filter(function (t) { return t.cat === a.cat; }).map(function (t) { return t.slug; });
    var sims = slugs.map(function (s) { return bySlug[s]; })
      .filter(function (t) { return t && t.slug !== a.slug && t.slug !== b.slug; }).slice(0, 6);
    similar.innerHTML = sims.length
      ? '<div class="cmp-similar"><span class="mono">COMPARE ' + esc(a.name.toUpperCase()) + ' WITH</span><div class="cat-row">' +
        sims.map(function (s) { return '<button type="button" class="cat-chip" data-slug="' + esc(s.slug) + '">' + esc(s.name) + '</button>'; }).join('') +
        '</div></div>'
      : '';
    Array.prototype.forEach.call(similar.querySelectorAll('[data-slug]'), function (btn) {
      btn.addEventListener('click', function () { B.value = btn.getAttribute('data-slug'); render(); window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });
    });

    /* shareable URL + title */
    try { history.replaceState(null, '', '?a=' + encodeURIComponent(a.slug) + '&b=' + encodeURIComponent(b.slug)); } catch (e) {}
    document.title = a.name + ' vs ' + b.name + ' — Flexora.Ai';
  }

  /* ---------- popular comparisons (auto: first two tools of every category) ---------- */
  if (popular) {
    var pairs = [];
    cats.forEach(function (c) {
      var inCat = tools.filter(function (t) { return t.cat === c; });
      if (inCat.length >= 2) pairs.push([inCat[0], inCat[1]]);
    });
    popular.innerHTML = pairs.length
      ? '<div class="cmp-popular"><span class="mono">POPULAR COMPARISONS</span><div class="cat-row">' +
        pairs.slice(0, 8).map(function (p) {
          return '<a class="cat-chip" href="?a=' + encodeURIComponent(p[0].slug) + '&b=' + encodeURIComponent(p[1].slug) + '">' + esc(p[0].name) + ' vs ' + esc(p[1].name) + '</a>';
        }).join('') + '</div></div>'
      : '';
    Array.prototype.forEach.call(popular.querySelectorAll('a'), function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var q = new URLSearchParams(link.getAttribute('href').slice(1));
        A.value = q.get('a'); B.value = q.get('b'); render();
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });
  }

  /* ---------- events ---------- */
  function onChange(changed, other) {
    if (A.value === B.value) {
      var i = tools.findIndex(function (t) { return t.slug === changed.value; });
      other.value = tools[(i + 1) % tools.length].slug;
    }
    render();
  }
  A.addEventListener('change', function () { onChange(A, B); });
  B.addEventListener('change', function () { onChange(B, A); });

  var swap = document.getElementById('cmpSwap');
  if (swap) swap.addEventListener('click', function () { var t = A.value; A.value = B.value; B.value = t; render(); });

  var share = document.getElementById('cmpShare');
  if (share) share.addEventListener('click', function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(location.href).then(function () { toast('Comparison link copied'); }, function () { toast(location.href); });
    } else { toast(location.href); }
  });

  /* ---------- initial selection: ?a=&b= or sensible defaults ---------- */
  var p = new URLSearchParams(location.search);
  var a0 = bySlug[p.get('a')] || tools[0];
  var b0 = (bySlug[p.get('b')] && p.get('b') !== a0.slug)
    ? bySlug[p.get('b')]
    : (tools.find(function (t) { return t.cat === a0.cat && t.slug !== a0.slug; }) || tools.find(function (t) { return t.slug !== a0.slug; }));
  A.value = a0.slug;
  B.value = b0.slug;
  render();
})();
