"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowRight } from "lucide-react";
import Logo from "./Logo";

const WORDS = ["project", "website", "web app", "online store"];
// Spaces inside a word need to be non-breaking to keep their width once each
// letter is its own inline-block.
const NBSP = String.fromCharCode(160);
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

// Where the glow rests when the pointer is away, as a fraction of the banner.
const REST = { x: 0.88, y: 0.12 };
// How close the pointer must be before the button starts leaning toward it,
// and how hard it leans (at most MAGNET_RADIUS * MAGNET_PULL / 4, here 14px).
const MAGNET_RADIUS = 160;
const MAGNET_PULL = 0.35;

// Fixed rather than random, so server and client render the same sparkles.
const SPARKLES = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: 40 + ((i * 23) % 60),
  size: 1.5 + (i % 3) * 0.75,
  duration: 5 + ((i * 7) % 5),
  delay: -((i * 13) % 9),
}));

// A narrower comet than .border-beam's default, to suit a wide banner.
const BEAM = {
  inset: 0,
  padding: "2px",
  animationDuration: "7s",
  background:
    "conic-gradient(from var(--beam-angle), transparent 0%, transparent 78%, rgba(127,176,240,0.9) 94%, #fff 99%, transparent 100%)",
};

export default function CtaBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  // The glow's offset from its resting spot: where it is, and where it's headed.
  const glow = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0 });
  const magnet = useRef({ x: 0, y: 0 });
  const [seen, setSeen] = useState(false);
  const [motion, setMotion] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [word, setWord] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const state = glow.current;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotion(false);
      setSeen(true);
      return;
    }

    // Watches the section, not the banner: the banner starts fully clipped.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(state.raf);
    };
  }, []);

  // Roll to the next word every few seconds, holding still while hovered.
  useEffect(() => {
    if (!motion || !seen || hovering) return;
    const id = window.setInterval(
      () => setWord((w) => (w + 1) % WORDS.length),
      2800,
    );
    return () => window.clearInterval(id);
  }, [motion, seen, hovering]);

  // Eases the glow toward its target a little each frame, so it trails the
  // pointer instead of sticking to it.
  function stepGlow() {
    const g = glow.current;
    const banner = bannerRef.current;
    if (!banner) return;
    g.x += (g.tx - g.x) * 0.08;
    g.y += (g.ty - g.y) * 0.08;
    banner.style.setProperty("--gx", `${g.x}px`);
    banner.style.setProperty("--gy", `${g.y}px`);
    const settled = Math.abs(g.tx - g.x) < 0.5 && Math.abs(g.ty - g.y) < 0.5;
    g.raf = settled ? 0 : requestAnimationFrame(stepGlow);
  }

  function steerGlow(x: number, y: number) {
    const g = glow.current;
    g.tx = x;
    g.ty = y;
    if (!g.raf) g.raf = requestAnimationFrame(stepGlow);
  }

  function setMagnet(x: number, y: number) {
    magnet.current = { x, y };
    buttonRef.current?.style.setProperty("--bx", `${x}px`);
    buttonRef.current?.style.setProperty("--by", `${y}px`);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!motion || event.pointerType !== "mouse") return;
    const banner = event.currentTarget;
    const rect = banner.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    banner.style.setProperty("--mx", `${x}px`);
    banner.style.setProperty("--my", `${y}px`);
    steerGlow(x - rect.width * REST.x, y - rect.height * REST.y);

    const button = buttonRef.current;
    if (!button) return;
    const b = button.getBoundingClientRect();
    // Measure from where the button sits at rest, not where it has leaned to.
    const dx = event.clientX - (b.left + b.width / 2 - magnet.current.x);
    const dy = event.clientY - (b.top + b.height / 2 - magnet.current.y);
    const distance = Math.hypot(dx, dy);
    if (distance < MAGNET_RADIUS) {
      // Fades to nothing at the edge of the radius, so the button never snaps.
      const pull = MAGNET_PULL * (1 - distance / MAGNET_RADIUS);
      setMagnet(dx * pull, dy * pull);
    } else {
      setMagnet(0, 0);
    }
  }

  function handlePointerLeave() {
    setHovering(false);
    if (!motion) return;
    steerGlow(0, 0);
    setMagnet(0, 0);
  }

  const previous = (word - 1 + WORDS.length) % WORDS.length;

  return (
    <section ref={sectionRef} className="bg-white pb-20 pt-4 lg:pb-24">
      <div className="container-page">
        <div
          ref={bannerRef}
          onPointerMove={handlePointerMove}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setHovering(true);
          }}
          onPointerLeave={handlePointerLeave}
          className={`group/cta relative overflow-hidden rounded-3xl bg-navy-950 px-8 py-12 transition-[clip-path,transform] duration-[1100ms] sm:px-12 ${EASE} ${
            seen
              ? "scale-100 [clip-path:inset(0_0_0_0_round_24px)]"
              : "scale-[0.98] [clip-path:inset(0_50%_0_50%_round_24px)]"
          }`}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 grid-pattern opacity-60" />
            <div className="grid-pattern-accent absolute inset-0 opacity-0 transition-opacity duration-500 [mask-image:radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,50%),#000,transparent)] group-hover/cta:opacity-100" />

            {/* Aurora: two glows drifting on their own, one trailing the pointer. */}
            <div className="absolute -bottom-24 left-1/4 h-64 w-64 animate-drift rounded-full bg-accent-dark/30 blur-3xl" />
            <div className="absolute -top-20 left-1/2 h-56 w-56 animate-drift rounded-full bg-accent-light/15 blur-3xl [animation-delay:-7s]" />
            <div className="absolute left-[88%] top-[12%] h-80 w-80 rounded-full bg-accent/30 blur-3xl [transform:translate(-50%,-50%)_translate(var(--gx,0px),var(--gy,0px))]" />

            {motion &&
              SPARKLES.map((s, i) => (
                <span
                  key={i}
                  style={{
                    left: `${s.left}%`,
                    top: `${s.top}%`,
                    width: s.size,
                    height: s.size,
                    animationDuration: `${s.duration}s`,
                    animationDelay: `${s.delay}s`,
                  }}
                  className="absolute animate-rise rounded-full bg-accent-light shadow-[0_0_6px_1px_rgba(168,201,245,0.8)]"
                />
              ))}

            {motion && (
              <>
                <span className="border-beam" style={BEAM} />
                <span
                  className="border-beam"
                  style={{ ...BEAM, animationDelay: "-3.5s" }}
                />
              </>
            )}
            <div className="spotlight-border absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover/cta:opacity-100" />
          </div>

          <div className="relative flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div
                style={{ transitionDelay: "500ms" }}
                className={`transition-all duration-700 ${EASE} ${
                  seen ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
                }`}
              >
                <Logo />
              </div>
              <div
                style={{ transitionDelay: "650ms" }}
                className={`hidden h-12 w-px origin-center bg-gradient-to-b from-transparent via-white/30 to-transparent transition-transform duration-700 sm:block ${EASE} ${
                  seen ? "scale-y-100" : "scale-y-0"
                }`}
              />
              <div
                style={{ transitionDelay: "720ms" }}
                className={`transition-all duration-700 ${EASE} ${
                  seen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  <span className="sr-only">Ready to start your project?</span>
                  <span aria-hidden>
                    Ready to start your{" "}
                    {/* Every word shares one grid cell, so swapping them never
                        shifts the line; each letter flips on its own. */}
                    <span className="inline-grid [perspective:600px]">
                      {WORDS.map((w, i) => (
                        <span
                          key={w}
                          className="whitespace-nowrap [grid-area:1/1]"
                        >
                          {[...`${w}?`].map((char, c) => (
                            <span
                              key={c}
                              // The old word flips out quickly; the new one
                              // waits for it, so the letters never pile up.
                              style={
                                i === word
                                  ? { transitionDelay: `${180 + c * 35}ms`, transitionDuration: "550ms" }
                                  : { transitionDelay: `${c * 20}ms`, transitionDuration: "260ms" }
                              }
                              className={`inline-block bg-gradient-to-b from-white to-accent bg-clip-text text-transparent transition-[transform,opacity,filter] [backface-visibility:hidden] ${EASE} ${
                                i === word
                                  ? "opacity-100 blur-0 [transform:rotateX(0deg)_translateY(0)]"
                                  : i === previous
                                    ? "opacity-0 blur-[2px] [transform:rotateX(90deg)_translateY(-40%)]"
                                    : "opacity-0 blur-[2px] [transform:rotateX(-90deg)_translateY(40%)]"
                              }`}
                            >
                              {char === " " ? NBSP : char}
                            </span>
                          ))}
                        </span>
                      ))}
                    </span>
                  </span>
                </h2>
                <p className="mt-1.5 text-sm text-white/60">
                  Book a free consultation, we&apos;ll reply within one working
                  day.
                </p>
              </div>
            </div>

            <div
              style={{ transitionDelay: "850ms" }}
              className={`shrink-0 transition-all duration-700 ${EASE} ${
                seen ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-90 opacity-0"
              }`}
            >
              <Link
                ref={buttonRef}
                href="/contact"
                className="btn-primary group relative [transform:translate(var(--bx,0px),var(--by,0px))]"
              >
                {motion && (
                  <>
                    {/* A halo pulsing outward to draw the eye to the button. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 animate-halo rounded-full border-2 border-accent/70"
                    />
                    {/* A band of light sweeping across it every few seconds. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
                    >
                      <span className="absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-accent/45 to-transparent" />
                    </span>
                  </>
                )}
                {/* The label drifts a little further than the button, for depth. */}
                <span className="relative inline-flex items-center gap-2 transition-transform duration-300 [transform:translate(calc(var(--bx,0px)*0.35),calc(var(--by,0px)*0.35))]">
                  Get in Touch
                  <span className="relative block h-4 w-4 overflow-hidden">
                    <ArrowRight
                      size={16}
                      className="absolute inset-0 transition-transform duration-300 group-hover:translate-x-full"
                    />
                    <ArrowRight
                      size={16}
                      className="absolute inset-0 -translate-x-full transition-transform duration-300 group-hover:translate-x-0"
                    />
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
