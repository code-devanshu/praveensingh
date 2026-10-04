import type { Metadata } from "next";
import Link from "next/link";
import { DownloadSimple } from "@phosphor-icons/react/ssr";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { about, certifications, education, experience, projects, site, stack } from "@/content";
import { absolute, breadcrumbs, caseStudyPath, ids, pageMetadata } from "@/lib/seo";

// The résumé as a web page: search engines and AI tools read HTML far
// better than a PDF, and it links through to the case studies.
const title = "Résumé, Senior React Native Developer";
const description = `${site.name}'s résumé: ${site.role} in ${site.location}, with 5+ years at upGrad, Delightree, Gojoko, Invia and WebMobril.`;

export const metadata: Metadata = pageMetadata({ title, description, path: "/resume", type: "profile" });

const heading = "text-xs font-medium uppercase tracking-[0.18em] text-accent";

export default function Resume() {
  return (
    <PageShell
      title={site.resume.split("/").pop()!.replace(".pdf", "")}
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Résumé", path: "/resume" },
      ]}
    >
      <JsonLd
        nodes={[
          {
            "@type": "ProfilePage",
            "@id": absolute("/resume#page"),
            url: absolute("/resume"),
            name: `${site.name}, résumé`,
            mainEntity: { "@id": ids.person },
            isPartOf: { "@id": ids.website },
            dateModified: site.updated,
          },
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Résumé", path: "/resume" },
          ]),
        ]}
      />

      <article className="px-6 py-10 md:px-12">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tighter md:text-5xl">{site.name}</h1>
            <p className="mt-1 text-lg text-muted">
              {site.role} · {site.location}
            </p>
            <p className="mt-2 text-sm">
              <a href={`mailto:${site.email}`} className="text-accent hover:underline">
                {site.email}
              </a>
              <span className="text-muted"> · </span>
              <a href={site.linkedin} rel="me" className="text-accent hover:underline">
                LinkedIn
              </a>
              <span className="text-muted"> · </span>
              <a href={site.github} rel="me" className="text-accent hover:underline">
                GitHub
              </a>
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
        </header>

        <section className="mt-8">
          <h2 className={heading}>Summary</h2>
          <p className="mt-3 leading-relaxed">{site.description}</p>
          <p className="mt-3 leading-relaxed text-muted">{about.statement}</p>
        </section>

        <section className="mt-10">
          <h2 className={heading}>Experience</h2>
          <ol className="mt-4 space-y-7">
            {experience.map((job) => (
              <li key={job.company}>
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
        </section>

        <section className="mt-10">
          <h2 className={heading}>Selected projects</h2>
          <ul className="mt-4 space-y-3">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link href={caseStudyPath(p)} className="font-semibold text-accent hover:underline">
                  {p.name}
                </Link>
                <span className="text-muted">
                  {" "}
                  · {p.company}, {p.year}
                </span>
                <p className="leading-relaxed text-muted">{p.summary}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className={heading}>Skills</h2>
          <p className="mt-3 leading-relaxed">{stack.map((s) => s.label).join(", ")}</p>
        </section>

        <div className="mt-10 grid gap-8 border-t border-hairline pt-8 md:grid-cols-2">
          <section>
            <h2 className={heading}>Education</h2>
            <p className="mt-3 font-semibold">{education.degree}</p>
            <p className="text-sm text-muted">
              {education.school}, {education.years}
            </p>
          </section>
          <section>
            <h2 className={heading}>Certifications</h2>
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
      </article>
    </PageShell>
  );
}
