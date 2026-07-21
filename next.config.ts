import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages only serves static assets, so produce the deployable `out/`
  // directory during `next build`.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
