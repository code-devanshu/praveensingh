"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { hero, site } from "@/content";
import { LiveIsland } from "./live-island";
import { Phone } from "./phone";
import { Window } from "./window";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // The back phone drifts slower than the front one, giving the pair depth.
  const backY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);
  const frontY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);

  // The entrance is CSS (.rise in globals.css), so it starts at first paint
  // instead of after hydration. It slides without fading: the headline and
  // subtext are the page's largest paint, and browsers don't count text
  // until it's visible.
  const enter = (delay: number, rise?: number) =>
    ({ "--delay": `${delay}s`, ...(rise ? { "--rise": `${rise}px` } : {}) }) as React.CSSProperties;

  return (
    <Window id="top" title="Welcome" priority>
      <div
        ref={ref}
        className="grid grid-cols-1 items-center gap-10 px-6 pt-10 md:px-12 md:pt-14 lg:grid-cols-12"
      >
        {/* Bottom padding keeps the buttons clear of the window edge when the
            text is taller than the phones. */}
        <div className="lg:col-span-7 lg:py-14">
          <h1 className="rise" style={enter(0)}>
            {/* Who and what first, for search; the headline stays the visual lead. */}
            <span className="mb-4 block text-sm font-medium uppercase tracking-[0.18em] text-accent md:text-base">
              {site.name} · {site.role}
            </span>
            <span className="block max-w-[20ch] text-[2.75rem] font-semibold leading-[1.05] tracking-tighter md:text-6xl lg:text-7xl">
              {hero.headline}
            </span>
          </h1>
          <p
            style={enter(0.1)}
            className="rise mt-6 max-w-[46ch] text-lg leading-relaxed text-muted md:text-xl"
          >
            {hero.subtext}
          </p>
          <div style={enter(0.2)} className="rise mt-10 flex flex-wrap gap-3">
            <a
              href="#work"
              className="whitespace-nowrap rounded-full bg-accent-fill px-6 py-3 text-[15px] font-medium text-white transition-transform active:scale-[0.98]"
            >
              View work
            </a>
            <a
              href="#contact"
              className="whitespace-nowrap rounded-full border border-hairline px-6 py-3 text-[15px] font-medium text-accent transition-colors hover:bg-accent-soft active:scale-[0.98]"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div className="relative mx-auto -mb-24 h-[400px] w-full max-w-[400px] md:h-[520px] lg:col-span-5 lg:h-[560px] lg:self-end">
          <motion.div style={{ y: backY }} className="absolute right-0 top-0 w-[52%]">
            <div className="rise-fade rise-spring" style={enter(0.25, 60)}>
              {/* One iPhone, one Android: the same React Native work on both. */}
              <Phone
                device="android"
                src={hero.screens.back.src}
                alt={hero.screens.back.alt}
                sizes="(min-width: 1024px) 220px, 50vw"
                className="rotate-6"
              />
            </div>
          </motion.div>
          <motion.div style={{ y: frontY }} className="absolute bottom-0 left-0 w-[58%]">
            <div className="rise rise-spring" style={enter(0.1, 80)}>
              <Phone
                src={hero.screens.front.src}
                alt={hero.screens.front.alt}
                sizes="(min-width: 1024px) 250px, 55vw"
                preload
                island={<LiveIsland />}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </Window>
  );
}
