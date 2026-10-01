import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AndroidLogo, AppleLogo, ArrowLeft, ArrowRight } from "@phosphor-icons/react/ssr";
import { Avatar } from "@/components/avatar";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { site } from "@/content";
import { allPosts, findPost, formatDate, postBody, tagSlug } from "@/blog";
import { ReadingProgress } from "@/blog/reading-progress";
import { absolute, breadcrumbs, ids, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await allPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await findPost((await params).slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    image: `/blog/${post.slug}/opengraph-image`,
    keywords: post.tags,
    openGraph: {
      publishedTime: post.published,
      modifiedTime: post.updated ?? post.published,
      authors: [site.url],
      tags: post.tags,
    },
    // Drafts never reach production, but never index one either.
    ...(post.draft && { robots: { index: false, follow: false } }),
  });
}

const platformIcons = { iOS: AppleLogo, Android: AndroidLogo };

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await findPost(slug);
  if (!post) notFound();
  const Body = await postBody(slug);
  const path = `/blog/${slug}`;

  // Newer and older posts, plus up to two more sharing a tag.
  const posts = await allPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  const newer = posts[index - 1];
  const older = posts[index + 1];
  const related = posts
    .filter((p) => p.slug !== slug && p !== newer && p !== older && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 2);

  return (
    <PageShell
      wide
      title={`${slug}.mdx`}
      titleBarExtra={<ReadingProgress target="post" />}
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path },
      ]}
    >
      <JsonLd
        nodes={[
          {
            "@type": "BlogPosting",
            "@id": absolute(`${path}#post`),
            headline: post.title,
            description: post.description,
            url: absolute(path),
            mainEntityOfPage: absolute(path),
            image: absolute(`${path}/opengraph-image`),
            datePublished: post.published,
            dateModified: post.updated ?? post.published,
            author: { "@id": ids.person },
            publisher: { "@id": ids.person },
            isPartOf: { "@id": absolute("/blog#blog") },
            keywords: post.tags.join(", "),
            timeRequired: `PT${post.readingMinutes}M`,
            inLanguage: "en",
          },
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path },
          ]),
        ]}
      />

      <article id="post" className="px-6 py-10 md:px-12">
        <header className="max-w-[66ch]">
          {post.draft && (
            <p className="mb-4 inline-block rounded-full bg-[#ffd60a]/30 px-3 py-1 text-xs font-semibold">
              Draft: visible in development only
            </p>
          )}
          <h1 className="text-[2rem] font-semibold leading-[1.15] tracking-tighter md:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted md:text-xl">{post.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 border-y border-hairline py-4 text-sm">
            <Link href="/" className="flex items-center gap-2.5 font-medium hover:text-accent">
              <Avatar size={36} />
              {site.name}
            </Link>
            <span className="text-muted">
              <time dateTime={post.published}>{formatDate(post.published)}</time>
              {post.updated && (
                <>
                  {" · Updated "}
                  <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                </>
              )}
              {` · ${post.readingMinutes} min read`}
            </span>
            {post.platforms && (
              <ul aria-label="Platforms" className="flex gap-1.5 sm:ml-auto">
                {post.platforms.map((p) => {
                  const Icon = platformIcons[p];
                  return (
                    <li key={p} className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
                      <Icon size={13} weight="fill" aria-hidden />
                      {p}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </header>

        <div className="mt-2 lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-12">
          <div className="post-body">
            <Body />
          </div>

          {post.headings.length > 2 && (
            <nav aria-label="On this page" className="hidden lg:block">
              <div className="sticky top-32 mt-10 text-sm">
                <p className="font-semibold">On this page</p>
                <ol className="mt-3 space-y-2 border-l border-hairline">
                  {post.headings.map((h) => (
                    <li key={h.id} className={h.level === 3 ? "pl-6" : "pl-3"}>
                      <a href={`#${h.id}`} className="block leading-snug text-muted hover:text-accent">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>
          )}
        </div>

        <footer className="mt-14 max-w-[66ch] space-y-8">
          <ul aria-label="Tags" className="flex flex-wrap gap-2">
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

          <div className="flex flex-col gap-4 rounded-2xl bg-surface-2 p-5 sm:flex-row sm:items-center">
            <Avatar size={56} className="shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Written by {site.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {site.role} in {site.location}, shipping Android and iOS apps for 5+ years. Open to senior React Native
                roles and consulting.
              </p>
            </div>
            <Link
              href="/#contact"
              className="self-start whitespace-nowrap rounded-full bg-accent-fill px-5 py-2.5 text-sm font-medium text-white sm:self-center"
            >
              Work with me
            </Link>
          </div>

          {related.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold">More on {post.tags[0]}</h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="block rounded-2xl border border-hairline p-4 transition-colors hover:bg-surface-2">
                      <span className="block font-medium leading-snug">{p.title}</span>
                      <span className="mt-1 block text-sm text-muted">{p.readingMinutes} min read</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </footer>
      </article>

      {(newer || older) && (
        <nav aria-label="More posts" className="grid grid-cols-2 border-t border-hairline text-sm">
          {older ? (
            <Link href={`/blog/${older.slug}`} className="flex items-center gap-2 px-6 py-4 transition-colors hover:bg-surface-2 md:px-12">
              <ArrowLeft size={16} weight="bold" aria-hidden className="shrink-0" />
              <span className="truncate">{older.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link
              href={`/blog/${newer.slug}`}
              className="flex items-center justify-end gap-2 border-l border-hairline px-6 py-4 text-right transition-colors hover:bg-surface-2 md:px-12"
            >
              <span className="truncate">{newer.title}</span>
              <ArrowRight size={16} weight="bold" aria-hidden className="shrink-0" />
            </Link>
          )}
        </nav>
      )}
    </PageShell>
  );
}
