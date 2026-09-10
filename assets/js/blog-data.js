/* ============================================================
   Flexora.Ai — assets/js/blog-data.js
   SINGLE SOURCE OF TRUTH for blog posts.

   blog.html (and the "related posts" grid on each article page)
   render their cards straight from this array — add or remove a
   post here and every page updates automatically. Nothing else
   needs to be touched by hand.

   scripts/generate-sitemap.js ALSO reads this exact file to build
   sitemap.xml and sitemap.html, so a post added or removed here
   is added or removed from the sitemap the next time that script
   runs (see README-SITEMAP.md for how to make that fully automatic
   with a GitHub Action).

   HOW TO ADD A NEW POST
   ----------------------
   1. Copy one object below and fill in the fields (see field guide).
   2. Save the real article as /blog/<slug>.html (slug must match).
   3. Run `node scripts/generate-sitemap.js` (or just push — the
      GitHub Action does this for you) to add it to the sitemap.
   That's it — blog.html already shows it, no other file to edit.

   HOW TO REMOVE / UNPUBLISH A POST
   ----------------------
   - Fully delete: remove its object from this array, delete
     /blog/<slug>.html, then run the sitemap script (or push).
   - Draft / not ready yet: keep the object but set
     `published: false` — it shows as a disabled "Coming soon"
     card on blog.html and is left OUT of the sitemap, but doesn't
     need to be deleted.

   FIELD GUIDE
   ----------------------
   slug        - URL slug, no spaces. Article lives at blog/<slug>.html
   title       - Post title shown on the card and <h1>
   excerpt     - One or two sentence summary shown on the card
   category    - short label, e.g. "SEO", "Guides", "Comparisons"
   date        - "YYYY-MM-DD" — also used for the sitemap's <lastmod>
   readMins    - integer, shown as "N min read"
   image       - path to a 1200x630 cover image, or "" to use `icon`
   imageAlt    - alt text for the cover image
   icon        - emoji fallback shown when no image is set
   published   - true = live & included in sitemap / cards link out.
                 false = shows as a disabled "Coming soon" card and
                 is excluded from the sitemap.
   featured    - true = eligible for the hero spotlight slot on
                 blog.html (the newest featured:true post wins)
   ============================================================ */

const BLOG_POSTS = [
  {
    slug: 'how-to-pick-the-right-ai-tool',
    title: 'How to Actually Pick the Right AI Tool (Not Just the Trendiest One)',
    excerpt: 'A simple framework for matching an AI tool to your real task, budget and skill level instead of chasing whatever is trending this week.',
    category: 'Guides',
    date: '2026-08-18',
    readMins: 6,
    image: 'assets/images/blog/pick-the-right-ai-tool.webp',
    imageAlt: 'Illustration of a person comparing AI tool options on a screen',
    icon: '🧭',
    author: 'Piyush Lalwani',
    published: true,
    featured: true,
  },
  {
    slug: 'ai-video-tools-compared',
    title: 'AI Video Tools Compared: FrameThrower vs AllVideoAI vs Visemix',
    excerpt: 'Three very different AI video tools solve three very different jobs. Here is which one actually fits your workflow.',
    category: 'Comparisons',
    date: '2026-08-25',
    readMins: 8,
    image: 'assets/images/blog/ai-video-tools-compared.webp',
    imageAlt: 'Side-by-side comparison graphic of three AI video tool logos',
    icon: '🎬',
    author: 'Piyush Lalwani',
    published: true,
    featured: false,
  },
  {
    slug: 'free-ai-tools-worth-using',
    title: '9 Free AI Tools That Are Actually Worth Using in 2026',
    excerpt: 'No credit card, no trial trap — a shortlist of free-plan AI tools from the Flexora.Ai directory that consistently earn their spot.',
    category: 'Roundups',
    date: '2026-09-02',
    readMins: 5,
    image: 'assets/images/blog/free-ai-tools-worth-using.webp',
    imageAlt: 'Grid illustration of nine free AI tool icons',
    icon: '🆓',
    author: 'Piyush Lalwani',
    published: true,
    featured: false,
  },
  {
    slug: 'ai-agents-for-small-teams',
    title: 'AI Agents for Small Teams: Where to Actually Start',
    excerpt: 'AI agents sound huge. For a five-person team the real starting point is smaller than you think — here is a practical on-ramp.',
    category: 'Guides',
    date: '2026-09-10',
    readMins: 7,
    image: '',
    imageAlt: '',
    icon: '🤖',
    author: 'Piyush Lalwani',
    published: false,
    featured: false,
  },
];

// Every card ALWAYS renders a real <img> — if `image` is empty (no cover
// uploaded yet) this generates a themed placeholder cover on the fly, so
// cards never fall back to a bare icon floating on a gradient div.
function placeholderCover(icon){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='315'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#161B28'/><stop offset='100%' stop-color='#0B0E16'/>
    </linearGradient></defs>
    <rect width='600' height='315' fill='url(#g)'/>
    <circle cx='110' cy='55' r='130' fill='#2DE2C8' opacity='0.14'/>
    <circle cx='520' cy='270' r='150' fill='#4C7BFF' opacity='0.14'/>
    <text x='50%' y='54%' font-size='92' text-anchor='middle' dominant-baseline='middle'>${icon}</text>
  </svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

// ================= shared render helper =================
// blog.html calls this so card markup never drifts between pages.
function blogCardHTML(p, prefix){
  prefix = prefix || '';
  const dateLabel = new Date(p.date + 'T00:00:00').toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'});
  const imgSrc = p.image ? `${prefix}${p.image}` : placeholderCover(p.icon);
  const thumb = `<div class="blog-thumb"><img src="${imgSrc}" alt="${p.imageAlt || p.title}" loading="lazy" onerror="this.src='${placeholderCover(p.icon)}';"/></div>`;
  const author = p.author ? `${p.author} · ` : '';
  const inner = `
    ${thumb}
    <div class="blog-body">
      <span class="blog-cat">${p.category.toUpperCase()}</span>
      <h4>${p.title}</h4>
      <p class="blog-excerpt">${p.excerpt}</p>
      <div class="blog-meta">${author}${p.readMins} min read · ${p.published ? dateLabel : 'Coming soon'}</div>
    </div>`;
  return p.published
    ? `<a class="blog-card" href="${prefix}blog/${p.slug}.html">${inner}</a>`
    : `<div class="blog-card blog-card-disabled" aria-disabled="true" title="Not published yet">${inner}</div>`;
}
