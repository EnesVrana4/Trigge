import type { ProjectVisualKey } from "@/lib/data";

function Ecommerce() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-3 bg-[#f2ede6] p-6">
      <div className="h-full w-3/4 rounded-lg bg-white p-3 shadow-sm">
        <p className="text-[10px] font-semibold text-slate-700">Modern Style</p>
        <p className="text-[8px] text-slate-400">Better Living</p>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded bg-slate-100" />
          ))}
        </div>
      </div>
      <div className="hidden h-3/4 w-1/4 rounded-lg bg-white p-2 shadow-sm sm:block">
        <div className="h-1/2 rounded bg-slate-100" />
        <div className="mt-1.5 h-1.5 w-3/4 rounded bg-slate-200" />
        <div className="mt-1 h-1.5 w-1/2 rounded bg-slate-200" />
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="flex h-full w-full bg-[#eef1f6] p-4">
      <div className="hidden w-1/5 flex-col gap-2 sm:flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="h-1.5 w-full rounded-full bg-slate-200" />
        ))}
      </div>
      <div className="flex-1 space-y-2 sm:pl-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="h-14 rounded-lg bg-white shadow-sm" />
          <div className="h-14 rounded-lg bg-white shadow-sm" />
        </div>
        <div className="flex h-16 items-end gap-1 rounded-lg bg-white p-2 shadow-sm">
          {[40, 70, 55, 90, 60, 75, 45].map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className="flex-1 rounded-sm bg-accent/70"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Learning() {
  return (
    <div className="flex h-full w-full bg-navy-900 p-4">
      <div className="hidden w-1/4 flex-col gap-2 border-r border-white/10 pr-3 sm:flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="h-1.5 w-full rounded-full bg-white/10" />
        ))}
      </div>
      <div className="flex-1 space-y-2 sm:pl-3">
        <span className="block h-2 w-1/3 rounded-full bg-white/20" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 rounded-lg bg-white/5 p-1.5"
            >
              <span className="h-4 w-4 shrink-0 rounded-full bg-accent/50" />
              <span className="h-1.5 w-full rounded-full bg-white/10" />
            </div>
          ))}
        </div>
        <div className="h-10 rounded-lg bg-white/5" />
      </div>
    </div>
  );
}

function Booking() {
  return (
    <div className="flex h-full w-full flex-col bg-[#f4f6fa] p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="h-2 w-20 rounded-full bg-slate-300" />
        <span className="h-5 w-12 rounded-full bg-accent/60" />
      </div>
      <div className="grid flex-1 grid-cols-7 gap-1.5">
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className={`rounded ${
              [4, 9, 15, 22].includes(i)
                ? "bg-accent/70"
                : "bg-white shadow-sm"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function RealEstate() {
  return (
    <div className="flex h-full w-full gap-2 bg-[#eceff4] p-4">
      <div className="flex w-1/2 flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-1 gap-2 rounded-lg bg-white p-2 shadow-sm">
            <div className="h-full w-1/3 rounded bg-slate-200" />
            <div className="flex-1 space-y-1.5 pt-1">
              <span className="block h-1.5 w-3/4 rounded-full bg-slate-200" />
              <span className="block h-1.5 w-1/2 rounded-full bg-accent/50" />
            </div>
          </div>
        ))}
      </div>
      <div className="relative w-1/2 overflow-hidden rounded-lg bg-slate-300">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute left-1/4 top-0 h-full w-px bg-white" />
          <div className="absolute left-2/3 top-0 h-full w-px bg-white" />
          <div className="absolute left-0 top-1/3 h-px w-full bg-white" />
          <div className="absolute left-0 top-2/3 h-px w-full bg-white" />
        </div>
        <span className="absolute left-1/3 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-accent" />
      </div>
    </div>
  );
}

function Logistics() {
  return (
    <div className="flex h-full w-full flex-col justify-between bg-navy-900 p-5">
      <div className="flex items-center justify-between">
        <span className="h-2 w-24 rounded-full bg-white/20" />
        <span className="h-5 w-16 rounded-full bg-emerald-400/30" />
      </div>
      <div className="relative flex items-center">
        <div className="h-0.5 w-full rounded-full bg-white/10" />
        <div className="absolute left-0 h-0.5 w-2/3 rounded-full bg-accent" />
        {[0, 33, 66, 100].map((left, i) => (
          <span
            key={left}
            style={{ left: `${left}%` }}
            className={`absolute h-3 w-3 -translate-x-1/2 rounded-full border-2 ${
              i < 3 ? "border-accent bg-navy-900" : "border-white/20 bg-navy-900"
            }`}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-white/5 p-2">
            <span className="block h-1.5 w-2/3 rounded-full bg-white/15" />
            <span className="mt-1.5 block h-1.5 w-1/2 rounded-full bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

const VISUALS: Record<ProjectVisualKey, () => JSX.Element> = {
  ecommerce: Ecommerce,
  dashboard: Dashboard,
  learning: Learning,
  booking: Booking,
  realestate: RealEstate,
  logistics: Logistics,
};

export default function ProjectVisual({ name }: { name: ProjectVisualKey }) {
  const Visual = VISUALS[name];
  return <Visual />;
}
