"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AppleLogo, CaretLeft, CaretRight, GooglePlayLogo, Star, X } from "@phosphor-icons/react";
import type { StoreApp } from "@/content";

// Store images are already sized WebP (see public/work), so they're served
// as-is with `unoptimized` rather than through the image optimizer.

// On a phone, the visitor's own store leads as a filled button and the other
// stays beside it, quieter. Desktop (and the server render) shows both equally.
const noop = () => () => {};
type Platform = "ios" | "android" | null;
function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  // iPadOS reports itself as a Mac; touch support gives it away.
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  return null;
}
function usePlatform() {
  return useSyncExternalStore<Platform>(noop, detectPlatform, () => null);
}

// The listing's screenshots in a row, like a store page. Each opens full size.
export function ScreenshotStrip({ app, onOpen }: { app: StoreApp; onOpen: (index: number) => void }) {
  return (
    <ul
      aria-label={`${app.name} screenshots`}
      className="flex h-full snap-x snap-mandatory gap-3 overflow-x-auto px-6 py-4 [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)] [scrollbar-width:none]"
    >
      {app.screenshots.map((shot, i) => (
        <li key={shot.src} className="h-full shrink-0 snap-center">
          <button
            type="button"
            onClick={() => onOpen(i)}
            aria-label={`${shot.alt}. View larger`}
            className="block h-full overflow-hidden rounded-xl shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_8px_20px_-8px_rgb(0_0_0/0.3)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <Image
              src={shot.thumb}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              unoptimized
              className="h-full w-auto"
            />
          </button>
        </li>
      ))}
    </ul>
  );
}

type ListProps = {
  apps: StoreApp[];
  active: number;
  onSelect: (index: number) => void;
};

// One row per store listing: icon, rating and store buttons. With more than
// one app, a row also switches which screenshots the card shows.
export function StoreList({ apps, active, onSelect }: ListProps) {
  const platform = usePlatform();
  const pill =
    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-[color,background-color,transform] active:scale-[0.98]";
  const quiet = `${pill} border-hairline hover:bg-accent-soft hover:text-accent`;
  const primary = `${pill} border-transparent bg-accent-fill text-white hover:brightness-110`;

  return (
    <div className="mt-5">
      <ul className="divide-y divide-hairline overflow-hidden rounded-xl border border-hairline">
        {apps.map((app, i) => {
          const identity = (
            <>
              <Image
                src={app.icon}
                alt=""
                width={44}
                height={44}
                unoptimized
                className="h-11 w-11 shrink-0 rounded-[22.5%] ring-1 ring-black/5"
              />
              <span className="min-w-0">
                <span className="block truncate font-semibold">{app.name}</span>
                <span className="flex items-center gap-1 text-xs text-muted">
                  {app.category}
                  {app.rating && (
                    <>
                      <span aria-hidden>·</span>
                      <Star size={11} weight="fill" aria-hidden className="text-[#ff9f0a]" />
                      <span className="tabular-nums">
                        {app.rating.value}
                        <span className="sr-only"> out of 5 stars from</span> ({app.rating.count}
                        <span className="sr-only"> ratings on the {app.rating.store}</span>)
                      </span>
                    </>
                  )}
                </span>
              </span>
            </>
          );

          const stores = [
            app.ios && (
              <a key="ios" href={app.ios} target="_blank" rel="noreferrer" className={platform === "ios" ? primary : quiet}>
                <AppleLogo size={14} weight="fill" aria-hidden />
                App Store
              </a>
            ),
            app.android && (
              <a key="android" href={app.android} target="_blank" rel="noreferrer" className={platform === "android" ? primary : quiet}>
                <GooglePlayLogo size={14} weight="fill" aria-hidden />
                Google Play
              </a>
            ),
          ].filter(Boolean);
          if (platform === "android") stores.reverse();

          return (
            <li
              key={app.name}
              className={`flex flex-wrap items-center gap-x-3 gap-y-2.5 p-3 transition-colors ${
                apps.length > 1 && i === active ? "bg-accent-soft" : ""
              }`}
            >
              {apps.length > 1 ? (
                <button
                  type="button"
                  aria-pressed={i === active}
                  aria-label={`Show ${app.name} screenshots`}
                  onClick={() => onSelect(i)}
                  className="flex min-w-[12rem] flex-1 items-center gap-3 text-left"
                >
                  {identity}
                </button>
              ) : (
                <div className="flex min-w-[12rem] flex-1 items-center gap-3">{identity}</div>
              )}
              <div className="flex gap-1.5">{stores}</div>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-[11px] text-muted">
        Screenshots{apps.some((app) => app.rating) && " and ratings"} from the public store{" "}
        {apps.length > 1 ? "listings" : "listing"}.
      </p>
    </div>
  );
}

type LightboxProps = {
  app: StoreApp;
  index: number | null;
  onIndex: (index: number | null) => void;
};

// Full-size screenshots. Portalled to <body> because windows are transformed,
// which would otherwise trap a `fixed` overlay inside them.
export function Lightbox({ app, index, onIndex }: LightboxProps) {
  const reduce = useReducedMotion();
  const close = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const count = app.screenshots.length;
  // Server has no <body> to portal into; render only once on the client.
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    close.current?.focus({ preventScroll: true });
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      previous?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onIndex(null);
      else if (e.key === "ArrowRight") onIndex((index + 1) % count);
      else if (e.key === "ArrowLeft") onIndex((index - 1 + count) % count);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, count, onIndex]);

  if (!mounted) return null;
  const shot = index === null ? null : app.screenshots[index];
  const arrow =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25";

  return createPortal(
    <AnimatePresence>
      {shot && index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${app.name} screenshots`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onIndex(null);
          }}
          className="fixed inset-0 z-[70] flex items-center justify-center gap-3 bg-black/80 px-3 backdrop-blur-md md:gap-6"
        >
          <button
            ref={close}
            type="button"
            aria-label="Close"
            onClick={() => onIndex(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            <X size={18} weight="bold" aria-hidden />
          </button>

          {count > 1 && (
            <button type="button" aria-label="Previous screenshot" onClick={() => onIndex((index - 1 + count) % count)} className={`${arrow} max-sm:hidden`}>
              <CaretLeft size={20} weight="bold" aria-hidden />
            </button>
          )}

          <motion.figure
            key={shot.src}
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            drag={count > 1 && !reduce ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) onIndex((index + 1) % count);
              else if (info.offset.x > 60) onIndex((index - 1 + count) % count);
            }}
            className="flex min-w-0 touch-pan-y flex-col items-center"
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              unoptimized
              draggable={false}
              // Sized from the known dimensions so the layout holds while it loads.
              style={{
                aspectRatio: `${shot.width} / ${shot.height}`,
                height: `min(78vh, calc((100vw - 32px) * ${shot.height / shot.width}))`,
              }}
              className="w-auto rounded-2xl bg-white/5"
            />
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {shot.alt}
              <span className="ml-2 tabular-nums text-white/50">
                {index + 1} / {count}
              </span>
            </figcaption>
          </motion.figure>

          {count > 1 && (
            <button type="button" aria-label="Next screenshot" onClick={() => onIndex((index + 1) % count)} className={`${arrow} max-sm:hidden`}>
              <CaretRight size={20} weight="bold" aria-hidden />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
