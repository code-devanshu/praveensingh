// Runs `run` once the page has loaded and the browser has gone idle, so it
// never competes with the first paint. Returns a function that cancels it.
export function afterIdle(run: () => void) {
  let cancel: (() => void) | undefined;
  const idle = () => {
    if ("requestIdleCallback" in window) {
      const handle = requestIdleCallback(run, { timeout: 2000 });
      cancel = () => cancelIdleCallback(handle);
    } else {
      const handle = setTimeout(run, 200);
      cancel = () => clearTimeout(handle);
    }
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
  return () => {
    window.removeEventListener("load", idle);
    cancel?.();
  };
}
