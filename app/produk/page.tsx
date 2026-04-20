"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";

// --- Font Configuration ---
const fontJudul = localFont({
  src: "./../fonts/8 Heavy.ttf",
  variable: "--font-brand",
  display: "swap",
});

const fontCaption = localFont({
  src: "./../fonts/Nohemi-Regular.otf",
  variable: "--font-body",
  display: "swap",
});

// Komponen Card yang disesuaikan dengan field Database/API
const ProductCard = ({ parfum }: { parfum: any }) => {
  return (
    // 1. Mengubah rounded-2xl menjadi rounded-sm atau rounded-none untuk kesan lebih kotak
    // 2. Mengubah shadow menjadi lebih tipis atau flat border
    <div className="group flex flex-col bg-white border border-stone-200 rounded-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full">

      {/* Image Area */}
      <div className="relative w-full h-[300px] bg-stone-100">
        <Image
          src={parfum.image_url || "/img/placeholder.jpg"}
          alt={parfum.nama}
          fill
          unoptimized
          className="object-cover"
        />
        {/* Badge tetap bisa dipertahankan dengan sudut tajam */}
        <div className="absolute top-2 left-2">
          <span className="bg-white text-stone-900 text-[8px] uppercase tracking-widest px-2 py-1 font-bold border border-stone-900">
            {parfum.ukuran || "50ML"}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow text-left">
        <h3 className={`${fontJudul.className} text-sm text-stone-900 mb-1 tracking-wider`}>
          {parfum.nama}
        </h3>
        <p className="text-[10px] text-stone-500 italic mb-4 line-clamp-1">
          {parfum.deskripsi}
        </p>

        <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
          <p className="text-[11px] font-bold text-stone-900">
            IDR {Number(parfum.harga_retail).toLocaleString("id-ID")}
          </p>
          <Link
            href={`/produk/${parfum.id}`}
            className="text-[9px] uppercase tracking-widest font-bold underline underline-offset-4 hover:text-stone-500"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products", {
          headers: { Accept: "application/json" },
        });
        const result = await response.json();

        setProducts(result.data || result || []);
        // const data = await response.json();
        // setProducts(data.data || data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div
      className={`${fontJudul.variable} ${fontCaption.variable} font-body bg-[#FDFCFB] selection:bg-amber-100`}
    >
      {/* NAVBAR */}
      <nav className="fixed w-full z-900 bg-[#0081D1] backdrop-blur-xl border-b border-blue-800/20">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <Image
              src="/img/Logo Evomi.png"
              alt="Evomi"
              width={110}
              height={40}
              // Tambahkan 'invert' agar logo yang aslinya hitam/gelap berubah jadi putih
              className="brightness-0 invert"
            />
          </Link>
          <div className="hidden md:flex space-x-10 text-[10px] uppercase tracking-[0.3em] font-bold text-white/70">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/produk" className="text-white">
              Collections
            </Link>
            <Link
              href="#footer"
              className="hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO / HEADER SECTION */}
      <section className="pt-44 pb-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-[10px] uppercase tracking-[0.5em] text-amber-700 mb-6 font-bold">
            The Art of Fragrance
          </span>
          <h1
            className={`${fontJudul.className} text-5xl md:text-7xl text-stone-900 mb-8 leading-tight`}
          >
            Our Collections
          </h1>
          <p className="text-stone-500 max-w-xl mx-auto leading-relaxed text-sm md:text-base font-light">
            Dikurasi dengan bahan-bahan organik terbaik untuk menciptakan jejak
            aroma yang tak terlupakan. Temukan identitas Anda melalui koleksi
            kami.
          </p>
        </div>
      </section>

      {/* PRODUCT GRID */}
      {/* PRODUCT GRID */}
      <section className="pb-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            /* Skeleton Loading: Dibuat 2 kolom di mobile, 4 di desktop */
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-[300px] md:h-[500px] bg-stone-100 animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          ) : (
            /* Product List: Menggunakan CSS Grid untuk konsistensi 2 kolom */
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12">
              {products.map((parfum: any) => (
                <ProductCard key={parfum.id} parfum={parfum} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="bg-stone-900 text-stone-400 py-24 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
          <div className="space-y-8">
            <Image
              src="/img/Logo Evomi.png"
              alt="Evomi"
              width={120}
              height={40}
              className="invert brightness-0"
            />
            <p className="italic text-sm leading-relaxed">
              &quot;Redefining Presence through Scent.&quot; Identitas yang
              tidak terlihat namun paling berkesan.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-white text-xs uppercase tracking-[0.2em] font-bold">
              Location
            </h4>
            <p className="text-sm">
              Jakarta, Indonesia
              <br />
              Sudirman Central Business District
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-white text-xs uppercase tracking-[0.2em] font-bold">
              Connect
            </h4>
            <div className="flex flex-col gap-4 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-white transition-colors">
                TikTok
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-[9px] uppercase tracking-widest flex justify-between">
          <p>© {new Date().getFullYear()} EVOMI FRAGRANCE.</p>
          <p>Handcrafted in Indonesia</p>
        </div>
      </footer>
    </div>
  );
}
