/**
 * Line icons in the lucide style (paths adapted from lucide, ISC) whose parts
 * move while `active`, each acting out the point of its card.
 */

const SVG = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

type IconProps = { active: boolean };

/** Direct communication: someone is typing. */
export function ChatIcon({ active }: IconProps) {
  return (
    <svg {...SVG}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      {[8, 12, 16].map((cx, i) => (
        <circle
          key={cx}
          cx={cx}
          cy={10}
          r={1}
          fill="currentColor"
          stroke="none"
          style={{ animationDelay: `${i * 150}ms` }}
          className={`origin-center [transform-box:fill-box] ${
            active ? "animate-typing" : ""
          }`}
        />
      ))}
    </svg>
  );
}

/** Fixed scope: the quote gets signed off. */
export function ScopeIcon({ active }: IconProps) {
  return (
    <svg {...SVG}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path
        d="m9 15 2 2 4-4"
        pathLength={1}
        strokeDasharray={1}
        style={{ animationDelay: "150ms" }}
        className={active ? "animate-draw" : ""}
      />
    </svg>
  );
}

// Bottom to top, so they settle in the order they are built.
const LAYERS = [
  "m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",
  "m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",
  "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",
];

/** Built to last: the layers stack up. */
export function LayersIcon({ active }: IconProps) {
  return (
    <svg {...SVG}>
      {LAYERS.map((d, i) => (
        <path
          key={d}
          d={d}
          style={{ animationDelay: `${i * 120}ms` }}
          className={active ? "animate-stack" : ""}
        />
      ))}
    </svg>
  );
}

/** Performance first: the needle swings into the fast zone. */
export function GaugeIcon({ active }: IconProps) {
  return (
    <svg {...SVG}>
      <path
        d="M3.34 19a10 10 0 1 1 17.32 0"
        pathLength={1}
        strokeDasharray={1}
        className={active ? "animate-draw" : ""}
      />
      <path
        d="m12 14 4-4"
        style={{ transformOrigin: "12px 14px", animationDelay: "100ms" }}
        className={`[transform-box:view-box] ${active ? "animate-sweep" : ""}`}
      />
    </svg>
  );
}
