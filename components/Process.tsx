import { PROCESS } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import ProcessTimeline from "./ProcessTimeline";

/**
 * On `pin` screens the section is a tall scroll track with a screen-high
 * sticky frame inside: the content holds still in the middle of the viewport
 * while scrolling draws the timeline, then the page moves on. The extra
 * 1000px is three steps of STEP_SCROLL (see ProcessTimeline) plus a short hold.
 */
export default function Process() {
  return (
    <section className="relative overflow-clip bg-white py-20 lg:py-28 pin:py-0">
      <div data-process-track className="pin:h-[calc(100vh+1000px)]">
        <div className="relative pin:sticky pin:top-0 pin:flex pin:h-screen pin:items-center">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(#dfe5ee_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_50%,#000_10%,transparent_100%)]" />
            <div className="absolute inset-x-0 top-1/3 flex justify-center">
              <div className="h-[340px] w-[640px] max-w-full animate-float rounded-full bg-accent/10 blur-3xl" />
            </div>
          </div>

          <div className="container-page relative w-full">
            <Reveal>
              <SectionHeading
                eyebrow="How we work"
                title="A process built on clarity"
                description="Four simple stages, with you involved at every step, so you always know what is happening and what comes next."
                align="center"
              />
            </Reveal>

            <ProcessTimeline steps={PROCESS} />
          </div>
        </div>
      </div>
    </section>
  );
}
