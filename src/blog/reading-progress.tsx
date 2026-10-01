"use client";

import { useEffect, useState } from "react";

// A thin bar along the window's title bar that fills as the post is read.
// Decorative: the reading time is already stated in text.
export function ReadingProgress({ target }: { target: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    const update = () => {
      const box = el.getBoundingClientRect();
      const total = box.height - window.innerHeight;
      setProgress(total <= 0 ? 1 : Math.min(1, Math.max(0, -box.top / total)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [target]);

  return (
    <span
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent-fill transition-transform duration-150"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}
