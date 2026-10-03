import type { Metadata } from "next";
import { CONTACT, FAQS, SERVICES, SOCIAL_LINKS, TECH } from "./data";

export const SITE_URL = "https://triggesolutions.com";
export const BRAND = "Trigge Solutions";
export const OG_IMAGE = "/og/trigge-solutions.png";

/** Both markets are served from Pennsylvania, in English. */
const SERVED = [
  { "@type": "Country", name: "United States" },
  { "@type": "Country", name: "Canada" },
];

const url = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

/**
 * Page metadata with the pieces search engines look for: a canonical URL, a
 * title without the brand repeated twice, and social cards.
 */
export function pageMeta({
  title,
  description,
  path,
  absolute = false,
}: {
  title: string;
  description: string;
  path: string;
  /** Set on the home page, whose title already carries the brand. */
  absolute?: boolean;
}): Metadata {
  const canonical = url(path);
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: BRAND,
      title: absolute ? title : `${title} | ${BRAND}`,
      description,
      locale: "en_US",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: BRAND }],
    },
    twitter: {
      card: "summary_large_image",
      title: absolute ? title : `${title} | ${BRAND}`,
      description,
      images: [OG_IMAGE],
    },
  };
}

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** The business itself: what it does, for whom, and where. */
function organization() {
  return {
    "@type": ["ProfessionalService", "Organization"],
    "@id": ORGANIZATION_ID,
    name: BRAND,
    alternateName: "Trigge",
    url: SITE_URL,
    email: CONTACT.email,
    description:
      "Trigge Solutions is a software development company building custom websites, web applications, e-commerce platforms and internal tools for businesses across the United States and Canada.",
    slogan: "Build · Innovate · Grow",
    logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
    image: `${SITE_URL}${OG_IMAGE}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Croydon",
      addressRegion: "Pennsylvania",
      addressCountry: "US",
    },
    areaServed: SERVED,
    knowsAbout: TECH,
    serviceType: SERVICES.map((service) => service.title),
    sameAs: Object.values(SOCIAL_LINKS).filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: CONTACT.email,
      areaServed: ["US", "CA"],
      availableLanguage: ["English"],
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Software development services",
      itemListElement: SERVICES.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
          serviceType: service.title,
          url: url(`/services/${service.slug}`),
          provider: { "@id": ORGANIZATION_ID },
          areaServed: SERVED,
        },
      })),
    },
  };
}

function website() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: BRAND,
    description:
      "Custom software, websites and web applications for businesses in the U.S. and Canada.",
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en",
  };
}

function breadcrumbs(path: string, title: string) {
  const trail = [{ name: "Home", item: SITE_URL }];
  if (path.startsWith("/services/")) trail.push({ name: "Services", item: url("/services") });
  if (path !== "/") trail.push({ name: title, item: url(path) });
  return {
    "@type": "BreadcrumbList",
    "@id": `${url(path)}#breadcrumb`,
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

/** The questions people actually ask, in the form Google and AI tools read. */
function faqPage(path: string) {
  return {
    "@type": "FAQPage",
    "@id": `${url(path)}#faq`,
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/**
 * The JSON-LD graph for one page. `faq` adds the FAQ block, which belongs only
 * on pages that actually show those questions.
 */
export function pageSchema({
  path,
  title,
  description,
  faq = false,
  service,
}: {
  path: string;
  title: string;
  description: string;
  faq?: boolean;
  service?: (typeof SERVICES)[number];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization(),
      website(),
      {
        "@type": "WebPage",
        "@id": `${url(path)}#webpage`,
        url: url(path),
        name: title.includes(BRAND) ? title : `${title} | ${BRAND}`,
        description,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORGANIZATION_ID },
        inLanguage: "en",
        breadcrumb: { "@id": `${url(path)}#breadcrumb` },
      },
      breadcrumbs(path, title),
      ...(service ? [{
        "@type": "Service",
        "@id": `${url(path)}#service`,
        name: title,
        description,
        url: url(path),
        serviceType: service.title,
        provider: { "@id": ORGANIZATION_ID },
        areaServed: SERVED,
        mainEntityOfPage: { "@id": `${url(path)}#webpage` },
      }] : []),
      ...(faq ? [faqPage(path)] : []),
    ],
  };
}
