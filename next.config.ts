import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
    ],
  },
  reactCompiler: true,

  // Keeps the service worker script itself from being cached by browsers
  // or CDNs — the browser's own update-check mechanism (byte-comparing
  // the file on each navigation) is how a new sw.js actually gets picked
  // up, and a stale cached copy of the script would defeat that.
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
