// Small event bus the desktop pieces (dock, Spotlight, menus, windows) use
// to talk to each other without sharing React state.

export const wallpapers = [
  { id: "golden-gate", label: "Golden Gate" },
  { id: "bloom", label: "Bloom" },
  { id: "dusk", label: "Dusk" },
  { id: "lagoon", label: "Lagoon" },
] as const;

export type WallpaperId = (typeof wallpapers)[number]["id"];

export function currentWallpaper(): WallpaperId {
  return (document.documentElement.dataset.wallpaper as WallpaperId) || "golden-gate";
}

export function setWallpaper(id: WallpaperId) {
  document.documentElement.dataset.wallpaper = id;
  try {
    localStorage.setItem("wallpaper", id);
  } catch {}
  window.dispatchEvent(new Event("mac:wallpaper"));
}

// Liquid Glass, as in macOS 27's Appearance settings: one slider from
// Clear (0) to Tinted (1) for every glass surface. Sets --glass on <html>.
export const glassPresets = [
  { value: 0, label: "Clear" },
  { value: 0.5, label: "Default" },
  { value: 1, label: "Tinted" },
] as const;

export function currentGlass(): number {
  const value = parseFloat(document.documentElement.style.getPropertyValue("--glass"));
  return Number.isNaN(value) ? 0.5 : value;
}

export function setGlass(value: number) {
  document.documentElement.style.setProperty("--glass", String(value));
  try {
    localStorage.setItem("glass", String(value));
  } catch {}
  window.dispatchEvent(new Event("mac:glass"));
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
// wallpaper and Liquid Glass setting without a flash.
export const bootScript = `try{var d=document.documentElement,s=sessionStorage,r=matchMedia("(prefers-reduced-motion: reduce)").matches;if(s.getItem("restart")&&!r)d.classList.add("restarting");else if(r||s.getItem("booted"))d.classList.add("booted");s.removeItem("restart");s.setItem("booted","1");var w=localStorage.getItem("wallpaper");if(w)d.dataset.wallpaper=w;var g=localStorage.getItem("glass");if(g&&+g>=0&&+g<=1)d.style.setProperty("--glass",g)}catch(e){}`;

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
