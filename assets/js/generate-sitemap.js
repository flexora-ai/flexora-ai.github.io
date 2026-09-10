#!/usr/bin/env node
/* ============================================================
   Flexora.Ai — scripts/generate-sitemap.js

   Regenerates BOTH sitemap.xml (for search engines) and
   sitemap.html (a human-readable page on the site) from two
   sources of truth:
     - scripts/pages.json        -> every static page
     - assets/js/blog-data.js    -> every blog post (published: true only)

   Nothing else needs to change by hand. Add a page to pages.json,
   or add/remove a post in blog-data.js, then run:

       node scripts/generate-sitemap.js

   and both sitemap files are rewritten to match exactly. Run it
   again after deleting a post and that post's URL disappears from
   both files — that's the "auto remove" behaviour.

   FULLY AUTOMATIC ON GITHUB PAGES
   ----------------------
   Static GitHub Pages has no server to run Node for you, so
   "automatic" here means: a GitHub Action runs this script on
   every push to main and commits the regenerated sitemap files
   back to the repo. See .github/workflows/update-sitemap.yml —
   once that's merged in, you never have to run this by hand again;
   just edit blog-data.js / pages.json and push like normal.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const PAGES_JSON = path.join(ROOT, 'scripts', 'pages.json');
const BLOG_DATA_JS = path.join(ROOT, 'assets', 'js', 'blog-data.js');
const SITEMAP_XML = path.join(ROOT, 'sitemap.xml');
const SITEMAP_HTML = path.join(ROOT, 'sitemap.html');

// ---------- 1. load static pages config ----------
if (!fs.existsSync(PAGES_JSON)) {
  console.error(`Missing ${PAGES_JSON}. Create it (see scripts/pages.json in this delivery) before running.`);
  process.exit(1);
}
const pagesConfig = JSON.parse(fs.readFileSync(PAGES_JSON, 'utf8'));
const BASE_URL = pagesConfig.baseUrl.replace(/\/$/, '');

// ---------- 2. load blog-data.js safely (it's a browser <script>, not a Node module) ----------
let BLOG_POSTS = [];
if (fs.existsSync(BLOG_DATA_JS)) {
  const code = fs.readFileSync(BLOG_DATA_JS, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  try {
    // blog-data.js declares `const BLOG_POSTS = [...]`. Top-level const/let
    // bindings run via vm.runInContext do NOT get attached to the sandbox
    // object (only `var` does) — so we append a `var` mirror to fish it out.
    vm.runInContext(code + '\nvar __BLOG_POSTS__ = BLOG_POSTS;', sandbox, { filename: 'blog-data.js' });
    BLOG_POSTS = Array.isArray(sandbox.__BLOG_POSTS__) ? sandbox.__BLOG_POSTS__ : [];
  } catch (err) {
    console.error('Could not parse assets/js/blog-data.js — check it for syntax errors:', err.message);
    process.exit(1);
  }
} else {
  console.warn(`Warning: ${BLOG_DATA_JS} not found — sitemap will only include static pages.`);
}

function isoDate(d) {
  return new Date(d).toISOString().slice(0, 10);
}

function mtimeOrToday(relPath) {
  const abs = path.join(ROOT, relPath);
  if (fs.existsSync(abs)) return isoDate(fs.statSync(abs).mtime);
  return isoDate(new Date());
}

// ---------- 3. build the unified URL list ----------
const staticEntries = pagesConfig.pages.map(p => ({
  loc: `${BASE_URL}/${p.path}`,
  lastmod: mtimeOrToday(p.path),
  changefreq: p.changefreq || 'monthly',
  priority: p.priority || '0.5',
  label: p.label || p.path,
  group: 'Pages',
}));

const blogEntries = BLOG_POSTS
  .filter(p => p.published)
  .map(p => ({
    loc: `${BASE_URL}/blog/${p.slug}.html`,
    lastmod: isoDate(p.date),
    changefreq: 'monthly',
    priority: p.featured ? '0.7' : '0.6',
    label: p.title,
    group: 'Blog posts',
  }));

const allEntries = [...staticEntries, ...blogEntries];

// ---------- 4. diff against the previous sitemap.xml, if one exists ----------
function extractLocsFromXml(xml) {
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return new Set(matches.map(m => m[1]));
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
const groups = ['Pages', 'Blog posts'];
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

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

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
<p class="lede">Every page and published blog post on Flexora.Ai — this page and sitemap.xml are regenerated together by scripts/generate-sitemap.js.</p>
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
  if (added.length) console.log(`  + added:   \n    ${added.join('\n    ')}`);
  if (removed.length) console.log(`  - removed: \n    ${removed.join('\n    ')}`);
} else if (fs.existsSync(SITEMAP_XML)) {
  console.log('  No URL changes since the last run.');
}
