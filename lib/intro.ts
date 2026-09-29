/**
 * Shared pieces of the first-visit intro and the animated hero, ported from
 * the approved prototype in trigge-intro-handoff/. All times are "design ms":
 * the clock runs at SPEED, so divide by 1.2 for real milliseconds.
 */

export const SPEED = 1.2;

/**
 * sessionStorage key set once the intro has played or been skipped. Session
 * storage lives as long as the tab: moving around the site (even with a full
 * reload) doesn't replay the intro, but opening the site in a new tab does.
 */
export const INTRO_SEEN_KEY = "trigge_intro_seen";

/** Key moments of the timeline, in design ms. */
export const T = {
  curtain: 3650, // the curtain starts to lift; skipping jumps here
  flightEnd: 4650, // the logo lands in the navbar slot
  nav: 4400, // nav links start dropping in
  navEnd: 5590, // last nav item has settled (4400 + 4 * 110 + 750)
  loaderGone: 4950, // flying logo has faded into the real one
  done: 7600, // devices are in place; the carousel takes over
} as const;

export const CAROUSEL_MS = 3200;

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const out = (p: number) => 1 - Math.pow(1 - p, 3);
export const io = (p: number) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

export const WORK = [
  { key: "furniture", desk: "/intro/screens/01-furniture-desktop.jpg", phone: "/intro/screens/01-furniture-mobile.jpg", alt: "Furniture store website" },
  { key: "crm", desk: "/intro/screens/02-crm-desktop.jpg", phone: "/intro/screens/02-crm-mobile.jpg", alt: "Sales CRM dashboard" },
  { key: "stays", desk: "/intro/screens/03-stays-desktop.jpg", phone: "/intro/screens/03-stays-mobile.jpg", alt: "Mediterranean stays booking site" },
  { key: "projects", desk: "/intro/screens/04-projects-desktop.jpg", phone: "/intro/screens/04-projects-mobile.jpg", alt: "Project management app" },
  { key: "home-services", desk: "/intro/screens/05-home-services-desktop.jpg", phone: "/intro/screens/05-home-services-mobile.jpg", alt: "Kitchen and plumbing services website" },
];

/** The Trigge mark: the big T, and the small triangle inside it. */
export const MARK_T =
  "M11820 14388 l-685 -6 -2965 -11 -2965 -11 -2353 0 -2353 0 3 -14 3 -14 99 -104 99 -103 151 -155 151 -156 200 -209 200 -210 81 -85 82 -85 42 -45 43 -45 226 -235 227 -235 99 -105 100 -105 10 -11 10 -11 191 -199 192 -199 48 -54 49 -53 32 -14 32 -14 1990 0 1990 0 28 -11 28 -10 30 -31 30 -31 -4 -5647 -4 -5647 12 -7 12 -7 68 73 68 73 43 45 42 45 131 135 132 135 174 185 175 185 155 160 156 161 215 224 215 225 110 115 109 115 136 140 135 141 211 219 211 220 64 69 64 68 19 30 19 29 -6 392 -6 392 -11 465 -11 465 6 580 6 580 4 365 4 365 1 2420 1 2420 9 39 8 38 27 28 27 28 43 11 42 11 4027 -1 4026 0 35 7 34 6 208 216 208 216 115 120 116 121 99 105 100 105 105 110 105 109 156 161 155 160 96 100 95 100 26 28 26 28 183 192 183 192 136 140 136 140 51 54 52 53 0 15 0 14 -267 -2 -268 -2 -3605 4 -3605 4 -685 -7z";
export const MARK_TRIANGLE =
  "M11954 10006 l-34 -34 0 -2135 0 -2136 11 -7 12 -7 66 71 66 70 75 79 74 78 95 100 95 100 227 235 226 235 114 120 114 120 100 105 99 105 160 165 159 165 101 105 101 105 95 100 94 100 101 105 100 105 231 240 232 240 47 50 47 50 81 85 81 85 100 105 101 105 235 245 235 244 111 116 110 115 99 105 99 105 34 32 34 33 -5 15 -6 15 -2042 0 -2041 0 -34 -34z";
/** Maps the path's own coordinates into the 1975x1389 viewBox. */
export const MARK_TRANSFORM = "translate(-49.853352,1439.500000) scale(0.100000,-0.100000)";
export const MARK_VIEWBOX = "0 0 1975 1389";

type Outline = { pts: [number, number][]; cum: number[]; total: number };

/** The mark's outline as a polyline in viewBox units, for the pen to trace. */
export function parseOutline(d: string): Outline {
  // The path only uses M, relative l and z.
  const tokens = d.match(/[MmLlZz]|-?\d*\.?\d+/g) ?? [];
  const tx = (x: number) => -49.853352 + 0.1 * x;
  const ty = (y: number) => 1439.5 - 0.1 * y;
  let i = 0;
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let cmd = "M";
  const raw: [number, number][] = [];
  while (i < tokens.length) {
    const token = tokens[i];
    if (/[MmLlZz]/.test(token)) {
      cmd = token;
      i++;
      if (cmd === "z" || cmd === "Z") raw.push([sx, sy]);
      continue;
    }
    const a = Number(tokens[i]);
    const b = Number(tokens[i + 1]);
    i += 2;
    if (cmd === "M") {
      cx = sx = a;
      cy = sy = b;
    } else if (cmd === "m" || cmd === "l") {
      cx += a;
      cy += b;
    } else {
      cx = a;
      cy = b;
    }
    raw.push([cx, cy]);
  }
  const pts = raw.map(([x, y]) => [tx(x), ty(y)] as [number, number]);
  const cum = [0];
  for (let j = 1; j < pts.length; j++) {
    cum.push(cum[j - 1] + Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]));
  }
  return { pts, cum, total: cum[cum.length - 1] };
}

/** The first `p` (0-1) of the outline, and where the pen tip is. */
export function partialOutline(s: Outline, p: number) {
  if (p <= 0) return { points: "", x: s.pts[0][0], y: s.pts[0][1] };
  const target = p * s.total;
  const out: string[] = [];
  let hx = s.pts[0][0];
  let hy = s.pts[0][1];
  for (let j = 0; j < s.pts.length; j++) {
    if (s.cum[j] <= target) {
      out.push(`${s.pts[j][0].toFixed(1)},${s.pts[j][1].toFixed(1)}`);
      [hx, hy] = s.pts[j];
    } else {
      const f = (target - s.cum[j - 1]) / (s.cum[j] - s.cum[j - 1] || 1);
      hx = s.pts[j - 1][0] + (s.pts[j][0] - s.pts[j - 1][0]) * f;
      hy = s.pts[j - 1][1] + (s.pts[j][1] - s.pts[j - 1][1]) * f;
      out.push(`${hx.toFixed(1)},${hy.toFixed(1)}`);
      break;
    }
  }
  return { points: out.join(" "), x: hx, y: hy };
}
