// Notes: technical write-ups from real project work, one file per note.
// Written as TSX so there's nothing extra to install; see flashlist-checklists.tsx.
//
// A note with `draft: true` renders in `next dev` only. It stays out of
// production builds, the sitemap and the footer until the flag is removed,
// so drafts can be reviewed safely.
//
// Ideas from the work on this site, each backed by a project:
// - Bridging Brightcove video with native Swift and Kotlin modules (upGrad)
// - Offline-first audits: photo capture and a queued sync (Delightree)
// - Cutting cold start from 2.9s to 1.8s (upGrad)
// - Releases in 3 days, not 5: Fastlane, GitHub Actions and OTA (upGrad)
// - Apollo caching that made a card app's API 30% faster (Reevo)
// - NFC tag authentication with a custom Kotlin module (agency work)

import type { ComponentType } from "react";
import * as flashlist from "./flashlist-checklists";

export type NoteMeta = {
  slug: string;
  title: string;
  description: string;
  /** ISO date, e.g. "2026-10-01". */
  published: string;
  updated?: string;
  tags: string[];
  draft?: boolean;
};

export type Note = NoteMeta & { Body: ComponentType };

const notes: Note[] = [{ ...flashlist.meta, Body: flashlist.Body }];

const showDrafts = process.env.NODE_ENV !== "production";

/** Newest first. Includes drafts in development only. */
export function publishedNotes() {
  return notes
    .filter((n) => showDrafts || !n.draft)
    .sort((a, b) => b.published.localeCompare(a.published));
}

export function findNote(slug: string) {
  return publishedNotes().find((n) => n.slug === slug);
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export const formatDate = (iso: string) => dateFormat.format(new Date(iso));
