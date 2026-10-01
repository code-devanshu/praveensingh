import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { site } from "@/content";
import { allPosts, tagSlug } from "@/blog";
import { PostList } from "@/blog/post-list";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = new Set((await allPosts()).flatMap((p) => p.tags));
  return [...tags].map((tag) => ({ tag: tagSlug(tag) }));
}

async function find(slug: string) {
  const posts = await allPosts();
  const tag = posts.flatMap((p) => p.tags).find((t) => tagSlug(t) === slug);
  return tag ? { tag, posts: posts.filter((p) => p.tags.includes(tag)) } : null;
}

export async function generateMetadata({ params }: PageProps<"/blog/tags/[tag]">): Promise<Metadata> {
  const found = await find((await params).tag);
  if (!found) return {};
  return pageMetadata({
    title: `${found.tag} posts`,
    description: `Posts by ${site.name} about ${found.tag}.`,
    path: `/blog/tags/${tagSlug(found.tag)}`,
  });
}

export default async function TagPage({ params }: PageProps<"/blog/tags/[tag]">) {
  const found = await find((await params).tag);
  if (!found) notFound();
  const path = `/blog/tags/${tagSlug(found.tag)}`;

  return (
    <PageShell
      title={found.tag}
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: found.tag, path },
      ]}
    >
      <div className="px-6 py-10 md:px-12">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Topic</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tighter md:text-5xl">{found.tag}</h1>
        <div className="mt-8">
          <PostList posts={found.posts} />
        </div>
      </div>
    </PageShell>
  );
}
