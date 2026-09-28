"use client";

import { useSyncExternalStore } from "react";
import { Atom, BatteryHigh, Command, MagnifyingGlass, WifiHigh } from "@phosphor-icons/react";
import { site } from "@/content";
import { openMenu, openSpotlight } from "@/lib/desktop";
import { openDevMenu } from "@/lib/dev";

const links = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#tools", label: "Tools" },
  { href: "#terminal", label: "Terminal" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const dateFormat = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

// The clock ticks on the client only; the server renders it empty so
// hydration never disagrees about the time.
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}

function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => {
      const now = new Date();
      return `${dateFormat.format(now).replace(",", "")}|${timeFormat.format(now)}`;
    },
    () => "",
  );
}

export function MenuBar() {
  const [date, time] = useNow().split("|");

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-8 items-center justify-between gap-4 bg-white/40 px-4 text-[13px] backdrop-blur-xl backdrop-saturate-150 dark:bg-black/35">
      <nav aria-label="Sections" className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Desktop menu"
          aria-haspopup="menu"
          onClick={(e) => {
            const box = e.currentTarget.getBoundingClientRect();
            openMenu(box.left, box.bottom + 4);
          }}
          className="-ml-1.5 flex h-6 w-7 items-center justify-center rounded-md transition-colors hover:bg-black/10 dark:hover:bg-white/15"
        >
          <Command size={15} weight="bold" aria-hidden />
        </button>
        <a href="#top" className="whitespace-nowrap font-semibold">
          {site.name}
        </a>
        <ul className="ml-2 hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="rounded px-1 py-0.5 transition-colors hover:bg-black/10 dark:hover:bg-white/15">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex items-center gap-3.5 whitespace-nowrap">
        <button
          type="button"
          aria-label="React Native Dev Menu"
          aria-haspopup="dialog"
          onClick={openDevMenu}
          className="-mx-1.5 flex h-6 w-7 items-center justify-center rounded-md transition-colors hover:bg-black/10 dark:hover:bg-white/15"
        >
          <Atom size={16} weight="bold" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Spotlight search"
          aria-keyshortcuts="Meta+K Control+K"
          onClick={openSpotlight}
          className="-mx-1.5 flex h-6 w-7 items-center justify-center rounded-md transition-colors hover:bg-black/10 dark:hover:bg-white/15"
        >
          <MagnifyingGlass size={15} weight="bold" aria-hidden />
        </button>
        <WifiHigh size={16} weight="bold" aria-hidden />
        <BatteryHigh size={20} aria-hidden />
        <time className="tabular-nums">
          {date && <span className="mr-2 hidden sm:inline">{date}</span>}
          {time}
        </time>
      </div>
    </header>
  );
}
