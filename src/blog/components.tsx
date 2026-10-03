// Components a post can use in its MDX without importing them (they're
// registered in src/mdx-components.tsx). They follow the site's own look:
// metric cards like the Work window, a Reminders-style checklist.

import { CheckCircle, Info, Warning } from "@phosphor-icons/react/ssr";

type Glance = {
  problem: string;
  fix: string;
  /** Headline result, e.g. "16 → 0". */
  result: string;
  /** What the result measures, e.g. "TypeScript errors". */
  resultLabel: string;
};

/** The post in five seconds: problem, fix and the headline number. */
export function AtAGlance({ problem, fix, result, resultLabel }: Glance) {
  return (
    <aside aria-label="At a glance" className="not-prose my-8 rounded-xl bg-surface-2 p-5">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">At a glance</p>
      <dl className="mt-3 grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-sm text-muted">Problem</dt>
          <dd className="mt-1 text-[15px] leading-snug">{problem}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Fix</dt>
          <dd className="mt-1 text-[15px] leading-snug">{fix}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Result</dt>
          <dd className="mt-1">
            <span className="block text-3xl font-semibold tracking-tight text-accent tabular-nums">{result}</span>
            <span className="text-sm text-muted">{resultLabel}</span>
          </dd>
        </div>
      </dl>
    </aside>
  );
}

/** A 2–3 sentence answer up front: what AI search and skimmers take away. */
export function ShortAnswer({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-6 border-l-2 border-accent-fill pl-4 text-[1.0625rem] leading-relaxed">
      <p className="mb-1 text-sm font-semibold text-accent">Short answer</p>
      {children}
    </div>
  );
}

/** Something that bit me, and how to avoid it. */
export function Gotcha({ title = "Gotcha", children }: { title?: string; children: React.ReactNode }) {
  return (
    <div role="note" className="not-prose my-6 rounded-xl bg-[#ff9f0a]/12 p-4 text-[0.9375rem] leading-relaxed">
      <p className="flex items-center gap-1.5 font-semibold text-[#b25000] dark:text-[#ffb340]">
        <Warning size={18} weight="bold" aria-hidden />
        {title}
      </p>
      <div className="mt-1.5 [&>p+p]:mt-2">{children}</div>
    </div>
  );
}

/** A neutral aside: context, a caveat or how something was measured. */
export function Note({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div role="note" className="not-prose my-6 rounded-xl bg-surface-2 p-4 text-[0.9375rem] leading-relaxed">
      {title && (
        <p className="flex items-center gap-1.5 font-semibold">
          <Info size={18} weight="bold" aria-hidden className="text-accent" />
          {title}
        </p>
      )}
      <div className={`${title ? "mt-1.5 " : ""}[&>p+p]:mt-2`}>{children}</div>
    </div>
  );
}

/** The takeaways as a Reminders-style checklist. */
export function Takeaways({ items }: { items: string[] }) {
  return (
    <ul className="not-prose my-6 divide-y divide-hairline rounded-xl bg-surface-2 px-4">
      {items.map((item) => (
        <li key={item} className="flex gap-3 py-3 leading-snug">
          <CheckCircle size={22} weight="fill" aria-hidden className="mt-px shrink-0 text-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
