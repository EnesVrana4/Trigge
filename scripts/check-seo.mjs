import assert from "node:assert/strict";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
if (!["localhost", "127.0.0.1", "[::1]"].includes(new URL(base).hostname)) {
  throw new Error("Run these contact validation checks against a local server only.");
}
const origin = "https://triggesolutions.com";
const slugs = ["website-development", "web-application-development", "ecommerce-development", "ui-ux-design", "api-integrations", "maintenance-support"];
const paths = ["/", "/about", "/contact", "/services", ...slugs.map((slug) => `/services/${slug}`)];
const titles = new Set();
const descriptions = new Set();
const links = new Set();

for (const path of paths) {
  const response = await fetch(`${base}${path}`);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/s)?.[1];
  assert.ok(title && !titles.has(title), `Unique title: ${path}`);
  assert.ok(description && !descriptions.has(description), `Unique description: ${path}`);
  titles.add(title); descriptions.add(description);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `One H1: ${path}`);
  assert.ok(html.includes(`rel="canonical" href="${origin}${path === "/" ? "" : path}"`), `Canonical: ${path}`);
  assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html), `Indexable: ${path}`);
  assert.ok(!html.includes('hrefLang='), `No redundant regional alternates: ${path}`);
  const schema = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));
  const graph = schema.flatMap((item) => item["@graph"] || []);
  assert.ok(graph.some((item) => item["@type"] === "WebPage"), `WebPage schema: ${path}`);
  if (path.startsWith("/services/")) {
    assert.ok(graph.some((item) => item["@type"] === "Service" && item.url === `${origin}${path}`), `Service schema: ${path}`);
    assert.equal(graph.find((item) => item["@type"] === "BreadcrumbList").itemListElement.length, 3);
  }
  for (const match of html.matchAll(/href="(\/(?!\/)[^"#?]*)"/g)) {
    if (!match[1].startsWith('/_next/') && !/\.[a-z]+$/i.test(match[1])) links.add(match[1]);
  }
  console.log(`PASS ${path}`);
}
for (const link of links) assert.ok(paths.includes(link), `Internal page link has a tested destination: ${link}`);
for (const path of ["/portfolio", "/services/not-a-real-service", "/not-a-real-page"]) {
  const res = await fetch(`${base}${path}`);
  assert.equal(res.status, 404, `404: ${path}`);
}
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
assert.equal((sitemap.match(/<loc>/g) || []).length, paths.length);
for (const path of paths) assert.ok(sitemap.includes(`<loc>${origin}${path === "/" ? "" : path}</loc>`));
assert.ok(!sitemap.includes('/portfolio'));
assert.ok(!sitemap.includes('<priority>'));
assert.ok(!sitemap.includes('<changefreq>'));
const robots = await (await fetch(`${base}/robots.txt`)).text();
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
assert.ok(robots.includes('Disallow: /api/'));

// These payloads cannot send an email: malformed, invalid or honeypot.
for (const body of ['null', '[]', '{', '{}']) {
  const res = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '192.0.2.201' }, body });
  assert.equal(res.status, 400, `Invalid payload: ${body}`);
}
const trap = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '192.0.2.202' }, body: JSON.stringify({ website: 'bot.invalid' }) });
assert.equal(trap.status, 200);
console.log('PASS metadata, schema, internal links, 404s, sitemap, robots and safe contact validation.');
console.log('Actual SMTP delivery and deployed Core Web Vitals require separate verification.');
