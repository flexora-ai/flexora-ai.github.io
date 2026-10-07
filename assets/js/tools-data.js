/* ============================================================
   Flexora.Ai — assets/js/tools-data.js
   SINGLE SOURCE OF TRUTH for tool + category data.
   Loaded by index.html, tools.html, compare.html, suite.html, tools/*.html, etc.
   ============================================================ */

// ---- category icon set (inline SVG, crisp at any size) ----
const ICONS = {
  writing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>',
  coding: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  seo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  audio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3Z"/></svg>',
  design: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 19.5A2.5 2.5 0 0 1 4.5 17H8v2.5a2.5 2.5 0 0 1-5 0Z"/><path d="M8 17v-3.5A3.5 3.5 0 0 1 11.5 10H15V6a4 4 0 0 1 4-4 4 4 0 0 1-4 4v3.5A3.5 3.5 0 0 1 11.5 17H8Z"/></svg>',
  productivity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="m9 12 2 2 4-4"/><path d="M9 7h6"/></svg>',
  automation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="m4.9 4.9 2.8 2.8"/><path d="M2 12h4"/><path d="m4.9 19.1 2.8-2.8"/><path d="M12 18v4"/><path d="m16.3 16.3 2.8 2.8"/><path d="M18 12h4"/><path d="m16.3 7.7 2.8-2.8"/><circle cx="12" cy="12" r="4"/></svg>',
  other: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
};

const CATEGORIES = [
  {key:'writing', label:'Writing', icon:ICONS.writing},
  {key:'image', label:'Image', icon:ICONS.image},
  {key:'video', label:'Video', icon:ICONS.video},
  {key:'coding', label:'Coding', icon:ICONS.coding},
  {key:'seo', label:'SEO', icon:ICONS.seo},
  {key:'design', label:'Design', icon:ICONS.design},
  {key:'productivity', label:'Productivity', icon:ICONS.productivity},
  {key:'automation', label:'Automation', icon:ICONS.automation},
];

// ---- Live tools database ----
const tools = [
  // ===== TIER 1 — Featured =====
  {
    id: 'framethrower',
    slug: 'framethrower',
    name: 'FrameThrower',
    website: 'https://framethrower.ai',
    cat: 'video',
    subcategory: 'AI Video & Creative Engineering',
    tier: 1,
    price: 'Freemium',
    free: true,
    isNew: true,
    rating: 4.9,
    verified: true,
    featured: true,
    desc: 'AI creative video tool with API, MCP and SDK support for professional workflows.',
    fullDescription: 'FrameThrower is an enterprise-grade AI video generation and creative automation platform. Built specifically for developers, video creators, and creative agencies, it enables scalable video synthesis, text-to-video generation, image-to-video animations, and automated video editing pipelines. With robust API support, Model Context Protocol (MCP) integrations, and software development kits (SDKs), FrameThrower empowers teams to generate studio-quality video content at high speeds.',
    features: ['AI Text-to-Video synthesis', 'Image-to-Video animation', 'Professional developer API & SDKs', 'Model Context Protocol (MCP) integration', 'Custom motion controls & camera paths', 'High-resolution video render exports'],
    bestFor: ['Video Creators & Editors', 'Marketing Agencies', 'Developers & AI Engineers', 'Content Operations Teams'],
    useCases: ['Automated social video creation', 'Product promotional video production', 'Personalized video campaigns', 'AI-assisted storyboarding and animation'],
    startingPrice: 'Free plan with trial credits; premium plans from $19/month',
    icon: 'F',
    ease: 'Moderate'
  },
  {
    id: 'revenuefromchat',
    slug: 'revenuefromchat',
    name: 'RevenueFromChat',
    website: 'https://revenuefromchat.com',
    cat: 'automation',
    subcategory: 'Conversational AI & Sales Automation',
    tier: 1,
    price: 'Paid/Freemium',
    free: true,
    isNew: true,
    rating: 4.8,
    verified: true,
    featured: true,
    desc: 'Turns everyday chat conversations into automated revenue workflows for businesses.',
    fullDescription: 'RevenueFromChat is an intelligent conversation monetization and lead conversion platform. It seamlessly turns website chats, messaging apps, and customer interactions into automated revenue channels. By utilizing custom AI chat flows, automated payment triggers, and CRM integrations, businesses can convert casual visitors into paying customers 24/7 without manual sales intervention.',
    features: ['Automated chat lead qualification', 'Direct in-chat payment links', 'CRM & Webhook integrations', 'Multi-platform chat support', 'Custom AI chatbot training on business data'],
    bestFor: ['E-commerce Brands', 'B2B Sales Teams', 'Service Providers', 'Digital Agencies'],
    useCases: ['Automated customer lead capturing', 'In-chat checkout and bookings', 'Instant 24/7 sales support', 'Cart abandonment recovery via messaging'],
    startingPrice: 'Freemium tier available; Pro plans from $29/month',
    icon: 'R',
    ease: 'Moderate'
  },
  {
    id: 'salestouch',
    slug: 'salestouch',
    name: 'SalesTouch',
    website: 'https://www.salestouch.io',
    cat: 'automation',
    subcategory: 'Outbound B2B Sales Automation',
    tier: 1,
    price: 'Paid',
    free: false,
    isNew: true,
    rating: 4.7,
    verified: false,
    featured: true,
    desc: 'B2B sales automation platform built to speed up outbound and follow-up.',
    fullDescription: 'SalesTouch is a high-velocity B2B sales automation and engagement platform designed for outbound revenue teams. It streamlines lead prospecting, automated cold email sequencing, multi-channel follow-ups, and pipeline tracking. SalesTouch helps sales representatives increase response rates and close deals faster with AI-assisted messaging.',
    features: ['Automated email sequence builder', 'Smart lead enrichment & verification', 'Multi-channel outreach tracking', 'AI personalized email draft generator', 'CRM bi-directional synchronization'],
    bestFor: ['B2B Sales Representatives', 'SaaS Growth Teams', 'Business Development Reps (BDRs)', 'Agency Owners'],
    useCases: ['Cold email outreach automation', 'Prospecting & follow-up management', 'Meeting scheduling automation', 'Outbound pipeline acceleration'],
    startingPrice: 'Paid plans start at $49/month with a free trial',
    icon: 'S',
    ease: 'Moderate'
  },
  {
    id: 'modelrush',
    slug: 'modelrush',
    name: 'ModelRush',
    website: 'https://modelrush.ai',
    cat: 'coding',
    subcategory: 'AI Infrastructure & Developer Tooling',
    tier: 1,
    price: 'Paid',
    free: false,
    isNew: true,
    rating: 4.9,
    verified: true,
    featured: true,
    desc: 'AI model infrastructure and tooling for developers shipping AI-powered features.',
    fullDescription: 'ModelRush provides high-performance AI model hosting, low-latency API endpoints, and fine-tuning infrastructure for software engineering teams. Designed to eliminate complex DevOps overhead, ModelRush allows developers to deploy, evaluate, and scale LLMs and open-source models with production-level reliability and instant observability.',
    features: ['Zero-setup LLM deployment & hosting', 'Ultra-low latency inference API', 'Model fine-tuning & evaluation dashboard', 'Cost & token usage monitoring', 'Enterprise-grade uptime and security'],
    bestFor: ['AI Developers & Engineers', 'Tech Startups & Founders', 'Data Science Teams', 'Product Managers'],
    useCases: ['Deploying custom LLMs to production', 'API middleware for AI applications', 'Fine-tuning open source models', 'Inference latency optimization'],
    startingPrice: 'Pay-as-you-go pricing from $0.002/1k tokens; team plans available',
    icon: 'M',
    ease: 'Advanced'
  },
  {
    id: 'make-floor-plan',
    slug: 'make-floor-plan',
    name: 'Make Floor Plan',
    website: 'https://makefloorplan.com/floor-plan-generator',
    cat: 'design',
    subcategory: 'Architectural & Space Design',
    tier: 1,
    price: 'Freemium',
    free: true,
    isNew: true,
    rating: 4.8,
    verified: true,
    featured: true,
    desc: 'Generates architectural floor plans from simple inputs in minutes.',
    fullDescription: 'Make Floor Plan is an intuitive AI architectural generator that transforms rough hand-drawn sketches, dimension inputs, or text prompts into clean 2D and 3D floor plans. Ideal for real estate agents, architects, interior designers, and home renovators looking to visualize property layouts effortlessly.',
    features: ['2D to 3D floor plan conversion', 'Hand-drawn sketch vectorization', 'Custom room labeling and dimensioning', 'High-res PDF & PNG exports', 'Interior furniture layout suggestions'],
    bestFor: ['Architects & Interior Designers', 'Real Estate Agents', 'Homeowners & Renovators', 'Property Developers'],
    useCases: ['Real estate listing floor plan creation', 'Architectural conceptual drafting', 'Home renovation space planning', '3D property layout walkthroughs'],
    startingPrice: 'Free trial available; exports start at $9.99/project',
    icon: 'M',
    ease: 'Easy'
  },
  {
    id: 'htmlslides',
    slug: 'htmlslides',
    name: 'HtmlSlides',
    website: 'https://www.htmlslides.ai',
    cat: 'productivity',
    subcategory: 'AI Presentation & Slide Builder',
    tier: 1,
    price: 'Freemium',
    free: true,
    isNew: true,
    rating: 4.7,
    verified: false,
    featured: true,
    desc: 'Builds clean, HTML-based presentation slides from your content automatically.',
    fullDescription: 'HtmlSlides automatically converts markdown notes, documents, or outline text into beautiful, responsive web-native presentation decks. By generating clean HTML, CSS, and interactive components, presentations load instantly in any web browser and can be embedded or shared via simple URL links.',
    features: ['Text & Markdown-to-Slide conversion', 'Responsive web-based slide decks', 'Export to HTML, PDF, or interactive web link', 'Custom branding & theme customization', 'Presenter mode with speaker notes'],
    bestFor: ['Startup Founders & Pitchers', 'Educators & Trainers', 'Marketing Professionals', 'Tech Presenters'],
    useCases: ['Investor pitch deck creation', 'Sales presentation building', 'Educational lecture slides', 'Webinar presentation decks'],
    startingPrice: 'Free plan available; Pro tier at $12/month',
    icon: 'H',
    ease: 'Easy'
  },
  {
    id: 'seokru',
    slug: 'seokru',
    name: 'SEOKRU',
    website: 'https://he.seokru.com',
    cat: 'seo',
    subcategory: 'Keyword Research & SERP Tracking',
    tier: 1,
    price: 'Paid',
    free: false,
    isNew: true,
    rating: 4.6,
    verified: false,
    featured: true,
    desc: 'SEO and marketing toolkit for keyword research and campaign tracking.',
    fullDescription: 'SEOKRU is a comprehensive search engine optimization suite designed to discover high-value keywords, audit site performance, track search engine rankings, and analyze competitor SEO strategies. It gives marketers clear, actionable insights to boost organic search rankings.',
    features: ['Keyword discovery & difficulty metrics', 'Daily rank tracking across search engines', 'On-page SEO site auditing tool', 'Competitor backlink & content analysis', 'Automated weekly SEO reporting'],
    bestFor: ['SEO Specialists', 'Content Marketing Managers', 'E-commerce Site Owners', 'Digital Marketing Agencies'],
    useCases: ['Organic search ranking improvement', 'Competitor SEO gap analysis', 'Keyword strategy planning', 'Automated client SEO reporting'],
    startingPrice: 'Subscriptions from $29/month; 7-day trial available',
    icon: 'S',
    ease: 'Moderate'
  },
  {
    id: 'allvideoai',
    slug: 'allvideoai',
    name: 'AllVideoAI',
    website: 'https://allvideoai.com',
    cat: 'video',
    subcategory: 'All-in-One AI Video Generation',
    tier: 1,
    price: 'Paid',
    free: false,
    isNew: true,
    rating: 4.8,
    verified: true,
    featured: true,
    desc: 'All-in-one AI video generation suite for quick, polished output.',
    fullDescription: 'AllVideoAI combines scriptwriting, AI voice synthesis, avatar generation, and automated video editing into a unified web application. Users can produce high-converting short-form videos for TikTok, YouTube Shorts, and Instagram Reels in minutes.',
    features: ['Script-to-video AI generator', 'Realistic AI voiceovers in 30+ languages', 'AI avatar presentation creation', 'Automated subtitle and captioning', 'Stock media & template library'],
    bestFor: ['Social Media Creators', 'Short-Form Content Producers', 'Digital Marketers', 'E-learning Instructors'],
    useCases: ['TikTok & YouTube Shorts production', 'Automated video ad creation', 'Explainer video generation', 'Multi-lingual video localization'],
    startingPrice: 'Plans start at $24/month',
    icon: 'A',
    ease: 'Moderate'
  },
  {
    id: 'photoshoot-app',
    slug: 'photoshoot-app',
    name: 'Photoshoot.app',
    website: 'https://photoshoot.app',
    cat: 'image',
    subcategory: 'E-commerce Product Photography',
    tier: 1,
    price: 'Freemium',
    free: true,
    isNew: true,
    rating: 4.9,
    verified: true,
    featured: true,
    desc: 'Generates studio-quality product photos without a physical photoshoot.',
    fullDescription: 'Photoshoot.app leverages generative AI to turn basic smartphone pictures of products into commercial, studio-quality product photographs. E-commerce merchants can swap backgrounds, place products in photorealistic lifestyle scenes, and generate studio lighting without hiring photographers.',
    features: ['Automated background removal & replacement', 'Photorealistic AI lifestyle scenes', 'Custom shadow and studio lighting generator', 'High-definition 4K image upscale', 'Batch product image processing'],
    bestFor: ['E-commerce Store Owners (Shopify, Amazon)', 'Product Marketers', 'Social Media Managers', 'Creative Agencies'],
    useCases: ['Amazon product listing images', 'Social media ad visuals', 'E-commerce catalog photography', 'Marketing banner generation'],
    startingPrice: 'Free trial with 5 credits; paid plans from $15/month',
    icon: 'P',
    ease: 'Easy'
  },
  {
    id: 'socialecho',
    slug: 'socialecho',
    name: 'SocialEcho',
    website: 'https://socialecho.net',
    cat: 'automation',
    subcategory: 'Social Media Automation & Engagement',
    tier: 1,
    price: 'Freemium',
    free: true,
    isNew: true,
    rating: 4.7,
    verified: false,
    featured: true,
    desc: 'Automates social media posting and engagement across platforms.',
    fullDescription: 'SocialEcho is an AI-powered social media management and scheduling platform. It creates channel-optimized content, schedules posts across Twitter/X, LinkedIn, Facebook, and Instagram, and uses smart auto-replies to boost engagement with audience comments.',
    features: ['Multi-platform social content scheduler', 'AI caption & hashtag generator', 'Automated comment engagement bot', 'Performance analytics dashboard', 'Visual content calendar'],
    bestFor: ['Social Media Managers', 'Solopreneurs & Creators', 'Marketing Agencies', 'Small Business Owners'],
    useCases: ['Cross-platform social media scheduling', 'AI-assisted social copy writing', 'Automated audience reply management', 'Brand engagement growth'],
    startingPrice: 'Free plan available; Pro plan from $19/month',
    icon: 'S',
    ease: 'Easy'
  },

  // ===== TIER 2 — Recommended =====
  {
    id: 'free-ai-image',
    slug: 'free-ai-image',
    name: 'Free AI Image',
    website: 'https://freeaiimage.io',
    cat: 'image',
    subcategory: 'Instant AI Image Generation',
    tier: 2,
    price: 'Freemium',
    free: true,
    isNew: true,
    rating: 4.6,
    verified: false,
    featured: false,
    desc: 'Free browser-based AI image generator for quick visuals.',
    fullDescription: 'Free AI Image provides an easy-to-use, browser-based text-to-image generator powered by modern diffusion models. Users can instantly generate artwork, marketing assets, and illustrations without sign-up friction.',
    features: ['Instant text-to-image generator', 'Multiple art styles & aspect ratios', 'No credit card required to start', 'High-speed rendering engine', 'Free download in high resolution'],
    bestFor: ['Bloggers & Content Writers', 'Designers needing quick concepts', 'Social Media Creators', 'Casual Users'],
    useCases: ['Blog post header images', 'Social media graphics', 'Creative concept art', 'Presentation visual assets'],
    startingPrice: 'Free plan with daily credits',
    icon: 'F',
    ease: 'Easy'
  },
  {
    id: 'profileloom',
    slug: 'profileloom',
    name: 'ProfileLoom',
    website: 'https://aiportraitgen.app',
    cat: 'image',
    subcategory: 'AI Headshot & Portrait Generator',
    tier: 2,
    price: 'Freemium',
    free: true,
    isNew: true,
    rating: 4.7,
    verified: true,
    featured: false,
    desc: 'Turns everyday selfies into polished, professional AI portraits.',
    fullDescription: 'ProfileLoom transforms casual smartphone selfies into studio-grade executive headshots, LinkedIn portraits, and resume pictures using advanced generative portrait models.',
    features: ['Selfie-to-headshot AI model', 'Custom wardrobe & backdrop styles', 'High-res portrait enhancement', 'Natural skin tone preservation', 'Fast 15-minute generation'],
    bestFor: ['Job Seekers & Professionals', 'LinkedIn Creators', 'Corporate Teams', 'Freelancers'],
    useCases: ['LinkedIn profile photo updates', 'Company team website photos', 'Resume and CV profile pictures', 'Speaker bio photos'],
    startingPrice: 'Packages from $14.99',
    icon: 'P',
    ease: 'Easy'
  },
  {
    id: 'ai-fruit-video',
    slug: 'ai-fruit-video',
    name: 'AI Fruit Video',
    website: 'https://aifruitvideo.com',
    cat: 'video',
    subcategory: 'Niche Creative Video Animation',
    tier: 2,
    price: 'Freemium',
    free: true,
    isNew: true,
    rating: 4.5,
    verified: false,
    featured: false,
    desc: 'Niche AI video generator built for food and produce content creators.',
    fullDescription: 'AI Fruit Video is a specialized animation tool engineered for culinary creators, food brands, and agricultural marketers to produce eye-catching 3D animations and viral food videos.',
    features: ['Food & produce 3D animation templates', 'Text-to-culinary video generation', 'Vibrant color and texture filters', 'Social video export presets', 'Royalty-free audio background tracks'],
    bestFor: ['Food Bloggers & Chefs', 'Restaurant Marketers', 'Agriculture Brands', 'TikTok Creators'],
    useCases: ['Food recipe video animations', 'Restaurant social ad campaigns', 'Product promotional reels', 'Educational nutrition content'],
    startingPrice: 'Free tier available; Premium from $9.99/month',
    icon: 'A',
    ease: 'Easy'
  },
  {
    id: 'visemix',
    slug: 'visemix',
    name: 'Visemix',
    website: 'https://lipsync.vip',
    cat: 'video',
    subcategory: 'AI Lip-Sync & Video Dubbing',
    tier: 2,
    price: 'Freemium',
    free: true,
    isNew: true,
    rating: 4.8,
    verified: true,
    featured: false,
    desc: 'AI lip-sync tool that matches video to any audio track accurately.',
    fullDescription: 'Visemix is a precision lip-synchronization and video dubbing tool that matches mouth movements in video files to custom audio tracks in multiple languages with photorealistic accuracy.',
    features: ['Frame-accurate AI lip-syncing', 'Multi-language video localization', 'Audio track replacement & voice match', 'High-definition video rendering', 'Batch processing support'],
    bestFor: ['Video Translators & Dubbers', 'Global Content Marketers', 'E-learning Providers', 'Film Producers'],
    useCases: ['Translating video courses into new languages', 'Localized social ad campaigns', 'Character voice dubbing', 'AI avatar video sync'],
    startingPrice: 'Freemium with free credits; Pro from $19.99/month',
    icon: 'V',
    ease: 'Moderate'
  },
  {
    id: 'image-to-calendar',
    slug: 'image-to-calendar',
    name: 'Image to Calendar',
    website: 'https://imagetocalendar.app',
    cat: 'productivity',
    subcategory: 'Optical Schedule & Event Extraction',
    tier: 2,
    price: 'Paid only',
    free: false,
    isNew: true,
    rating: 4.6,
    verified: false,
    featured: false,
    desc: 'Turns a photo of a schedule or itinerary into real calendar events.',
    fullDescription: 'Image to Calendar extracts event details, dates, times, and locations from photos of paper schedules, flight itineraries, or event flyers, automatically syncing them directly into Google Calendar or Apple iCal.',
    features: ['OCR & AI schedule extraction', 'Direct sync with Google Calendar & iCal', 'Multi-event batch extraction', 'Automated timezone detection', 'Mobile camera upload support'],
    bestFor: ['Busy Professionals', 'Students & Academics', 'Event Attendees', 'Travelers'],
    useCases: ['Importing conference schedules', 'Syncing school/class timetables', 'Flight itinerary calendar entry', 'Paper flyer to digital event conversion'],
    startingPrice: '$4.99/month',
    icon: 'I',
    ease: 'Easy'
  },
  {
    id: 'pragor',
    slug: 'pragor',
    name: 'Pragor',
    website: 'https://pragor.net',
    cat: 'automation',
    subcategory: 'Autonomous AI Operational Agents',
    tier: 2,
    price: 'Free',
    free: true,
    isNew: true,
    rating: 4.7,
    verified: true,
    featured: false,
    desc: 'AI agent platform for automating day-to-day operational tasks.',
    fullDescription: 'Pragor is an autonomous AI agent framework designed to execute repetitive operational tasks such as data entry, email triage, report generation, and multi-app workflows.',
    features: ['Autonomous task execution agents', 'Web scraping & browser automation', 'API & Webhook connectivity', 'Custom workflow logic builder', 'Real-time task monitoring logs'],
    bestFor: ['Operations Managers', 'Startup Teams', 'Data Analysts', 'Automation Engineers'],
    useCases: ['Automated daily reporting', 'Web data extraction', 'Email auto-processing', 'Workflow orchestration'],
    startingPrice: '100% Free & Open Community Edition',
    icon: 'P',
    ease: 'Moderate'
  },
  {
    id: 'orkas',
    slug: 'orkas',
    name: 'Orkas',
    website: 'https://orkas.ai',
    cat: 'coding',
    subcategory: 'Developer AI Agent Framework',
    tier: 2,
    price: 'Freemium',
    free: true,
    isNew: true,
    rating: 4.8,
    verified: true,
    featured: false,
    desc: 'Open-source-friendly AI agent framework for developers.',
    fullDescription: 'Orkas provides a robust, developer-centric SDK for building, testing, and deploying multi-agent AI systems with state management and memory retention.',
    features: ['Multi-agent coordination framework', 'Long-term vector memory integration', 'Python & TypeScript SDKs', 'Debugging & tracing dashboard', 'Local & cloud deployment options'],
    bestFor: ['Software Engineers', 'AI Researchers', 'SaaS Builders', 'DevOps Engineers'],
    useCases: ['Building multi-agent AI assistants', 'Automated code review pipelines', 'Complex data processing agents', 'Custom customer support bots'],
    startingPrice: 'Open-source core free; Cloud hosting from $29/month',
    icon: 'O',
    ease: 'Advanced'
  },
  {
    id: 'chatcument',
    slug: 'chatcument',
    name: 'Chatcument',
    website: 'https://chatcument.com',
    cat: 'productivity',
    subcategory: 'Document Q&A & Intelligence',
    tier: 2,
    price: 'Freemium',
    free: true,
    isNew: true,
    rating: 4.6,
    verified: false,
    featured: false,
    desc: 'Browser-based AI utilities for chatting with and summarizing documents.',
    fullDescription: 'Chatcument allows users to upload PDFs, Word documents, research papers, or spreadsheets and ask questions, extract key insights, or generate summaries in natural language.',
    features: ['PDF, DOCX, CSV document chat', 'Instant multi-page summarization', 'Citation & page reference tracking', 'Multi-language document support', 'Privacy-focused encryption'],
    bestFor: ['Researchers & Students', 'Legal & Compliance Officers', 'Business Analysts', 'Medical Professionals'],
    useCases: ['Research paper synthesis', 'Contract clause extraction', 'Financial report analysis', 'Study guide creation'],
    startingPrice: 'Free plan (up to 3 docs/day); Pro plan from $9.99/month',
    icon: 'C',
    ease: 'Easy'
  },

  // ===== TIER 3 — More tools =====
  {
    id: 'flux-art',
    slug: 'flux-art',
    name: 'Flux Art',
    website: 'https://flux-art.cc',
    cat: 'image',
    subcategory: 'Flux Model AI Art Generation',
    tier: 3,
    price: 'Freemium',
    free: true,
    isNew: true,
    rating: 4.7,
    verified: false,
    featured: false,
    desc: 'AI art generator built on the Flux model family.',
    fullDescription: 'Flux Art delivers state-of-the-art text rendering, prompt adherence, and realistic imagery built upon the cutting-edge Flux AI model architecture.',
    features: ['Flux model family integration', 'Unmatched prompt text rendering', 'High-detail photorealism & stylized modes', 'Custom prompt assistance', 'Commercial usage rights'],
    bestFor: ['Digital Artists', 'Graphic Designers', 'Prompt Engineers', 'Creative Directors'],
    useCases: ['Typographic poster creation', 'Concept art design', 'High-end visual illustration', 'Marketing ad creation'],
    startingPrice: 'Free daily generation allowance; Pro from $12/month',
    icon: 'F',
    ease: 'Easy'
  },
  {
    id: 'nextlerai-publisher',
    slug: 'nextlerai-publisher',
    name: 'NextlerAI Publisher',
    website: 'https://nextlerai.com/product/nextlerai-publisher/',
    cat: 'writing',
    subcategory: 'SEO Content Generation & Publishing',
    tier: 3,
    price: 'Paid',
    free: false,
    isNew: true,
    rating: 4.5,
    verified: false,
    featured: false,
    desc: 'AI writing and publishing tool built for SEO-driven content.',
    fullDescription: 'NextlerAI Publisher automates SEO keyword research, article drafting, internal linking, and WordPress publishing into a single stream.',
    features: ['Automated long-form article generator', 'WordPress auto-publishing integration', 'SERP competitor analysis & keyword insertion', 'AI image generation for featured posts', 'Plagiarism check & readability score'],
    bestFor: ['Niche Site Owners', 'SEO Content Agencies', 'Affiliate Marketers', 'Bloggers'],
    useCases: ['High-volume SEO blog publishing', 'Affiliate product review generation', 'Content pipeline scaling', 'Automated site monetization'],
    startingPrice: 'Single site license from $39/year',
    icon: 'N',
    ease: 'Moderate'
  },
  {
    id: 'reeload',
    slug: 'reeload',
    name: 'Reeload',
    website: 'https://reelo.ad',
    cat: 'video',
    subcategory: 'UGC Video Ad Generation',
    tier: 3,
    price: 'Freemium',
    free: true,
    isNew: true,
    rating: 4.6,
    verified: false,
    featured: false,
    desc: 'Generates UGC-style video ads for social and performance marketing.',
    fullDescription: 'Reeload generates user-generated content (UGC) style video advertisements featuring realistic AI creators to drive higher conversions on Meta, TikTok, and YouTube ads.',
    features: ['AI UGC actor library', 'High-converting ad script templates', 'Automated captioning & call-to-actions', 'A/B testing variant creation', 'Fast 1080p video exports'],
    bestFor: ['Performance Marketers', 'E-commerce Brands', 'Media Buyers', 'Agencies'],
    useCases: ['Facebook & Instagram video ads', 'TikTok performance campaigns', 'Product review video creation', 'Ad creative iteration'],
    startingPrice: 'Freemium trial; Pro plans from $29/month',
    icon: 'R',
    ease: 'Moderate'
  },
  {
    id: 'avenyora',
    slug: 'avenyora',
    name: 'Avenyora',
    website: 'https://avenyora.com',
    cat: 'productivity',
    subcategory: 'Personalized AI Insights & Guidance',
    tier: 3,
    price: 'Paid/Freemium',
    free: true,
    isNew: true,
    rating: 4.5,
    verified: false,
    featured: false,
    desc: 'AI-powered astrology and personal-insight readings.',
    fullDescription: 'Avenyora applies natural language processing to personal birth charts, horoscope data, and wellness tracking to provide personalized daily insights and reflection prompts.',
    features: ['Personalized natal chart analysis', 'Daily AI insights & reflection prompts', 'Interactive astrological Q&A chat', 'Privacy-first personal journal', 'Clean mobile-optimized interface'],
    bestFor: ['Astrology Enthusiasts', 'Wellness Seekers', 'Mindfulness Practitioners'],
    useCases: ['Daily personal guidance', 'Horoscope analysis', 'Mindfulness journal prompts'],
    startingPrice: 'Free basic reading; Unlimited access at $7.99/month',
    icon: 'A',
    ease: 'Easy'
  }
];

// ---- non-tool resource links ----
const RESOURCES = [
  {name:'AI Weekly', website:'https://aiweekly.co', desc:'A weekly roundup of AI news — useful reading, not a listed tool.'},
];

// ---- LocalStorage Favorites Helper ----
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('flexora_favs') || '[]');
  } catch(e) {
    return [];
  }
}

function isFavorite(name) {
  return getFavorites().includes(name);
}

function toggleFavorite(name, btnElement) {
  let favs = getFavorites();
  if (favs.includes(name)) {
    favs = favs.filter(n => n !== name);
  } else {
    favs.push(name);
  }
  localStorage.setItem('flexora_favs', JSON.stringify(favs));
  if (btnElement) {
    btnElement.classList.toggle('active', favs.includes(name));
  }
  window.dispatchEvent(new CustomEvent('favs-updated'));
}

// ---- Helper functions for Tool Detail URLs and Data Lookup ----
function getToolSlug(t) {
  if (t.slug) return t.slug;
  if (t.id) return t.id;
  return t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getToolDetailUrl(t) {
  const slug = getToolSlug(t);
  const path = window.location.pathname;
  if (path.includes('/tools/') && !path.endsWith('/tools.html')) {
    return `${slug}.html`;
  }
  return `tools/${slug}.html`;
}

function getToolBySlug(slug) {
  if (!slug) return null;
  const s = slug.toLowerCase().trim();
  return tools.find(t => getToolSlug(t) === s || t.name.toLowerCase() === s);
}

// ================= shared render/interaction helpers =================
function toolCardInnerHTML(t) {
  const isFav = isFavorite(t.name);
  const subcatText = t.subcategory ? ` • ${t.subcategory}` : '';
  const verifiedBadge = t.verified ? `<span class="badge-pill badge-verified" style="background:rgba(45,226,200,0.14); color:var(--teal); border:1px solid rgba(45,226,200,0.3); font-size:10.5px; padding:2px 7px; border-radius:6px; font-weight:600; font-family:'IBM Plex Mono';">✓ Verified</span>` : '';
  const featuredBadge = (t.featured || t.tier === 1) ? `<span class="badge-pill badge-featured" style="background:rgba(245,158,11,0.14); color:var(--amber,#f59e0b); border:1px solid rgba(245,158,11,0.3); font-size:10.5px; padding:2px 7px; border-radius:6px; font-weight:600; font-family:'IBM Plex Mono';">★ Featured</span>` : '';
  
  return `
    <div class="card-top" style="display:flex; gap:12px; align-items:flex-start; margin-bottom:14px;">
      <div class="card-icon" style="width:42px; height:42px; border-radius:10px; background:var(--surface-2,#161B28); display:flex; align-items:center; justify-content:center; font-family:'IBM Plex Mono',monospace; color:var(--teal,#2DE2C8); font-weight:700; font-size:16px; flex:none; border:1px solid var(--line,#232838);">${t.icon}</div>
      <div style="flex:1; min-width:0;">
        <div class="card-name" style="font-weight:700; font-size:16px; color:var(--ink,#F2F4FA); display:flex; align-items:center; gap:6px; flex-wrap:wrap; line-height:1.3;">
          <span>${t.name}</span>
          ${verifiedBadge}
          ${featuredBadge}
        </div>
        <div class="card-cat" style="font-size:12px; color:var(--ink-soft,#8A90A6); margin-top:4px; font-family:'IBM Plex Mono',monospace;">
          ${t.cat.charAt(0).toUpperCase() + t.cat.slice(1)}${subcatText} • ⭐ ${t.rating || '4.8'}
        </div>
      </div>
      <button type="button" class="fav-star ${isFav ? 'active' : ''}" title="Save to Favorites" onclick="event.preventDefault(); event.stopPropagation(); toggleFavorite('${t.name.replace(/'/g, "\\'")}', this);">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </button>
    </div>
    <p style="font-size:13.5px; color:var(--ink-soft,#8A90A6); margin-bottom:18px; line-height:1.5; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">${t.desc}</p>
    <div class="card-foot" style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(35,40,56,0.5); padding-top:12px; margin-top:auto;">
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <span class="pill ${t.free ? 'free' : ''}">${t.price || (t.free ? 'Free plan' : 'Paid')}</span>
        ${t.isNew ? '<span class="pill new">New</span>' : ''}
      </div>
      <span class="view-tool-btn" style="font-size:12.5px; color:var(--teal,#2DE2C8); font-weight:600; display:inline-flex; align-items:center; gap:4px;">View Tool →</span>
    </div>
  `;
}

function toolCardHTML(t) {
  const url = getToolDetailUrl(t);
  return `<a class="card" href="${url}" data-tool-name="${t.name}" data-tool-id="${getToolSlug(t)}">${toolCardInnerHTML(t)}</a>`;
}

function addTilt(card) {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -10;
    const ry = ((x / r.width) - 0.5) * 10;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
}

// ---- Global CSS injection for shared components ----
(function injectSharedStyles() {
  if (document.getElementById('flexora-shared-styles')) return;
  const style = document.createElement('style');
  style.id = 'flexora-shared-styles';
  style.textContent = `
    :root { --amber: #f59e0b; }
    .fav-star {
      background: none; border: none; cursor: pointer;
      color: var(--ink-soft, #8A90A6); padding: 4px; border-radius: 6px;
      transition: color 0.2s, transform 0.2s; line-height: 1;
      display: flex; align-items: center; justify-content: center; flex: none;
    }
    .fav-star:hover { color: var(--amber, #f59e0b); transform: scale(1.2); }
    .fav-star.active { color: var(--amber, #f59e0b); }
    .fav-star svg { pointer-events: none; }
  `;
  document.head.appendChild(style);
})();
