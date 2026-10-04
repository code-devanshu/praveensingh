import Link from "next/link";
import { ArrowUpRight, FileText, GithubLogo, LinkedinLogo, Notebook } from "@phosphor-icons/react/ssr";
import { site } from "@/content";

// Pills like the menu bar's: big enough to tap, with hover, press and
// "you're here" states.
const pill =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 transition-[background-color,color,scale] hover:bg-black/5 active:scale-95 dark:hover:bg-white/10 aria-[current]:bg-accent-soft aria-[current]:text-accent";

// Shared by the home page and the sub-pages. rel="me" tells search engines
// the GitHub and LinkedIn profiles belong to the person this site is about;
// they open in a new tab, like the Dock's, so the site stays open.
/** `section`: the sub-page's section ("/blog", "/resume"), highlighted when it's one of these links. */
export function SiteFooter({ section }: { section?: string }) {
  const here = (href: string) => (section === href ? "true" : undefined);

  return (
    <footer className="glass mx-auto flex flex-wrap items-center justify-center gap-x-1 gap-y-1 rounded-[22px] px-2 py-1.5 text-[13px] sm:rounded-full sm:text-sm">
      <p className="whitespace-nowrap px-3 py-1.5">© {new Date().getFullYear()} {site.name}</p>
      <a href={site.github} target="_blank" rel="me noreferrer" className={pill}>
        <GithubLogo size={16} aria-hidden />
        GitHub
        <ArrowUpRight size={12} weight="bold" aria-hidden className="-ml-0.5 opacity-50" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
      <a href={site.linkedin} target="_blank" rel="me noreferrer" className={pill}>
        <LinkedinLogo size={16} aria-hidden />
        LinkedIn
        <ArrowUpRight size={12} weight="bold" aria-hidden className="-ml-0.5 opacity-50" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
      <Link href="/resume" aria-current={here("/resume")} className={pill}>
        <FileText size={16} aria-hidden />
        Résumé
      </Link>
      <Link href="/blog" aria-current={here("/blog")} className={pill}>
        <Notebook size={16} aria-hidden />
        Blog
      </Link>
    </footer>
  );
}
