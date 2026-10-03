"use client";

import { Children, isValidElement, useRef, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { TrafficLights } from "@/components/traffic-lights";

type State = "open" | "minimised" | "closed";

// The file name rehype-pretty-code put in the title, else the language.
function codeName(children: React.ReactNode) {
  let title: string | undefined;
  let language: string | undefined;
  Children.forEach(children, (child) => {
    if (!isValidElement<Record<string, unknown>>(child)) return;
    if ("data-rehype-pretty-code-title" in child.props && typeof child.props.children === "string") {
      title = child.props.children;
    }
    if (typeof child.props["data-language"] === "string") language = child.props["data-language"];
  });
  return title ?? (language && language !== "plaintext" ? `${language} code` : "code");
}

// A highlighted code block (from rehype-pretty-code) dressed like the
// site's Terminal window, and its traffic lights work like a window's:
// close leaves a "Reopen" bar, minimise folds it to its title bar (so does
// a double-click there), and the green one opens it large in a modal
// <dialog>, so long lines can be read even on a phone.
export function CodeFigure({ children, ...props }: React.ComponentProps<"figure">) {
  const ref = useRef<HTMLElement>(null);
  const zoomRef = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);
  const [state, setState] = useState<State>("open");
  const [zoomed, setZoomed] = useState(false);
  const name = codeName(children);

  async function copy() {
    const code = ref.current?.querySelector("pre")?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function zoom() {
    setState("open");
    setZoomed(true);
  }

  // Every way out of the big view goes through close(), so the browser
  // returns focus to the button that opened it.
  function unzoom(then?: State) {
    zoomRef.current?.close();
    if (then) setState(then);
  }

  const bar = (inZoom: boolean) => (
    <div className="code-bar" onDoubleClick={inZoom ? undefined : () => setState(state === "minimised" ? "open" : "minimised")}>
      <TrafficLights
        title={name}
        fullscreen={inZoom}
        onClose={() => (inZoom ? unzoom("closed") : setState("closed"))}
        onMinimise={() => (inZoom ? unzoom("minimised") : setState(state === "minimised" ? "open" : "minimised"))}
        onZoom={() => (inZoom ? unzoom() : zoom())}
      />
      <button type="button" onClick={copy} aria-label={copied ? "Copied" : "Copy code"} className="code-copy">
        {copied ? <Check size={14} weight="bold" aria-hidden /> : <Copy size={14} aria-hidden />}
        <span aria-hidden>{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );

  if (state === "closed") {
    return (
      <div className="code-closed not-prose">
        <span className="truncate">
          <span className="font-mono font-medium">{name}</span> is closed
        </span>
        <button type="button" autoFocus onClick={() => setState("open")} className="code-copy whitespace-nowrap">
          Reopen
        </button>
      </div>
    );
  }

  return (
    <figure {...props} ref={ref} data-minimised={state === "minimised" || undefined} className="code-figure not-prose">
      {bar(false)}
      <div
        inert={state === "minimised"}
        className={`overflow-clip transition-[height] duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] [interpolate-size:allow-keywords] motion-reduce:transition-none ${
          state === "minimised" ? "h-0" : "h-auto"
        }`}
      >
        {children}
      </div>

      {zoomed && (
        <dialog
          ref={(dialog) => {
            zoomRef.current = dialog;
            if (dialog && !dialog.open) dialog.showModal();
          }}
          aria-label={name}
          onClose={() => setZoomed(false)}
          // A click outside the code lands on the dialog itself: the backdrop.
          onClick={(e) => e.target === e.currentTarget && unzoom()}
          className="code-zoom"
        >
          <div className="code-figure">
            {bar(true)}
            {children}
          </div>
        </dialog>
      )}
    </figure>
  );
}
