import type { CSSProperties } from "react";
import { Check } from "lucide-react";
import { CONTACT } from "@/lib/data";

export type SendStage = "idle" | "sealing" | "flying" | "delivered" | "failed";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const SPRING = "ease-[cubic-bezier(0.34,1.56,0.64,1)]";

const COPY: Record<SendStage, { title: string; detail: string }> = {
  idle: { title: "", detail: "" },
  sealing: {
    title: "Sealing your message…",
    detail: "Folding it neatly into an envelope.",
  },
  flying: { title: "On its way…", detail: "Heading straight to our inbox." },
  delivered: {
    title: "Delivered!",
    detail: "It's in our inbox. We'll reply within one business day.",
  },
  failed: {
    title: "It didn't go through",
    detail: `Our mailbox caught fire. Please email us directly at ${CONTACT.email}.`,
  },
};

// A little burst around the mailbox once the flag goes up.
const SPARKLES = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
  return {
    x: Math.cos(a) * 38,
    y: Math.sin(a) * 30,
    color: ["#7fb0f0", "#ef4444", "#10b981"][i % 3],
  };
});

// Fire for a failed send: smoke off the roof, embers flying up, and the ash
// the letter falls apart into.
const SMOKE = [
  { left: 186, tx: -18, delay: 1.4, size: 18 },
  { left: 208, tx: 10, delay: 1.9, size: 22 },
  { left: 230, tx: 22, delay: 1.6, size: 16 },
  { left: 198, tx: -6, delay: 2.4, size: 20 },
  { left: 222, tx: 14, delay: 2.8, size: 18 },
];
const EMBERS = [
  { left: 196, tx: -26, ty: -70, delay: 1.2 },
  { left: 214, tx: 8, ty: -90, delay: 1.5 },
  { left: 232, tx: 30, ty: -64, delay: 1.35 },
  { left: 206, tx: -12, ty: -82, delay: 1.9 },
  { left: 226, tx: 18, ty: -76, delay: 2.2 },
  { left: 150, tx: -14, ty: -50, delay: 1.3 },
  { left: 146, tx: 10, ty: -44, delay: 1.7 },
];
const ASH = [-22, -12, -4, 6, 14, 24].map((tx, i) => ({ tx, delay: 2.1 + i * 0.08 }));

// Flame tongues in a 110x90 box, back to front: red, orange, then the yellow core.
const TONGUES = [
  { cx: 26, w: 30, h: 42, fill: "flame-outer", dur: 0.7 },
  { cx: 55, w: 44, h: 66, fill: "flame-outer", dur: 0.9 },
  { cx: 84, w: 30, h: 48, fill: "flame-outer", dur: 0.65 },
  { cx: 32, w: 18, h: 26, fill: "flame-mid", dur: 0.55 },
  { cx: 55, w: 30, h: 46, fill: "flame-mid", dur: 0.75 },
  { cx: 78, w: 18, h: 30, fill: "flame-mid", dur: 0.6 },
  { cx: 55, w: 16, h: 26, fill: "flame-core", dur: 0.5 },
];

/** A teardrop flame: round at the bottom, pointed at `h` above its middle. */
function flamePath(cx: number, w: number, h: number) {
  const r = w / 2;
  const cy = 90 - r;
  return `M${cx - r} ${cy}C${cx - r} ${cy - h * 0.4} ${cx - r * 0.2} ${cy - h * 0.55} ${cx} ${
    cy - h
  }C${cx + r * 0.2} ${cy - h * 0.55} ${cx + r} ${cy - h * 0.4} ${cx + r} ${cy}A${r} ${r} 0 0 1 ${
    cx - r
  } ${cy}Z`;
}

/** Flickering flames that fill their box, growing up from the bottom edge. */
function Flames() {
  return (
    <svg viewBox="0 0 110 90" className="h-full w-full overflow-visible" aria-hidden>
      {TONGUES.map((t, i) => (
        <path
          key={i}
          d={flamePath(t.cx, t.w, t.h)}
          fill={`url(#${t.fill})`}
          style={{
            transformBox: "fill-box",
            transformOrigin: "50% 100%",
            animationDuration: `${t.dur}s`,
            animationDelay: `${-i * 0.13}s`,
          }}
          className="animate-flicker"
        />
      ))}
    </svg>
  );
}

/** The colours the flames use, defined once for every <Flames>. */
function FlameGradients() {
  const stops: Record<string, [string, string, string]> = {
    "flame-outer": ["#dc2626", "#f97316", "#fb923c"],
    "flame-mid": ["#f97316", "#fb923c", "#fbbf24"],
    "flame-core": ["#fde68a", "#fef3c7", "#fefce8"],
  };
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        {Object.entries(stops).map(([id, [bottom, middle, top]]) => (
          <linearGradient key={id} id={id} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={bottom} />
            <stop offset="0.55" stopColor={middle} />
            <stop offset="1" stopColor={top} />
          </linearGradient>
        ))}
      </defs>
    </svg>
  );
}

/** A garden mailbox, seen from the side: door on the left, flag on the right. */
function Mailbox({ open, flagUp }: { open: boolean; flagUp: boolean }) {
  return (
    <svg width="130" height="160" viewBox="0 0 130 160" className="overflow-visible" aria-hidden>
      <rect x="52" y="74" width="14" height="86" rx="2" fill="#1d283f" />
      <rect x="40" y="70" width="38" height="7" rx="2" fill="#2a3752" />
      <path d="M14 72V44a28 28 0 0 1 28-28h44a28 28 0 0 1 28 28v28Z" fill="#131c30" />
      <path
        d="M26 42a16 16 0 0 1 16-16h34"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* The dark opening, seen while the door is down. */}
      <rect
        x="14"
        y="30"
        width="6"
        height="40"
        rx="2"
        fill="#070b14"
        className={`transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <g
        style={{ transformOrigin: "12px 72px", transformBox: "view-box" }}
        className={`transition-transform duration-300 ${EASE} ${
          open ? "[transform:rotate(-100deg)]" : "[transform:rotate(0deg)]"
        }`}
      >
        <rect x="8" y="28" width="8" height="44" rx="3" fill="#2a3752" />
        <circle cx="12" cy="47" r="1.8" fill="#7fb0f0" />
      </g>
      <g
        style={{
          transformOrigin: "96px 62px",
          transformBox: "view-box",
          transitionDelay: flagUp ? "250ms" : "0ms",
        }}
        className={`transition-transform duration-500 ${SPRING} ${
          flagUp ? "[transform:rotate(0deg)]" : "[transform:rotate(-90deg)]"
        }`}
      >
        <rect x="94" y="18" width="4" height="44" rx="2" fill="#cbd5e1" />
        <path d="M98 18h17a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H98Z" fill="#ef4444" />
      </g>
      <circle cx="96" cy="62" r="3" fill="#cbd5e1" />
    </svg>
  );
}

/** An envelope that takes in a letter and seals itself when `sealed` turns on. */
function Envelope({ sealed }: { sealed: boolean }) {
  return (
    <div className="relative h-[60px] w-[92px] [perspective:400px]">
      <div className="absolute inset-0 z-0 rounded-md border border-slate-200 bg-slate-100" />
      <div
        style={{ transitionDelay: sealed ? "250ms" : "300ms" }}
        className={`absolute inset-x-2 top-1 z-[2] h-[50px] rounded-sm border border-slate-100 bg-white p-2 shadow-sm transition-transform duration-500 ${EASE} ${
          sealed ? "translate-y-0" : "-translate-y-10"
        }`}
      >
        <span className="block h-1 w-10 rounded bg-slate-200" />
        <span className="mt-1.5 block h-1 w-14 rounded bg-slate-200" />
        <span className="mt-1.5 block h-1 w-8 rounded bg-accent/60" />
      </div>
      {/* Front pocket, which hides the letter once it slides in. */}
      <svg
        viewBox="0 0 92 60"
        preserveAspectRatio="none"
        className="absolute inset-0 z-[3] h-full w-full"
        aria-hidden
      >
        <path
          d="M1 59V22l45 22 45-22v37Z"
          fill="#ffffff"
          stroke="#e2e8f0"
          strokeLinejoin="round"
        />
      </svg>
      {/* The flap: folded up behind the letter while open, over it once closed. */}
      <svg
        viewBox="0 0 92 36"
        style={{ transitionDelay: sealed ? "750ms" : "0ms" }}
        className={`absolute inset-x-0 top-0 h-[36px] w-full origin-top transition-transform duration-500 ${EASE} ${
          sealed ? "z-[4] [transform:rotateX(0deg)]" : "z-[1] [transform:rotateX(180deg)]"
        }`}
        aria-hidden
      >
        <path
          d="M1 1l45 33L91 1Z"
          fill="#f8fafc"
          stroke="#e2e8f0"
          strokeLinejoin="round"
        />
      </svg>
      <span
        style={{ transitionDelay: sealed ? "1150ms" : "0ms" }}
        className={`absolute left-1/2 top-[27px] z-[5] -ml-2 h-4 w-4 rounded-full bg-accent-dark shadow-[0_0_0_3px_rgba(127,176,240,0.25)] transition-transform duration-300 ${SPRING} ${
          sealed ? "scale-100" : "scale-0"
        }`}
      />
    </div>
  );
}

/**
 * The send animation shown over the contact form: the message is sealed in an
 * envelope, flown into a garden mailbox, and the flag goes up once it lands.
 * If the send fails, the mailbox catches fire and the letter burns up at the
 * door instead. Positions are fixed in a 280x220 stage so the paths line up.
 */
export default function MailboxScene({ stage }: { stage: SendStage }) {
  const sealed = stage !== "idle";
  const delivered = stage === "delivered";
  const burning = stage === "failed";
  const copy = COPY[stage];

  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <FlameGradients />
      <div className="relative h-[220px] w-[280px]">
        <div className="absolute inset-x-2 bottom-6 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

        {burning && (
          <div className="absolute left-[160px] top-0 h-[110px] w-[110px] animate-ignite rounded-full bg-orange-400/35 blur-2xl" />
        )}

        <div className="absolute left-[150px] top-[36px]">
          <Mailbox open={stage === "flying"} flagUp={delivered} />
        </div>

        {burning && (
          <>
            <div className="absolute left-[159px] top-[-18px] h-[90px] w-[110px] origin-bottom animate-ignite">
              <Flames />
            </div>
            {SMOKE.map((s, i) => (
              <span
                key={`smoke-${i}`}
                style={
                  {
                    "--tx": `${s.tx}px`,
                    left: s.left,
                    width: s.size,
                    height: s.size,
                    animationDelay: `${s.delay}s`,
                  } as CSSProperties
                }
                className="absolute top-[-6px] animate-smoke rounded-full bg-slate-400/60 blur-[2px]"
              />
            ))}
            {EMBERS.map((e, i) => (
              <span
                key={`ember-${i}`}
                style={
                  {
                    "--tx": `${e.tx}px`,
                    "--ty": `${e.ty}px`,
                    left: e.left,
                    animationDelay: `${e.delay}s`,
                  } as CSSProperties
                }
                className={`absolute top-[60px] h-1 w-1 animate-ember rounded-full ${
                  i % 2 ? "bg-amber-300" : "bg-orange-500"
                }`}
              />
            ))}
          </>
        )}

        <span
          style={{ transitionDelay: delivered ? "450ms" : "0ms" }}
          className={`absolute left-[191px] top-[2px] flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-transform duration-500 ${SPRING} ${
            delivered ? "scale-100" : "scale-0"
          }`}
        >
          <Check size={16} strokeWidth={3} />
        </span>

        {delivered &&
          SPARKLES.map((s, i) => (
            <span
              key={i}
              style={
                {
                  "--tx": `${s.x}px`,
                  "--ty": `${s.y}px`,
                  backgroundColor: s.color,
                  animationDelay: "500ms",
                } as CSSProperties
              }
              className="absolute left-[203px] top-[72px] h-1.5 w-1.5 animate-burst rounded-full"
            />
          ))}

        {/* The envelope: hovers while sending, then flies in through the door,
            or burns up in front of it when the send fails. */}
        <div
          className={`absolute left-[24px] top-[98px] ${
            stage === "flying"
              ? "animate-letter"
              : burning
                ? "animate-letter-burn"
                : delivered
                  ? "opacity-0"
                  : ""
          }`}
        >
          <div
            className={
              stage === "sealing" ? "animate-bob" : burning ? "animate-char" : ""
            }
          >
            <Envelope sealed={sealed} />
          </div>
        </div>

        {burning && (
          <>
            <div className="absolute left-[130px] top-[52px] h-[40px] w-[44px] origin-bottom animate-flare">
              <Flames />
            </div>
            {ASH.map((a, i) => (
              <span
                key={`ash-${i}`}
                style={
                  { "--tx": `${a.tx}px`, animationDelay: `${a.delay}s` } as CSSProperties
                }
                className="absolute left-[150px] top-[90px] h-1 w-1.5 animate-ash rounded-[1px] bg-slate-700"
              />
            ))}
          </>
        )}
      </div>

      <div role="status" aria-live="polite" className="mt-1 min-h-[3.5rem] text-center">
        <div key={stage} className="animate-appear">
          <p className="text-base font-semibold text-navy-900">{copy.title}</p>
          <p className="mt-1 text-sm text-slate-500">{copy.detail}</p>
        </div>
      </div>
    </div>
  );
}
