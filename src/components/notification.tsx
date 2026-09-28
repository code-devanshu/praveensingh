"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChatCircleDots, X } from "@phosphor-icons/react";
import { availability, site } from "@/content";
import { bootDelay, openWindow } from "@/lib/desktop";

// One macOS-style banner per visit, a few seconds after the desktop loads.
export function Notification() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    try {
      if (sessionStorage.getItem("notified")) return;
    } catch {}
    const show = setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem("notified", "1");
      } catch {}
    }, (bootDelay() + 3.5) * 1000);
    const hide = setTimeout(() => setOpen(false), (bootDelay() + 13) * 1000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-3 top-11 z-40 flex justify-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 380 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: 380 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.05, right: 0.8 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 80) setOpen(false);
            }}
            className="group glass pointer-events-auto relative w-full max-w-[360px] rounded-[22px] bg-surface/75"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openWindow("contact");
              }}
              className="flex w-full items-start gap-3 p-3.5 text-left"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[22.5%] bg-linear-to-b from-[#6ee27a] to-[#28b33a] text-white shadow-sm">
                <ChatCircleDots size={24} weight="fill" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 text-[13px] leading-snug">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold">{site.name}</span>
                  <span className="text-xs text-muted">now</span>
                </span>
                <span className="mt-0.5 block text-text/80">{availability.notification}</span>
              </span>
            </button>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setOpen(false)}
              className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-surface text-muted shadow-md ring-1 ring-hairline transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
            >
              <X size={11} weight="bold" aria-hidden />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
