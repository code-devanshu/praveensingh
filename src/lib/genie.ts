import { gsap } from "gsap";

const smooth = (t: number) => t * t * (3 - 2 * t);

// The macOS genie: a window pours into its Dock icon. First the window's
// lower edge pinches toward the icon, then the whole thing slides down into
// it, behind the Dock. Only the part of the window on screen takes part.
//
// The funnel is a clip-path drawn row by row, and the slide is the CSS
// `translate` property: `motion` owns the window's transform and opacity, so
// the two never write the same property. Resolves once the window is gone;
// the window clears both styles when it's restored.
export function genie(el: HTMLElement, id: string) {
  const dock = document.querySelector('nav[aria-label="Dock"]');
  let target = dock?.querySelector(`a[href="#${id}"]`)?.getBoundingClientRect();
  // No icon of its own, or hidden on phones: the middle of the Dock.
  if (!target?.width) target = dock?.querySelector("ul")?.getBoundingClientRect();
  if (!target?.width) return Promise.resolve();

  const box = el.getBoundingClientRect();
  const centre = target.left + target.width / 2;
  const half = Math.min(target.width, 56) / 2;
  const iconY = target.top + target.height / 2;
  const top = Math.max(box.top, 0);
  const bottom = Math.max(Math.min(box.bottom, window.innerHeight), iconY);
  const rows = 24;
  const at = { pinch: 0, suck: 0 };

  const draw = () => {
    const shift = (iconY - top) * at.suck;
    const rowTop = top + shift;
    const rowBottom = bottom + (iconY - bottom) * at.pinch;
    const left: string[] = [];
    const right: string[] = [];
    for (let i = 0; i <= rows; i++) {
      const t = i / rows;
      // 0 is the window's full width, 1 the icon's: lower rows pinch first,
      // then every row narrows as the window slides in.
      const narrow = at.pinch * smooth(t) * (1 - at.suck) + at.suck;
      const y = rowTop + (rowBottom - rowTop) * t - box.top - shift;
      left.push(`${(centre - half - box.left) * narrow}px ${y}px`);
      right.unshift(`${box.width + (centre + half - box.right) * narrow}px ${y}px`);
    }
    el.style.clipPath = `polygon(${[...left, ...right].join(",")})`;
    el.style.translate = `0 ${shift}px`;
  };

  return new Promise<void>((resolve) => {
    gsap
      .timeline({ onUpdate: draw, onComplete: resolve })
      .to(at, { pinch: 1, duration: 0.3, ease: "power1.inOut" })
      .to(at, { suck: 1, duration: 0.45, ease: "power2.in" }, 0.15);
  });
}
