"use client";

import { useEffect, useRef, useState } from "react";
import { setDev, useDev } from "@/lib/dev";

type Sides = [top: number, right: number, bottom: number, left: number];
type Rect = { x: number; y: number; w: number; h: number };
type Picked = {
  el: Element;
  name: string;
  path: string[];
  props: [string, string][];
  style: [string, string | number][];
  margin: Sides;
  padding: Sides;
  border: Sides;
};

// Web elements under their React Native names.
const names: Record<string, string> = {
  A: "Pressable",
  BUTTON: "Pressable",
  INPUT: "TextInput",
  TEXTAREA: "TextInput",
  IMG: "Image",
  svg: "Svg",
  UL: "FlatList",
  OL: "FlatList",
  MAIN: "ScrollView",
  P: "Text",
  SPAN: "Text",
  H1: "Text",
  H2: "Text",
  H3: "Text",
  DT: "Text",
  DD: "Text",
  BLOCKQUOTE: "Text",
  FIGCAPTION: "Text",
  TIME: "Text",
  KBD: "Text",
  LABEL: "Text",
};

const nameOf = (el: Element) => (el.hasAttribute("data-window") ? "Window" : (names[el.tagName] ?? "View"));

const px = (value: string) => Math.round(parseFloat(value) || 0);

function sides(cs: CSSStyleDeclaration, prop: "margin" | "padding" | "border", suffix = ""): Sides {
  return (["top", "right", "bottom", "left"] as const).map((side) =>
    px(cs.getPropertyValue(`${prop}-${side}${suffix}`)),
  ) as Sides;
}

// "rgb(29, 29, 31)" to "#1d1d1f". Anything fancier is shown as the browser
// reports it.
function hex(colour: string) {
  const m = colour.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
  if (!m) return colour;
  const channels = [m[1], m[2], m[3]].map(Number);
  if (m[4] !== undefined && Number(m[4]) < 1) channels.push(Math.round(Number(m[4]) * 255));
  return `#${channels.map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

const clip = (text: string, max = 18) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

function pick(target: EventTarget | null): Element | null {
  if (!(target instanceof Element) || target.closest("[data-inspector]")) return null;
  const el = target.closest("svg") ?? target;
  return el === document.body || el === document.documentElement ? null : el;
}

function inspect(el: Element): Picked {
  const cs = getComputedStyle(el);
  const name = nameOf(el);

  const path = ["App"];
  for (let node: Element | null = el; node && node !== document.body; node = node.parentElement) {
    path.splice(1, 0, nameOf(node));
  }

  const props: [string, string][] = [];
  if (name === "Window") props.push(["title", el.parentElement?.getAttribute("aria-label") ?? ""]);
  if (name === "Pressable") {
    const label = el.getAttribute("aria-label") ?? el.textContent?.trim() ?? "";
    if (label) props.push(["accessibilityLabel", clip(label)]);
  }
  if (name === "Image") props.push(["alt", clip(el.getAttribute("alt") ?? "")]);

  const style: [string, string | number][] = [];
  if (cs.display.includes("flex")) style.push(["flexDirection", `"${cs.flexDirection}"`]);
  if (["Text", "Pressable", "TextInput"].includes(name)) {
    style.push(["fontSize", px(cs.fontSize)], ["fontWeight", `"${cs.fontWeight}"`], ["color", `"${hex(cs.color)}"`]);
  }
  if (!/^(transparent|rgba\(0, 0, 0, 0\))$/.test(cs.backgroundColor)) {
    style.push(["backgroundColor", `"${hex(cs.backgroundColor)}"`]);
  }
  // Pills come back as an enormous radius; 9999 is what you'd write in RN.
  const radius = Math.min(px(cs.borderTopLeftRadius), 9999);
  if (radius) style.push(["borderRadius", radius]);
  if (Number(cs.opacity) < 1) style.push(["opacity", Number(cs.opacity)]);

  return {
    el,
    name,
    path,
    props,
    style: style.slice(0, 4),
    margin: sides(cs, "margin"),
    padding: sides(cs, "padding"),
    border: sides(cs, "border", "-width"),
  };
}

// React Native's Element Inspector. Hover (or tap) anything to see its box
// model and styles, named as the RN component it would be. While it's on,
// taps inspect instead of acting.
export function Inspector() {
  const { inspector } = useDev();
  return inspector ? <Inspecting /> : null;
}

function Inspecting() {
  const { perf } = useDev();
  const [hovered, setHovered] = useState<Picked | null>(null);
  const [selected, setSelected] = useState<Picked | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const hoveredEl = useRef<Element | null>(null);
  const crumbs = useRef<HTMLOListElement>(null);
  const current = hovered ?? selected;

  useEffect(() => {
    const inPanel = (e: Event) => (e.target as Element).closest?.("[data-inspector]");
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = pick(e.target);
      if (el === hoveredEl.current) return;
      hoveredEl.current = el;
      setHovered(el && inspect(el));
    };
    const onClick = (e: MouseEvent) => {
      if (inPanel(e)) return;
      e.preventDefault();
      e.stopPropagation();
      const el = pick(e.target);
      setSelected(el && inspect(el));
    };
    // Keeps windows from dragging and menus from reacting while inspecting.
    const block = (e: Event) => {
      if (!inPanel(e)) e.stopPropagation();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDev({ inspector: false });
    };
    const onLeave = () => {
      hoveredEl.current = null;
      setHovered(null);
    };

    const root = document.documentElement;
    root.classList.add("inspecting");
    window.addEventListener("pointermove", onMove, true);
    window.addEventListener("pointerdown", block, true);
    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("inspecting");
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("pointerdown", block, true);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKey);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Follows the element through scrolling and animation.
  useEffect(() => {
    if (!current) return;
    let id = 0;
    let last = "";
    const follow = () => {
      const r = current.el.getBoundingClientRect();
      const key = `${r.x}|${r.y}|${r.width}|${r.height}`;
      if (key !== last) {
        last = key;
        setRect({ x: r.x, y: r.y, w: r.width, h: r.height });
      }
      id = requestAnimationFrame(follow);
    };
    id = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(id);
  }, [current]);

  useEffect(() => {
    crumbs.current?.scrollTo({ left: crumbs.current.scrollWidth });
  }, [current]);

  const box = current && rect && measure(current, rect);

  return (
    <>
      {box && current && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[57]">
          <div className="absolute bg-[#f6b26b]/55" style={box.margin} />
          <div className="absolute bg-[#93c47d]/55" style={box.border} />
          <div className="absolute bg-[#6fa8dc]/60" style={box.content} />
          <p
            className="absolute whitespace-nowrap rounded-md bg-[#1b1b1f] px-2 py-1 font-mono text-[11px] text-white shadow-lg"
            style={{ left: Math.max(4, box.margin.left), top: Math.max(36, box.margin.top - 26) }}
          >
            <span className="font-semibold text-[#61dafb]">{current.name}</span>{" "}
            <span className="text-white/70">
              {Math.round(box.border.width)} × {Math.round(box.border.height)}
            </span>
          </p>
        </div>
      )}

      <div
        data-inspector
        role="region"
        aria-label="Element Inspector"
        className="fixed inset-x-0 bottom-0 z-[58] border-t border-white/10 bg-[#1b1b1f]/95 pb-[env(safe-area-inset-bottom)] text-white backdrop-blur-xl"
      >
        <div className="mx-auto max-w-4xl px-4 pt-3 font-mono text-[11px] md:text-xs">
          {current && box ? (
            <>
              <ol
                ref={crumbs}
                aria-label="Component hierarchy"
                className="flex overflow-x-auto whitespace-nowrap text-white/45 [scrollbar-width:none]"
              >
                {current.path.map((part, i) => (
                  <li key={i} className={i === current.path.length - 1 ? "text-[#61dafb]" : ""}>
                    {i > 0 && <span className="px-1.5 text-white/25">›</span>}
                    {part}
                  </li>
                ))}
              </ol>
              <div className="mt-2.5 flex gap-3 pb-3">
                <pre className="min-w-0 flex-1 overflow-x-auto leading-relaxed [scrollbar-width:none]">
                  <Tag picked={current} width={box.border.width} height={box.border.height} />
                </pre>
                <BoxModel picked={current} width={box.content.width} height={box.content.height} />
              </div>
            </>
          ) : (
            <p className="py-10 text-center text-white/60">
              {matchesTouch() ? "Tap" : "Hover over"} anything on the page to inspect it.
            </p>
          )}
        </div>
        <div className="flex border-t border-white/10 text-[13px]">
          <span className="flex-1 py-2.5 text-center font-semibold text-[#61dafb]">Inspect</span>
          <button
            type="button"
            aria-pressed={perf}
            onClick={() => setDev({ perf: !perf })}
            className="flex-1 py-2.5 text-white/70 transition-colors hover:bg-white/10 aria-pressed:text-white"
          >
            Perf
          </button>
          <button
            type="button"
            onClick={() => setDev({ inspector: false })}
            className="flex-1 py-2.5 text-white/70 transition-colors hover:bg-white/10"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}

const matchesTouch = () => typeof window !== "undefined" && matchMedia("(pointer: coarse)").matches;

type Box = { left: number; top: number; width: number; height: number };

function measure({ margin: m, padding: p, border: b }: Picked, r: Rect) {
  const pos = (v: number) => Math.max(0, v);
  const margin: Box = {
    left: r.x - pos(m[3]),
    top: r.y - pos(m[0]),
    width: r.w + pos(m[1]) + pos(m[3]),
    height: r.h + pos(m[0]) + pos(m[2]),
  };
  const border: Box = { left: r.x, top: r.y, width: r.w, height: r.h };
  const content: Box = {
    left: r.x + b[3] + p[3],
    top: r.y + b[0] + p[0],
    width: pos(r.w - b[1] - b[3] - p[1] - p[3]),
    height: pos(r.h - b[0] - b[2] - p[0] - p[2]),
  };
  return { margin, border, content };
}

// The element written out as the JSX you'd write in React Native.
function Tag({ picked, width, height }: { picked: Picked; width: number; height: number }) {
  const style: [string, string | number][] = [["width", Math.round(width)], ["height", Math.round(height)], ...picked.style];
  return (
    <code>
      <span className="text-white/45">&lt;</span>
      <span className="text-[#61dafb]">{picked.name}</span>
      {picked.props.map(([key, value]) => (
        <span key={key}>
          {"\n  "}
          <span className="text-[#c792ea]">{key}</span>
          <span className="text-white/45">=</span>
          <span className="text-[#c3e88d]">&quot;{value}&quot;</span>
        </span>
      ))}
      {"\n  "}
      <span className="text-[#c792ea]">style</span>
      <span className="text-white/45">={"{{"}</span>
      {style.map(([key, value]) => (
        <span key={key}>
          {"\n    "}
          {key}: <span className={typeof value === "number" ? "text-[#f78c6c]" : "text-[#c3e88d]"}>{value}</span>,
        </span>
      ))}
      {"\n  "}
      <span className="text-white/45">{"}}"}</span>
      {"\n"}
      <span className="text-white/45">/&gt;</span>
    </code>
  );
}

// Margin, padding and content, drawn the way DevTools draws them.
function BoxModel({ picked, width, height }: { picked: Picked; width: number; height: number }) {
  const edge = (values: Sides) => {
    const show = (v: number) => (v ? v : "-");
    return (
      <>
        <span className="absolute inset-x-0 top-0.5 text-center">{show(values[0])}</span>
        <span className="absolute right-1 top-1/2 -translate-y-1/2">{show(values[1])}</span>
        <span className="absolute inset-x-0 bottom-0.5 text-center">{show(values[2])}</span>
        <span className="absolute left-1 top-1/2 -translate-y-1/2">{show(values[3])}</span>
      </>
    );
  };

  return (
    <div aria-label="Box model" className="relative shrink-0 self-start border border-dashed border-[#f6b26b]/70 bg-[#f6b26b]/10 p-4 text-[10px] text-white/80">
      {edge(picked.margin)}
      <div className="relative border border-[#93c47d]/70 bg-[#93c47d]/10 p-4">
        {edge(picked.padding)}
        <div className="whitespace-nowrap border border-[#6fa8dc]/70 bg-[#6fa8dc]/15 px-2 py-1 text-center tabular-nums text-white">
          {Math.round(width)} × {Math.round(height)}
        </div>
      </div>
    </div>
  );
}
