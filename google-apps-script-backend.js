/**
 * ==============================================================================
 * FlexoraAi — Unified Google Sheets & Email Automation Backend (Google Apps Script)
 * ==============================================================================
 * 
 * Version 6 — Ironclad Anti-Scam & Smart Lead Engine:
 * 1. Comprehensive Scammer & Bot Detection (blocks Russian bots, hacks, HTML injection, disposable emails)
 * 2. ZERO Emails to Scammers (never sends auto-replies or owner alerts for scams)
 * 3. Self-Healing Header Alignment (automatically inserts "Opportunity Status" column)
 * 4. Green Highlighting for Genuine Money Opportunities ($ / Paid / Featured / SEO)
 * 5. Warm "How Can We Help You?" Auto-Responder ONLY for Real Humans
 * 
 * UPDATE INSTRUCTIONS:
 * 1. Open Google Sheets -> Extensions -> Apps Script
 * 2. Replace all code with this file and Save (Ctrl + S).
 * 3. Click "Deploy" -> "Manage deployments" -> Click Pencil (Edit) icon.
 * 4. Choose "New version" -> Click "Deploy".
 */

const OWNER_EMAIL = "ownerflexora.ai@gmail.com";
const SITE_NAME = "FlexoraAi";
const SITE_URL = "https://flexora-ai.github.io";

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const data = e.parameter || {};
    const rawType = (data.form_type || "").toLowerCase();
    const isTool = rawType.indexOf("tool") > -1 || Boolean(data.submission_tier || data.tool_name);

    if (isTool) {
      handleToolSubmission(ss, data);
    } else {
      handleContactInquiry(ss, data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", message: "Submission recorded successfully." }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Error: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "active", service: "FlexoraAi Form Handler" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// -----------------------------------------------------------------------------
// HELPER 1: COMPREHENSIVE SCAMMER & BOT DETECTION ENGINE
// -----------------------------------------------------------------------------
function checkScammer(data) {
  const name = (data.name || data.sender_name || data.submitter_name || "").trim();
  const email = (data.email || data.contact_email || "").toLowerCase().trim();
  const message = (data.message || data.description || data.notes || "").trim();
  const website = (data.website || data.tool_url || "").toLowerCase().trim();
  const combined = (name + " " + email + " " + message + " " + website).toLowerCase();

  // 1. Cyrillic Characters (Russian spam bots, e.g. взлом, накрутка)
  if (/[а-яё]/i.test(combined)) {
    return { isScam: true, reason: "Cyrillic bot spam" };
  }

  // 2. HTML Tag or Script Injections (<a href=, <script, [url=)
  if (/<a\s+href|<script|<iframe|onerror=|javascript:|\[url=|\[link=/i.test(combined)) {
    return { isScam: true, reason: "HTML/Script injection" };
  }

  // 3. Known Disposable / Temporary / Spammer Email Domains
  const disposableDomains = [
    "firstmailmorty", "mail.ru", "tempmail", "10minutemail", "yopmail", 
    "guerrillamail", "trashmail", "sharklasers", "dispostable", "getairmail", 
    "mohmal", "burnermail", "mytemp", "fakemail", "crazymailing", "throwawaymail"
  ];
  for (let i = 0; i < disposableDomains.length; i++) {
    if (email.indexOf(disposableDomains[i]) > -1) {
      return { isScam: true, reason: "Disposable / Bot email domain" };
    }
  }

  // 4. Blacklisted Scam & Exploit Keywords
  const scamKeywords = [
    "nakrutka", "vkontakte", "telegram.*podpis", "взлом", "casino", 
    "1xbet", "viagra", "cialis", "adult cams", "crypto doubler", 
    "whatsapp hack", "instagram hack", "darkweb", "warez", "crack software"
  ];
  for (let i = 0; i < scamKeywords.length; i++) {
    if (new RegExp(scamKeywords[i], "i").test(combined)) {
      return { isScam: true, reason: "Blacklisted scam keyword" };
    }
  }

  // 5. Gibberish / Keyboard Mashing (e.g. dddddddddddd or bbbbbbbv)
  if (/(.)\1{6,}/i.test(message) || /(.)\1{6,}/i.test(name)) {
    return { isScam: true, reason: "Gibberish / Repeated character mashing" };
  }

  // 6. Suspicious TLD links inside message (.ru, .su, .click spam)
  if (/\bhttps?:\/\/[^\s]+\.(ru|su|by|top|click|fun)\b/i.test(combined)) {
    return { isScam: true, reason: "Suspicious spam domain (.ru/.su)" };
  }

  // 7. Empty or Fake Email validation
  if (!email || email.indexOf("@") === -1 || email.indexOf(".") === -1 || email.length < 6) {
    return { isScam: true, reason: "Invalid or fake email format" };
  }

  return { isScam: false, reason: "" };
}

// -----------------------------------------------------------------------------
// HELPER 2: DETECT MONEY OPPORTUNITY (COMMERCIAL INTENT)
// -----------------------------------------------------------------------------
function detectMoneyOpportunity(text, topic) {
  const combined = ((text || "") + " " + (topic || "")).toLowerCase();
  const moneyKeywords = [
    "paid", "sponsor", "sponsorship", "pricing", "price", "cost", "buy", 
    "hire", "budget", "dollar", "$", "promote", "featured", "ad", "ads", 
    "advertising", "agency", "seo service", "client", "invest", "quote", 
    "proposal", "deal", "revenue", "partner package", "commercial", "tier",
    "50", "affiliate", "campaign", "billing", "invoice"
  ];
  
  for (let i = 0; i < moneyKeywords.length; i++) {
    if (combined.indexOf(moneyKeywords[i]) > -1) {
      return true;
    }
  }
  return false;
}

// -----------------------------------------------------------------------------
// HELPER 2B: HTML ESCAPING FOR EMAIL SECURITY (PREVENTS HTML INJECTION)
// -----------------------------------------------------------------------------
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// -----------------------------------------------------------------------------
// HELPER 3: SELF-HEALING HEADER ALIGNMENT
// -----------------------------------------------------------------------------
function ensureContactHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp", "Sender Name", "Email Address", "Company / Tool",
      "Service / Topic", "Opportunity Status", "Message Content", "Status"
    ]);
    sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#0F131D").setFontColor("#2DE2C8");
    sheet.setFrozenRows(1);
    return;
  }
  
  const headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  if (headers.indexOf("Opportunity Status") === -1) {
    const msgIndex = headers.indexOf("Message Content");
    const insertAt = msgIndex > -1 ? msgIndex + 1 : 6;
    sheet.insertColumnBefore(insertAt);
    sheet.getRange(1, insertAt).setValue("Opportunity Status").setFontWeight("bold").setBackground("#0F131D").setFontColor("#2DE2C8");
  }
}

function ensureToolHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp", "Tool Name", "Website URL", "Category", "Subcategory",
      "Pricing Model", "Starting Price", "Tier / Plan", "Opportunity Status",
      "Submitter Name", "Submitter Email", "Backlink / Exchange Notes",
      "Short Description", "Full Description", "Status"
    ]);
    sheet.getRange(1, 1, 1, 15).setFontWeight("bold").setBackground("#0F131D").setFontColor("#2DE2C8");
    sheet.setFrozenRows(1);
    return;
  }
  
  const headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  if (headers.indexOf("Opportunity Status") === -1) {
    const submitterIndex = headers.indexOf("Submitter Name");
    const insertAt = submitterIndex > -1 ? submitterIndex + 1 : 9;
    sheet.insertColumnBefore(insertAt);
    sheet.getRange(1, insertAt).setValue("Opportunity Status").setFontWeight("bold").setBackground("#0F131D").setFontColor("#2DE2C8");
  }
}

// -----------------------------------------------------------------------------
// 1. TOOL / BRAND SUBMISSION HANDLER
// -----------------------------------------------------------------------------
function handleToolSubmission(ss, data) {
  let sheet = ss.getSheetByName("Tool Submissions");
  if (!sheet) {
    sheet = ss.insertSheet("Tool Submissions");
  }
  ensureToolHeaders(sheet);

  const timestamp = new Date();
  const toolName = data.tool_name || data.name || "Untitled Tool";
  const website = data.website || data.tool_url || "";
  const category = data.category || "";
  const subcategory = data.subcategory || "";
  const pricing = data.pricing || "";
  const startingPrice = data.starting_price || "";
  const tier = data.submission_tier || "Partner Link Exchange";
  const submitterName = data.submitter_name || data.name || "Founder";
  const submitterEmail = data.contact_email || data.email || "";
  const notes = data.features || data.backlink_url || data.notes || "";
  const shortDesc = data.short_description || data.description || "";
  const fullDesc = data.full_description || "";

  // 1. Check for Scammer / Bot Submission
  const scamCheck = checkScammer(data);
  if (scamCheck.isScam) {
    sheet.appendRow([
      timestamp, toolName, website, category, subcategory,
      pricing, startingPrice, tier, "🚫 SCAM: " + scamCheck.reason,
      submitterName, submitterEmail, notes, shortDesc, fullDesc,
      "Blocked Scammer"
    ]);
    const newRow = sheet.getLastRow();
    sheet.getRange(newRow, 1, 1, 15).setBackground("#2D1515").setFontColor("#F87171");
    sheet.getRange(newRow, 9).setFontWeight("bold").setFontColor("#EF4444");
    Logger.log("Scammer tool submission blocked: " + toolName + " (" + scamCheck.reason + ")");
    // NEVER SEND EMAILS FOR SCAMMERS
    return;
  }

  // 2. Legitimate Tool Submission
  const isPaidFeatured = tier.indexOf("50") > -1 || tier.indexOf("Featured") > -1;
  const oppLabel = isPaidFeatured ? "💰 PAID FEATURED ($50)" : "🤝 Partner Exchange (Free)";

  sheet.appendRow([
    timestamp, toolName, website, category, subcategory,
    pricing, startingPrice, tier, oppLabel,
    submitterName, submitterEmail, notes, shortDesc, fullDesc,
    "Pending Review"
  ]);

  const newRow = sheet.getLastRow();
  if (isPaidFeatured) {
    sheet.getRange(newRow, 1, 1, 15).setBackground("#064E3B").setFontColor("#F2F4FA");
    sheet.getRange(newRow, 9).setBackground("#10B981").setFontColor("#FFFFFF").setFontWeight("bold");
  }

  // Alert Owner
  const ownerSubject = isPaidFeatured 
    ? `💰 [PAID SPONSOR $50] New Tool Submission: ${toolName}` 
    : `🚀 New Tool Submission: ${toolName} (${tier})`;

  const ownerBody = `
    <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0F131D;color:#F2F4FA;border-radius:12px;border:1px solid #232838;">
      ${isPaidFeatured ? `
        <div style="background:#065f46;border:2px solid #10b981;color:#ffffff;padding:14px;border-radius:8px;font-weight:bold;margin-bottom:16px;font-size:15px;text-align:center;">
          💰 PAID FEATURED PLAN SELECTED ($50/Year) — High Value Opportunity!
        </div>
      ` : ''}
      <h2 style="color:#2DE2C8;margin-top:0;">🚀 New AI Tool Submission</h2>
      <p style="font-size:14px;color:#8A90A6;">A verified brand has submitted their AI tool for review on <b>${SITE_NAME}</b>.</p>
      
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;width:140px;">Tool Name:</td><td style="color:#F2F4FA;font-weight:bold;">${escapeHtml(toolName)}</td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Website:</td><td><a href="${escapeHtml(website)}" style="color:#2DE2C8;" target="_blank">${escapeHtml(website)}</a></td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Selected Tier:</td><td style="color:${isPaidFeatured ? '#10b981' : '#f59e0b'};font-weight:bold;">${escapeHtml(tier)}</td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Category:</td><td style="color:#F2F4FA;">${escapeHtml(category)} (${escapeHtml(subcategory)})</td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Pricing:</td><td style="color:#F2F4FA;">${escapeHtml(pricing)} ${startingPrice ? '- ' + escapeHtml(startingPrice) : ''}</td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Submitter:</td><td style="color:#F2F4FA;">${escapeHtml(submitterName)} (<a href="mailto:${escapeHtml(submitterEmail)}" style="color:#2DE2C8;">${escapeHtml(submitterEmail)}</a>)</td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Description:</td><td style="color:#F2F4FA;">${escapeHtml(shortDesc)}</td></tr>
      </table>

      <div style="background:#161B28;padding:16px;border-radius:8px;border:1px solid #232838;margin-top:20px;">
        <b style="color:#2DE2C8;">Next Steps for Partner Exchange:</b>
        <p style="margin:6px 0 0;font-size:13px;color:#8A90A6;line-height:1.6;">
          1. Dedicated Preview URL: <code style="color:#2DE2C8;">${SITE_URL}/tools/${toolName.toLowerCase().replace(/[^a-z0-9]/g,'-')}.html</code><br/>
          2. Send them email: Show them their page and ask them to add your backlink badge.<br/>
          3. Once verified, add to <code style="color:#2DE2C8;">tools-data.js</code> to feature them in the main directory!
        </p>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: ownerSubject,
    htmlBody: ownerBody,
    replyTo: submitterEmail
  });

  // Auto-Confirmation to Submitter (Brand)
  if (submitterEmail && submitterEmail.indexOf("@") > -1) {
    const isPartner = tier.indexOf("Partner") > -1 || tier.indexOf("Exchange") > -1;
    const clientSubject = `FlexoraAi — We received ${toolName} for review!`;
    const clientBody = `
      <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0F131D;color:#F2F4FA;border-radius:12px;border:1px solid #232838;">
        <h2 style="color:#2DE2C8;margin-top:0;">Thanks for submitting ${toolName}!</h2>
        <p style="font-size:14.5px;color:#8A90A6;line-height:1.7;">
          Hi ${submitterName},<br/><br/>
          We have received your submission for <b>${toolName}</b> on <b>${SITE_NAME}</b> under the <b>${tier}</b> model.
        </p>

        <div style="background:#161B28;border:1px solid #232838;border-left:4px solid #2DE2C8;padding:16px;border-radius:8px;margin:20px 0;">
          <h4 style="margin:0 0 8px;color:#2DE2C8;">What happens next?</h4>
          <p style="margin:0;font-size:13.5px;color:#8A90A6;line-height:1.7;">
            ${isPartner 
              ? "Our editorial team is reviewing your tool. Once approved, we will build your dedicated listing page on <b>flexora-ai.github.io/tools/</b> and reply directly to this email with your live URL and badge embed code to complete the reciprocal link exchange."
              : "Thank you for choosing the Featured 1-Year Spotlight! Our team will publish your verified spotlight on the homepage within 24 hours. Invoice and confirmation details will follow shortly."}
          </p>
        </div>

        <p style="font-size:13px;color:#8A90A6;margin-top:24px;">
          Best regards,<br/>
          <strong style="color:#F2F4FA;">The FlexoraAi Team</strong><br/>
          <a href="${SITE_URL}" style="color:#2DE2C8;text-decoration:none;">${SITE_URL}</a>
        </p>
      </div>
    `;

    MailApp.sendEmail({
      to: submitterEmail,
      subject: clientSubject,
      htmlBody: clientBody,
      replyTo: OWNER_EMAIL
    });
  }
}

// -----------------------------------------------------------------------------
// 2. CONTACT / USER INQUIRY HANDLER WITH SCAM BLOCKER & MONEY DETECTOR
// -----------------------------------------------------------------------------
function handleContactInquiry(ss, data) {
  let sheet = ss.getSheetByName("Contact Inquiries");
  if (!sheet) {
    sheet = ss.insertSheet("Contact Inquiries");
  }
  ensureContactHeaders(sheet);

  const timestamp = new Date();
  const name = data.name || data.sender_name || "Visitor";
  const email = data.email || data.contact_email || "";
  const company = data.company || data.tool_name || "N/A";
  const topic = data.service || data.subject || "General Inquiry";
  const message = data.message || data.notes || "";

  // 1. Check for Scammer / Bot
  const scamCheck = checkScammer(data);
  if (scamCheck.isScam) {
    sheet.appendRow([
      timestamp,
      name,
      email,
      company,
      topic,
      "🚫 SCAM: " + scamCheck.reason,
      message,
      "Blocked Scammer"
    ]);
    const newRow = sheet.getLastRow();
    sheet.getRange(newRow, 1, 1, 8).setBackground("#2D1515").setFontColor("#F87171");
    sheet.getRange(newRow, 6).setFontWeight("bold").setFontColor("#EF4444");
    Logger.log("Scammer contact inquiry blocked from " + email + " (" + scamCheck.reason + ")");
    // NEVER SEND EMAIL TO SCAMMERS, NEVER SPAM OWNER
    return;
  }

  // 2. Analyze if there is a money/business opportunity
  const isMoneyOpportunity = detectMoneyOpportunity(message, topic);
  const oppLabel = isMoneyOpportunity ? "💰 MONEY OPPORTUNITY" : "Standard Inquiry";

  sheet.appendRow([
    timestamp,
    name,
    email,
    company,
    topic,
    oppLabel,
    message,
    "New Message"
  ]);

  const newRow = sheet.getLastRow();
  const oppCell = sheet.getRange(newRow, 6);

  // If Money Opportunity: Highlight cell in VIBRANT GREEN with bold white text!
  if (isMoneyOpportunity) {
    sheet.getRange(newRow, 1, 1, 8).setBackground("#064E3B").setFontColor("#F2F4FA");
    oppCell.setBackground("#10B981").setFontColor("#FFFFFF").setFontWeight("bold");
  }

  // Alert Owner
  const ownerSubject = isMoneyOpportunity 
    ? `💰 [MONEY OPPORTUNITY] Contact Inquiry from ${name} (${topic})`
    : `📬 New Contact Inquiry from ${name} (${topic})`;

  const ownerBody = `
    <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0F131D;color:#F2F4FA;border-radius:12px;border:1px solid #232838;">
      ${isMoneyOpportunity ? `
        <div style="background:#065f46;border:2px solid #10b981;color:#ffffff;padding:14px;border-radius:8px;font-weight:bold;margin-bottom:16px;font-size:15px;text-align:center;">
          💰 HIGH-PRIORITY: Money / Monetization Opportunity Detected! Review immediately.
        </div>
      ` : ''}
      
      <h2 style="color:#2DE2C8;margin-top:0;">📬 New Contact Inquiry</h2>
      <p style="font-size:14px;color:#8A90A6;">You received a new message through FlexoraAi contact form:</p>
      
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;width:120px;">Name:</td><td style="color:#F2F4FA;font-weight:bold;">${escapeHtml(name)}</td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Email:</td><td><a href="mailto:${escapeHtml(email)}" style="color:#2DE2C8;">${escapeHtml(email)}</a></td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Topic / Service:</td><td style="color:#F2F4FA;">${escapeHtml(topic)}</td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Company:</td><td style="color:#F2F4FA;">${escapeHtml(company)}</td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Opportunity:</td><td style="color:${isMoneyOpportunity ? '#10b981' : '#8A90A6'};font-weight:bold;">${escapeHtml(oppLabel)}</td></tr>
      </table>

      <div style="background:#161B28;padding:16px;border-radius:8px;border:1px solid #232838;margin-top:16px;">
        <b style="color:#2DE2C8;font-size:13px;">Message:</b>
        <p style="margin:8px 0 0;font-size:14px;color:#F2F4FA;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</p>
      </div>
      <p style="font-size:12px;color:#8A90A6;margin-top:16px;">Hit "Reply" in your email client to message ${escapeHtml(name)} directly.</p>
    </div>
  `;

  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: ownerSubject,
    htmlBody: ownerBody,
    replyTo: email
  });

  // Friendly Welcome Auto-Reply ONLY to Real Verified Humans
  if (email && email.indexOf("@") > -1) {
    const clientSubject = `FlexoraAi — How can we help you, ${escapeHtml(name)}?`;
    const clientBody = `
      <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0F131D;color:#F2F4FA;border-radius:12px;border:1px solid #232838;">
        <h2 style="color:#2DE2C8;margin-top:0;">Thanks for reaching out!</h2>
        <p style="font-size:14.5px;color:#8A90A6;line-height:1.7;">
          Hi ${escapeHtml(name)},<br/><br/>
          Thank you for contacting <b>${SITE_NAME}</b>! We received your message regarding <b>${escapeHtml(topic)}</b>.
        </p>
        <p style="font-size:14.5px;color:#8A90A6;line-height:1.7;">
          <b>What can we do for you?</b><br/>
          Whether you are looking to promote an AI tool, explore SEO and content partnerships, advertise on our directory, or discuss a custom collaboration, we are here to help you get the best visibility.
        </p>
        <p style="font-size:14.5px;color:#8A90A6;line-height:1.7;">
          Our founder and team review every inquiry and will reply personally within 24 to 48 hours. If you have extra details, links, or specific questions in the meantime, simply reply directly to this email!
        </p>
        <p style="font-size:13px;color:#8A90A6;margin-top:24px;">
          Best regards,<br/>
          <strong style="color:#F2F4FA;">Prashant Lalwani &amp; The FlexoraAi Team</strong><br/>
          <a href="${SITE_URL}" style="color:#2DE2C8;text-decoration:none;">${SITE_URL}</a>
        </p>
      </div>
    `;

    MailApp.sendEmail({
      to: email,
      subject: clientSubject,
      htmlBody: clientBody,
      replyTo: OWNER_EMAIL
    });
  }
}
