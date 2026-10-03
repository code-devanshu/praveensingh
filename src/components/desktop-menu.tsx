"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "@phosphor-icons/react";
import {
  currentGlass,
  currentWallpaper,
  glassPresets,
  openSpotlight,
  openWindow,
  restart,
  setGlass,
  setWallpaper,
  wallpapers,
  type WallpaperId,
} from "@/lib/desktop";
import { openDevMenu } from "@/lib/dev";

type Point = { x: number; y: number };

const WIDTH = 240;

// The menu you get when right-clicking the desktop (or tapping the ⌘ in the
// menu bar). Its best tricks: switching the wallpaper, and the macOS 27
// Liquid Glass slider.
export function DesktopMenu() {
  const [at, setAt] = useState<Point | null>(null);
  const [wallpaper, setWallpaperState] = useState<WallpaperId>("golden-gate");
  const [glass, setGlassState] = useState(0.5);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const show = (p: Point) => {
      setWallpaperState(currentWallpaper());
      setGlassState(currentGlass());
      setAt({
        x: Math.max(8, Math.min(p.x, window.innerWidth - WIDTH - 8)),
        y: Math.max(8, Math.min(p.y, window.innerHeight - 460)),
      });
    };
    const onContext = (e: MouseEvent) => {
      // Only the bare desktop: windows, links and fields keep the browser menu.
      if ((e.target as Element).closest("[data-window], a, button, input, textarea, header, nav")) return;
      e.preventDefault();
      show({ x: e.clientX, y: e.clientY });
    };
    const onMenu = (e: Event) => show((e as CustomEvent<Point>).detail);
    const onWallpaper = () => setWallpaperState(currentWallpaper());
    const onGlass = () => setGlassState(currentGlass());

    document.addEventListener("contextmenu", onContext);
    window.addEventListener("mac:menu", onMenu);
    window.addEventListener("mac:wallpaper", onWallpaper);
    window.addEventListener("mac:glass", onGlass);
    return () => {
      document.removeEventListener("contextmenu", onContext);
      window.removeEventListener("mac:menu", onMenu);
      window.removeEventListener("mac:wallpaper", onWallpaper);
      window.removeEventListener("mac:glass", onGlass);
    };
  }, []);

  useEffect(() => {
    if (!at) return;
    menu.current?.querySelector<HTMLElement>('[role^="menuitem"]')?.focus({ preventScroll: true });
    const close = (e: Event) => {
      if (e.type === "keydown" && (e as KeyboardEvent).key !== "Escape") return;
      if (e.type === "pointerdown" && menu.current?.contains(e.target as Node)) return;
      setAt(null);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    window.addEventListener("scroll", close, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
      window.removeEventListener("scroll", close);
    };
  }, [at]);

  // Up and down move between items, like a native menu; left and right move
  // the slider.
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const all = [...(menu.current?.querySelectorAll<HTMLElement>('[role^="menuitem"], input') ?? [])];
    const i = all.indexOf(document.activeElement as HTMLElement);
    all[(i + (e.key === "ArrowDown" ? 1 : -1) + all.length) % all.length]?.focus();
  }

  const act = (fn: () => void) => () => {
    setAt(null);
    fn();
  };

  const item =
    "flex w-full items-center gap-2 rounded-md px-2.5 py-1 text-left text-[13px] outline-none hover:bg-accent-fill hover:text-white focus-visible:bg-accent-fill focus-visible:text-white";

  return (
    <AnimatePresence>
      {at && (
        <motion.div
          ref={menu}
          role="menu"
          aria-label="Desktop"
          onKeyDown={onKeyDown}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={{ duration: 0.12 }}
          style={{ left: at.x, top: at.y, width: WIDTH, transformOrigin: "top left" }}
          className="glass glass-thick fixed z-50 rounded-xl p-1.5"
        >
          <button role="menuitem" className={item} onClick={act(() => openWindow("about"))}>
            About This Developer
          </button>
          <div role="separator" className="mx-2.5 my-1 h-px bg-text/15" />
          <button role="menuitem" className={item} onClick={act(openSpotlight)}>
            Spotlight Search
            <span className="ml-auto opacity-60">⌘K</span>
          </button>
          <button role="menuitem" className={item} onClick={act(() => openWindow("terminal"))}>
            Open Terminal
          </button>
          <button role="menuitem" className={item} onClick={act(openDevMenu)}>
            React Native Dev Menu
          </button>
          <button role="menuitem" className={item} onClick={act(() => openWindow("contact"))}>
            New Message
          </button>
          <div role="separator" className="mx-2.5 my-1 h-px bg-text/15" />
          <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold text-muted">Wallpaper</p>
          {wallpapers.map((w) => (
            <button
              key={w.id}
              role="menuitemradio"
              aria-checked={wallpaper === w.id}
              className={item}
              onClick={act(() => setWallpaper(w.id))}
            >
              <span aria-hidden className="h-4 w-6 rounded ring-1 ring-black/10 ring-inset" data-wallpaper-swatch={w.id} />
              {w.label}
              {wallpaper === w.id && <Check size={14} weight="bold" className="ml-auto" aria-hidden />}
            </button>
          ))}
          <div role="separator" className="mx-2.5 my-1 h-px bg-text/15" />
          {/* From Clear to Tinted. Changes apply as the slider moves. */}
          <p id="glass-label" className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold text-muted">
            Liquid Glass
          </p>
          <div className="flex items-center gap-2 px-2.5 pb-1.5 text-[11px] text-muted">
            <span aria-hidden>Clear</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              list="glass-presets"
              value={glass}
              aria-labelledby="glass-label"
              aria-valuetext={glassPresets.find((p) => p.value === glass)?.label ?? `${Math.round(glass * 100)}% tinted`}
              onChange={(e) => {
                setGlassState(+e.target.value);
                setGlass(+e.target.value);
              }}
              className="h-4 min-w-0 flex-1 accent-accent-fill"
            />
            <datalist id="glass-presets">
              {glassPresets.map((p) => (
                <option key={p.value} value={p.value} label={p.label} />
              ))}
            </datalist>
            <span aria-hidden>Tinted</span>
          </div>
          <div role="separator" className="mx-2.5 my-1 h-px bg-text/15" />
          {/* Replays the full boot screen. */}
          <button role="menuitem" className={item} onClick={act(restart)}>
            Restart…
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
