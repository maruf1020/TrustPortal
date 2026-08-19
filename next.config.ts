import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  agentRules: false,
  // TrustPortal ships no backend. Everything is a lie held entirely in the client.
};

export default nextConfig;
