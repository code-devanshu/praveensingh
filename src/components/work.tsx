"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { projects, type Project } from "@/content";
import { Phone } from "./phone";
import { Window } from "./window";

// Finder-style sidebar filters, one per industry.
const filters = ["All", ...new Set(projects.map((p) => p.domain))];
type Filter = string;

const matches = (project: Project, filter: Filter) => filter === "All" || project.domain === filter;

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-2">
      <div className="relative flex h-60 justify-center overflow-hidden bg-[linear-gradient(160deg,var(--accent-soft),transparent_75%)] pt-6">
        <Phone
          src={project.screen}
          alt={`${project.name} app screenshot (placeholder)`}
          sizes="190px"
          className="w-[190px] shrink-0 self-start"
        />
      </div>
      <div className="flex-1 border-t border-hairline bg-surface p-6">
        <p className="text-sm text-muted">
          {project.company} · {project.year}
        </p>
        <h3 className="mt-1.5 text-2xl font-semibold tracking-tight">
          {project.href ? (
            <a href={project.href} className="inline-flex items-center gap-1.5 hover:text-accent">
              {project.name}
              <ArrowUpRight size={18} weight="bold" aria-hidden />
            </a>
          ) : (
            project.name
          )}
        </h3>
        <p className="mt-2 leading-relaxed text-muted">{project.summary}</p>
        {project.metrics && (
          <dl className="mt-5 grid grid-cols-2 gap-2">
            {project.metrics.map((m) => (
              <div key={m.label} className="rounded-2xl bg-surface-2 px-3.5 py-3">
                <dt className="text-xs text-muted">{m.label}</dt>
                <dd className="mt-1 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-2xl font-semibold tracking-tight text-accent tabular-nums">{m.change}</span>
                  <span className="whitespace-nowrap text-xs tabular-nums text-muted">
                    {m.before} → {m.after}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        )}
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li key={tech} className="rounded-full border border-hairline px-3 py-1 text-xs font-medium">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Work() {
  const [filter, setFilter] = useState<Filter>("All");
  const reduce = useReducedMotion();
  const shown = projects.filter((p) => matches(p, filter));

  const filterButton = (f: Filter, className: string) => (
    <button
      key={f}
      type="button"
      aria-pressed={filter === f}
      onClick={() => setFilter(f)}
      className={className}
    >
      {f}
      <span className="ml-auto pl-3 text-xs tabular-nums text-muted">
        {projects.filter((p) => matches(p, f)).length}
      </span>
    </button>
  );

  return (
    <Window id="work" title="Selected Work">
      <div className="flex">
        <aside className="hidden w-52 shrink-0 border-r border-hairline bg-surface-2/60 p-3 md:block">
          <p className="px-2 pb-1.5 pt-2 text-[11px] font-semibold text-muted">Industries</p>
          <div className="flex flex-col gap-0.5">
            {filters.map((f) =>
              filterButton(
                f,
                "flex items-center rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium transition-colors hover:bg-black/5 aria-pressed:bg-accent-soft aria-pressed:text-accent dark:hover:bg-white/10",
              ),
            )}
          </div>
        </aside>

        <div className="min-w-0 flex-1 p-4 md:p-8">
          <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">Selected work</h2>
          <p className="mt-2 max-w-[60ch] text-muted">
            Production apps for Android and iOS. Numbers are from release builds and production telemetry.
          </p>

          {/* Phones get the sidebar as a scrolling segmented control instead. */}
          <div className="-mx-4 mt-5 overflow-x-auto px-4 [scrollbar-width:none] md:hidden">
            <div role="group" aria-label="Industries" className="flex w-max rounded-full bg-surface-2 p-1">
              {filters.map((f) =>
                filterButton(
                  f,
                  "flex items-center justify-center whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors aria-pressed:bg-surface aria-pressed:shadow-sm [&>span]:hidden",
                ),
              )}
            </div>
          </div>

          <motion.ul layout={!reduce} className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((project) => (
                <motion.li
                  key={project.name}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProjectCard project={project} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </div>
      <p className="border-t border-hairline px-4 py-2 text-center text-xs text-muted">
        {shown.length} {shown.length === 1 ? "item" : "items"}
      </p>
    </Window>
  );
}
