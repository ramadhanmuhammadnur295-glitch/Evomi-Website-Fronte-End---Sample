"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react"; // Tambahkan icon tambahan jika perlu
import localFont from "next/font/local";
import AddToCartButton from "@/components/AddToCartButton";

// --- Font Configuration (Tetap sama) ---
const fontJudul = localFont({
  src: "./../../fonts/8 Heavy.ttf",
  variable: "--font-brand",
  display: "swap",
});

const fontCaption = localFont({
  src: "./../../fonts/Nohemi-Regular.otf",
  variable: "--font-body",
  display: "swap",
});

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [showModal, setShowModal] = useState(false);
  const [produk, setProduk] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Menambahkan state error yang terlewat

  useEffect(() => {
    const getDetail = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(
          `http://localhost:8000/api/products/${resolvedParams.id}`,
          {
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          setError(true);
          return;
        }

        const result = await response.json();
        // Laravel biasanya mengembalikan { data: {...} } atau langsung {...}
        setProduk(result.data ? result.data : result);
      } catch (err) {
        console.error("Error fetching detail:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getDetail();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-stone-100 rounded-full mb-4"></div>
          <p className="text-[10px] uppercase tracking-widest text-stone-400">Curating Presence...</p>
        </div>
      </div>
    );
  }

  // Menampilkan UI jika terjadi error atau produk tidak ditemukan
  if (error || !produk) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
        <h2 className={`${fontJudul.className} text-6xl text-stone-100 mb-4`}>404</h2>
        <h3 className="text-xl font-bold text-stone-900 mb-2">Aroma Tidak Ditemukan</h3>
        <p className="text-stone-500 text-sm max-w-xs mb-8 font-light italic">
          Sepertinya produk yang Anda cari telah ditarik dari koleksi atau link yang Anda tuju sudah tidak berlaku.
        </p>
        <Link
          href="/produk"
          className="px-8 py-3 bg-stone-900 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-stone-700 transition-all"
        >
          Kembali ke Koleksi
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* MOBILE NAVIGATION BAR (Sticky di atas) */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 px-4 py-4 flex items-center justify-between lg:px-16">
        <Link href="/produk" className="flex items-center gap-2 text-stone-500 hover:text-black transition-colors">
          <ArrowLeft size={20} />
          <span className="text-[10px] uppercase tracking-widest font-bold hidden sm:inline">Back to Collection</span>
        </Link>
        <div className={`${fontJudul.className} text-lg tracking-widest`}>EVOMI</div>
        
        {/* Share Button */}
        {/* <button className="text-stone-500 hover:text-black">
          <Share2 size={20} />
        </button> */}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-6 lg:py-20">
        {/* Mengubah lg:gap-24 menjadi lg:gap-16 agar lebih seimbang dengan gambar yang lebih kecil */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* LEFT: IMAGE AREA */}
          <div className="lg:sticky lg:top-32 space-y-4">
            {/* Pembungkus tambahan untuk mengecilkan ukuran gambar di desktop (max-w-md) dan rata tengah */}
            <div className="w-full lg:max-w-md mx-auto">
              {/* Mengubah aspect-[4/5] menjadi aspect-square dan menambahkan shadow yang lebih lembut */}
              <div className="relative aspect-square w-full bg-stone-100 rounded-2xl overflow-hidden shadow-inner border border-stone-100">
                <Image
                  src={produk.image_url || "/img/placeholder.jpg"}
                  alt={produk.nama}
                  fill
                  priority
                  unoptimized
                  className="object-cover"
                />
                {/* Badge Mobile */}
                <div className="absolute top-4 left-4 lg:hidden">
                  <span className="bg-white/90 backdrop-blur-sm text-stone-800 text-[9px] uppercase tracking-widest px-3 py-1.5 font-bold rounded-full">
                    Signature Series
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTENT AREA */}
          <div className="flex flex-col min-h-full">
            {/* Header Info */}
            <div className="mb-8 lg:mb-12">
              <div className="flex items-center gap-3 text-stone-400 text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
                <span>{produk.gender || "Unisex"}</span>
                <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                <span>{produk.konsentrasi || "Eau De Parfum"}</span>
              </div>

              <h1 className={`${fontJudul.className} text-4xl lg:text-7xl mb-4 leading-tight tracking-[0.01em] uppercase`}>
                {produk.nama}
              </h1>

              <p className="text-xl lg:text-2xl font-bold text-stone-900 tracking-tight">
                IDR {Number(produk.harga_retail).toLocaleString("id-ID")}
              </p>
            </div>

            {/* Description Section */}
            <div className="space-y-8 mb-12">
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-4">The Scent Story</h3>
                <p className="text-stone-600 text-sm lg:text-base leading-relaxed italic font-light">
                  &quot;{produk.deskripsi || "A unique blend crafted for those who seek distinction and elegance in every breath."}&quot;
                </p>
              </div>

              {/* Vibe/Notes Badge Area */}
              <div className="flex flex-wrap gap-2">
                {produk.vibe?.split(',').map((v: string) => (
                  <span key={v} className="px-4 py-2 bg-stone-50 text-stone-500 text-[10px] uppercase tracking-widest font-medium rounded-lg border border-stone-100">
                    {v.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Information Card */}
            <div className="bg-stone-50 border border-stone-100 p-6 rounded-2xl mb-12">
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-3">Product Details</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-stone-400 mb-1">Volume</p>
                  <p className="font-medium">{produk.ukuran || "50ML"}</p>
                </div>
                <div>
                  <p className="text-stone-400 mb-1">Longevity</p>
                  <p className="font-medium">{produk.ketahanan || "8-12 Hours"}</p>
                </div>
              </div>
            </div>

            {/* ACTION AREA (Mobile: Bisa dibuat Sticky Bottom) */}
            <div className="sticky bottom-4 lg:relative lg:bottom-0 mt-auto">
              <div className="bg-white/80 backdrop-blur-xl p-4 lg:p-0 border border-stone-100 lg:border-0 rounded-2xl shadow-xl lg:shadow-none flex flex-col gap-4">
                <div className="flex items-center justify-between px-2 lg:px-0">
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Availability</span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                    ● {produk.status_stok || "In Stock"}
                  </span>
                </div>

                <AddToCartButton
                  productId={produk.id}
                  productName={produk.nama}
                  price={produk.harga_retail}
                  image={produk.image_url}
                  stock={99}
                  onSuccess={() => setShowModal(true)}
                />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}