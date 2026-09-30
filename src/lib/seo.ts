// Structured data (schema.org JSON-LD) for search engines and AI answer
// engines, built from content.ts so it never disagrees with the page.
// Every node has a stable @id, so pages can point at the Person instead of
// repeating it. Check changes with https://validator.schema.org.

import type { Metadata } from "next";
import { about, certifications, education, experience, faq, projects, site, stack, type Project } from "@/content";

export const absolute = (path = "/") => new URL(path, site.url).toString();

export const ids = {
  person: absolute("/#person"),
  website: absolute("/#website"),
};

const [city] = site.location.split(", ");

export const person = {
  "@type": "Person",
  "@id": ids.person,
  name: site.name,
  givenName: site.name.split(" ")[0],
  familyName: site.name.split(" ").slice(1).join(" "),
  url: absolute("/"),
  image: absolute(site.photo),
  jobTitle: site.role,
  description: site.description,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: city, addressRegion: "Uttar Pradesh", addressCountry: "IN" },
  // Ties this site to the same person on other sites (entity matching).
  sameAs: [site.linkedin, site.github],
  knowsAbout: [
    "React Native",
    "Mobile app development",
    "iOS development",
    "Android development",
    "Mobile app performance",
    "React Native New Architecture",
    ...stack.map((s) => s.label).filter((label) => label !== "React Native"),
  ],
  alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
  hasCredential: certifications.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name: c.name,
    recognizedBy: { "@type": "Organization", name: c.issuer },
  })),
  hasOccupation: {
    "@type": "Occupation",
    name: "React Native Developer",
    occupationLocation: { "@type": "City", name: site.location },
    skills: about.facts.find((f) => f.label === "Focus")?.value,
  },
  // Past employers, most recent first.
  affiliation: [...new Set(experience.map((job) => job.company))].map((name) => ({ "@type": "Organization", name })),
};

export const website = {
  "@type": "WebSite",
  "@id": ids.website,
  url: absolute("/"),
  name: site.name,
  description: site.description,
  inLanguage: "en",
  publisher: { "@id": ids.person },
};

// A sub-page's metadata. Setting `openGraph` on a page replaces the root
// layout's whole object (merging is shallow), which also drops the share
// image, so it's added back here, and `twitter` is set so it doesn't keep
// the home page's description.
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  openGraph,
  ...rest
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile";
  openGraph?: Record<string, unknown>;
} & Omit<Metadata, "title" | "description" | "openGraph">): Metadata {
  const image = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name}, ${site.role}` };
  return {
    ...rest,
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type, url: path, title, description, siteName: site.name, locale: "en_IN", images: [image], ...openGraph },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  } as Metadata;
}

export const caseStudyPath = (project: Project) => `/work/${project.slug}`;

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export const faqPage = {
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

// The home page: a profile of Praveen, with the projects as a list.
export const profilePage = {
  "@type": "ProfilePage",
  "@id": absolute("/#profile"),
  url: absolute("/"),
  name: site.searchTitle,
  isPartOf: { "@id": ids.website },
  mainEntity: { "@id": ids.person },
  dateModified: site.updated,
  hasPart: {
    "@type": "ItemList",
    name: "Selected work",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absolute(caseStudyPath(p)),
      name: p.name,
    })),
  },
};

/** Wraps nodes in one @graph document for a <script type="application/ld+json">. */
export function graph(...nodes: object[]) {
  // Escaping "<" keeps a stray "</script>" in content from closing the tag.
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }).replace(/</g, "\\u003c");
}
