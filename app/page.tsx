import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import SectionHeading from "@/components/SectionHeading";
import ServicesGrid from "@/components/ServicesGrid";
import Stats from "@/components/Stats";
import Process from "@/components/Process";
import Projects from "@/components/Projects";
import WhyUs from "@/components/WhyUs";
import FAQ from "@/components/FAQ";
import CtaBanner from "@/components/CtaBanner";
import StructuredData from "@/components/StructuredData";
import { pageMeta } from "@/lib/seo";

const PAGE = {
  path: "/",
  title: "Trigge Solutions | Website & Web App Development",
  description:
    "Trigge Solutions builds custom websites, web apps and e-commerce platforms for businesses across the United States. Free consultation, fixed written quote.",
};

export const metadata: Metadata = pageMeta({
  ...PAGE,
  absolute: true,
});

export default function Home() {
  return (
    <>
      <StructuredData {...PAGE} faq />
      <Hero />
      <TrustBar />

      <section className="bg-white py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we do"
            title="Everything your product needs"
            description="From the first sketch to long-term support, one team covering the full lifecycle of your digital platform."
            action={
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-navy-900 transition-colors hover:text-accent-dark"
              >
                All services
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            }
          />
          <div className="mt-12">
            <ServicesGrid limit={6} />
          </div>
        </div>
      </section>

      <Stats />
      <Process />
      <Projects />
      <WhyUs />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions we get asked a lot"
            description="If you don't find your answer here, just send us a message, we're happy to explain."
            align="center"
          />
          <div className="mt-8">
            <FAQ />
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
