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

type Tone = "green" | "blue" | "orange" | "purple";
type FlowStep = { label: string; detail?: string };
type FlowLane = {
  tone: Tone;
  /** Short tag before the title, e.g. "Rule 1". */
  tag: string;
  title: string;
  /** The section of the post that explains this lane. */
  href?: string;
  /** "out": from the phone to the server. "in": from the server to the screen. */
  direction: "out" | "in";
  /** The steps on the phone, in the order data flows through them. */
  phone: FlowStep[];
  server: FlowStep;
};

function FlowNode({ step, server = false }: { step: FlowStep; server?: boolean }) {
  return (
    <div className={`flow-node${server ? " flow-server" : ""}`}>
      {step.label}
      {step.detail && <small>{step.detail}</small>}
    </div>
  );
}

/**
 * A flow split into lanes, each crossing from the phone to a server (or back)
 * over a dashed "needs signal" line. Plain HTML and CSS (.flow in
 * globals.css): no JavaScript, real text, a vertical layout on phones. Each
 * lane's DOM follows the data, so screen readers and the phone layout read it
 * in order; inbound lanes are drawn right to left on wider screens.
 */
export function FlowDiagram({ label, lanes, caption }: { label: string; lanes: FlowLane[]; caption?: string }) {
  return (
    <figure className="flow not-prose" aria-label={label}>
      <div className="flow-zones" aria-hidden>
        <span>
          <b>On the phone</b> · works offline
        </span>
        <span>
          <b>Server</b> · needs signal
        </span>
      </div>
      <ol className="flow-lanes">
        {lanes.map((lane) => {
          const phone = lane.phone.flatMap((step, i) => [
            ...(i > 0 ? [<span key={`a${i}`} className="flow-arrow" aria-hidden>→</span>] : []),
            <FlowNode key={step.label} step={step} />,
          ]);
          const cross = (
            <span key="cross" className="flow-cross" aria-hidden>
              <span>→</span>
              <em>needs signal</em>
            </span>
          );
          const server = <FlowNode key="server" step={lane.server} server />;
          return (
            <li key={lane.title} data-tone={lane.tone}>
              <p className="flow-title">
                <span>{lane.tag}</span>
                {lane.href ? <a href={lane.href}>{lane.title}</a> : lane.title}
              </p>
              <div className={`flow-row flow-${lane.direction}`}>
                {lane.direction === "out" ? [...phone, cross, server] : [server, cross, ...phone]}
              </div>
            </li>
          );
        })}
      </ol>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

type MergeSource = { who: string; /** Used in "from …" under the result. */ short: string; change: string };

const mergeTones: Tone[] = ["blue", "purple"];

/**
 * Two (or more) offline edits meeting at the server, and what survives:
 * each line of the result is marked with the edit it came from.
 */
export function MergeDiagram({
  label,
  sources,
  result,
  caption,
}: {
  label: string;
  sources: MergeSource[];
  result: { title: string; lines: { text: string; from: number }[]; note?: string };
  caption?: string;
}) {
  return (
    <figure className="merge not-prose" aria-label={label}>
      <div className="merge-grid">
        <ul className="merge-sources">
          {sources.map((source, i) => (
            <li key={source.who} data-tone={mergeTones[i % mergeTones.length]} className="merge-card">
              <span className="merge-who">
                {source.who}
                <span className="merge-tag">offline</span>
              </span>
              <code>{source.change}</code>
            </li>
          ))}
        </ul>
        <span className="merge-join" aria-hidden />
        <div className="merge-card merge-result">
          <span className="merge-who">{result.title}</span>
          <ul>
            {result.lines.map((line) => (
              <li key={line.text} data-tone={mergeTones[line.from % mergeTones.length]}>
                <code>{line.text}</code>
                <small>from the {sources[line.from]?.short}</small>
              </li>
            ))}
          </ul>
          {result.note && <p className="merge-note">{result.note}</p>}
        </div>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
