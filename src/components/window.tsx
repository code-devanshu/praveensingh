"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useInView,
  useReducedMotion,
} from "motion/react";
import { activate, useFrontmost } from "@/lib/frontmost";
import { TrafficLights } from "./traffic-lights";

type WindowProps = {
  id: string;
  title: string;
  toolbar?: React.ReactNode;
  className?: string;
  /** Classes for the window chrome, e.g. a dark Terminal body. */
  chromeClassName?: string;
  children: React.ReactNode;
  /** Above the fold: shown from the first paint instead of fading in on scroll. */
  priority?: boolean;
};

type State = "open" | "minimised" | "closed";

const ease = [0.16, 1, 0.3, 1] as const;

/** Clears what the genie left on a window (lib/genie.ts). */
function unGenie(el: HTMLElement | null) {
  el?.style.removeProperty("clip-path");
  el?.style.removeProperty("translate");
}

// A macOS-style window. Every page section lives in one. The traffic lights
// work (minimise pours the window into its Dock icon), the title bar drags
// (it springs back), and the Dock or Spotlight brings back a window you
// closed or minimised. Only the frontmost window looks active.
export function Window({ id, title, toolbar, className = "", chromeClassName = "", children, priority = false }: WindowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // Fades in once its top edge is a little way up the screen. A share of the
  // window (`amount`) can't be used: on phones some windows are several
  // screens tall, so that share would never fit on screen at once.
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const drag = useDragControls();
  const [state, setState] = useState<State>("open");
  const [fullscreen, setFullscreen] = useState(false);
  const [placeholder, setPlaceholder] = useState<number>();
  const [animateLayout, setAnimateLayout] = useState(false);
  const frontmost = useFrontmost(id, sectionRef);
  const minimising = useRef(false);

  // Anything that links to this window (dock, menu bar, buttons) reopens it.
  useEffect(() => {
    const reopen = () => {
      unGenie(ref.current);
      setState("open");
    };
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

  // GSAP loads on the first minimise, if the effects haven't brought it yet.
  async function minimise() {
    if (fullscreen) {
      toggleFullscreen();
      setState("minimised");
      return;
    }
    if (minimising.current || !ref.current) return;
    minimising.current = true;
    if (!reduce) {
      try {
        const { genie } = await import("@/lib/genie");
        await genie(ref.current, id);
      } catch {}
    }
    minimising.current = false;
    setState("minimised");
  }

  function restore() {
    unGenie(ref.current);
    setState("open");
  }

  const shown = inView || reduce || priority;

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label={title}
      className={`w-full ${className}`}
      style={{ minHeight: placeholder }}
      onPointerDown={() => activate(id)}
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
        {state !== "open" && (
          <motion.div
            key={state}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease }}
            className="flex items-center justify-between gap-3 rounded-window border border-dashed border-text/25 px-5 py-4 text-sm text-text/80"
          >
            <span className="truncate">
              <span className="font-semibold">{title}</span> {state === "closed" ? "is closed" : "is in the Dock"}
            </span>
            <button
              type="button"
              onClick={restore}
              className="whitespace-nowrap rounded-full bg-surface/80 px-4 py-1.5 text-[13px] font-medium backdrop-blur transition-colors hover:bg-surface"
            >
              {state === "closed" ? "Reopen" : "Restore"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={ref}
        data-window
        data-active={frontmost || fullscreen}
        layout={animateLayout}
        onLayoutAnimationComplete={() => setAnimateLayout(false)}
        drag={!fullscreen && !reduce}
        dragControls={drag}
        dragListener={false}
        dragSnapToOrigin
        dragElastic={0.18}
        dragTransition={{ bounceStiffness: 260, bounceDamping: 18 }}
        whileDrag={{ scale: 1.01, cursor: "grabbing" }}
        initial={reduce || priority ? false : { opacity: 0, y: 32 }}
        // Closed and minimised windows stay mounted (display: none), so things
        // like Terminal history survive. A minimised one is already inside
        // the Dock by now, so it goes at once.
        animate={
          state === "open"
            ? { display: "block", opacity: shown ? 1 : 0, scale: 1, y: shown ? 0 : 32 }
            : {
                opacity: 0,
                scale: 0.9,
                y: 20,
                ...(state === "minimised" && { transition: { duration: 0 } }),
                transitionEnd: { display: "none" },
              }
        }
        transition={{ duration: 0.6, ease, layout: { type: "spring", stiffness: 260, damping: 30 } }}
        className={`window overflow-hidden ${
          fullscreen ? "fixed inset-x-2 top-10 bottom-24 z-30 overflow-y-auto md:inset-x-6 md:bottom-28" : "relative"
        } ${chromeClassName}`}
      >
        <div
          onPointerDown={(e) => {
            if (e.pointerType === "mouse" && !(e.target as Element).closest("button, a, input")) drag.start(e);
          }}
          onDoubleClick={minimise}
          className={`titlebar relative flex h-12 select-none items-center border-b border-hairline px-4 ${
            fullscreen ? "sticky top-0 z-10 bg-inherit backdrop-blur-2xl" : "md:cursor-grab"
          }`}
        >
          <TrafficLights
            title={title}
            fullscreen={fullscreen}
            onClose={close}
            onMinimise={minimise}
            onZoom={toggleFullscreen}
          />
          <p className="titlebar-title pointer-events-none absolute inset-x-24 truncate text-center text-[13px] font-semibold text-muted transition-opacity">
            {title}
          </p>
          {toolbar && <div className="ml-auto flex items-center gap-2">{toolbar}</div>}
        </div>

        {children}
      </motion.div>
    </section>
  );
}
