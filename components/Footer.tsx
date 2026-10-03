import Link from "next/link";
import {
  Mail,
  MapPin,
  Linkedin,
  Github,
  Instagram,
  ArrowUpRight,
} from "lucide-react";
import Logo from "./Logo";
import { CONTACT, PORTFOLIO_ENABLED, SERVICES, SOCIAL_LINKS } from "@/lib/data";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
].filter((link) => PORTFOLIO_ENABLED || link.href !== "/portfolio");

const SOCIALS = [
  { Icon: Linkedin, label: "LinkedIn", href: SOCIAL_LINKS.linkedin },
  { Icon: Github, label: "GitHub", href: SOCIAL_LINKS.github },
  { Icon: Instagram, label: "Instagram", href: SOCIAL_LINKS.instagram },
].filter((social) => social.href);

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy-950 pt-16 text-white">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <Logo />
            <p className="mt-4 max-w-[240px] text-sm leading-relaxed text-white/50">
              Custom websites and web applications. Based in Pennsylvania,
              serving businesses across the United States.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-accent/50 hover:bg-white/10 hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Our Services</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              {SERVICES.map((service) => (
                <li key={service.key}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="transition-colors hover:text-white"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <Mail size={16} className="shrink-0" /> {CONTACT.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={16} className="shrink-0" />
                <address className="not-italic">{CONTACT.location}</address>
              </li>
            </ul>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:gap-2.5"
            >
              Start a project <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Trigge Solutions. All rights reserved.
          </p>
          <p className="tracking-wide">Build &middot; Innovate &middot; Grow</p>
        </div>
      </div>
    </footer>
  );
}
