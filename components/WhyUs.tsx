"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowRight } from "lucide-react";
import { WHY_US } from "@/lib/data";
import Reveal from "./Reveal";
import { ChatIcon, ScopeIcon, LayersIcon, GaugeIcon } from "./AnimatedIcons";

const ICONS = [ChatIcon, ScopeIcon, LayersIcon, GaugeIcon];
const HEADING = ["A", "partner,", "not", "just", "a", "vendor"];
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

// How long the spotlight stays on each card.
const CARD_TIME = 5000;

/**
 * The spotlight moves from card to card on its own (5s each); hovering a card
 * takes over. The pointer also lights up the background grid and the card
 * borders around it.
 */
export default function WhyUs() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [motion, setMotion] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotion(false);
      setSeen(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const running = motion && inView && !hovering;

  // Each change of card, or return from a hover, starts a fresh 5s.
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(
      () => setActive((a) => (a + 1) % WHY_US.length),
      CARD_TIME,
    );
    return () => window.clearTimeout(id);
  }, [active, running]);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    const section = event.currentTarget;
    const rect = section.getBoundingClientRect();
    section.style.setProperty("--sx", `${event.clientX - rect.left}px`);
    section.style.setProperty("--sy", `${event.clientY - rect.top}px`);

    // Every card gets the pointer position in its own coordinates, so the
    // glow spills across the borders of neighbouring cards.
    cardRefs.current.forEach((card) => {
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - r.left}px`);
      card.style.setProperty("--my", `${event.clientY - r.top}px`);
    });
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="group/why relative overflow-hidden bg-navy-950 py-20 lg:py-28"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="grid-pattern-accent absolute inset-0 opacity-0 transition-opacity duration-500 [mask-image:radial-gradient(320px_circle_at_var(--sx,50%)_var(--sy,50%),#000,transparent)] group-hover/why:opacity-100" />
        <div className="absolute -right-32 top-1/3 h-[420px] w-[420px] animate-drift rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[360px] w-[360px] animate-drift rounded-full bg-accent-dark/10 blur-3xl [animation-delay:-9s]" />
      </div>

      <div className="container-page relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p
            className={`eyebrow mb-3 transition-opacity duration-700 ${
              seen ? "opacity-100" : "opacity-0"
            }`}
          >
            Why Trigge
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {HEADING.map((word, i) => (
              <Fragment key={i}>
                <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <span
                    style={{ transitionDelay: `${i * 70}ms` }}
                    className={`inline-block transition-transform duration-700 ${EASE} ${
                      seen ? "translate-y-0" : "translate-y-full"
                    } ${i === 1 ? "gradient-text" : ""}`}
                  >
                    {word}
                  </span>
                </span>
                {i < HEADING.length - 1 && " "}
              </Fragment>
            ))}
          </h2>
          <div
            style={{ transitionDelay: "450ms" }}
            className={`transition-all duration-700 ${EASE} ${
              seen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <p className="mt-4 max-w-md leading-relaxed text-white/60">
              We keep the process transparent and the code clean, so the
              platform we deliver keeps serving your business long after
              launch.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all duration-300 hover:gap-3"
            >
              More about us <ArrowRight size={16} />
            </Link>

          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {WHY_US.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            const on = i === active;
            return (
              <Reveal key={item.title} delay={i * 90}>
                <div
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "mouse") return;
                    setHovering(true);
                    if (!on) setActive(i);
                  }}
                  onPointerLeave={() => setHovering(false)}
                  className={`relative h-full rounded-2xl border p-6 transition-[background-color,border-color,box-shadow] duration-500 ${
                    on
                      ? "border-white/15 bg-white/[0.06] shadow-[0_0_40px_-12px_rgba(127,176,240,0.35)]"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div
                    aria-hidden
                    className="spotlight pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover/why:opacity-100"
                  />
                  <div
                    aria-hidden
                    className="spotlight-border pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover/why:opacity-100"
                  />
                  {on && motion && <span aria-hidden className="border-beam" />}

                  <div className="relative flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-500 ${
                        on
                          ? "border-accent/40 bg-accent/10 text-accent shadow-[0_0_24px_-6px_rgba(127,176,240,0.6)]"
                          : "border-white/10 bg-white/[0.04] text-accent/70"
                      }`}
                    >
                      <Icon active={on} />
                    </div>
                  </div>
                  <h3 className="relative mt-5 font-semibold text-white">
                    {item.title}
                  </h3>
                  <p
                    className={`relative mt-2 text-sm leading-relaxed transition-colors duration-500 ${
                      on ? "text-white/70" : "text-white/50"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
