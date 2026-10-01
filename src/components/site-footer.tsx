import Link from "next/link";
import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react/ssr";
import { site } from "@/content";

// Shared by the home page and the sub-pages. rel="me" tells search engines
// the GitHub and LinkedIn profiles belong to the person this site is about.
export function SiteFooter() {
  return (
    <footer className="glass mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 rounded-[22px] px-4 py-2.5 text-[13px] sm:gap-5 sm:rounded-full sm:px-5 sm:text-sm">
      <p className="whitespace-nowrap">© {new Date().getFullYear()} {site.name}</p>
      <a href={site.github} rel="me" className="inline-flex items-center gap-1.5 hover:text-accent">
        <GithubLogo size={16} aria-hidden />
        GitHub
      </a>
      <a href={site.linkedin} rel="me" className="inline-flex items-center gap-1.5 hover:text-accent">
        <LinkedinLogo size={16} aria-hidden />
        LinkedIn
      </a>
      <Link href="/resume" className="hover:text-accent">
        Résumé
      </Link>
      <Link href="/blog" className="hover:text-accent">
        Blog
      </Link>
    </footer>
  );
}
