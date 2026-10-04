import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/content";
import { bootScript } from "@/lib/desktop";
import { person, website } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Defaults for every page. Each page sets its own canonical URL, and
// sub-pages their own title and description.
// The share image is app/opengraph-image.tsx.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.searchTitle, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    site.name,
    "React Native developer",
    "Senior React Native engineer",
    "React Native developer Noida",
    "React Native developer India",
    "iOS and Android developer",
    "mobile app performance",
    "React Native consultant",
  ],
  openGraph: {
    type: "profile",
    title: site.searchTitle,
    description: site.description,
    siteName: site.name,
    locale: "en_IN",
    firstName: site.name.split(" ")[0],
    lastName: site.name.split(" ").slice(1).join(" "),
  },
  twitter: { card: "summary_large_image", title: site.searchTitle, description: site.description },
  // Search Console and Bing Webmaster Tools ownership, set in the host's env.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // globals.css scrolls smoothly for in-page links. This tells Next to
      // switch that off while it changes pages, so a new page opens at the top
      // at once instead of animating there, where any scroll, such as a
      // trackpad's leftover momentum, could stop it partway down.
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // The boot script below sets a class and data-wallpaper before paint.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col overflow-x-clip font-sans">
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {/* Who this site is about, on every page. */}
        <JsonLd nodes={[person, website]} />
        {children}
      </body>
    </html>
  );
}
