"use client";

import { useEffect } from "react";
import { afterIdle } from "@/lib/idle";

// Loads the GSAP effects (lib/effects.ts) once the page has loaded and gone
// idle, like Spotlight, so GSAP is never part of the first load. On the home
// page and every sub-page.
export function Effects() {
  useEffect(() => {
    let stop: (() => void) | undefined;
    let gone = false;
    const cancel = afterIdle(() => {
      import("@/lib/effects").then(({ startEffects }) => {
        if (!gone) stop = startEffects();
      });
    });
    return () => {
      gone = true;
      cancel();
      stop?.();
    };
  }, []);

  return null;
}
