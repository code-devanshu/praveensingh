import { useEffect, useSyncExternalStore, type RefObject } from "react";

// Which window is frontmost: the one you last clicked, or else the last one
// to cross the middle of the screen (the rule the dock uses for its running
// dots). Every other window gets the inactive look: grey traffic lights and
// a softer shadow, as in macOS 27. Client components only.

let frontmost = "top";
const listeners = new Set<() => void>();
let observer: IntersectionObserver | undefined;

export function activate(id: string) {
  if (id === frontmost) return;
  frontmost = id;
  for (const listener of listeners) listener();
}

function observe(el: Element) {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activate(entry.target.id);
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  observer.observe(el);
  return () => observer?.unobserve(el);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Whether the window `id`, whose section is `ref`, is frontmost. */
export function useFrontmost(id: string, ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (ref.current) return observe(ref.current);
  }, [ref]);
  return useSyncExternalStore(
    subscribe,
    () => frontmost === id,
    () => id === "top",
  );
}
