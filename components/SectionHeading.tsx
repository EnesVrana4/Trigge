import type { ReactNode } from "react";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  action?: ReactNode;
}) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col gap-6 ${
        centered
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between"
      }`}
    >
      <div className={centered ? "max-w-2xl" : ""}>
        <p
          className={`mb-3 text-xs font-semibold uppercase tracking-[0.25em] ${
            dark ? "text-accent" : "text-slate-400"
          }`}
        >
          {eyebrow}
        </p>
        <h2
          className={`text-3xl font-bold tracking-tight sm:text-4xl ${
            dark ? "text-white" : "text-navy-900"
          }`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-4 max-w-xl leading-relaxed ${
              centered ? "mx-auto" : ""
            } ${dark ? "text-white/60" : "text-slate-500"}`}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
