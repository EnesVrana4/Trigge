import Reveal from "./Reveal";
import TeamBoard from "./TeamBoard";

const HIGHLIGHTS = [
  "Weekly progress demo",
  "Staging link from week one",
  "Shared board with real status",
];

export default function Collaboration() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-50" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-[420px] w-[420px] animate-drift rounded-full bg-accent/10 blur-3xl" />

      <div className="container-page relative grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
        <div>
          <Reveal>
            <p className="eyebrow mb-3">How we work together</p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              One team around your project
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-white/60">
              Design, development and quality assurance work in the same loop,
              with you in it, not at the end of it. Weekly demos, a live staging
              link and a shared board keep everyone on the same page.
            </p>
          </Reveal>

          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map((item, i) => (
              <Reveal key={item} delay={150 + i * 90}>
                <li className="flex items-center gap-3 text-sm text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {item}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <TeamBoard />
      </div>
    </section>
  );
}
