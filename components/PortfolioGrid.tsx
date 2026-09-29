"use client";

import { useState } from "react";
import { PROJECTS, PROJECT_CATEGORIES } from "@/lib/data";
import ProjectVisual from "./ProjectVisual";

export default function PortfolioGrid() {
  const [active, setActive] =
    useState<(typeof PROJECT_CATEGORIES)[number]>("All");

  const filtered =
    active === "All"
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {PROJECT_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            aria-pressed={active === category}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition duration-300 ${
              active === category
                ? "border-navy-950 bg-navy-950 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-navy-900"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <article
            key={project.title}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl"
          >
            <div className="aspect-[4/3] overflow-hidden border-b border-slate-100">
              <ProjectVisual name={project.visual} />
            </div>

            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">
                {project.category}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-navy-900">
                {project.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-slate-500">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}
