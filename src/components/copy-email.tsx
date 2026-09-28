"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";

type Status = "idle" | "copied" | "failed";

export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-hairline px-6 py-3 text-[15px] font-medium transition-colors hover:bg-accent-soft active:scale-[0.98]"
    >
      {status === "copied" ? (
        <Check size={18} weight="bold" className="text-accent" aria-hidden />
      ) : (
        <Copy size={18} aria-hidden />
      )}
      <span aria-live="polite">
        {status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : "Copy email"}
      </span>
    </button>
  );
}
