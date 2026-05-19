"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  image_url: string;
  size?: string;
  fontClassName?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image_url,
  size = "M",
  fontClassName = "",
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-50 mb-5 rounded-2xl border border-stone-100 shadow-sm group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-500">
        <Image
          src={image_url || "/img/placeholder.jpg"}
          alt={name}
          fill
          unoptimized
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <Link
          href={`/produk/${id}`}
          className="absolute inset-0 z-10 opacity-0 md:group-hover:opacity-100 bg-stone-900/10 backdrop-blur-[2px] transition-all duration-500 flex items-end justify-center pb-4"
        >
          <div className="w-full bg-white/95 backdrop-blur-md py-3.5 text-[10px] uppercase font-bold tracking-widest text-center text-stone-800 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            View Details
          </div>
        </Link>
      </div>
      <div className="text-center space-y-2 px-2 flex-grow flex flex-col justify-end">
        <span className="text-[8px] md:text-[10px] text-stone-400 uppercase tracking-[0.2em] font-medium">
          Unisex • {size}
        </span>
        <h3 className={`${fontClassName} text-base md:text-xl text-stone-800 uppercase leading-snug line-clamp-1 group-hover:text-amber-800 transition-colors`}>
          {name}
        </h3>
        <p className="text-stone-600 font-medium text-[11px] md:text-sm tracking-wide">
          Rp {Number(price).toLocaleString("id-ID")}
        </p>
      </div>
    </motion.div>
  );
}
