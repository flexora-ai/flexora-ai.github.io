/* Flexora.Ai — REAL tools data, built from the tiered spreadsheet.
   =========================================================================
   PUBLIC FILE — this ships to every visitor's browser as plain readable
   JS. Never add: submitter emails, internal notes, affiliate URLs,
   commission rates, overall scores, or verification status here. Keep
   those in your private sheet / Formspree only.

   HOW TO USE:
   1. Save this file as: assets/js/tools-data.js (upload to your repo)
   2. In index.html and tools.html, add this line right BEFORE the
      <script> tag that currently defines "const tools = [...]":
        <script src="assets/js/tools-data.js"></script>
   3. Delete the old inline "const tools = [...]" block in both files —
      leave ICONS and CATEGORIES alone, they don't change.
   4. tools.html also needs its rendering section updated to group cards
      by tier (Featured / Recommended / More) instead of one flat grid —
      see the accompanying instructions for that markup/script patch.

   FIELDS:
   tier    — 1 (Featured), 2 (Recommended), 3 (More)
   cat     — one of: writing, image, video, coding, seo, audio, design,
             productivity, automation
   free    — true if there's any free tier/plan, false if paid only
   price   — display label shown on the card
   ========================================================================= */

const tools = [
  { tier:1, name:'FrameThrower', website:'https://framethrower.ai', cat:'video', icon:'F',
    desc:'Generates and edits professional video content, with API and SDK support for developers.',
    bestFor:'Teams building video into their own product', price:'Freemium', free:true, isNew:true, ease:'Moderate' },
  { tier:1, name:'RevenueFromChat', website:'https://revenuefromchat.com', cat:'automation', icon:'R',
    desc:'Turns chat conversations into revenue by automating sales follow-ups and workflows.',
    bestFor:'Businesses automating chat-driven sales', price:'Paid/Freemium', free:true, isNew:true, ease:'Moderate' },
  { tier:1, name:'SalesTouch', website:'https://www.salestouch.io', cat:'automation', icon:'S',
    desc:'A B2B sales automation platform that helps teams manage outreach and close deals faster.',
    bestFor:'B2B sales teams', price:'Paid', free:false, isNew:true, ease:'Moderate' },
  { tier:1, name:'ModelRush', website:'https://modelrush.ai', cat:'coding', icon:'M',
    desc:'Gives developers fast access to AI models and the infrastructure to run them in production.',
    bestFor:'Developers building AI-powered apps', price:'Paid', free:false, isNew:true, ease:'Advanced' },
  { tier:1, name:'Make Floor Plan', website:'https://makefloorplan.com/floor-plan-generator', cat:'design', icon:'M',
    desc:'Generates floor plans automatically, speeding up early-stage design and architecture work.',
    bestFor:'Architects, real estate, interior designers', price:'Freemium', free:true, isNew:true, ease:'Easy' },
  { tier:1, name:'HtmlSlides', website:'https://www.htmlslides.ai', cat:'productivity', icon:'H',
    desc:'Creates clean, code-based presentations and slide decks without design software.',
    bestFor:'Professionals building presentations quickly', price:'Freemium', free:true, isNew:true, ease:'Easy' },
  { tier:1, name:'SEOKRU', website:'https://he.seokru.com', cat:'seo', icon:'S',
    desc:'An SEO and marketing toolkit for tracking rankings, keywords, and site performance.',
    bestFor:'Marketers and SEO teams', price:'Paid', free:false, isNew:true, ease:'Moderate' },
  { tier:1, name:'AllVideoAI', website:'https://allvideoai.com', cat:'video', icon:'A',
    desc:'An all-in-one AI video generation and editing tool for creating content at scale.',
    bestFor:'Content creators and video teams', price:'Paid', free:false, isNew:true, ease:'Moderate' },
  { tier:1, name:'Photoshoot.app', website:'https://photoshoot.app', cat:'image', icon:'P',
    desc:'Generates professional product photos from simple images — no physical photoshoot needed.',
    bestFor:'E-commerce sellers', price:'Freemium', free:true, isNew:true, ease:'Easy' },
  { tier:1, name:'SocialEcho', website:'https://socialecho.net', cat:'automation', icon:'S',
    desc:'Automates social media content creation and posting across multiple platforms.',
    bestFor:'Social media managers and small marketing teams', price:'Freemium', free:true, isNew:true, ease:'Easy' },

  { tier:2, name:'Free AI Image', website:'https://freeaiimage.io', cat:'image', icon:'F',
    desc:'A free AI image generator for quickly creating visuals from text prompts.',
    bestFor:'Anyone needing quick, free AI images', price:'Freemium', free:true, isNew:true, ease:'Easy' },
  { tier:2, name:'ProfileLoom', website:'https://aiportraitgen.app', cat:'image', icon:'P',
    desc:'Generates professional AI headshots and portraits from your own photos.',
    bestFor:'Professionals needing headshots without a photographer', price:'Freemium', free:true, isNew:true, ease:'Easy' },
  { tier:2, name:'AI Fruit Video', website:'https://aifruitvideo.com', cat:'video', icon:'A',
    desc:'A niche AI video generator focused on fruit and food-related visual content.',
    bestFor:'Food and creative content creators', price:'Freemium', free:true, isNew:true, ease:'Easy' },
  { tier:2, name:'Visemix', website:'https://lipsync.vip', cat:'video', icon:'V',
    desc:'Syncs lip movement to audio for realistic AI-generated video dubbing.',
    bestFor:'Video creators localizing or dubbing content', price:'Freemium', free:true, isNew:true, ease:'Moderate' },
  { tier:2, name:'Image to Calendar', website:'https://imagetocalendar.app', cat:'productivity', icon:'I',
    desc:'Turns photos of schedules or events into calendar entries automatically.',
    bestFor:'People digitizing handwritten schedules', price:'Paid only', free:false, isNew:true, ease:'Easy' },
  { tier:2, name:'Pragor', website:'https://pragor.net', cat:'automation', icon:'P',
    desc:'An AI agent platform for automating operational and business tasks.',
    bestFor:'Teams automating repetitive operations', price:'Free', free:true, isNew:true, ease:'Moderate' },
  { tier:2, name:'Orkas', website:'https://orkas.ai', cat:'coding', icon:'O',
    desc:'A developer-focused AI agent framework with local and open-source deployment options.',
    bestFor:'Developers building custom AI agents', price:'Freemium', free:true, isNew:true, ease:'Advanced' },
  { tier:2, name:'Chatcument', website:'https://chatcument.com', cat:'productivity', icon:'C',
    desc:'A set of browser-based AI utilities for working with documents and chat.',
    bestFor:'Everyday productivity and document tasks', price:'Freemium', free:true, isNew:true, ease:'Easy' },

  { tier:3, name:'Flux Art', website:'https://flux-art.cc', cat:'image', icon:'F',
    desc:'An AI art and image generation tool built on open AI models.',
    bestFor:'Casual AI art generation', price:'Freemium', free:true, isNew:true, ease:'Easy' },
  { tier:3, name:'NextlerAI Publisher', website:'https://nextlerai.com/product/nextlerai-publisher/', cat:'writing', icon:'N',
    desc:'Helps publish SEO-optimized written content at scale.',
    bestFor:'Content teams publishing SEO content', price:'Paid', free:false, isNew:true, ease:'Moderate' },
  { tier:3, name:'Reeload', website:'https://reelo.ad', cat:'video', icon:'R',
    desc:'Generates UGC-style video content for marketing and ads.',
    bestFor:'Brands needing UGC-style ad content', price:'Freemium', free:true, isNew:true, ease:'Moderate' },
  { tier:3, name:'Avenyora', website:'https://avenyora.com', cat:'productivity', icon:'A',
    desc:'An AI-powered astrology and personal insights app.',
    bestFor:'People interested in AI astrology', price:'Paid/Freemium', free:true, isNew:true, ease:'Easy' },
];

/* Resources — informational, not tools. Shown in a separate section,
   never mixed into the tools grid or counted in "X tools listed". */
const resources = [
  { name:'AI Weekly', website:'https://aiweekly.co',
    desc:'A newsletter covering the latest AI news, launches, and updates.',
    price:'Free' },
];
