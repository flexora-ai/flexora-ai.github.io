/* Flexora.Ai — shared site behavior. Safe to include on every page:
   every block below checks that its elements exist before running,
   so pages that don't have a given feature simply skip that part. */

// ---- demo tool data (single source of truth until there's a real backend) ----
const CATEGORIES = [
  {key:'writing', label:'Writing', icon:'✍️'},
  {key:'image', label:'Image', icon:'🎨'},
  {key:'video', label:'Video', icon:'🎬'},
  {key:'coding', label:'Coding', icon:'💻'},
  {key:'seo', label:'SEO', icon:'📈'},
  {key:'audio', label:'Audio', icon:'🎧'},
  {key:'design', label:'Design', icon:'🖌️'},
  {key:'productivity', label:'Productivity', icon:'📋'},
  {key:'automation', label:'Automation', icon:'⚙️'},
];

const tools = [
  {name:'Scriptly', cat:'writing', icon:'S', desc:'Draft, rewrite and outline long-form content with tone controls.', free:true, isNew:false, price:'Free plan', bestFor:'Long-form blog drafts', ease:'Easy'},
  {name:'Copysmith Lite', cat:'writing', icon:'C', desc:'Short-form ad and product copy generator with brand voice presets.', free:true, isNew:true, price:'Free plan', bestFor:'Ad copy at scale', ease:'Easy'},
  {name:'PixelForge', cat:'image', icon:'P', desc:'Generate and edit product images from text prompts.', free:false, isNew:true, price:'From $19/mo', bestFor:'Product photography', ease:'Moderate'},
  {name:'Framewise', cat:'image', icon:'F', desc:'Upscale and restore old or low-res photos in one click.', free:true, isNew:false, price:'Free plan', bestFor:'Photo restoration', ease:'Easy'},
  {name:'Clipreel', cat:'video', icon:'C', desc:'Turn long recordings into short clips with auto captions.', free:false, isNew:true, price:'From $24/mo', bestFor:'Social video clips', ease:'Moderate'},
  {name:'ScenePilot', cat:'video', icon:'S', desc:'Storyboard and generate short AI video scenes from a script.', free:false, isNew:true, price:'From $35/mo', bestFor:'Short-form video ideas', ease:'Advanced'},
  {name:'CodeLoop', cat:'coding', icon:'C', desc:'In-editor AI pair programmer with test generation.', free:true, isNew:false, price:'Free plan', bestFor:'Day-to-day coding', ease:'Moderate'},
  {name:'Bugcatch', cat:'coding', icon:'B', desc:'Scans pull requests and flags likely bugs before merge.', free:false, isNew:true, price:'From $12/mo', bestFor:'Code review', ease:'Moderate'},
  {name:'Ranklyst', cat:'seo', icon:'R', desc:'Keyword clustering and on-page audits, explained simply.', free:false, isNew:true, price:'From $29/mo', bestFor:'SEO audits', ease:'Easy'},
  {name:'Voxel', cat:'audio', icon:'V', desc:'Text-to-speech with cloned voice profiles.', free:true, isNew:false, price:'Free plan', bestFor:'Voiceovers', ease:'Easy'},
  {name:'Podtrim', cat:'audio', icon:'P', desc:'Removes filler words and silence from podcast audio automatically.', free:true, isNew:false, price:'Free plan', bestFor:'Podcast editing', ease:'Easy'},
  {name:'Palette AI', cat:'design', icon:'P', desc:'Generates matching color palettes and UI themes from one image.', free:true, isNew:false, price:'Free plan', bestFor:'Design systems', ease:'Easy'},
  {name:'Mockflow AI', cat:'design', icon:'M', desc:'Turns rough sketches into clickable UI mockups.', free:false, isNew:true, price:'From $18/mo', bestFor:'Rapid prototyping', ease:'Moderate'},
  {name:'Inboxly', cat:'productivity', icon:'I', desc:'Drafts email replies in your tone and summarizes long threads.', free:true, isNew:false, price:'Free plan', bestFor:'Email triage', ease:'Easy'},
  {name:'Plannix', cat:'productivity', icon:'P', desc:'Turns a messy to-do list into a scheduled weekly plan.', free:false, isNew:true, price:'From $9/mo', bestFor:'Weekly planning', ease:'Easy'},
  {name:'Autoflow', cat:'automation', icon:'A', desc:'No-code automations that connect your everyday apps and AI steps.', free:false, isNew:true, price:'From $15/mo', bestFor:'Connecting apps', ease:'Moderate'},
];

// ---- category icon tiles (replaces plain chip rows where present) ----
(function(){
  const box = document.getElementById('catTiles');
  if(!box) return;
  const counts = {};
  tools.forEach(t => { counts[t.cat] = (counts[t.cat] || 0) + 1; });
  box.innerHTML = CATEGORIES.map(c => `
    <a class="cat-tile" href="${box.dataset.linkPrefix || ''}tools.html?cat=${c.key}">
      <span class="cat-tile-icon">${c.icon}</span>
      <span class="cat-tile-label">${c.label}</span>
      <span class="cat-tile-count">${counts[c.key] || 0}</span>
    </a>
  `).join('');
})();

// ---- toolbar-style category chips used on tools.html (data-driven, keeps 'All') ----
(function(){
  const row = document.getElementById('catRow');
  if(!row) return;
  row.innerHTML = '<span class="cat-chip active" data-cat="all">All</span>' +
    CATEGORIES.map(c => `<span class="cat-chip" data-cat="${c.key}">${c.icon} ${c.label}</span>`).join('');
})();

function addTilt(card){
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -10;
    const ry = ((x / r.width) - 0.5) * 10;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
}

function cardHTML(t){
  return `
    <div class="card-top">
      <div class="card-icon">${t.icon}</div>
      <div><div class="card-name">${t.name}</div><div class="card-cat">${t.cat.charAt(0).toUpperCase()+t.cat.slice(1)}</div></div>
    </div>
    <p>${t.desc}</p>
    <div class="card-foot"><span class="pill ${t.free ? 'free' : ''}">${t.free ? 'Free plan' : 'Paid'}</span>${t.isNew ? '<span class="pill new">New</span>' : ''}</div>
  `;
}

// ---- toast helper (used by several pages) ----
const toast = document.getElementById('toast');
function showToast(msg){
  if(!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

// ---- Tools directory (grid + tabs + category chips + search) ----
(function(){
  const grid = document.getElementById('toolGrid');
  if(!grid) return;
  const noResults = document.getElementById('noResults');
  const searchInput = document.getElementById('searchInput');
  let currentTab = 'popular';

  function renderTools(filter){
    grid.innerHTML = '';
    let list = tools.slice();
    if(currentTab === 'new') list = list.filter(t => t.isNew);
    if(currentTab === 'free') list = list.filter(t => t.free);
    const filtered = list.filter(t => {
      if(!filter || filter === 'all') return true;
      return t.cat.includes(filter) || t.name.toLowerCase().includes(filter) || t.desc.toLowerCase().includes(filter);
    });
    if(noResults) noResults.style.display = filtered.length ? 'none' : 'block';
    filtered.forEach(t => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = cardHTML(t);
      addTilt(card);
      grid.appendChild(card);
    });
  }

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      renderTools(searchInput ? searchInput.value.trim().toLowerCase() : '');
    });
  });

  document.querySelectorAll('.cat-chip[data-cat]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.cat-chip[data-cat]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if(searchInput) searchInput.value = '';
      renderTools(chip.dataset.cat === 'all' ? '' : chip.dataset.cat);
    });
  });
  document.getElementById('clearFilter')?.addEventListener('click', () => {
    document.querySelectorAll('.cat-chip[data-cat]').forEach(c => c.classList.remove('active'));
    if(searchInput) searchInput.value = '';
    renderTools('all');
  });

  function doSearch(){
    const v = searchInput.value.trim().toLowerCase();
    renderTools(v);
  }
  document.getElementById('searchBtn')?.addEventListener('click', doSearch);
  searchInput?.addEventListener('keydown', (e) => { if(e.key === 'Enter') doSearch(); });

  // pre-fill from ?q= or ?cat= on page load (so other pages can link here)
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  const cat = params.get('cat');
  if(cat){
    const chip = document.querySelector(`.cat-chip[data-cat="${cat}"]`);
    chip?.classList.add('active');
    document.querySelector('.cat-chip[data-cat="all"]')?.classList.remove('active');
    renderTools(cat);
  } else if(q && searchInput){ searchInput.value = q; renderTools(q.toLowerCase()); }
  else{ renderTools('all'); }
})();

// ---- homepage hero search: redirect to tools.html?q=... ----
(function(){
  const heroInput = document.getElementById('heroSearchInput');
  const heroBtn = document.getElementById('heroSearchBtn');
  if(!heroInput || !heroBtn) return;
  function go(){
    const v = heroInput.value.trim();
    window.location.href = 'tools.html' + (v ? ('?q=' + encodeURIComponent(v)) : '');
  }
  heroBtn.addEventListener('click', go);
  heroInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') go(); });
})();

// ---- smooth scroll for same-page anchors ----
document.querySelectorAll('[data-scroll]').forEach(el => {
  el.addEventListener('click', (e) => {
    const target = el.dataset.scroll;
    if(target.startsWith('#')){
      const dest = document.querySelector(target);
      if(dest){ e.preventDefault(); dest.scrollIntoView({behavior:'smooth'}); }
    }
    document.getElementById('mobileMenu')?.classList.remove('open');
  });
});

// ---- mobile menu ----
document.getElementById('menuBtn')?.addEventListener('click', () => {
  document.getElementById('mobileMenu')?.classList.toggle('open');
});

// ---- newsletter (demo) ----
document.getElementById('newsletterBtn')?.addEventListener('click', () => {
  const val = document.getElementById('newsletterInput')?.value.trim();
  showToast(val ? 'Thanks — this will subscribe you on the live site.' : 'Enter an email first.');
});

// submitForm and contactForm now use real Formspree submission — see wireFormspree() calls near the end of this file.

// ---- hero glow follows mouse slightly ----
(function(){
  const g1 = document.getElementById('glow1');
  const g2 = document.getElementById('glow2');
  if(!g1 || !g2) return;
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    g1.style.transform = `translate(${x}px, ${y}px)`;
    g2.style.transform = `translate(${-x}px, ${-y}px)`;
  });
})();

// ---- animated counters (homepage stats strip) ----
(function(){
  const statTools = document.getElementById('statTools');
  const top = document.getElementById('top');
  if(!statTools || !top) return;
  function animateCount(el, target){
    let cur = 0;
    const step = Math.max(1, Math.ceil(target/30));
    const t = setInterval(() => {
      cur += step;
      if(cur >= target){ cur = target; clearInterval(t); }
      el.textContent = cur;
    }, 30);
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateCount(statTools, tools.length);
        animateCount(document.getElementById('statCats'), CATEGORIES.length);
        animateCount(document.getElementById('statFree'), 1);
        obs.disconnect();
      }
    });
  });
  obs.observe(top);
})();

// ---- compare tool ----
(function(){
  const cmpA = document.getElementById('cmpA');
  const cmpB = document.getElementById('cmpB');
  if(!cmpA || !cmpB) return;
  tools.forEach((t,i) => {
    cmpA.innerHTML += `<option value="${i}">${t.name}</option>`;
    cmpB.innerHTML += `<option value="${i}">${t.name}</option>`;
  });
  cmpB.selectedIndex = 1;
  function renderCompare(){
    const a = tools[cmpA.value], b = tools[cmpB.value];
    const rows = [
      ['Category', a.cat, b.cat],
      ['Pricing', a.price, b.price],
      ['Free plan', a.free ? 'Yes' : 'No', b.free ? 'Yes' : 'No'],
      ['Best for', a.bestFor, b.bestFor],
      ['Ease of use', a.ease, b.ease],
    ];
    document.getElementById('cmpTable').innerHTML = `
      <tr><th></th><th>${a.name}</th><th>${b.name}</th></tr>
      ${rows.map(r => `<tr><td class="feat">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}
    `;
  }
  cmpA.addEventListener('change', renderCompare);
  cmpB.addEventListener('change', renderCompare);
  renderCompare();
})();

// ---- FAQ accordion ----
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-a').style.maxHeight = null; });
    if(!isOpen){ item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
  });
});

// ---- back to top ----
(function(){
  const backBtn = document.getElementById('backToTop');
  if(!backBtn) return;
  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('show', window.scrollY > 600);
  });
  backBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
})();

// ---- active nav highlighting by current page ----
(function(){
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[href], .mobile-menu a[href]').forEach(link => {
    const href = link.getAttribute('href').split('#')[0].split('?')[0] || 'index.html';
    if(href === path) link.classList.add('active');
  });
})();

// ---- floating background particles ----
(function(){
  const wrap = document.getElementById('bgParticles');
  if(!wrap) return;
  const count = 22;
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 4 + Math.random()*10;
    p.style.width = size+'px';
    p.style.height = size+'px';
    p.style.left = Math.random()*100+'vw';
    p.style.setProperty('--drift', (Math.random()*80-40)+'px');
    p.style.animationDuration = (14 + Math.random()*16)+'s';
    p.style.animationDelay = (Math.random()*-20)+'s';
    wrap.appendChild(p);
  }
})();

// ---- ripple effect on interactive elements ----
document.addEventListener('click', (e) => {
  const el = e.target.closest('.btn, .cat-chip, .tab');
  if(!el) return;
  const r = el.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const size = Math.max(r.width, r.height) * 1.4;
  ripple.style.width = ripple.style.height = size+'px';
  ripple.style.left = (e.clientX - r.left - size/2)+'px';
  ripple.style.top = (e.clientY - r.top - size/2)+'px';
  el.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});

// ---- card click pop ----
document.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if(!card) return;
  card.classList.remove('pop');
  void card.offsetWidth;
  card.classList.add('pop');
});

// ---- scroll reveal for sections ----
document.querySelectorAll('section').forEach(sec => {
  if(sec.classList.contains('hero')) return;
  sec.classList.add('reveal');
});
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObs.unobserve(entry.target);
    }
  });
}, {threshold:0.12});
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ---- Tool Finder quiz logic ----
(function(){
  const quiz = document.getElementById('finderQuiz');
  if(!quiz) return;
  const steps = [...quiz.querySelectorAll('.fq-step')];
  const dots = [...quiz.querySelectorAll('.fq-dot')];
  const answers = {cat:null, budget:null, level:null};
  let current = 0;

  function goTo(i){
    steps.forEach(s => s.classList.toggle('active', +s.dataset.step === i));
    dots.forEach(d => d.classList.toggle('active', +d.dataset.step <= i));
    current = i;
    if(i === 3) renderResults();
  }

  quiz.querySelectorAll('.fq-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.fq-options');
      const key = group.dataset.key;
      group.querySelectorAll('.fq-opt').forEach(b => b.classList.remove('picked'));
      btn.classList.add('picked');
      answers[key] = btn.dataset.value;
      setTimeout(() => goTo(Math.min(current + 1, 3)), 260);
    });
  });

  quiz.querySelectorAll('.fq-back').forEach(btn => {
    btn.addEventListener('click', () => goTo(Math.max(current - 1, 0)));
  });

  document.getElementById('fqRestart')?.addEventListener('click', () => {
    answers.cat = answers.budget = answers.level = null;
    quiz.querySelectorAll('.fq-opt').forEach(b => b.classList.remove('picked'));
    goTo(0);
  });

  function renderResults(){
    let matches = tools.filter(t => t.cat === answers.cat);
    if(answers.budget === 'free') matches = matches.filter(t => t.free);
    if(matches.length === 0) matches = tools.filter(t => t.cat === answers.cat);
    const box = document.getElementById('fqResults');
    const title = document.getElementById('fqResultTitle');
    title.textContent = matches.length
      ? `Best matches for ${answers.cat} (${answers.budget === 'free' ? 'free' : 'free & paid'})`
      : `No demo tools in this category yet`;
    box.innerHTML = '';
    matches.slice(0,3).forEach(t => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = cardHTML(t);
      addTilt(card);
      box.appendChild(card);
    });
  }
})();

// ---- Word Counter (free tool, actually works) ----
(function(){
  const wc = document.getElementById('wcInput');
  if(!wc) return;
  function update(){
    const text = wc.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g,'').length;
    const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length : 0;
    const readMins = Math.max(1, Math.round(words / 200));
    document.getElementById('wcWords').textContent = words;
    document.getElementById('wcChars').textContent = chars;
    document.getElementById('wcCharsNoSpace').textContent = charsNoSpace;
    document.getElementById('wcSentences').textContent = sentences;
    document.getElementById('wcRead').textContent = readMins + ' min';
  }
  wc.addEventListener('input', update);
  update();
})();

// ---- live preview panel (homepage) — typewriter demo of the Finder matching ----
(function(){
  const body = document.getElementById('lpBody');
  if(!body) return;
  const demoRuns = [
    {q:'"I need to write product descriptions"', cat:'writing', match:'Scriptly'},
    {q:'"Something to clean up my code"', cat:'coding', match:'CodeLoop'},
    {q:'"Help me audit my SEO"', cat:'seo', match:'Ranklyst'},
    {q:'"I want to generate voiceovers"', cat:'audio', match:'Voxel'},
  ];
  let i = 0;
  function typeLine(text, cls, cb){
    const el = document.createElement('div');
    el.className = 'lp-line ' + cls;
    body.appendChild(el);
    let idx = 0;
    const speed = 18;
    (function tick(){
      el.textContent = text.slice(0, idx);
      idx++;
      if(idx <= text.length){ setTimeout(tick, speed); }
      else if(cb){ setTimeout(cb, 350); }
    })();
  }
  function runDemo(){
    body.innerHTML = '';
    const run = demoRuns[i % demoRuns.length];
    i++;
    typeLine('> ' + run.q, 'q', () => {
      typeLine('Matching category: ' + run.cat, '', () => {
        typeLine('Best match found: ' + run.match, '', () => {
          const done = document.createElement('div');
          done.className = 'lp-line';
          done.style.opacity = 1;
          done.innerHTML = '<span class="lp-cursor"></span>';
          body.appendChild(done);
          setTimeout(runDemo, 2200);
        });
      });
    });
  }
  runDemo();
})();

// ---- trending ranked list (homepage) ----
(function(){
  const box = document.getElementById('trendList');
  if(!box) return;
  const ranked = tools.slice().sort((a,b) => (b.isNew - a.isNew) || (b.free - a.free)).slice(0,5);
  box.innerHTML = ranked.map((t,idx) => `
    <div class="trend-row">
      <span class="trend-rank">0${idx+1}</span>
      <div class="trend-info"><div class="tn">${t.name}</div><div class="tc">${t.cat.charAt(0).toUpperCase()+t.cat.slice(1)} · ${t.free ? 'Free plan' : 'Paid'}</div></div>
      <span class="trend-arrow">→</span>
    </div>
  `).join('');
})();

// ---- floating popup modals (Contact / Submit tool) ----
(function(){
  function wireModal(fabId, modalId, closeId){
    const fab = document.getElementById(fabId);
    const modal = document.getElementById(modalId);
    const close = document.getElementById(closeId);
    if(!fab || !modal) return;
    fab.addEventListener('click', () => modal.classList.add('open'));
    close?.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => { if(e.target === modal) modal.classList.remove('open'); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') modal.classList.remove('open'); });
  }
  wireModal('fabContact', 'contactModal', 'contactModalClose');
  wireModal('fabSubmit', 'submitModal', 'submitModalClose');
})();

// ---- real Formspree submission (works for any form with a data-formspree action) ----
function wireFormspree(formId, successId){
  const form = document.getElementById(formId);
  if(!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
    try{
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {'Accept': 'application/json'}
      });
      if(res.ok){
        form.style.display = 'none';
        document.getElementById(successId)?.classList.add('show');
        showToast('Sent — thank you!');
      } else {
        showToast('Something went wrong — please try again.');
        if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.label || 'Send'; }
      }
    } catch(err){
      showToast('Network error — please try again.');
      if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.label || 'Send'; }
    }
  });
}
wireFormspree('popupContactForm', 'popupContactSuccess');
wireFormspree('popupSubmitForm', 'popupSubmitSuccess');
wireFormspree('contactForm', 'contactSuccess');
wireFormspree('submitForm', 'mfSuccess');
