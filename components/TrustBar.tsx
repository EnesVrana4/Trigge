import {
  ShoppingBag,
  Building2,
  HeartPulse,
  Factory,
  GraduationCap,
  LineChart,
} from "lucide-react";

const INDUSTRY_ICONS = [
  { label: "E-Commerce", Icon: ShoppingBag },
  { label: "Real Estate", Icon: Building2 },
  { label: "Healthcare", Icon: HeartPulse },
  { label: "Manufacturing", Icon: Factory },
  { label: "Education", Icon: GraduationCap },
  { label: "Finance", Icon: LineChart },
];

export default function TrustBar() {
  return (
    <section className="border-y border-slate-100 bg-[#f7f9fc] py-12">
      <div className="container-page">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
          Digital products for a range of industries
        </p>

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {INDUSTRY_ICONS.map(({ label, Icon }) => (
            <div
              key={label}
              className="group flex flex-col items-center gap-3 text-center"
            >
              <Icon
                size={28}
                strokeWidth={1.5}
                className="text-slate-400 transition-colors duration-300 group-hover:text-navy-900"
              />
              <span className="text-sm text-slate-500 transition-colors duration-300 group-hover:text-navy-900">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
