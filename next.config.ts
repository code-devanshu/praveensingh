import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.4"],
  async redirects() {
    return [
      // One host for search engines: www goes to the bare domain.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.praveensingh.co.in" }],
        destination: "https://praveensingh.co.in/:path*",
        permanent: true,
      },
      // The résumé PDF was renamed; keep old links and shares working.
      {
        source: "/Praveen_Singh_Resume.pdf",
        destination: "/Praveen_Singh_Senior_React_Native_Developer.pdf",
        permanent: true,
      },
      // Browsers and some crawlers ask for /favicon.ico regardless of <link> tags.
      { source: "/favicon.ico", destination: "/icon", permanent: true },
    ];
  },
};
export default nextConfig;
