"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AppleLogo,
  AppWindow,
  ArrowClockwise,
  Atom,
  Cursor,
  Gauge,
  UserPlus,
  Copy,
  DeviceMobile,
  ChatCircleText,
  DownloadSimple,
  EnvelopeSimple,
  FilePdf,
  GithubLogo,
  GooglePlayLogo,
  House,
  IdentificationBadge,
  Image as ImageIcon,
  LinkedinLogo,
  ListChecks,
  MagnifyingGlass,
  Notebook,
  Question,
  TerminalWindow,
  Wrench,
  type Icon,
} from "@phosphor-icons/react";
import { projects, site } from "@/content";
import { openWindow, setWallpaper, wallpapers } from "@/lib/desktop";
import { getDev, openDevMenu, reload, setDev } from "@/lib/dev";

type Item = { group: string; label: string; hint?: string; keywords?: string; Icon: Icon } & (
  | { run: () => void; href?: never }
  /** A page on this site, opened with client-side navigation. */
  | { href: string; run?: never }
);

const external = (url: string) => () => window.open(url, "_blank", "noopener");

const items: Item[] = [
  { group: "Windows", label: "Welcome", Icon: House, keywords: "home top intro", run: () => openWindow("top") },
  { group: "Windows", label: "Selected Work", Icon: AppWindow, keywords: "projects apps portfolio finder", run: () => openWindow("work") },
  { group: "Windows", label: "Experience", Icon: FilePdf, keywords: "resume cv jobs career upgrad gojoko delightree invia webmobril", run: () => openWindow("experience") },
  { group: "Windows", label: "Tools", Icon: Wrench, keywords: "stack skills launchpad", run: () => openWindow("tools") },
  { group: "Windows", label: "Terminal", Icon: TerminalWindow, keywords: "shell zsh cli", run: () => openWindow("terminal") },
  { group: "Windows", label: "Process", Icon: ListChecks, keywords: "reminders how i work", run: () => openWindow("process") },
  { group: "Windows", label: "About This Developer", Icon: IdentificationBadge, keywords: "about bio", run: () => openWindow("about") },
  { group: "Windows", label: "Recommendations", Icon: ChatCircleText, keywords: "testimonials references messages linkedin", run: () => openWindow("recommendations") },
  { group: "Windows", label: "Help", Icon: Question, keywords: "faq questions answers hire available", run: () => openWindow("faq") },
  { group: "Windows", label: "Notes", Icon: Notebook, keywords: "blog posts articles writing", run: () => openWindow("blog") },
  { group: "Windows", label: "New Message", Icon: EnvelopeSimple, keywords: "contact mail email hire", run: () => openWindow("contact") },
  ...projects.map((p) => ({
    group: "Apps",
    label: p.name,
    hint: p.retired ? `${p.company} · retired` : p.company,
    keywords: `${p.domain} ${p.summary} ${p.stack.join(" ")}`,
    Icon: DeviceMobile,
    run: () => openWindow("work"),
  })),
  ...projects.map((p) => ({
    group: "Case studies",
    label: `${p.name} case study`,
    hint: p.company,
    keywords: `${p.domain} ${p.stack.join(" ")} read more details`,
    Icon: Notebook,
    href: `/work/${p.slug}`,
  })),
  ...projects.flatMap((p) =>
    (p.apps ?? []).flatMap((app) => [
      ...(app.ios
        ? [{ group: "App Store and Google Play", label: `${app.name} on the App Store`, keywords: `ios iphone store ${p.company}`, Icon: AppleLogo, run: external(app.ios) }]
        : []),
      ...(app.android
        ? [{ group: "App Store and Google Play", label: `${app.name} on Google Play`, keywords: `android play store ${p.company}`, Icon: GooglePlayLogo, run: external(app.android) }]
        : []),
    ]),
  ),
  { group: "Actions", label: "Download résumé", hint: "PDF", keywords: "resume cv", Icon: DownloadSimple, run: () => window.open(site.resume, "_blank", "noopener") },
  { group: "Actions", label: "Add to Contacts", hint: "vCard", keywords: "vcard save phone number", Icon: UserPlus, run: () => {
      window.location.href = site.vcard;
    } },
  { group: "Actions", label: "Copy email address", hint: site.email, Icon: Copy, run: () => navigator.clipboard?.writeText(site.email) },
  { group: "Actions", label: "Open GitHub", Icon: GithubLogo, run: external(site.github) },
  { group: "Actions", label: "Open LinkedIn", Icon: LinkedinLogo, run: external(site.linkedin) },
  ...wallpapers.map((w) => ({
    group: "Actions",
    label: `Wallpaper: ${w.label}`,
    keywords: "background desktop theme",
    Icon: ImageIcon,
    run: () => setWallpaper(w.id),
  })),
  { group: "Developer", label: "React Native Dev Menu", keywords: "debug developer tools metro", Icon: Atom, run: openDevMenu },
  { group: "Developer", label: "Perf Monitor", hint: "Toggle", keywords: "fps performance frame rate react native", Icon: Gauge, run: () => setDev({ perf: !getDev().perf }) },
  { group: "Developer", label: "Element Inspector", hint: "Toggle", keywords: "inspect layout box model react native", Icon: Cursor, run: () => setDev({ inspector: !getDev().inspector }) },
  { group: "Developer", label: "Reload", hint: "Metro", keywords: "refresh bundle react native", Icon: ArrowClockwise, run: reload },
];

// ⌘K / Ctrl+K (or the magnifier in the menu bar) opens a Spotlight-style
// launcher for jumping between windows, projects and actions.
type SpotlightProps = {
  /** Blog posts, newest first, so they can be searched by title and tag. */
  posts?: { slug: string; title: string; tags: string[] }[];
};

export function Spotlight({ posts = [] }: SpotlightProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const reduce = useReducedMotion();
  const returnFocus = useRef<HTMLElement | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const all: Item[] = [
      ...items,
      ...posts.map((p) => ({
        group: "Blog",
        label: p.title,
        keywords: `blog post article ${p.tags.join(" ")}`,
        Icon: Notebook,
        href: `/blog/${p.slug}`,
      })),
    ];
    const q = query.trim().toLowerCase();
    if (!q) return all.filter((i) => i.group === "Windows");
    return all.filter((i) => `${i.label} ${i.hint ?? ""} ${i.keywords ?? ""}`.toLowerCase().includes(q));
  }, [query, posts]);

  function show() {
    returnFocus.current = document.activeElement as HTMLElement;
    setQuery("");
    setSelected(0);
    setOpen(true);
  }

  function hide() {
    setOpen(false);
    returnFocus.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) hide();
        else show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mac:spotlight", show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mac:spotlight", show);
    };
  });

  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  function choose(item: Item | undefined) {
    if (!item) return;
    setOpen(false);
    if (item.run) item.run();
    else router.push(item.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setSelected((s) => (s + step + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[selected]);
    } else if (e.key === "Escape") {
      hide();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="spotlight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) hide();
          }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/10 px-3 pt-[14vh] dark:bg-black/30"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Spotlight search"
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="glass w-full max-w-[640px] overflow-hidden rounded-[22px] bg-surface/80"
          >
            <div className="flex items-center gap-3 px-5">
              <MagnifyingGlass size={24} className="shrink-0 text-muted" aria-hidden />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Spotlight Search"
                aria-label="Search windows, apps and actions"
                role="combobox"
                aria-expanded="true"
                aria-controls="spotlight-results"
                aria-activedescendant={results[selected] ? `spotlight-${selected}` : undefined}
                className="h-16 min-w-0 flex-1 bg-transparent text-xl outline-none placeholder:text-muted md:text-2xl"
              />
              <kbd className="hidden rounded-md border border-hairline px-1.5 py-0.5 font-sans text-xs text-muted sm:block">esc</kbd>
            </div>

            <ul
              ref={list}
              id="spotlight-results"
              role="listbox"
              aria-label="Results"
              className="max-h-[50vh] overflow-y-auto border-t border-hairline p-2"
            >
              {results.length === 0 && <li className="px-3 py-6 text-center text-muted">No results for “{query}”</li>}
              {results.map((item, i) => {
                const heading = i === 0 || results[i - 1].group !== item.group ? item.group : null;
                return (
                  <li key={`${item.group}-${item.label}`} role="presentation">
                    {heading && (
                      <p role="presentation" className="px-3 pb-1 pt-2 text-[11px] font-semibold text-muted">
                        {heading}
                      </p>
                    )}
                    <div
                      id={`spotlight-${i}`}
                      role="option"
                      aria-selected={i === selected}
                      onMouseMove={() => setSelected(i)}
                      onClick={() => choose(item)}
                      className="flex cursor-default items-center gap-3 rounded-xl px-3 py-2 text-[15px] aria-selected:bg-accent-fill aria-selected:text-white"
                    >
                      <item.Icon size={20} weight="duotone" aria-hidden className="shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.hint && <span className="ml-auto truncate pl-3 text-xs opacity-70">{item.hint}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="border-t border-hairline px-5 py-2.5 text-xs text-muted">
              Tip: right-click the desktop, or press ⌘K anywhere.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
