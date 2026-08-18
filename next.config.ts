import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit .next/standalone — a self-contained server plus only the
  // node_modules actually reached, which is what the Dockerfile copies into
  // the runner stage. Not a Next.js default: without it `.next/standalone`
  // is never written and the image build fails on the COPY.
  output: "standalone",
};

export default nextConfig;
