import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the dev server to be accessed from other devices on the LAN
  // (e.g. testing the PWA on a phone). Production is unaffected.
  allowedDevOrigins: ["192.168.18.119"],
};

export default nextConfig;
