/**
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
  "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";
