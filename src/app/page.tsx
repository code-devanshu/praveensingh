import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react/ssr";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { DesktopIcons } from "@/components/desktop-icons";
import { DesktopMenu } from "@/components/desktop-menu";
import { DevTools } from "@/components/dev-tools";
import { Dock } from "@/components/dock";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { MenuBar } from "@/components/menu-bar";
import { Notification } from "@/components/notification";
import { Process } from "@/components/process";
import { Recommendations } from "@/components/recommendations";
import { Spotlight } from "@/components/spotlight";
import { Stack } from "@/components/stack";
import { Terminal } from "@/components/terminal";
import { Work } from "@/components/work";
import { site } from "@/content";

export default function Home() {
  return (
    <>
      <div aria-hidden className="wallpaper fixed inset-0 -z-10" />
      <MenuBar />
      <DesktopIcons />
      {/* Windows are staggered on wider screens so it reads like a desktop. */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-3 pb-32 pt-12 md:gap-12 md:px-6 md:pt-16">
        <Hero />
        <Work />
        <Experience />
        <Stack />
        <Terminal className="md:w-[72%] md:self-start" />
        <Process className="md:w-[78%] md:self-end" />
        <About className="md:w-[82%] md:self-start" />
        <Recommendations className="md:w-[70%] md:self-end" />
        <Contact className="md:w-[74%] md:self-center" />
        <footer className="glass mx-auto flex items-center gap-4 rounded-full px-4 py-2.5 text-[13px] sm:gap-5 sm:px-5 sm:text-sm">
          <p className="whitespace-nowrap">© {new Date().getFullYear()} {site.name}</p>
          <a href={site.github} className="inline-flex items-center gap-1.5 hover:text-accent">
            <GithubLogo size={16} aria-hidden />
            GitHub
          </a>
          <a href={site.linkedin} className="inline-flex items-center gap-1.5 hover:text-accent">
            <LinkedinLogo size={16} aria-hidden />
            LinkedIn
          </a>
        </footer>
      </main>
      <Dock />
      <Notification />
      <Spotlight />
      <DesktopMenu />
      <DevTools />
    </>
  );
}
