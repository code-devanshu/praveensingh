import type { MetadataRoute } from "next";
import { absolute } from "@/lib/seo";

// Everything is public. AI search crawlers (OAI-SearchBot, PerplexityBot,
// Claude-SearchBot, Google-Extended…) fall under "*" too, which keeps the
// site citable in AI answers. To opt out of AI *training* only, add a rule
// such as { userAgent: "GPTBot", disallow: "/" }.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absolute("/sitemap.xml"),
  };
}
