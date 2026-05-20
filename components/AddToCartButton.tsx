"use client";

// import module
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// String global url
import { BASE_URL } from "@/src/config/strings";

// TODO: Add discount logic here
interface CartProps {
  productId: string;
  productName: string;
  price: number;
  image: string;
  stock: number;
  onSuccess?: () => void;
}

export default function AddToCartButton({
  onSuccess,
  productId,
  productName,
  price,
  image,
  stock,
}: CartProps) {
  const [loading, setLoading] = useState(false);
  
  // State untuk mengontrol modal
  const [modal, setModal] = useState<{ isOpen: boolean; message: string; isAuthError: boolean }>({
    isOpen: false,
    message: "",
    isAuthError: false,
  });

  const router = useRouter();

  // Fungsi menutup modal
  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
    // Jika error karena belum login, arahkan ke halaman login saat modal ditutup
    if (modal.isAuthError) {
      router.push("/login");
    }
  };

  // Fungsi untuk add to cart
  const handleAddToCart = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setModal({
        isOpen: true,
        message: "Silahkan login terlebih dahulu untuk menambah ke keranjang.",
        isAuthError: true,
      });
      return;
    }

    setLoading(true);

    try {
      // Memanggil API Laravel untuk update field 'cart' di DB
      const response = await fetch(BASE_URL + `/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          jumlah: 1, 
        }),
      });

      if (response.ok) {
        if (onSuccess) onSuccess();
      } else {
        const error = await response.json();
        setModal({
          isOpen: true,
          message: error.message || "Gagal menambahkan ke keranjang.",
          isAuthError: false,
        });
      }
    } catch (err) {
      console.error("Cart Error:", err);
      setModal({
        isOpen: true,
        message: "Terjadi kesalahan koneksi. Silakan coba beberapa saat lagi.",
        isAuthError: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tombol Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={stock === 0 || loading}
        className="w-full bg-stone-900 hover:bg-stone-800 text-white py-4 transition-all uppercase tracking-widest text-sm font-medium disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="animate-pulse">Processing...</span>
        ) : stock === 0 ? (
          "Sold Out"
        ) : (
          "Add to Cart"
        )}
      </button>

      {/* Custom Error Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          {/* Modal Container */}
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {/* Ikon Warning */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-stone-900">
                  Pemberitahuan
                </h3>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed">
                {modal.message}
              </p>
            </div>
            <div className="bg-stone-50 px-6 py-4 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-stone-900 hover:bg-stone-800 text-white px-5 py-2 text-sm font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}