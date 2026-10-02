"use client";

import { useEffect, useRef, useState } from "react";
import type { Heading } from "@/blog";

// Slack below the point where a clicked heading lands, so a heading counts as
// current once it is there or above.
const TOLERANCE = 8;

/** "On this page": marks the section being read as the reader scrolls. */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(null);
  // After a click, hold the clicked item while the page smooth-scrolls to it,
  // so the highlight doesn't run through every section on the way.
  const pending = useRef<{ id: string; until: number } | null>(null);

  useEffect(() => {
    const elements = headings.map((h) => document.getElementById(h.id)).filter((el) => el !== null);
    if (elements.length === 0) return;

    // Where a heading sits after jumping to it: the page's scroll-padding-top
    // plus the heading's own scroll-margin-top (they add up).
    const px = (value: string) => parseFloat(value) || 0;
    const pagePadding = px(getComputedStyle(document.documentElement).scrollPaddingTop);
    const lines = elements.map((el) => pagePadding + px(getComputedStyle(el).scrollMarginTop) + TOLERANCE);

    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const target = pending.current;
      if (target) {
        // Release once the heading has arrived (or the page can't scroll further).
        const i = elements.findIndex((el) => el.id === target.id);
        const arrived = i >= 0 && Math.abs(elements[i].getBoundingClientRect().top - (lines[i] - TOLERANCE)) <= TOLERANCE;
        if (!arrived && !atBottom && Date.now() < target.until) return;
        pending.current = null;
        // At the bottom a section near the end can't reach the top; keep the clicked one.
        if (arrived || atBottom) return setActive(target.id);
      }
      if (atBottom) return setActive(elements[elements.length - 1].id);
      let current: string | null = null;
      for (const [i, el] of elements.entries()) {
        if (el.getBoundingClientRect().top <= lines[i]) current = el.id;
        else break;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // The reader taking over (wheel, touch, keys) cancels a pending jump.
    const takeOver = () => {
      pending.current = null;
      schedule();
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const inputs = ["wheel", "touchstart", "keydown"] as const;
    for (const type of inputs) window.addEventListener(type, takeOver, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      for (const type of inputs) window.removeEventListener(type, takeOver);
    };
  }, [headings]);

  return (
    <nav aria-label="On this page" className="hidden lg:block">
      <div className="sticky top-32 mt-10 text-sm">
        <p className="font-semibold">On this page</p>
        <ol className="mt-3 space-y-2 border-l border-hairline">
          {headings.map((h) => {
            const current = h.id === active;
            return (
              <li key={h.id} className={`relative ${h.level === 3 ? "pl-6" : "pl-3"}`}>
                {current && <span aria-hidden className="absolute inset-y-0 -left-px w-0.5 rounded-full bg-accent-fill" />}
                <a
                  href={`#${h.id}`}
                  aria-current={current ? "location" : undefined}
                  onClick={() => {
                    setActive(h.id);
                    pending.current = { id: h.id, until: Date.now() + 3000 };
                  }}
                  className={`block leading-snug transition-colors hover:text-accent ${
                    current ? "font-medium text-accent" : "text-muted"
                  }`}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
