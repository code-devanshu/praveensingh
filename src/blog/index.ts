// The blog: one MDX file per post in src/blog/posts. Each post exports its
// details as `meta` (see PostMeta) and is written in Markdown with a few
// components (src/blog/components.tsx). Everything here runs at build time.
//
// A post with `draft: true`, or a `published` date in the future, shows in
// `next dev` only. It stays out of production, the sitemap, RSS and the home
// page until it's ready (a future date goes live on the first deploy after it).

import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type { ComponentType } from "react";

export type PostMeta = {
  title: string;
  /** One or two sentences: the search snippet and the subtitle under the title. */
  description: string;
  /** ISO date, e.g. "2026-10-02". */
  published: string;
  updated?: string;
  tags: string[];
  /** Which platforms the post applies to, shown as badges. */
  platforms?: ("iOS" | "Android")[];
  draft?: boolean;
};

export type Heading = { id: string; text: string; level: 2 | 3 };

export type Post = PostMeta & {
  slug: string;
  readingMinutes: number;
  headings: Heading[];
};

const dir = path.join(process.cwd(), "src/blog/posts");
const showUnpublished = process.env.NODE_ENV !== "production";

const isLive = (meta: PostMeta) => !meta.draft && meta.published <= new Date().toISOString().slice(0, 10);

// Words a reader reads: everything but code blocks, imports/exports and JSX tags.
function readingMinutes(source: string) {
  const prose = source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^(import|export)[\s\S]*?;$/gm, " ")
    .replace(/<[^>]+>/g, " ");
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

// Same ids rehype-slug gives the rendered headings (both use github-slugger).
function headings(source: string): Heading[] {
  const slugger = new GithubSlugger();
  const withoutCode = source.replace(/```[\s\S]*?```/g, "");
  return [...withoutCode.matchAll(/^(##|###) (.+)$/gm)].map(([, hashes, raw]) => {
    const text = raw.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[`*_]/g, "").trim();
    return { id: slugger.slug(text), text, level: hashes.length as 2 | 3 };
  });
}

async function load(slug: string): Promise<Post> {
  const source = fs.readFileSync(path.join(dir, `${slug}.mdx`), "utf8");
  const { meta } = (await import(`./posts/${slug}.mdx`)) as { meta: PostMeta };
  return { ...meta, slug, readingMinutes: readingMinutes(source), headings: headings(source) };
}

/** Newest first. Includes drafts and scheduled posts in development only. */
export async function allPosts() {
  const slugs = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
  const posts = await Promise.all(slugs.map(load));
  return posts
    .filter((p) => showUnpublished || isLive(p))
    .sort((a, b) => b.published.localeCompare(a.published));
}

/** Published posts only, in every environment: for the sitemap, RSS and llms.txt. */
export async function livePosts() {
  return (await allPosts()).filter(isLive);
}

export async function findPost(slug: string) {
  return (await allPosts()).find((p) => p.slug === slug);
}

export async function postBody(slug: string) {
  return ((await import(`./posts/${slug}.mdx`)) as { default: ComponentType }).default;
}

export const isPublished = isLive;

export const tagSlug = (tag: string) => new GithubSlugger().slug(tag);

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export const formatDate = (iso: string) => dateFormat.format(new Date(iso));
