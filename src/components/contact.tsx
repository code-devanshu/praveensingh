"use client";

import { useState } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { site } from "@/content";
import { Avatar } from "./avatar";
import { CopyEmail } from "./copy-email";
import { Window } from "./window";

// A Mail compose window. Send hands the draft to the visitor's own mail app.
export function Contact({ className }: { className?: string }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ subject: subject || "Senior React Native role", body });
    window.location.href = `mailto:${site.email}?${params.toString().replace(/\+/g, "%20")}`;
  }

  const sendButton = (
    <button
      type="submit"
      form="compose"
      aria-label="Send"
      className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-fill text-white transition-transform active:scale-95"
    >
      <PaperPlaneTilt size={16} weight="fill" aria-hidden />
    </button>
  );

  return (
    <Window id="contact" title="New Message" toolbar={sendButton} className={className}>
      <form id="compose" onSubmit={send}>
        <div className="px-6 pt-8 md:px-10">
          <h2 data-split className="text-3xl font-semibold tracking-tighter md:text-4xl">Hiring, or building an app?</h2>
          <p className="mt-2 text-muted">
            Tell me about the role or the product. I reply within 24 hours.
          </p>
        </div>

        <div className="mt-6 text-[15px]">
          <div className="flex items-center gap-3 border-y border-hairline px-6 py-3 md:px-10">
            <span className="text-muted">To:</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft py-0.5 pl-0.5 pr-2.5 font-medium text-accent">
              <Avatar size={22} />
              {site.name}
            </span>
            <span className="hidden truncate font-mono text-sm text-muted sm:inline">{site.email}</span>
          </div>
          <label className="flex items-center gap-3 border-b border-hairline px-6 py-3 md:px-10">
            <span className="text-muted">Subject:</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Senior React Native role"
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted/60"
            />
          </label>
          <label className="block px-6 py-4 md:px-10">
            <span className="sr-only">Message</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              placeholder="Hi Praveen, we're hiring for…"
              className="w-full resize-none bg-transparent leading-relaxed outline-none placeholder:text-muted/60"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-hairline px-6 py-5 md:px-10">
          <button
            type="submit"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent-fill px-6 py-3 text-[15px] font-medium text-white transition-transform active:scale-[0.98]"
          >
            <PaperPlaneTilt size={18} weight="fill" aria-hidden />
            Send
          </button>
          <CopyEmail email={site.email} />
        </div>
      </form>
    </Window>
  );
}
