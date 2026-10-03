import Link from "next/link";
import { ArrowRight, Folder } from "@phosphor-icons/react/ssr";
import { formatDate, type Post } from "@/blog";
import { Window } from "./window";

// The latest posts, laid out like the Notes app: a list on the left and the
// newest post's summary on the right. Hidden until there's a post.
export function BlogWindow({ posts, className }: { posts: Post[]; className?: string }) {
  const [latest, ...rest] = posts;
  if (!latest) return null;

  return (
    <Window id="blog" title="Notes" className={className}>
      <div className="flex flex-col md:flex-row">
        <aside className="sidebar border-b border-hairline p-3 md:w-64 md:shrink-0 md:border-b-0 md:border-r">
          <p className="flex items-center gap-1.5 px-2 pb-1.5 pt-1 text-[11px] font-semibold text-muted">
            {/* Notes' folders are yellow; grey when the window isn't active. */}
            <Folder size={14} weight="fill" aria-hidden className="sidebar-icon [--tint:#e8a600] dark:[--tint:#ffd60a]" />
            Latest posts
          </p>
          <ul className="flex flex-col gap-0.5">
            {posts.slice(0, 4).map((post, i) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className={`block rounded-lg px-2.5 py-2 transition-colors ${
                    i === 0 ? "bg-[#ffd60a]/35 dark:bg-[#ffd60a]/20" : "hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                >
                  <span className="line-clamp-2 text-[13px] font-semibold leading-snug">{post.title}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {formatDate(post.published)} · {post.tags[0]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <div className="flex-1 p-6 md:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">From the blog</p>
          <h2 className="mt-3 max-w-[24ch] text-2xl font-semibold tracking-tight md:text-3xl">{latest.title}</h2>
          <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">{latest.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/blog/${latest.slug}`}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent-fill px-5 py-2.5 text-[14px] font-medium text-white"
            >
              Read the post
              <ArrowRight size={16} weight="bold" aria-hidden />
            </Link>
            <Link
              href="/blog"
              className="whitespace-nowrap rounded-full border border-hairline px-5 py-2.5 text-[14px] font-medium text-accent transition-colors hover:bg-accent-soft"
            >
              All posts{rest.length > 0 ? ` (${posts.length})` : ""}
            </Link>
            <span className="text-sm text-muted">{latest.readingMinutes} min read</span>
          </div>
        </div>
      </div>
    </Window>
  );
}
