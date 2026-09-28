"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  AppWindow,
  ChatCircleText,
  EnvelopeSimple,
  FilePdf,
  GithubLogo,
  House,
  IdentificationBadge,
  LinkedinLogo,
  ListChecks,
  TerminalWindow,
  Wrench,
  type Icon,
} from "@phosphor-icons/react";
import { site } from "@/content";

type App = {
  href: string;
  label: string;
  Icon: Icon;
  tile: string;
  section?: string;
  external?: boolean;
  /** Only shown from the sm breakpoint up, so the dock fits on phones. */
  wideOnly?: boolean;
};

const apps: App[] = [
  { href: "#top", section: "top", label: "Home", Icon: House, tile: "from-[#f2f2f7] to-[#c7c7cc] text-[#1d1d1f]", wideOnly: true },
  { href: "#work", section: "work", label: "Work", Icon: AppWindow, tile: "from-[#8e8cff] to-[#4b47e6] text-white" },
  { href: "#experience", section: "experience", label: "Résumé", Icon: FilePdf, tile: "from-[#ff6961] to-[#d70015] text-white", wideOnly: true },
  { href: "#tools", section: "tools", label: "Tools", Icon: Wrench, tile: "from-[#98989d] to-[#48484a] text-white" },
  { href: "#terminal", section: "terminal", label: "Terminal", Icon: TerminalWindow, tile: "from-[#3a3a3c] to-[#0d0d0f] text-[#5af78e]" },
  { href: "#process", section: "process", label: "Process", Icon: ListChecks, tile: "from-white to-[#e5e5ea] text-[#ff9500]" },
  { href: "#about", section: "about", label: "About", Icon: IdentificationBadge, tile: "from-[#c89b6d] to-[#8a5a33] text-white" },
  { href: "#recommendations", section: "recommendations", label: "Recommendations", Icon: ChatCircleText, tile: "from-[#6ee27a] to-[#28b33a] text-white", wideOnly: true },
  { href: "#contact", section: "contact", label: "Mail", Icon: EnvelopeSimple, tile: "from-[#5ac8fa] to-[#0a84ff] text-white" },
];

const links: App[] = [
  { href: site.github, label: "GitHub", Icon: GithubLogo, tile: "from-[#3a3a3c] to-[#1c1c1e] text-white", external: true },
  { href: site.linkedin, label: "LinkedIn", Icon: LinkedinLogo, tile: "from-[#1f7fd6] to-[#004182] text-white", external: true },
];

const BASE = 52;

// Tracks which section is on screen so its dock icon gets the running dot.
function useActiveSection() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const app of apps) {
      const el = app.section && document.getElementById(app.section);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return active;
}

type DockIconProps = {
  app: App;
  mouseX: MotionValue<number>;
  running: boolean;
  className?: string;
};

function DockIcon({ app, mouseX, running, className = "" }: DockIconProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [bounce, animate] = useAnimate<HTMLSpanElement>();
  const reduce = useReducedMotion();
  const distance = useTransform(mouseX, (x) => {
    const box = ref.current?.getBoundingClientRect();
    return box ? x - (box.left + box.width / 2) : Infinity;
  });
  const size = useSpring(useTransform(distance, [-150, 0, 150], [BASE, BASE * 1.55, BASE]), {
    mass: 0.1,
    stiffness: 170,
    damping: 14,
  });

  return (
    <li className={`relative flex-col items-center ${className || "flex"}`}>
      <span ref={bounce} className="block">
        <motion.a
          ref={ref}
          href={app.href}
          aria-label={app.label}
          aria-current={running ? "true" : undefined}
          {...(app.external ? { target: "_blank", rel: "noreferrer" } : {})}
          onClick={() => {
            // The little hop an app makes when it launches.
            if (!reduce) animate(bounce.current, { y: [0, -18, 0, -7, 0] }, { duration: 0.7, ease: "easeOut" });
          }}
          style={{ width: size, height: size }}
          // Fixed smaller icons on phones; magnification only runs with a mouse.
          className={`group relative flex items-center justify-center rounded-[22.5%] bg-linear-to-b shadow-[inset_0_1px_0_rgb(255_255_255/0.4),0_4px_10px_rgb(0_0_0/0.2)] max-md:h-11! max-md:w-11! ${app.tile}`}
        >
          <app.Icon weight="fill" aria-hidden className="h-[55%] w-[55%]" />
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-full mb-3 whitespace-nowrap rounded-md bg-surface/90 px-2.5 py-1 text-xs font-medium text-text opacity-0 shadow-lg backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            {app.label}
          </span>
        </motion.a>
      </span>
      <span
        aria-hidden
        className={`absolute -bottom-2 h-1 w-1 rounded-full bg-text/70 transition-opacity ${running ? "opacity-100" : "opacity-0"}`}
      />
    </li>
  );
}

export function Dock() {
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(Infinity);
  const active = useActiveSection();

  return (
    <nav aria-label="Dock" className="fixed inset-x-0 bottom-3 z-40 flex justify-center px-3">
      <ul
        onPointerMove={(e) => {
          if (e.pointerType === "mouse" && !reduce) mouseX.set(e.clientX);
        }}
        onPointerLeave={() => mouseX.set(Infinity)}
        className="glass flex h-[62px] items-end gap-2 rounded-[22px] px-2 pb-2.5 md:h-[70px] md:gap-2.5"
      >
        {apps.map((app) => (
          <DockIcon
            key={app.label}
            app={app}
            mouseX={mouseX}
            running={active === app.section}
            className={app.wideOnly ? "hidden sm:flex" : ""}
          />
        ))}
        <li aria-hidden className="mx-1 hidden h-11 w-px self-center bg-text/20 sm:block md:h-12" />
        {links.map((app) => (
          <DockIcon key={app.label} app={app} mouseX={mouseX} running={false} className="hidden sm:flex" />
        ))}
      </ul>
    </nav>
  );
}
