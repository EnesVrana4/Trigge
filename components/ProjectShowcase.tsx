"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PROJECTS } from "@/lib/data";
import ProjectVisual from "./ProjectVisual";
import TiltCard from "./TiltCard";

type Project = (typeof PROJECTS)[number];

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [ref, inView] = useInView<HTMLElement>();
  // Hold the image entrance until it has downloaded, so a fast scroll never
  // wipes in an empty frame.
  const [loaded, setLoaded] = useState(!project.image);
  const show = inView && loaded;
  const delay = index * 120;

  return (
    <article
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`group transition-[opacity,transform] duration-700 ${EASE} ${
        inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <TiltCard className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm transition-[transform,box-shadow] duration-300 ease-out group-hover:shadow-2xl group-hover:shadow-navy-950/15">
        {/* Entrance: the image settles from a zoom while a curtain wipes off it. */}
        <div
          style={{ transitionDelay: `${delay + 100}ms` }}
          className={`absolute inset-0 transition-transform duration-[1400ms] ${EASE} ${
            show ? "scale-100" : "scale-125"
          }`}
        >
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
            {project.image ? (
              <Image
                src={project.image}
                alt={`${project.title} interface preview`}
                fill
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                onLoad={() => setLoaded(true)}
                className="object-cover"
              />
            ) : (
              <ProjectVisual name={project.visual} />
            )}
          </div>
        </div>
        {/* A covering layer rather than a clip-path: a fully clipped image never
            counts as on screen, so the browser would never lazy-load it. */}
        <div
          aria-hidden
          style={{ transitionDelay: `${delay + 100}ms` }}
          className={`pointer-events-none absolute inset-0 origin-bottom bg-slate-50 transition-transform duration-[1200ms] ${EASE} ${
            show ? "scale-y-0" : "scale-y-100"
          }`}
        />

        {/* A single sweep of light once the image has landed. */}
        <div
          aria-hidden
          style={{ animationDelay: `${delay + 900}ms` }}
          className={`pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,0.5)_50%,transparent_65%)] ${
            show ? "animate-sheen" : ""
          }`}
        />

        <div
          aria-hidden
          className="glare pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        {/* The tags and their shade come in on hover. Touch screens have no
            hover, so there they come in once the image has landed. */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy-950/80 via-navy-950/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
            show ? "[@media(hover:none)]:opacity-100" : ""
          }`}
        />

        <ul className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
          {project.tags.map((tag, t) => (
            <li
              key={tag}
              style={{ transitionDelay: `${t * 70}ms` }}
              className={`translate-y-3 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium text-white opacity-0 backdrop-blur-md transition-all duration-500 ${EASE} group-hover:translate-y-0 group-hover:opacity-100 ${
                show ? "[@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100" : ""
              }`}
            >
              {tag}
            </li>
          ))}
        </ul>
      </TiltCard>

      <div className="mt-5">
        <h3 className="inline bg-gradient-to-r from-accent-dark to-accent bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-0.5 text-lg font-semibold text-navy-900 transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_2px]">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-slate-400">{project.category}</p>
      </div>
    </article>
  );
}

/**
 * The featured projects as image cards. On desktop the middle column drifts
 * against the others while the section scrolls past, for a sense of depth.
 */
export default function ProjectShowcase({ projects }: { projects: Project[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = grid.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 as the grid enters at the bottom, 1 as it leaves at the top.
      const progress = Math.min(
        Math.max((vh - rect.top) / (vh + rect.height), 0),
        1,
      );
      // Lined up with its neighbours when the grid is mid-screen.
      grid.style.setProperty("--drift", `${(0.5 - progress) * 80}px`);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={gridRef}
      className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project, i) => (
        <div
          key={project.title}
          className={
            i % 3 === 1 ? "lg:[transform:translateY(var(--drift,0px))]" : ""
          }
        >
          <ProjectCard project={project} index={i} />
        </div>
      ))}
    </div>
  );
}
