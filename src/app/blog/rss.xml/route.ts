import { site } from "@/content";
import { livePosts } from "@/blog";
import { absolute } from "@/lib/seo";

export const dynamic = "force-static";

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// RSS 2.0 for feed readers, newsletter tools and cross-posting.
export async function GET() {
  const posts = await livePosts();
  const items = posts
    .map(
      (p) => `    <item>
      <title>${escape(p.title)}</title>
      <link>${absolute(`/blog/${p.slug}`)}</link>
      <guid isPermaLink="true">${absolute(`/blog/${p.slug}`)}</guid>
      <description>${escape(p.description)}</description>
      <pubDate>${new Date(p.published).toUTCString()}</pubDate>
${p.tags.map((t) => `      <category>${escape(t)}</category>`).join("\n")}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${site.name}'s blog`)}</title>
    <link>${absolute("/blog")}</link>
    <description>${escape(`React Native in practice, by ${site.name}.`)}</description>
    <language>en</language>
    <atom:link href="${absolute("/blog/rss.xml")}" rel="self" type="application/rss+xml" />
${posts[0] ? `    <lastBuildDate>${new Date(posts[0].updated ?? posts[0].published).toUTCString()}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
