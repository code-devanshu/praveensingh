// Small event bus the desktop pieces (dock, Spotlight, menus, windows) use
// to talk to each other without sharing React state.

export const wallpapers = [
  { id: "bloom", label: "Bloom" },
  { id: "dusk", label: "Dusk" },
  { id: "lagoon", label: "Lagoon" },
] as const;

export type WallpaperId = (typeof wallpapers)[number]["id"];

export function currentWallpaper(): WallpaperId {
  return (document.documentElement.dataset.wallpaper as WallpaperId) || "bloom";
}

export function setWallpaper(id: WallpaperId) {
  document.documentElement.dataset.wallpaper = id;
  try {
    localStorage.setItem("wallpaper", id);
  } catch {}
  window.dispatchEvent(new Event("mac:wallpaper"));
}

// Restores a window if it was closed or minimised, then scrolls to it.
export function openWindow(id: string) {
  window.dispatchEvent(new CustomEvent("mac:open", { detail: id }));
  requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ block: "start" });
    history.replaceState(null, "", `#${id}`);
  });
}

export function openSpotlight() {
  window.dispatchEvent(new Event("mac:spotlight"));
}

export function openMenu(x: number, y: number) {
  window.dispatchEvent(new CustomEvent("mac:menu", { detail: { x, y } }));
}

// Runs before first paint (see layout.tsx): skips the boot screen after the
// first load in a tab, and applies the saved wallpaper without a flash.
export const bootScript = `try{var d=document.documentElement;if(sessionStorage.getItem("booted")||matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("booted");sessionStorage.setItem("booted","1");var w=localStorage.getItem("wallpaper");if(w)d.dataset.wallpaper=w}catch(e){}`;

// Seconds to hold entrance animations while the boot screen is still up.
export function bootDelay() {
  return typeof document !== "undefined" && !document.documentElement.classList.contains("booted") ? 1.4 : 0;
}
