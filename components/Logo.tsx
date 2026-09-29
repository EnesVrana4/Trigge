import { MARK_T, MARK_TRANSFORM, MARK_TRIANGLE, MARK_VIEWBOX } from "@/lib/intro";

/**
 * The Trigge lockup: the T mark as inline SVG and the wordmark in Montserrat,
 * crisp at any size. It is the same artwork and typeface as the intro's
 * loader, whose flying logo lands on the header's copy of this part by part
 * (the data-logo-* hooks, see HeroScene), so the handover is seamless.
 *
 * The artwork is white (currentColor), so this lockup is made for dark
 * backgrounds.
 */
export default function Logo({
  className = "text-white",
}: {
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        data-logo-mark
        viewBox={MARK_VIEWBOX}
        role="img"
        aria-label="Trigge Solutions"
        className="h-7 w-10 shrink-0"
      >
        <g transform={MARK_TRANSFORM} fill="currentColor">
          <path d={MARK_T} />
          <path d={MARK_TRIANGLE} />
        </g>
      </svg>

      <div className="font-montserrat leading-tight">
        <div data-logo-word className="text-[15px] font-bold tracking-[0.18em]">
          TRIGGE
        </div>
        <div
          data-logo-sol
          className="-mt-0.5 text-[8px] font-semibold tracking-[0.32em] opacity-70"
        >
          SOLUTIONS
        </div>
      </div>
    </div>
  );
}
