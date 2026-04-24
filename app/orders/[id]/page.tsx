"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { ArrowLeft, Package, Truck, MessageSquare, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

// --- Font Configuration ---
const fontJudul = localFont({
    src: "../../fonts/8 Heavy.ttf",
    variable: "--font-brand",
    display: "swap",
});

const fontCaption = localFont({
    src: "../../fonts/Nohemi-Regular.otf",
    variable: "--font-body",
    display: "swap",
});

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPaying, setIsPaying] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchOrderDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/orders/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                const result = await response.json();
                if (result.status === "success") {
                    setOrder(result.data);
                }
            } catch (error) {
                console.error("Error fetching order detail:", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) fetchOrderDetail();
    }, [params.id, router]);

    const handlePayment = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        setIsPaying(true);
        try {
            const response = await fetch(`http://localhost:8000/api/orders/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify({ status_pembayaran: "success" }),
            });

            const result = await response.json();
            if (result.success) {
                setOrder((prevOrder: any) => ({ ...prevOrder, status_pembayaran: "success" }));
            } else {
                alert("Gagal memproses pembayaran: " + (result.message || "Unknown error"));
            }
        } catch (error) {
            alert("Terjadi kesalahan pada server.");
        } finally {
            setIsPaying(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBF9] text-stone-400 text-[10px] uppercase tracking-[0.3em] animate-pulse">
            Retrieving Order Details...
        </div>
    );

    if (!order) return null;

    return (
        <div className={`${fontCaption.variable} ${fontJudul.variable} min-h-screen bg-[#FBFBF9] font-sans antialiased text-stone-900 selection:bg-amber-100`}>

            {/* NAVBAR - Premium Dark Glassmorphism */}
            <nav className="fixed w-full z-[100] bg-stone-900/80 backdrop-blur-xl border-b border-white/5 h-20 flex items-center px-8">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <Link href="/orders" className="flex items-center space-x-3 text-white/60 hover:text-white transition-all group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">History</span>
                    </Link>
                    <div className={`${fontJudul.className} text-xl tracking-[0.2em] uppercase text-white`}>Evomi</div>
                    <div className="w-10" />
                </div>
            </nav>

            <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
                
                {/* HEADER INFO */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-[1px] bg-stone-300"></div>
                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.4em]">Transaction Record</p>
                        </div>
                        <h1 className={`${fontJudul.className} text-4xl md:text-6xl text-stone-900 uppercase tracking-tighter leading-none`}>
                            #{order.id} <span className="text-stone-300 italic font-light">Details</span>
                        </h1>
                    </motion.div>

                    <div className={`px-6 py-2.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm
                        ${order.status_pembayaran === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                        {order.status_pembayaran === 'success' ? 'Payment Verified' : 'Awaiting Payment'}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT CONTENT: ITEMS & SHIPPING */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* PRODUCT LIST BENTO CARD */}
                        <section className="bg-white rounded-[2.5rem] border border-stone-100 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
                            <div className="p-8 border-b border-stone-50 bg-stone-50/30 flex justify-between items-center">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Curated Selection</h3>
                                <span className="text-[10px] text-stone-300 font-bold uppercase">{order.details?.length} Essence(s)</span>
                            </div>

                            <div className="divide-y divide-stone-50">
                                {order.details?.map((item: any) => (
                                    <div key={item.id} className="p-8 flex items-center space-x-8 group">
                                        <div className="w-20 h-24 bg-stone-50 rounded-2xl overflow-hidden relative shrink-0 border border-stone-100 group-hover:border-stone-200 transition-colors">
                                            <Image
                                                src={item.product?.image_url || "/img/placeholder.png"}
                                                alt={item.product?.nama}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mb-1">SKU: {item.product?.id}</p>
                                            <h4 className={`${fontJudul.className} text-xl text-stone-800 uppercase`}>{item.product?.nama}</h4>
                                            <p className="text-[11px] text-stone-400 font-medium mt-1 uppercase tracking-wider">
                                                {item.jumlah} Unit • Rp {Number(item.harga_saat_beli).toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`${fontJudul.className} text-stone-900 text-lg`}>
                                                Rp {(item.jumlah * Number(item.harga_saat_beli)).toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* SHIPPING & NOTES GRID */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-sm space-y-6">
                                <div className="flex items-center space-x-3">
                                    <Truck size={16} className="text-stone-300" />
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Delivery Address</h3>
                                </div>
                                <p className="text-sm text-stone-600 font-light leading-relaxed italic">"{order.alamat_pengiriman}"</p>
                                <div className="pt-4">
                                    <span className="text-[9px] bg-stone-900 text-white px-3 py-1.5 rounded-full uppercase font-bold tracking-widest">{order.kurir}</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-sm flex flex-col justify-between space-y-6">
                                <div>
                                    <div className="flex items-center space-x-3 mb-6">
                                        <MessageSquare size={16} className="text-stone-300" />
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Artisan Notes</h3>
                                    </div>
                                    <p className="text-xs text-stone-400 italic leading-relaxed">
                                        {order.catatan_pengiriman || "No specific instructions provided for this fragrance shipment."}
                                    </p>
                                </div>
                                <div className="pt-6 border-t border-stone-50 flex items-center justify-between">
                                    <span className="text-[9px] text-stone-300 uppercase font-black tracking-widest">System Record</span>
                                    <span className="text-[9px] text-stone-400 font-mono">UID-{order.id}</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT CONTENT: SUMMARY STICKY */}
                    <div className="lg:col-span-4">
                        <div className="bg-stone-900 rounded-[2.5rem] p-10 text-white sticky top-32 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                            <h3 className={`${fontJudul.className} text-2xl uppercase tracking-widest mb-10 border-b border-white/5 pb-6`}>Investment</h3>

                            <div className="space-y-6 mb-12">
                                <div className="flex justify-between text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">
                                    <span>Subtotal</span>
                                    <span className="text-white">Rp {Number(order.total_harga).toLocaleString("id-ID")}</span>
                                </div>
                                <div className="flex justify-between text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">
                                    <span>Shipping Fee</span>
                                    <span className="text-white">Rp {Number(order.ongkos_kirim).toLocaleString("id-ID")}</span>
                                </div>
                                <div className="h-[1px] bg-white/5 my-2"></div>
                                <div className="flex flex-col space-y-2">
                                    <span className="text-[9px] text-white/30 font-bold uppercase tracking-[0.3em]">Total Amount</span>
                                    <span className={`${fontJudul.className} text-4xl text-amber-200`}>
                                        Rp {(Number(order.total_harga) + Number(order.ongkos_kirim)).toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>

                            {order.status_pembayaran === 'pending' ? (
                                <button
                                    onClick={handlePayment}
                                    disabled={isPaying}
                                    className={`w-full py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 shadow-xl
                                        ${isPaying
                                            ? 'bg-stone-700 text-stone-500 cursor-not-allowed'
                                            : 'bg-white text-stone-900 hover:bg-amber-100 hover:-translate-y-1'
                                        }`}
                                >
                                    {isPaying ? 'Processing...' : 'Authorize Payment'}
                                </button>
                            ) : (
                                <div className="w-full bg-white/5 border border-white/10 py-5 rounded-2xl flex items-center justify-center space-x-3">
                                    <ShieldCheck size={16} className="text-emerald-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Fulfilled</span>
                                </div>
                            )}

                            <p className="mt-10 text-[9px] text-white/20 text-center leading-relaxed font-light uppercase tracking-widest">
                                Thank you for choosing Evomi.<br />The essence of presence.
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}