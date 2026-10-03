import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import ServicesGrid from "@/components/ServicesGrid";
import CtaBanner from "@/components/CtaBanner";
import StructuredData from "@/components/StructuredData";
import { pageMeta } from "@/lib/seo";
import TechGlobe from "@/components/TechGlobe";
import { TECH } from "@/lib/data";

const PAGE = {
  path: "/services",
  title: "Web Development & Custom Software Services",
  description:
    "Web development, custom web applications, e-commerce, UI/UX design, API integrations and ongoing support for businesses in the United States.",
};

export const metadata: Metadata = pageMeta({
  ...PAGE,
});

export default function ServicesPage() {
  return (
    <>
      <StructuredData {...PAGE} />
      <PageHero
        eyebrow="Services"
        title="Software built around your business"
        description="We design, build and maintain digital products, websites, platforms and internal tools that make your day-to-day work simpler and your customers happier."
        background="/background/service-background.webp"
      />

      <section className="bg-white py-20 lg:py-24">
        <div className="container-page">
          <ServicesGrid detailed />
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-50" />
        <div className="container-page relative">
          <SectionHeading
            eyebrow="Tech stack"
            title="Modern tools, chosen for a reason"
            description="We work with a proven, well-supported stack, fast to build on, easy to host and simple for another developer to pick up later."
            align="center"
            dark
          />

          <div className="mt-8">
            <TechGlobe items={TECH} />
          </div>
        </div>
      </section>

      <div className="bg-white pt-16">
        <CtaBanner />
      </div>
    </>
  );
}
