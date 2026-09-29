import type { MetadataRoute } from "next";
import { PORTFOLIO_ENABLED } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date();
  const pages: { path: string; priority: number; frequency: "weekly" | "monthly" }[] = [
    { path: "/", priority: 1, frequency: "weekly" },
    { path: "/services", priority: 0.9, frequency: "monthly" },
    { path: "/contact", priority: 0.8, frequency: "monthly" },
    { path: "/about", priority: 0.7, frequency: "monthly" },
  ];

  // The portfolio 404s until there is real work to show, so it stays out.
  if (PORTFOLIO_ENABLED) {
    pages.push({ path: "/portfolio", priority: 0.8, frequency: "monthly" });
  }

  return pages.map(({ path, priority, frequency }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: updated,
    changeFrequency: frequency,
    priority,
  }));
}
