import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { site } from "@/content";
import { formatDate, publishedNotes } from "@/notes";
import { absolute, breadcrumbs, ids, pageMetadata } from "@/lib/seo";

const title = "Notes on React Native";
const description = `Technical notes by ${site.name} on React Native performance, native modules and mobile release engineering, from real production apps.`;

export const metadata: Metadata = pageMetadata({ title, description, path: "/notes" });

export default function Notes() {
  const notes = publishedNotes();
  // Nothing published yet: no empty page for search engines to find.
  if (notes.length === 0) notFound();

  return (
    <PageShell
      title="Notes"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Notes", path: "/notes" },
      ]}
    >
      <JsonLd
        nodes={[
          {
            "@type": "Blog",
            "@id": absolute("/notes#blog"),
            url: absolute("/notes"),
            name: title,
            description,
            author: { "@id": ids.person },
            isPartOf: { "@id": ids.website },
          },
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Notes", path: "/notes" },
          ]),
        ]}
      />
      <div className="px-6 py-10 md:px-12">
        <h1 className="text-4xl font-semibold tracking-tighter md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-[62ch] text-lg leading-relaxed text-muted">{description}</p>
        <ul className="mt-10 divide-y divide-hairline">
          {notes.map((note) => (
            <li key={note.slug} className="py-5">
              <p className="text-sm text-muted">
                <time dateTime={note.published}>{formatDate(note.published)}</time>
                {note.draft && <span className="ml-2 rounded-full bg-[#ffd60a]/30 px-2 py-0.5 text-xs font-semibold">Draft</span>}
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">
                <Link href={`/notes/${note.slug}`} className="hover:text-accent">
                  {note.title}
                </Link>
              </h2>
              <p className="mt-1.5 leading-relaxed text-muted">{note.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
