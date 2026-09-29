/**
 * Verifies the Gmail SMTP credentials in .env.local and sends a test email.
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

const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASSWORD;
const to = process.env.CONTACT_TO || user;

if (!user || !pass) {
  console.error("\n✗ SMTP_USER or SMTP_PASSWORD is missing from .env.local\n");
  process.exit(1);
}

if (pass.replace(/\s/g, "").length !== 16) {
  console.warn(
    `\n⚠ SMTP_PASSWORD is ${pass.length} characters. A Google App Password is 16.`,
  );
  console.warn("  Make sure you used an App Password, not your normal Gmail password.\n");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user, pass: pass.replace(/\s/g, "") },
});

(async () => {
  try {
    console.log(`\nVerifying credentials for ${user} ...`);
    await transporter.verify();
    console.log("✓ Credentials accepted by Gmail.");

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
    if (String(error.message).includes("Username and Password not accepted")) {
      console.error(
        "\n  Gmail rejected the login. Usual causes:\n" +
          "   • You used the normal account password instead of an App Password\n" +
          "   • 2-Step Verification is not enabled on the account\n" +
          "   • The App Password was revoked — create a new one at\n" +
          "     https://myaccount.google.com/apppasswords\n",
      );
    }
    process.exit(1);
  }
})();
