import type { MetadataRoute } from "next";
import { PORTFOLIO_ENABLED, SERVICES } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

// Deliberate content revision dates, never the build timestamp.
const CONTENT_UPDATED = "2026-10-03";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/services", "/about", "/contact", ...SERVICES.map(({ slug }) => `/services/${slug}`)];
  const pages: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: CONTENT_UPDATED,
  }));
  // Add a verified content date when real portfolio work is published.
  if (PORTFOLIO_ENABLED) pages.push({ url: `${SITE_URL}/portfolio` });
  return pages;
}
