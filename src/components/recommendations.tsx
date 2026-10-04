import { recommendations } from "@/content";
import { Window } from "./window";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

// LinkedIn recommendations, laid out as a Messages thread. Each one types in
// after a "…" bubble as it scrolls into view (data-message, lib/effects.ts).
export function Recommendations({ className }: { className?: string }) {
  return (
    <Window id="recommendations" title="Messages" className={className}>
      <div className="px-4 py-8 md:px-10">
        <h2 className="text-center text-xs font-medium text-muted">
          Recommendations from LinkedIn
        </h2>
        <ul className="mt-6 space-y-6">
          {recommendations.map((r) => (
            <li key={r.name} data-message className="flex items-end gap-2.5">
              <span
                aria-hidden
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-[#a1a1a6] to-[#6e6e73] text-[11px] font-semibold text-white"
              >
                {initials(r.name)}
              </span>
              <figure className="relative min-w-0 max-w-[80%]">
                <figcaption className="mb-1 pl-3 text-xs text-muted">
                  <span className="font-semibold text-text">{r.name}</span> · {r.role}
                </figcaption>
                <blockquote className="rounded-[20px] rounded-bl-md bg-surface-2 px-4 py-2.5 leading-relaxed">
                  “{r.quote}”
                </blockquote>
                <p data-message-meta className="mt-1 pl-3 text-[11px] text-muted">
                  {r.relation}
                </p>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </Window>
  );
}
