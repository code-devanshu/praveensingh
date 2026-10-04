"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { about, experience, projects, site, stack } from "@/content";
import { openWindow, setWallpaper, wallpapers, type WallpaperId } from "@/lib/desktop";
import { getDev, openDevMenu, reload, setDev } from "@/lib/dev";
import { Window } from "./window";

type Line = { kind: "in" | "out" | "err" | "ok"; text: string };

const user = "guest@praveen";
const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const commands: Record<string, string> = {
  help: "list commands",
  whoami: "who is Praveen",
  projects: "list shipped apps",
  "open <app>": "details and numbers for one app",
  experience: "where I've worked",
  resume: "download my résumé",
  stack: "tools I use",
  contact: "open a new message",
  wallpaper: "change the desktop",
  metro: "React Native dev tools",
  hire: "you know you want to",
  clear: "clear the screen",
};

// What Metro prints when it starts, keys included.
const metro: Line[] = [
  { kind: "ok", text: "Welcome to Metro. Fast, scalable, integrated." },
  { kind: "out", text: "  r  reload the app\n  d  open Dev Menu\n  p  toggle Perf Monitor\n  i  toggle Element Inspector" },
];

function run(input: string): Line[] | "clear" {
  const [cmd = "", ...args] = input.trim().split(/\s+/);
  const arg = args.join(" ").toLowerCase();

  switch (cmd.toLowerCase()) {
    case "":
      return [];
    case "help":
      return Object.entries(commands).map(([name, desc]) => ({ kind: "out", text: `  ${name.padEnd(12)} ${desc}` }));
    case "whoami":
      return [
        { kind: "out", text: `${site.name}, ${site.role.toLowerCase()}.` },
        { kind: "out", text: about.facts.map((f) => `${f.label}: ${f.value}`).join("\n") },
      ];
    case "ls":
    case "projects":
      return projects.map((p) => ({ kind: "out", text: `  ${slug(p.name).padEnd(22)} ${p.domain}, ${p.year}${p.retired ? " (retired)" : ""}` }));
    case "open":
    case "cat": {
      const project = projects.find((p) => slug(p.name) === slug(arg) || slug(p.company) === slug(arg));
      if (!project) return [{ kind: "err", text: `${cmd}: no such app: ${arg || "(none)"}. Try "projects".` }];
      return [
        { kind: "ok", text: `${project.name} at ${project.company} (${project.platforms}, ${project.year})` },
        { kind: "out", text: project.summary },
        ...(project.capabilities ?? []).map((c) => ({ kind: "out" as const, text: `  ${c.title.padEnd(9)} ${c.body}` })),
        ...((project.retired ?? project.note) ? [{ kind: "out" as const, text: (project.retired ?? project.note) as string }] : []),
        ...(project.metrics ?? []).map((m) => ({ kind: "ok" as const, text: `  ${m.label}: ${m.before} → ${m.after} (${m.change})` })),
        { kind: "out", text: `Built with ${project.stack.join(", ")}` },
        ...(project.apps ?? []).flatMap((app) => [
          { kind: "ok" as const, text: `${app.name}${app.rating ? ` (★ ${app.rating.value}, ${app.rating.count} ratings)` : ""}` },
          ...(app.ios ? [{ kind: "out" as const, text: `  App Store    ${app.ios}` }] : []),
          ...(app.android ? [{ kind: "out" as const, text: `  Google Play  ${app.android}` }] : []),
        ]),
      ];
    }
    case "experience":
    case "cv":
      return experience.map((j) => ({ kind: "out", text: `  ${`${j.start} to ${j.end}`.padEnd(22)} ${j.title}, ${j.company}` }));
    case "resume": {
      setTimeout(() => window.open(site.resume, "_blank", "noopener"), 400);
      return [{ kind: "ok", text: "Opening Praveen_Singh_Senior_React_Native_Developer.pdf…" }];
    }
    case "stack":
      return [{ kind: "out", text: stack.map((s) => s.label).join(" · ") }];
    case "contact":
    case "mail":
      setTimeout(() => openWindow("contact"), 400);
      return [{ kind: "ok", text: `Opening a new message to ${site.email}…` }];
    case "wallpaper": {
      const next = wallpapers.find((w) => w.id === arg);
      if (!next) return [{ kind: "out", text: `usage: wallpaper ${wallpapers.map((w) => w.id).join(" | ")}` }];
      setWallpaper(next.id as WallpaperId);
      return [{ kind: "ok", text: `Wallpaper set to ${next.label}.` }];
    }
    case "hire":
    case "sudo":
      if (cmd === "sudo" && arg !== "hire praveen" && arg !== "hire") return [{ kind: "err", text: "Nice try. Try \"sudo hire praveen\"." }];
      setTimeout(() => openWindow("contact"), 900);
      return [
        { kind: "ok", text: "Password accepted. Great decision." },
        { kind: "out", text: "Praveen can join immediately. Drafting an email so you can say hello…" },
      ];
    case "metro":
      return metro;
    case "npm":
    case "npx":
    case "yarn":
      return arg.includes("start") ? metro : [{ kind: "err", text: `${cmd}: only "start" works here.` }];
    case "r":
      setTimeout(reload, 300);
      return [{ kind: "ok", text: "Reloading…" }];
    case "d":
      setTimeout(openDevMenu, 200);
      return [{ kind: "ok", text: "Opening Dev Menu…" }];
    case "p":
    case "perf": {
      const on = !getDev().perf;
      setDev({ perf: on });
      return [{ kind: "ok", text: `Perf Monitor ${on ? "on. Tap it for a graph." : "off."}` }];
    }
    case "i":
    case "inspect": {
      const on = !getDev().inspector;
      setDev({ inspector: on });
      return [{ kind: "ok", text: `Element Inspector ${on ? "on. Esc to exit." : "off."}` }];
    }
    case "crash":
    case "throw":
      setTimeout(() => setDev({ redbox: true }), 400);
      return [{ kind: "err", text: "Error: Praveen is still available." }];
    case "rm":
      setTimeout(() => setDev({ redbox: true }), 700);
      return [{ kind: "err", text: `rm: ${args.at(-1) ?? "/"}: Operation not permitted. Well, you asked for it…` }];
    case "date":
      return [{ kind: "out", text: new Date().toString() }];
    case "pwd":
      return [{ kind: "out", text: "/Users/praveen/portfolio" }];
    case "echo":
      return [{ kind: "out", text: args.join(" ") }];
    case "clear":
      return "clear";
    case "exit":
      return [{ kind: "out", text: "There is no escape. Close the window with the red button instead." }];
    default:
      return [{ kind: "err", text: `zsh: command not found: ${cmd}. Type "help".` }];
  }
}

const completions = ["help", "whoami", "projects", "experience", "resume", "stack", "contact", "wallpaper", "metro", "clear", "sudo hire praveen", ...projects.map((p) => `open ${slug(p.name)}`)];

export function Terminal({ className }: { className?: string }) {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: `Last login: on this website. Type "help" to look around.` },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [typing, setTyping] = useState(false);
  const screen = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const inView = useInView(screen, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  function submit(text: string) {
    const out = run(text);
    if (out === "clear") setLines([]);
    else setLines((prev) => [...prev, { kind: "in", text }, ...out]);
    if (text.trim()) setHistory((prev) => [...prev, text]);
    setCursor(-1);
    setValue("");
  }

  // Types "whoami" by itself the first time the window scrolls into view.
  useEffect(() => {
    if (!inView) return;
    const demo = "whoami";
    let i = reduce ? demo.length - 1 : 0;
    const id = setInterval(() => {
      i += 1;
      setTyping(true);
      setValue(demo.slice(0, i));
      if (i === demo.length) {
        clearInterval(id);
        setTimeout(() => {
          submit(demo);
          setTyping(false);
        }, reduce ? 0 : 350);
      }
    }, reduce ? 0 : 110);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight });
  }, [lines]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      if (!history.length) return;
      const next = e.key === "ArrowUp" ? (cursor < 0 ? history.length - 1 : Math.max(0, cursor - 1)) : cursor + 1;
      if (next >= history.length || next < 0) {
        setCursor(-1);
        setValue("");
      } else {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (e.key === "Tab") {
      const match = value && completions.find((c) => c.startsWith(value.toLowerCase()) && c !== value);
      if (match) {
        e.preventDefault();
        setValue(match);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  const colour = { in: "text-white", out: "text-white/75", err: "text-[#ff6b6b]", ok: "text-[#5af78e]" };

  return (
    <Window
      id="terminal"
      title="praveen · zsh"
      className={className}
      chromeClassName="bg-[#1b1b1f]/95! text-white [--hairline:rgb(255_255_255/0.1)] [--muted:rgb(255_255_255/0.55)]"
    >
      <div
        ref={screen}
        onClick={() => {
          if (!window.getSelection()?.toString()) input.current?.focus({ preventScroll: true });
        }}
        className="h-80 overflow-y-auto px-5 py-4 font-mono text-[13px] leading-relaxed md:h-96 md:px-6"
      >
        <h2 className="sr-only">Terminal</h2>
        {lines.map((line, i) => (
          <p key={i} className={`whitespace-pre-wrap break-words ${colour[line.kind]}`}>
            {line.kind === "in" && <Prompt />}
            {/* Its own element, so React sets its text whole; the "Last login"
                line decodes when the window scrolls into view (data-scramble). */}
            <span data-scramble={i === 0 ? "view" : undefined}>{line.text}</span>
          </p>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!typing) submit(value);
          }}
          className="flex"
        >
          <label htmlFor="terminal-input" className="shrink-0">
            <Prompt />
            <span className="sr-only">Command</span>
          </label>
          <input
            id="terminal-input"
            ref={input}
            value={value}
            readOnly={typing}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="send"
            className="min-w-0 flex-1 bg-transparent text-white caret-[#5af78e] outline-none"
          />
        </form>
      </div>
    </Window>
  );
}

function Prompt() {
  return (
    <span aria-hidden>
      <span className="text-[#5af78e]">{user}</span>
      <span className="text-white/50"> ~ % </span>
    </span>
  );
}
