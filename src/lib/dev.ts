import { useSyncExternalStore } from "react";

// "Development mode": the React Native tools hidden in the desktop (Dev Menu,
// Perf Monitor, Element Inspector, red box). One tiny store so the menu bar,
// Terminal, Spotlight and the tools themselves agree on what is showing.

export type DevState = {
  menu: boolean;
  perf: boolean;
  inspector: boolean;
  redbox: boolean;
  bundling: boolean;
  /** Unlocked by tapping the build number in About seven times. */
  developer: boolean;
};

const initial: DevState = {
  menu: false,
  perf: false,
  inspector: false,
  redbox: false,
  bundling: false,
  developer: false,
};

let state = initial;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getDev() {
  return state;
}

export function setDev(patch: Partial<DevState>) {
  state = { ...state, ...patch };
  // The Perf Monitor survives a reload, like it does in a real app.
  if (patch.perf !== undefined) {
    try {
      if (patch.perf) sessionStorage.setItem("perf", "1");
      else sessionStorage.removeItem("perf");
    } catch {}
  }
  listeners.forEach((listener) => listener());
}

export function useDev() {
  return useSyncExternalStore(subscribe, getDev, () => initial);
}

export const openDevMenu = () => setDev({ menu: true });

/** Plays a Metro "Bundling…" banner, then reloads the page. */
export const reload = () => setDev({ menu: false, redbox: false, inspector: false, bundling: true });

export function toast(text: string) {
  window.dispatchEvent(new CustomEvent("mac:toast", { detail: text }));
}
