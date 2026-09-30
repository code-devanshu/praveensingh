import { CaretRight } from "@phosphor-icons/react/ssr";
import { faq } from "@/content";
import { Window } from "./window";

// Quick answers, laid out like a macOS Help viewer. Each answer is in the
// HTML even while collapsed, so search engines and AI tools can read it
// (it's also published as FAQPage structured data on the home page).
export function Faq({ className }: { className?: string }) {
  return (
    <Window id="faq" title="Help" className={className}>
      <div className="p-6 md:p-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Quick answers</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tighter md:text-4xl">Frequently asked questions</h2>
        <div className="mt-6 divide-y divide-hairline">
          {faq.map((item, i) => (
            <details key={item.question} open={i === 0} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg py-3 font-semibold [&::-webkit-details-marker]:hidden">
                <CaretRight
                  size={14}
                  weight="bold"
                  aria-hidden
                  className="shrink-0 text-muted transition-transform group-open:rotate-90"
                />
                <h3>{item.question}</h3>
              </summary>
              <p className="pb-4 pl-[26px] leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </Window>
  );
}
