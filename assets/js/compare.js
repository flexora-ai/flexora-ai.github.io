/* Flexora.Ai — tools registry (single source of truth).
   compare.html reads this file. To add a tool: append ONE object to TOOLS below,
   save, push — it shows up in the compare picker automatically. No other edit needed.

   Required fields
   - name      display name
   - cat       must match a key in TOOL_CATEGORIES (writing, image, video, coding, seo, audio, design, productivity, automation)
   - icon      one or two characters shown on the tile (usually the first letter)
   - desc      one-line description
   - free      true if a usable free plan exists
   - price     text shown in the table, e.g. 'Free plan' or 'From $19/mo'
   - bestFor   short phrase
   - ease      'Easy' | 'Moderate' | 'Advanced'

   Optional fields (a compare row appears only when at least one selected tool has it)
   - slug          url-safe id (auto-generated from name if omitted)
   - startPrice    number, lowest paid price per month (auto-read from `price` if omitted)
   - isNew         true to show the "New" badge
   - url           tool's own website
   - features      array of short strings
   - platforms     array, e.g. ['Web', 'iOS']
   - integrations  array, e.g. ['Slack', 'Notion']
*/
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
  { name: 'Scriptly',       cat: 'writing',      icon: 'S', desc: 'Draft, rewrite and outline long-form content with tone controls.',            free: true,  isNew: false, price: 'Free plan',    bestFor: 'Long-form blog drafts',   ease: 'Easy' },
  { name: 'Copysmith Lite', cat: 'writing',      icon: 'C', desc: 'Short-form ad and product copy generator with brand voice presets.',           free: true,  isNew: true,  price: 'Free plan',    bestFor: 'Ad copy at scale',        ease: 'Easy' },
  { name: 'PixelForge',     cat: 'image',        icon: 'P', desc: 'Generate and edit product images from text prompts.',                          free: false, isNew: true,  price: 'From $19/mo',  bestFor: 'Product photography',     ease: 'Moderate' },
  { name: 'Framewise',      cat: 'image',        icon: 'F', desc: 'Upscale and restore old or low-res photos in one click.',                      free: true,  isNew: false, price: 'Free plan',    bestFor: 'Photo restoration',       ease: 'Easy' },
  { name: 'Clipreel',       cat: 'video',        icon: 'C', desc: 'Turn long recordings into short clips with auto captions.',                    free: false, isNew: true,  price: 'From $24/mo',  bestFor: 'Social video clips',      ease: 'Moderate' },
  { name: 'ScenePilot',     cat: 'video',        icon: 'S', desc: 'Storyboard and generate short AI video scenes from a script.',                 free: false, isNew: true,  price: 'From $35/mo',  bestFor: 'Short-form video ideas',  ease: 'Advanced' },
  { name: 'CodeLoop',       cat: 'coding',       icon: 'C', desc: 'In-editor AI pair programmer with test generation.',                           free: true,  isNew: false, price: 'Free plan',    bestFor: 'Day-to-day coding',       ease: 'Moderate' },
  { name: 'Bugcatch',       cat: 'coding',       icon: 'B', desc: 'Scans pull requests and flags likely bugs before merge.',                      free: false, isNew: true,  price: 'From $12/mo',  bestFor: 'Code review',             ease: 'Moderate' },
  { name: 'Ranklyst',       cat: 'seo',          icon: 'R', desc: 'Keyword clustering and on-page audits, explained simply.',                     free: false, isNew: true,  price: 'From $29/mo',  bestFor: 'SEO audits',              ease: 'Easy' },
  { name: 'Voxel',          cat: 'audio',        icon: 'V', desc: 'Text-to-speech with cloned voice profiles.',                                   free: true,  isNew: false, price: 'Free plan',    bestFor: 'Voiceovers',              ease: 'Easy' },
  { name: 'Podtrim',        cat: 'audio',        icon: 'P', desc: 'Removes filler words and silence from podcast audio automatically.',           free: true,  isNew: false, price: 'Free plan',    bestFor: 'Podcast editing',         ease: 'Easy' },
  { name: 'Palette AI',     cat: 'design',       icon: 'P', desc: 'Generates matching color palettes and UI themes from one image.',              free: true,  isNew: false, price: 'Free plan',    bestFor: 'Design systems',          ease: 'Easy' },
  { name: 'Mockflow AI',    cat: 'design',       icon: 'M', desc: 'Turns rough sketches into clickable UI mockups.',                              free: false, isNew: true,  price: 'From $18/mo',  bestFor: 'Rapid prototyping',       ease: 'Moderate' },
  { name: 'Inboxly',        cat: 'productivity', icon: 'I', desc: 'Drafts email replies in your tone and summarizes long threads.',               free: true,  isNew: false, price: 'Free plan',    bestFor: 'Email triage',            ease: 'Easy' },
  { name: 'Plannix',        cat: 'productivity', icon: 'P', desc: 'Turns a messy to-do list into a scheduled weekly plan.',                       free: false, isNew: true,  price: 'From $9/mo',   bestFor: 'Weekly planning',         ease: 'Easy' },
  { name: 'Autoflow',       cat: 'automation',   icon: 'A', desc: 'No-code automations that connect your everyday apps and AI steps.',            free: false, isNew: true,  price: 'From $15/mo',  bestFor: 'Connecting apps',         ease: 'Moderate' }
];
