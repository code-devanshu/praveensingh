import { about, site } from "@/content";
import { Avatar } from "./avatar";
import { BuildNumber } from "./build-number";
import { Window } from "./window";

// Laid out like the About This Mac panel, with Praveen as the machine.
export function About({ className }: { className?: string }) {
  return (
    <Window id="about" title="About This Developer" className={className}>
      <div className="flex flex-col items-center gap-8 px-6 py-10 text-center md:flex-row md:items-center md:gap-12 md:px-12 md:text-left">
        <Avatar
          size={176}
          alt={site.name}
          className="h-36! w-36! shadow-lg ring-4 ring-white/70 md:h-44! md:w-44! dark:ring-white/10"
        />
        <div className="w-full">
          <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">{site.name}</h2>
          <p className="mt-1 text-muted">{site.role}</p>
          <dl className="mx-auto mt-6 grid max-w-md grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-left text-sm md:mx-0">
            {about.facts.map((fact) => (
              <div key={fact.label} className="contents">
                <dt className="font-semibold">{fact.label}</dt>
                <dd className="text-muted">{fact.value}</dd>
              </div>
            ))}
            <dt className="font-semibold">Build number</dt>
            <dd>
              <BuildNumber value={about.build} />
            </dd>
          </dl>
          <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="whitespace-nowrap rounded-full border border-hairline bg-surface-2 px-5 py-1.5 text-[13px] font-medium transition-colors hover:bg-accent-soft"
            >
              More Info…
            </a>
            <a
              href="#experience"
              className="whitespace-nowrap rounded-full border border-hairline bg-surface-2 px-5 py-1.5 text-[13px] font-medium transition-colors hover:bg-accent-soft"
            >
              Résumé
            </a>
            <a
              href={site.vcard}
              className="whitespace-nowrap rounded-full border border-hairline bg-surface-2 px-5 py-1.5 text-[13px] font-medium transition-colors hover:bg-accent-soft"
            >
              Add to Contacts
            </a>
          </div>
        </div>
      </div>
      <p className="border-t border-hairline px-6 py-8 text-lg leading-relaxed md:px-12 md:text-xl">
        {about.statement}
      </p>
    </Window>
  );
}
