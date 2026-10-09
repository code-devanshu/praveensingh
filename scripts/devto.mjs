// Cross-posts blog posts to dev.to, with the canonical URL pointing back here.
// Reads the live Markdown copy (/blog/<slug>.md), so publish on the site first.
//
//   node --env-file=.env.local scripts/devto.mjs list
//   node --env-file=.env.local scripts/devto.mjs preview <slug>   # prints what would be sent
//   node --env-file=.env.local scripts/devto.mjs draft <slug>     # creates or updates an unpublished draft
//
// Drafts are never published from here: review and publish them on dev.to.
// Article ids are kept in scripts/devto-articles.json so a re-run updates the
// same draft instead of creating a second one.

import fs from "node:fs";
import path from "node:path";

const SITE = "https://www.praveensingh.co.in";
const API = "https://dev.to/api";
const STATE = path.join(import.meta.dirname, "devto-articles.json");

// dev.to allows four tags, lowercase letters and numbers only. Chosen per post
// for reach on dev.to rather than copied from the site's tags.
const TAGS = {
  "coding-agents-drive-the-simulator": ["reactnative", "ai", "testing", "mobile"],
  "on-device-ai-react-native-2026": ["reactnative", "ai", "mobile", "machinelearning"],
  "react-native-app-intents-appfunctions": ["reactnative", "ios", "ai", "expo"],
  "offline-first-react-native-data-layer": ["reactnative", "mobile", "architecture", "database"],
  "react-native-0-87-upgrade": ["reactnative", "mobile", "javascript", "performance"],
};

const readState = () => (fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, "utf8")) : {});
const writeState = (state) => fs.writeFileSync(STATE, `${JSON.stringify(state, null, 2)}\n`);

async function api(method, route, body) {
  const key = process.env.DEVTO_API_KEY;
  if (!key) throw new Error("DEVTO_API_KEY is missing: run with --env-file=.env.local");
  const res = await fetch(`${API}${route}`, {
    method,
    headers: { "api-key": key, "Content-Type": "application/json", Accept: "application/vnd.forem.api-v1+json" },
    body: body && JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${method} ${route}: ${res.status} ${JSON.stringify(json)}`);
  return json;
}

async function livePosts() {
  const xml = await (await fetch(`${SITE}/blog/rss.xml`)).text();
  return [...xml.matchAll(/<item>[\s\S]*?<\/item>/g)].map(([item]) => ({
    slug: item.match(/<link>[^<]*\/blog\/([^<]+)<\/link>/)[1],
    title: item.match(/<title>([^<]*)<\/title>/)[1],
    published: new Date(item.match(/<pubDate>([^<]*)<\/pubDate>/)[1]).toISOString().slice(0, 10),
  }));
}

// Only prose is rewritten; fenced code blocks pass through, minus their file titles.
function convertProse(prose, url) {
  // The site's diagram components have no Markdown form: point to the original.
  return prose.replace(/^<([A-Z]\w*)\b[\s\S]*?\/>$/gm, (tag) => {
    const label = tag.match(/label="([^"]*)"/)?.[1] ?? "Diagram";
    return `> **Diagram: ${label}.** [See it on the original post](${url}).`;
  });
}

function convertFence(fence) {
  // ```tsx title="src/x.tsx" → the file name as a line above a plain ```tsx fence.
  return fence.replace(/^```(\w*)\s+title="([^"]*)"[^\n]*\n/, (_, lang, title) => `**\`${title}\`**\n\n\`\`\`${lang}\n`);
}

async function article(slug) {
  const url = `${SITE}/blog/${slug}`;
  const res = await fetch(`${url}.md`);
  if (!res.ok) throw new Error(`${url}.md: ${res.status} (is the post live on the site?)`);
  const md = await res.text();

  // The copy starts with a header (title, description, byline, canonical, tags) and a blank line.
  const title = md.match(/^# (.+)$/m)[1];
  const description = md.match(/^> (.+)$/m)[1];
  const body = md.slice(md.indexOf("\n\n", md.indexOf("\nTags: ")) + 2);

  const parts = body.split(/(^```[\s\S]*?^```)/m);
  const converted = parts.map((part, i) => (i % 2 ? convertFence(part) : convertProse(part, url))).join("");
  const footer = `---\n\n*I write about React Native in practice, measured and with public code, at [praveensingh.co.in/blog](${SITE}/blog).*`;

  return {
    title,
    description,
    body_markdown: `${converted.trim()}\n\n${footer}\n`,
    tags: TAGS[slug] ?? [],
    canonical_url: url,
    main_image: `${url}/opengraph-image`,
  };
}

const [command, slug] = process.argv.slice(2);
const state = readState();

if (command === "list") {
  for (const post of await livePosts()) {
    const id = state[post.slug];
    console.log(`${post.published}  ${post.slug}${id ? `  (dev.to draft/article ${id})` : ""}`);
  }
} else if (command === "preview" && slug) {
  const { body_markdown, ...meta } = await article(slug);
  console.log(JSON.stringify(meta, null, 2));
  console.log(`\n${body_markdown}`);
} else if (command === "draft" && slug) {
  const data = await article(slug);
  if (state[slug]) {
    // Leave `published` out, so updating never unpublishes or publishes it.
    const res = await api("PUT", `/articles/${state[slug]}`, { article: data });
    console.log(`Updated ${res.id}: ${res.url}`);
  } else {
    const res = await api("POST", "/articles", { article: { ...data, published: false } });
    writeState({ ...state, [slug]: res.id });
    console.log(`Created draft ${res.id}: ${res.url}\nReview and publish it at https://dev.to/dashboard`);
  }
} else {
  console.log("Usage: node --env-file=.env.local scripts/devto.mjs list | preview <slug> | draft <slug>");
}
