"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Logo from "./Logo";

// Timings in ms. Panels are staggered, so a phase lasts its duration plus the
// stagger of the last panel.
const COVER = 300;
const REVEAL = 380;
const STAGGER = 30;
const PANELS = 5;
// The shortest the curtain stays down once the new page is ready.
const HOLD = 80;
// A phase is only over once the last, most delayed panel has arrived.
const SWEEP = STAGGER * (PANELS - 1);
// If a navigation never lands, lift the curtain anyway.
const GIVE_UP = 2500;

type Phase = "idle" | "cover" | "reveal";

/**
 * Covers the gap between pages: navy panels sweep up over the old page while
 * the next one loads, then keep going and slide off the top to reveal it.
 * Reduced-motion visitors get no curtain at all.
 */
export default function PageTransition() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<number[]>([]);
  // The page we left, so we know when the new one has rendered.
  const leaving = useRef<string | null>(null);
  const coveredAt = useRef(0);

  const clear = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const reveal = useCallback(() => {
    clear();
    setPhase("reveal");
    later(() => {
      setPhase("idle");
      leaving.current = null;
    }, REVEAL + SWEEP);
  }, []);

  // Start covering the moment an internal link is clicked.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const link = (event.target as Element | null)?.closest?.("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      clear();
      leaving.current = window.location.pathname;
      coveredAt.current = performance.now() + COVER + SWEEP;
      setPhase("cover");
      later(reveal, GIVE_UP);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clear();
    };
  }, [reveal]);

  // The new route has rendered. Pages usually arrive before the curtain has
  // finished closing, so wait for it to close fully before opening it again.
  useEffect(() => {
    if (leaving.current === null || leaving.current === pathname) return;
    clear();
    const closed = coveredAt.current - performance.now();
    later(() => requestAnimationFrame(reveal), Math.max(HOLD, closed + HOLD));
  }, [pathname, reveal]);

  const covering = phase === "cover";
  // Parked below the screen when idle, across it while covering, gone above it
  // on the way out. The overlay stays mounted so the first move animates.
  const parked = phase === "idle";
  const offset = covering
    ? "translate-y-0"
    : parked
      ? "translate-y-full"
      : "-translate-y-full";

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[120] ${
        covering ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {Array.from({ length: PANELS }, (_, i) => (
        <div
          key={i}
          style={{
            left: `${(i * 100) / PANELS}%`,
            width: `${100 / PANELS + 0.2}%`,
            transitionDelay: `${(covering ? i : PANELS - 1 - i) * STAGGER}ms`,
            transitionDuration: `${covering ? COVER : REVEAL}ms`,
          }}
          className={`absolute inset-y-0 bg-navy-950 ${offset} ${
            // Snapping back below the screen must not be animated.
            parked
              ? "transition-none"
              : covering
                ? "transition-transform ease-[cubic-bezier(0.65,0,0.35,1)]"
                : "transition-transform ease-[cubic-bezier(0.22,1,0.36,1)]"
          }`}
        />
      ))}

      <div
        style={{ transitionDelay: covering ? "140ms" : "0ms" }}
        className={`absolute inset-0 flex flex-col items-center justify-center gap-5 transition-opacity ${
          covering ? "opacity-100 duration-300" : "opacity-0 duration-150"
        }`}
      >
        <Logo />
        <span className="relative block h-0.5 w-24 overflow-hidden rounded-full bg-white/15">
          <span className="absolute inset-y-0 left-0 w-1/3 animate-track rounded-full bg-accent" />
        </span>
      </div>
    </div>
  );
}
