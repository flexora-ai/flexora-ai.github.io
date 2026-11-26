/**
 * ==============================================================================
 * FlexoraAi — Unified Google Sheets & Email Automation Backend (Google Apps Script)
 * ==============================================================================
 * 
 * 100% FREE — Unlimited Submissions — Automatic Categorization — Instant Emails
 * 
 * SETUP INSTRUCTIONS (Takes 2 minutes):
 * 1. Open Google Sheets (https://sheets.google.com) and create a New Spreadsheet.
 * 2. Name the spreadsheet: "FlexoraAi Submissions"
 * 3. Rename the first sheet tab to: "Tool Submissions"
 *    Create a second sheet tab named: "Contact Inquiries"
 * 4. Click: Extensions -> Apps Script
 * 5. Delete any code in the editor, paste this ENTIRE file, and save (Ctrl + S).
 * 6. Click "Deploy" -> "New deployment"
 *    - Click the gear icon next to "Select type" and choose "Web app"
 *    - Description: "FlexoraAi Forms API"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (IMPORTANT! Allows your website forms to post)
 * 7. Click "Deploy", review permissions, and copy the "Web app URL"
 *    (looks like: https://script.google.com/macros/s/AKfycb.../exec)
 * 8. Paste that Web app URL into FlexoraAi's modals.js / submit.html!
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
// 1. TOOL / BRAND SUBMISSION HANDLER
// -----------------------------------------------------------------------------
function handleToolSubmission(ss, data) {
  let sheet = ss.getSheetByName("Tool Submissions");
  if (!sheet) {
    sheet = ss.insertSheet("Tool Submissions");
  }

  // Set headers if new
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Tool Name",
      "Website URL",
      "Category",
      "Subcategory",
      "Pricing Model",
      "Starting Price",
      "Tier / Plan",
      "Submitter Name",
      "Submitter Email",
      "Backlink / Exchange Notes",
      "Short Description",
      "Full Description",
      "Status"
    ]);
    sheet.getRange(1, 1, 1, 14).setFontWeight("bold").setBackground("#0F131D").setFontColor("#2DE2C8");
    sheet.setFrozenRows(1);
  }

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
  const status = "Pending Review";

  sheet.appendRow([
    timestamp,
    toolName,
    website,
    category,
    subcategory,
    pricing,
    startingPrice,
    tier,
    submitterName,
    submitterEmail,
    notes,
    shortDesc,
    fullDesc,
    status
  ]);

  // 1. Alert to Owner
  const ownerSubject = "🚀 New Tool Submission: " + toolName + " (" + tier + ")";
  const ownerBody = `
    <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0F131D;color:#F2F4FA;border-radius:12px;border:1px solid #232838;">
      <h2 style="color:#2DE2C8;margin-top:0;">🚀 New AI Tool Submission</h2>
      <p style="font-size:14px;color:#8A90A6;">A new brand has submitted their AI tool for review on <b>${SITE_NAME}</b>.</p>
      
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;width:140px;">Tool Name:</td><td style="color:#F2F4FA;font-weight:bold;">${toolName}</td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Website:</td><td><a href="${website}" style="color:#2DE2C8;" target="_blank">${website}</a></td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Selected Tier:</td><td style="color:#f59e0b;font-weight:bold;">${tier}</td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Category:</td><td style="color:#F2F4FA;">${category} (${subcategory})</td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Pricing:</td><td style="color:#F2F4FA;">${pricing} ${startingPrice ? '- ' + startingPrice : ''}</td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Submitter:</td><td style="color:#F2F4FA;">${submitterName} (<a href="mailto:${submitterEmail}" style="color:#2DE2C8;">${submitterEmail}</a>)</td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Description:</td><td style="color:#F2F4FA;">${shortDesc}</td></tr>
      </table>

      <div style="background:#161B28;padding:16px;border-radius:8px;border:1px solid #232838;margin-top:20px;">
        <b style="color:#2DE2C8;">Next Steps for Partner Exchange:</b>
        <p style="margin:6px 0 0;font-size:13px;color:#8A90A6;line-height:1.6;">
          1. Review their website.<br/>
          2. Create their dedicated URL: <code style="color:#2DE2C8;">${SITE_URL}/tools/${toolName.toLowerCase().replace(/[^a-z0-9]/g,'-')}.html</code><br/>
          3. Reply to <a href="mailto:${submitterEmail}" style="color:#2DE2C8;">${submitterEmail}</a> with their live URL so they place your badge!
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

  // 2. Confirmation to Submitter (Brand)
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
// 2. CONTACT / USER INQUIRY HANDLER
// -----------------------------------------------------------------------------
function handleContactInquiry(ss, data) {
  let sheet = ss.getSheetByName("Contact Inquiries");
  if (!sheet) {
    sheet = ss.insertSheet("Contact Inquiries");
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Sender Name",
      "Email Address",
      "Company / Tool",
      "Service / Topic",
      "Message Content",
      "Status"
    ]);
    sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#0F131D").setFontColor("#2DE2C8");
    sheet.setFrozenRows(1);
  }

  const timestamp = new Date();
  const name = data.name || data.sender_name || "Visitor";
  const email = data.email || data.contact_email || "";
  const company = data.company || data.tool_name || "N/A";
  const topic = data.service || data.subject || "General Inquiry";
  const message = data.message || data.notes || "";
  const status = "New Message";

  sheet.appendRow([timestamp, name, email, company, topic, message, status]);

  // Alert Owner
  const ownerSubject = `📬 New Contact Inquiry from ${name} (${topic})`;
  const ownerBody = `
    <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0F131D;color:#F2F4FA;border-radius:12px;border:1px solid #232838;">
      <h2 style="color:#2DE2C8;margin-top:0;">📬 New Contact Inquiry</h2>
      <p style="font-size:14px;color:#8A90A6;">You received a new message through FlexoraAi contact form:</p>
      
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;width:120px;">Name:</td><td style="color:#F2F4FA;font-weight:bold;">${name}</td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Email:</td><td><a href="mailto:${email}" style="color:#2DE2C8;">${email}</a></td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Topic / Service:</td><td style="color:#F2F4FA;">${topic}</td></tr>
        <tr style="border-bottom:1px solid #232838;"><td style="padding:10px 0;color:#8A90A6;">Company:</td><td style="color:#F2F4FA;">${company}</td></tr>
      </table>

      <div style="background:#161B28;padding:16px;border-radius:8px;border:1px solid #232838;margin-top:16px;">
        <b style="color:#2DE2C8;font-size:13px;">Message:</b>
        <p style="margin:8px 0 0;font-size:14px;color:#F2F4FA;line-height:1.6;white-space:pre-wrap;">${message}</p>
      </div>
      <p style="font-size:12px;color:#8A90A6;margin-top:16px;">Hit "Reply" in your email client to message ${name} directly.</p>
    </div>
  `;

  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: ownerSubject,
    htmlBody: ownerBody,
    replyTo: email
  });

  // Auto-Reply to Visitor
  if (email && email.indexOf("@") > -1) {
    const clientSubject = "Thank you for reaching out to FlexoraAi";
    const clientBody = `
      <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0F131D;color:#F2F4FA;border-radius:12px;border:1px solid #232838;">
        <h2 style="color:#2DE2C8;margin-top:0;">Message Received!</h2>
        <p style="font-size:14.5px;color:#8A90A6;line-height:1.7;">
          Hi ${name},<br/><br/>
          Thanks for contacting <b>${SITE_NAME}</b>! We've received your note regarding <b>${topic}</b>.
        </p>
        <p style="font-size:14.5px;color:#8A90A6;line-height:1.7;">
          Our team reviews every inquiry and will get back to you within 24 to 48 hours.
        </p>
        <p style="font-size:13px;color:#8A90A6;margin-top:24px;">
          Best regards,<br/>
          <strong style="color:#F2F4FA;">The FlexoraAi Team</strong><br/>
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
