import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Target, Gem, Handshake } from "lucide-react";
import PageHero from "@/components/PageHero";
import Collaboration from "@/components/Collaboration";
import CtaBanner from "@/components/CtaBanner";
import StructuredData from "@/components/StructuredData";
import { pageMeta } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import { PORTFOLIO_ENABLED, VALUES } from "@/lib/data";

const PAGE = {
  path: "/about",
  title: "Software Development Team in Pennsylvania",
  description:
    "Meet the team behind Trigge Solutions: a software studio in Pennsylvania building websites and web platforms for clients in all 50 states and across Canada.",
};

export const metadata: Metadata = pageMeta({
  ...PAGE,
  keywords: [
    "software development company Pennsylvania",
    "web development agency Philadelphia",
    "software development team",
    "custom software company near me",
  ],
});

const VALUE_ICONS = [Target, Gem, Handshake];

export default function AboutPage() {
  return (
    <>
      <StructuredData {...PAGE} />
      <PageHero
        eyebrow="About us"
        title="A small team with a long-term view"
        description="Trigge Solutions is a software studio based in Croydon, Pennsylvania. We build digital products for businesses that want technology to actually move their work forward, not add to it."
        background="/background/about-background.webp"
      />

      <section className="bg-white py-20 lg:py-24">
        <div className="container-page grid gap-14 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <p className="eyebrow mb-3 !text-slate-400">Our story</p>
              <h2 className="text-3xl font-bold tracking-tight text-navy-900">
                Built on the work, not the pitch
              </h2>
              <div className="mt-5 space-y-4 leading-relaxed text-slate-500">
                <p>
                  Trigge Solutions started with a simple observation: plenty of
                  businesses were paying for software they could not use, could
                  not change and did not own.
                </p>
                <p>
                  So we built the studio around the opposite idea. Every project
                  starts with a real conversation about the problem, runs in
                  short iterations you can follow, and ends with a product,
                  and a codebase, that belongs entirely to you.
                </p>
                <p>
                  Today we work with businesses in all 50 states and across
                  Canada in e-commerce, real estate, healthcare, manufacturing, education
                  and finance, from single landing pages to platforms used
                  daily by whole teams.
                </p>
              </div>
              {PORTFOLIO_ENABLED && (
                <Link
                  href="/portfolio"
                  className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy-900 transition-colors hover:text-accent-dark"
                >
                  See our work
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              )}
            </div>
          </Reveal>

          <div className="grid gap-5">
            {VALUES.map((value, i) => {
              const Icon = VALUE_ICONS[i];
              return (
                <Reveal key={value.title} delay={i * 90}>
                  <div className="flex gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-white">
                      <Icon size={20} strokeWidth={1.7} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900">
                        {value.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <Collaboration />

      <div className="bg-white pt-16">
        <CtaBanner />
      </div>
    </>
  );
}
