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

// Runs before first paint (see layout.tsx). The first load in a tab plays a
// short boot that never covers the page (a progress line under the menu bar);
// later loads and reduced motion skip it (.booted). "Restart…" in the desktop
// menu reloads with the full boot screen (.restarting). Also applies the saved
// wallpaper without a flash.
export const bootScript = `try{var d=document.documentElement,s=sessionStorage,r=matchMedia("(prefers-reduced-motion: reduce)").matches;if(s.getItem("restart")&&!r)d.classList.add("restarting");else if(r||s.getItem("booted"))d.classList.add("booted");s.removeItem("restart");s.setItem("booted","1");var w=localStorage.getItem("wallpaper");if(w)d.dataset.wallpaper=w}catch(e){}`;

// Seconds to hold entrance animations while the boot screen is up, which is
// only after "Restart…".
export function bootDelay() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("restarting") ? 1.4 : 0;
}

// Reloads the page at the top with the full boot screen, like restarting a Mac.
export function restart() {
  try {
    sessionStorage.setItem("restart", "1");
  } catch {}
  window.scrollTo({ top: 0, behavior: "instant" });
  location.replace(location.pathname + location.search);
}
