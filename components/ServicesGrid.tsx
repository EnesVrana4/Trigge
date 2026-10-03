"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  Code2,
  LayoutDashboard,
  ShoppingCart,
  Palette,
  Plug,
  LifeBuoy,
  ArrowRight,
  Check,
} from "lucide-react";
import { SERVICES, type ServiceKey } from "@/lib/data";
import ServiceScene from "./ServiceScenes";

const ICONS: Record<ServiceKey, typeof Code2> = {
  web: Code2,
  apps: LayoutDashboard,
  ecommerce: ShoppingCart,
  design: Palette,
  integrations: Plug,
  support: LifeBuoy,
};

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

type Service = (typeof SERVICES)[number];

/** Puts the fill's centre where the pointer crossed the card's edge. */
function placeFill(event: PointerEvent<HTMLElement>) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--fx", `${event.clientX - rect.left}px`);
  card.style.setProperty("--fy", `${event.clientY - rect.top}px`);
  // Twice the diagonal, so the circle covers the card from any starting point.
  card.style.setProperty("--fd", `${Math.hypot(rect.width, rect.height) * 2}px`);
}

function ServiceCard({
  service,
  index,
  detailed,
}: {
  service: Service;
  index: number;
  detailed: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(true);
  const [motion, setMotion] = useState(true);
  const [filled, setFilled] = useState(false);
  const [centered, setCentered] = useState(false);
  const Icon = ICONS[service.key];
  const active = motion && (filled || centered);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotion(false);
      setSeen(true);
      return;
    }

    if (el.getBoundingClientRect().top >= window.innerHeight) setSeen(false);

    const reveal = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          reveal.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" },
    );
    reveal.observe(el);

    // Without hover, the scene plays while the card crosses mid-screen.
    let middle: IntersectionObserver | undefined;
    if (!window.matchMedia("(hover: hover)").matches) {
      middle = new IntersectionObserver(
        ([entry]) => setCentered(entry.isIntersecting),
        { rootMargin: "-45% 0px -45% 0px" },
      );
      middle.observe(el);
    }

    return () => {
      reveal.disconnect();
      middle?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
      className={`h-full transition-[opacity,transform] duration-700 ${EASE} [transform-origin:50%_100%] ${
        seen
          ? "opacity-100 [transform:perspective(1200px)_rotateX(0deg)_translateY(0)]"
          : "opacity-0 [transform:perspective(1200px)_rotateX(32deg)_translateY(40px)]"
      }`}
    >
      <article
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          placeFill(event);
          setFilled(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "mouse") return;
          placeFill(event);
          setFilled(false);
        }}
        className={`relative h-full overflow-hidden rounded-2xl border bg-white p-7 transition-[transform,box-shadow,border-color] duration-500 ${EASE} ${
          filled
            ? "-translate-y-1 border-navy-950 shadow-2xl shadow-navy-950/20"
            : "border-slate-100 shadow-sm"
        }`}
      >
        {/* Navy fill that grows from where the pointer came in and shrinks
            back out where it left. */}
        <span
          aria-hidden
          className={`grid-pattern pointer-events-none absolute left-[var(--fx,50%)] top-[var(--fy,50%)] h-[var(--fd,0px)] w-[var(--fd,0px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy-950 transition-transform duration-700 ${EASE} ${
            filled ? "scale-100" : "scale-0"
          }`}
        />
        <span
          aria-hidden
          className={`pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-accent/20 blur-2xl transition-opacity duration-700 ${
            filled ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`pointer-events-none absolute right-5 top-5 transition-colors duration-500 ${
            filled ? "text-accent" : active ? "text-accent-dark" : "text-slate-300"
          }`}
        >
          <ServiceScene name={service.key} active={active} />
        </div>

        <div
          className={`relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            filled
              ? "-rotate-6 scale-110 bg-accent text-navy-950"
              : "bg-navy-950 text-white"
          }`}
        >
          <Icon size={22} strokeWidth={1.7} />
        </div>

        <h3
          className={`relative mt-5 text-lg font-semibold transition-colors duration-500 ${
            filled ? "text-white" : "text-navy-900"
          }`}
        >
          {service.title}
        </h3>
        <p
          className={`relative mt-2 text-sm leading-relaxed transition-colors duration-500 ${
            filled ? "text-white/60" : "text-slate-500"
          }`}
        >
          {detailed ? service.description : service.short}
        </p>

        {detailed && (
          <ul
            className={`relative mt-5 space-y-2.5 border-t pt-5 transition-colors duration-500 ${
              filled ? "border-white/10" : "border-slate-100"
            }`}
          >
            {service.features.map((feature) => (
              <li
                key={feature}
                className={`flex items-center gap-2.5 text-sm transition-colors duration-500 ${
                  filled ? "text-white/75" : "text-slate-600"
                }`}
              >
                <Check
                  size={15}
                  className={`shrink-0 ${filled ? "text-accent" : "text-accent-dark"}`}
                />
                {feature}
              </li>
            ))}
          </ul>
        )}

        {(
          <Link
            href={`/services/${service.slug}`}
            className={`relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 ${
              filled ? "gap-3 text-accent" : "text-navy-900"
            }`}
          >
            Explore {service.title.toLowerCase()} <ArrowRight size={15} />
          </Link>
        )}
      </article>
    </div>
  );
}

export default function ServicesGrid({
  detailed = false,
  limit,
}: {
  detailed?: boolean;
  limit?: number;
}) {
  const services = limit ? SERVICES.slice(0, limit) : SERVICES;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, i) => (
        <ServiceCard
          key={service.key}
          service={service}
          index={i}
          detailed={detailed}
        />
      ))}
    </div>
  );
}
