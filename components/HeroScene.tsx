"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import HeroDevices from "./HeroDevices";
import IntroLoader, { LOADER_WORDS } from "./IntroLoader";
import { PORTFOLIO_ENABLED } from "@/lib/data";
import {
  CAROUSEL_MS,
  INTRO_SEEN_KEY,
  MARK_T,
  SPEED,
  T,
  WORK,
  clamp01,
  io,
  out,
  parseOutline,
  partialOutline,
  seg,
} from "@/lib/intro";

const OUTLINE = parseOutline(MARK_T);
const BLUE = "#9dbaf0";
const DIM = "#3b4046";
// Width the devices need at full size; narrower columns scale them down.
const DEVICES_WIDTH = 650;
// What the centred copy fits and centres on: the visible scene runs from the
// laptop base's left corner (-90, swung out in perspective) to the phone's
// right edge (630), plus a little air.
const CENTRED_WIDTH = 740;
const CENTRED_MIDDLE = 270;
const DEVICES_SCALE = 0.86;

type IntroState = "play" | "nav" | "logo";

/**
 * Server-rendered state: the hero as it ends up, laptop open and phone beside
 * it. That is what a reload or a return to Home shows, from the first paint.
 * On a first visit the loader covers this while the clock rewinds it to the
 * start, so the laptop opening and the phone sliding out play with the intro.
 */
const INITIAL_VARS = {
  "--hero-scale": 1,
  "--h0": 1,
  "--h3": 1,
  "--h4": 1,
  "--h5": 1,
  "--l0": 0,
  "--l1": 0,
  "--l2": 0,
  "--lid": 10,
  "--lid-shade": 1,
  "--scr": 1,
  "--ph-x": 495,
  "--ph-z": 45,
  "--ph-o": 1,
  "--ph-shadow": 1,
  "--tilt": -22,
  "--gx": 22,
} as CSSProperties;

/** Rises 26px and fades in as `--h{k}` goes 0 → 1. */
const rise = (k: number): CSSProperties => ({
  opacity: `var(--h${k})`,
  transform: `translateY(calc((1 - var(--h${k})) * 26px))`,
});

/** A headline line sliding up out of its mask. */
const line = (k: number): CSSProperties => ({
  transform: `translateY(calc(var(--l${k}) * 1%))`,
});

const r3 = (v: number) => Math.round(v * 1000) / 1000;

export default function HeroScene({ fontClass }: { fontClass: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const [showLoader, setShowLoader] = useState(true);
  const [carousel, setCarousel] = useState(false);
  const [slides, setSlides] = useState({ slide: 0, prev: -1 });

  // The timeline: one requestAnimationFrame clock, stopped once the devices
  // are in place. Values go straight to CSS variables and loader nodes, so
  // React doesn't re-render per frame.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    mounted.current = true;
    const html = document.documentElement;
    const loader = loaderRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const intro = html.dataset.intro === "play" && !!loader && !reduce;

    const setVar = (name: string, v: number) => section.style.setProperty(name, String(r3(v)));

    const applyDevices = (t: number) => {
      const lidEase = io(seg(t, 4900, 6000));
      setVar("--lid", -90 + 100 * lidEase);
      setVar("--lid-shade", clamp01((lidEase - 0.2) / 0.6));
      setVar("--scr", out(seg(t, 5600, 6300)));
      // The phone slides out from behind the screen, then steps forward.
      setVar("--ph-x", 300 + 195 * io(seg(t, 6000, 6900)));
      setVar("--ph-z", -75 + 120 * io(seg(t, 6600, 7100)));
      setVar("--ph-o", seg(t, 6000, 6200));
      setVar("--ph-shadow", seg(t, 6300, 7000));
    };

    if (!intro) {
      delete html.dataset.intro;
      setShowLoader(false);
    }

    // No loader, no motion: the devices are simply open, first project on.
    if (reduce) return;

    // Mouse tilt, kept subtle on purpose.
    let mx = 0;
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const next = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      if (Math.abs(next - mx) < 0.02) return;
      mx = next;
      setVar("--tilt", -22 + mx * 5);
      setVar("--gx", 22 + mx * 6);
    };
    section.addEventListener("mousemove", onMove);

    // --- loader -----------------------------------------------------------
    const q = <E extends Element = HTMLElement>(k: string) =>
      loader?.querySelector<E>(`[data-k="${k}"]`) ?? null;
    const el = intro
      ? {
          curtain: q("curtain"),
          glow: q("glow"),
          grid: q("grid"),
          ui: q("ui"),
          bar: q("bar"),
          count: q("count"),
          words: LOADER_WORDS.map((_, i) => q(`word-${i}`)),
          arrows: LOADER_WORDS.slice(1).map((_, i) => q(`arrow-${i}`)),
          edge: q("edge"),
          lockup: q("lockup"),
          mark: q<SVGSVGElement>("mark"),
          word: q("word"),
          fill: q<SVGGElement>("fill"),
          fill2: q<SVGPathElement>("fill2"),
          stroke: q<SVGPolylineElement>("stroke"),
          pen: q<SVGCircleElement>("pen"),
          penGlow: q<SVGCircleElement>("pen-glow"),
          letters: Array.from(loader!.querySelectorAll<HTMLElement>('[data-k="letter"]')),
          sol: q("sol"),
        }
      : null;

    // The lockup rests centred, shrunk to fit narrow screens. At the exit its
    // three parts (mark, TRIGGE, SOLUTIONS) each fly onto their twin in the
    // header's logo, which uses the same artwork and font, so the handover to
    // the real logo is seamless. Measured once, and again on resize.
    type Part = {
      node: HTMLElement | SVGElement;
      target: string; // the twin in the header
      lx: number; // position inside the unscaled lockup
      ly: number;
      size: number; // font size (text) or width (mark), unscaled
      glyph: number; // gap from the box top to the glyphs: (line-height - font-size) / 2
    };
    type Target = { size: number; glyph: number };
    let geo: { x0: number; y0: number; s0: number; parts: Part[]; targets: Map<string, Target> } | null = null;

    const textMetrics = (node: Element) => {
      const style = getComputedStyle(node);
      const size = parseFloat(style.fontSize);
      const lineHeight = parseFloat(style.lineHeight);
      return { size, glyph: Number.isFinite(lineHeight) ? (lineHeight - size) / 2 : 0 };
    };

    const measure = () => {
      if (!el?.lockup || !loader) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = el.lockup.offsetWidth;
      const h = el.lockup.offsetHeight;
      // Fit whichever is wider, the lockup or the 372px counter row under it.
      const s0 = Math.min(1, (vw - 48) / Math.max(w, 372));
      loader.style.setProperty("--s0", String(r3(s0)));

      const box = el.lockup.getBoundingClientRect();
      const scale = box.width / w || 1;
      const parts: Part[] = [];
      const targets = new Map<string, Target>();
      const add = (node: HTMLElement | SVGElement | null, target: string, text: boolean) => {
        const twin = document.querySelector(target);
        if (!node || !twin) return;
        node.style.transform = "";
        const rect = node.getBoundingClientRect();
        const own = text ? textMetrics(node) : { size: rect.width / scale, glyph: 0 };
        parts.push({
          node,
          target,
          lx: (rect.left - box.left) / scale,
          ly: (rect.top - box.top) / scale,
          size: own.size,
          glyph: own.glyph,
        });
        targets.set(target, text ? textMetrics(twin) : { size: 0, glyph: 0 });
      };
      add(el.mark, "header [data-logo-mark]", false);
      add(el.word, "header [data-logo-word]", true);
      add(el.sol, "header [data-logo-sol]", true);

      geo = { x0: (vw - w * s0) / 2, y0: 0.455 * vh - (h * s0) / 2, s0, parts, targets };
      el.lockup.style.transform = `translate(${geo.x0.toFixed(2)}px, ${geo.y0.toFixed(2)}px) scale(${s0})`;
    };

    /** Moves each part `exit` (0-1) of the way onto its twin in the header. */
    const fly = (exit: number) => {
      if (!geo) return;
      const { x0, y0, s0 } = geo;
      for (const part of geo.parts) {
        if (exit <= 0) {
          part.node.style.transform = "";
          continue;
        }
        // Where the glyphs sit now, and where they sit in the header, in
        // screen pixels. Read every frame: the header is the source of truth.
        const twin = document.querySelector(part.target)?.getBoundingClientRect();
        const metrics = geo.targets.get(part.target);
        if (!twin || !metrics) continue;
        const text = part.node !== el?.mark;
        const fromX = x0 + part.lx * s0;
        const fromY = y0 + (part.ly + part.glyph) * s0;
        const fromSize = part.size * s0;
        const toX = twin.left;
        const toY = text ? twin.top + metrics.glyph : twin.top;
        const toSize = text ? metrics.size : twin.width;
        const size = fromSize + (toSize - fromSize) * exit;
        const k = size / fromSize; // on top of the lockup's own scale
        const x = fromX + (toX - fromX) * exit;
        const y = fromY + (toY - fromY) * exit - part.glyph * s0 * k;
        const dx = (x - (x0 + part.lx * s0)) / s0;
        const dy = (y - (y0 + part.ly * s0)) / s0;
        part.node.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${k.toFixed(4)})`;
      }
    };

    const applyLoader = (t: number) => {
      if (!el) return;
      if (!geo) measure();

      // The pen traces the big T, then the fill takes over.
      const traced = partialOutline(OUTLINE, io(seg(t, 100, 1350)));
      el.stroke?.setAttribute("points", traced.points);
      el.stroke?.style.setProperty("stroke-opacity", String(r3(1 - seg(t, 1650, 2050))));
      const drawing = t > 100 && t < 1350 ? 1 : 0;
      for (const dot of [el.pen, el.penGlow]) {
        dot?.setAttribute("cx", traced.x.toFixed(1));
        dot?.setAttribute("cy", traced.y.toFixed(1));
      }
      el.pen?.setAttribute("opacity", String(drawing));
      el.penGlow?.setAttribute("opacity", String(drawing * 0.35));
      el.fill?.style.setProperty("fill-opacity", String(r3(seg(t, 1250, 1850))));
      el.fill2?.style.setProperty("fill-opacity", String(r3(out(seg(t, 1350, 1700)))));

      // Blueprint grid spreading from the mark, and the glow behind it.
      const gridR = out(seg(t, 100, 2000)) * 700;
      if (el.grid) {
        const mask = `radial-gradient(circle at 50% 45.5%, #000 0px, #000 ${gridR.toFixed(1)}px, transparent ${(gridR + 260).toFixed(1)}px)`;
        el.grid.style.maskImage = mask;
        el.grid.style.setProperty("-webkit-mask-image", mask);
        el.grid.style.opacity = String(r3(1 - 0.6 * seg(t, 3400, 3800)));
      }
      const cnt = io(seg(t, 1950, 3450));
      if (el.glow) {
        // Fades as the counter finishes, so it doesn't linger once the logo
        // it sits behind has flown off to the navbar.
        const a = out(seg(t, 300, 1800)) * (0.05 + 0.1 * cnt) * (1 - out(seg(t, 3400, 3850)));
        const w = 360 + 180 * cnt;
        el.glow.style.background = `radial-gradient(ellipse ${w.toFixed(0)}px ${(w * 0.62).toFixed(0)}px at 50% 45.5%, rgba(157,186,240,${r3(a)}) 0%, rgba(157,186,240,${r3(a * 0.35)}) 35%, rgba(157,186,240,0) 100%)`;
      }

      // Wordmark rises letter by letter; SOLUTIONS tightens in.
      el.letters.forEach((letter, i) => {
        const p = out(seg(t, 1350 + i * 70, 2000 + i * 70));
        letter.style.opacity = String(r3(p));
        letter.style.transform = `translateY(${r3((1 - p) * 46)}px)`;
      });
      // During the exit the spacing, colour and opacity ease to the header's.
      const sp = out(seg(t, 1750, 2750));
      const exit = io(seg(t, T.curtain, T.flightEnd));
      if (el.sol) {
        el.sol.style.letterSpacing = `${r3(0.95 - 0.53 * sp - 0.1 * exit)}em`;
        el.sol.style.opacity = String(r3(sp * (1 - 0.3 * exit)));
        el.sol.style.color = `rgb(${Math.round(214 + 41 * exit)},${Math.round(218 + 37 * exit)},${Math.round(224 + 31 * exit)})`;
      }
      if (el.word) el.word.style.letterSpacing = `${r3(0.1 + 0.08 * exit)}em`;

      // Counter: ideas → code → solutions.
      const count = Math.round(cnt * 100);
      const idx = count < 34 ? 0 : count < 67 ? 1 : 2;
      if (el.ui) el.ui.style.opacity = String(r3(seg(t, 1950, 2350) * (1 - seg(t, 3400, 3700))));
      if (el.bar) el.bar.style.width = `${count}%`;
      if (el.count) el.count.textContent = String(count).padStart(3, "0");
      el.words.forEach((word, i) => word && (word.style.color = i <= idx ? "#ffffff" : DIM));
      el.arrows.forEach((arrow, i) => arrow && (arrow.style.color = i < idx ? BLUE : DIM));

      // Exit: the curtain lifts and the logo flies to the navbar.
      if (el.curtain) el.curtain.style.clipPath = `inset(0 0 ${r3(exit * 100)}% 0)`;
      if (el.edge) {
        el.edge.style.top = `${r3((1 - exit) * 100)}%`;
        el.edge.style.opacity = String(exit > 0 && exit < 1 ? r3(Math.sin(exit * Math.PI)) : 0);
      }
      if (el.lockup && geo) {
        fly(exit);
        el.lockup.style.visibility = "visible";
        // Hands over to the real navbar logo, which fades in underneath.
        el.lockup.style.opacity = String(r3(1 - seg(t, T.flightEnd, T.loaderGone)));
      }
    };

    // --- hero entrance ----------------------------------------------------
    let state: IntroState | null = "play";
    let seen = false;
    let loaderGone = false;
    const applyHero = (t: number) => {
      setVar("--hero-scale", 1.12 - 0.12 * out(seg(t, T.curtain, 5550)));
      for (const k of [0, 3, 4, 5]) setVar(`--h${k}`, out(seg(t, 4150 + k * 110, 4900 + k * 110)));
      for (const k of [0, 1, 2]) setVar(`--l${k}`, (1 - out(seg(t, 4200 + k * 120, 5000 + k * 120))) * 110);

      // The header reads these to hide its logo and drop its links in.
      const next: IntroState | null =
        t < T.nav ? "play" : t < T.flightEnd ? "nav" : t < T.navEnd ? "logo" : null;
      if (next !== state) {
        state = next;
        if (next) html.dataset.intro = next;
        else delete html.dataset.intro;
      }
      if (!seen && t >= T.curtain) {
        seen = true;
        try {
          sessionStorage.setItem(INTRO_SEEN_KEY, "1");
        } catch {}
      }
      if (!loaderGone && t >= T.loaderGone) {
        loaderGone = true;
        setShowLoader(false);
      }
    };

    const frame = (t: number) => {
      if (intro) {
        if (!loaderGone) applyLoader(t);
        applyHero(t);
      }
      applyDevices(t);
    };

    // --- clock ------------------------------------------------------------
    let raf = 0;
    let start = 0;
    let running = false;
    let skipped = false;
    const now = () => (running ? (performance.now() - start) * SPEED : 0);

    const loop = (time: number) => {
      const t = (time - start) * SPEED;
      frame(t);
      if (t < T.done) raf = requestAnimationFrame(loop);
      else {
        raf = 0;
        setCarousel(true);
      }
    };
    const run = () => {
      if (running) return;
      running = true;
      if (intro) measure();
      start = performance.now();
      // A skip before the clock started jumps straight to the curtain.
      if (skipped) start -= T.curtain / SPEED;
      raf = requestAnimationFrame(loop);
    };

    // A click, key or scroll during the loader jumps to the curtain lift.
    const skipEvents = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    const skip = () => {
      const t = now();
      if (t >= T.curtain) return;
      skipped = true;
      if (running) start -= (T.curtain - t) / SPEED;
      skipEvents.forEach((type) => window.removeEventListener(type, skip));
    };
    const onResize = () => {
      geo = null;
    };

    let fontTimer = 0;
    if (intro) {
      frame(0);
      skipEvents.forEach((type) => window.addEventListener(type, skip, { passive: true }));
      window.addEventListener("resize", onResize);
      // Start once the wordmark's font is in, so the letters don't swap mid-rise.
      fontTimer = window.setTimeout(run, 800);
      document.fonts?.ready.then(run);
    } else {
      // Not the first visit in this tab: everything is already in place, and
      // the screens just start cycling through the projects.
      setCarousel(true);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fontTimer);
      running = true; // a late fonts.ready must not restart the clock
      section.removeEventListener("mousemove", onMove);
      skipEvents.forEach((type) => window.removeEventListener(type, skip));
      window.removeEventListener("resize", onResize);
      // Leaving mid-intro must not leave the header hidden. Deferred, because
      // Strict Mode re-runs this effect at once and the intro must survive it.
      // The intro only counts as seen once the curtain has lifted, so leaving
      // during the loader (or a dev hot reload) doesn't use it up.
      mounted.current = false;
      if (intro) {
        window.setTimeout(() => {
          if (!mounted.current) delete html.dataset.intro;
        });
      }
    };
  }, []);

  // Portfolio carousel: the next project scrolls up every few seconds. Paused
  // while the tab is hidden.
  useEffect(() => {
    if (!carousel) return;
    let timer = 0;
    const play = () => {
      if (timer) return;
      timer = window.setInterval(() => {
        setSlides(({ slide }) => ({ prev: slide, slide: (slide + 1) % WORK.length }));
      }, CAROUSEL_MS);
    };
    const pause = () => {
      window.clearInterval(timer);
      timer = 0;
    };
    const onVisibility = () => (document.hidden ? pause() : play());
    play();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      pause();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [carousel]);

  return (
    <section
      ref={sectionRef}
      style={INITIAL_VARS}
      className={`${fontClass} relative overflow-hidden bg-[#0b0e13] font-manrope text-white lg:flex lg:min-h-[100svh] lg:items-center`}
    >
      {showLoader && <IntroLoader ref={loaderRef} />}

      {/* Background: the office animation, darkened and blurred */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ transform: "scale(var(--hero-scale))", transformOrigin: "60% 50%" }}
        >
          {/* Phones blur and darken less: the narrow crop enlarges the footage,
              so the desktop treatment left nothing recognisable. */}
          <div className="absolute -inset-[8%] [filter:blur(6px)_brightness(0.55)_saturate(0.9)] lg:[filter:blur(22px)_brightness(0.42)_saturate(0.8)]">
            <AnimatedBackground src="/background/hero-background.webp" priority />
          </div>
          <div
            className="absolute -bottom-[10%] -top-[10%] left-[10%] w-3/5 motion-safe:animate-hero-sweep"
            style={{
              background:
                "linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(210,225,255,0.08) 50%, rgba(255,255,255,0) 100%)",
              filter: "blur(20px)",
            }}
          />
          <div
            className="absolute inset-0 opacity-35 motion-safe:animate-hero-flicker"
            style={{
              background:
                "radial-gradient(ellipse 40% 50% at 70% 35%, rgba(255,240,220,0.07) 0%, rgba(255,240,220,0) 70%)",
            }}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(8,10,14,0.72) 0%, rgba(8,10,14,0.5) 45%, rgba(8,10,14,0.35) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[180px]"
          style={{ background: "linear-gradient(180deg, rgba(8,10,14,0) 0%, rgba(8,10,14,0.7) 100%)" }}
        />
      </div>

      <div className="container-page relative grid items-center gap-14 pb-20 pt-32 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pb-16 lg:pt-28">
        <div>
          <p
            className="mb-5 font-montserrat text-xs font-semibold tracking-[0.24em] text-[#9aa1aa]"
            style={rise(0)}
          >
            IDEAS → CODE → SOLUTIONS
          </p>

          <h1 className="text-[2.5rem] font-bold leading-[1.05] tracking-[-0.02em] sm:text-5xl lg:text-[3.25rem] lg:leading-none xl:text-6xl xl:leading-none">
            <span className="block overflow-hidden">
              <span className="block" style={line(0)}>
                Custom Software
              </span>
            </span>{" "}
            <span className="block overflow-hidden">
              <span className="block" style={line(1)}>
                Solutions for Your
              </span>
            </span>{" "}
            <span className="block overflow-hidden pb-1.5">
              <span className="block text-[#9dbaf0]" style={line(2)}>
                Business
              </span>
            </span>
          </h1>

          {/* On narrower screens the devices sit between the title and the text */}
          <DevicesStage slides={slides} centred className="-mb-2 mt-8 lg:hidden" />

          <p
            className="mt-[22px] max-w-[470px] text-base font-medium leading-7 text-[#b9bfc7] sm:text-[17px]"
            style={rise(3)}
          >
            We build modern websites, web applications and digital platforms that help your
            business grow, work smarter and stay ahead of the competition.
          </p>

          <div className="mt-[34px] flex flex-col gap-4 sm:flex-row" style={rise(4)}>
            <Link href="/contact" className="btn-primary group h-[50px] px-[26px] text-[15px]">
              Get a Free Consultation
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            {PORTFOLIO_ENABLED && (
              <Link href="/portfolio" className="btn-outline h-[50px] px-[26px] text-[15px]">
                View Our Work
              </Link>
            )}
          </div>
        </div>

        {/* The devices beside the copy on wide screens */}
        <DevicesStage
          slides={slides}
          // At lg the laptop base swings left in perspective; keep it off the copy.
          className="hidden lg:ml-10 lg:block xl:ml-0"
        />
      </div>
    </section>
  );
}

/**
 * The 3D devices, authored at 700x560 and scaled to the width they are given.
 * The hero renders two (beside the copy on wide screens, under the headline on
 * narrow ones), only one of them displayed; both follow the same CSS variables
 * and carousel.
 */
/**
 * The stage's scale as pure CSS, so the server-rendered page already has the
 * devices at the right size before any script runs (the ResizeObserver then
 * fine-tunes it). tan(atan2(a, b)) is CSS's way of dividing two lengths.
 *   centred: the container is the viewport minus the 24px side padding.
 *   beside:  the right grid column, (container - 80px padding - 32px gap) /
 *            2.05 for the 1.05fr/1fr split, minus the 40px margin it has
 *            below 1280px.
 */
const CSS_SCALE = {
  centred: `min(${DEVICES_SCALE}, tan(atan2(100vw - 48px, ${CENTRED_WIDTH}px)))`,
  beside: `min(${DEVICES_SCALE}, tan(atan2((min(100vw, 1280px) - 112px) / 2.05 - min(40px, max(0px, (1280px - 100vw) * 1000)), ${DEVICES_WIDTH}px)))`,
};

function DevicesStage({
  slides,
  centred = false,
  className,
}: {
  slides: { slide: number; prev: number };
  centred?: boolean;
  className: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = ref.current;
    if (!wrap) return;
    const observer = new ResizeObserver(([entry]) => {
      const fit = centred ? CENTRED_WIDTH : DEVICES_WIDTH;
      const scale = Math.min(DEVICES_SCALE, entry.contentRect.width / fit);
      wrap.style.setProperty("--dev-s", String(r3(scale)));
    });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [centred]);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={
        {
          "--dev-s": centred ? CSS_SCALE.centred : CSS_SCALE.beside,
          // The bottom of the 560px stage is empty once the lid is open; the
          // centred copy trims it so the text below doesn't float away.
          height: `calc(${centred ? 430 : 560}px * var(--dev-s))`,
        } as CSSProperties
      }
    >
      <div
        className="absolute top-0"
        style={{
          // Centres what you see rather than the stage box.
          left: centred ? `calc(50% - ${CENTRED_MIDDLE}px * var(--dev-s))` : 0,
          opacity: "var(--h5)",
          transform: "translateY(calc((1 - var(--h5)) * 26px)) scale(var(--dev-s))",
          transformOrigin: "0 0",
        }}
      >
        <HeroDevices slide={slides.slide} prev={slides.prev} />
      </div>
    </div>
  );
}
