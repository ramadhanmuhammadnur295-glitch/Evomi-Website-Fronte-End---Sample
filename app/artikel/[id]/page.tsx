"use client";

// React & Next
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { SocialIcon } from 'react-social-icons';

// Komponen Modal & Config
import QuizModal from "@/components/QuizModal";
import ChatModal from "@/components/ChatModal";
import { BASE_URL } from "@/src/config/strings";

// --- Fonts (Konsisten dengan Landing Page) ---
const fontJudul = localFont({
    src: "../../fonts/8 Heavy.ttf", // Sesuaikan path jika folder bersarang
    variable: "--font-brand",
    display: "swap",
});

const fontCaption = localFont({
    src: "../../fonts/Nohemi-Regular.otf",
    variable: "--font-body",
    display: "swap",
});

// --- Animasi ---
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
    }
};

// --- Data Dummy (Idealnya diambil dari API berdasarkan ID) ---
const articlesData = [
    {
        id: "1",
        title: "Seni Memilih Parfum Sesuai Kepribadian",
        content: `Memilih parfum bukan sekadar mencium aroma yang enak, melainkan tentang menemukan ekstensi dari jiwa Anda. Di Evomi, kami percaya bahwa setiap semprotan adalah pernyataan jati diri. Aroma floral seringkali diasosiasikan dengan kelembutan, sementara aroma woody melambangkan kekuatan dan keteguhan. <br/><br/> Langkah pertama adalah memahami 'base note' yang Anda sukai. Apakah Anda lebih condong ke arah manisnya vanilla atau segarnya citrus? Artikel ini akan memandu Anda mendalami psikologi aroma.`,
        date: "12 Oct 2024",
        category: "GUIDE",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1200",
    },

    // ... tambahkan data lainnya sesuai ID
];

export default function ArtikelDetailPage() {

    const params = useParams();
    const router = useRouter();

    const [article, setArticle] = useState<any>(null); // Ganti logic find article[cite: 5]
    const [isLoading, setIsLoading] = useState(true);

    // States Dasar (Sama dengan Landing Page)
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<{ email: string; name: string; username: string; image: string; } | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Cari artikel berdasarkan ID di URL
    // const article = articlesData.find(a => a.id === params.id) || articlesData[0];

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem("access_token");
        const savedUser = localStorage.getItem("user_data");
        if (token && savedUser) {
            try { setUser(JSON.parse(savedUser)); } catch (error) { console.error(error); }
        }
    }, []);

    useEffect(() => {
        const fetchArticleDetail = async () => {
            try {
                // Fetch data berdasarkan ID dari URL params[cite: 5]
                const response = await fetch(`${BASE_URL}/api/articles/${params.id}`);
                const result = await response.json();
                if (result.success) {
                    setArticle(result.data);
                }
            } catch (error) {
                console.error("Gagal mengambil detail artikel:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) fetchArticleDetail();
    }, [params.id]);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("access_token");
            await fetch(BASE_URL + "/api/logout", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
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
    };

    if (!mounted) return null;

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBF9]">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Loading Journal...</p>
        </div>
    );

    if (!article) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBF9]">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">Artikel Tidak Ditemukan</p>
        </div>
    );

    return (
        <div className={`${fontCaption.variable} ${fontJudul.variable} min-h-screen bg-[#FBFBF9] text-stone-900 font-sans antialiased selection:bg-amber-200 selection:text-stone-900`}>

            {/* MODALS & FAB (Sama dengan Landing Page) */}
            <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
            <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

            {/* NAVBAR (Sama dengan Landing Page) */}
            <nav className="fixed w-full z-[100] bg-[#0071bc]/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
                    <div className="flex-1 flex justify-start">
                        <Link href="/">
                            <Image src="/img/Logo Evomi.png" alt="Evomi Logo" width={90} height={36} className="brightness-0 invert" />
                        </Link>
                    </div>

                    <div className={`hidden md:flex justify-center items-center space-x-10 ${fontJudul.className} text-[13px] tracking-[0.2em] uppercase text-white`}>

                        <Link href="/produk" className="hover:text-blue-200 transition-colors">Shop</Link>
                        <button onClick={() => setIsQuizOpen(true)} className="hover:text-blue-200 uppercase">Quiz</button>
                        <Link href="/artikel" className="text-blue-200">Artikel</Link>
                    </div>

                    <div className="flex-1 flex justify-end items-center space-x-4">
                        {/* Login / User logic tetap sama */}
                        {user ? (
                            <div className="relative">
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-3 border border-white/30 rounded-full p-1 pr-4 bg-white/10">
                                    <div className="w-8 h-8 rounded-full bg-white text-[#0071bc] flex items-center justify-center text-[10px] font-bold overflow-hidden">
                                        {user.image !== 'default-avatar.png' ? <img src={`https://ramadhan.alwaysdata.net/storage/profiles/${user.image}`} alt="Profile" className="w-full h-full object-cover" /> : user.name.charAt(0)}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-white">{user.username}</span>
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="text-[10px] font-bold uppercase text-white">Login</Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* DETAIL CONTENT */}
            <main className="pt-32 pb-20 px-6">
                <article className="max-w-4xl mx-auto">
                    {/* Breadcrumb & Category */}
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center mb-10">
                        <span className="text-[10px] font-bold tracking-[0.3em] text-amber-800 uppercase bg-amber-50 px-4 py-1.5 rounded-full">
                            {article.slug}
                        </span>
                        <h1 className={`${fontJudul.className} text-4xl md:text-6xl uppercase mt-8 mb-6 leading-tight`}>
                            {article.title}
                        </h1>
                        <p className="text-stone-400 text-xs font-bold tracking-widest uppercase">
                            Published on {new Date(article.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} — By {article.author || 'Evomi Editorial'}
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-2xl">
                        <Image
                            src={article.image_url || "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1200"}
                            alt={article.title}
                            fill
                            className="object-cover"
                        />
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="prose prose-stone max-w-none">
                        <div
                            className="text-stone-600 text-lg leading-relaxed font-light space-y-6"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </motion.div>
                </article>
            </main>

            {/* FOOTER */}
            <footer className="bg-white pt-20 pb-10 px-6 border-t border-stone-100">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

                    {/* BAGIAN YANG DIUBAH: Mengganti teks EVOMI dengan Tombol Kembali */}
                    <div className="md:col-span-5 flex items-start">
                        <Link
                            href="/artikel"
                            className="group flex items-center space-x-4 border border-stone-200 px-8 py-4 rounded-full hover:bg-stone-900 hover:border-stone-900 transition-all duration-500"
                        >
                            <div className="relative w-5 h-5 flex items-center justify-center">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    className="text-stone-400 group-hover:text-white transition-colors duration-500"
                                >
                                    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className={`${fontJudul.className} text-[11px] tracking-[0.3em] uppercase text-stone-800 group-hover:text-white transition-colors duration-500`}>
                                Back to Articles
                            </span>
                        </Link>
                    </div>

                    {/* Konten Footer lainnya tetap sama */}
                    <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {/* ... kolom footer lainnya ... */}
                    </div>
                </div>

                <div className="flex justify-around items-center text-[10px] text-stone-400 uppercase tracking-[0.2em] pt-8 border-t">
                    <div>&copy; {new Date().getFullYear()} EVOMI FRAGRANCE HOUSE</div>
                    <div className="flex space-x-4">
                        <SocialIcon url="https://instagram.com/evomi" network="instagram" fgColor="currentColor" bgColor="transparent" style={{ height: 25, width: 25 }} />
                    </div>
                </div>
            </footer>
        </div>
    );
}