import type { Metadata } from "next";
import Link from "next/link";
import { Rss } from "@phosphor-icons/react/ssr";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { site } from "@/content";
import { allPosts, tagSlug } from "@/blog";
import { PostList } from "@/blog/post-list";
import { absolute, breadcrumbs, ids, pageMetadata } from "@/lib/seo";

const title = "Blog";
const description = `${site.name} on React Native: upgrades, performance, native modules and shipping mobile apps, from hands-on work.`;

export const metadata: Metadata = pageMetadata({
  title: "Blog: React Native in practice",
  description,
  path: "/blog",
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/rss.xml" } },
});

export default async function Blog() {
  const posts = await allPosts();
  const tags = [...new Set(posts.flatMap((p) => p.tags))].sort();

  return (
    <PageShell
      title="Blog"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
      ]}
    >
      <JsonLd
        nodes={[
          {
            "@type": "Blog",
            "@id": absolute("/blog#blog"),
            url: absolute("/blog"),
            name: `${site.name}'s blog`,
            description,
            author: { "@id": ids.person },
            publisher: { "@id": ids.person },
            isPartOf: { "@id": ids.website },
            blogPost: posts.filter((p) => !p.draft).map((p) => ({ "@id": absolute(`/blog/${p.slug}#post`) })),
          },
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ]}
      />
      <div className="px-6 py-10 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tighter md:text-5xl">{title}</h1>
            <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-muted">{description}</p>
          </div>
          <a
            href="/blog/rss.xml"
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-4 py-1.5 text-sm font-medium transition-colors hover:bg-accent-soft hover:text-accent"
          >
            <Rss size={16} weight="bold" aria-hidden />
            RSS
          </a>
        </div>
        {tags.length > 1 && (
          <nav aria-label="Topics" className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tags/${tagSlug(tag)}`}
                className="rounded-full bg-surface-2 px-3.5 py-1.5 text-sm font-medium transition-colors hover:bg-accent-soft hover:text-accent"
              >
                {tag}
              </Link>
            ))}
          </nav>
        )}
        <div className="mt-8">
          {posts.length > 0 ? (
            <PostList posts={posts} />
          ) : (
            <p className="border-t border-hairline pt-8 text-muted">The first post is on its way.</p>
          )}
        </div>
      </div>
    </PageShell>
  );
}
