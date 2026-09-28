import { CheckCircle } from "@phosphor-icons/react/ssr";
import { process } from "@/content";
import { Window } from "./window";

// Reminders-style checklist: every project goes through each of these.
export function Process({ className }: { className?: string }) {
  return (
    <Window id="process" title="Reminders" className={className}>
      <div className="p-6 md:p-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">How I work</p>
        <h2 className="mt-3 max-w-[20ch] text-3xl font-semibold tracking-tighter md:text-4xl">
          Fast on day one, and still fast after the hundredth release.
        </h2>
        <ol className="mt-8 divide-y divide-hairline">
          {process.map((step) => (
            <li key={step.title} className="flex gap-4 py-4">
              <CheckCircle size={24} weight="fill" className="mt-0.5 shrink-0 text-accent" aria-hidden />
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 leading-relaxed text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Window>
  );
}
