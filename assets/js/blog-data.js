/* Flexora.Ai — REAL blog post data, pulled directly from the 9 live pages
   at flexora-ai.github.io/blog/*.html — titles, images, dates, and authors
   are copied from each page's actual <meta> tags, not guessed.

   HOW TO USE:
   1. Save as: assets/js/blog-data.js (upload to your repo)
   2. blog.html and index.html both read the global BLOG_POSTS array below.
   3. To add a new post later: copy one { ... } block, fill in the fields,
      set published:true, done. Set published:false to hide a post without
      deleting it (shows as "Coming soon" on the homepage preview).

   KNOWN ISSUE ON YOUR LIVE SITE (not fixed here, fix on the real pages):
   beginners-guide-to-ai-tools-for-small-business.html and
   what-is-ai-automation-for-small-business.html both show "September 7,
   2024" in their <meta> tags — a year typo, since every other post says
   2026. Dates below are corrected to 2026 so sorting doesn't break, but
   the actual pages still say 2024 until you edit them directly.
   ========================================================================= */

const BLOG_POSTS = [
  {
    slug: 'ai-tools-for-solopreneurs',
    title: 'Best AI Tools for Solopreneurs (2026 Complete Guide)',
    excerpt: 'Discover the best AI tools for solopreneurs to automate tasks, boost productivity, and scale your one-person business in 2026.',
    category: 'Solopreneurs',
    author: 'Prashant Lalwani',
    date: '2026-09-19',
    readMins: 12,
    image: 'assets/images/blog/ai-tools-for-solopreneurs.webp',
    imageAlt: 'Solopreneur using AI tools to manage multiple aspects of their one-person business efficiently',
    icon: '🧑‍💻',
    published: true,
    featured: true
  },
  {
    slug: 'how-to-automate-small-business-tasks-with-ai',
    title: 'How to Automate Small Business Tasks with AI (2026 Guide)',
    excerpt: 'Learn how to automate small business tasks with AI. Step-by-step guide to save time, reduce costs, and scale your operations in 2026.',
    category: 'Guide',
    author: 'Prashant Lalwani',
    date: '2026-09-17',
    readMins: 11,
    image: 'assets/images/blog/how-to-automate-small-business-tasks-with-ai.webp',
    imageAlt: 'Small business owner using AI automation tools to manage daily tasks and workflows efficiently',
    icon: '⚙️',
    published: true,
    featured: false
  },
  {
    slug: 'ai-automation-tools-for-small-business',
    title: 'AI Automation Tools for Small Business (2026 Complete Guide)',
    excerpt: 'Discover the best AI automation tools for small business in 2026. Save time, reduce costs, and scale your operations with these powerful automation solutions.',
    category: 'Automation',
    author: 'Prashant Lalwani',
    date: '2026-09-16',
    readMins: 10,
    image: 'assets/images/blog/ai-automation-tools-for-small-business.webp',
    imageAlt: 'AI automation tools dashboard showing various automation workflows and productivity metrics for small business',
    icon: '🤖',
    published: true,
    featured: false
  },
  {
    slug: 'choose-right-ai-tool',
    title: 'How to Choose the Right AI Tool for Your Business (2026 Guide)',
    excerpt: 'Stop wasting money on shiny AI tools. A practical, step-by-step framework to choose the right AI tool for your specific business problem, budget, and team size.',
    category: 'Guide',
    author: 'Prashant Lalwani',
    date: '2026-09-15',
    readMins: 8,
    image: 'assets/images/blog/choose-right-ai-tool.webp',
    imageAlt: 'AI tool selection framework showing decision matrix and evaluation criteria for choosing the right AI software for business needs',
    icon: '🧭',
    published: true,
    featured: false
  },
  {
    slug: 'ai-tools-for-startup-founders',
    title: 'AI Tools for Startup Founders: The 2026 Playbook',
    excerpt: 'The AI tools startup founders actually keep past month two. Stack by stage, real cost math, and the tools we cancelled — based on 10 founder interviews.',
    category: 'Founders',
    author: 'Prashant Lalwani',
    date: '2026-09-07',
    readMins: 13,
    image: 'assets/images/blog/ai-tools-for-startup-founders.webp',
    imageAlt: 'Startup founder building a company with a stack of AI tools for research, coding, writing, and outreach',
    icon: '🚀',
    published: true,
    featured: false
  },
  {
    slug: 'ai-tools-for-writing-job-listings',
    title: 'AI Tools for Writing Job Listings That Get Applicants (2026)',
    excerpt: 'Which AI tools actually help small businesses write job listings that attract the right applicants — and which ones just generate generic corporate filler.',
    category: 'Hiring',
    author: 'Prashant Lalwani',
    date: '2026-09-07',
    readMins: 10,
    image: 'assets/images/blog/ai-tools-for-writing-job-listings.webp',
    imageAlt: 'AI tools for writing job listings that attract the right applicants without generic corporate filler',
    icon: '📋',
    published: true,
    featured: false
  },
  {
    slug: 'ai-form-filling-automation-tools',
    title: 'AI Form Filling Automation Tools for Small Business (2026)',
    excerpt: "The difference between browser autofill, AI form fillers, and full RPA — and which one actually fits a small business's form-filling problem.",
    category: 'Automation',
    author: 'Prashant Lalwani',
    date: '2026-09-07',
    readMins: 11,
    image: 'assets/images/blog/ai-form-filling-automation-tools.webp',
    imageAlt: 'AI form filling automation tools comparison - browser autofill, PDF fillers, and RPA for small business',
    icon: '📝',
    published: true,
    featured: false
  },
  {
    slug: 'beginners-guide-to-ai-tools-for-small-business',
    title: "Beginner's Guide to AI Tools for Small Business (No Jargon)",
    excerpt: "A no-jargon starting point for small business owners who haven't used AI tools yet — what to try first, what to skip, and how much it actually costs.",
    category: "Beginner's Guide",
    author: 'Prashant Lalwani',
    date: '2026-09-07', // live page shows 2024 — typo on the real page, see note above
    readMins: 10,
    image: 'assets/images/blog/beginners-guide-to-ai-tools-for-small-business.webp',
    imageAlt: "Beginner's guide to AI tools for small business - simple starting point with no jargon",
    icon: '🔰',
    published: true,
    featured: false
  },
  {
    slug: 'what-is-ai-automation-for-small-business',
    title: 'What Is AI Automation for Small Business? (Plain-English Definition)',
    excerpt: "AI automation explained without jargon — what it actually means for a small business, and how it's different from just 'using an AI tool.'",
    category: 'Education',
    author: 'Prashant Lalwani',
    date: '2026-09-07', // live page shows 2024 — typo on the real page, see note above
    readMins: 10,
    image: 'assets/images/blog/what-is-ai-automation-for-small-business.webp',
    imageAlt: 'What is AI automation for small business - plain English definition with real examples',
    icon: '💡',
    published: true,
    featured: false
  },
];
