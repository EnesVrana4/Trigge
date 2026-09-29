import type { ServiceKey } from "@/lib/data";

/**
 * Small line illustrations of each service, drawn in currentColor. Still
 * while inactive; `active` sets them moving (keyframes in tailwind.config.ts).
 */

const SVG = {
  width: 120,
  height: 72,
  viewBox: "0 0 120 72",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

// Solid shapes: filled, no outline.
const SOLID = { fill: "currentColor", stroke: "none" } as const;

type SceneProps = { active: boolean };

/** Code types itself out in a browser window. */
function WebScene({ active }: SceneProps) {
  const lines = [
    { x: 12, y: 25, w: 44 },
    { x: 20, y: 34, w: 60 },
    { x: 20, y: 43, w: 40 },
    { x: 12, y: 52, w: 26 },
  ];
  return (
    <svg {...SVG}>
      <rect x="1" y="1" width="118" height="70" rx="7" />
      <path d="M1 14h118" />
      {[9, 16, 23].map((cx) => (
        <circle key={cx} cx={cx} cy="7.5" r="1.6" {...SOLID} />
      ))}
      {lines.map((line, i) => (
        <rect
          key={i}
          x={line.x}
          y={line.y}
          width={line.w}
          height="3.5"
          rx="1.75"
          opacity={0.75}
          {...SOLID}
          style={{ animationDelay: `${i * 350}ms` }}
          className={`origin-left [transform-box:fill-box] ${active ? "animate-type" : ""}`}
        />
      ))}
      <rect
        x="42"
        y="51"
        width="1.8"
        height="6"
        rx="0.9"
        {...SOLID}
        className={active ? "animate-blink" : "opacity-0"}
      />
    </svg>
  );
}

const BARS = [22, 34, 18, 40, 28, 36];

/** A dashboard whose chart keeps updating. */
function AppsScene({ active }: SceneProps) {
  return (
    <svg {...SVG}>
      <rect x="1" y="1" width="118" height="70" rx="7" />
      <path d="M30 1v70" />
      {[12, 20, 28, 36].map((y, i) => (
        <rect
          key={y}
          x="8"
          y={y}
          width={i === 0 ? 16 : 12}
          height="3"
          rx="1.5"
          opacity={i === 0 ? 0.9 : 0.45}
          {...SOLID}
        />
      ))}
      <rect x="39" y="10" width="30" height="3.5" rx="1.75" opacity={0.6} {...SOLID} />
      {BARS.map((h, i) => (
        <rect
          key={i}
          x={39 + i * 13}
          y={64 - h}
          width="8"
          height={h}
          rx="1.5"
          opacity={0.8}
          {...SOLID}
          style={{
            animationDelay: `${i * 140}ms`,
            animationDuration: `${1300 + (i % 3) * 250}ms`,
          }}
          className={`origin-bottom [transform-box:fill-box] ${active ? "animate-bars" : ""}`}
        />
      ))}
    </svg>
  );
}

/** A parcel drops into the cart and the badge pops. */
function EcommerceScene({ active }: SceneProps) {
  return (
    <svg {...SVG}>
      {/* lucide shopping-cart, scaled up; strokes keep their width. */}
      <g transform="translate(34 14) scale(2.4)">
        <circle cx="8" cy="21" r="1" vectorEffect="non-scaling-stroke" />
        <circle cx="19" cy="21" r="1" vectorEffect="non-scaling-stroke" />
        <path
          d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
          vectorEffect="non-scaling-stroke"
        />
      </g>
      <g className={active ? "animate-drop" : ""}>
        <rect x="56" y="33" width="17" height="14" rx="2" />
        <path d="M64.5 33v14" opacity={0.6} />
      </g>
      <circle
        cx="91"
        cy="22"
        r="5.5"
        {...SOLID}
        className={`origin-center [transform-box:fill-box] ${active ? "animate-pop" : ""}`}
      />
    </svg>
  );
}

/** A bezier curve being drawn and adjusted. */
function DesignScene({ active }: SceneProps) {
  return (
    <svg {...SVG}>
      <path d="M12 58 34 14" strokeDasharray="2 3" opacity={0.5} />
      <path d="M108 46 78 12" strokeDasharray="2 3" opacity={0.5} />
      <path
        d="M12 58C34 14 78 12 108 46"
        strokeWidth={2}
        pathLength={1}
        strokeDasharray={1}
        className={active ? "animate-redraw" : ""}
      />
      <rect x="8.5" y="54.5" width="7" height="7" rx="1.5" {...SOLID} />
      <rect x="104.5" y="42.5" width="7" height="7" rx="1.5" {...SOLID} />
      <circle cx="34" cy="14" r="2.8" />
      <circle cx="78" cy="12" r="2.8" />
      <g className={active ? "animate-nudge" : ""}>
        <path
          d="M82 16v13l3.5-3.2 2.5 5.2 2.2-1-2.4-5.1 4.7-.3Z"
          {...SOLID}
        />
      </g>
    </svg>
  );
}

/** Data flowing between two systems through a hub. */
function IntegrationsScene({ active }: SceneProps) {
  const packets = [
    { x: 30, delay: 0 },
    { x: 30, delay: 700 },
    { x: 72, delay: 350 },
    { x: 72, delay: 1050 },
  ];
  return (
    <svg {...SVG}>
      <rect x="2" y="22" width="28" height="28" rx="7" />
      <path d="M10 31h12M10 36h8M10 41h10" opacity={0.6} />
      <path d="M30 36h18M72 36h18" opacity={0.4} />
      <circle cx="60" cy="36" r="12" />
      <circle cx="60" cy="36" r="4.5" {...SOLID} />
      <circle
        cx="60"
        cy="36"
        r="12"
        className={`origin-center [transform-box:fill-box] ${active ? "animate-ripple" : "opacity-0"}`}
      />
      <rect x="90" y="22" width="28" height="28" rx="7" />
      <path d="m98 36 4 4 8-8" />
      {packets.map((packet, i) => (
        <circle
          key={i}
          cx={packet.x}
          cy="36"
          r="2.2"
          {...SOLID}
          style={{ animationDelay: `${packet.delay}ms` }}
          className={active ? "animate-packet" : "opacity-0"}
        />
      ))}
    </svg>
  );
}

const PULSE = "M2 42h32l6-12 6 24 6-36 6 32 5-8h43";

/** A heartbeat running across a status line. */
function SupportScene({ active }: SceneProps) {
  return (
    <svg {...SVG}>
      <rect x="2" y="6" width="24" height="3" rx="1.5" opacity={0.5} {...SOLID} />
      <rect x="2" y="13" width="14" height="3" rx="1.5" opacity={0.3} {...SOLID} />
      <path d={PULSE} opacity={0.25} />
      <path
        d={PULSE}
        strokeWidth={2}
        pathLength={1}
        strokeDasharray="0.32 0.68"
        className={active ? "animate-trace" : ""}
      />
      <circle cx="112" cy="42" r="3.5" {...SOLID} />
      <circle
        cx="112"
        cy="42"
        r="3.5"
        {...SOLID}
        className={`origin-center [transform-box:fill-box] ${active ? "animate-ripple" : "opacity-0"}`}
      />
    </svg>
  );
}

const SCENES: Record<ServiceKey, (props: SceneProps) => JSX.Element> = {
  web: WebScene,
  apps: AppsScene,
  ecommerce: EcommerceScene,
  design: DesignScene,
  integrations: IntegrationsScene,
  support: SupportScene,
};

export default function ServiceScene({
  name,
  active,
}: {
  name: ServiceKey;
  active: boolean;
}) {
  const Scene = SCENES[name];
  return <Scene active={active} />;
}
