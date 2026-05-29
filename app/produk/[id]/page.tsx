"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import localFont from "next/font/local";
import AddToCartButton from "@/components/AddToCartButton";
import { motion, AnimatePresence, Variants } from "framer-motion";
import WavyNavbarGradient from "@/components/WavyNavbarGradient";

// String global url
import { BASE_URL } from "@/src/config/strings";
import QuizModal from "@/components/QuizModal";
import ChatModal from "@/components/ChatModal";

// --- Kamus Bahasa Terjemahan ---
const dict = {
  id: {
    loading: "Memuat Esensi...",
    error: {
      notFound: "Aroma tidak ditemukan.",
      back: "Kembali"
    },
    chat: {
      open: "Chat Admin",
      close: "Tutup Chat"
    },
    modal: {
      title: "Ditambahkan",
      desc: "telah tersimpan.",
      bag: "Keranjang",
      continue: "Lanjutkan"
    },
    nav: {
      back: "Kembali ke Toko"
    },
    details: {
      volume: "Volume",
      longevity: "Ketahanan"
    }
  },
  en: {
    loading: "Loading Essence...",
    error: {
      notFound: "Fragrance not found.",
      back: "Back"
    },
    chat: {
      open: "Chat Admin",
      close: "Close Chat"
    },
    modal: {
      title: "Added to Bag",
      desc: "has been saved.",
      bag: "Bag",
      continue: "Continue"
    },
    nav: {
      back: "Back to Shop"
    },
    details: {
      volume: "Volume",
      longevity: "Longevity"
    }
  }
};

// --- Animasi Variants ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// --- Custom Fonts ---
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

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // State Bahasa Manajemen
  const [lang, setLang] = useState<"id" | "en">("id");
  const t = dict[lang];

  const [showModal, setShowModal] = useState(false);
  const [produk, setProduk] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [user, setUser] = useState<{
    id: any;
    email: string;
    name: string;
    username: string;
    image: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("access_token");
    const savedUser = localStorage.getItem("user_data");
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const setStatus = async (status: number) => {
      try {
        const token = localStorage.getItem("access_token");
        await fetch(`${BASE_URL}/api/user/status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_online: status }),
        });
      } catch (err) {
        console.error("Gagal update status:", err);
      }
    };

    setStatus(1);

    const handleOfflineBeacon = () => {
      const url = `${BASE_URL}/api/user/status-beacon`;
      const data = JSON.stringify({
        user_id: user.id,
        is_online: 0,
      });
      const blob = new Blob([data], { type: "application/json" });
      navigator.sendBeacon(url, blob);
    };

    window.addEventListener("beforeunload", handleOfflineBeacon);

    return () => {
      handleOfflineBeacon();
      window.removeEventListener("beforeunload", handleOfflineBeacon);
    };
  }, [user]);

  useEffect(() => {
    const getDetail = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(
          BASE_URL + `/api/products/${resolvedParams.id}`,
          {
            headers: { Accept: "application/json" },
          },
        );
        if (!response.ok) {
          setError(true);
          return;
        }
        const result = await response.json();
        setProduk(result.data ? result.data : result);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getDetail();
  }, [params]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBF9] text-stone-400 text-[10px] uppercase tracking-widest">
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {t.loading}
        </motion.span>
      </div>
    );

  if (error || !produk)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBFBF9] px-4 text-center">
        <h2 className={`${fontJudul.className} text-6xl text-stone-200 mb-4`}>
          404
        </h2>
        <p className="text-stone-500 text-sm mb-8 font-light italic">
          {t.error.notFound}
        </p>
        <Link
          href="/produk"
          className="px-8 py-3 bg-stone-900 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-stone-700 transition-all"
        >
          {t.error.back}
        </Link>
      </div>
    );

  return (
    <div
      className={`${fontJudul.variable} ${fontCaption.variable} font-body min-h-screen bg-[#FBFBF9] text-stone-900 selection:bg-amber-200`}
    >
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Section: Tombol chat mengambang */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8, type: "spring" }}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[90]"
      >
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="relative flex items-center justify-center w-14 h-14 bg-stone-900 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300 group/chatbtn z-0"
        >
          <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden -z-10">
            <div className="w-full h-full bg-amber-500 scale-x-0 group-hover/chatbtn:scale-x-100 transition-transform duration-500 origin-left" />
          </div>

          {!isChatOpen && (
            <span className="absolute inset-0 rounded-full bg-stone-500 opacity-20 animate-ping group-hover/chatbtn:animate-none -z-10"></span>
          )}

          <svg
            className="w-6 h-6 text-[#FBFBF9] relative z-10 transition-colors duration-300 group-hover/chatbtn:text-stone-950"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>

          <span className="absolute right-16 px-4 py-2.5 bg-white text-stone-800 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl opacity-0 pointer-events-none group-hover/chatbtn:opacity-100 transition-all duration-300 shadow-xl border border-stone-100 whitespace-nowrap translate-x-2 group-hover/chatbtn:translate-x-0 z-20">
            {isChatOpen ? t.chat.close : t.chat.open}
          </span>
        </button>
      </motion.div>

      {/* Section: Modal sukses tambah produk */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-stone-100"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="h-6 w-6 text-stone-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className={`${fontJudul.className} text-xl uppercase tracking-widest mb-2`}>
                  {t.modal.title}
                </h2>
                <p className="text-stone-500 text-xs mb-8 font-light">
                  {produk.nama} {t.modal.desc}
                </p>
                <div className="space-y-3">
                  <Link
                    href="/profile"
                    className="block w-full bg-stone-900 text-white py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-stone-800 transition-colors text-center"
                  >
                    {t.modal.bag}
                  </Link>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full text-stone-400 text-[10px] uppercase tracking-[0.2em] hover:text-stone-900"
                  >
                    {t.modal.continue}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Section: Navbar detail produk */}
      <nav className="sticky top-0 z-50 bg-[#0071bc] backdrop-blur-xl border-b border-white/10 px-6 py-0 flex items-center justify-between lg:px-16 h-20 shadow-lg">
        <WavyNavbarGradient />

        {/* Tombol Back */}
        <Link
          href="/produk"
          className="group/back flex items-center space-x-2 transition-all duration-300 w-1/3 justify-start"
        >
          <div className="flex items-center justify-center p-2 rounded-full transition-all duration-300">
            <ArrowLeft
              size={20}
              className="text-white group-hover/back:text-amber-400 transition-colors"
            />
          </div>

          <div className="relative">
            <span className="text-white uppercase tracking-[0.2em] text-[10px] font-bold group-hover/back:text-amber-400 transition-colors duration-300">
              {t.nav.back}
            </span>
            <span className="absolute bottom-[-4px] left-0 w-full h-[1px] bg-amber-500 scale-x-0 group-hover/back:scale-x-100 transition-transform duration-500 origin-left" />
          </div>
        </Link>

        {/* Judul Brand */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${fontJudul.className} text-lg tracking-[0.2em] uppercase text-white cursor-default w-1/3 text-center`}
        >
          Evomi
        </motion.div>

        {/* Sektor Kanan: Toggle Bahasa Masking Capsule */}
        <div className="w-1/3 flex justify-end">
          <div className="flex items-center relative bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-full overflow-hidden">
            <button
              onClick={() => setLang("id")}
              className={`relative z-10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${lang === 'id' ? 'text-stone-900' : 'text-white hover:text-amber-400'}`}
            >
              ID
            </button>
            <button
              onClick={() => setLang("en")}
              className={`relative z-10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${lang === 'en' ? 'text-stone-900' : 'text-white hover:text-amber-400'}`}
            >
              EN
            </button>
            <motion.div
              className="absolute top-1 bottom-1 w-[calc(50%-2px)] bg-amber-500 rounded-full shadow-sm z-0"
              initial={false}
              animate={{ left: lang === 'id' ? "4px" : "calc(50% + 2px)" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </div>
        </div>
      </nav>

      {/* Section: Konten utama detail produk */}
      <main className="max-w-7xl mx-auto px-6 lg:px-16 py-12 lg:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          {/* Galeri gambar produk */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 1, ease: "easeOut" },
              },
            }}
            className="relative aspect-square w-full bg-stone-100 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
          >
            <Image
              src={produk.image_url || "/img/placeholder.jpg"}
              alt={produk.nama}
              fill
              priority
              unoptimized
              className="object-cover hover:scale-105 transition-transform duration-1000"
            />
          </motion.div>

          {/* Informasi produk */}
          <div className="flex flex-col">
            <motion.div variants={fadeInUp} className="mb-10">
              <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-4 block">
                {produk.gender} • {produk.konsentrasi}
              </span>
              <h1 className={`${fontJudul.className} text-5xl lg:text-6xl uppercase leading-none mb-6 text-stone-900`}>
                {produk.nama}
              </h1>
              <p className="text-xl font-medium text-stone-800">
                Rp {Number(produk.harga_retail).toLocaleString("id-ID")}
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-8 mb-12">
              <div
                className="
                  prose prose-stone max-w-none
                  prose-headings:font-bold prose-headings:text-stone-900 prose-headings:tracking-tight
                  prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                  prose-p:text-stone-600 prose-p:text-sm prose-p:leading-relaxed prose-p:font-light prose-p:mb-4 prose-p:text-justify
                  prose-strong:text-stone-900 prose-strong:font-semibold
                  prose-a:text-[#0071bc] prose-a:no-underline hover:prose-a:underline
                  prose-ul:list-disc prose-ol:list-decimal
                  prose-li:marker:text-stone-400 prose-li:text-stone-600 prose-li:text-sm
                  prose-blockquote:border-l-2 prose-blockquote:border-stone-200 prose-blockquote:bg-transparent prose-blockquote:pl-6 prose-blockquote:py-1 prose-blockquote:text-stone-600 prose-blockquote:italic prose-blockquote:font-light
                  break-words overflow-hidden
                "
                dangerouslySetInnerHTML={{ __html: produk.deskripsi || "" }}
              />

              {/* Tag vibe produk */}
              <div className="flex flex-wrap gap-2">
                {produk.vibe?.split(",").map((v: string, index: number) => (
                  <motion.span
                    key={v}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="px-4 py-2 bg-stone-100 text-stone-600 text-[9px] uppercase tracking-widest font-bold rounded-full"
                  >
                    {v.trim()}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Grid detail spesifikasi produk */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 gap-8 py-8 border-y border-stone-100 mb-10"
            >
              <div>
                <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-2">
                  {t.details.volume}
                </p>
                <p className="text-sm font-bold">{produk.ukuran}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-2">
                  {t.details.longevity}
                </p>
                <p className="text-sm font-bold">{produk.ketahanan}</p>
              </div>
            </motion.div>

            {/* Tombol aksi */}
            <motion.div variants={fadeInUp}>
              <AddToCartButton
                productId={produk.id}
                productName={produk.nama}
                price={produk.harga_retail}
                image={produk.image_url}
                stock={99}
                onSuccess={() => setShowModal(true)}
              />
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}