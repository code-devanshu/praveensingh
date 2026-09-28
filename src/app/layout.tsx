import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Command } from "@phosphor-icons/react/ssr";
import { site } from "@/content";
import { bootScript } from "@/lib/desktop";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${site.name}, ${site.role}`,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // The boot script below sets a class and data-wallpaper before paint.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col overflow-x-clip font-sans">
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <div aria-hidden className="boot">
          <Command size={72} weight="light" />
          <div className="boot-bar" />
        </div>
        {children}
      </body>
    </html>
  );
}
