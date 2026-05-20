"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export interface Article {
    id: string | number;
    title: string;
    image_url?: string;
    slug?: string;
    created_at: string;
    author?: string;
    content: string;
}

interface ArticleCardProps {
    article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
    // --- HELPER FUNCTION: Membersihkan HTML dari React Quill ---
    const getExcerpt = (htmlContent: string, maxLength: number = 120) => {
        if (!htmlContent) return "";

        const plainText = htmlContent
            .replace(/<[^>]*>?/gm, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        return plainText.length > maxLength
            ? plainText.substring(0, maxLength) + "..."
            : plainText;
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            // Penambahan style card (bg-white, padding, rounded besar, shadow saat hover)
            className="group cursor-pointer bg-white p-4 rounded-[2rem] border border-stone-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-stone-200 transition-all duration-500 flex flex-col h-full"
        >
            <Link href={`/artikel/${article.id}`} className="block flex-grow flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6 bg-stone-50 border border-stone-100">
                    <Image
                        src={article.image_url || "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    {article.slug && (
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                            <span className="text-[9px] font-bold tracking-widest text-stone-800 uppercase">{article.slug}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-4 px-2 flex-grow flex flex-col">
                    <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-stone-200 group-hover:bg-amber-700 transition-colors"></span>
                            {new Date(article.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-tighter italic">
                            {article.author || 'Evomi Editorial'}
                        </span>
                    </div>

                    <h3 className="text-xl md:text-2xl text-stone-800 uppercase leading-snug group-hover:text-amber-800 transition-colors font-bold tracking-tight line-clamp-2">
                        {article.title}
                    </h3>

                    {/* Flex-grow agar tombol 'Read Story' selalu terdorong ke bawah jika deskripsi pendek */}
                    <p className="text-stone-500 text-sm leading-relaxed font-light line-clamp-3 flex-grow">
                        {getExcerpt(article.content)}
                    </p>

                    <div className="pt-4 mt-auto">
                        <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-800 group-hover:text-amber-800 transition-all">
                            Read Story
                            <svg className="w-4 h-4 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}