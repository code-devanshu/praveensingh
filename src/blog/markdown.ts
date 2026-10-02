// Plain-Markdown copies of posts, for AI tools and anyone who wants the text
// without the page: /blog/<slug>.md and /llms-full.txt. Built from the MDX
// source at build time; the blog's own components become ordinary Markdown.

import fs from "node:fs";
import path from "node:path";
import { formatDate, type Post } from "@/blog";
import { site } from "@/content";
import { absolute } from "@/lib/seo";

const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? "";
const flatten = (inner: string) => inner.trim().replace(/\s*\n\s*/g, " ");
const quote = (text: string) => text.split("\n").map((line) => (line ? `> ${line}` : ">")).join("\n");

// Only prose is rewritten; fenced code blocks pass through untouched.
function convertProse(prose: string) {
  return (
    prose
      // MDX comments.
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
      .replace(/<AtAGlance([\s\S]*?)\/>/g, (_, props: string) =>
        [
          "**At a glance**",
          "",
          `- Problem: ${attr(props, "problem")}`,
          `- Fix: ${attr(props, "fix")}`,
          `- Result: ${attr(props, "result")} (${attr(props, "resultLabel")})`,
        ].join("\n"),
      )
      .replace(/<ShortAnswer>([\s\S]*?)<\/ShortAnswer>/g, (_, inner: string) => `**Short answer:** ${flatten(inner)}`)
      .replace(/<(Note|Gotcha)([^>]*)>([\s\S]*?)<\/\1>/g, (_, kind: string, props: string, inner: string) => {
        const title = attr(props, "title") || (kind === "Gotcha" ? "Gotcha" : "Note");
        const label = kind === "Gotcha" && title !== "Gotcha" ? `Gotcha: ${title}` : title;
        return quote(`**${label}.** ${flatten(inner)}`);
      })
      .replace(/<Takeaways[\s\S]*?\/>/g, (tag: string) => {
        const items = [...tag.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => `- ${m[1]}`);
        return ["## Takeaways", "", ...items].join("\n");
      })
      // Site-relative links become absolute, so the text stands on its own.
      .replace(/\]\(\//g, `](${absolute("/")}`)
  );
}

export function postMarkdown(post: Post) {
  const source = fs.readFileSync(path.join(process.cwd(), "src/blog/posts", `${post.slug}.mdx`), "utf8");
  const body = source.replace(/^export const meta = \{[\s\S]*?\n\};\n/, "");
  const parts = body.split(/(^```[\s\S]*?^```)/m);
  const converted = parts.map((part, i) => (i % 2 ? part : convertProse(part))).join("");

  const url = absolute(`/blog/${post.slug}`);
  const header = [
    `# ${post.title}`,
    "",
    `> ${post.description}`,
    "",
    `By ${site.name} · Published ${formatDate(post.published)}${post.updated ? ` · Updated ${formatDate(post.updated)}` : ""} · ${post.readingMinutes} min read`,
    `Canonical: ${url}`,
    ...(post.repo ? [`Code and raw results: ${post.repo}`] : []),
    `Tags: ${post.tags.join(", ")}`,
  ];
  return `${header.join("\n")}\n\n${converted.replace(/\n{3,}/g, "\n\n").trim()}\n`;
}
