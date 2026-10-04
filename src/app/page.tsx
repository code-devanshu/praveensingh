import type { Metadata } from "next";
import { Command } from "@phosphor-icons/react/ssr";
import { allPosts } from "@/blog";
import { About } from "@/components/about";
import { BlogWindow } from "@/components/blog-window";
import { Contact } from "@/components/contact";
import { Deferred } from "@/components/deferred";
import { DesktopIcons } from "@/components/desktop-icons";
import { Dock } from "@/components/dock";
import { Effects } from "@/components/effects";
import { Experience } from "@/components/experience";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { MenuBar } from "@/components/menu-bar";
import { Process } from "@/components/process";
import { Recommendations } from "@/components/recommendations";
import { SiteFooter } from "@/components/site-footer";
import { Stack } from "@/components/stack";
import { Terminal } from "@/components/terminal";
import { Work } from "@/components/work";
import { faqPage, profilePage } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const posts = await allPosts();

  return (
    <>
      <JsonLd nodes={[profilePage, faqPage]} />
      {/* The boot screen, home page only: visitors landing on a case study
          from search go straight to it. */}
      <div aria-hidden className="boot">
        <Command size={72} weight="light" />
        <div className="boot-bar" />
      </div>
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
        <BlogWindow posts={posts} className="md:w-[86%] md:self-center" />
        <About className="md:w-[82%] md:self-start" />
        <Recommendations className="md:w-[70%] md:self-end" />
        <Faq className="md:w-[76%] md:self-start" />
        <Contact className="md:w-[74%] md:self-center" />
        <SiteFooter />
      </main>
      <Dock blog={posts.length > 0} />
      {/* Spotlight, the desktop menu, dev tools and the notification load after the page. */}
      <Deferred posts={posts.map(({ slug, title, tags }) => ({ slug, title, tags }))} />
      {/* GSAP scroll and text effects, also after the page (lib/effects.ts). */}
      <Effects />
    </>
  );
}
