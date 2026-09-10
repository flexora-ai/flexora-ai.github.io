#!/usr/bin/env node
/* ============================================================
   Flexora.Ai — scripts/generate-sitemap.js

   Regenerates BOTH sitemap.xml (for search engines) and
   sitemap.html (a human-readable page on the site) by scanning
   the repo itself — no manual page list to maintain:

     - every *.html file in the repo root  -> "Pages"
     - every *.html file in blog/          -> "Blog posts"

   Add a new page or blog post file -> it appears next run.
   Delete one -> it disappears next run. That's the whole system.

   assets/js/blog-data.js is OPTIONAL and only used to enrich blog
   post titles/dates/priority when present and parseable — the
   script never fails or skips a post just because that file is
   missing, out of date, or a post isn't listed in it.

   scripts/pages.json is also OPTIONAL, used only to override the
   auto-detected priority/changefreq/label for specific root pages
   (keyed by filename, e.g. {"path":"index.html","priority":"1.0"}).

   Run manually:  node scripts/generate-sitemap.js
   Run automatically: see .github/workflows/update-sitemap.yml,
   which runs this on every push to main and commits the result.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const PAGES_JSON = path.join(ROOT, 'scripts', 'pages.json');
const BLOG_DATA_JS = path.join(ROOT, 'assets', 'js', 'blog-data.js');
const BLOG_DIR = path.join(ROOT, 'blog');
const SITEMAP_XML = path.join(ROOT, 'sitemap.xml');
const SITEMAP_HTML = path.join(ROOT, 'sitemap.html');

let BASE_URL = 'https://flexora-ai.github.io';

// ---------- 0. optional overrides from scripts/pages.json ----------
// Never required. If missing or broken, we just fall back to sane defaults
// for every page instead of crashing the whole sitemap build.
let overrides = {};
if (fs.existsSync(PAGES_JSON)) {
  try {
    const cfg = JSON.parse(fs.readFileSync(PAGES_JSON, 'utf8'));
    if (cfg.baseUrl) BASE_URL = cfg.baseUrl.replace(/\/$/, '');
    if (Array.isArray(cfg.pages)) cfg.pages.forEach(p => { overrides[p.path] = p; });
  } catch (err) {
    console.warn(`Warning: scripts/pages.json exists but couldn't be parsed (${err.message}). Ignoring it and using defaults.`);
  }
} else {
  console.log('No scripts/pages.json found — using auto-detected defaults for every root page. (This is fine; it is optional.)');
}

const SKIP_ROOT_FILES = new Set(['404.html', 'sitemap.html']);

function isoDate(d) { return new Date(d).toISOString().slice(0, 10); }

function extractTitle(html, fallback) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  if (!m) return fallback;
  return m[1].split('—')[0].split('|')[0].trim() || fallback;
}

// ---------- 1. auto-discover every root-level page ----------
if (!fs.existsSync(ROOT)) {
  console.error(`Repo root not found at ${ROOT} — something is wrong with how this script was invoked.`);
  process.exit(1);
}

const rootHtmlFiles = fs.readdirSync(ROOT)
  .filter(f => f.endsWith('.html') && !SKIP_ROOT_FILES.has(f) && !f.startsWith('_'));

const staticEntries = rootHtmlFiles.map(file => {
  const abs = path.join(ROOT, file);
  const html = fs.readFileSync(abs, 'utf8');
  const override = overrides[file] || {};
  return {
    loc: `${BASE_URL}/${file}`,
    lastmod: isoDate(fs.statSync(abs).mtime),
    changefreq: override.changefreq || (file === 'index.html' ? 'weekly' : 'monthly'),
    priority: override.priority || (file === 'index.html' ? '1.0' : '0.6'),
    label: override.label || extractTitle(html, file),
    group: 'Pages',
  };
}).sort((a, b) => a.loc.localeCompare(b.loc));

// ---------- 2. load blog-data.js ONLY to enrich metadata (never required) ----------
let BLOG_POSTS = [];
if (fs.existsSync(BLOG_DATA_JS)) {
  const code = fs.readFileSync(BLOG_DATA_JS, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  try {
    // blog-data.js declares `const BLOG_POSTS = [...]`. Top-level const/let
    // bindings from vm.runInContext do NOT attach to the sandbox object
    // (only `var` does) — so append a `var` mirror to fish it out.
    vm.runInContext(code + '\nvar __BLOG_POSTS__ = BLOG_POSTS;', sandbox, { filename: 'blog-data.js' });
    BLOG_POSTS = Array.isArray(sandbox.__BLOG_POSTS__) ? sandbox.__BLOG_POSTS__ : [];
  } catch (err) {
    console.warn(`Warning: assets/js/blog-data.js has a syntax error (${err.message}). Blog titles/dates will be read from each post's own <title> tag and file date instead.`);
  }
} else {
  console.log('No assets/js/blog-data.js found — blog post titles/dates will be read directly from each file.');
}
const blogMeta = new Map(BLOG_POSTS.filter(p => p && p.slug).map(p => [p.slug, p]));

// ---------- 3. auto-discover every blog post that actually exists in blog/ ----------
let blogEntries = [];
if (fs.existsSync(BLOG_DIR)) {
  const blogFiles = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html') && !f.startsWith('_'));
  blogEntries = blogFiles.map(file => {
    const slug = file.replace(/\.html$/, '');
    const abs = path.join(BLOG_DIR, file);
    const html = fs.readFileSync(abs, 'utf8');
    const meta = blogMeta.get(slug);
    // Only skip a post if blog-data.js explicitly marks it unpublished.
    // A post file with NO entry in blog-data.js still gets included —
    // the file existing on disk is the source of truth, not the registry.
    if (meta && meta.published === false) return null;
    return {
      loc: `${BASE_URL}/blog/${slug}.html`,
      lastmod: meta && meta.date ? isoDate(meta.date) : isoDate(fs.statSync(abs).mtime),
      changefreq: 'monthly',
      priority: meta && meta.featured ? '0.7' : '0.6',
      label: (meta && meta.title) || extractTitle(html, slug),
      group: 'Blog posts',
    };
  }).filter(Boolean).sort((a, b) => a.loc.localeCompare(b.loc));
} else {
  console.log('No blog/ folder found — skipping blog post discovery.');
}

const allEntries = [...staticEntries, ...blogEntries];

if (allEntries.length === 0) {
  console.error('No pages discovered at all. Refusing to write an empty sitemap — check this script is actually running from the repo root (it expects to live at scripts/generate-sitemap.js).');
  process.exit(1);
}

// ---------- 4. diff against the previous sitemap.xml, if one exists ----------
function extractLocsFromXml(xml) {
  return new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]));
}
let added = [];
let removed = [];
if (fs.existsSync(SITEMAP_XML)) {
  const prevLocs = extractLocsFromXml(fs.readFileSync(SITEMAP_XML, 'utf8'));
  const nextLocs = new Set(allEntries.map(e => e.loc));
  added = [...nextLocs].filter(l => !prevLocs.has(l));
  removed = [...prevLocs].filter(l => !nextLocs.has(l));
}

// ---------- 5. write sitemap.xml ----------
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries.map(e => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(SITEMAP_XML, xml, 'utf8');

// ---------- 6. write sitemap.html (styled to match the site) ----------
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const groups = [...new Set(allEntries.map(e => e.group))];
const groupedHtml = groups.map(g => {
  const items = allEntries.filter(e => e.group === g);
  if (!items.length) return '';
  return `
    <div class="sm-group">
      <h2>${g} <span class="sm-count">${items.length}</span></h2>
      <ul class="sm-list">
        ${items.map(e => `<li><a href="${e.loc}">${escapeHtml(e.label)}</a><span class="sm-date">${e.lastmod}</span></li>`).join('\n        ')}
      </ul>
    </div>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Sitemap — Flexora.Ai</title>
<meta content="Every page and blog post on Flexora.Ai, generated automatically." name="description"/>
<meta content="noindex, follow" name="robots"/>
<link href="assets/images/logo.png" rel="icon" type="image/png"/>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
<style>
  :root{--bg:#07090F;--surface:#0F131D;--line:#232838;--teal:#2DE2C8;--ink:#F2F4FA;--ink-soft:#8A90A6;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--ink);font-family:'Sora',sans-serif;-webkit-font-smoothing:antialiased;}
  a{color:inherit;text-decoration:none;}
  .wrap{max-width:820px;margin:0 auto;padding:70px 32px 100px;}
  .eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;color:var(--teal);border:1px solid rgba(45,226,200,.3);background:rgba(45,226,200,.08);padding:6px 14px;border-radius:20px;}
  .dot{width:6px;height:6px;border-radius:50%;background:var(--teal);}
  h1{font-size:32px;margin:16px 0 8px;}
  .lede{color:var(--ink-soft);font-size:14.5px;margin-bottom:8px;}
  .generated{font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--ink-soft);margin-bottom:40px;display:block;}
  .sm-group{margin-bottom:36px;}
  .sm-group h2{font-size:16px;margin-bottom:14px;display:flex;align-items:center;gap:10px;}
  .sm-count{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--teal);background:rgba(45,226,200,.1);border:1px solid rgba(45,226,200,.3);padding:2px 8px;border-radius:10px;}
  .sm-list{list-style:none;border:1px solid var(--line);border-radius:12px;overflow:hidden;}
  .sm-list li{display:flex;justify-content:space-between;gap:16px;padding:13px 18px;border-bottom:1px solid var(--line);font-size:14px;background:var(--surface);transition:background .15s;}
  .sm-list li:last-child{border-bottom:none;}
  .sm-list li:hover{background:#161B28;}
  .sm-list a{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .sm-list a:hover{color:var(--teal);}
  .sm-date{font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--ink-soft);flex:none;}
  .back{display:inline-block;margin-top:10px;font-size:13.5px;color:var(--teal);}
</style>
</head>
<body>
<div class="wrap">
<span class="eyebrow"><span class="dot"></span>Auto-generated</span>
<h1>Sitemap</h1>
<p class="lede">Every page and blog post currently in the repo — this page and sitemap.xml are regenerated together by scripts/generate-sitemap.js on every push, by scanning the repo directly.</p>
<span class="generated">Last generated: ${new Date().toISOString()}</span>
${groupedHtml}
<a class="back" href="index.html">← Back to home</a>
</div>
</body>
</html>
`;
fs.writeFileSync(SITEMAP_HTML, html, 'utf8');

// ---------- 7. report ----------
console.log(`\nsitemap.xml + sitemap.html regenerated — ${allEntries.length} URLs total (${staticEntries.length} pages, ${blogEntries.length} blog posts).`);
if (added.length || removed.length) {
  if (added.length) console.log(`  + added:\n    ${added.join('\n    ')}`);
  if (removed.length) console.log(`  - removed:\n    ${removed.join('\n    ')}`);
} else if (fs.existsSync(SITEMAP_XML)) {
  console.log('  No URL changes since the last run.');
}
