import AnimatedBackground from "./AnimatedBackground";

export default function PageHero({
  eyebrow,
  title,
  description,
  background,
}: {
  eyebrow: string;
  title: string;
  description: string;
  /** Optional animated background, e.g. "/background/service-background.webp". */
  background?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-16 pt-32 lg:pb-20 lg:pt-40">
      <div className="pointer-events-none absolute inset-0">
        {/* The grid is only for heroes without an animation behind them. */}
        {background ? (
          <>
            <AnimatedBackground src={background} priority />
            {/* Dark veil so the headline stays readable over the animation.
                Lower the opacity to let more of the background show through. */}
            <div className="absolute inset-0 bg-navy-950/80" />
          </>
        ) : (
          <div className="absolute inset-0 grid-pattern opacity-60" />
        )}
        <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-navy-950" />
      </div>

      <div className="container-page relative max-w-3xl">
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60">
          {description}
        </p>
      </div>
    </section>
  );
}
