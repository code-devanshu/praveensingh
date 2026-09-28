"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/content";
import { openWindow } from "@/lib/desktop";
import { reload, setDev, useDev } from "@/lib/dev";

const trace = [
  ["hireSeniorReactNativeEngineer", "src/team/Hiring.tsx:42:7"],
  ["reviewPortfolio", "src/recruiter/Inbox.tsx:108:3"],
  ["thinkAboutIt", "src/recruiter/Decision.tsx:1:1"],
  ["renderWithHooks", "node_modules/react-native/Libraries/Renderer/implementations/ReactFabric-dev.js:7318:18"],
];

// React Native's red screen, which every RN developer knows by heart. Thrown
// by the Dev Menu or the Terminal ("crash", or try "rm -rf /").
export function RedBox() {
  const { redbox } = useDev();
  const dismiss = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!redbox) return;
    const previous = document.activeElement as HTMLElement | null;
    dismiss.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDev({ redbox: false });
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      previous?.focus({ preventScroll: true });
    };
  }, [redbox]);

  const button = "px-2 py-4 text-[13px] leading-tight transition-colors hover:bg-white/10 focus-visible:bg-white/15 outline-none";

  return (
    <AnimatePresence>
      {redbox && (
        <motion.div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="redbox-title"
          aria-describedby="redbox-detail"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex flex-col bg-[#cc0000] font-mono text-white"
        >
          <div className="flex-1 overflow-y-auto px-5 pb-8 pt-12 md:px-12 md:pt-16">
            <div className="mx-auto max-w-3xl">
              <h2 id="redbox-title" className="text-lg font-bold leading-snug md:text-2xl">
                Invariant Violation: {site.name} is still available.
              </h2>
              <p id="redbox-detail" className="mt-4 text-sm leading-relaxed md:text-base">
                Expected a Senior React Native engineer on your team, but received undefined.
              </p>
              <p className="mt-6 whitespace-pre-wrap text-[13px] leading-relaxed text-white/80">
                {"This error is located at:\n    in YourTeam (at Hiring.tsx:42)\n    in RoadmapQ4 (at App.tsx:17)\n    in App"}
              </p>
              <ol className="mt-8 space-y-4 text-[13px]">
                {trace.map(([fn, file]) => (
                  <li key={fn}>
                    <p className="font-bold">{fn}</p>
                    <p className="break-all text-white/70">{file}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="grid grid-cols-3 border-t border-white/20 bg-black/15 pb-[env(safe-area-inset-bottom)]">
            <button ref={dismiss} type="button" onClick={() => setDev({ redbox: false })} className={button}>
              Dismiss
              <span className="block text-white/60">(ESC)</span>
            </button>
            <button type="button" onClick={reload} className={button}>
              Reload
              <span className="block text-white/60">(Metro)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setDev({ redbox: false });
                openWindow("contact");
              }}
              className={`${button} font-bold`}
            >
              Fix
              <span className="block font-normal text-white/60">(email Praveen)</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
