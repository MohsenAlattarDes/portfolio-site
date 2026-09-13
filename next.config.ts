import type { NextConfig } from "next";
import { WORK_PROJECTS } from "./src/lib/work/projects";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["172.20.10.9"],
  async redirects() {
    return WORK_PROJECTS.map((project) => ({
      source: `/${project.slug}`,
      destination: `/work/${project.slug}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
