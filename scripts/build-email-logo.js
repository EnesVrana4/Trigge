/**
 * Regenerates lib/email-logo.ts from public/images/trigge_logo.png.
 *
 * Run this if the logo artwork changes:
 *
 *   node scripts/build-email-logo.js
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// The mark inside the 1254x1254 source canvas — the same region
// components/Logo.tsx crops to with CSS positioning.
const MARK = { left: 409, top: 370, width: 497, height: 347 };

// Rendered at 40px wide in the email, so 280px covers high-DPI displays.
const OUTPUT_WIDTH = 280;

const root = path.join(__dirname, "..");
const source = path.join(root, "public", "images", "trigge_logo.png");
const target = path.join(root, "lib", "email-logo.ts");

(async () => {
  const buffer = await sharp(source)
    .extract(MARK)
    .resize({ width: OUTPUT_WIDTH })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const lines = buffer
    .toString("base64")
    .match(/.{1,96}/g)
    .map((line) => `  "${line}"`)
    .join(" +\n");

  fs.writeFileSync(
    target,
    `/**
 * The Trigge mark, pre-cropped from public/images/trigge_logo.png.
 *
 * The source is a 1254x1254 canvas with large transparent margins; the mark
 * itself sits at x 409-906, y 370-717 (same region components/Logo.tsx crops
 * with CSS). Email clients cannot crop, so the region is baked in here.
 *
 * It is inlined as base64 rather than read from public/ at runtime because
 * serverless bundles do not reliably include that directory. Regenerate with
 * scripts/build-email-logo.js if the artwork changes.
 *
 * The artwork is white — it only reads on a dark background.
 */
export const EMAIL_LOGO_CID = "trigge-mark";

export const EMAIL_LOGO_PNG_BASE64 =
${lines};
`,
  );

  console.log(`✓ Wrote ${path.relative(root, target)} (${buffer.length} bytes of PNG).`);
})();
