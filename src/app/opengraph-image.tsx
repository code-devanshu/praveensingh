import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { about, hero, site } from "@/content";

// The card shown when the site is shared (LinkedIn, WhatsApp, Slack, X):
// the desktop wallpaper, a Welcome window with Praveen's photo, and two real
// app screens.
// Rendered once at build time.

export const alt = `${site.name}, ${site.role}. ${hero.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The renderer takes TTF/OTF only, and PNG rather than WebP, so these live
// in src/assets/og instead of reusing the site's fonts and /public/work.
const asset = (file: string) => readFile(join(process.cwd(), "src/assets/og", file));
const png = async (file: string) => `data:image/png;base64,${(await asset(file)).toString("base64")}`;

const [regular, semibold, upgrad, delightree, photo] = await Promise.all([
  asset("Geist-Regular.ttf"),
  asset("Geist-SemiBold.ttf"),
  png("upgrad.png"),
  png("delightree.png"),
  png("photo.png"),
]);

// The "Golden Gate" wallpaper in globals.css (light theme), simplified: folds
// as ellipse edges, lit inside and shadowed outside, over a gold-to-indigo
// sweep. Each fades to its own colour at zero alpha: plain `transparent`
// renders as grey here.
const fold = (shape: string, inside: string) =>
  `radial-gradient(${shape}, ${inside} 0%, ${inside} 78%, rgba(255,252,244,0.5) 93%, rgba(70,52,40,0.22) 94%, rgba(70,52,40,0) 100%)`;
const wallpaper = [
  fold("ellipse 62% 112% at 0% 100%", "rgba(255,204,120,0.2)"),
  fold("ellipse 56% 104% at 100% 0%", "rgba(70,80,170,0.16)"),
  fold("ellipse 88% 146% at 0% 100%", "rgba(255,204,120,0)"),
  fold("ellipse 84% 136% at 100% 0%", "rgba(70,80,170,0)"),
  "linear-gradient(105deg, #e2b871 0%, #ead3a8 24%, #e2d9cc 42%, #c4c3d2 62%, #8a8fc0 82%, #545ca0 100%)",
].join(", ");

function Screen({ src, width, height, style }: { src: string; width: number; height: number; style: React.CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        overflow: "hidden",
        borderRadius: 22,
        boxShadow: "0 30px 60px -20px rgba(15,23,42,0.45), 0 0 0 1px rgba(0,0,0,0.06)",
        ...style,
      }}
    >
      <img src={src} width={width} height={height} alt="" style={{ objectFit: "cover" }} />
    </div>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#e6dccb",
          backgroundImage: wallpaper,
          fontFamily: "Geist",
          color: "#1d1d1f",
        }}
      >
        {/* Welcome window */}
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 85,
            width: 720,
            height: 460,
            display: "flex",
            flexDirection: "column",
            borderRadius: 20,
            backgroundColor: "rgba(251,251,253,0.94)",
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
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 600,
                color: "#5e5e63",
              }}
            >
              Welcome
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", padding: "40px 52px 0" }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: "#0066cc", letterSpacing: 0.2 }}>{site.role}</div>
            <div
              style={{
                marginTop: 18,
                fontSize: 62,
                fontWeight: 600,
                lineHeight: 1.04,
                letterSpacing: -2.2,
                maxWidth: 600,
              }}
            >
              {hero.headline}
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 34 }}>
              <img
                src={photo}
                width={64}
                height={64}
                alt=""
                style={{ borderRadius: 999, boxShadow: "0 0 0 3px rgba(255,255,255,0.9), 0 6px 16px rgba(15,23,42,0.25)" }}
              />
              <div style={{ display: "flex", flexDirection: "column", marginLeft: 16 }}>
                <div style={{ fontSize: 26, fontWeight: 600 }}>{site.name}</div>
                <div style={{ fontSize: 19, color: "#5e5e63", marginTop: 2 }}>
                  {`${about.facts[0].value} · ${site.location}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real app screens, fanned like cards on the desktop */}
        <Screen src={upgrad} width={222} height={480} style={{ left: 760, top: 76, transform: "rotate(-5deg)" }} />
        <Screen src={delightree} width={228} height={405} style={{ left: 930, top: 150, transform: "rotate(5deg)" }} />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, style: "normal", weight: 400 },
        { name: "Geist", data: semibold, style: "normal", weight: 600 },
      ],
    },
  );
}
