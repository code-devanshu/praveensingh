import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { about } from "@/content";

const semibold = await readFile(join(process.cwd(), "src/assets/og/Geist-SemiBold.ttf"));

// The "PS" monogram the avatar falls back to, as a PNG for app/icon and
// app/apple-icon.
export function monogram(px: number, radius: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: radius,
          background: "linear-gradient(180deg, #5ac8fa, #0a5fd6)",
          color: "white",
          fontFamily: "Geist",
          fontSize: px * 0.42,
          letterSpacing: "-0.04em",
        }}
      >
        {about.initials}
      </div>
    ),
    { width: px, height: px, fonts: [{ name: "Geist", data: semibold, weight: 600 }] },
  );
}
