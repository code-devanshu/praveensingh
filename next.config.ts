import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder photos. Remove once real screenshots live in /public.
    remotePatterns: [
      new URL("https://picsum.photos/**"),
      new URL("https://fastly.picsum.photos/**"),
    ],
  },
  allowedDevOrigins:['192.168.1.4']
};
export default nextConfig;
