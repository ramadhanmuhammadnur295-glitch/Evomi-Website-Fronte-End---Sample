"use client";

import React, { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import localFont from 'next/font/local';

// Perhatikan path font: karena di folder app/register/, kita naik 2 level ke /public/fonts
const fontJudul = localFont({
    src: "../../public/fonts/8 Heavy.ttf", // Sesuaikan jika perlu
    variable: "--font-brand",
});

const fontCaption = localFont({
    src: "../../public/fonts/Nohemi-Regular.otf", // Sesuaikan jika perlu
    variable: "--font-body",
});

export default function RegisterPage() {
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });

    return (
        <div className={`${fontCaption.variable} ${fontJudul.variable} flex min-h-screen bg-[#FBFBF9] font-sans`}>

            {/* TOMBOL BACK TO HOME (Kanan Atas - Di atas Gambar) */}
            <Link
                href="/"
                className="absolute top-8 right-8 z-50 flex items-center space-x-2 text-white lg:text-stone-400 lg:hover:text-[#0081D1] transition-colors group"
            >
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Back to Home</span>
                <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </Link>

            {/* SISI KIRI: FORM */}
            {/* order-2 lg:order-1 memastikan form di kiri pada desktop, di bawah pada mobile */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 order-2 lg:order-1">
                <div className="w-full max-w-sm space-y-10">
                    <div className="text-center space-y-4">
                        <Link href="/" className="inline-block">
                            <Image src="/img/Logo Evomi.png" alt="Logo" width={100} height={40} className="brightness-0 mx-auto" />
                        </Link>
                        <h1 className={`${fontJudul.className} text-4xl uppercase tracking-tighter text-stone-900`}>Join Us</h1>
                    </div>

                    <form className="space-y-6">
                        <div className="flex flex-col space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">Full Name</label>
                            <input
                                type="text"
                                required
                                className="border-b border-stone-200 bg-transparent py-2 outline-none focus:border-[#0081D1] transition-colors text-stone-900"
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">Email Address</label>
                            <input
                                type="email"
                                required
                                className="border-b border-stone-200 bg-transparent py-2 outline-none focus:border-[#0081D1] transition-colors text-stone-900"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">Password</label>
                            <input
                                type="password"
                                required
                                className="border-b border-stone-200 bg-transparent py-2 outline-none focus:border-[#0081D1] transition-colors text-stone-900"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <button className="w-full bg-stone-900 py-4 text-white uppercase tracking-widest text-xs font-bold hover:bg-[#0081D1] transition-all rounded-full">
                            Create Account
                        </button>
                    </form>

                    <p className="text-center text-sm text-stone-500 font-light">
                        Already a member? <Link href="/login" className="font-bold text-stone-900 underline underline-offset-4 hover:text-[#0081D1]">Sign In</Link>
                    </p>
                </div>
            </div>

            {/* SISI KANAN: IMAGE (Samping Kanan) */}
            {/* order-1 lg:order-2 memastikan gambar di kanan pada desktop, di atas pada mobile */}
            {/* bg-stone-100 ditambahkan sebagai background jika gambar tidak memenuhi layar */}
            <div className="relative hidden lg:block w-1/2 overflow-hidden bg-stone-100 order-1 lg:order-2">
                <Image
                    src="/img/poster/Artboard 2.jpeg"
                    alt="Evomi Mood"
                    fill
                    /* PERUBAHAN DI SINI:object-contain agar gambar full size & tak terpotong */
                    className="object-contain"
                />
                <div className="absolute inset-0 bg-stone-900/5" />
            </div>
        </div>
    );
}