import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "assets.evomi.id", // Jaga-jaga jika masih pakai link external
      },
    ],
  },

  // Menyembunyikan Dev Indicator, Tombol Pada Bawah Kiri
  devIndicators: false,
};

export default nextConfig;
