import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    unoptimized: true, // Mematikan optimasi gambar secara global
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
      // Tambahkan juga jika terkadang kamu menggunakan 'localhost'
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
  },

  // Menyembunyikan Dev Indicator, Tombol Pada Bawah Kiri
  devIndicators: false,
};

export default nextConfig;
