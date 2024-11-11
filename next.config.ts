import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: {
      exclude: ["error"],
    },
  },
  /* config options here */
}

export default nextConfig
