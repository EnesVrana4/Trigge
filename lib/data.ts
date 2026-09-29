export type ServiceKey =
  | "web"
  | "apps"
  | "ecommerce"
  | "design"
  | "integrations"
  | "support";

export const SERVICES: {
  key: ServiceKey;
  title: string;
  short: string;
  description: string;
  features: string[];
}[] = [
  {
    key: "web",
    title: "Web Development",
    short: "Fast, secure and scalable websites.",
    description:
      "Marketing sites and landing pages built on modern frameworks, optimized for speed, search engines and conversion.",
    features: [
      "Next.js & React",
      "SEO-ready structure",
      "Core Web Vitals optimized",
      "CMS integration",
    ],
  },
  {
    key: "apps",
    title: "Web Applications",
    short: "Custom platforms built around your workflow.",
    description:
      "Dashboards, internal tools and customer portals designed around the way your business actually works.",
    features: [
      "Role-based access",
      "Real-time data",
      "Reporting & analytics",
      "Cloud deployment",
    ],
  },
  {
    key: "ecommerce",
    title: "E-Commerce",
    short: "Online stores that convert visitors into buyers.",
    description:
      "From product catalog to checkout and payments, storefronts that are quick to browse and simple to manage.",
    features: [
      "Secure payments",
      "Inventory management",
      "Order automation",
      "Multi-language support",
    ],
  },
  {
    key: "design",
    title: "UI/UX Design",
    short: "Interfaces people understand instantly.",
    description:
      "Research, wireframes and polished interface design that keeps your product clear, consistent and on-brand.",
    features: [
      "Design systems",
      "Prototypes",
      "Accessibility (WCAG)",
      "Mobile-first layouts",
    ],
  },
  {
    key: "integrations",
    title: "Integrations & APIs",
    short: "Connect the tools you already use.",
    description:
      "We connect your website or platform with ERP, CRM, payment and logistics systems so data flows without manual work.",
    features: [
      "REST & GraphQL APIs",
      "ERP / CRM connectors",
      "Payment gateways",
      "Automated workflows",
    ],
  },
  {
    key: "support",
    title: "Maintenance & Support",
    short: "We stay with you after launch.",
    description:
      "Monitoring, updates, security patches and continuous improvements so your platform keeps running at full speed.",
    features: [
      "Uptime monitoring",
      "Security updates",
      "Performance tuning",
      "Priority response",
    ],
  },
];

export type ProjectVisualKey =
  | "ecommerce"
  | "dashboard"
  | "learning"
  | "booking"
  | "realestate"
  | "logistics";

export const PROJECT_CATEGORIES = [
  "All",
  "Web Application",
  "E-Commerce",
  "Website",
] as const;

export const PROJECTS: {
  title: string;
  category: (typeof PROJECT_CATEGORIES)[number];
  description: string;
  tags: string[];
  visual: ProjectVisualKey;
  /** Preview image in /public. Projects without one fall back to `visual`. */
  image?: string;
}[] = [
  {
    title: "E-Commerce Platform",
    category: "E-Commerce",
    description:
      "A complete storefront with catalog, cart, secure checkout and an admin panel for orders and stock.",
    tags: ["Next.js", "Stripe", "PostgreSQL"],
    visual: "ecommerce",
    image: "/images/ecommerce-platform.png",
  },
  {
    title: "CRM Dashboard",
    category: "Web Application",
    description:
      "Sales pipeline, customer records and live reporting in one internal tool for a distributed team.",
    tags: ["React", "Node.js", "Charts"],
    visual: "dashboard",
    image: "/images/crm-dashboard.png",
  },
  {
    title: "Learning Platform",
    category: "Web Application",
    description:
      "Courses, lessons and progress tracking with separate areas for students and instructors.",
    tags: ["Next.js", "Prisma", "Auth"],
    visual: "learning",
    image: "/images/learning-platform.png",
  },
  {
    title: "Booking System",
    category: "Web Application",
    description:
      "Appointment scheduling with calendar sync, automated reminders and online payments.",
    tags: ["React", "Calendar API", "Payments"],
    visual: "booking",
  },
  {
    title: "Real Estate Portal",
    category: "Website",
    description:
      "Property listings with map search, saved favorites and an agent dashboard for publishing.",
    tags: ["Next.js", "Maps", "CMS"],
    visual: "realestate",
  },
  {
    title: "Logistics Tracker",
    category: "Web Application",
    description:
      "Shipment tracking with live status updates, route history and customer notifications.",
    tags: ["React", "WebSockets", "REST API"],
    visual: "logistics",
  },
];

export const PROCESS = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We start with a free consultation to understand your goals, users and constraints, then agree on scope and timeline.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Wireframes and interface design, reviewed with you before a single line of production code is written.",
  },
  {
    step: "03",
    title: "Development",
    description:
      "Built in short iterations with a staging link you can open at any moment to follow real progress.",
  },
  {
    step: "04",
    title: "Launch & Support",
    description:
      "Testing, deployment and handover, followed by monitoring, updates and continuous improvements.",
  },
];

export const WHY_US = [
  {
    title: "Direct communication",
    description:
      "You talk to the people building your product, no account managers in between, no lost context.",
  },
  {
    title: "Fixed scope, clear pricing",
    description:
      "Every project starts with an agreed scope and a written quote, so there are no surprises at the end.",
  },
  {
    title: "Built to last",
    description:
      "Clean, documented code on modern frameworks, easy to extend later, by us or by your own team.",
  },
  {
    title: "Performance first",
    description:
      "Fast loading, responsive on every device and optimized for search engines from day one.",
  },
];

export const VALUES = [
  {
    title: "Clarity",
    description:
      "Plain language, honest timelines and a shared view of progress at every stage of the project.",
  },
  {
    title: "Craft",
    description:
      "We care about the details, the code, the interface and the experience your customers get.",
  },
  {
    title: "Partnership",
    description:
      "We think long term. Most of our work comes from clients who come back with the next idea.",
  },
];

type Stat = { label: string } & (
  | { text: string }
  | { value: number; prefix?: string; suffix?: string }
);

/**
 * Promises the site already makes in the FAQ, rather than track-record counts
 * a young company can't back up yet. A `value` counts up; `text` shows as is.
 */
export const STATS: Stat[] = [
  { text: "Free", label: "First consultation" },
  { value: 0, prefix: "$", label: "Hidden costs, fixed written quote" },
  { text: "3–5", label: "Weeks for a typical website" },
  { value: 100, suffix: "%", label: "Code ownership on delivery" },
];

export const TECH = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Tailwind CSS",
  "PostgreSQL",
  "Prisma",
  "AWS",
  "Vercel",
  "Docker",
  "Stripe",
  "Figma",
];

export const INDUSTRIES = [
  "E-Commerce",
  "Real Estate",
  "Healthcare",
  "Manufacturing",
  "Education",
  "Finance",
];

export const FAQS = [
  {
    question: "How long does a typical project take?",
    answer:
      "A marketing website usually takes 3–5 weeks. A custom web application typically runs 8–16 weeks depending on scope. After the discovery call we give you a written timeline with milestones.",
  },
  {
    question: "How much does a project cost?",
    answer:
      "Every project is quoted individually based on scope. After a free consultation you receive a fixed written quote with a clear breakdown, no hidden costs added later.",
  },
  {
    question: "Do you work with clients outside Pennsylvania and in Canada?",
    answer:
      "Yes. We are based in Croydon, PA, just outside Philadelphia, and work with clients in all 50 states and across Canada, in every time zone. Weekly demos, a shared project board and a live staging link keep remote projects moving exactly as they would locally.",
  },
  {
    question: "What technologies do you build with?",
    answer:
      "We build on Next.js, React, TypeScript and Node.js, with PostgreSQL and Prisma for data, Tailwind CSS for interfaces and AWS or Vercel for hosting. Payments run through Stripe, and design work happens in Figma.",
  },
  {
    question: "Who owns the code once the project is finished?",
    answer:
      "You do. On final delivery you receive full ownership of the source code, the repository and all related accounts and documentation.",
  },
  {
    question: "Can you take over an existing project?",
    answer:
      "Absolutely. We regularly audit, fix and extend existing codebases. We start with a technical review and tell you honestly what is worth keeping and what should be rebuilt.",
  },
  {
    question: "What happens after launch?",
    answer:
      "We offer maintenance plans covering monitoring, security updates, backups and ongoing improvements. You can also request support on demand without a fixed plan.",
  },
];

/**
 * The portfolio is not ready to show yet, so it is hidden site-wide: the nav
 * entry, the footer link, every "see our work" call to action and the
 * /portfolio route itself all key off this one flag.
 *
 * Set it to true when there is real work to publish — nothing else to change.
 */
export const PORTFOLIO_ENABLED = false;

/**
 * Social profiles. An empty string means the account does not exist yet — the
 * footer skips those rather than rendering an icon that goes nowhere.
 */
export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/trigge-solutions-7a1b1b438/",
  github: "",
  instagram: "https://www.instagram.com/trigge_solutions/",
};

export const CONTACT = {
  email: "trigge.info@gmail.com",
  location: "Pennsylvania, USA",
};
