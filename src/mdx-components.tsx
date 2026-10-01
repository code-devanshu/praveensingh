import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { AtAGlance, Gotcha, Note, ShortAnswer, Takeaways } from "@/blog/components";
import { CodeFigure } from "@/blog/code-figure";

// How Markdown in blog posts renders (required by @next/mdx). Typography is
// in globals.css under .post-body; this maps links and code blocks and
// makes the post components available without imports.
const components: MDXComponents = {
  a: ({ href = "", children, ...props }) =>
    href.startsWith("/") || href.startsWith("#") ? (
      <Link href={href} {...props}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    ),
  figure: (props) =>
    "data-rehype-pretty-code-figure" in props ? <CodeFigure {...props} /> : <figure {...props} />,
  table: (props) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
  AtAGlance,
  Gotcha,
  Note,
  ShortAnswer,
  Takeaways,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
