"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useDev } from "@/lib/dev";

type Stats = { fps: number; drops: number; views: number; ram?: number };

const HISTORY = 48;

// React Native's Perf Monitor, measuring this page for real: frame rate from
// requestAnimationFrame, the share of dropped frames, DOM nodes as "Views",
// and JS heap where the browser exposes it (Chromium only). Drag it
// anywhere; tap it for the frame-rate graph, like on iOS.
export function PerfMonitor() {
  const { perf } = useDev();
  return <AnimatePresence>{perf && <Monitor key="perf" />}</AnimatePresence>;
}

function Monitor() {
  const [stats, setStats] = useState<Stats>();
  const [history, setHistory] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const bounds = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let id = 0;
    let start = performance.now();
    let prev = start;
    // The display's frame interval: the best median seen so far, so one
    // janky stretch can't redefine what "on time" means.
    let base = Infinity;
    let gaps: number[] = [];

    const tick = (now: number) => {
      gaps.push(now - prev);
      prev = now;
      if (now - start >= 500) {
        const sorted = [...gaps].sort((a, b) => a - b);
        base = Math.min(base, sorted[sorted.length >> 1]);
        const heap = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize;
        const fps = (gaps.length * 1000) / (now - start);
        setStats({
          fps,
          drops: gaps.filter((gap) => gap > base * 1.5).length / gaps.length,
          views: document.getElementsByTagName("*").length,
          ram: heap ? heap / 1048576 : undefined,
        });
        setHistory((h) => [...h.slice(1 - HISTORY), fps]);
        gaps = [];
        start = now;
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const stat = (label: string, value: string) => (
    <span className="flex flex-col">
      <span className="text-[9px] uppercase tracking-wider text-white/50">{label}</span>
      <span className="whitespace-nowrap tabular-nums">{value}</span>
    </span>
  );

  return (
    <>
      <div ref={bounds} aria-hidden className="pointer-events-none fixed inset-x-2 bottom-2 top-10" />
      <motion.div
        data-inspector
        drag
        dragConstraints={bounds}
        dragMomentum={false}
        dragElastic={0.1}
        onDragStart={() => {
          dragged.current = true;
        }}
        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="fixed left-3 top-11 z-[56] w-[252px] touch-none select-none overflow-hidden rounded-xl bg-black/80 font-mono text-[11px] text-white shadow-[0_8px_30px_rgb(0_0_0/0.3)] backdrop-blur-md md:cursor-grab"
      >
        <button
          type="button"
          aria-expanded={open}
          aria-label={
            stats
              ? `Perf Monitor: ${Math.round(stats.fps)} frames per second, ${(stats.drops * 100).toFixed(1)}% dropped. Show graph`
              : "Perf Monitor"
          }
          onPointerDown={() => {
            dragged.current = false;
          }}
          onClick={() => {
            if (!dragged.current) setOpen(!open);
          }}
          className="flex w-full justify-between gap-3 px-3 py-2 text-left"
        >
          {stat("RAM", stats?.ram ? `${stats.ram.toFixed(1)} MB` : "n/a")}
          {stat("Views", stats ? stats.views.toLocaleString("en-US") : "…")}
          {stat("UI", stats ? `${Math.round(stats.fps)} fps` : "…")}
          {stat("Drops", stats ? `${(stats.drops * 100).toFixed(1)}%` : "…")}
        </button>
        {open && <Graph history={history} />}
      </motion.div>
    </>
  );
}

// The iOS monitor's expanded view: frame rate over the last ~24 seconds.
function Graph({ history }: { history: number[] }) {
  const W = 228;
  const H = 44;
  const top = Math.max(...history, 60) > 65 ? 120 : 60;
  const y = (fps: number) => H - (Math.min(fps, top) / top) * H;
  const points = history.map((fps, i) => `${(i / (HISTORY - 1)) * W},${y(fps)}`).join(" ");

  return (
    <div className="border-t border-white/15 px-3 pb-2.5 pt-2">
      <p className="flex justify-between text-[9px] uppercase tracking-wider text-white/50">
        <span>UI frame rate</span>
        <span>{top} fps</span>
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden className="mt-1.5 h-11 w-full">
        {top === 120 && (
          <line x1={0} x2={W} y1={y(60)} y2={y(60)} stroke="rgb(255 255 255 / 0.25)" strokeDasharray="3 3" />
        )}
        {history.length > 1 && (
          <polygon points={`0,${H} ${points} ${((history.length - 1) / (HISTORY - 1)) * W},${H}`} fill="rgb(90 247 142 / 0.14)" />
        )}
        <polyline
          points={points}
          fill="none"
          stroke="#5af78e"
          strokeWidth={1.5}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
