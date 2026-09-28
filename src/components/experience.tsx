import { DownloadSimple } from "@phosphor-icons/react/ssr";
import { certifications, education, experience, site } from "@/content";
import { Window } from "./window";

// The résumé, opened in Preview. The toolbar button downloads the real PDF.
export function Experience({ className }: { className?: string }) {
  const download = (
    <a
      href={site.resume}
      download
      aria-label="Download résumé PDF"
      className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-text dark:hover:bg-white/10"
    >
      <DownloadSimple size={18} weight="bold" aria-hidden />
    </a>
  );

  return (
    <Window id="experience" title="Praveen_Singh_Resume.pdf" toolbar={download} className={className}>
      <div className="bg-surface-2/60 p-3 md:p-8">
        <div className="mx-auto max-w-3xl rounded-2xl bg-surface p-6 shadow-[0_1px_3px_rgb(0_0_0/0.08),0_12px_32px_-12px_rgb(0_0_0/0.18)] md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">Experience</h2>
              <p className="mt-1 text-muted">
                {site.role} · {site.location}
              </p>
            </div>
            <a
              href={site.resume}
              download
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-hairline px-5 py-2 text-[14px] font-medium text-accent transition-colors hover:bg-accent-soft"
            >
              <DownloadSimple size={16} weight="bold" aria-hidden />
              Download PDF
            </a>
          </div>

          <ol className="relative mt-8 space-y-8 border-l border-hairline pl-6 md:ml-2">
            {experience.map((job, i) => (
              <li key={job.company} className="relative">
                <span
                  aria-hidden
                  className={`absolute -left-[31px] top-1.5 h-3 w-3 rounded-full ring-4 ring-surface ${i === 0 ? "bg-accent-fill" : "bg-text/25"}`}
                />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-lg font-semibold">
                    {job.title}
                    <span className="font-normal text-muted"> at {job.company}</span>
                  </h3>
                  <p className="text-sm tabular-nums text-muted">
                    {job.start} to {job.end}
                  </p>
                </div>
                <p className="text-sm text-muted">{job.place}</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 leading-relaxed marker:text-text/30">
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <div className="mt-10 grid gap-8 border-t border-hairline pt-8 md:grid-cols-2">
            <section>
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Education</h3>
              <p className="mt-3 font-semibold">{education.degree}</p>
              <p className="text-sm text-muted">
                {education.school}, {education.years}
              </p>
            </section>
            <section>
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Certifications</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {certifications.map((c) => (
                  <li key={c.name} className="flex justify-between gap-3">
                    <span>
                      {c.name} <span className="text-muted">· {c.issuer}</span>
                    </span>
                    <span className="shrink-0 tabular-nums text-muted">{c.date}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </Window>
  );
}
