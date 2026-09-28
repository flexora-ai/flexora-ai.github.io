/* ============================================================
   Flexora.Ai — assets/js/tools-data.js
   SINGLE SOURCE OF TRUTH for tool + category data.
   Loaded by BOTH index.html and tools.html (and any future page)
   so the directory, homepage stats, homepage demos, and footer
   never drift out of sync with each other.

   Data sourced from the "tools data" tracking sheet (Tier 1-3,
   status = ADD). Rows marked REMOVE are excluded. Rows marked
   RESOURCE (e.g. AI Weekly) are listed separately as a resource
   link, not as a tool card — see RESOURCES below.

   HOW TO ADD A NEW TOOL
   ----------------------
   Copy one object in the `tools` array and fill in:
     name      - Tool name shown on the card
     website   - Full https:// URL — the card links straight here
     cat       - one of the CATEGORIES keys below
     tier      - 1 (Featured), 2 (Recommended), or 3 (More tools)
     price     - short pricing label shown on the card
     free      - true/false — controls the green "Free plan" badge
     isNew     - true/false — controls the "New" badge
     desc      - one-line description
     bestFor   - short "best for" tag
     icon      - one capital letter (fallback avatar)
     ease      - "Easy" | "Moderate" | "Advanced"
   No other file needs to change — every page reads from here.
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
  automation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="m4.9 4.9 2.8 2.8"/><path d="M2 12h4"/><path d="m4.9 19.1 2.8-2.8"/><path d="M12 18v4"/><path d="m16.3 16.3 2.8 2.8"/><path d="M18 12h4"/><path d="m16.3 7.7 2.8-2.8"/><circle cx="12" cy="12" r="4"/></svg>'
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

// ---- 22 live tools (Tier 1-3, status = ADD) ----
const tools = [
  // ===== TIER 1 — Featured =====
  {name:'FrameThrower', website:'https://framethrower.ai', cat:'video', tier:1, price:'Freemium', free:true, isNew:true, desc:'AI creative video tool with API, MCP and SDK support for professional workflows.', bestFor:'Video creators building at scale', icon:'F', ease:'Moderate'},
  {name:'RevenueFromChat', website:'https://revenuefromchat.com', cat:'automation', tier:1, price:'Paid/Freemium', free:true, isNew:true, desc:'Turns everyday chat conversations into automated revenue workflows for businesses.', bestFor:'Business automation & sales', icon:'R', ease:'Moderate'},
  {name:'SalesTouch', website:'https://www.salestouch.io', cat:'automation', tier:1, price:'Paid', free:false, isNew:true, desc:'B2B sales automation platform built to speed up outbound and follow-up.', bestFor:'B2B sales teams', icon:'S', ease:'Moderate'},
  {name:'ModelRush', website:'https://modelrush.ai', cat:'coding', tier:1, price:'Paid', free:false, isNew:true, desc:'AI model infrastructure and tooling for developers shipping AI-powered features.', bestFor:'AI infrastructure & developers', icon:'M', ease:'Advanced'},
  {name:'Make Floor Plan', website:'https://makefloorplan.com/floor-plan-generator', cat:'design', tier:1, price:'Freemium', free:true, isNew:true, desc:'Generates architectural floor plans from simple inputs in minutes.', bestFor:'Architects & home planners', icon:'M', ease:'Easy'},
  {name:'HtmlSlides', website:'https://www.htmlslides.ai', cat:'productivity', tier:1, price:'Freemium', free:true, isNew:true, desc:'Builds clean, HTML-based presentation slides from your content automatically.', bestFor:'Business presentations', icon:'H', ease:'Easy'},
  {name:'SEOKRU', website:'https://he.seokru.com', cat:'seo', tier:1, price:'Paid', free:false, isNew:true, desc:'SEO and marketing toolkit for keyword research and campaign tracking.', bestFor:'SEO & marketing teams', icon:'S', ease:'Moderate'},
  {name:'AllVideoAI', website:'https://allvideoai.com', cat:'video', tier:1, price:'Paid', free:false, isNew:true, desc:'All-in-one AI video generation suite for quick, polished output.', bestFor:'AI video generation', icon:'A', ease:'Moderate'},
  {name:'Photoshoot.app', website:'https://photoshoot.app', cat:'image', tier:1, price:'Freemium', free:true, isNew:true, desc:'Generates studio-quality product photos without a physical photoshoot.', bestFor:'E-commerce product photography', icon:'P', ease:'Easy'},
  {name:'SocialEcho', website:'https://socialecho.net', cat:'automation', tier:1, price:'Freemium', free:true, isNew:true, desc:'Automates social media posting and engagement across platforms.', bestFor:'Social media automation', icon:'S', ease:'Easy'},

  // ===== TIER 2 — Recommended =====
  {name:'Free AI Image', website:'https://freeaiimage.io', cat:'image', tier:2, price:'Freemium', free:true, isNew:true, desc:'Free browser-based AI image generator for quick visuals.', bestFor:'Fast, free image generation', icon:'F', ease:'Easy'},
  {name:'ProfileLoom', website:'https://aiportraitgen.app', cat:'image', tier:2, price:'Freemium', free:true, isNew:true, desc:'Turns everyday selfies into polished, professional AI portraits.', bestFor:'Professional headshots', icon:'P', ease:'Easy'},
  {name:'AI Fruit Video', website:'https://aifruitvideo.com', cat:'video', tier:2, price:'Freemium', free:true, isNew:true, desc:'Niche AI video generator built for food and produce content creators.', bestFor:'Food & produce video content', icon:'A', ease:'Easy'},
  {name:'Visemix', website:'https://lipsync.vip', cat:'video', tier:2, price:'Freemium', free:true, isNew:true, desc:'AI lip-sync tool that matches video to any audio track accurately.', bestFor:'Lip-sync & dubbing', icon:'V', ease:'Moderate'},
  {name:'Image to Calendar', website:'https://imagetocalendar.app', cat:'productivity', tier:2, price:'Paid only', free:false, isNew:true, desc:'Turns a photo of a schedule or itinerary into real calendar events.', bestFor:'Quick calendar creation', icon:'I', ease:'Easy'},
  {name:'Pragor', website:'https://pragor.net', cat:'automation', tier:2, price:'Free', free:true, isNew:true, desc:'AI agent platform for automating day-to-day operational tasks.', bestFor:'AI agents & operations', icon:'P', ease:'Moderate'},
  {name:'Orkas', website:'https://orkas.ai', cat:'coding', tier:2, price:'Freemium', free:true, isNew:true, desc:'Open-source-friendly AI agent framework for developers.', bestFor:'Developers building AI agents', icon:'O', ease:'Advanced'},
  {name:'Chatcument', website:'https://chatcument.com', cat:'productivity', tier:2, price:'Freemium', free:true, isNew:true, desc:'Browser-based AI utilities for chatting with and summarizing documents.', bestFor:'Document Q&A & summaries', icon:'C', ease:'Easy'},

  // ===== TIER 3 — More tools =====
  {name:'Flux Art', website:'https://flux-art.cc', cat:'image', tier:3, price:'Freemium', free:true, isNew:true, desc:'AI art generator built on the Flux model family.', bestFor:'AI art generation', icon:'F', ease:'Easy'},
  {name:'NextlerAI Publisher', website:'https://nextlerai.com/product/nextlerai-publisher/', cat:'writing', tier:3, price:'Paid', free:false, isNew:true, desc:'AI writing and publishing tool built for SEO-driven content.', bestFor:'SEO content publishing', icon:'N', ease:'Moderate'},
  {name:'Reeload', website:'https://reelo.ad', cat:'video', tier:3, price:'Freemium', free:true, isNew:true, desc:'Generates UGC-style video ads for social and performance marketing.', bestFor:'UGC video ads', icon:'R', ease:'Moderate'},
  {name:'Avenyora', website:'https://avenyora.com', cat:'productivity', tier:3, price:'Paid/Freemium', free:true, isNew:true, desc:'AI-powered astrology and personal-insight readings.', bestFor:'Astrology & personal insights', icon:'A', ease:'Easy'},
];

// ---- non-tool resource links (status = RESOURCE in the tracking sheet) ----
const RESOURCES = [
  {name:'AI Weekly', website:'https://aiweekly.co', desc:'A weekly roundup of AI news — useful reading, not a listed tool.'},
];

// ================= shared render/interaction helpers =================
// Both index.html and tools.html call these so card markup and behavior
// never drift apart between pages.

function toolCardInnerHTML(t){
  return `
    <div class="card-top">
      <div class="card-icon">${t.icon}</div>
      <div><div class="card-name">${t.name}</div><div class="card-cat">${t.cat.charAt(0).toUpperCase()+t.cat.slice(1)}</div></div>
    </div>
    <p>${t.desc}</p>
    <div class="card-foot"><span class="pill ${t.free ? 'free' : ''}">${t.free ? 'Free plan' : 'Paid'}</span>${t.isNew ? '<span class="pill new">New</span>' : ''}</div>
  `;
}

// Renders a full clickable card (an <a> tag pointed straight at the tool's
// real website) — used by both the homepage trending list preview and the
// full tools.html directory grid.
function toolCardHTML(t){
  return `<a class="card" href="${t.website}" target="_blank" rel="noopener noreferrer" data-tool="${t.name}">${toolCardInnerHTML(t)}</a>`;
}

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
