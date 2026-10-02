import { findPost, livePosts } from "@/blog";
import { postMarkdown } from "@/blog/markdown";
import { absolute } from "@/lib/seo";

// Served at /blog/<slug>.md (a rewrite in next.config.ts); one file per post,
// generated at build time.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await livePosts()).map((p) => ({ slug: p.slug }));
}

export async function GET(_request: Request, { params }: RouteContext<"/blog/[slug]/md">) {
  const post = await findPost((await params).slug);
  if (!post) return new Response("Not found", { status: 404 });
  return new Response(postMarkdown(post), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // The HTML page is the one to index; this is a copy of it.
      "X-Robots-Tag": "noindex",
      Link: `<${absolute(`/blog/${post.slug}`)}>; rel="canonical"`,
    },
  });
}
