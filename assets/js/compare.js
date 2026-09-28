/* Flexora.Ai — TOOLS REGISTRY. Single source of truth.
   =========================================================================
   Every page — tools.html, index.html, and compare.html — reads from this
   ONE file. Add a tool here once and it shows up everywhere automatically:
   the directory grid, the homepage trending list, category counts, AND
   the compare picker. That's the whole point of this file existing.

   PUBLIC FILE — this ships to every visitor's browser as plain readable
   JS. Never add: submitter emails, internal notes, affiliate URLs,
   commission rates, overall scores, or verification status here.

   HOW TO ADD A NEW TOOL (do this and nothing else):
   Copy one block inside TOOLS below, paste it in, fill in the fields,
   save, push. No other file needs to change.

   REQUIRED FIELDS
   - name      display name
   - cat       one of: writing, image, video, coding, seo, audio, design,
               productivity, automation
   - icon      one or two characters shown on the tile (usually first letter)
   - desc      one-line description
   - free      true if a usable free plan exists, false if paid only
   - price     text shown on cards/table, e.g. 'Freemium' or 'From $19/mo'
   - bestFor   short phrase
   - ease      'Easy' | 'Moderate' | 'Advanced'
   - tier      1 (Featured), 2 (Recommended), or 3 (More) — used by tools.html

   OPTIONAL FIELDS
   - url / website   the tool's own site (both point to the same value —
                      compare.html reads `url`, tools.html reads `website`)
   - isNew            true to show the "New" badge
   - slug             auto-generated from name if omitted
   - startPrice       number, lowest paid $/mo — auto-read from `price` if
                       omitted (Freemium/Free tools count as 0 automatically)
   - features / platforms / integrations   arrays of short strings — a
     compare row only appears if at least one selected tool has that field
   ========================================================================= */

const TOOL_CATEGORIES = [
  { key: 'writing',      label: 'Writing' },
  { key: 'image',        label: 'Image' },
  { key: 'video',        label: 'Video' },
  { key: 'coding',       label: 'Coding' },
  { key: 'seo',          label: 'SEO' },
  { key: 'audio',        label: 'Audio' },
  { key: 'design',       label: 'Design' },
  { key: 'productivity', label: 'Productivity' },
  { key: 'automation',   label: 'Automation' }
];

const TOOLS = [
  { tier:1, name:'FrameThrower', cat:'video', icon:'F',
    desc:'Generates and edits professional video content, with API and SDK support for developers.',
    bestFor:'Teams building video into their own product', price:'Freemium', free:true, isNew:true, ease:'Moderate',
    url:'https://framethrower.ai', website:'https://framethrower.ai' },
  { tier:1, name:'RevenueFromChat', cat:'automation', icon:'R',
    desc:'Turns chat conversations into revenue by automating sales follow-ups and workflows.',
    bestFor:'Businesses automating chat-driven sales', price:'Paid/Freemium', free:true, isNew:true, ease:'Moderate',
    url:'https://revenuefromchat.com', website:'https://revenuefromchat.com' },
  { tier:1, name:'SalesTouch', cat:'automation', icon:'S',
    desc:'A B2B sales automation platform that helps teams manage outreach and close deals faster.',
    bestFor:'B2B sales teams', price:'Paid', free:false, isNew:true, ease:'Moderate',
    url:'https://www.salestouch.io', website:'https://www.salestouch.io' },
  { tier:1, name:'ModelRush', cat:'coding', icon:'M',
    desc:'Gives developers fast access to AI models and the infrastructure to run them in production.',
    bestFor:'Developers building AI-powered apps', price:'Paid', free:false, isNew:true, ease:'Advanced',
    url:'https://modelrush.ai', website:'https://modelrush.ai' },
  { tier:1, name:'Make Floor Plan', cat:'design', icon:'M',
    desc:'Generates floor plans automatically, speeding up early-stage design and architecture work.',
    bestFor:'Architects, real estate, interior designers', price:'Freemium', free:true, isNew:true, ease:'Easy',
    url:'https://makefloorplan.com/floor-plan-generator', website:'https://makefloorplan.com/floor-plan-generator' },
  { tier:1, name:'HtmlSlides', cat:'productivity', icon:'H',
    desc:'Creates clean, code-based presentations and slide decks without design software.',
    bestFor:'Professionals building presentations quickly', price:'Freemium', free:true, isNew:true, ease:'Easy',
    url:'https://www.htmlslides.ai', website:'https://www.htmlslides.ai' },
  { tier:1, name:'SEOKRU', cat:'seo', icon:'S',
    desc:'An SEO and marketing toolkit for tracking rankings, keywords, and site performance.',
    bestFor:'Marketers and SEO teams', price:'Paid', free:false, isNew:true, ease:'Moderate',
    url:'https://he.seokru.com', website:'https://he.seokru.com' },
  { tier:1, name:'AllVideoAI', cat:'video', icon:'A',
    desc:'An all-in-one AI video generation and editing tool for creating content at scale.',
    bestFor:'Content creators and video teams', price:'Paid', free:false, isNew:true, ease:'Moderate',
    url:'https://allvideoai.com', website:'https://allvideoai.com' },
  { tier:1, name:'Photoshoot.app', cat:'image', icon:'P',
    desc:'Generates professional product photos from simple images — no physical photoshoot needed.',
    bestFor:'E-commerce sellers', price:'Freemium', free:true, isNew:true, ease:'Easy',
    url:'https://photoshoot.app', website:'https://photoshoot.app' },
  { tier:1, name:'SocialEcho', cat:'automation', icon:'S',
    desc:'Automates social media content creation and posting across multiple platforms.',
    bestFor:'Social media managers and small marketing teams', price:'Freemium', free:true, isNew:true, ease:'Easy',
    url:'https://socialecho.net', website:'https://socialecho.net' },

  { tier:2, name:'Free AI Image', cat:'image', icon:'F',
    desc:'A free AI image generator for quickly creating visuals from text prompts.',
    bestFor:'Anyone needing quick, free AI images', price:'Freemium', free:true, isNew:true, ease:'Easy',
    url:'https://freeaiimage.io', website:'https://freeaiimage.io' },
  { tier:2, name:'ProfileLoom', cat:'image', icon:'P',
    desc:'Generates professional AI headshots and portraits from your own photos.',
    bestFor:'Professionals needing headshots without a photographer', price:'Freemium', free:true, isNew:true, ease:'Easy',
    url:'https://aiportraitgen.app', website:'https://aiportraitgen.app' },
  { tier:2, name:'AI Fruit Video', cat:'video', icon:'A',
    desc:'A niche AI video generator focused on fruit and food-related visual content.',
    bestFor:'Food and creative content creators', price:'Freemium', free:true, isNew:true, ease:'Easy',
    url:'https://aifruitvideo.com', website:'https://aifruitvideo.com' },
  { tier:2, name:'Visemix', cat:'video', icon:'V',
    desc:'Syncs lip movement to audio for realistic AI-generated video dubbing.',
    bestFor:'Video creators localizing or dubbing content', price:'Freemium', free:true, isNew:true, ease:'Moderate',
    url:'https://lipsync.vip', website:'https://lipsync.vip' },
  { tier:2, name:'Image to Calendar', cat:'productivity', icon:'I',
    desc:'Turns photos of schedules or events into calendar entries automatically.',
    bestFor:'People digitizing handwritten schedules', price:'Paid only', free:false, isNew:true, ease:'Easy',
    url:'https://imagetocalendar.app', website:'https://imagetocalendar.app' },
  { tier:2, name:'Pragor', cat:'automation', icon:'P',
    desc:'An AI agent platform for automating operational and business tasks.',
    bestFor:'Teams automating repetitive operations', price:'Free', free:true, isNew:true, ease:'Moderate',
    url:'https://pragor.net', website:'https://pragor.net' },
  { tier:2, name:'Orkas', cat:'coding', icon:'O',
    desc:'A developer-focused AI agent framework with local and open-source deployment options.',
    bestFor:'Developers building custom AI agents', price:'Freemium', free:true, isNew:true, ease:'Advanced',
    url:'https://orkas.ai', website:'https://orkas.ai' },
  { tier:2, name:'Chatcument', cat:'productivity', icon:'C',
    desc:'A set of browser-based AI utilities for working with documents and chat.',
    bestFor:'Everyday productivity and document tasks', price:'Freemium', free:true, isNew:true, ease:'Easy',
    url:'https://chatcument.com', website:'https://chatcument.com' },

  { tier:3, name:'Flux Art', cat:'image', icon:'F',
    desc:'An AI art and image generation tool built on open AI models.',
    bestFor:'Casual AI art generation', price:'Freemium', free:true, isNew:true, ease:'Easy',
    url:'https://flux-art.cc', website:'https://flux-art.cc' },
  { tier:3, name:'NextlerAI Publisher', cat:'writing', icon:'N',
    desc:'Helps publish SEO-optimized written content at scale.',
    bestFor:'Content teams publishing SEO content', price:'Paid', free:false, isNew:true, ease:'Moderate',
    url:'https://nextlerai.com/product/nextlerai-publisher/', website:'https://nextlerai.com/product/nextlerai-publisher/' },
  { tier:3, name:'Reeload', cat:'video', icon:'R',
    desc:'Generates UGC-style video content for marketing and ads.',
    bestFor:'Brands needing UGC-style ad content', price:'Freemium', free:true, isNew:true, ease:'Moderate',
    url:'https://reelo.ad', website:'https://reelo.ad' },
  { tier:3, name:'Avenyora', cat:'productivity', icon:'A',
    desc:'An AI-powered astrology and personal insights app.',
    bestFor:'People interested in AI astrology', price:'Paid/Freemium', free:true, isNew:true, ease:'Easy',
    url:'https://avenyora.com', website:'https://avenyora.com' }
];

/* Resources — informational, not tools. Used by tools.html's Resources
   section. Never mixed into TOOLS or counted in tool totals. */
const resources = [
  { name:'AI Weekly', website:'https://aiweekly.co',
    desc:'A newsletter covering the latest AI news, launches, and updates.',
    price:'Free' }
];

/* ---- aliases so tools.html / index.html (which use lowercase names)
   read from this exact same data, no separate file, no drift ---- */
const tools = TOOLS;
