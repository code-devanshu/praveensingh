import { graph } from "@/lib/seo";

// Structured data is data, not code, so a plain <script> (not next/script).
export function JsonLd({ nodes }: { nodes: object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph(...nodes) }} />;
}
