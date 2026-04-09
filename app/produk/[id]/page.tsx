import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
// Pastikan path ke file JSON sesuai dengan struktur folder Anda
import evomiData from "../../../data/evomi.json";
import localFont from "next/font/local";

// --------------------------------------------------
// Konfigurasi Local Font 
// --------------------------------------------------
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

interface ProductDetailProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  // Menunggu params (Next.js 15+ pattern)
  const resolvedParams = await params;

  // Cari produk berdasarkan ID
  const produk = evomiData.kategori_produk.find(
    (p) => p.id === resolvedParams.id
  );

  // Jika produk tidak ditemukan, kembalikan halaman 404
  if (!produk) {
    return notFound();
  }

  return (
    <div className={`${fontCaption.variable} min-h-screen bg-stone-50 text-stone-900 font-sans`}>

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="brand-logo">
            <Link href="/">
              <Image
                src="/img/Logo Evomi.png"
                alt="Evomi Logo"
                className="brightness-0"
                width={100}
                height={40}
                priority
              />
            </Link>
          </div>
          <Link
            href="/#product"
            className={`${fontCaption.className} text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition`}
          >
            ← Back to Collections
          </Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="pt-28 pb-24 px-6 max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <div className={`${fontCaption.className} text-xs uppercase tracking-widest text-stone-400 mb-8`}>
          <Link href="/" className="hover:text-stone-900">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/#product" className="hover:text-stone-900">Produk</Link>
          <span className="mx-2">/</span>
          <span className="text-stone-900">{produk.nama}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* KIRI: PRODUCT IMAGE */}
          <div className="relative w-full h-[500px] lg:h-[700px] bg-stone-100 rounded-2xl overflow-hidden sticky top-28">
            <Image
              // Menggunakan artboard_ref sebagai penanda file lokal jika image_url adalah placeholder
              src={`/img/produk/${produk.media.artboard_ref}.jpeg`}
              alt={`Parfum ${produk.nama} by Evomi`}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* KANAN: PRODUCT DETAILS */}
          <div className="flex flex-col justify-center">

            <div className="mb-8 border-b border-stone-200 pb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-stone-200 text-stone-700 text-xs px-3 py-1 rounded-full uppercase tracking-widest font-medium">
                  {produk.spesifikasi.gender}
                </span>
                <span className="text-stone-500 text-sm tracking-wider uppercase">
                  {produk.spesifikasi.konsentrasi} • {produk.spesifikasi.ukuran}
                </span>
              </div>

              <h1 className={`${fontJudul.className} text-5xl md:text-6xl text-stone-800 font-serif mb-4`}>
                {produk.nama}
              </h1>

              <p className="text-3xl font-light text-stone-900 mb-6">
                {produk.transaksi.mata_uang} {produk.transaksi.harga_retail.toLocaleString("id-ID")}
              </p>

              <p className="text-stone-600 leading-relaxed mb-6 italic">
                &quot;{produk.deskripsi}&quot;
              </p>

              <div className="flex flex-wrap gap-2">
                {produk.profil_aroma.karakter.map((karakter, index) => (
                  <span
                    key={index}
                    className="border border-amber-800 text-amber-800 text-xs px-3 py-1 rounded-full uppercase tracking-wider"
                  >
                    {karakter}
                  </span>
                ))}
              </div>
            </div>

            {/* OLFACTORY NOTES SECTION */}
            <div className="mb-10">
              <h3 className={`${fontJudul.className} text-xl text-stone-600 mb-6 uppercase tracking-widest`}>
                Olfactory Notes
              </h3>

              <div className="space-y-4">
                {[
                  { label: "Top", data: produk.profil_aroma.piramida_notes.top_notes },
                  { label: "Middle", data: produk.profil_aroma.piramida_notes.middle_notes },
                  { label: "Base", data: produk.profil_aroma.piramida_notes.base_notes },
                ].map((note) => (
                  <div key={note.label} className="flex gap-4 items-start">
                    <div className="w-16 pt-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-stone-400">{note.label}</span>
                    </div>
                    <div className="flex-1 bg-white border border-stone-100 p-4 rounded-lg shadow-sm">
                      <p className={`${fontCaption.className} text-stone-700 leading-relaxed`}>
                        {note.data.join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PERFORMA SHORTCUT */}
            <div className="grid grid-cols-3 gap-4 mb-10 border-t border-stone-100 pt-8">
                <div className="text-center">
                    <p className="text-[10px] uppercase text-stone-400 mb-1">Longevity</p>
                    <p className="text-xs font-bold">{produk.spesifikasi.performa.ketahanan}</p>
                </div>
                <div className="text-center border-x border-stone-100">
                    <p className="text-[10px] uppercase text-stone-400 mb-1">Sillage</p>
                    <p className="text-xs font-bold">{produk.spesifikasi.performa.sillage}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] uppercase text-stone-400 mb-1">Projection</p>
                    <p className="text-xs font-bold">{produk.spesifikasi.performa.proyeksi}</p>
                </div>
            </div>

            {/* ADD TO CART & STOCK */}
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-4">
                <span className={`${fontCaption.className} text-sm text-stone-500`}>
                  Status: {produk.transaksi.inventaris.stok_tersedia > 0 ? (
                    <span className="text-emerald-600 font-medium">
                        {produk.transaksi.inventaris.status} ({produk.transaksi.inventaris.stok_tersedia} units)
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">Sold Out</span>
                  )}
                </span>
              </div>

              <button
                disabled={produk.transaksi.inventaris.stok_tersedia === 0}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white py-4 transition-colors uppercase tracking-widest text-sm font-medium disabled:bg-stone-300 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>

              <div className="mt-4 text-center">
                <p className={`${fontCaption.className} text-[10px] text-stone-400 uppercase tracking-tight`}>
                  Safe Packaging • Nationwide Shipping • 100% Authentic
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}