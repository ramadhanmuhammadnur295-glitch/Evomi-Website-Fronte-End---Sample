"use client";

// import module
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link"; // Tambahkan ini untuk navigasi tombol call-to-action

// String global url
import { BASE_URL } from "@/src/config/strings";

// Data Posters - Tetap sama
const posters = [
  {
    id: 1,
    title: "Purpose Prestige",
    subtitle: "Prestige, Elegant",
    image: BASE_URL + "/storage/new products/gemini - purpose prestige.png",
    color: "bg-stone-100",
  },
  {
    id: 2,
    title: "Peaceful Calm",
    subtitle: "Calm, Peaceful",
    image: BASE_URL + "/storage/new products/gemini - peaceful calm.png",
    color: "bg-stone-200",
  },
  {
    id: 3,
    title: "Sweet Shy",
    subtitle: "Shy, Sweet",
    image: BASE_URL + "/storage/new products/gemini - sweet shy.png",
    color: "bg-stone-100",
  },
  {
    id: 4,
    title: "Rabel Brave",
    subtitle: "Be Brave, Be You",
    image: BASE_URL + "/storage/new products/gemini - rabel brave.png",
    color: "bg-stone-100",
  },
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % posters.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + posters.length) % posters.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    // --- START: ARTISAN CARD CONTAINER (BARU) ---
    <div className="bg-white border border-stone-100 rounded-[2.5rem] p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
      {/* Container Carousel - Sedikit penyesuaian styling */}
      <div className="relative w-full h-[310px] md:h-[580px] overflow-hidden rounded-[1.75rem] group bg-stone-50 border border-stone-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative w-full h-full"
          >
            {/* Overlay Konten - Penyesuaian gradient agar lebih menyatu dengan Card */}
            <div className="absolute inset-0 z-10 flex flex-col justify-center px-10 md:px-16 bg-gradient-to-r from-stone-950/90 via-stone-950/50 to-transparent text-white">
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold mb-3 text-amber-200"
              >
                {posters[currentIndex].subtitle}
              </motion.p>
              
              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl md:text-6xl font-brand uppercase tracking-tighter leading-none mb-6 drop-shadow-sm"
              >
                {posters[currentIndex].title}
              </motion.h3>

              {/* BARU: Tombol Call to Action dalam Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Link href="/produk" className="inline-flex items-center px-6 py-3 bg-white text-stone-900 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-amber-100 transition-colors shadow-lg">
                  Shop Collection
                </Link>
              </motion.div>
            </div>

            <Image
              src={posters[currentIndex].image}
              alt={posters[currentIndex].title}
              fill
              // Gunakan object-cover jika gambar poster full,
              // atau tetap object-contain jika poster memiliki background warna spesifik seperti di data
              className="object-contain" 
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigasi Bullets */}
        <div className="absolute bottom-6 left-10 md:left-16 z-20 flex gap-2.5">
          {posters.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                idx === currentIndex ? "w-10 bg-white" : "w-2.5 bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Tombol Panah (Opsional) */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/50 hover:text-white"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/50 hover:text-white"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
    // --- END: ARTISAN CARD CONTAINER ---
  );
}