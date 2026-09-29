import { forwardRef } from "react";
import { MARK_T, MARK_TRANSFORM, MARK_TRIANGLE, MARK_VIEWBOX } from "@/lib/intro";

export const LOADER_WORDS = ["IDEAS", "CODE", "SOLUTIONS"];
const DIM = "#3b4046";

/**
 * The first-visit loader: the mark drawn by a pen over a spreading blueprint
 * grid, a counter, then a black curtain that lifts while the logo flies into
 * the navbar. Rendered in its opening state; HeroScene drives every moving
 * part through the `data-k` hooks. Hidden by CSS unless <html data-intro> is
 * set, which the inline script in Hero does before the first paint.
 */
const IntroLoader = forwardRef<HTMLDivElement>(function IntroLoader(_, ref) {
  return (
    <div ref={ref} aria-hidden className="intro-loader fixed inset-0 z-[200] text-white">
      {/* Curtain */}
      <div data-k="curtain" className="absolute inset-0 bg-black" style={{ clipPath: "inset(0 0 0% 0)" }}>
        <div data-k="glow" className="absolute inset-0" />
        <div
          data-k="grid"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.075) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.075) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "192px 192px, 192px 192px, 48px 48px, 48px 48px",
            backgroundPosition: "50% 45.5%",
            maskImage: "radial-gradient(circle at 50% 45.5%, #000 0px, transparent 0px)",
            WebkitMaskImage: "radial-gradient(circle at 50% 45.5%, #000 0px, transparent 0px)",
          }}
        />
        {/* Words and counter, 120px under the centre of the mark */}
        <div
          data-k="ui"
          className="absolute inset-x-0 flex flex-col items-center gap-[22px] opacity-0"
          style={{
            top: "calc(45.5% + 120px * var(--s0, 1))",
            transform: "scale(var(--s0, 1))",
            transformOrigin: "50% 0",
          }}
        >
          <div className="flex items-center gap-3.5 font-montserrat text-xs font-semibold tracking-[0.3em]">
            {LOADER_WORDS.map((word, i) => (
              <span key={word} className="contents">
                <span data-k={`word-${i}`} style={{ color: i === 0 ? "#ffffff" : DIM, transition: "color 240ms ease-out" }}>
                  {word}
                </span>
                {i < LOADER_WORDS.length - 1 && (
                  <span data-k={`arrow-${i}`} className="tracking-normal" style={{ color: DIM }}>
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative h-px w-80 bg-[#24282c]">
              <div data-k="bar" className="absolute left-0 top-0 h-px w-0 bg-white" />
            </div>
            <div data-k="count" className="w-9 text-right font-jetbrains text-xs tabular-nums">
              000
            </div>
          </div>
        </div>
      </div>

      {/* Light riding the curtain's lower edge */}
      <div
        data-k="edge"
        className="absolute inset-x-0 top-full h-px opacity-0"
        style={{
          background: "linear-gradient(90deg, rgba(157,186,240,0) 0%, rgba(157,186,240,0.9) 50%, rgba(157,186,240,0) 100%)",
        }}
      />

      {/* Logo lockup: rests centred; at the exit its mark, TRIGGE and SOLUTIONS
          each fly onto their twin in the header's logo */}
      <div
        data-k="lockup"
        className="absolute left-0 top-0 flex items-center gap-[22px]"
        style={{ transformOrigin: "0 0", visibility: "hidden" }}
      >
        <svg data-k="mark" width="110" height="77" viewBox={MARK_VIEWBOX} className="shrink-0 overflow-visible" style={{ transformOrigin: "0 0" }}>
          <g data-k="fill" transform={MARK_TRANSFORM} fill="#ffffff" style={{ fillOpacity: 0 }}>
            <path d={MARK_T} />
            <path data-k="fill2" d={MARK_TRIANGLE} style={{ fillOpacity: 0 }} />
          </g>
          <polyline
            data-k="stroke"
            points=""
            fill="none"
            stroke="#ffffff"
            strokeWidth={22}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <circle data-k="pen-glow" r={70} fill="#9dbaf0" opacity={0} />
          <circle data-k="pen" r={22} fill="#ffffff" opacity={0} />
        </svg>
        <div className="flex flex-col gap-1.5">
          <div data-k="word" className="flex origin-top-left overflow-hidden font-montserrat text-[44px] font-bold leading-[44px] tracking-[0.1em]">
            {"TRIGGE".split("").map((ch, i) => (
              <span
                key={i}
                data-k="letter"
                className="inline-block"
                style={{ opacity: 0, transform: "translateY(46px)" }}
              >
                {ch}
              </span>
            ))}
          </div>
          <div
            data-k="sol"
            className="origin-top-left font-montserrat text-[11px] font-semibold leading-3 text-[#d6dae0]"
            style={{ letterSpacing: "0.95em", opacity: 0 }}
          >
            SOLUTIONS
          </div>
        </div>
      </div>
    </div>
  );
});

export default IntroLoader;
