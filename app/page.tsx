import React from "react";
import Head from "next/head";
import Image from 'next/image';

// --------------------------------------------------
// konfigurasi local font pada next js, ask gemini ai
// --------------------------------------------------
import localFont from 'next/font/local';

// Inisialisasi Font Judul / Font Pertama
const fontJudul = localFont({
  src: "./fonts/8 Heavy.ttf", // Ganti dengan nama file kamu
  variable: "--font-brand",
  display: 'swap',
});

// Inisialisasi Font Caption / Font Kedua
const fontCaption = localFont({
  src: "./fonts/Nohemi-Regular.otf", // Ganti dengan nama file kamu
  variable: "--font-body",
  display: 'swap',
});

export default function EvomiLandingPage() {
  return (
    <div>

      {/* Head */}
      <Head>
        <title></title>
        <meta property="og:title" content="title content" key="title" />
      </Head>

      {/* Body */}
      <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">

        {/* NAVBAR */}
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="brand-logo">
              <Image
                src="/img/Logo Evomi.png"
                alt="Evomi Hero Background"
                className="object-cover brightness-50"
                width={120} height={120}
                priority
              />
            </div>
            <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest">
              <a href="#about" className={`${fontJudul.className} text-gray-500 hover:text-stone-700 transition text-[18px] leading-[24px]`}>
                About
              </a>
              <a href="#product" className={`${fontJudul.className} text-gray-500 hover:text-stone-700 transition text-[18px] leading-[24px]`}>
                Product
              </a>
              <a href="#why" className={`${fontJudul.className} text-gray-500 hover:text-stone-700 transition text-[18px] leading-[24px]`}>
                Why Choose Us
              </a>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden">

          {/* Background Overlay */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541605028087-325617a49994?q=80&w=2000')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/70"></div>
          </div>

          <div className="relative z-10 text-white max-w-4xl">

            {/* text caption */}
            <span className={`${fontCaption.className} uppercase tracking-[0.3em] text-sm mb-4 block`}>
              Fragrance House
            </span>

            {/* text judul */}
            <h1 className={`${fontJudul.className} text-5xl md:text-7xl font-serif mb-6`}>EVOMI</h1>

            <h2 className={`${fontCaption.className} text-xl md:text-2xl font-light mb-4 uppercase tracking-widest`}>
              Aroma yang Mendefinisikan Identitasmu
            </h2>

            {/* text caption */}
            <p className={`${fontCaption.className} tracking-widest text-lg opacity-90 mb-10 max-w-2xl mx-auto`}>
              Temukan esensi dirimu dalam botol. Koleksi parfum premium yang
              diracik khusus untuk momen-momen berharga.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 transition uppercase text-xs tracking-widest">
                Shop Now
              </button>
              <button className="bg-white text-stone-900 hover:bg-stone-100 px-8 py-3 transition uppercase text-xs tracking-widest">
                Explore Collection
              </button>
              <button className="border border-white text-white hover:bg-white/10 px-8 py-3 transition uppercase text-xs tracking-widest">
                Discover Your Scent
              </button>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 border-b border-stone-200 pb-20">
            <div>

              {/* text judul */}
              <h3 className={`${fontJudul.className} text-gray-500 text-2xl font-serif mb-4`}>Siapa Evomi?</h3>

              {/* text caption */}
              <p className={`${fontCaption.className} text-stone-600 leading-relaxed text-sm`}>
                Evomi adalah pionir dalam industri wewangian artisan, berfokus
                pada kualitas bahan alami dan kemewahan modern.
              </p>
            </div>
            <div>

              {/* text judul */}
              <h3 className={`${fontJudul.className} text-gray-500 text-2xl font-serif mb-4`}>Filosofi Brand</h3>

              {/* text caption */}
              <p className={`${fontCaption.className} text-stone-600 leading-relaxed text-sm`}>
                Kami percaya aroma adalah memori. Kami menciptakan parfum
                sebagai jembatan antara emosi dan momen yang tak terlupakan.
              </p>
            </div>
            <div>

              {/* text judul */}
              <h3 className={`${fontJudul.className} text-gray-500 text-2xl font-serif mb-4`}>Apa Yang Berbeda?</h3>

              {/* text caption */}
              <p className={`${fontCaption.className} text-stone-600 leading-relaxed text-sm`}>
                Setiap batch kami dibuat secara terbatas (small-batch) untuk
                menjaga eksklusivitas dan kemurnian setiap tetesnya.
              </p>
            </div>
          </div>
        </section>

        {/* PRODUCT SECTION */}
        <section id="product" className="py-24 bg-stone-100 px-6">
          <div className="max-w-7xl mx-auto">

            {/* text judul */}
            <h2 className={`${fontJudul.className} text-gray-500 text-4xl font-serif text-center mb-16 uppercase tracking-widest`}>
              Our Collections
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {
                // Json / String
                [
                  {
                    name: "Velvet Night",
                    scent: "Woody Oriental",
                    price: "Rp 25.000",
                    notes: "Rose, Oud, Amber",
                    story: "Misteri malam yang elegan dalam setiap semprotan.",
                  },
                  {
                    name: "Oceanic Mist",
                    scent: "Fresh Aquatic",
                    price: "Rp 35.000",
                    notes: "Sea Salt, Sage, Bergamot",
                    story: "Kesegaran pagi di pesisir pantai yang menenangkan.",
                  },
                  {
                    name: "Golden Hour",
                    scent: "Floral Gourmand",
                    price: "Rp 23.000",
                    notes: "Vanilla, Jasmine, Sandalwood",
                    story: "Kehangatan matahari terbenam yang manis dan mewah.",
                  },
                ].map((perfume, index) => (
                  <div
                    key={index}
                    className="group bg-white p-6 shadow-sm hover:shadow-xl transition-shadow duration-500"
                  >
                    <div className="aspect-[3/4] bg-stone-200 mb-6 overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center justify-center text-stone-400 italic">
                        Image Placeholder
                      </div>
                    </div>
                    <span className="text-amber-700 text-xs font-bold uppercase tracking-tighter">
                      {perfume.scent}
                    </span>
                    <h3 className={`${fontJudul.className} text-gray-500 text-xl font-serif mt-2`}>{perfume.name}</h3>
                    <p className={`${fontCaption.className} text-xs text-stone-500 mb-4 italic`}>
                      Notes: {perfume.notes}
                    </p>

                    {/* text caption */}
                    <p className={`${fontCaption.className} text-sm text-stone-600 mb-6`}>{perfume.story}</p>
                    <div className="flex justify-between items-center border-t pt-4">
                      <span className="font-bold">{perfume.price}</span>
                      <button className="text-xs uppercase tracking-widest border-b border-stone-900 pb-1 hover:text-amber-700 hover:border-amber-700 transition">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE SECTION */}
        <section id="why" className="py-24 px-6 max-w-5xl mx-auto text-center">

          {/* text judul */}
          <h2 className={`${fontJudul.className} text-gray-500 text-4xl font-serif mb-16 uppercase tracking-widest`}>
            Why Evomi
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: "Long Lasting", desc: "Aroma hingga 12 jam" },
              { title: "Identity Concept", desc: "Karakter wangi unik" },
              { title: "Stylish Design", desc: "Botol premium & estetis" },
              { title: "Versatile", desc: "Cocok untuk segala momen" },
            ].map((item, i) => (
              <div key={i} className="p-4">
                <h4 className="font-bold uppercase text-xs mb-2 tracking-widest text-amber-800">
                  {item.title}
                </h4>
                <p className="text-sm text-stone-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIAL SECTION */}
        <section className="py-24 bg-stone-900 text-white px-6">
          <div className="max-w-7xl mx-auto">

            {/* text judul */}
            <h2 className={`${fontJudul.className} text-3xl font-serif text-center mb-16 italic`}>
              "Aroma adalah bentuk paling kuat dari kenangan."
            </h2>
            <div className="grid md:grid-cols-3 gap-12 text-center">
              {[
                {
                  name: "Clara S.",
                  quote:
                    "Velvet Night adalah aroma paling elegan yang pernah saya miliki.",
                },
                {
                  name: "Dimas R.",
                  quote:
                    "Kesegaran Oceanic Mist tidak tertandingi. Tahan lama seharian.",
                },
                {
                  name: "Sarah W.",
                  quote:
                    "Packaging Evomi sangat mewah, benar-benar brand berkelas.",
                },
              ].map((t, i) => (
                <div key={i} className="space-y-4">

                  {/* text caption */}
                  <p className={`${fontCaption.className} italic text-stone-400`}>"{t.quote}"</p>
                  <p className="uppercase tracking-[0.2em] text-xs font-bold">
                    — {t.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          id="footer"
          className="bg-white py-16 px-6 border-t border-stone-200"
        >
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-sm">
            <div>

              {/* text judul */}
              <h2 className={`${fontJudul.className} text-gray-500 text-2xl font-serif font-bold mb-6 tracking-widest`}>
                EVOMI
              </h2>
              <p className="text-stone-500 italic">
                Redefining Presence through Scent.
              </p>
            </div>
            <div>

              {/* text judul */}
              <h4 className={`${fontJudul.className} text-gray-500 font-bold mb-6 uppercase tracking-widest`}>
                Contact Info
              </h4>
              <p className="text-stone-600">Jakarta, Indonesia</p>
              <p className="text-stone-600">hello@evomi.com</p>
              <p className="text-stone-600">+62 812 3456 789</p>
            </div>
            <div>

              {/* text judul */}
              <h4 className={`${fontJudul.className} text-gray-500 font-bold mb-6 uppercase tracking-widest`}>
                Social Media
              </h4>
              <div className="flex space-x-4 text-stone-600">
                <a href="#" className="hover:text-amber-700">
                  Instagram
                </a>
                <a href="#" className="hover:text-amber-700">
                  TikTok
                </a>
                <a href="#" className="hover:text-amber-700">
                  Twitter
                </a>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-stone-100 text-center text-stone-400 text-xs">
            &copy; {new Date().getFullYear()} EVOMI FRAGRANCE. All Rights
            Reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
