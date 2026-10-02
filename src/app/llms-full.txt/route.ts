import { site } from "@/content";
import { livePosts } from "@/blog";
import { postMarkdown } from "@/blog/markdown";
import { absolute } from "@/lib/seo";

export const dynamic = "force-static";

// Every published post in full, as one Markdown file, for AI tools that read
// a whole site at once. /llms.txt is the short index.
export async function GET() {
  const posts = await livePosts();
  const header = `# ${site.name}: blog posts in full\n\n> ${site.description} Index: ${absolute("/llms.txt")}\n`;
  const text = [header, ...posts.map((p) => postMarkdown(p))].join("\n---\n\n");
  return new Response(text, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
