import type { NextConfig } from "next";

const basePath = process.env.GITHUB_ACTIONS && !process.env.CUSTOM_DOMAIN
  ? "/tomorrow-website"
  : "";

const nextConfig: NextConfig = {
  // GitHub Pages only serves static assets, so produce the deployable `out/`
  // directory during `next build`.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
