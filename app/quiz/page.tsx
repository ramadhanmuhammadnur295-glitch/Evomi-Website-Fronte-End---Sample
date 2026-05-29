"use client";

/* =========================================================================
 * IMPORT DEPENDENCIES
 * - useState        : manajemen state step, skor, dan hasil kuis
 * - Link            : navigasi ke beranda dan halaman produk
 * - localFont       : mendaftarkan font lokal brand Evomi
 * - motion & AnimatePresence : animasi transisi antar step kuis (Framer Motion)
 * ========================================================================= */
import { useState } from "react";
import Link from "next/link";
import localFont from "next/font/local";
import { motion, AnimatePresence } from "framer-motion";

/* =========================================================================
 * KONFIGURASI FONT LOKAL
 * ========================================================================= */
const fontJudul = localFont({
  src: "../fonts/8 Heavy.ttf",
  variable: "--font-brand-judul",
});

/* =========================================================================
 * INTERFACES
 * ========================================================================= */
interface Option {
  text: string;
  desc: string;
  icon: string;
  points: { [key: string]: number };
}

interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: Option[];
}

interface ProductMatch {
  nama: string;
  tagline: string;
  deskripsi: string;
  vibe: string;
  moment: string;
  sillage: string;
  bgGradient: string;
}

/* =========================================================================
 * DICTIONARY (KAMUS DUA BAHASA)
 * Menyimpan seluruh data teks kuis dan produk dalam versi ID dan EN.
 * ========================================================================= */
const dict = {
  id: {
    header: { back: "Kembali ke Beranda" },
    start: {
      tag: "The Evomi Experience",
      title: "Singkap <br /> Jati Diri Anda",
      desc: "Sebuah perjalanan sensorik singkat untuk menemukan karakter wewangian yang paling memanifestasikan jati diri dan energi Anda.",
      btn: "Mulai Pencarian Scent"
    },
    calculating: {
      title: "Menganalisis Intuisi Anda",
      desc: "Algoritma Evomi sedang memetakan kecocokan partikel aroma organik dengan karakter Anda..."
    },
    result: {
      tag: "Aromatic Alignment Match",
      vibe: "Vibe Aura",
      moment: "Momen Sempurna",
      sillage: "Sillage",
      btnShop: "Belanja Koleksi Ini",
      btnRetry: "Ulangi Kuis",
      matchRate: "Kadar Kecocokan",
      matchDesc: "Sifat kimiawi notes ini akan menyatu harmonis dengan temperatur tubuh Anda."
    },
    questions: [
      {
        id: 1,
        title: "Gaya Hidup & Rutinitas",
        subtitle: "Bagaimana Anda menghabiskan waktu luang yang berharga?",
        options: [
          { text: "Quiet Home", desc: "Me-time santai, menikmati ketenangan di dalam ruang pribadi.", icon: "✨", points: { "Peaceful Calm": 3, "Purpose Prestige": 1 } },
          { text: "Exploration", desc: "Mencari inspirasi baru di sudut kota atau alam terbuka.", icon: "🧭", points: { "Rabel Brave": 3, "Peaceful Calm": 1 } },
          { text: "Networking", desc: "Menghadiri acara formal, membangun koneksi, dan produktif.", icon: "💼", points: { "Purpose Prestige": 3, "Rabel Brave": 1 } },
          { text: "Cozy & Creative", desc: "Bersantai di kafe yang tenang, membaca buku, atau melakukan hobi kreatif.", icon: "☕", points: { "Sweet Shy": 3, "Peaceful Calm": 1 } },
        ],
      },
      {
        id: 2,
        title: "Ekspresi Visual",
        subtitle: "Pilih suasana yang paling mendeskripsikan gaya berpakaian Anda.",
        options: [
          { text: "Minimalist", desc: "Warna netral, potongan bersih, fungsional, dan subtle.", icon: "🖤", points: { "Peaceful Calm": 3, "Purpose Prestige": 1 } },
          { text: "Effortless Bold", desc: "Eksperimental, berani tampil beda, dan berkarakter kuat.", icon: "🔥", points: { "Rabel Brave": 3 } },
          { text: "Elegant Luxury", desc: "Rapi, berwibawa, profesional, dan berkelas.", icon: "🏛️", points: { "Purpose Prestige": 3, "Rabel Brave": 1 } },
          { text: "Soft & Feminine", desc: "Warna pastel, sentuhan floral, bahan yang lembut dan manis.", icon: "🌸", points: { "Sweet Shy": 3 } },
        ],
      },
      {
        id: 3,
        title: "Manifestasi Karakter",
        subtitle: "Aura atau impresi apa yang paling ingin Anda pancarkan?",
        options: [
          { text: "Misterius & Intense", desc: "Vibe yang cool, sedikit tertutup, namun sangat memikat.", icon: "🌙", points: { "Rabel Brave": 3 } },
          { text: "Tenang & Dewasa", desc: "Pembawaan yang damai, bijak, dan menenangkan.", icon: "🍃", points: { "Peaceful Calm": 3 } },
          { text: "Karismatik & Pemimpin", desc: "Penuh percaya diri, berambisi, dan memegang kendali.", icon: "👑", points: { "Purpose Prestige": 3 } },
          { text: "Manis & Hangat", desc: "Pembawaan yang pemalu, lembut, namun penuh kehangatan.", icon: "🎀", points: { "Sweet Shy": 3 } },
        ],
      },
    ] as Question[],
    products: {
      "Peaceful Calm": {
        nama: "Peaceful Calm",
        tagline: "Ketenangan Abadi yang Subtle",
        deskripsi: "Aroma yang dirancang untuk Anda yang menghargai kedamaian. Memadukan notes Soft & Powdery yang memberikan kesan bersih, dewasa, dan menenangkan sepanjang hari.",
        vibe: "Tenang, Bersih & Dewasa",
        moment: "Self-care, Work from Home, Casual Read",
        sillage: "Intimate & Sophisticated",
        bgGradient: "from-teal-50 to-white",
      },
      "Rabel Brave": {
        nama: "Rabel Brave",
        tagline: "Keberanian Tak Terbatas",
        deskripsi: "Bagi jiwa petualang yang tidak takut mencuri perhatian. Dengan sentuhan Strong & Spicy, aroma ini memancarkan aura cool, misterius, dan penuh energi malam.",
        vibe: "Cool, Bold & Intense",
        moment: "Night Out, Concert, Late Travel",
        sillage: "Powerful & Long-lasting",
        bgGradient: "from-purple-50 to-white",
      },
      "Purpose Prestige": {
        nama: "Purpose Prestige",
        tagline: "Otoritas & Elegansi Mutlak",
        deskripsi: "Karakter profesional yang karismatik tercermin dalam notes Fresh & Luxury. Mewakili kemewahan yang subtle namun berwibawa di setiap langkah.",
        vibe: "Karismatik, Mewah & Profesional",
        moment: "Business Meeting, Gala Dinner, Formal Events",
        sillage: "Elegant & Memorable Trail",
        bgGradient: "from-amber-50 to-white",
      },
      "Sweet Shy": {
        nama: "Sweet Shy",
        tagline: "Kelembutan Manis yang Memikat",
        deskripsi: "Aroma manis dan lembut untuk Anda yang memiliki karakter pemalu namun penuh kehangatan. Sentuhan Floral dan Fruity yang ringan meninggalkan kesan innocent dan romantis.",
        vibe: "Manis, Lembut & Romantis",
        moment: "First Date, Piknik, Casual Hangout",
        sillage: "Soft & Intimate",
        bgGradient: "from-rose-50 to-white",
      },
    } as { [key: string]: ProductMatch }
  },
  en: {
    header: { back: "Back to Home" },
    start: {
      tag: "The Evomi Experience",
      title: "Unveil Your <br /> Essence",
      desc: "A brief sensory journey to discover the fragrance character that best manifests your true self and energy.",
      btn: "Start Scent Discovery"
    },
    calculating: {
      title: "Analyzing Your Intuition",
      desc: "Evomi's algorithm is mapping the alignment of organic scent particles with your unique character..."
    },
    result: {
      tag: "Aromatic Alignment Match",
      vibe: "Aura Vibe",
      moment: "Perfect Moment",
      sillage: "Sillage",
      btnShop: "Shop This Collection",
      btnRetry: "Retake Quiz",
      matchRate: "Match Rate",
      matchDesc: "The chemical nature of these notes will blend harmoniously with your body temperature."
    },
    questions: [
      {
        id: 1,
        title: "Lifestyle & Routine",
        subtitle: "How do you ideally spend your precious free time?",
        options: [
          { text: "Quiet Home", desc: "Relaxing me-time, enjoying tranquility inside your personal space.", icon: "✨", points: { "Peaceful Calm": 3, "Purpose Prestige": 1 } },
          { text: "Exploration", desc: "Seeking new inspiration in city corners or the open wilderness.", icon: "🧭", points: { "Rabel Brave": 3, "Peaceful Calm": 1 } },
          { text: "Networking", desc: "Attending formal events, building connections, and staying productive.", icon: "💼", points: { "Purpose Prestige": 3, "Rabel Brave": 1 } },
          { text: "Cozy & Creative", desc: "Unwinding at a quiet café, reading books, or engaging in creative hobbies.", icon: "☕", points: { "Sweet Shy": 3, "Peaceful Calm": 1 } },
        ],
      },
      {
        id: 2,
        title: "Visual Expression",
        subtitle: "Choose the atmosphere that best describes your style of dressing.",
        options: [
          { text: "Minimalist", desc: "Neutral colors, clean cuts, functional, and subtle.", icon: "🖤", points: { "Peaceful Calm": 3, "Purpose Prestige": 1 } },
          { text: "Effortless Bold", desc: "Experimental, daring to stand out, with a powerful character.", icon: "🔥", points: { "Rabel Brave": 3 } },
          { text: "Elegant Luxury", desc: "Sharp, authoritative, professional, and high-class.", icon: "🏛️", points: { "Purpose Prestige": 3, "Rabel Brave": 1 } },
          { text: "Soft & Feminine", desc: "Pastel shades, floral touches, soft and sweet materials.", icon: "🌸", points: { "Sweet Shy": 3 } },
        ],
      },
      {
        id: 3,
        title: "Character Manifestation",
        subtitle: "What kind of aura or impression do you most desire to project?",
        options: [
          { text: "Mysterious & Intense", desc: "A cool vibe, slightly reserved, yet immensely captivating.", icon: "🌙", points: { "Rabel Brave": 3 } },
          { text: "Calm & Mature", desc: "A peaceful, wise, and grounding demeanor.", icon: "🍃", points: { "Peaceful Calm": 3 } },
          { text: "Charismatic & Leader", desc: "Full of confidence, ambitious, and firmly in control.", icon: "👑", points: { "Purpose Prestige": 3 } },
          { text: "Sweet & Warm", desc: "A gentle, soft-spoken demeanor filled with true warmth.", icon: "🎀", points: { "Sweet Shy": 3 } },
        ],
      },
    ] as Question[],
    products: {
      "Peaceful Calm": {
        nama: "Peaceful Calm",
        tagline: "Subtle & Eternal Serenity",
        deskripsi: "A scent tailored for those who cherish inner peace. Blending Soft & Powdery notes to yield a clean, mature, and calming impression that lingers gracefully all day.",
        vibe: "Calm, Clean & Mature",
        moment: "Self-care, Work from Home, Casual Read",
        sillage: "Intimate & Sophisticated",
        bgGradient: "from-teal-50 to-white",
      },
      "Rabel Brave": {
        nama: "Rabel Brave",
        tagline: "Limitless Courage",
        deskripsi: "For the adventurous soul unafraid to steal the spotlight. Infused with a Strong & Spicy touch, this scent radiates a cool, mysterious aura full of nocturnal energy.",
        vibe: "Cool, Bold & Intense",
        moment: "Night Out, Concert, Late Travel",
        sillage: "Powerful & Long-lasting",
        bgGradient: "from-purple-50 to-white",
      },
      "Purpose Prestige": {
        nama: "Purpose Prestige",
        tagline: "Absolute Authority & Elegance",
        deskripsi: "A charismatic professional character reflected in Fresh & Luxury notes. It represents a subtle yet authoritative opulence anchoring your every step.",
        vibe: "Charismatic, Luxury & Professional",
        moment: "Business Meeting, Gala Dinner, Formal Events",
        sillage: "Elegant & Memorable Trail",
        bgGradient: "from-amber-50 to-white",
      },
      "Sweet Shy": {
        nama: "Sweet Shy",
        tagline: "Captivating & Sweet Gentleness",
        deskripsi: "A sweet and soft fragrance for those with a reserved yet warm character. Light Floral and Fruity touches leave an innocent, deeply romantic impression.",
        vibe: "Sweet, Soft & Romantic",
        moment: "First Date, Picnic, Casual Hangout",
        sillage: "Soft & Intimate",
        bgGradient: "from-rose-50 to-white",
      },
    } as { [key: string]: ProductMatch }
  }
};

/* =========================================================================
 * ANIMASI VARIANTS
 * ========================================================================= */
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.4, ease: "easeIn" as const } },
};

export default function QuizPage() {
  /* -----------------------------------------------------------------------
   * STATE
   * ----------------------------------------------------------------------- */
  const [lang, setLang] = useState<"id" | "en">("id");
  const t = dict[lang];

  const [step, setStep] = useState<"start" | "questions" | "calculating" | "result">("start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({
    "Peaceful Calm": 0,
    "Rabel Brave": 0,
    "Purpose Prestige": 0,
    "Sweet Shy": 0,
  });
  const [finalMatch, setFinalMatch] = useState<ProductMatch | null>(null);

  const startQuiz = () => {
    setScores({ "Peaceful Calm": 0, "Rabel Brave": 0, "Purpose Prestige": 0, "Sweet Shy": 0 });
    setCurrentQuestionIndex(0);
    setStep("questions");
  };

  const handleOptionSelect = (points: { [key: string]: number }) => {
    const newScores = { ...scores };
    Object.keys(points).forEach((key) => {
      newScores[key] = (newScores[key] || 0) + points[key];
    });
    setScores(newScores);

    if (currentQuestionIndex < t.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setStep("calculating");
      setTimeout(() => {
        let winner = "Peaceful Calm";
        let maxScore = -1;
        Object.keys(newScores).forEach((key) => {
          if (newScores[key] > maxScore) {
            maxScore = newScores[key];
            winner = key;
          }
        });
        setFinalMatch(t.products[winner]);
        setStep("result");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col justify-between overflow-hidden relative selection:bg-amber-500/30">

      {/* ===================================================================
       * HEADER NAVBAR (TERMASUK LANG TOGGLE)
       * =================================================================== */}
      <header className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full border-b border-stone-200">
        <Link href="/" className={`${fontJudul.className} text-xl md:text-2xl tracking-widest text-stone-900 hover:text-amber-500 transition-colors uppercase`}>
          EVOMI
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Language Toggle Component - Renggang ke Kiri dengan md:mr-8 */}
          <div className="flex items-center relative bg-stone-100 border border-stone-200 p-1 rounded-full overflow-hidden md:mr-8">
            <button onClick={() => setLang("id")} className={`relative z-10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${lang === 'id' ? 'text-white' : 'text-stone-600 hover:text-amber-600'}`}>
              ID
            </button>
            <button onClick={() => setLang("en")} className={`relative z-10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${lang === 'en' ? 'text-white' : 'text-stone-600 hover:text-amber-600'}`}>
              EN
            </button>
            <motion.div className="absolute top-1 bottom-1 w-[calc(50%-2px)] bg-amber-500 rounded-full shadow-sm z-0" initial={false} animate={{ left: lang === 'id' ? "4px" : "calc(50% + 2px)" }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
          </div>

          <Link href="/" className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-stone-500 hover:text-stone-900 border-b border-stone-300 hover:border-stone-500 pb-0.5 transition-all">
            {t.header.back}
          </Link>
        </div>
      </header>

      {/* ===================================================================
       * AREA KONTEN UTAMA
       * =================================================================== */}
      <main className="flex-grow flex items-center justify-center px-4 md:px-8 py-12 relative z-10 w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">

          {/* STEP 1: START */}
          {step === "start" && (
            <motion.div key="start-screen" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="text-center max-w-2xl space-y-8">
              <div className="space-y-4">
                <span className="text-amber-500 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold block">{t.start.tag}</span>
                <h1 className={`${fontJudul.className} text-4xl md:text-6xl text-stone-900 leading-tight uppercase`} dangerouslySetInnerHTML={{ __html: t.start.title }} />
              </div>
              <p className="text-stone-600 text-sm md:text-base leading-relaxed font-light max-w-lg mx-auto">
                {t.start.desc}
              </p>
              <div className="pt-4">
                <button onClick={startQuiz} className="bg-stone-900 hover:bg-amber-500 text-white font-bold text-xs md:text-sm uppercase tracking-widest py-4 px-10 rounded-full transition-all duration-300 shadow-xl shadow-stone-200 hover:scale-105">
                  {t.start.btn}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: QUESTIONS */}
          {step === "questions" && (
            <motion.div key={`question-${currentQuestionIndex}`} variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full space-y-10">
              
              <div className="flex justify-between items-center max-w-md mx-auto">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">
                  {lang === "id" ? `Pertanyaan ${currentQuestionIndex + 1} dari ${t.questions.length}` : `Question ${currentQuestionIndex + 1} of ${t.questions.length}`}
                </span>
                <div className="w-32 bg-stone-200 h-[2px] rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / t.questions.length) * 100}%` }} />
                </div>
              </div>

              <div className="text-center space-y-3">
                <span className="text-xs uppercase font-medium tracking-[0.2em] text-stone-500">{t.questions[currentQuestionIndex].title}</span>
                <h2 className="text-xl md:text-3xl font-light text-stone-900 max-w-2xl mx-auto leading-snug">{t.questions[currentQuestionIndex].subtitle}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl mx-auto pt-4">
                {t.questions[currentQuestionIndex].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(option.points)}
                    className="group bg-white hover:bg-stone-50 border border-stone-200 hover:border-amber-500 p-6 md:p-8 text-left rounded-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between items-start space-y-6 shadow-sm hover:shadow-md"
                  >
                    <div className="text-3xl bg-stone-50 p-3 rounded-xl border border-stone-100 group-hover:scale-110 transition-transform duration-300">{option.icon}</div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-stone-900 text-base md:text-lg">{option.text}</h3>
                      <p className="text-stone-600 text-xs leading-relaxed font-light">{option.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: CALCULATING */}
          {step === "calculating" && (
            <motion.div key="calculating-screen" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="text-center space-y-6">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-2 border-amber-500/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-t-amber-500 rounded-full animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium tracking-wide uppercase text-stone-800 animate-pulse">{t.calculating.title}</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">{t.calculating.desc}</p>
              </div>
            </motion.div>
          )}

          {/* STEP 4: RESULT */}
          {step === "result" && finalMatch && (
            <motion.div
              key="result-screen"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`w-full max-w-4xl bg-gradient-to-b ${finalMatch.bgGradient} border border-stone-200 rounded-3xl p-8 md:p-14 shadow-2xl shadow-stone-200/50 relative overflow-hidden`}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center relative z-10">
                
                <div className="md:col-span-7 space-y-6 text-left">
                  <div className="space-y-2">
                    <span className="text-[10px] md:text-xs text-amber-500 uppercase tracking-[0.25em] font-bold block">{t.result.tag}</span>
                    <h2 className={`${fontJudul.className} text-3xl md:text-5xl uppercase tracking-tight text-stone-900 leading-none`}>{finalMatch.nama}</h2>
                    <p className="text-sm font-medium italic text-stone-600">&ldquo;{finalMatch.tagline}&rdquo;</p>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed font-light">{finalMatch.deskripsi}</p>

                  <div className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-stone-400 uppercase tracking-wider text-[10px] font-semibold">{t.result.vibe}</span>
                      <p className="text-stone-800 font-medium">{finalMatch.vibe}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-stone-400 uppercase tracking-wider text-[10px] font-semibold">{t.result.moment}</span>
                      <p className="text-stone-800 font-medium">{finalMatch.moment}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-stone-400 uppercase tracking-wider text-[10px] font-semibold">{t.result.sillage}</span>
                      <p className="text-stone-800 font-medium">{finalMatch.sillage}</p>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row gap-4">
                    <Link href="/produk" className="bg-stone-900 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-xl text-center transition-all duration-300 shadow-lg">
                      {t.result.btnShop}
                    </Link>
                    <button onClick={startQuiz} className="bg-white border border-stone-300 hover:border-stone-500 text-stone-600 hover:text-stone-900 font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-xl transition-all duration-300">
                      {t.result.btnRetry}
                    </button>
                  </div>
                </div>

                <div className="md:col-span-5 flex justify-center">
                  <div className="w-full aspect-[4/5] max-w-[280px] bg-white rounded-2xl border border-stone-200 shadow-xl flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="text-6xl animate-bounce duration-[3000ms]">🧪</div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">{t.result.matchRate}</p>
                      <h4 className={`${fontJudul.className} text-3xl text-stone-800`}>100%</h4>
                    </div>
                    <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                      {t.result.matchDesc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ===================================================================
       * FOOTER
       * =================================================================== */}
      <footer className="relative z-10 py-6 text-center text-[10px] text-stone-400 font-medium uppercase tracking-[0.2em] border-t border-stone-200 w-full">
        &copy; {new Date().getFullYear()} EVOMI FRAGRANCE HOUSE
      </footer>
    </div>
  );
}