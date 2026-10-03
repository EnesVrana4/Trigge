import type { ServiceKey } from "./data";

type ServiceContent = {
  title: string;
  description: string;
  introduction: string;
  fit: string;
  deliverables: { title: string; text: string }[];
  process: string[];
  budget: string;
  preparation: string;
  faqs: { question: string; answer: string }[];
  related: ServiceKey[];
};

// These are service capabilities and example use cases, not client case studies.
export const SERVICE_CONTENT: Record<ServiceKey, ServiceContent> = {
  web: {
    title: "Custom Website Development",
    description: "Custom website development for U.S. businesses. Responsive design, CMS integration and a clear launch process from our Pennsylvania team.",
    introduction: "Your website should help someone understand your business and take the next step. We design and develop business websites with clear service information, responsive layouts and straightforward ways to inquire. From our base in Croydon, Pennsylvania, near Philadelphia, we work with businesses across the United States.",
    fit: "A custom website is a good fit when a template makes your services hard to explain, your team struggles to update pages, or an existing site no longer reflects your business. For a simple requirement, we can also discuss whether improving your current site would be more practical than replacing it.",
    deliverables: [
      { title: "Business websites and landing pages", text: "Pages organized around your services, customers and next steps, with mobile layouts, clear navigation and inquiry forms. We agree on the page structure before design begins." },
      { title: "Content you can maintain", text: "Where needed, a content management system lets your team update agreed content such as services, articles and team information. We plan editing permissions and explain the publishing workflow at handover." },
      { title: "A considered launch", text: "Responsive checks, image optimization, page titles, canonical URLs and a sitemap form part of the launch scope. We also plan redirects when replacing existing pages so useful old links have a destination." },
    ],
    process: ["Discuss your customers, services and the action each page should support.", "Agree on a sitemap and review the design before development.", "Build on a staging site, review content together and test key journeys.", "Connect the production domain, check forms and hand over the code and accounts."],
    budget: "A typical marketing website takes around 3–5 weeks once scope and required content are agreed. Page count, content preparation, CMS requirements and integrations affect the schedule and price. After a free consultation, we provide a written quote for the agreed scope; hosting and third-party costs are identified separately.",
    preparation: "Bring your current website, a short description of your customers, the services you want to promote and any brand assets you already have. It is fine if your copy or page list is still a draft—we can identify what is needed together.",
    faqs: [
      { question: "Can you redesign an existing business website?", answer: "Yes. We first review the existing pages, content and functionality. When URLs change, we plan redirects and check the new navigation rather than discarding useful pages without a replacement." },
      { question: "Will my website appear on Google?", answer: "We prepare pages to be accessible to search engines and provide appropriate metadata and a sitemap. Google decides whether to index and rank pages; neither launch nor sitemap submission guarantees a position in search results." },
      { question: "Can my team update the website?", answer: "Yes, if a CMS is included in the agreed scope. We define the editable areas with you and provide a handover so routine content changes do not require a developer." },
    ], related: ["design", "integrations", "support"],
  },
  apps: {
    title: "Custom Web Application Development",
    description: "Custom web applications, client portals and internal tools for U.S. businesses. Plan, build and launch with our Pennsylvania development team.",
    introduction: "When spreadsheets, email threads and disconnected tools make everyday work harder, a web application can bring the right information into one place. We build browser-based software around your workflow, from customer portals to internal dashboards, with clear roles and a staged delivery plan.",
    fit: "Custom development makes sense when an important workflow cannot be handled well by existing software. We start by understanding who uses the system, what they need to do and where the current process breaks down. If an off-the-shelf product can solve the problem adequately, that belongs in the discussion too.",
    deliverables: [
      { title: "Client and customer portals", text: "Secure account areas for documents, requests, project updates or account information. We define what each user can see and do, then design the customer and administrator journeys together." },
      { title: "Internal tools and dashboards", text: "Operational software for tasks such as managing records, approvals and reporting. We agree on the source of each data set and the actions a dashboard should support, rather than adding charts without a purpose." },
      { title: "A foundation for ongoing development", text: "Application code, a database structure, role-based access and deployment configuration suited to the agreed scope. Integrations, data migration and reporting are planned explicitly, with documentation for future maintenance." },
    ],
    process: ["Map the workflow, user roles and minimum useful first release.", "Review screens and data requirements before committing to implementation.", "Build in milestones with a staging link and feedback on working features.", "Test permissions and core workflows, prepare deployment and hand over the application."],
    budget: "A custom web application typically takes 8–16 weeks depending on scope. User roles, integrations, migration and business rules affect both cost and delivery time. We quote an agreed first release and identify optional later phases so you can choose what matters most.",
    preparation: "Bring a sample of your current workflow, the tools you use, who needs access and the tasks that consume the most time. Use sample or anonymized records for initial discussions rather than sharing sensitive customer data.",
    faqs: [
      { question: "What is the difference between a website and a web application?", answer: "A business website mainly presents information and helps people inquire. A web application lets users perform tasks, such as managing records, approving requests or accessing a private portal. Some projects combine both." },
      { question: "Can you replace a spreadsheet-based workflow?", answer: "Yes. We can review the spreadsheet structure and business rules, then scope a database, screens and reports. Importing existing records is planned and tested as its own part of the project." },
      { question: "Who owns the application after delivery?", answer: "You receive ownership of the custom source code, repository and project documentation on final delivery. Third-party services and libraries remain subject to their own licenses and account terms." },
    ], related: ["integrations", "design", "support"],
  },
  ecommerce: {
    title: "Ecommerce Website Development",
    description: "Custom ecommerce development for U.S. businesses, from product catalogs and checkout to payments, inventory connections and ongoing support.",
    introduction: "An online store needs to work for both the customer buying a product and the team fulfilling the order. We build ecommerce websites around your catalog, checkout and operational needs, with responsive product pages and a clear plan for payments and order handling.",
    fit: "This service suits businesses whose products, checkout requirements or existing systems need more flexibility than their current storefront provides. Before recommending a custom build, we review your catalog, current platform and fulfillment process to establish which parts actually need custom development.",
    deliverables: [
      { title: "Catalog and shopping experience", text: "Product pages, browsing, cart and mobile layouts shaped around your catalog. Product variants, filtering and search are scoped according to the way customers select your products." },
      { title: "Checkout and payments", text: "Payment-provider integration, order confirmation and clear handling of successful and failed payments. Provider accounts, supported payment methods and business requirements are confirmed before implementation." },
      { title: "Store operations", text: "Where included in scope, inventory connections, order administration and notifications help your team manage the store. Shipping and tax-service requirements are reviewed with you and the relevant providers." },
    ],
    process: ["Review your products, current store and order fulfillment workflow.", "Design browsing, product and checkout journeys for mobile and desktop.", "Implement the storefront and agreed payment and inventory connections.", "Test checkout in the provider's test environment, verify order handling and prepare launch."],
    budget: "Catalog complexity, custom checkout rules, integrations and product migration are the main cost drivers. We provide a scoped quote and schedule after discovery. Payment-processing, platform and hosting charges are separate ongoing costs to consider.",
    preparation: "Bring a sample product catalog, details of your current platform, preferred payment provider and an outline of fulfillment. If you are moving from an existing store, include which products and customer or order records need to move.",
    faqs: [
      { question: "Can you connect a store to an inventory system?", answer: "We can assess the system's API or supported exports and scope a connection. Sync direction, update timing and handling of failed updates depend on the capabilities of the systems involved." },
      { question: "Will checkout work on phones?", answer: "Mobile browsing and checkout are part of the design and testing scope. We review product selection, form fields and payment feedback across agreed screen sizes." },
      { question: "Can you improve an existing store instead of rebuilding it?", answer: "Yes. We can review the current store and recommend focused changes when they are a better fit. Access, platform constraints and third-party extensions affect what can be changed." },
    ], related: ["integrations", "design", "support"],
  },
  design: {
    title: "UI/UX Design for Websites & Web Apps",
    description: "UI/UX design for business websites and web applications. User flows, wireframes, prototypes and reusable interfaces from our Pennsylvania team.",
    introduction: "Good interface design helps people find information and complete tasks without unnecessary friction. We design websites and web applications around the people using them, translating business requirements into user flows, wireframes and clear visual interfaces.",
    fit: "Design work is useful before a new build or when an existing product is confusing to navigate. It can help you resolve complicated forms, inconsistent screens or unclear next steps before investing in development. The scope can cover a whole product or a focused workflow.",
    deliverables: [
      { title: "User flows and wireframes", text: "A map of the key tasks and the screens needed to complete them. Early layouts focus on information and behavior so important decisions are made before visual polish." },
      { title: "Responsive interface design", text: "Detailed layouts for agreed desktop and mobile journeys, including form states, navigation and feedback. We consider readability, contrast and keyboard interaction when defining the interface." },
      { title: "Prototypes and reusable patterns", text: "Interactive prototypes for review, plus agreed components and design guidelines. Handover explains how screens should behave so developers have more than a set of static images." },
    ],
    process: ["Discuss the audience, main tasks and constraints of the product.", "Review user flows and wireframes with your team.", "Develop visual designs and a prototype for the agreed journeys.", "Document components, interaction states and implementation notes for handover."],
    budget: "The number of distinct screens, complexity of workflows, research needs and review rounds determine scope. We agree on deliverables and a written quote before starting. Development can follow as a separate phase or be included in a combined project.",
    preparation: "Bring your brand assets, any existing screens, feedback from users and the tasks you want to make easier. If your team has existing design standards or accessibility requirements, include those at the start.",
    faqs: [
      { question: "Can you design a product that another team will build?", answer: "Yes. We can deliver design files, prototypes and implementation notes for your development team. We agree on the handover format and required level of detail during discovery." },
      { question: "Can you work with our existing brand?", answer: "Yes. Existing colors, typography and brand guidelines can guide the interface. We also flag cases where readability or contrast needs attention." },
      { question: "Does design include accessibility certification?", answer: "No certification is implied. We consider accessible interface patterns, and can scope specific WCAG review requirements. Compliance depends on the final implementation and the agreed testing scope." },
    ], related: ["web", "apps", "ecommerce"],
  },
  integrations: {
    title: "API Integration Services",
    description: "API integration services connecting websites, CRMs, payment providers and business tools. Custom workflows and data sync for U.S. businesses.",
    introduction: "When your systems do not share information, your team ends up copying records and checking for mistakes. We connect websites and business applications through supported APIs, with clear rules for what moves, when it moves and what happens when something fails.",
    fit: "An integration can help when leads need to reach your CRM, payment events need to update an account, or orders need to move into an operational system. We first verify the available APIs, permissions and account requirements before promising a connection.",
    deliverables: [
      { title: "CRM and business system connections", text: "Connections between forms, customer records and operational tools. We define field mapping, duplicate handling and which system is responsible for each record before data starts moving." },
      { title: "Payment and event workflows", text: "Webhook handling and API calls that react to business events such as payments or new orders. Verification, retries and protection against repeated events are planned as part of the workflow." },
      { title: "Custom APIs and documentation", text: "Where your product needs its own interface, we can scope REST or GraphQL endpoints, access controls and documentation. Logging and error handling help future maintainers understand how the connection behaves." },
    ],
    process: ["Identify systems, API access, account restrictions and the desired data flow.", "Agree on field mapping, update rules and failure handling.", "Build and test against sample data or provider test environments.", "Deploy with agreed monitoring and document the connection and its dependencies."],
    budget: "A single connection differs substantially from a two-way sync across several systems. Cost depends on API quality, data rules, authentication, migration and monitoring requirements. We provide a written scope after reviewing feasibility; provider subscriptions may be required separately.",
    preparation: "Bring the names of the systems you want to connect and an example of the manual process. API documentation and account-plan information are useful. Access credentials should be shared only through an agreed secure method when implementation requires them.",
    faqs: [
      { question: "Can you connect any two platforms?", answer: "Not always. We need supported access through an API, webhook or another permitted mechanism. Restrictions, subscription levels and provider approval can limit what is possible; we check these before agreeing on delivery." },
      { question: "What happens if an external API changes?", answer: "An integration may need updates when a provider changes its interface or authentication. We document dependencies and can scope monitoring and maintenance so failures can be investigated." },
      { question: "Can you stop duplicate records or repeated payments from triggering actions twice?", answer: "We design duplicate detection and event handling around the systems involved. Tests cover repeated events and failed requests, with the specific guarantees agreed as part of the integration scope." },
    ], related: ["apps", "ecommerce", "support"],
  },
  support: {
    title: "Website & Web Application Maintenance",
    description: "Website and web application maintenance for U.S. businesses. Code reviews, updates, bug fixes and performance improvements for React and Next.js projects.",
    introduction: "A website or application needs attention after launch as dependencies change and the business evolves. We offer maintenance and support for websites and web applications, with an agreed scope for updates, fixes and ongoing improvements.",
    fit: "Support can suit teams without an in-house developer or businesses taking over an existing codebase. We begin with a technical review of the repository, hosting and dependencies so the support plan reflects the actual condition of the project.",
    deliverables: [
      { title: "Codebase review and takeover", text: "A review of the application structure, build process and known issues. We identify access requirements and technical constraints before recommending a maintenance plan or a larger repair project." },
      { title: "Updates and bug fixes", text: "Agreed dependency updates, security patches and fixes with testing before release. Larger changes or upgrades that require significant rework are scoped separately instead of being hidden inside routine maintenance." },
      { title: "Monitoring and performance work", text: "Where included, uptime monitoring, backup checks and investigation of slow pages or failed workflows. We agree on what is monitored, how issues are reported and which response windows apply." },
    ],
    process: ["Review the repository, hosting, dependencies and current issues.", "Agree on recurring tasks, response expectations and out-of-scope work.", "Test fixes and updates in an appropriate staging environment.", "Release approved changes and document work and outstanding recommendations."],
    budget: "Maintenance can be an ongoing plan or a separately scoped request. Pricing depends on the project's condition, responsibilities and required response coverage. Around-the-clock support is not assumed; hours and response expectations are agreed in writing.",
    preparation: "Bring a description of the issue, your technology stack, hosting provider and any existing documentation. For a takeover, confirm that you can provide authorized repository and hosting access when the review begins.",
    faqs: [
      { question: "Can you maintain a site built by someone else?", answer: "Yes, subject to an initial review. We check whether the codebase and hosting setup are suitable for ongoing maintenance and explain any prerequisite repairs." },
      { question: "Do you support React and Next.js applications?", answer: "Yes. These are part of our development stack. The framework version, dependencies and current architecture determine the work needed for updates or fixes." },
      { question: "Are new features included in maintenance?", answer: "Only when included in the agreed scope. Larger features, redesigns and migrations are quoted separately so maintenance responsibilities remain clear." },
    ], related: ["apps", "web", "integrations"],
  },
};
