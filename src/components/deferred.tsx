"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDev } from "@/lib/dev";

type Parts = {
  Spotlight: typeof import("./spotlight").Spotlight;
  DesktopMenu: typeof import("./desktop-menu").DesktopMenu;
  DevTools: typeof import("./dev-tools").DevTools;
  Notification: typeof import("./notification").Notification;
};

let loading: Promise<Parts> | undefined;

function load() {
  loading ??= Promise.all([
    import("./spotlight"),
    import("./desktop-menu"),
    import("./dev-tools"),
    import("./notification"),
  ]).then(([s, m, d, n]) => ({
    Spotlight: s.Spotlight,
    DesktopMenu: m.DesktopMenu,
    DevTools: d.DevTools,
    Notification: n.Notification,
  }));
  return loading;
}

// Events the parts listen for. One that fires before they've loaded is kept
// and replayed once they're listening.
const triggers = ["mac:menu", "mac:spotlight", "mac:toast"];

type DeferredProps = {
  posts: React.ComponentProps<Parts["Spotlight"]>["posts"];
};

// The pieces that are off screen until asked for: Spotlight (⌘K), the desktop
// menu, the React Native dev tools and the one-off notification banner. Their
// code loads once the page has loaded and gone idle, so it never competes with
// the first paint. Asking for one sooner (tapping the ⌘, pressing ⌘K, opening
// the Dev Menu) loads them straight away, and the request still goes through.
export function Deferred({ posts }: DeferredProps) {
  const [parts, setParts] = useState<Parts | null>(null);
  const pending = useRef<Event[]>([]);
  const dev = useDev();

  const start = useCallback(() => {
    load().then(setParts);
  }, []);

  useEffect(() => {
    const idle = () =>
      "requestIdleCallback" in window ? requestIdleCallback(start, { timeout: 2000 }) : setTimeout(start, 200);
    // A Perf Monitor left on survives a reload, so it shows at once.
    try {
      if (sessionStorage.getItem("perf")) start();
    } catch {}
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    return () => window.removeEventListener("load", idle);
  }, [start]);

  // The dev tools read a store, so they open by themselves once mounted.
  useEffect(() => {
    if (Object.values(dev).some(Boolean)) start();
  }, [dev, start]);

  useEffect(() => {
    // Effects run children first, so by now the parts are listening.
    if (parts) {
      pending.current.splice(0).forEach((e) => window.dispatchEvent(e));
      return;
    }
    const keep = (e: Event) => {
      pending.current.push(new CustomEvent(e.type, { detail: (e as CustomEvent).detail }));
      start();
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        keep(new Event("mac:spotlight"));
      }
    };
    triggers.forEach((t) => window.addEventListener(t, keep));
    window.addEventListener("keydown", onKey);
    return () => {
      triggers.forEach((t) => window.removeEventListener(t, keep));
      window.removeEventListener("keydown", onKey);
    };
  }, [parts, start]);

  if (!parts) return null;
  const { Spotlight, DesktopMenu, DevTools, Notification } = parts;

  return (
    <>
      <Notification />
      <Spotlight posts={posts} />
      <DesktopMenu />
      <DevTools />
    </>
  );
}
