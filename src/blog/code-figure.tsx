"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";

// A highlighted code block (from rehype-pretty-code) dressed like the
// site's Terminal window: traffic lights, the file name and a copy button.
export function CodeFigure({ children, ...props }: React.ComponentProps<"figure">) {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const code = ref.current?.querySelector("pre")?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <figure {...props} ref={ref} className="code-figure not-prose">
      <div className="code-bar">
        <span aria-hidden className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <button type="button" onClick={copy} aria-label={copied ? "Copied" : "Copy code"} className="code-copy">
          {copied ? <Check size={14} weight="bold" aria-hidden /> : <Copy size={14} aria-hidden />}
          <span aria-hidden>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      {children}
    </figure>
  );
}
