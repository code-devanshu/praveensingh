import type { MetadataRoute } from "next";
import { projects, site } from "@/content";
import { publishedNotes } from "@/notes";
import { absolute, caseStudyPath } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(site.updated);
  const notes = publishedNotes().filter((n) => !n.draft);

  return [
    { url: absolute("/"), lastModified: updated, changeFrequency: "monthly", priority: 1 },
    { url: absolute("/resume"), lastModified: updated, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((p) => ({
      url: absolute(caseStudyPath(p)),
      lastModified: updated,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...(notes.length > 0
      ? [
          {
            url: absolute("/notes"),
            lastModified: new Date(notes[0].updated ?? notes[0].published),
            changeFrequency: "weekly" as const,
            priority: 0.6,
          },
        ]
      : []),
    ...notes.map((n) => ({
      url: absolute(`/notes/${n.slug}`),
      lastModified: new Date(n.updated ?? n.published),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
