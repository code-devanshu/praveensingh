"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Command, Phone, PhoneDisconnect, PhoneX } from "@phosphor-icons/react";
import { availability, site } from "@/content";
import { bootDelay, openWindow } from "@/lib/desktop";

type Mode = "boot" | "live" | "ringing" | "missed";

const sizes: Record<Mode, string> = {
  boot: "h-[22px] w-[40%] rounded-[11px] md:h-[26px] md:rounded-[13px]",
  live: "h-[22px] w-[86%] rounded-[11px] md:h-[26px] md:rounded-[13px]",
  missed: "h-[22px] w-[86%] rounded-[11px] md:h-[26px] md:rounded-[13px]",
  ringing: "h-14 w-[94%] rounded-[26px] md:h-16 md:rounded-[30px]",
};

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

// The front phone's Dynamic Island boots first: the boot screen in miniature,
// a ⌘ and a filling bar, drawn by the server and animated in CSS so it plays
// from first paint. Then it grows into a live activity saying Praveen is
// available. Tap it and Praveen calls you: accept opens the Mail window,
// decline leaves a missed call. On Android phones it really buzzes.
export function LiveIsland() {
  const [mode, setMode] = useState<Mode>("boot");
  const accept = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const next: Partial<Record<Mode, [Mode, number]>> = {
      // The bar fills in about 1.1s from navigation; hydration may land later.
      boot: ["live", Math.max(300, (bootDelay() + 1.2) * 1000 - performance.now())],
      ringing: ["missed", 12000],
      missed: ["live", 3500],
    };
    const step = next[mode];
    if (!step) return;
    const id = setTimeout(() => setMode(step[0]), step[1]);
    return () => clearTimeout(id);
  }, [mode]);

  useEffect(() => {
    if (mode === "ringing") accept.current?.focus({ preventScroll: true });
  }, [mode]);

  function ring() {
    setMode("ringing");
    try {
      navigator.vibrate?.([180, 120, 180, 120, 180]);
    } catch {}
  }

  const round = "flex h-7 w-7 shrink-0 items-center justify-center rounded-full md:h-9 md:w-9";

  return (
    <div
      className={`absolute left-1/2 top-2.5 z-10 -translate-x-1/2 overflow-hidden bg-black text-white transition-[width,height,border-radius] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] motion-reduce:transition-none ${sizes[mode]}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mode === "boot" && (
          <motion.div key="boot" aria-hidden {...fade} className="flex h-full w-full items-center gap-1.5 px-2.5">
            <Command weight="bold" className="h-2.5 w-2.5 shrink-0 md:h-3 md:w-3" />
            <span className="island-boot-bar flex-1" />
          </motion.div>
        )}

        {mode === "live" && (
          <motion.button
            key="live"
            type="button"
            onClick={ring}
            aria-label={`${availability.short}. Tap for a call from ${site.name}`}
            {...fade}
            className="flex h-full w-full min-w-0 items-center gap-1.5 px-2.5"
          >
            <span aria-hidden className="live-dot h-1.5 w-1.5 shrink-0 rounded-full bg-[#30d158]" />
            <span className="truncate text-[9px] font-medium md:text-[11px]">{availability.short}</span>
          </motion.button>
        )}

        {mode === "ringing" && (
          <motion.div
            key="ringing"
            role="group"
            aria-label={`Incoming call from ${site.name}`}
            {...fade}
            className="flex h-full w-full items-center gap-1.5 pl-3 pr-2 md:gap-2 md:pl-4 md:pr-2.5"
          >
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-[8px] text-white/55 md:text-[10px]">mobile</span>
              <span className="block truncate text-[10px] font-semibold md:text-[12px]">{site.name}</span>
            </span>
            <button
              type="button"
              aria-label="Decline"
              onClick={() => setMode("missed")}
              className={`${round} bg-[#ff3b30]`}
            >
              <PhoneDisconnect weight="fill" aria-hidden className="h-[55%] w-[55%]" />
            </button>
            <button
              ref={accept}
              type="button"
              aria-label="Accept, and write to Praveen"
              onClick={() => {
                setMode("live");
                openWindow("contact");
              }}
              className={`${round} bg-[#30d158]`}
            >
              <Phone weight="fill" aria-hidden className="ring-wiggle h-[55%] w-[55%]" />
            </button>
          </motion.div>
        )}

        {mode === "missed" && (
          <motion.button
            key="missed"
            type="button"
            onClick={ring}
            aria-label="Missed call. Call back"
            {...fade}
            className="flex h-full w-full min-w-0 items-center gap-1.5 px-2.5"
          >
            <PhoneX weight="fill" aria-hidden className="h-3 w-3 shrink-0 text-[#ff453a] md:h-3.5 md:w-3.5" />
            <span className="truncate text-[9px] font-medium md:text-[11px]">Missed call</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
