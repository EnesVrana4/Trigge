"use client";

import { useEffect, useId, useRef, useState, type PointerEvent } from "react";

type Point = { x: number; y: number; z: number };

// How far the camera looks down on the globe, in radians.
const TILT = 0.38;
// Spin speed in radians per second: about one turn every 20s.
const SPEED = 0.32;
// Radius of the tag sphere as a fraction of the globe box. The wireframe is
// drawn in a 100-unit viewBox, so it uses the same number times 100.
const RADIUS = 0.38;
const VIEW_R = RADIUS * 100;
// How long a released tag takes to glide back onto the globe.
const RETURN_MS = 500;
// How long the tags take to burst out from the centre on first sight.
const SPREAD_MS = 1400;
const MERIDIANS = 6;
const LATITUDES = [-60, -30, 0, 30, 60];

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Evenly spread points on a unit sphere (Fibonacci), none on the poles. */
function spherePoints(n: number): Point[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - ((i + 0.5) / n) * 2;
    const r = Math.sqrt(1 - y * y);
    return { x: Math.cos(golden * i) * r, y, z: Math.sin(golden * i) * r };
  });
}

/** Spins a point about the vertical axis, then tips it toward the viewer. */
function project(p: Point, angle: number): Point {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const x = p.x * cos + p.z * sin;
  const z = -p.x * sin + p.z * cos;
  return {
    x,
    y: p.y * Math.cos(TILT) - z * Math.sin(TILT),
    z: p.y * Math.sin(TILT) + z * Math.cos(TILT),
  };
}

const toView = (q: Point) =>
  `${(50 + q.x * VIEW_R).toFixed(2)} ${(50 - q.y * VIEW_R).toFixed(2)}`;

/** A circle on the globe as SVG paths, split into its near and far halves. */
function circlePaths(at: (t: number) => Point, angle: number, steps = 48) {
  const d = { front: "", back: "" };
  let prev = project(at(0), angle);
  let side: "front" | "back" | null = null;
  for (let s = 1; s <= steps; s++) {
    const cur = project(at((s / steps) * Math.PI * 2), angle);
    const next = prev.z + cur.z >= 0 ? "front" : "back";
    if (next !== side) d[next] += `M${toView(prev)}`;
    d[next] += `L${toView(cur)}`;
    side = next;
    prev = cur;
  }
  return d;
}

const meridian = (k: number) => {
  const lon = (k * Math.PI) / MERIDIANS;
  return (t: number): Point => ({
    x: Math.cos(t) * Math.cos(lon),
    y: Math.sin(t),
    z: Math.cos(t) * Math.sin(lon),
  });
};

const latitude = (deg: number) => {
  const lat = (deg * Math.PI) / 180;
  return (t: number): Point => ({
    x: Math.cos(lat) * Math.cos(t),
    y: Math.sin(lat),
    z: Math.cos(lat) * Math.sin(t),
  });
};

// Spinning about the vertical axis leaves the parallels where they are.
const LATITUDE_PATHS = LATITUDES.map((deg) => circlePaths(latitude(deg), 0));

// The space around the globe: a wider viewBox centred on it, in the same units
// as the wireframe (so the globe's radius is VIEW_R here too).
const SPACE_W = 340;
const SPACE_H = 150;

type Orbit = {
  radius: number; // in globe radii
  incline: number; // tilt of the orbit's plane, in radians
  node: number; // which way that tilt faces, in radians
  speed: number; // radians per second; negative runs the other way
  satellites: number[]; // starting positions along the orbit
};

const ORBITS: Orbit[] = [
  { radius: 1.75, incline: 0.3, node: 0.4, speed: 0.5, satellites: [0] },
  { radius: 2.5, incline: -0.22, node: -0.6, speed: -0.32, satellites: [0, Math.PI] },
  { radius: 3.25, incline: 0.12, node: 1.2, speed: 0.2, satellites: [2] },
];

const SATELLITES = ORBITS.flatMap((orbit, o) =>
  orbit.satellites.map((phase) => ({ orbit: o, phase })),
);
// Dots in each satellite's fading tail, behind the satellite itself.
const TRAIL = 7;

/** A point on an orbit: a circle in the equatorial plane, inclined, then turned. */
function orbitPoint(o: Orbit, t: number): Point {
  const x = Math.cos(t) * o.radius;
  const z = Math.sin(t) * o.radius;
  const zi = z * Math.cos(o.incline);
  return {
    x: x * Math.cos(o.node) + zi * Math.sin(o.node),
    y: -z * Math.sin(o.incline),
    z: -x * Math.sin(o.node) + zi * Math.cos(o.node),
  };
}

/** Where a point in space lands in the space viewBox (z kept for depth). */
function toSpace(p: Point, spread: number): Point {
  const q = project(p, 0);
  return { x: q.x * VIEW_R * spread, y: -q.y * VIEW_R * spread, z: q.z };
}

// Behind the globe and inside its outline, so out of sight.
const behindGlobe = (v: Point) => v.z < 0 && Math.hypot(v.x, v.y) < VIEW_R;

/** An orbit as near and far paths, leaving out the stretch behind the globe. */
function orbitPaths(o: Orbit, spread: number, steps = 96) {
  const d = { front: "", back: "" };
  const at = (v: Point) => `${v.x.toFixed(2)} ${v.y.toFixed(2)}`;
  let prev = toSpace(orbitPoint(o, 0), spread);
  let side: "front" | "back" | null = null;
  for (let s = 1; s <= steps; s++) {
    const cur = toSpace(orbitPoint(o, (s / steps) * Math.PI * 2), spread);
    const mid = {
      x: (prev.x + cur.x) / 2,
      y: (prev.y + cur.y) / 2,
      z: (prev.z + cur.z) / 2,
    };
    const next = behindGlobe(mid) ? null : mid.z >= 0 ? "front" : "back";
    if (next && next !== side) d[next] += `M${at(prev)}`;
    if (next) d[next] += `L${at(cur)}`;
    side = next;
    prev = cur;
  }
  return d;
}

/** A small seeded PRNG, so the server and the browser place the same stars. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STARS = (() => {
  const rand = seeded(7);
  return Array.from({ length: 90 }, () => ({
    x: (rand() - 0.5) * SPACE_W,
    y: (rand() - 0.5) * SPACE_H,
    r: 0.18 + rand() * 0.42,
    accent: rand() < 0.3,
    duration: 2 + rand() * 3,
    delay: -rand() * 5,
  })).filter((star) => Math.hypot(star.x, star.y) > VIEW_R + 3);
})();

type Placement = { x: number; y: number; scale: number };

/**
 * The tech stack as a spinning globe of tags. Hovering (or tapping) a tag
 * stops it where it is while the rest keep turning behind it, blurred.
 */
export default function TechGlobe({ items }: { items: string[] }) {
  const gradientId = useId();
  const haloId = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLLIElement | null)[]>([]);
  const meridianRefs = useRef<{ front: SVGPathElement | null; back: SVGPathElement | null }[]>(
    Array.from({ length: MERIDIANS }, () => ({ front: null, back: null })),
  );
  const orbitRefs = useRef<{ front: SVGPathElement | null; back: SVGPathElement | null }[]>(
    ORBITS.map(() => ({ front: null, back: null })),
  );
  const satelliteRefs = useRef<(SVGCircleElement | null)[][]>(
    SATELLITES.map(() => []),
  );
  const orbitTime = useRef(0);
  const points = useRef(spherePoints(items.length));
  const angle = useRef(0.6);
  const size = useRef(0);
  const spreadStart = useRef<number | null>(null);
  const hoveredRef = useRef(-1);
  const frozen = useRef<Placement>({ x: 0, y: 0, scale: 1 });
  const returning = useRef(new Map<number, Placement & { start: number }>());
  const requestDraw = useRef<() => void>(() => {});
  const [hovered, setHovered] = useState(-1);
  const [calm, setCalm] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let visible = false;
    size.current = box.clientWidth;
    if (still) {
      spreadStart.current = -Infinity;
      setCalm(true);
    }

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!still) {
        angle.current += SPEED * dt;
        orbitTime.current += dt;
      }

      const spread =
        spreadStart.current === null
          ? 0
          : easeOut(Math.min((now - spreadStart.current) / SPREAD_MS, 1));
      const r = size.current * RADIUS * spread;
      const active = hoveredRef.current;
      let settling = false;

      points.current.forEach((p, i) => {
        const el = tagRefs.current[i];
        if (!el) return;
        const q = project(p, angle.current);
        const depth = (q.z + 1) / 2; // 0 at the back, 1 at the front
        let x = q.x * r;
        let y = -q.y * r;
        let scale = 0.62 + 0.48 * depth;
        let opacity = (0.28 + 0.72 * depth) * spread;
        let blur = (1 - depth) * 2.4;

        if (i === active) {
          ({ x, y } = frozen.current);
          scale = frozen.current.scale;
          opacity = 1;
          blur = 0;
        } else {
          if (active !== -1) {
            blur += 2.5;
            opacity *= 0.8;
          }
          const back = returning.current.get(i);
          if (back) {
            const t = Math.min((now - back.start) / RETURN_MS, 1);
            const e = easeOut(t);
            x = back.x + (x - back.x) * e;
            y = back.y + (y - back.y) * e;
            scale = back.scale + (scale - back.scale) * e;
            if (t < 1) settling = true;
            else returning.current.delete(i);
          }
        }

        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
        el.style.zIndex = i === active ? "100" : String(Math.round(depth * 50));
      });

      meridianRefs.current.forEach((paths, k) => {
        const d = circlePaths(meridian(k), angle.current);
        paths.front?.setAttribute("d", d.front);
        paths.back?.setAttribute("d", d.back);
      });

      ORBITS.forEach((orbit, k) => {
        const d = orbitPaths(orbit, spread);
        orbitRefs.current[k].front?.setAttribute("d", d.front);
        orbitRefs.current[k].back?.setAttribute("d", d.back);
      });

      SATELLITES.forEach((sat, s) => {
        const orbit = ORBITS[sat.orbit];
        const head = sat.phase + orbit.speed * orbitTime.current;
        const heading = Math.sign(orbit.speed);
        satelliteRefs.current[s].forEach((dot, k) => {
          if (!dot) return;
          const v = toSpace(orbitPoint(orbit, head - heading * k * 0.045), spread);
          const fade = 1 - k / (TRAIL + 1);
          const near = v.z >= 0;
          dot.setAttribute("cx", v.x.toFixed(2));
          dot.setAttribute("cy", v.y.toFixed(2));
          dot.setAttribute(
            "r",
            ((k === 0 ? 1.3 : 0.9 * fade) * (near ? 1 : 0.8)).toFixed(2),
          );
          dot.style.opacity = behindGlobe(v)
            ? "0"
            : (fade * (near ? 1 : 0.45) * spread).toFixed(3);
        });
      });

      return settling || spread < 1;
    };

    const loop = (now: number) => {
      const busy = draw(now);
      raf = visible && (!still || busy) ? requestAnimationFrame(loop) : 0;
    };

    // One frame on demand, for when the loop is idle (off screen, or still).
    requestDraw.current = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && spreadStart.current === null) {
        spreadStart.current = performance.now();
      }
      if (visible) {
        last = performance.now();
        requestDraw.current();
      }
    });
    observer.observe(box);

    const resize = new ResizeObserver(() => {
      size.current = box.clientWidth;
      requestDraw.current();
    });
    resize.observe(box);

    draw(performance.now());
    return () => {
      observer.disconnect();
      resize.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  /** Where a tag is drawn right now, enlarged the way a held tag is shown. */
  function placementOf(i: number): Placement {
    const q = project(points.current[i], angle.current);
    const depth = (q.z + 1) / 2;
    const r = size.current * RADIUS;
    return {
      x: q.x * r,
      y: -q.y * r,
      scale: Math.max(0.62 + 0.48 * depth, 1) * 1.15,
    };
  }

  function hold(i: number) {
    const current = hoveredRef.current;
    if (current === i) return;
    if (current !== -1) {
      returning.current.set(current, { ...frozen.current, start: performance.now() });
    }
    if (i !== -1) {
      returning.current.delete(i);
      frozen.current = placementOf(i);
    }
    hoveredRef.current = i;
    setHovered(i);
    requestDraw.current();
  }

  function handleTap(event: PointerEvent, i: number) {
    if (event.pointerType === "mouse") return;
    event.stopPropagation();
    hold(hoveredRef.current === i ? -1 : i);
  }

  return (
    <div
      ref={boxRef}
      onPointerUp={(event) => {
        if (event.pointerType !== "mouse") hold(-1);
      }}
      className="relative mx-auto aspect-square w-full max-w-[560px]"
    >

      {/* Space around the globe: stars, its glow, signal rings and orbiting
          satellites. Wider than the box and faded out toward its edges. */}
      <svg
        aria-hidden
        viewBox={`${-SPACE_W / 2} ${-SPACE_H / 2} ${SPACE_W} ${SPACE_H}`}
        style={{ width: `${SPACE_W}%`, height: `${SPACE_H}%` }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_55%,transparent_100%)]"
        fill="none"
      >
        <defs>
          <radialGradient id={haloId}>
            <stop offset="0%" stopColor="#7fb0f0" stopOpacity={0.05} />
            <stop offset="78%" stopColor="#7fb0f0" stopOpacity={0.14} />
            <stop offset="100%" stopColor="#7fb0f0" stopOpacity={0} />
          </radialGradient>
        </defs>

        {STARS.map((star, i) => (
          <circle
            key={i}
            cx={star.x}
            cy={star.y}
            r={star.r}
            fill={star.accent ? "#a8c9f5" : "#ffffff"}
            style={{
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
            className="animate-twinkle"
          />
        ))}

        <circle r={VIEW_R * 1.25} fill={`url(#${haloId})`} />

        {!calm &&
          [0, -2.5].map((delay) => (
            <circle
              key={delay}
              r={VIEW_R}
              stroke="rgba(127,176,240,0.35)"
              strokeWidth={0.3}
              vectorEffect="non-scaling-stroke"
              style={{ animationDelay: `${delay}s` }}
              className="origin-center animate-signal [transform-box:fill-box]"
            />
          ))}

        {orbitRefs.current.map((paths, k) => (
          <g key={k}>
            <path
              ref={(el) => {
                paths.back = el;
              }}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={0.3}
            />
            <path
              ref={(el) => {
                paths.front = el;
              }}
              stroke="rgba(127,176,240,0.3)"
              strokeWidth={0.35}
            />
          </g>
        ))}

        {SATELLITES.map((_, s) => (
          <g key={s}>
            {Array.from({ length: TRAIL + 1 }, (_, k) => (
              <circle
                key={k}
                ref={(el) => {
                  satelliteRefs.current[s][k] = el;
                }}
                fill={k === 0 ? "#ffffff" : "#7fb0f0"}
                style={{ opacity: 0 }}
                className={k === 0 ? "[filter:drop-shadow(0_0_1.5px_#a8c9f5)]" : ""}
              />
            ))}
          </g>
        ))}
      </svg>

      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        fill="none"
        strokeWidth={0.25}
      >
        <defs>
          <radialGradient id={gradientId} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#7fb0f0" stopOpacity={0.16} />
            <stop offset="100%" stopColor="#7fb0f0" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r={VIEW_R} fill={`url(#${gradientId})`} />
        {LATITUDE_PATHS.map((d, i) => (
          <g key={i}>
            <path d={d.back} stroke="rgba(255,255,255,0.05)" />
            <path d={d.front} stroke="rgba(255,255,255,0.14)" />
          </g>
        ))}
        {meridianRefs.current.map((paths, k) => (
          <g key={k}>
            <path
              ref={(el) => {
                paths.back = el;
              }}
              stroke="rgba(255,255,255,0.05)"
            />
            <path
              ref={(el) => {
                paths.front = el;
              }}
              stroke="rgba(127,176,240,0.22)"
            />
          </g>
        ))}
        <circle
          cx="50"
          cy="50"
          r={VIEW_R}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={0.35}
        />
      </svg>

      <ul aria-label="Our tech stack" className="absolute inset-0">
        {items.map((tech, i) => (
          <li
            key={tech}
            ref={(el) => {
              tagRefs.current[i] = el;
            }}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") hold(i);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse" && hoveredRef.current === i) hold(-1);
            }}
            onPointerUp={(event) => handleTap(event, i)}
            style={{ opacity: 0 }}
            className="absolute left-1/2 top-1/2 will-change-transform"
          >
            <span
              className={`block -translate-x-1/2 -translate-y-1/2 cursor-default select-none whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-[background-color,border-color,color,box-shadow] duration-300 sm:px-5 sm:py-2.5 sm:text-sm ${
                hovered === i
                  ? "border-accent/60 bg-accent/20 text-white shadow-[0_0_32px_-4px_rgba(127,176,240,0.75)]"
                  : "border-white/10 bg-navy-900/80 text-white/80"
              }`}
            >
              {tech}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
