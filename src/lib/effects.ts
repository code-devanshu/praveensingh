import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

// GSAP scroll and text effects, loaded once the page has gone idle
// (components/effects.tsx). The page is complete without them: it's server
// rendered and everything is visible, and an effect only sets up on things
// still below the fold, so nothing on screen blinks out when this arrives.
// Reduced motion turns them all off. GSAP never animates an element `motion`
// animates (windows, the Dock): only things inside the windows.
//
// Markup opts in with data attributes:
//   data-count[=from]      a number counts up (from 0, or data-count-from)
//   data-message           a Messages bubble types in after a "…" bubble
//   data-timeline-line/dot the Experience line draws as you scroll
//   data-tick              a Reminders checkbox ticks itself
//   data-split             a heading rises in word by word
//   data-scramble          text decodes ("intro": once per tab, at load)
//   data-parallax[-root]   the hero phones drift and tilt with the scroll

type Undo = (() => void)[];

/** Still below the fold, so it can be set up without anyone seeing. */
const unseen = (el: Element) => el.getBoundingClientRect().top > window.innerHeight;

/** "−38%" → { prefix: "−", value: 38, suffix: "%", decimals: 0 } */
function parseNumber(text: string) {
  const match = text.match(/^(\D*?)(\d+(?:\.\d+)?)([\s\S]*)$/);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  return { prefix, value: parseFloat(digits), suffix, decimals: digits.split(".")[1]?.length ?? 0 };
}

function countUps(undo: Undo) {
  for (const el of gsap.utils.toArray<HTMLElement>("[data-count]")) {
    const text = el.textContent ?? "";
    const to = parseNumber(text);
    if (!to || !unseen(el)) continue;
    const n = { value: parseNumber(el.dataset.countFrom ?? "")?.value ?? 0 };
    const render = () => {
      el.textContent = `${to.prefix}${n.value.toFixed(to.decimals)}${to.suffix}`;
    };
    render();
    undo.push(() => {
      el.textContent = text;
    });
    gsap.to(n, {
      value: to.value,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: render,
      onComplete: () => {
        el.textContent = text;
      },
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  }
}

function messages(undo: Undo) {
  // Like a real thread, one message at a time: each waits for the one before.
  let free = 0;
  for (const message of gsap.utils.toArray<HTMLElement>("[data-message]")) {
    const bubble = message.querySelector("blockquote");
    if (!bubble || !unseen(message)) continue;
    const meta = message.querySelectorAll("figcaption, [data-message-meta]");
    const typing = document.createElement("span");
    typing.className = "typing-bubble";
    typing.setAttribute("aria-hidden", "true");
    typing.append(...Array.from({ length: 3 }, () => document.createElement("span")));
    bubble.before(typing);
    undo.push(() => typing.remove());

    gsap.set([bubble, ...meta], { autoAlpha: 0 });
    gsap.set(typing, { autoAlpha: 0, scale: 0.5, transformOrigin: "0% 100%" });
    const typeIn = gsap
      .timeline({ paused: true })
      // Sits where the message will end, on the same baseline.
      .call(() => {
        typing.style.top = `${bubble.offsetTop + bubble.offsetHeight - typing.offsetHeight}px`;
      })
      .to(typing, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "back.out(2)" })
      .to(typing.children, { y: -3, duration: 0.2, ease: "sine.inOut", stagger: 0.1, repeat: 2, yoyo: true })
      .to(typing, { autoAlpha: 0, scale: 0.5, duration: 0.15 })
      .fromTo(
        bubble,
        { scale: 0.85, transformOrigin: "0% 100%" },
        { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" },
        "<",
      )
      .to(meta, { autoAlpha: 1, duration: 0.3 }, "<");
    ScrollTrigger.create({
      trigger: message,
      start: "top 85%",
      once: true,
      onEnter: () => {
        const now = gsap.ticker.time;
        const wait = Math.max(0, free - now);
        free = now + wait + typeIn.duration();
        gsap.delayedCall(wait, () => typeIn.play());
      },
    });
  }
}

function timeline(undo: Undo) {
  const line = document.querySelector<HTMLElement>("[data-timeline-line]");
  if (!line) return;
  gsap.fromTo(
    line,
    { scaleY: 0 },
    { scaleY: 1, ease: "none", scrollTrigger: { trigger: line, start: "top 75%", end: "bottom 75%", scrub: 0.4 } },
  );
  // Each job's dot lights up as the line reaches it.
  for (const dot of gsap.utils.toArray<HTMLElement>("[data-timeline-dot]")) {
    ScrollTrigger.create({
      trigger: dot,
      start: "top 75%",
      onEnter: () => dot.classList.add("is-lit"),
      onLeaveBack: () => dot.classList.remove("is-lit"),
    });
    undo.push(() => dot.classList.remove("is-lit"));
  }
}

function ticks() {
  for (const tick of gsap.utils.toArray<HTMLElement>("[data-tick]")) {
    if (!unseen(tick)) continue;
    gsap.from(tick.querySelector("svg"), {
      scale: 0,
      rotation: -45,
      duration: 0.55,
      ease: "back.out(2.6)",
      scrollTrigger: { trigger: tick, start: "top 85%", once: true },
    });
  }
}

function headings() {
  for (const heading of gsap.utils.toArray<HTMLElement>("[data-split]")) {
    if (!unseen(heading)) continue;
    // Words, each in its own mask: lines still wrap naturally on resize.
    const split = SplitText.create(heading, { type: "words", mask: "words" });
    gsap.from(split.words, {
      yPercent: 110,
      duration: 0.9,
      ease: "expo.out",
      stagger: 0.05,
      scrollTrigger: { trigger: heading, start: "top 88%", once: true },
      onComplete: () => split.revert(),
    });
  }
}

function scramble() {
  const intro = document.querySelector<HTMLElement>('[data-scramble="intro"]');
  let fresh = false;
  try {
    fresh = !sessionStorage.getItem("intro");
    sessionStorage.setItem("intro", "1");
  } catch {}
  if (intro && fresh) {
    // Scrambled letters are wider or narrower than the real ones; holding the
    // height keeps an extra wrapped line from shifting the page (CLS).
    gsap.set(intro, { height: intro.offsetHeight, overflow: "hidden" });
    gsap.to(intro, {
      duration: 1.4,
      scrambleText: { text: intro.textContent ?? "", chars: "upperCase", speed: 0.5, revealDelay: 0.2 },
      onComplete: () => gsap.set(intro, { clearProps: "height,overflow" }),
    });
  }

  for (const el of gsap.utils.toArray<HTMLElement>('[data-scramble="view"]')) {
    if (!unseen(el)) continue;
    gsap.to(el, {
      duration: 1.1,
      scrambleText: { text: el.textContent ?? "", chars: "!<>-_\\/[]{}=+*^?#", speed: 0.6 },
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
  }
}

function parallax() {
  const root = document.querySelector("[data-parallax-root]");
  if (!root) return;
  // The back phone drifts down and the front one up, each tilting a little.
  for (const [selector, y, rotation] of [
    ['[data-parallax="back"]', 80, -4],
    ['[data-parallax="front"]', -40, 3],
  ] as const) {
    gsap.to(selector, {
      y,
      rotation,
      ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 },
    });
  }
}

/** Starts every effect on the current page; returns a function that undoes them. */
export function startEffects() {
  const undo: Undo = [];
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    countUps(undo);
    messages(undo);
    timeline(undo);
    ticks();
    headings();
    scramble();
    parallax();
    return () => undo.splice(0).forEach((fn) => fn());
  });

  // Windows close, minimise and filter, moving everything below them; the
  // scroll positions effects start at are measured again once that settles.
  let refresh: gsap.core.Tween | undefined;
  const resize = new ResizeObserver(() => {
    refresh?.kill();
    refresh = gsap.delayedCall(0.2, () => ScrollTrigger.refresh());
  });
  const main = document.querySelector("main");
  if (main) resize.observe(main);

  return () => {
    resize.disconnect();
    refresh?.kill();
    mm.revert();
  };
}
