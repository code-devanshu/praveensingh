import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.4"],
  async rewrites() {
    return [
      // A plain-Markdown copy of each post (src/app/blog/[slug]/md). Plain
      // rewrites run before dynamic routes, so this wins over /blog/[slug].
      { source: "/blog/:slug.md", destination: "/blog/:slug/md" },
    ];
  },
  async redirects() {
    return [
      // The résumé PDF was renamed; keep old links and shares working.
      {
        source: "/Praveen_Singh_Resume.pdf",
        destination: "/Praveen_Singh_Senior_React_Native_Developer.pdf",
        permanent: true,
      },
      // Browsers and some crawlers ask for /favicon.ico regardless of <link> tags.
      { source: "/favicon.ico", destination: "/icon", permanent: true },
      // Notes became the blog.
      { source: "/notes", destination: "/blog", permanent: true },
      { source: "/notes/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

// Blog posts are MDX files in content/blog. Plugins are named as strings so
// Turbopack can load them: GitHub-flavoured markdown (tables), heading ids
// for the table of contents, and build-time syntax highlighting (Shiki), so
// code blocks ship no JavaScript.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-pretty-code",
        { theme: { light: "github-light", dark: "github-dark-dimmed" }, keepBackground: false },
      ],
    ],
  },
});

export default withMDX(nextConfig);
