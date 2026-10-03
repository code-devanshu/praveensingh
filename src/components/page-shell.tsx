import Link from "next/link";
import { site } from "@/content";
import { SiteFooter } from "./site-footer";

type Crumb = { name: string; path: string };

type PageShellProps = {
  /** Shown in the window's title bar. */
  title: string;
  /** From the home page down to this page. Mirrors the BreadcrumbList data. */
  crumbs: Crumb[];
  children: React.ReactNode;
  /** Blog posts need room for the table of contents beside the text. */
  wide?: boolean;
  /** Drawn inside the title bar, e.g. a reading-progress bar. */
  titleBarExtra?: React.ReactNode;
};

// Sub-pages (case studies, résumé, blog): the same wallpaper and window
// look as the desktop, but a single static window that reads like a
// document, so it loads fast for visitors arriving from search.
export function PageShell({ title, crumbs, children, wide = false, titleBarExtra }: PageShellProps) {
  const links = [
    { href: "/#work", label: "Work" },
    { href: "/blog", label: "Blog" },
    { href: "/resume", label: "Résumé" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <>
      <div aria-hidden className="wallpaper fixed inset-0 -z-10" />
      <header className="menubar fixed inset-x-0 top-0 z-40 flex h-8 items-center gap-4 px-4 text-[13px]">
        <nav aria-label="Site" className="flex w-full items-center gap-3">
          <Link href="/" className="whitespace-nowrap font-semibold">
            {site.name}
          </Link>
          <ul className="ml-auto flex items-center gap-3 sm:ml-2 sm:gap-5">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="rounded px-1 py-0.5 transition-colors hover:bg-black/10 dark:hover:bg-white/15">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className={`mx-auto flex w-full ${wide ? "max-w-5xl" : "max-w-4xl"} flex-1 flex-col gap-6 px-3 pb-16 pt-12 md:px-6 md:pt-16`}>
        <nav aria-label="Breadcrumb" className="glass self-start rounded-full px-4 py-1.5 text-[13px]">
          <ol className="flex flex-wrap items-center gap-1.5">
            {crumbs.map((crumb, i) => (
              <li key={crumb.path} className="flex min-w-0 items-center gap-1.5">
                {i > 0 && <span aria-hidden className="text-muted">/</span>}
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="block max-w-[13rem] truncate font-medium sm:max-w-md">
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.path} className="text-muted hover:text-accent">
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="window overflow-clip">
          {/* A frosted toolbar: the page scrolls under it. */}
          <div className="titlebar sticky top-8 z-10 flex h-12 items-center border-b border-hairline bg-surface/80 px-4 backdrop-blur-xl backdrop-saturate-150">
            {/* Just the look of a window here; nothing to close or drag. */}
            <span aria-hidden className="flex gap-2">
              <span className="light light-close h-3 w-3 rounded-full" />
              <span className="light light-minimise h-3 w-3 rounded-full" />
              <span className="light light-zoom h-3 w-3 rounded-full" />
            </span>
            {/* Decorative like the buttons: the page's own heading names it for screen readers. */}
            <p aria-hidden className="pointer-events-none absolute inset-x-24 truncate text-center text-[13px] font-semibold text-muted">
              {title}
            </p>
            {titleBarExtra}
          </div>
          {children}
        </div>

        <SiteFooter />
      </main>
    </>
  );
}
