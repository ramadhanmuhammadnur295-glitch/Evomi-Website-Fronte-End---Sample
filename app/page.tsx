"use client";

// React & Next
import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";
import { SocialIcon } from "react-social-icons";

// ... import lainnya
import QuizModal from "@/components/QuizModal";
import ChatModal from "@/components/ChatModal";
import { BASE_URL } from "@/src/config/strings";
import { useState, useEffect, useRef } from "react";
import ImageCarousel from "@/components/ImageCarousel";

// framer motion
import {
  motion,
  Variants,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import WavyNavbarGradient from "@/components/WavyNavbarGradient";
import TestimonialSection from "@/components/TestimonialSection";

// --- Animasi Variants ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

// Stagger Container
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Font untuk judul
const fontJudul = localFont({
  src: "./fonts/8 Heavy.ttf",
  variable: "--font-brand",
  display: "swap",
});

// Font untuk caption
const fontCaption = localFont({
  src: "./fonts/Nohemi-Regular.otf",
  variable: "--font-body",
  display: "swap",
});

// Component utama
export default function EvomiLandingPage() {
  const router = useRouter();

  const [user, setUser] = useState<{
    id: any;
    email: string;
    name: string;
    username: string;
    image: string;
  } | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // --- SCROLL PROGRESS BAR HOOK ---
  const { scrollYProgress } = useScroll();

  // --- Parallax Hooks ---
  const heroRef = useRef(null);
  const { scrollYProgress: heroScrollY } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroTextY = useTransform(heroScrollY, [0, 1], ["0%", "60%"]);
  const heroBgY = useTransform(heroScrollY, [0, 1], ["0%", "20%"]);

  const testimonialRef = useRef(null);
  const { scrollYProgress: testimonialScrollY } = useScroll({
    target: testimonialRef,
    offset: ["start end", "end start"],
  });

  
  const testimonialGlowY = useTransform(
    testimonialScrollY,
    [0, 1],
    ["-40%", "40%"],
  );

  // Hero slides
  const heroSlides = [
    {
      tagline: "The Artisan Fragrance House",
      title: "EVOMI",
      desc: "Kurasi aroma yang melampaui waktu.",
    },
    {
      tagline: "Every Version of Me",
      title: "ESSENCE",
      desc: "Menemukan jati diri melalui setiap semprotan.",
    },
    {
      tagline: "Unisex & Long Lasting",
      title: "CRAFTED",
      desc: "Ketahanan aroma hingga 12 jam lebih.",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // slides interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // fetch products
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("access_token");
    const savedUser = localStorage.getItem("user_data");
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error(error);
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(BASE_URL + "/api/products", {
          headers: { Accept: "application/json" },
        });
        const result = await response.json();
        setProducts(result.data ? result.data : result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  // use effect check status offline / online with beacon / signal website
  useEffect(() => {
    if (!user) return;

    const setStatus = async (status: number) => {
      try {
        await fetch(`${BASE_URL}/api/user/status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ is_online: status }),
        });
      } catch (err) {
        console.error("Gagal update status:", err);
      }
    };

    setStatus(1);

    const handleUnload = () => {
      const url = `${BASE_URL}/api/user/status-beacon`;
      const data = JSON.stringify({ user_id: user.id, is_online: 0 });
      const blob = new Blob([data], { type: "application/json" });
      navigator.sendBeacon(url, blob);
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [user]);

  // handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await fetch(BASE_URL + "/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
      setUser(null);
      setIsMenuOpen(false);
      router.refresh();
    }
    setIsMobileMenuOpen(false);
  };

  // section divider
  const SectionDivider = () => (
    <div className="max-w-7xl mx-auto px-6 md:px-8">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="h-[1px] w-full bg-stone-200 origin-left"
      />
    </div>
  );

  // mobile menu var
  const mobileMenuVars: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.5,
        ease: [0.21, 0.47, 0.32, 0.98],
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  // item var
  const itemVars: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  // top four products
  const topFourProducts = products.slice(0, 4);

  return (
    <div
      style={{ opacity: mounted ? 1 : 0 }}
      className={`${fontCaption.variable} ${fontJudul.variable} selection:bg-amber-200 selection:text-stone-900 transition-opacity duration-500`}
    >
      {/* VISUAL INDIKATOR: SCROLL PROGRESS BAR (ORANGE / AMBER) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-amber-500 origin-left z-[110]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* FLOATING ACTION BUTTON (CHAT MODAL TRIGGER) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8, type: "spring", bounce: 0.5 }}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[90]"
      >
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="relative flex items-center justify-center w-14 h-14 bg-stone-900 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300 group/chatbtn z-0"
        >
          {/* PERBAIKAN: Memindahkan properti overflow-hidden & rounded-full khusus ke layer background ini saja */}
          <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden -z-10">
            <div className="w-full h-full bg-amber-500 scale-x-0 group-hover/chatbtn:scale-x-100 transition-transform duration-500 origin-left" />
          </div>

          {!isChatOpen && (
            <span className="absolute inset-0 rounded-full bg-stone-500 opacity-20 animate-ping group-hover/chatbtn:animate-none -z-10"></span>
          )}

          {/* Icon SVG */}
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

          {/* Tooltip Text - Sekarang dijamin muncul kembali karena pembungkus luar sudah bebas dari overflow-hidden */}
          <span className="absolute right-16 px-4 py-2.5 bg-white text-stone-800 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl opacity-0 pointer-events-none group-hover/chatbtn:opacity-100 transition-all duration-300 shadow-xl border border-stone-100 whitespace-nowrap translate-x-2 group-hover/chatbtn:translate-x-0 z-20">
            {isChatOpen ? "Close Chat" : "Chat Admin"}
          </span>
        </button>
      </motion.div>

      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />

      <div className="min-h-screen bg-[#FBFBF9] text-stone-900 font-sans antialiased">
        {/* ========================================================================= */}
        {/* NAVBAR PERBAIKAN: EFEK PROGRESS ORANGE AKTIF SEMPURNA DI DESKTOP          */}
        {/* ========================================================================= */}
        <nav className="fixed w-full z-[100] bg-[#0071bc]/95 backdrop-blur-xl border-b border-white/10 shadow-lg transition-all duration-300">
          <WavyNavbarGradient />
          <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
            {/* 1. SEKTOR KIRI: LOGO EVOMI MASKING PROGRESS ORANGE */}
            <div className="flex-1 md:w-1/2 flex justify-start">
              <Link
                href="/"
                className="relative group/logo block overflow-hidden"
              >
                {/* Cetakan Utama Logo Putih */}
                <Image
                  src="/img/Logo Evomi.png"
                  alt="Evomi Logo"
                  width={90}
                  height={36}
                  className="brightness-0 invert drop-shadow-sm group-hover/logo:opacity-0 transition-opacity duration-300 block"
                />
                {/* Lapisan Mengisi Orange Kiri ke Kanan via CSS Masking */}
                <div
                  className="absolute inset-0 scale-x-0 group-hover/logo:scale-x-100 transition-transform duration-500 origin-left bg-amber-500"
                  style={{
                    WebkitMaskImage: "url('/img/Logo Evomi.png')",
                    maskImage: "url('/img/Logo Evomi.png')",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                  }}
                />
              </Link>
            </div>

            {/* 2. SEKTOR TENGAH: NAV MENU DESKTOP UNDERLINE PROGRESS ORANGE */}
            <div
              className={`hidden md:flex w-1/2 justify-center items-center space-x-10 ${fontJudul.className} text-[13px] tracking-[0.2em] uppercase text-white`}
            >
              <a
                href="#about"
                className="relative group/nav py-1 transition-colors duration-300 hover:text-amber-400"
              >
                About
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-300 origin-left" />
              </a>

              <a
                href="#product"
                className="relative group/nav py-1 transition-colors duration-300 hover:text-amber-400"
              >
                Collection
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-300 origin-left" />
              </a>

              <Link
                href="/produk"
                className="relative group/nav py-1 transition-colors duration-300 hover:text-amber-400"
              >
                Shop
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>

              <Link
                href="/quiz"
                className="relative group/nav py-1 transition-colors duration-300 hover:text-amber-400"
              >
                Quiz
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>

              <Link
                href="/artikel"
                className="relative group/nav py-1 transition-colors duration-300 hover:text-amber-400"
              >
                Artikel
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </div>

            {/* 3. SEKTOR KANAN: USER PROFILE / LOGIN REGISTER BLOCK PROGRESS ORANGE */}
            <div className="flex-1 md:w-1/3 flex justify-end items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="group/userbtn btn relative flex items-center space-x-3 border border-white/30 rounded-full p-1 pr-4 bg-white/10 transition-all duration-300 backdrop-blur-sm overflow-hidden z-0"
                    >
                      {/* Latar Pengisi Orange Kiri ke Kanan - PERBAIKAN: w-full h-full & Selector Hover tanpa spasi */}
                      <div className="absolute inset-0 w-full h-full bg-amber-500 scale-x-0 group-hover/userbtn:scale-x-100 transition-transform duration-500 origin-left -z-10" />

                      {/* Avatar Lingkaran */}
                      <div className="w-8 h-8 rounded-full bg-white text-[#0071bc] flex items-center justify-center text-[10px] font-bold uppercase overflow-hidden relative z-10 transition-transform duration-300 group-hover/userbtn:scale-95">
                        {user.image !== "default-avatar.png" ? (
                          <img
                            src={BASE_URL + `/storage/profiles/${user.image}`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>

                      {/* Username Text */}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white relative z-10 transition-colors duration-300 group-hover/userbtn:text-stone-950">
                        {user.username}
                      </span>
                    </button>

                    <AnimatePresence>
                      {isMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-blue-50 py-2 z-50 overflow-hidden"
                        >
                          <Link
                            href="/profile"
                            className="block px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-800 hover:bg-blue-50"
                          >
                            Profile
                          </Link>
                          <Link
                            href="/orders"
                            className="block px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-800 hover:bg-blue-50"
                          >
                            Orders
                          </Link>
                          <hr className="border-blue-50 my-1" />
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50"
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center space-x-6">
                    <Link
                      href="/login"
                      className="relative group/auth py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-amber-400 transition-colors duration-300"
                    >
                      Login
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 scale-x-0 group-hover/auth:scale-x-100 transition-transform duration-300 origin-left" />
                    </Link>
                    <Link
                      href="/register"
                      className="relative group/auth py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-amber-400 transition-colors duration-300"
                    >
                      Register
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 scale-x-0 group-hover/auth:scale-x-100 transition-transform duration-300 origin-left" />
                    </Link>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-white hover:text-blue-100 focus:outline-none"
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 8h16M4 16h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                variants={mobileMenuVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="md:hidden bg-[#0071bc]"
              >
                <div className="px-8 py-10 flex flex-col space-y-8">
                  <div className="space-y-6">
                    {[
                      { name: "About", href: "#about" },
                      { name: "Collection", href: "#product" },
                      { name: "Shop", href: "/produk" },
                    ].map((link) => (
                      <motion.div key={link.name} variants={itemVars}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`${fontJudul.className} text-2xl tracking-[0.2em] text-white uppercase`}
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}
                    <motion.div variants={itemVars}>
                      <Link
                        href="/quiz"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`${fontJudul.className} text-2xl tracking-[0.2em] text-white uppercase`}
                      >
                        Quiz
                      </Link>
                    </motion.div>
                    <motion.div variants={itemVars}>
                      <Link
                        href="/artikel"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`${fontJudul.className} text-2xl tracking-[0.2em] text-white uppercase`}
                      >
                        Artikel
                      </Link>
                    </motion.div>
                  </div>

                  <motion.div
                    variants={itemVars}
                    className="pt-8 border-t border-white/10"
                  >
                    {user ? (
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-white text-[#0071bc] flex items-center justify-center font-bold">
                            {user.image !== "default-avatar.png" ? (
                              <img
                                src={
                                  BASE_URL + `/storage/profiles/${user.image}`
                                }
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              user.name.charAt(0)
                            )}
                          </div>
                          <span className="text-white font-bold tracking-widest uppercase">
                            {user.username}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Link
                            href="/profile"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="px-4 py-3 bg-white/10 rounded-xl text-[10px] font-bold uppercase text-white text-center"
                          >
                            Profile
                          </Link>
                          <Link
                            href="/orders"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="px-4 py-3 bg-white/10 rounded-xl text-[10px] font-bold uppercase text-white text-center"
                          >
                            Orders
                          </Link>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full py-3 border border-red-400/50 rounded-xl text-[10px] font-bold uppercase text-red-300"
                        >
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-4">
                        <Link
                          href="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full py-4 bg-white text-[#0071bc] rounded-xl text-center text-[10px] font-bold uppercase tracking-widest"
                        >
                          Login
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full py-4 border border-white/30 text-white rounded-xl text-center text-[10px] font-bold uppercase tracking-widest"
                        >
                          Register
                        </Link>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* HERO SECTION */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20"
        >
          <motion.div
            style={{ y: heroBgY }}
            className="absolute inset-0 bg-gradient-to-b from-[#FBFBF9] via-stone-50 to-[#F5F5F0] opacity-80 scale-125 origin-top"
          />
          <motion.div
            style={{ y: heroTextY }}
            className="relative z-10 text-center space-y-6 md:space-y-8 max-w-4xl"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="space-y-6"
              >
                <p className="text-stone-400 tracking-[0.5em] uppercase text-xl font-semibold">
                  {heroSlides[currentSlide].tagline}
                </p>
                <h1
                  className={`${fontJudul.className} text-4xl md:text-[130px] uppercase text-stone-900 drop-shadow-sm`}
                >
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="text-stone-500 italic max-w-xl mx-auto text-xl md:text-base">
                  {heroSlides[currentSlide].desc}
                </p>
              </motion.div>
            </AnimatePresence>
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="flex justify-center pt-4"
            >
              <Link
                href="/produk"
                className="group relative inline-flex items-center justify-center px-8 py-3.5 text-xs font-bold tracking-widest text-white uppercase bg-stone-900 rounded-full overflow-hidden shadow-lg transition-all duration-300"
              >
                <span className="relative z-10 group-hover:text-stone-950 transition-colors duration-300">
                  Explore Collection
                </span>
                <div className="absolute inset-0 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-0" />
              </Link>
            </motion.div>
            <div className="flex justify-center space-x-3 pt-8">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 transition-all duration-500 rounded-full ${currentSlide === index ? "w-8 bg-stone-900" : "w-4 bg-stone-300"}`}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* CRAFTING MEMORIES SECTION */}
        <section className="relative py-24 md:py-32 bg-stone-950 text-white px-6 overflow-hidden z-20 w-full">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-amber-500/[0.03] blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-stone-800/30 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-5 space-y-6 text-left">
                <div className="space-y-3">
                  <span className="text-amber-500 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold block">
                    Our Olfactory Art
                  </span>
                  <h2
                    className={`${fontJudul.className} text-3xl md:text-5xl uppercase tracking-tight text-stone-100 leading-tight`}
                  >
                    Crafting <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 italic">
                      Memories
                    </span>
                  </h2>
                </div>
                <p className="text-stone-400 text-sm md:text-base leading-relaxed font-light">
                  Aroma bukan sekadar wewangian; ia adalah mesin waktu tak kasat
                  mata yang mengunci momen, emosi, dan jati diri. Di Evomi, kami
                  meracik setiap partikel esensial untuk menjadi narasi abadi
                  dari setiap langkah perjalanan hidup Anda.
                </p>
              </div>

              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-2xl space-y-4 hover:border-amber-500/20 transition-colors duration-300">
                  <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest block">
                    01 / Selection
                  </span>
                  <h3 className="font-semibold text-stone-100 text-base md:text-lg">
                    Kurasi Bahan Premium
                  </h3>
                  <p className="text-stone-400 text-xs font-light leading-relaxed">
                    Mengekstrak elemen organik terbaik dari berbagai penjuru
                    dunia untuk memastikan kemurnian dan konsistensi aroma di
                    setiap tetesnya.
                  </p>
                </div>

                <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-2xl space-y-4 hover:border-amber-500/20 transition-colors duration-300">
                  <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest block">
                    02 / Alchemy
                  </span>
                  <h3 className="font-semibold text-stone-100 text-base md:text-lg">
                    Seni Keseimbangan Notes
                  </h3>
                  <p className="text-stone-400 text-xs font-light leading-relaxed">
                    Perpaduan presisi yang harmonis antara top, middle, dan base
                    notes untuk menciptakan transisi wewangian yang halus dan
                    memikat.
                  </p>
                </div>

                <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-2xl space-y-4 hover:border-amber-500/20 transition-colors duration-300">
                  <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest block">
                    03 / Resonance
                  </span>
                  <h3 className="font-semibold text-stone-100 text-base md:text-lg">
                    Resonansi Karakter
                  </h3>
                  <p className="text-stone-400 text-xs font-light leading-relaxed">
                    Setiap racikan dirancang secara emosional untuk memperkuat
                    impresi visual, meningkatkan kepercayaan diri, dan
                    mengekspresikan aura unik Anda.
                  </p>
                </div>

                <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-2xl space-y-4 hover:border-amber-500/20 transition-colors duration-300">
                  <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest block">
                    04 / Longevity
                  </span>
                  <h3 className="font-semibold text-stone-100 text-base md:text-lg">
                    Jejak Kehadiran Abadi
                  </h3>
                  <p className="text-stone-400 text-xs font-light leading-relaxed">
                    Konsentrasi konsentrat yang tinggi menghasilkan tingkat
                    sillage dan proyeksi prima, meninggalkan impresi mendalam
                    bahkan setelah Anda berlalu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* IMAGE CAROUSEL SECTION */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="relative py-10 md:py-20 px-6 md:px-16 z-20 bg-[#FBFBF9]"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-16 md:mb-24 space-y-4"
            >
              <h2
                className={`${fontJudul.className} text-3xl md:text-5xl uppercase tracking-tight text-stone-800`}
              >
                Product Characters
              </h2>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-8 md:w-12 h-[1px] bg-stone-200"></div>
                <p className="text-stone-400 tracking-[0.25em] uppercase text-[9px] md:text-xs font-semibold">
                  Collections
                </p>
                <div className="w-8 md:w-12 h-[1px] bg-stone-200"></div>
              </div>
            </motion.div>
            <ImageCarousel />
          </div>
        </motion.section>

        {/* SIGNATURE COLLECTION / PRODUCT GRID */}
        <section
          id="product"
          className="relative py-20 md:py-32 px-4 md:px-8 bg-white border-y border-stone-100 shadow-[0_0_50px_rgba(0,0,0,0.02)] z-20"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-16 md:mb-24 space-y-4"
            >
              <h2
                className={`${fontJudul.className} text-3xl md:text-5xl uppercase tracking-tight text-stone-800`}
              >
                Signature Essence
              </h2>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-8 md:w-12 h-[1px] bg-stone-200"></div>
                <p className="text-stone-400 tracking-[0.25em] uppercase text-[9px] md:text-xs font-semibold">
                  Featured Collection
                </p>
                <div className="w-8 md:w-12 h-[1px] bg-stone-200"></div>
              </div>
            </motion.div>

            {/* Product Grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
            >
              {topFourProducts.map((parfum) => (
                <motion.div
                  key={parfum.id}
                  variants={fadeInUp}
                  className="group flex flex-col h-full"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-50 mb-5 rounded-2xl border border-stone-100 shadow-sm group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-500">
                    <Image
                      src={parfum.image_url || "/img/placeholder.jpg"}
                      alt={parfum.nama}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <Link
                      href={`/produk/${parfum.id}`}
                      className="absolute inset-0 z-10 opacity-0 md:group-hover:opacity-100 bg-stone-900/10 backdrop-blur-[2px] transition-all duration-500 flex items-end p-4"
                    >
                      <div className="w-full bg-white/95 backdrop-blur-md py-3.5 text-[10px] uppercase font-bold tracking-widest text-center text-stone-800 translate-y-4 group-hover:translate-y-0 transition-all duration-500 rounded-xl shadow-lg overflow-hidden relative z-0 group/btn">
                        <div className="absolute inset-0 bg-amber-500 scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left -z-10" />
                        <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-stone-950">
                          Lihat Produk
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="text-center space-y-2 px-2 flex-grow flex flex-col justify-end">
                    <span className="text-[8px] md:text-[10px] text-stone-400 uppercase tracking-[0.2em] font-medium">
                      Unisex • {parfum.ukuran}
                    </span>
                    <h3
                      className={`${fontJudul.className} text-base md:text-xl text-stone-800 uppercase leading-snug line-clamp-1 group-hover:text-amber-800 transition-colors`}
                    >
                      {parfum.nama}
                    </h3>
                    <p className="text-stone-600 font-medium text-[11px] md:text-sm tracking-wide">
                      Rp {Number(parfum.harga_retail).toLocaleString("id-ID")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <Link
                href="/produk"
                className="inline-block border-b border-stone-300 pb-1 text-xs uppercase tracking-widest font-bold text-stone-500 hover:text-stone-900 hover:border-stone-900 transition-all"
              >
                View All Collection
              </Link>
            </motion.div>
          </div>
        </section>

        {/* METRICS / INFOGRAPHIC */}
        <section className="relative py-20 md:py-28 bg-[#FBFBF9] px-6 text-center z-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12"
          >
            {[
              { title: "12H+", desc: "Projection" },
              { title: "Artisan", desc: "Batch" },
              { title: "Recycled", desc: "Glass" },
              { title: "Organic", desc: "Essence" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="group">
                <div
                  className={`${fontJudul.className} text-3xl md:text-4xl mb-2 text-stone-300 group-hover:text-stone-800 transition-colors duration-500`}
                >
                  {item.title}
                </div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-medium">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* TESTIMONIAL SECTION */}
        <section
          ref={testimonialRef}
          className="relative py-24 md:py-32 bg-stone-950 text-white px-6 overflow-hidden z-20"
        >
          <motion.div
            style={{ y: testimonialGlowY }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-stone-800/30 blur-[120px] rounded-full pointer-events-none"
          />

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 md:mb-24 space-y-4"
            >
              <h2
                className={`${fontJudul.className} text-3xl md:text-5xl italic leading-tight text-stone-100 font-light`}
              >
                "Captured in a scent, <br /> defined by the soul."
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <TestimonialSection />
            </motion.div>
          </div>
        </section>

        {/* FOOTER */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative z-20 bg-white pt-20 pb-10 px-6 md:px-8 border-t border-stone-100"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5">
              <h2
                className={`${fontJudul.className} text-3xl mb-5 tracking-widest text-stone-900`}
              >
                EVOMI
              </h2>
              <p className="max-w-sm text-stone-500 text-sm font-light leading-relaxed">
                Menghadirkan pengalaman sensorik melalui kurasi aroma terbaik.
                Dedikasi pada seni artisan fragrance.
              </p>
            </div>
            <div className="md:col-span-3">
              <h4 className="font-bold text-[11px] uppercase tracking-widest mb-6 text-stone-800">
                Contact Us
              </h4>
              <ul className="text-stone-500 space-y-3 text-sm font-light">
                <li className="hover:text-stone-900 transition-colors cursor-pointer">
                  hello@evomi.com
                </li>
                <li>Jakarta, Indonesia</li>
              </ul>
            </div>
            <div className="md:col-span-4">
              <h4 className="font-bold text-[11px] uppercase tracking-widest mb-6 text-stone-800">
                The Newsletter
              </h4>
              <p className="text-stone-400 text-xs mb-4">
                Dapatkan akses eksklusif ke rilis terbaru kami.
              </p>
              <div className="flex border-b border-stone-300 pb-2 focus-within:border-stone-900 transition-colors">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-transparent w-full text-sm outline-none text-stone-800 placeholder-stone-400"
                />
                <button className="text-[10px] uppercase font-bold text-stone-800 hover:text-amber-800 transition-colors tracking-wider">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-around items-center text-center text-[10px] text-stone-400 uppercase tracking-[0.2em] pt-8 border-t border-stone-100 gap-4">
            <div>
              &copy; {mounted ? new Date().getFullYear() : "2026"} EVOMI
              FRAGRANCE HOUSE
            </div>
            <div className="flex space-x-6">
              <SocialIcon
                url="https://instagram.com/evomi"
                network="instagram"
                fgColor="currentColor"
                bgColor="transparent"
                className="hover:text-stone-900 transition-colors"
                style={{ height: 25, width: 25 }}
              />
              <SocialIcon
                url="https://tiktok.com/@evomi"
                network="tiktok"
                fgColor="currentColor"
                bgColor="transparent"
                className="hover:text-stone-900 transition-colors"
                style={{ height: 25, width: 25 }}
              />
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
