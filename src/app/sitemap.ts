import type { MetadataRoute } from "next";
import { projects, site } from "@/content";
import { livePosts } from "@/blog";
import { absolute, caseStudyPath } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const updated = new Date(site.updated);
  const posts = await livePosts();

  return [
    { url: absolute("/"), lastModified: updated, changeFrequency: "monthly", priority: 1 },
    { url: absolute("/resume"), lastModified: updated, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((p) => ({
      url: absolute(caseStudyPath(p)),
      lastModified: updated,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    {
      url: absolute("/blog"),
      lastModified: posts[0] ? new Date(posts[0].updated ?? posts[0].published) : updated,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...posts.map((p) => ({
      url: absolute(`/blog/${p.slug}`),
      lastModified: new Date(p.updated ?? p.published),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
