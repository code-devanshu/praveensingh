"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, BluetoothConnected, ContactlessPayment, CreditCard, Info } from "@phosphor-icons/react";
import { projects, type Project } from "@/content";
import { Phone } from "./phone";
import { Lightbox, ScreenshotStrip, StoreList } from "./store-apps";
import { Window } from "./window";

// Finder-style sidebar filters, one per industry.
const filters = ["All", ...new Set(projects.map((p) => p.domain))];
type Filter = string;

const matches = (project: Project, filter: Filter) => filter === "All" || project.domain === filter;

// Corner tags on a card's image area ("Retired", "Illustration").
const tag =
  "absolute top-4 rounded-full bg-surface/85 px-2.5 py-1 text-[11px] font-semibold text-muted ring-1 ring-hairline backdrop-blur";

// Phosphor has no NFC glyph; the contactless waves read as "tap".
const capabilityIcons = { payments: CreditCard, nfc: ContactlessPayment, ble: BluetoothConnected };

// Stand-ins for products that can't be shown: wireframe screens in a phone,
// unbranded, in the site's own colours and tagged "Illustration", so they
// can't be mistaken for the real app.

// A credit card app's home screen as a wireframe: the card, balance and
// amount due, recent transactions and a Pay button. No figures or names.
function CardAppScreen() {
  const bar = "block h-1.5 rounded-full bg-text/15";
  const card = "rounded-xl bg-surface p-2.5 shadow-[0_1px_2px_rgb(0_0_0/0.06)]";
  return (
    <div className="flex h-full flex-col gap-2 px-3 pt-10">
      <div className="flex items-center justify-between px-0.5">
        <span className={`${bar} h-2 w-16 bg-text/25`} />
        <span className="h-5 w-5 rounded-full bg-text/10" />
      </div>
      <div className="relative aspect-[1.586] w-full rounded-xl bg-linear-to-br from-[#3a3a40] via-[#1f1f23] to-[#0b0b0d] p-2.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_6px_14px_-6px_rgb(0_0_0/0.45)]">
        <span className="block h-3.5 w-5 rounded-[4px] bg-linear-to-br from-[#f3d690] to-[#b58a3c]" />
        <span className="absolute bottom-2.5 left-2.5 font-mono text-[8px] tracking-[0.2em] text-white/60">•••• ••••</span>
        <span className="absolute bottom-2 right-2.5 flex">
          <span className="h-3.5 w-3.5 rounded-full bg-white/25" />
          <span className="-ml-1.5 h-3.5 w-3.5 rounded-full bg-white/15" />
        </span>
      </div>
      <div className={`${card} flex gap-3`}>
        {[0, 1].map((i) => (
          <span key={i} className="flex flex-1 flex-col gap-1.5">
            <span className={`${bar} w-10`} />
            <span className={`${bar} h-2 w-14 bg-text/25`} />
          </span>
        ))}
      </div>
      <div className={`${card} flex flex-col gap-2.5`}>
        {[16, 12, 18].map((w, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="h-5 w-5 shrink-0 rounded-full bg-text/10" />
            <span className={bar} style={{ width: `${w * 4}px` }} />
            <span className={`${bar} ml-auto w-6`} />
          </span>
        ))}
      </div>
      <span className="block h-7 shrink-0 rounded-full bg-accent-fill" />
    </div>
  );
}

// A telecom app's home screen as a wireframe: usage ring, an alert and a
// billing chart. Text is grey bars, so no figures are implied.
function DashboardScreen() {
  const bar = "block h-1.5 rounded-full bg-text/15";
  const card = "rounded-xl bg-surface p-2.5 shadow-[0_1px_2px_rgb(0_0_0/0.06)]";
  return (
    <div className="flex h-full flex-col gap-2 px-3 pt-10">
      <div className="flex items-center justify-between px-0.5">
        <span className={`${bar} h-2 w-16 bg-text/25`} />
        <span className="h-5 w-5 rounded-full bg-text/10" />
      </div>
      <div className={`${card} flex items-center gap-2.5`}>
        <svg viewBox="0 0 36 36" className="h-10 w-10 shrink-0 -rotate-90">
          <circle cx="18" cy="18" r="14" fill="none" strokeWidth="5" className="stroke-text/10" />
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${0.68 * 2 * Math.PI * 14} ${2 * Math.PI * 14}`}
            className="stroke-accent-fill"
          />
        </svg>
        <span className="flex flex-1 flex-col gap-1.5">
          <span className={`${bar} w-12 bg-text/25`} />
          <span className={`${bar} w-16`} />
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-[#ff3b30]/10 px-2.5 py-2">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#ff3b30]" />
        <span className="block h-1.5 w-16 rounded-full bg-[#ff3b30]/35" />
        <span className="ml-auto block h-1.5 w-4 rounded-full bg-text/15" />
      </div>
      <div className={card}>
        <span className={`${bar} w-14 bg-text/25`} />
        <div className="mt-2.5 flex h-12 items-end gap-1">
          {[45, 70, 55, 85, 62, 100].map((h, i, all) => (
            <span
              key={i}
              className={`flex-1 rounded-t-[3px] ${i === all.length - 1 ? "bg-accent-fill" : "bg-accent-fill/25"}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      {[0, 1].map((i) => (
        <div key={i} className={`${card} flex items-center gap-2`}>
          <span className="h-5 w-5 rounded-md bg-text/10" />
          <span className={`${bar} w-20`} />
        </div>
      ))}
    </div>
  );
}

function Placeholder({ kind }: NonNullable<Project["placeholder"]>) {
  return (
    <Phone
      wireframe={kind === "card" ? <CardAppScreen /> : <DashboardScreen />}
      className="mt-6 w-[190px] shrink-0 self-start"
    />
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [active, setActive] = useState(0);
  const [viewing, setViewing] = useState<number | null>(null);
  const app = project.apps?.[active];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-2">
      <div className="relative flex h-60 justify-center overflow-hidden bg-[linear-gradient(160deg,var(--accent-soft),transparent_75%)]">
        {app ? (
          <ScreenshotStrip key={app.name} app={app} onOpen={setViewing} />
        ) : project.screen ? (
          <Phone
            src={project.screen}
            alt={`${project.name} app screenshot (placeholder)`}
            sizes="190px"
            className="mt-6 w-[190px] shrink-0 self-start"
          />
        ) : (
          project.placeholder && <Placeholder {...project.placeholder} />
        )}
        {project.retired && <span className={`${tag} left-4`}>Retired</span>}
        {!app && !project.screen && project.placeholder && (
          <span className={`${tag} right-4`}>
            Illustration<span className="sr-only"> of {project.placeholder.caption}</span>
          </span>
        )}
      </div>
      {app && <Lightbox app={app} index={viewing} onIndex={setViewing} />}
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
        <Link
          href={`/work/${project.slug}`}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          Read the case study<span className="sr-only">: {project.name}</span>
          <ArrowRight size={14} weight="bold" aria-hidden />
        </Link>
        {project.capabilities && (
          <ul className="mt-5 divide-y divide-hairline rounded-2xl bg-surface-2">
            {project.capabilities.map(({ icon, title, body }) => {
              const Icon = capabilityIcons[icon];
              return (
                <li key={title} className="flex gap-3 px-3.5 py-3">
                  <Icon size={22} weight="duotone" aria-hidden className="mt-px shrink-0 text-accent" />
                  <p className="text-sm leading-snug">
                    <span className="font-semibold">{title}</span>
                    <span className="text-muted"> · {body}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        )}
        {(project.retired ?? project.note) && (
          <p className="mt-3 flex gap-2 rounded-xl bg-surface-2 px-3 py-2 text-sm leading-snug text-muted">
            <Info size={16} weight="bold" aria-hidden className="mt-0.5 shrink-0" />
            {project.retired ?? project.note}
          </p>
        )}
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
        {project.apps && <StoreList apps={project.apps} active={active} onSelect={setActive} />}
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
