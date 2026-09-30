import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { site } from "@/content";
import { findNote, formatDate, publishedNotes } from "@/notes";
import { absolute, breadcrumbs, ids, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedNotes().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const note = findNote((await params).slug);
  if (!note) return {};
  return pageMetadata({
    title: note.title,
    description: note.description,
    path: `/notes/${note.slug}`,
    type: "article",
    keywords: note.tags,
    openGraph: {
      publishedTime: note.published,
      modifiedTime: note.updated ?? note.published,
      authors: [site.url],
      tags: note.tags,
    },
    // Belt and braces: drafts never reach production, but never index one.
    ...(note.draft && { robots: { index: false, follow: false } }),
  });
}

// Styles for the note's body, which is plain HTML elements.
const prose = [
  "max-w-[68ch] text-[17px] leading-relaxed",
  "[&_p]:mt-5 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight",
  "[&_a]:text-accent [&_a]:underline",
  "[&_code]:rounded [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em]",
  "[&_pre]:mt-5 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-surface-2 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-relaxed",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5",
].join(" ");

export default async function NotePage({ params }: PageProps<"/notes/[slug]">) {
  const note = findNote((await params).slug);
  if (!note) notFound();
  const path = `/notes/${note.slug}`;
  const { Body } = note;

  return (
    <PageShell
      title={note.title}
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Notes", path: "/notes" },
        { name: note.title, path },
      ]}
    >
      <JsonLd
        nodes={[
          {
            "@type": "TechArticle",
            "@id": absolute(`${path}#article`),
            headline: note.title,
            description: note.description,
            url: absolute(path),
            mainEntityOfPage: absolute(path),
            datePublished: note.published,
            dateModified: note.updated ?? note.published,
            author: { "@id": ids.person },
            publisher: { "@id": ids.person },
            keywords: note.tags.join(", "),
            isPartOf: { "@id": absolute("/notes#blog") },
          },
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Notes", path: "/notes" },
            { name: note.title, path },
          ]),
        ]}
      />
      <article className="px-6 py-10 md:px-12">
        <header>
          <p className="text-sm text-muted">
            By{" "}
            <Link href="/" className="font-medium text-text hover:text-accent">
              {site.name}
            </Link>
            {" · "}
            <time dateTime={note.published}>{formatDate(note.published)}</time>
            {note.updated && (
              <>
                {" · Updated "}
                <time dateTime={note.updated}>{formatDate(note.updated)}</time>
              </>
            )}
          </p>
          <h1 className="mt-3 max-w-[24ch] text-4xl font-semibold tracking-tighter md:text-5xl">{note.title}</h1>
          <ul className="mt-4 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-hairline px-3 py-1 text-xs font-medium">
                {tag}
              </li>
            ))}
          </ul>
        </header>
        <div className={`mt-6 ${prose}`}>
          <Body />
        </div>
        <footer className="mt-12 rounded-2xl bg-surface-2 p-5 text-sm leading-relaxed">
          <p>
            <span className="font-semibold">{site.name}</span> is a {site.role} in {site.location}.{" "}
            <Link href="/resume" className="text-accent hover:underline">
              Résumé
            </Link>
            {" · "}
            <Link href="/#contact" className="text-accent hover:underline">
              Get in touch
            </Link>
          </p>
        </footer>
      </article>
    </PageShell>
  );
}
