import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BluetoothConnected, ContactlessPayment, CreditCard, Info } from "@phosphor-icons/react/ssr";
import { AppGallery } from "@/components/app-gallery";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { experience, projects, site } from "@/content";
import { absolute, breadcrumbs, caseStudyPath, ids, pageMetadata } from "@/lib/seo";

// One page per project, built from content.ts at build time. A slug that
// isn't a project is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

const find = (slug: string) => projects.find((p) => p.slug === slug);

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = find((await params).slug);
  if (!project) return {};
  const title = `${project.name} case study, React Native for ${project.platforms}`;
  return pageMetadata({ title, description: project.summary, path: caseStudyPath(project), type: "article" });
}

const capabilityIcons = { payments: CreditCard, nfc: ContactlessPayment, ble: BluetoothConnected };

const heading = "text-xs font-medium uppercase tracking-[0.18em] text-accent";

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const project = find((await params).slug);
  if (!project) notFound();

  const job = experience.find((j) => j.company === project.company);
  const index = projects.indexOf(project);
  const previous = projects[index - 1];
  const next = projects[index + 1];
  const path = caseStudyPath(project);
  const image = project.apps?.[0]?.screenshots[0]?.src;

  const facts = [
    { label: "Company", value: project.company },
    ...(job ? [{ label: "Role", value: `${job.title}, ${job.start} to ${job.end}` }] : []),
    { label: "Industry", value: project.domain },
    { label: "Platforms", value: project.platforms },
    { label: "Year", value: project.year },
  ];

  return (
    <PageShell
      title={`${project.name} — Case Study`}
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Work", path: "/#work" },
        { name: project.name, path },
      ]}
    >
      <JsonLd
        nodes={[
          {
            "@type": "Article",
            "@id": absolute(`${path}#article`),
            headline: `${project.name}: a React Native case study`,
            description: project.summary,
            url: absolute(path),
            mainEntityOfPage: absolute(path),
            author: { "@id": ids.person },
            publisher: { "@id": ids.person },
            dateModified: site.updated,
            ...(image && { image: absolute(image) }),
            keywords: project.stack.join(", "),
            about: (project.apps ?? []).map((app) => ({
              "@type": "MobileApplication",
              name: app.name,
              applicationCategory: app.category,
              operatingSystem: [app.ios && "iOS", app.android && "Android"].filter(Boolean).join(", "),
              url: app.ios ?? app.android,
            })),
          },
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: project.name, path },
          ]),
        ]}
      />

      <article className="px-6 py-10 md:px-12">
        <p className={heading}>Case study · {project.domain}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tighter md:text-5xl">{project.name}</h1>
        <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-muted">{project.summary}</p>

        <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-3 rounded-2xl bg-surface-2 p-5 text-sm sm:grid-cols-2">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="text-muted">{f.label}</dt>
              <dd className="font-medium">{f.value}</dd>
            </div>
          ))}
          <div className="sm:col-span-2">
            <dt className="text-muted">Stack</dt>
            <dd>
              <ul className="mt-1.5 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li key={tech} className="rounded-full border border-hairline bg-surface px-3 py-1 text-xs font-medium">
                    {tech}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <section className="mt-12">
          <h2 className={heading}>The challenge</h2>
          <p className="mt-3 max-w-[62ch] text-lg leading-relaxed">{project.challenge}</p>
        </section>

        {(job || project.capabilities) && (
          <section className="mt-12">
            <h2 className={heading}>What I built</h2>
            {job && (
              <ul className="mt-3 max-w-[62ch] list-disc space-y-2 pl-5 text-lg leading-relaxed marker:text-text/30">
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
            {project.capabilities && (
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {project.capabilities.map(({ icon, title, body }) => {
                  const Icon = capabilityIcons[icon];
                  return (
                    <li key={title} className="rounded-2xl bg-surface-2 p-4">
                      <Icon size={24} weight="duotone" aria-hidden className="text-accent" />
                      <h3 className="mt-2 font-semibold">{title}</h3>
                      <p className="mt-1 text-sm leading-snug text-muted">{body}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}

        {project.metrics && (
          <section className="mt-12">
            <h2 className={heading}>Results</h2>
            <p className="mt-3 text-muted">From release builds and production telemetry.</p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {project.metrics.map((m) => (
                <div key={m.label} className="rounded-2xl bg-surface-2 px-5 py-4">
                  <dt className="text-sm text-muted">{m.label}</dt>
                  <dd className="mt-1 flex flex-wrap items-baseline gap-x-3">
                    <span className="text-3xl font-semibold tracking-tight text-accent tabular-nums">{m.change}</span>
                    <span className="text-sm tabular-nums text-muted">
                      {m.before} → {m.after}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {(project.retired ?? project.note) && (
          <p className="mt-8 flex gap-2 rounded-xl bg-surface-2 px-4 py-3 text-sm leading-snug text-muted">
            <Info size={16} weight="bold" aria-hidden className="mt-0.5 shrink-0" />
            {project.retired ?? project.note}
          </p>
        )}

        {project.apps && (
          <section className="mt-12">
            <h2 className={`${heading} mb-4`}>On the stores</h2>
            <AppGallery apps={project.apps} />
          </section>
        )}

        <section className="mt-14 rounded-2xl bg-accent-soft p-6 md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Building something similar?</h2>
          <p className="mt-2 text-muted">
            {site.name} is open to Senior React Native roles and consulting, and can start immediately.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className="whitespace-nowrap rounded-full bg-accent-fill px-6 py-3 text-[15px] font-medium text-white transition-transform active:scale-[0.98]"
            >
              Get in touch
            </Link>
            <Link
              href="/resume"
              className="whitespace-nowrap rounded-full border border-hairline bg-surface px-6 py-3 text-[15px] font-medium text-accent transition-colors hover:bg-surface-2"
            >
              View résumé
            </Link>
          </div>
        </section>
      </article>

      <nav aria-label="More case studies" className="grid grid-cols-2 border-t border-hairline text-sm">
        {previous ? (
          <Link href={caseStudyPath(previous)} className="flex items-center gap-2 px-6 py-4 transition-colors hover:bg-surface-2 md:px-12">
            <ArrowLeft size={16} weight="bold" aria-hidden className="shrink-0" />
            <span className="truncate">{previous.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={caseStudyPath(next)}
            className="flex items-center justify-end gap-2 border-l border-hairline px-6 py-4 text-right transition-colors hover:bg-surface-2 md:px-12"
          >
            <span className="truncate">{next.name}</span>
            <ArrowRight size={16} weight="bold" aria-hidden className="shrink-0" />
          </Link>
        )}
      </nav>
    </PageShell>
  );
}
