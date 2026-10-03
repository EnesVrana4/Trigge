import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import StructuredData from "@/components/StructuredData";
import { SERVICES } from "@/lib/data";
import { SERVICE_CONTENT } from "@/lib/service-content";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return SERVICES.map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

function getService(slug: string) {
  const service = SERVICES.find((item) => item.slug === slug);
  if (!service) notFound();
  return { service, content: SERVICE_CONTENT[service.key] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service, content } = getService((await params).slug);
  return pageMeta({ ...content, path: `/services/${service.slug}` });
}

export default async function ServicePage({ params }: Props) {
  const { service, content } = getService((await params).slug);
  const path = `/services/${service.slug}`;
  return (
    <>
      <StructuredData path={path} title={content.title} description={content.description} service={service} />
      <PageHero eyebrow="Our services" title={content.title} description={content.description} />
      <div className="container-page py-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-navy-900">Home</Link><span aria-hidden>/</span>
          <Link href="/services" className="hover:text-navy-900">Services</Link><span aria-hidden>/</span>
          <span aria-current="page" className="text-navy-900">{service.title}</span>
        </nav>
      </div>
      <section className="container-page grid gap-10 pb-16 pt-6 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-navy-900">Built around the work you need to do</h2>
          <p className="mt-5 leading-relaxed text-slate-600">{content.introduction}</p>
          <h3 className="mt-8 text-xl font-semibold text-navy-900">Is this right for your business?</h3>
          <p className="mt-3 leading-relaxed text-slate-600">{content.fit}</p>
        </div>
        <aside className="self-start rounded-2xl bg-navy-950 p-7 text-white sm:p-9">
          <p className="eyebrow">Start with a conversation</p>
          <h2 className="mt-4 text-2xl font-bold">A clear scope before you commit</h2>
          <p className="mt-4 leading-relaxed text-white/70">Tell us what you need. We will discuss the approach, identify constraints and prepare a written quote for the agreed work.</p>
          <Link href="/contact" className="btn-primary mt-6 inline-flex gap-2">Get a free consultation <ArrowRight size={18} /></Link>
          <p className="mt-5 text-sm text-white/60">Based in Pennsylvania. Serving businesses across the United States.</p>
        </aside>
      </section>
      <section className="bg-slate-50 py-16">
        <div className="container-page">
          <h2 className="text-3xl font-bold tracking-tight text-navy-900">What we can build with you</h2>
          <p className="mt-3 text-slate-600">We agree on the deliverables your project needs during discovery.</p>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {content.deliverables.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-7">
                <Check className="text-accent-dark" size={22} aria-hidden />
                <h3 className="mt-4 text-xl font-semibold text-navy-900">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="container-page grid gap-12 py-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="text-3xl font-bold text-navy-900">How the project runs</h2>
          <ol className="mt-6 space-y-5">
            {content.process.map((step, i) => (
              <li key={step} className="flex gap-4 leading-relaxed text-slate-600">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-950 text-sm font-semibold text-white">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-navy-900">Budget and timeline</h2>
          <p className="mt-5 leading-relaxed text-slate-600">{content.budget}</p>
          <h3 className="mt-8 text-xl font-semibold text-navy-900">What to bring to the first call</h3>
          <p className="mt-3 leading-relaxed text-slate-600">{content.preparation}</p>
        </div>
      </section>
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container-page max-w-4xl">
          <h2 className="text-3xl font-bold text-navy-900">Common questions</h2>
          <div className="mt-6 divide-y divide-slate-200">
            {content.faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="cursor-pointer text-lg font-semibold text-navy-900">{faq.question}</summary>
                <p className="mt-4 leading-relaxed text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="container-page py-16">
        <h2 className="text-2xl font-bold text-navy-900">Related services</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {content.related.map((key) => {
            const related = SERVICES.find((item) => item.key === key)!;
            return <Link key={key} href={`/services/${related.slug}`} className="rounded-2xl border border-slate-200 p-6 transition hover:border-accent hover:shadow-md">
              <h3 className="flex items-center justify-between gap-3 font-semibold text-navy-900">{related.title}<ArrowRight size={18} aria-hidden /></h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{related.short}</p>
            </Link>;
          })}
        </div>
      </section>
    </>
  );
}
