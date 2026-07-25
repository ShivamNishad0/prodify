import type { NextConfig } from "next";

const nextConfig: any = {
  output: "export",
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  transpilePackages: [
    "@prodify/digit-ui-internals",
    "@prodify/digit-ui-module-crm",
    "@prodify/digit-ui-module-hrms"
  ],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
