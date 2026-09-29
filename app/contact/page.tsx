import type { Metadata } from "next";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import StructuredData from "@/components/StructuredData";
import { pageMeta } from "@/lib/seo";
import { CONTACT } from "@/lib/data";

const PAGE = {
  path: "/contact",
  title: "Contact Us — Free Project Consultation",
  description:
    "Tell us about your project and get a free consultation with a fixed written quote. We reply within one business day, anywhere in the U.S. or Canada.",
};

export const metadata: Metadata = pageMeta({
  ...PAGE,
  keywords: [
    "free software development consultation",
    "hire web developers",
    "website development quote",
    "contact software company USA Canada",
  ],
});

const DETAILS = [
  {
    Icon: Mail,
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
  { Icon: MapPin, label: "Based in", value: CONTACT.location },
  {
    Icon: MessageSquare,
    label: "Response time",
    value: "Within one business day",
  },
];

export default function ContactPage() {
  return (
    <>
      <StructuredData {...PAGE} />
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your project"
        description="Tell us what you want to build. You'll get an honest opinion, a suggested approach and a clear quote, with no obligation to continue."
        background="/background/contacts-backgrounds.webp"
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className="text-xl font-semibold text-navy-900">
              Get in touch directly
            </h2>
            <ul className="mt-6 space-y-5">
              {DETAILS.map(({ Icon, label, value, href }) => (
                <li key={label} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f2f5fa] text-navy-900">
                    <Icon size={18} strokeWidth={1.7} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-medium text-navy-900 transition-colors hover:text-accent-dark"
                      >
                        {value as string}
                      </a>
                    ) : Array.isArray(value) ? (
                      <address className="text-sm font-medium not-italic leading-relaxed text-navy-900">
                        {value.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </address>
                    ) : (
                      <p className="text-sm font-medium text-navy-900">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
