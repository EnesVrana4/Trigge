# Trigge Solutions launch checklist

## Prepared in this project

- Approved homepage headline and U.S. positioning; consistent Croydon location.
- Six service pages with individual titles, descriptions, canonical URLs, visible breadcrumbs, Service structured data, FAQs and related links.
- Sitemap includes all ten public pages with an explicit content revision date. Update dates when content meaningfully changes, not at every build.
- Portfolio stays unavailable until there is verified work to publish. Existing illustrative assets are not evidence of completed client work.
- Mobile skips the intro curtain and large decorative background animations. Desktop retains the intro; reduced-motion preferences remain supported.
- Main service and reveal content starts visible in server HTML.

## Required when deploying

1. Deploy this repository to Vercel and add `triggesolutions.com` and `www.triggesolutions.com` in the project domain settings. Apply the DNS records Vercel displays in Namecheap; replace parking/URL forwarding for these web hostnames without changing unrelated mail records.
2. Use `https://triggesolutions.com` as the primary domain. Configure a permanent redirect from www to that primary domain and verify HTTP redirects to HTTPS, preserving paths. Check certificate issuance and all domain variants after DNS propagation.
3. Configure `SMTP_USER`, `SMTP_PASSWORD` (Gmail app password) and optional `CONTACT_TO` as production environment variables. Redeploy after changes. Do not commit secrets. Send one authorized test inquiry and verify inbox delivery; local validation alone cannot establish deliverability.
4. Create or verify a Google Search Console Domain property using its DNS instructions. Alternatively, put an HTML-tag token in `GOOGLE_SITE_VERIFICATION` and redeploy for a URL-prefix property.
5. Submit `https://triggesolutions.com/sitemap.xml`. Inspect the homepage and service URLs, confirm they are accessible and eligible for indexing, and request indexing where appropriate. Google determines indexing and ranking.
6. Inspect the production site for unintended noindex headers/tags or access protection. Keep preview deployments protected; their canonical tags are not an access control.
7. Measure mobile performance on the deployed site. Review PageSpeed Insights lab results and, when available, Search Console field data. Local checks are not field Core Web Vitals results.

## After launch

- Establish analytics and inquiry conversion tracking using the chosen account/provider. Count successful inquiries, not button clicks; avoid sending names, email addresses or message contents to analytics.
- Review Search Console queries and pages with the United States country filter. Compare impressions, clicks and relevant inquiries over meaningful periods; new sites can have little initial data.
- Expand pages when real search queries reveal unanswered buyer questions. Avoid creating duplicate pages for small keyword variations.
- Publish real case studies and authorized testimonials when supplied. No invented customers, outcomes or reviews.
- Earn relevant references through actual partnerships, published work and business profiles. Only use Google Business Profile if the business meets its eligibility requirements.

## Local review

Run `npm run build`, then `npm run start` for a production preview. With the server running, `node scripts/check-seo.mjs` checks the public routes, metadata, structured data, sitemap and safe contact validation paths. It never sends a valid inquiry or an email. Use `npm run dev` for editing.

External deployment, DNS, Search Console, analytics and genuine project evidence require the corresponding accounts or supplied material. They are not completed by building the local site.
