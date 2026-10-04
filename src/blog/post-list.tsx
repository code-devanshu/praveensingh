import { ViewTransition } from "react";
import Link from "next/link";
import { formatDate, tagSlug, type Post } from "@/blog";

// Posts as a list of rows: date and reading time, title, summary and tags.
export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="divide-y divide-hairline border-t border-hairline">
      {posts.map((post) => (
        <li key={post.slug} className="py-6">
          <p className="text-sm text-muted">
            <time dateTime={post.published}>{formatDate(post.published)}</time> · {post.readingMinutes} min read
            {post.draft && <span className="ml-2 rounded-full bg-[#ffd60a]/30 px-2 py-0.5 text-xs font-semibold text-text">Draft</span>}
          </p>
          {/* Glides into the post's heading when it opens (globals.css, .title-morph). */}
          <ViewTransition name={`post-title-${post.slug}`} share="title-morph" default="none">
            <h2 className="mt-1.5 text-xl font-semibold tracking-tight md:text-2xl">
              <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                {post.title}
              </Link>
            </h2>
          </ViewTransition>
          <p className="mt-2 max-w-[66ch] leading-relaxed text-muted">{post.description}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/blog/tags/${tagSlug(tag)}`}
                  className="rounded-full border border-hairline px-3 py-1 text-xs font-medium transition-colors hover:bg-accent-soft hover:text-accent"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
