"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "@/content";
import { reload, setDev, useDev } from "@/lib/dev";
import { Inspector } from "./inspector";
import { PerfMonitor } from "./perf-monitor";
import { RedBox } from "./red-box";

let greeted = false;

// Everything behind the ⚛ in the menu bar. The site isn't React Native, but
// every tool here works on the page for real.
export function DevTools() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("perf")) setDev({ perf: true });
    } catch {}
    if (greeted) return;
    greeted = true;
    console.log(
      "%cHey, developer.%c\n\nLooking under the hood? Tap the ⚛ in the menu bar for the React Native Dev Menu, or type \"metro\" in the Terminal window.\n\nHiring? %s",
      "font: 600 18px system-ui; color: #0071e3",
      "font: 13px system-ui",
      site.email,
    );
  }, []);

  return (
    <>
      <DevMenu />
      <PerfMonitor />
      <Inspector />
      <RedBox />
      <Bundling />
      <Toast />
    </>
  );
}

// React Native's in-app Dev Menu: an action sheet on phones, an alert on
// wider screens.
function DevMenu() {
  const dev = useDev();
  const reduce = useReducedMotion();
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dev.menu) return;
    const previous = document.activeElement as HTMLElement | null;
    sheet.current?.querySelector("button")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDev({ menu: false });
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus({ preventScroll: true });
    };
  }, [dev.menu]);

  const actions = [
    { label: "Reload", run: reload },
    {
      label: dev.perf ? "Hide Perf Monitor" : "Show Perf Monitor",
      run: () => setDev({ menu: false, perf: !dev.perf }),
    },
    {
      label: dev.inspector ? "Hide Element Inspector" : "Show Element Inspector",
      run: () => setDev({ menu: false, inspector: !dev.inspector }),
    },
    { label: "Throw a Test Error", destructive: true, run: () => setDev({ menu: false, redbox: true }) },
  ];

  const row =
    "block w-full px-4 py-3.5 text-center text-[17px] outline-none transition-colors hover:bg-black/5 focus-visible:bg-black/5 dark:hover:bg-white/10 dark:focus-visible:bg-white/10";

  return (
    <AnimatePresence>
      {dev.menu && (
        <motion.div
          key="dev-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDev({ menu: false });
          }}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/30 p-2.5 pb-[max(10px,env(safe-area-inset-bottom))] md:items-center"
        >
          <motion.div
            ref={sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dev-menu-title"
            initial={reduce ? false : { y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
            className="w-full max-w-[400px] md:max-w-[300px]"
          >
            <div className="glass overflow-hidden rounded-[14px] bg-surface/80">
              <div className="border-b border-hairline px-4 py-3.5 text-center">
                <h2 id="dev-menu-title" className="text-[13px] font-semibold text-muted">
                  React Native Dev Menu
                </h2>
                <p className="mt-0.5 text-[13px] text-muted">Running portfolio on {site.name.split(" ")[0]}&apos;s desktop</p>
              </div>
              <ul className="divide-y divide-hairline">
                {actions.map((action) => (
                  <li key={action.label}>
                    <button
                      type="button"
                      onClick={action.run}
                      className={`${row} ${action.destructive ? "text-[#ff3b30]" : "text-accent"}`}
                    >
                      {action.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass mt-2 overflow-hidden rounded-[14px] bg-surface/90">
              <button type="button" onClick={() => setDev({ menu: false })} className={`${row} font-semibold text-accent`}>
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const MODULES = 1871;

// Metro's progress banner, then a real reload.
function Bundling() {
  const { bundling } = useDev();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!bundling) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      location.reload();
      return;
    }
    const start = performance.now();
    let id = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / 1300);
      setProgress(1 - (1 - t) ** 3);
      if (t < 1) id = requestAnimationFrame(tick);
      else location.reload();
    });
    return () => cancelAnimationFrame(id);
  }, [bundling]);

  if (!bundling) return null;
  const filled = Math.round(progress * 12);

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[90] flex h-8 items-center justify-center bg-[#20232a] px-3 font-mono text-[12px] text-white"
    >
      <p className="truncate">
        Bundling index.js{" "}
        <span aria-hidden className="text-[#61dafb]">
          {"▓".repeat(filled)}
          {"░".repeat(12 - filled)}
        </span>{" "}
        <span className="tabular-nums">
          {(progress * 100).toFixed(1)}% ({Math.round(progress * MODULES)}/{MODULES})
        </span>
      </p>
    </div>
  );
}

// Android-style toasts, for the build-number easter egg and friends.
function Toast() {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    let timer = 0;
    const onToast = (e: Event) => {
      setText((e as CustomEvent<string>).detail);
      clearTimeout(timer);
      timer = window.setTimeout(() => setText(null), 2200);
    };
    window.addEventListener("mac:toast", onToast);
    return () => {
      window.removeEventListener("mac:toast", onToast);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-6 md:bottom-28">
      <AnimatePresence mode="wait">
        {text && (
          <motion.p
            key={text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="rounded-full bg-[#323232]/95 px-4 py-2 text-center text-[13px] text-white shadow-lg"
          >
            {text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
