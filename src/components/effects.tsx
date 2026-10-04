"use client";

import { useEffect } from "react";

// What counts as the visitor starting to use the page.
const firstUse = ["scroll", "wheel", "touchstart", "pointerdown", "pointermove", "keydown"] as const;

let loaded: Promise<typeof import("@/lib/effects")> | undefined;

// Loads the GSAP effects (lib/effects.ts) the first time the visitor scrolls,
// touches, clicks, types or moves the mouse, not at load. Every effect waits
// for a scroll or a hover anyway, so nothing is lost, and a visitor who only
// reads the first screen never downloads GSAP. Loading it at idle instead
// cost slow phones ~300 ms of main-thread work right after load (Lighthouse
// TBT 120 → 430 ms, PageSpeed Speed Index 2.7 → 5.1 s). On the home page and
// every sub-page; after the first load, a page's effects start at once.
export function Effects() {
  useEffect(() => {
    let stop: (() => void) | undefined;
    let gone = false;
    const start = () => {
      firstUse.forEach((type) => window.removeEventListener(type, start));
      loaded ??= import("@/lib/effects");
      loaded.then(({ startEffects }) => {
        if (!gone) stop = startEffects();
      });
    };
    // Already in use: GSAP came with an earlier page, or this one opened
    // scrolled down (a reload, a #link).
    if (loaded || window.scrollY > 0) start();
    else firstUse.forEach((type) => window.addEventListener(type, start, { passive: true }));
    return () => {
      gone = true;
      firstUse.forEach((type) => window.removeEventListener(type, start));
      stop?.();
    };
  }, []);

  return null;
}
