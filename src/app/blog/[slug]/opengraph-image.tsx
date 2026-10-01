import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content";
import { allPosts, findPost, formatDate } from "@/blog";

// Each post's share card: the post title in a window on the desktop
// wallpaper, with Praveen's photo and the reading time.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `A blog post by ${site.name}`;

export async function generateStaticParams() {
  return (await allPosts()).map((p) => ({ slug: p.slug }));
}

const asset = (file: string) => readFile(join(process.cwd(), "src/assets/og", file));

const wallpaper = [
  "radial-gradient(55% 45% at 18% 12%, rgba(127,178,255,0.9), rgba(127,178,255,0) 70%)",
  "radial-gradient(45% 40% at 88% 8%, rgba(201,179,255,0.85), rgba(201,179,255,0) 70%)",
  "radial-gradient(60% 50% at 82% 88%, rgba(255,195,160,0.85), rgba(255,195,160,0) 70%)",
  "radial-gradient(55% 50% at 8% 92%, rgba(159,227,214,0.8), rgba(159,227,214,0) 70%)",
].join(", ");

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await findPost(slug);
  const [regular, semibold, photo] = await Promise.all([
    asset("Geist-Regular.ttf"),
    asset("Geist-SemiBold.ttf"),
    asset("photo.png"),
  ]);
  const title = post?.title ?? site.name;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: 56,
          backgroundColor: "#dde3f0",
          backgroundImage: wallpaper,
          fontFamily: "Geist",
          color: "#1d1d1f",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            borderRadius: 28,
            backgroundColor: "rgba(251,251,253,0.95)",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.08), 0 40px 80px -24px rgba(15,23,42,0.45)",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              height: 56,
              padding: "0 22px",
              borderBottom: "1px solid rgba(29,29,31,0.1)",
            }}
          >
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 15, height: 15, borderRadius: 999, backgroundColor: c, marginRight: 9 }} />
            ))}
            <div style={{ position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center", fontSize: 18, fontWeight: 600, color: "#5e5e63" }}>
              {`${slug}.mdx`}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "44px 56px" }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: "#0066cc" }}>{post?.tags.join("  ·  ")}</div>
            <div style={{ marginTop: 18, fontSize: title.length > 70 ? 50 : 60, fontWeight: 600, lineHeight: 1.08, letterSpacing: -1.5 }}>
              {title}
            </div>
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center" }}>
              <img
                src={`data:image/png;base64,${photo.toString("base64")}`}
                width={56}
                height={56}
                alt=""
                style={{ borderRadius: 999 }}
              />
              <div style={{ display: "flex", flexDirection: "column", marginLeft: 16 }}>
                <div style={{ fontSize: 22, fontWeight: 600 }}>{site.name}</div>
                <div style={{ fontSize: 18, color: "#5e5e63" }}>
                  {post ? `${formatDate(post.published)} · ${post.readingMinutes} min read` : site.role}
                </div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 20, color: "#5e5e63" }}>praveensingh.co.in/blog</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, weight: 400 },
        { name: "Geist", data: semibold, weight: 600 },
      ],
    },
  );
}
