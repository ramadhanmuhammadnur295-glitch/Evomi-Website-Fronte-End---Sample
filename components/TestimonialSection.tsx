"use client";

// components/TestimonialSection.tsx
import { useState, useEffect } from "react";

type Testimonial = {
  id: number;
  name: string;
  product: string;
  text: string;
  rating: number;
  initials: string;
  color: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Clara S.",
    product: "Peaceful Calm",
    text: "Peaceful Calm adalah aroma paling segar yang pernah saya miliki. Menyatu sempurna dengan kulit dan bertahan sepanjang hari.",
    rating: 5,
    initials: "CS",
    color: "#2D4A3E",
  },
  {
    id: 2,
    name: "Dimas R.",
    product: "Rabel Brave",
    text: "Rabel Brave sangat memikat perhatian di malam hari. Projection-nya luar biasa tahan lama — banyak yang bertanya saya pakai parfum apa.",
    rating: 5,
    initials: "DR",
    color: "#3A2D4A",
  },
  {
    id: 3,
    name: "Sarah W.",
    product: "Purpose Prestige",
    text: "Packaging Evomi sangat mewah, benar-benar brand berkelas internasional dari lokal. Purpose Prestige jadi favorit koleksi saya.",
    rating: 5,
    initials: "SW",
    color: "#4A2D2D",
  },
  {
    id: 4,
    name: "Bagas P.",
    product: "Midnight Oud",
    text: "Aromanya sangat berkarakter dan maskulin. Cocok untuk acara formal, wanginya memberikan kesan elegan dan misterius yang tahan lama.",
    rating: 5,
    initials: "BP",
    color: "#1F2937",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Rating ${rating} dari 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={i < rating ? "text-amber-400" : "text-neutral-500"}
        >
          <path d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.885l-3.09 1.625.59-3.44L2 4.635l3.455-.505L7 1z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialSection() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      goNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [active]);

  const goTo = (index: number) => {
    if (animating || index === active) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(index);
      setAnimating(false);
    }, 300);
  };

  const goNext = () => goTo((active + 1) % testimonials.length);
  const goPrev = () => goTo((active - 1 + testimonials.length) % testimonials.length);

  const visibleTestimonials = [
    testimonials[active],
    testimonials[(active + 1) % testimonials.length],
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        {visibleTestimonials.map((t, idx) => (
          <div
            key={`${t.id}-${active}`}
            className={`relative bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-10 flex flex-col justify-between ${
              idx === 1 ? "hidden md:flex" : "flex"
            }`}
          >
            <div>
              <svg className="absolute top-8 right-8 text-white opacity-10" width="40" height="32" viewBox="0 0 40 32" fill="currentColor">
                <path d="M0 32V19.2C0 8.533 5.333 2.4 16 0l2.4 4C13.067 5.333 10.133 8.267 9.6 12.8H16V32H0zm24 0V19.2C24 8.533 29.333 2.4 40 0l2.4 4c-5.333 1.333-8.267 4.267-8.8 8.8H40V32H24z" />
              </svg>
              <StarRating rating={t.rating} />
              <blockquote className="mt-6 mb-8 text-lg text-stone-200 leading-relaxed font-light italic">
                &ldquo;{t.text}&rdquo;
              </blockquote>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: t.color }}>
                <span className="text-sm font-bold text-white tracking-wide">{t.initials}</span>
              </div>
              <div>
                <p className="text-stone-100 font-bold text-sm uppercase tracking-widest">{t.name}</p>
                <p className="text-stone-500 text-[10px] uppercase tracking-wider">Pembeli {t.product}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigasi */}
      <div className="flex items-center justify-between mt-12 px-2 max-w-2xl mx-auto">
        <button onClick={goPrev} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-white/40 hover:text-white transition-all">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 4L6 8l4 4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className="transition-all duration-500"
              style={{
                width: i === active ? "24px" : "8px",
                height: "6px",
                borderRadius: "3px",
                backgroundColor: i === active ? "#FBFBF9" : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>
        <button onClick={goNext} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-white/40 hover:text-white transition-all">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}