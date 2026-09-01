/* Flexora.Ai — blog post registry.
   This is the ONLY place you need to edit to add, publish, or reorder a blog post.
   It drives both the homepage "Latest guides" preview and the full blog.html grid.

   To add a new post:
   1. Copy /blog/_template.html to /blog/your-post-slug.html and write the article.
   2. Add an object below with matching "slug" and set published:true.
   3. Done — it will appear on blog.html and (if recent) on the homepage automatically.

   Fields:
   - slug:      filename (without .html) inside /blog/
   - title:     headline shown on the card and <title>
   - category:  short label, e.g. "Guide", "Comparison", "Review", "SEO", "Workflow"
   - icon:      one emoji used on the card thumbnail
   - excerpt:   1-2 sentence summary, used on the card and as meta description
   - readMins:  integer, minutes to read
   - date:      "YYYY-MM-DD", used for sorting and display
   - published: true = links to /blog/<slug>.html, false = shows as "Coming soon" (no link)
*/
const BLOG_POSTS = [
  {
    slug: 'beginners-guide-ai-coding-assistant',
    title: "A beginner's guide to picking your first AI coding assistant",
    category: 'Guide',
    icon: '💻',
    excerpt: "What actually matters when you're choosing between AI coding tools — and the four questions that narrow the field fast.",
    readMins: 8,
    date: '2026-08-20',
    published: true
  },
  {
    slug: 'free-vs-paid-ai-tools',
    title: 'Free vs. paid AI tools: when is it actually worth upgrading?',
    category: 'Guide',
    icon: '💳',
    excerpt: 'A practical framework for deciding when a free plan is genuinely limiting you, versus when upgrading just adds cost.',
    readMins: 7,
    date: '2026-08-25',
    published: true
  },
  {
    slug: 'ai-writer-comparison',
    title: 'Scriptly vs. the rest: which AI writer is worth it?',
    category: 'Comparison',
    icon: '⚖️',
    excerpt: 'Full comparison — publishing soon.',
    readMins: 6,
    date: '2026-09-10',
    published: false
  },
  {
    slug: 'content-pipeline-free-tools',
    title: 'Build a full content pipeline with three free-tier tools',
    category: 'Workflow',
    icon: '🔗',
    excerpt: 'Step-by-step workflow — publishing soon.',
    readMins: 5,
    date: '2026-09-17',
    published: false
  },
  {
    slug: 'ai-image-tools-tested',
    title: "We tested five AI image tools — here's what stood out",
    category: 'Review',
    icon: '🎨',
    excerpt: 'Hands-on review — publishing soon.',
    readMins: 9,
    date: '2026-09-24',
    published: false
  },
  {
    slug: 'rank-ai-tool-page-2026',
    title: 'How to actually rank an AI tool page in 2026',
    category: 'SEO',
    icon: '📈',
    excerpt: 'SEO playbook — publishing soon.',
    readMins: 10,
    date: '2026-10-01',
    published: false
  }
];
