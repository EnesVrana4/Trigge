import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-navy-950 py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-pattern opacity-60" />
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container-page relative text-center">
        <p className="text-[6rem] font-bold leading-none tracking-tight text-white/10 sm:text-[9rem]">
          404
        </p>
        <h1 className="-mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          This page took a wrong turn
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-white/60">
          The page you are looking for does not exist or has been moved. Let&apos;s
          get you back on track.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/" className="btn-primary group">
            <ArrowLeft
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to home
          </Link>
          <Link href="/contact" className="btn-outline">
            Contact us <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
