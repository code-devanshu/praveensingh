"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { hero } from "@/content";
import { bootDelay } from "@/lib/desktop";
import { LiveIsland } from "./live-island";
import { Phone } from "./phone";
import { Window } from "./window";

const ease = [0.16, 1, 0.3, 1] as const;

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

  // Wait for the boot screen on a first visit so the entrance is seen.
  const boot = bootDelay();

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay: boot + delay, ease },
        };

  return (
    <Window id="top" title="Welcome">
      <div
        ref={ref}
        className="grid grid-cols-1 items-center gap-10 px-6 pt-10 md:px-12 md:pt-14 lg:grid-cols-12"
      >
        <div className="lg:col-span-7">
          <motion.h1
            {...enter(0)}
            className="max-w-[20ch] text-[2.75rem] font-semibold leading-[1.05] tracking-tighter md:text-6xl lg:text-7xl"
          >
            {hero.headline}
          </motion.h1>
          <motion.p
            {...enter(0.1)}
            className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted md:text-xl"
          >
            {hero.subtext}
          </motion.p>
          <motion.div {...enter(0.2)} className="mt-10 flex flex-wrap gap-3">
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
          </motion.div>
        </div>

        <div className="relative mx-auto -mb-24 h-[400px] w-full max-w-[400px] md:h-[520px] lg:col-span-5 lg:h-[560px]">
          <motion.div style={{ y: backY }} className="absolute right-0 top-0 w-[52%]">
            <motion.div
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0, y: 60 },
                    animate: { opacity: 1, y: 0 },
                    transition: { type: "spring", stiffness: 80, damping: 20, delay: boot + 0.25 },
                  })}
            >
              <Phone
                src={hero.screens.back}
                alt="Placeholder screenshot of an app screen"
                sizes="(min-width: 1024px) 220px, 50vw"
                className="rotate-6"
              />
            </motion.div>
          </motion.div>
          <motion.div style={{ y: frontY }} className="absolute bottom-0 left-0 w-[58%]">
            <motion.div
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0, y: 80 },
                    animate: { opacity: 1, y: 0 },
                    transition: { type: "spring", stiffness: 80, damping: 20, delay: boot + 0.1 },
                  })}
            >
              <Phone
                src={hero.screens.front}
                alt="Placeholder screenshot of an app home screen"
                sizes="(min-width: 1024px) 250px, 55vw"
                preload
                island={<LiveIsland />}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Window>
  );
}
