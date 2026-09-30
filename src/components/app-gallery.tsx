"use client";

import { useState } from "react";
import type { StoreApp } from "@/content";
import { Lightbox, ScreenshotStrip, StoreList } from "./store-apps";

// A project's store listings on its case study page: the same strip, list
// and lightbox as the Work window's cards, with room for taller screenshots.
export function AppGallery({ apps }: { apps: StoreApp[] }) {
  const [active, setActive] = useState(0);
  const [viewing, setViewing] = useState<number | null>(null);
  const app = apps[active];

  return (
    <div>
      <div className="-mx-6 h-96 bg-[linear-gradient(160deg,var(--accent-soft),transparent_75%)] md:-mx-12">
        <ScreenshotStrip key={app.name} app={app} onOpen={setViewing} />
      </div>
      <Lightbox app={app} index={viewing} onIndex={setViewing} />
      <StoreList apps={apps} active={active} onSelect={setActive} />
    </div>
  );
}
