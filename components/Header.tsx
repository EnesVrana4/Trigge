"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { PORTFOLIO_ENABLED } from "@/lib/data";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
].filter((link) => PORTFOLIO_ENABLED || link.href !== "/portfolio");

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        scrolled
          ? "bg-navy-950/85 backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container-page flex items-center justify-between py-4 text-white">
        <Link href="/" aria-label="Trigge Solutions, home" data-intro-logo>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link, i) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                data-intro-nav
                style={{ "--i": i } as React.CSSProperties}
                className={`relative pb-1 text-sm transition-colors ${
                  active ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-accent transition-all duration-300 ${
                    active ? "w-5" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          data-intro-nav
          style={{ "--i": NAV_LINKS.length } as React.CSSProperties}
          className="hidden lg:inline-flex btn-outline !py-2.5"
        >
          Get in Touch <ArrowRight size={16} />
        </Link>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          data-intro-nav
          className="rounded-lg p-1 text-white transition hover:bg-white/10 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-x-0 top-[68px] z-40 origin-top border-b border-white/10 bg-navy-950/95 backdrop-blur-lg transition-all duration-300 lg:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <nav className="container-page flex flex-col gap-1 py-6">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-3 text-base transition ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/contact" className="btn-primary mt-3">
            Get in Touch <ArrowRight size={16} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
