import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { CONTACT } from "@/lib/data";
import { EMAIL_LOGO_CID, EMAIL_LOGO_PNG_BASE64 } from "@/lib/email-logo";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple in-memory rate limit: max 5 submissions per IP per 15 minutes.
const RATE_LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// The site's palette (tailwind.config.ts) — email clients need literal values.
const NAVY_950 = "#070b14";
const NAVY_900 = "#0b1120";
const NAVY_700 = "#1d283f";
const ACCENT = "#7fb0f0";
const ACCENT_LIGHT = "#a8c9f5";
const BORDER = "#e4e9f2";
const MUTED = "#64748b";

// Inter is a webfont the site loads; mail clients fall back to the system stack.
// Font names are single-quoted on purpose: this goes inside style="..." and a
// double quote there ends the attribute, silently dropping every later property.
const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;

type Detail = { label: string; value: string; href?: string };

/**
 * Renders the inquiry as the website's own dark-header / light-body layout.
 * Tables and inline styles only — Outlook ignores flexbox, grid and <style>.
 */
function renderInquiryEmail({
  name,
  email,
  message,
  company,
  details,
}: {
  name: string;
  email: string;
  message: string;
  company: string;
  details: Detail[];
}) {
  const eyebrow = (text: string, color: string) =>
    `<div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:2.75px;text-transform:uppercase;color:${color}">${text}</div>`;

  const detailRows = details
    .map(({ label, value, href }, index) => {
      const shown = escapeHtml(value);
      const cell = href
        ? `<a href="${href}" style="color:${NAVY_900};text-decoration:none;border-bottom:1px solid ${ACCENT}">${shown}</a>`
        : shown;
      const divider =
        index === 0 ? "" : `border-top:1px solid ${BORDER};`;
      return `
        <tr>
          <td style="${divider}padding:12px 16px 12px 0;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};white-space:nowrap;vertical-align:top;width:104px">${label}</td>
          <td style="${divider}padding:12px 0;font-family:${FONT};font-size:15px;color:${NAVY_900};vertical-align:top">${cell}</td>
        </tr>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>New project inquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#eef1f6">
  <!-- Preview line shown next to the subject in the inbox list. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">
    ${escapeHtml(name)}${company ? ` · ${escapeHtml(company)}` : ""} — ${escapeHtml(
      message.slice(0, 120),
    )}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eef1f6">
    <tr>
      <td align="center" style="padding:32px 16px">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(7,11,20,0.10)">

          <!-- Header — the site's navy hero -->
          <tr>
            <td bgcolor="${NAVY_950}" style="background-color:${NAVY_950};padding:32px 32px 28px">

              <!-- Logo lockup: CID-attached mark + live wordmark, as on the site -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-right:12px;vertical-align:middle">
                    <img src="cid:${EMAIL_LOGO_CID}" width="40" alt="Trigge Solutions"
                         style="display:block;width:40px;height:auto;border:0;outline:none;text-decoration:none">
                  </td>
                  <td style="vertical-align:middle">
                    <div style="font-family:${FONT};font-size:15px;font-weight:700;letter-spacing:2.7px;color:#ffffff;line-height:1.2">TRIGGE</div>
                    <div style="font-family:${FONT};font-size:9px;font-weight:600;letter-spacing:2.6px;color:#8e9bb3;line-height:1.4">SOLUTIONS</div>
                  </td>
                </tr>
              </table>

              <div style="height:1px;background-color:${NAVY_700};margin:24px 0 20px;line-height:1px;font-size:0">&nbsp;</div>

              ${eyebrow("New project inquiry", ACCENT)}
              <div style="font-family:${FONT};font-size:26px;font-weight:700;color:#ffffff;line-height:1.25;margin-top:10px">${escapeHtml(
                name,
              )}</div>
              ${
                company
                  ? `<div style="font-family:${FONT};font-size:15px;color:${ACCENT_LIGHT};margin-top:4px">${escapeHtml(
                      company,
                    )}</div>`
                  : ""
              }
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td bgcolor="#ffffff" style="background-color:#ffffff;padding:32px">

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${detailRows}
              </table>

              <div style="height:1px;background-color:${BORDER};margin:28px 0 22px;line-height:1px;font-size:0">&nbsp;</div>

              ${eyebrow("Message", ACCENT)}

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px">
                <tr>
                  <td style="border-left:3px solid ${ACCENT};background-color:#f6f8fc;border-radius:0 10px 10px 0;padding:18px 20px;font-family:${FONT};font-size:15px;line-height:1.7;color:${NAVY_900}">${escapeHtml(
                    message,
                  ).replace(/\r?\n/g, "<br>")}</td>
                </tr>
              </table>

              <!-- Reply button, matching .btn-dark on the site -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px">
                <tr>
                  <td bgcolor="${NAVY_950}" style="background-color:${NAVY_950};border-radius:999px">
                    <a href="mailto:${escapeHtml(email)}?subject=${encodeURIComponent(
                      `Re: your inquiry — Trigge Solutions`,
                    )}" style="display:inline-block;padding:14px 26px;font-family:${FONT};font-size:14px;font-weight:600;color:#ffffff;text-decoration:none">Reply to ${escapeHtml(
                      name.split(" ")[0],
                    )} &rarr;</a>
                  </td>
                </tr>
              </table>

              <div style="font-family:${FONT};font-size:12px;color:${MUTED};margin-top:14px">
                Or just hit Reply — this email answers ${escapeHtml(name)} directly.
              </div>
            </td>
          </tr>

          <!-- Footer — the site's footer -->
          <tr>
            <td bgcolor="${NAVY_950}" style="background-color:${NAVY_950};padding:26px 32px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:${FONT};font-size:12px;line-height:1.8;color:#8e9bb3">
                    <a href="mailto:${CONTACT.email}" style="color:${ACCENT};text-decoration:none">${CONTACT.email}</a><br>
                    ${escapeHtml(CONTACT.location)}
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:18px;border-top:1px solid ${NAVY_700}">
                    <div style="font-family:${FONT};font-size:11px;letter-spacing:1px;color:#6b7896;margin-top:14px">
                      Build &middot; Innovate &middot; Grow
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <div style="font-family:${FONT};font-size:11px;color:#94a3b8;margin-top:18px">
          Sent automatically by the Trigge Solutions website contact form.
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again later." },
      { status: 429 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field — bots do.
  if (String(payload.website ?? "").trim()) {
    return NextResponse.json({
      message:
        "We have received your inquiry and will get back to you within one business day.",
    });
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const message = String(payload.message ?? "").trim();
  const company = String(payload.company ?? "").trim();
  const budget = String(payload.budget ?? "").trim();
  const services = Array.isArray(payload.services)
    ? payload.services.join(", ")
    : String(payload.services ?? "");

  if (!name || !EMAIL_PATTERN.test(email) || message.length < 10) {
    return NextResponse.json(
      { error: "Please fill in your name, a valid email and a short message." },
      { status: 400 },
    );
  }

  const user = process.env.SMTP_USER;
  // Google shows app passwords in groups of four; the spaces are not part of it.
  const pass = process.env.SMTP_PASSWORD?.replace(/\s/g, "");
  const to = process.env.CONTACT_TO ?? CONTACT.email;

  if (!user || !pass) {
    console.error(
      "[contact] SMTP_USER / SMTP_PASSWORD are not set — message NOT delivered.",
    );
    return NextResponse.json(
      {
        error: `Our contact form is not available right now. Please email us directly at ${CONTACT.email}.`,
      },
      { status: 503 },
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  // Name and company already head the email, so they are not repeated here.
  const details: Detail[] = [
    { label: "Email", value: email, href: `mailto:${email}` },
    { label: "Budget", value: budget || "—" },
    { label: "Services", value: services || "—" },
  ];

  try {
    await transporter.sendMail({
      from: `"Trigge Solutions Website" <${user}>`,
      to,
      // Hitting "Reply" in Gmail answers the visitor directly.
      replyTo: `"${name}" <${email}>`,
      subject: `New project inquiry from ${name}${company ? ` (${company})` : ""}`,
      text: [
        "NEW PROJECT INQUIRY",
        "",
        `Name: ${name}`,
        `Company: ${company || "—"}`,
        ...details.map(({ label, value }) => `${label}: ${value}`),
        "",
        "Message:",
        message,
        "",
        "—",
        "Trigge Solutions · Build · Innovate · Grow",
        CONTACT.location,
      ].join("\n"),
      html: renderInquiryEmail({ name, email, message, company, details }),
      attachments: [
        {
          // Referenced as cid: in the header. Gmail blocks data: URIs in <img>,
          // so the mark has to travel as a related part, not inline.
          filename: "trigge-mark.png",
          cid: EMAIL_LOGO_CID,
          content: Buffer.from(EMAIL_LOGO_PNG_BASE64, "base64"),
          contentType: "image/png",
          contentDisposition: "inline",
        },
      ],
    });

    return NextResponse.json({
      message:
        "We have received your inquiry and will get back to you within one business day.",
    });
  } catch (error) {
    console.error("[contact] failed to send email", error);
    return NextResponse.json(
      {
        error: `We could not send your message. Please email us directly at ${CONTACT.email}.`,
      },
      { status: 502 },
    );
  }
}
