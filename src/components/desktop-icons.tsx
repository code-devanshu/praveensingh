import type { Icon } from "@phosphor-icons/react";
import { FilePdf, FileText, Folder, GithubLogo } from "@phosphor-icons/react/ssr";
import { site } from "@/content";

const icons: { href: string; label: string; Icon: Icon; colour: string; external?: boolean }[] = [
  { href: "#work", label: "Projects", Icon: Folder, colour: "text-[#5ac8fa]" },
  { href: "#experience", label: "Resume.pdf", Icon: FilePdf, colour: "text-[#ff453a]" },
  { href: "#contact", label: "Say hello.txt", Icon: FileText, colour: "text-white" },
  { href: site.github, label: "GitHub", Icon: GithubLogo, colour: "text-[#1d1d1f] dark:text-white", external: true },
];

// A few files on the desktop, in the gutter beside the windows on wide screens.
export function DesktopIcons() {
  return (
    <ul aria-label="Desktop" className="fixed left-5 top-14 hidden flex-col gap-4 min-[1400px]:flex">
      {icons.map(({ href, label, Icon, colour, external }) => (
        <li key={label}>
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="group flex w-20 flex-col items-center gap-1 text-center outline-none"
          >
            <span className="rounded-lg p-1.5 group-hover:bg-black/10 group-focus-visible:bg-black/15 dark:group-hover:bg-white/10">
              <Icon size={48} weight="fill" aria-hidden className={`drop-shadow-md ${colour}`} />
            </span>
            <span className="rounded px-1 text-xs font-medium leading-tight [text-shadow:0_1px_2px_rgb(0_0_0/0.25)] group-focus-visible:bg-accent-fill group-focus-visible:text-white">
              {label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
