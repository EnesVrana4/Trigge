import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import PortfolioGrid from "@/components/PortfolioGrid";
import CtaBanner from "@/components/CtaBanner";
import { PORTFOLIO_ENABLED } from "@/lib/data";

export const metadata: Metadata = {
  title: "Portfolio | Trigge Solutions",
  description:
    "Selected projects by Trigge Solutions, e-commerce platforms, CRM dashboards, learning platforms, booking systems and more.",
};

export default function PortfolioPage() {
  // Hidden from the nav, so the URL should not stay quietly reachable either —
  // otherwise search engines keep indexing a page the site no longer links to.
  if (!PORTFOLIO_ENABLED) notFound();

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Ideas turned into working products"
        description="A selection of platforms and websites we have designed and built. Every project below started as a conversation about a real business problem."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <PortfolioGrid />
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
