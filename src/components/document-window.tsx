"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { TrafficLights } from "./traffic-lights";

type DocumentWindowProps = {
  title: string;
  /** Where closing goes: the page one level up. */
  closeHref: string;
  closeName: string;
  titleBarExtra?: React.ReactNode;
  children: React.ReactNode;
};

// Full screen is the browser's own (the Fullscreen API): a sub-page is one
// document, so there's nothing to lay it over. Where that's missing (iPhone
// Safari), the green button is greyed out.
function subscribe(onChange: () => void) {
  document.addEventListener("fullscreenchange", onChange);
  return () => document.removeEventListener("fullscreenchange", onChange);
}

// The single window a sub-page (case study, résumé, blog) lives in. Its
// traffic lights work like the desktop's: close goes one level up, minimise
// folds it to its title bar (so does a double-click on the title bar), and
// the green one enters full screen.
export function DocumentWindow({ title, closeHref, closeName, titleBarExtra, children }: DocumentWindowProps) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [minimised, setMinimised] = useState(false);
  const fullscreen = useSyncExternalStore(subscribe, () => !!document.fullscreenElement, () => false);
  const canFullscreen = useSyncExternalStore(subscribe, () => document.fullscreenEnabled, () => true);

  function toggleMinimised() {
    // Folding up from deep in a long page would leave the window off screen.
    if (!minimised && (ref.current?.getBoundingClientRect().top ?? 0) < 0) {
      ref.current?.scrollIntoView({ block: "start" });
    }
    setMinimised(!minimised);
  }

  function toggleFullscreen() {
    const done = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    done.catch(() => {});
  }

  return (
    <div ref={ref} className="window overflow-clip">
      {/* A frosted toolbar: the page scrolls under it. */}
      <div
        onDoubleClick={toggleMinimised}
        className="titlebar sticky top-8 z-10 flex h-12 select-none items-center border-b border-hairline bg-surface/80 px-4 backdrop-blur-xl backdrop-saturate-150"
      >
        <TrafficLights
          title={title}
          closeLabel={`Close, back to ${closeName}`}
          fullscreen={fullscreen}
          canZoom={canFullscreen}
          onClose={() => router.push(closeHref)}
          onMinimise={toggleMinimised}
          onZoom={toggleFullscreen}
        />
        {/* Decorative: the page's own heading names it for screen readers. */}
        <p aria-hidden className="pointer-events-none absolute inset-x-24 truncate text-center text-[13px] font-semibold text-muted">
          {title}
        </p>
        {titleBarExtra}
      </div>
      {/* overflow-clip, not hidden, so the post's sticky contents list still sticks. */}
      <div
        inert={minimised}
        className={`overflow-clip transition-[height] duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] [interpolate-size:allow-keywords] motion-reduce:transition-none ${
          minimised ? "h-0" : "h-auto"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
