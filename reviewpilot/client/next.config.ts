import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/dashboard/owner",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
