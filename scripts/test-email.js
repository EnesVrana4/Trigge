/**
 * Verifies the SMTP credentials in .env.local (Namecheap Private Email or Gmail) and sends a test email.
 *
 *   node scripts/test-email.js
 */
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Minimal .env.local reader (Next.js loads this automatically, plain Node does not).
const envPath = path.join(__dirname, "..", ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("\n✗ .env.local not found.");
  console.error("  Copy .env.example to .env.local and fill in your credentials.\n");
  process.exit(1);
}

for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const match = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
  if (match) process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
}

const user = process.env.SMTP_USER?.trim();
const isGmail = user?.toLowerCase().endsWith("@gmail.com");
const pass = isGmail
  ? process.env.SMTP_PASSWORD?.replace(/\s/g, "")
  : process.env.SMTP_PASSWORD?.trim();
const to = process.env.CONTACT_TO?.trim() || user;

if (!user || !pass) {
  console.error("\n✗ SMTP_USER or SMTP_PASSWORD is missing from .env.local\n");
  process.exit(1);
}

const host =
  process.env.SMTP_HOST?.trim() ||
  (isGmail ? undefined : "mail.privateemail.com");
const port = Number(process.env.SMTP_PORT) || 465;

const transporter = host
  ? nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })
  : nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

(async () => {
  try {
    console.log(`\nVerifying credentials for ${user} (${host || "gmail"}) ...`);
    await transporter.verify();
    console.log("✓ Credentials accepted by mail server.");

    console.log(`Sending a test email to ${to} ...`);
    await transporter.sendMail({
      from: `"Trigge Solutions Website" <${user}>`,
      to,
      subject: "Test — contact form is working",
      text: "If you can read this, the website contact form can deliver email.",
    });

    console.log(`✓ Test email sent. Check the inbox of ${to}.\n`);
  } catch (error) {
    console.error("\n✗ Failed:", error.message);
    process.exit(1);
  }
})();
