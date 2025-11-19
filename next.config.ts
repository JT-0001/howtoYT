import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'ik.imagekit.io',
      'i.ytimg.com',
      'oaidalleapiprodscus.blob.core.windows.net' // ✅ Added OpenAI Images Host
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
        pathname: "/**",
      }
    ]
  },
};

export default nextConfig;
