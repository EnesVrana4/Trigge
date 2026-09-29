"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, PenTool, Code2, Rocket } from "lucide-react";
import TiltCard from "./TiltCard";

const ICONS = [Compass, PenTool, Code2, Rocket];

type Step = { step: string; title: string; description: string };

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

// Matches the `pin` screen in tailwind.config.ts, where Process pins the
// section in place while the timeline plays.
const PIN_QUERY =
  "(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)";

// Scroll needed to move to the next step while pinned: about three notches of
// a mouse wheel. The track height in Process.tsx leaves room for the steps
// plus a short hold at the end.
const STEP_SCROLL = 300;

/**
 * The process as a scroll-driven timeline: the line between the steps draws
 * itself as you scroll, and each step lights up when the line reaches it.
 * Stacked below `lg`, side by side from `lg` up. On `pin` screens the section
 * holds still while the line draws, driven by the scroll track around it.
 */
export default function ProcessTimeline({ steps }: { steps: Step[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const trackRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const tracks = trackRefs.current.slice(0, steps.length - 1);
    const setFill = (track: HTMLSpanElement | null, fill: number) => {
      track?.style.setProperty("--fill", String(fill));
      // The glowing head only shows while that stretch is still drawing.
      track?.style.setProperty("--head", fill > 0 && fill < 1 ? "1" : "0");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tracks.forEach((track) => setFill(track, 1));
      setActive(steps.length);
      return;
    }

    const wide = window.matchMedia("(min-width: 1024px)");
    const pinned = window.matchMedia(PIN_QUERY);
    const scrollTrack = list.closest<HTMLElement>("[data-process-track]");
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;

      if (pinned.matches && scrollTrack) {
        // Pinned: the first step lights as the section locks in, then every
        // STEP_SCROLL pixels of scrolling draws the line on to the next one.
        const scrolled = -scrollTrack.getBoundingClientRect().top;
        const position = Math.min(
          Math.max(scrolled / STEP_SCROLL, 0),
          steps.length - 1,
        );
        tracks.forEach((track, i) => setFill(track, clamp(position - i)));
        setActive(scrolled >= 0 ? Math.floor(position) + 1 : 0);
        return;
      }

      if (wide.matches) {
        // Side by side: the line draws across over half a screen of scrolling,
        // starting as the timeline rises past the bottom of the viewport.
        const progress =
          (vh * 0.85 - list.getBoundingClientRect().top) / (vh * 0.45);
        const position = clamp(progress) * (steps.length - 1);
        tracks.forEach((track, i) => setFill(track, clamp(position - i)));
        setActive(progress > 0 ? Math.floor(position) + 1 : 0);
        return;
      }

      // Stacked: the line follows a fixed point 70% down the screen.
      const head = vh * 0.7;
      tracks.forEach((track) => {
        if (!track) return;
        const rect = track.getBoundingClientRect();
        setFill(track, clamp((head - rect.top) / rect.height));
      });
      setActive(
        nodeRefs.current.filter((node) => {
          if (!node) return false;
          const rect = node.getBoundingClientRect();
          return rect.top + rect.height / 2 <= head;
        }).length,
      );
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    wide.addEventListener("change", schedule);
    pinned.addEventListener("change", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      wide.removeEventListener("change", schedule);
      pinned.removeEventListener("change", schedule);
      cancelAnimationFrame(raf);
    };
  }, [steps.length]);

  return (
    <ol
      ref={listRef}
      className="relative mx-auto mt-16 grid pin:mt-12 max-w-2xl gap-y-10 lg:max-w-none lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0"
    >
      {steps.map((item, i) => {
        const Icon = ICONS[i % ICONS.length];
        const on = i < active;
        const current = i === active - 1;

        return (
          <li
            key={item.step}
            className="relative grid grid-cols-[3.5rem_1fr] gap-x-5 lg:flex lg:flex-col"
          >
            {/* Line to the next step: runs down on mobile, across on desktop. */}
            {i < steps.length - 1 && (
              <span
                ref={(el) => {
                  trackRefs.current[i] = el;
                }}
                aria-hidden
                className="absolute -bottom-8 left-7 top-16 w-0.5 -translate-x-1/2 rounded-full bg-slate-200/80 lg:-right-6 lg:bottom-auto lg:left-16 lg:top-7 lg:h-0.5 lg:w-auto lg:-translate-y-1/2 lg:translate-x-0"
              >
                <span className="absolute inset-0 origin-top scale-y-[var(--fill,0)] rounded-full bg-gradient-to-b from-accent-dark to-accent transition-transform duration-200 ease-out lg:origin-left lg:scale-x-[var(--fill,0)] lg:scale-y-100 lg:bg-gradient-to-r" />
                <span className="absolute left-1/2 top-[calc(var(--fill,0)*100%)] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-dark opacity-[var(--head,0)] shadow-[0_0_0_4px_rgba(127,176,240,0.25),0_0_18px_4px_rgba(127,176,240,0.7)] transition-[top,left,opacity] duration-200 ease-out lg:left-[calc(var(--fill,0)*100%)] lg:top-1/2" />
              </span>
            )}

            <div
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              className="relative z-10 h-14 w-14"
            >
              {current && (
                <span
                  aria-hidden
                  className="absolute inset-0 animate-ripple rounded-full bg-accent/50"
                />
              )}
              <div
                className={`relative flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  on
                    ? "scale-100 border-navy-950 bg-navy-950 text-white shadow-[0_0_0_6px_rgba(127,176,240,0.18),0_12px_28px_-10px_rgba(7,11,20,0.6)]"
                    : "scale-90 border-slate-200 bg-white text-slate-400 shadow-sm"
                }`}
              >
                <span
                  className={`absolute text-sm font-bold transition-all duration-300 ${
                    on ? "scale-50 opacity-0" : "scale-100 opacity-100"
                  }`}
                >
                  {item.step}
                </span>
                <Icon
                  size={20}
                  aria-hidden
                  className={`transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    on
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-90 scale-50 opacity-0"
                  }`}
                />
              </div>
            </div>

            <div
              style={{ transitionDelay: on ? "150ms" : "0ms" }}
              className={`transition-all duration-700 ease-out lg:mt-8 lg:flex-1 ${
                on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-40"
              }`}
            >
              <TiltCard className="group relative h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-[transform,box-shadow] duration-300 ease-out [transform-style:preserve-3d] hover:shadow-xl hover:shadow-navy-950/5">
                <div
                  aria-hidden
                  className="spotlight pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <div
                  aria-hidden
                  className="spotlight-border pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span
                  aria-hidden
                  className={`absolute inset-x-6 -top-px h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent transition-transform delay-300 duration-700 ease-out ${
                    on ? "scale-x-100" : "scale-x-0"
                  }`}
                />

                <div className="relative [transform-style:preserve-3d]">
                  <h3
                    className={`text-lg font-semibold transition-colors duration-500 [transform:translateZ(24px)] ${
                      on ? "text-navy-900" : "text-slate-400"
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>
                <p className="relative mt-3 text-sm leading-relaxed text-slate-500 [transform:translateZ(12px)]">
                  {item.description}
                </p>
              </TiltCard>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
