"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useInView,
  useReducedMotion,
} from "motion/react";
import { ArrowsInSimple, ArrowsOutSimple, Minus, X } from "@phosphor-icons/react";

type WindowProps = {
  id: string;
  title: string;
  toolbar?: React.ReactNode;
  className?: string;
  /** Classes for the window chrome, e.g. a dark Terminal body. */
  chromeClassName?: string;
  children: React.ReactNode;
};

type State = "open" | "minimised" | "closed";

const ease = [0.16, 1, 0.3, 1] as const;

type LightsProps = {
  title: string;
  fullscreen: boolean;
  onClose: () => void;
  onMinimise: () => void;
  onZoom: () => void;
};

// Real buttons: close, minimise and full screen, with the glyphs macOS shows
// when you hover the group.
function TrafficLights({ title, fullscreen, onClose, onMinimise, onZoom }: LightsProps) {
  const light =
    "flex h-3 w-3 items-center justify-center rounded-full text-black/60 ring-1 ring-black/10 ring-inset outline-offset-2 max-md:h-3.5 max-md:w-3.5";
  const glyph = "opacity-0 transition-opacity group-hover/lights:opacity-100 group-focus-within/lights:opacity-100";

  return (
    <div className="group/lights relative z-10 flex gap-2" onDoubleClick={(e) => e.stopPropagation()}>
      <button type="button" aria-label={`Close ${title}`} onClick={onClose} className={`${light} bg-[#ff5f57]`}>
        <X size={8} weight="bold" className={glyph} aria-hidden />
      </button>
      <button type="button" aria-label={`Minimise ${title}`} onClick={onMinimise} className={`${light} bg-[#febc2e]`}>
        <Minus size={8} weight="bold" className={glyph} aria-hidden />
      </button>
      <button
        type="button"
        aria-label={fullscreen ? `Exit full screen` : `Enter full screen`}
        aria-pressed={fullscreen}
        onClick={onZoom}
        className={`${light} bg-[#28c840]`}
      >
        {fullscreen ? (
          <ArrowsInSimple size={8} weight="bold" className={glyph} aria-hidden />
        ) : (
          <ArrowsOutSimple size={8} weight="bold" className={glyph} aria-hidden />
        )}
      </button>
    </div>
  );
}

// A macOS-style window. Every page section lives in one. The traffic lights
// work, the title bar drags (it springs back), and dock or Spotlight
// reopens a window you closed.
export function Window({ id, title, toolbar, className = "", chromeClassName = "", children }: WindowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduce = useReducedMotion();
  const drag = useDragControls();
  const [state, setState] = useState<State>("open");
  const [fullscreen, setFullscreen] = useState(false);
  const [placeholder, setPlaceholder] = useState<number>();
  const [animateLayout, setAnimateLayout] = useState(false);

  // Anything that links to this window (dock, menu bar, buttons) reopens it.
  useEffect(() => {
    const reopen = () => setState("open");
    const onOpen = (e: Event) => {
      if ((e as CustomEvent<string>).detail === id) reopen();
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest?.(`a[href="#${id}"]`)) reopen();
    };
    window.addEventListener("mac:open", onOpen);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("mac:open", onOpen);
      document.removeEventListener("click", onClick, true);
    };
  }, [id]);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleFullscreen();
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  });

  function toggleFullscreen() {
    // Hold the window's place in the page so nothing jumps behind it.
    setPlaceholder(fullscreen ? undefined : sectionRef.current?.offsetHeight);
    setAnimateLayout(!reduce);
    setFullscreen(!fullscreen);
    if (state !== "open") setState("open");
  }

  function close() {
    if (fullscreen) toggleFullscreen();
    setState("closed");
  }

  const shown = inView || reduce;

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label={title}
      className={`w-full ${className}`}
      style={{ minHeight: placeholder }}
    >
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            aria-hidden
            onClick={toggleFullscreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/25 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {state === "closed" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease }}
            className="flex items-center justify-between gap-3 rounded-[22px] border border-dashed border-text/25 px-5 py-4 text-sm text-text/80"
          >
            <span className="truncate">
              <span className="font-semibold">{title}</span> is closed
            </span>
            <button
              type="button"
              onClick={() => setState("open")}
              className="whitespace-nowrap rounded-full bg-surface/80 px-4 py-1.5 text-[13px] font-medium backdrop-blur transition-colors hover:bg-surface"
            >
              Reopen
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={ref}
        data-window
        layout={animateLayout}
        onLayoutAnimationComplete={() => setAnimateLayout(false)}
        drag={!fullscreen && !reduce}
        dragControls={drag}
        dragListener={false}
        dragSnapToOrigin
        dragElastic={0.18}
        dragTransition={{ bounceStiffness: 260, bounceDamping: 18 }}
        whileDrag={{ scale: 1.01, cursor: "grabbing" }}
        initial={reduce ? false : { opacity: 0, y: 32 }}
        animate={
          state === "closed"
            ? { opacity: 0, scale: 0.9, y: 20, transitionEnd: { display: "none" } }
            : { display: "block", opacity: shown ? 1 : 0, scale: 1, y: shown ? 0 : 32 }
        }
        transition={{ duration: 0.6, ease, layout: { type: "spring", stiffness: 260, damping: 30 } }}
        className={`overflow-hidden rounded-[22px] bg-surface/90 shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_30px_70px_-20px_rgb(15_23_42/0.45)] backdrop-blur-2xl dark:shadow-[0_0_0_1px_rgb(255_255_255/0.1),0_30px_70px_-20px_rgb(0_0_0/0.7)] ${
          fullscreen ? "fixed inset-x-2 top-10 bottom-24 z-30 overflow-y-auto md:inset-x-6 md:bottom-28" : "relative"
        } ${chromeClassName}`}
      >
        <div
          onPointerDown={(e) => {
            if (e.pointerType === "mouse" && !(e.target as Element).closest("button, a, input")) drag.start(e);
          }}
          onDoubleClick={() => setState(state === "minimised" ? "open" : "minimised")}
          className={`relative flex h-12 select-none items-center border-b border-hairline px-4 ${
            fullscreen ? "sticky top-0 z-10 bg-inherit backdrop-blur-2xl" : "md:cursor-grab"
          }`}
        >
          <TrafficLights
            title={title}
            fullscreen={fullscreen}
            onClose={close}
            onMinimise={() => {
              if (fullscreen) toggleFullscreen();
              setState(state === "minimised" ? "open" : "minimised");
            }}
            onZoom={toggleFullscreen}
          />
          <p className="pointer-events-none absolute inset-x-24 truncate text-center text-[13px] font-semibold text-muted">
            {title}
          </p>
          {toolbar && <div className="ml-auto flex items-center gap-2">{toolbar}</div>}
        </div>

        {/* Kept mounted while minimised so things like Terminal history survive. */}
        <motion.div
          initial={false}
          animate={{ height: state === "minimised" ? 0 : "auto" }}
          transition={{ duration: reduce ? 0 : 0.45, ease }}
          inert={state === "minimised"}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
}
