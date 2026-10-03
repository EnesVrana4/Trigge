import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PORTFOLIO_ENABLED, PROJECTS } from "@/lib/data";
import ProjectShowcase from "./ProjectShowcase";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

/**
 * Presented as capabilities, not delivered client work: the studio has no
 * published client projects yet, and the cards below are illustrative builds
 * (the preview images are concept designs for a made-up brand, not client
 * screenshots).
 *
 * Keep the copy forward-looking — "what we build", not "what we have built" —
 * until there is real work to show, then flip PORTFOLIO_ENABLED in lib/data.ts.
 */
export default function Projects() {
  const featured = PROJECTS.slice(0, 3);

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Capabilities"
            title="Products we build"
            description="Illustrative concepts showing the kinds of platforms we can build. These previews are examples of capabilities, not completed client projects. Your product would be designed around your own requirements."
            action={
              PORTFOLIO_ENABLED ? (
                <Link
                  href="/portfolio"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-navy-900 transition-colors hover:text-accent-dark"
                >
                  View All
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              ) : undefined
            }
          />
        </Reveal>

        <ProjectShowcase projects={featured} />
      </div>
    </section>
  );
}
