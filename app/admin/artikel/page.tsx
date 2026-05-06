"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { BASE_URL } from "@/src/config/strings";

// Interface berdasarkan kebutuhan artikel Evomi
interface Article {
    id: string;
    title: string;
    content: string;
    author?: string;
    image_url?: string;
    created_at: string;
}

export default function ArticlesMenu() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [successModal, setSuccessModal] = useState({
        isOpen: false,
        message: "",
        type: "" // 'create', 'update', atau 'delete'
    });

    const [formData, setFormData] = useState({
        title: "",
        author: "Evomi Editorial",
        content: ""
    });

    const API_URL = `${BASE_URL}/api/articles`;

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            // Sesuaikan jika API Laravel Anda membungkus data dalam properti 'data'
            setArticles(data.success ? data.data : data);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const showSuccess = (message: string, type: string) => {
        setSuccessModal({ isOpen: true, message, type });
        setTimeout(() => {
            setSuccessModal(prev => ({ ...prev, isOpen: false }));
        }, 3000);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setImageFile(e.target.files[0]);
    };

    const openCreateModal = () => {
        setFormData({ title: "", author: "Evomi Editorial", content: "" });
        setImageFile(null);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (article: Article) => {
        setFormData({
            title: article.title,
            author: article.author || "Evomi Editorial",
            content: article.content
        });
        setEditingId(article.id);
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("author", formData.author);
        data.append("content", formData.content);

        if (imageFile) {
            data.append("image", imageFile);
        }

        // 🔥 PENTING: Tambahkan method spoofing jika sedang mengedit
        if (editingId) {
            data.append("_method", "PUT");
        }

        const url = editingId ? `${API_URL}/${editingId}` : API_URL;

        try {
            const res = await fetch(url, {
                method: "POST", // Tetap gunakan POST untuk mendukung upload file
                body: data,
                // Jangan tambahkan header 'Content-Type', biarkan browser yang mengaturnya secara otomatis
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchArticles();
                showSuccess(
                    editingId ? "Artikel berhasil diperbarui!" : "Artikel baru berhasil dipublikasikan!",
                    editingId ? "update" : "create"
                );
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(`Hapus artikel ini?`)) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchArticles();
                showSuccess("Artikel telah dihapus dari database.", "delete");
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Success Popup Modal */}
            {successModal.isOpen && (
                <div className="fixed bottom-10 right-10 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-2xl p-4 flex items-center gap-4 min-w-[320px] backdrop-blur-lg bg-white/90">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${successModal.type === 'delete' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                            {successModal.type === 'delete' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-1.816c0-1.107-.893-2.003-2.01-2.003h-2.23c-1.107 0-2.01.896-2.01 2.003V6" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-900">Berhasil!</h4>
                            <p className="text-xs text-gray-500">{successModal.message}</p>
                        </div>
                        <button onClick={() => setSuccessModal({ ...successModal, isOpen: false })} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Evomi Journal</h1>
                        <p className="text-sm text-gray-500">Kelola cerita, panduan, dan pembaruan brand untuk pelanggan.</p>
                    </div>
                    <button onClick={openCreateModal} className="bg-black text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all">
                        + Artikel Baru
                    </button>
                </div>

                {/* Tabel Artikel */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="hidden md:table-header-group bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Artikel</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Penulis</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanggal Terbit</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-50 flex flex-col md:table-row-group">
                                {isLoading ? (
                                    <tr><td colSpan={4} className="p-10 text-center text-gray-400">Memuat Jurnal...</td></tr>
                                ) : articles.map((article) => (
                                    <tr key={article.id} className="hover:bg-gray-50/50 transition-colors flex flex-col md:table-row p-4 md:p-0">
                                        <td className="px-0 py-2 md:px-6 md:py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                                                    {article.image_url ? (
                                                        <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 uppercase">Cover</div>
                                                    )}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="text-sm font-bold text-gray-900 truncate max-w-[200px] md:max-w-xs">{article.title}</div>
                                                    <div className="text-[10px] text-gray-400 font-mono">ID: {article.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-0 py-2 md:px-6 md:py-4">
                                            <span className="md:hidden text-[9px] font-bold text-gray-400 uppercase mb-1 block">Penulis</span>
                                            <div className="text-xs text-gray-600 font-medium">{article.author || 'Editorial'}</div>
                                        </td>
                                        <td className="px-0 py-2 md:px-6 md:py-4">
                                            <span className="md:hidden text-[9px] font-bold text-gray-400 uppercase mb-1 block">Terbit Pada</span>
                                            <div className="text-xs text-gray-400">
                                                {new Date(article.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-0 py-4 md:px-6 md:py-4 border-t md:border-t-0 mt-2 md:mt-0 pt-4 md:pt-4">
                                            <div className="flex items-center justify-end gap-4 md:gap-3">
                                                <button onClick={() => openEditModal(article)} className="flex-1 md:flex-none py-2 md:py-0 bg-indigo-50 md:bg-transparent text-indigo-600 hover:text-indigo-800 text-xs font-bold rounded-lg transition-all">Edit</button>
                                                <button onClick={() => handleDelete(article.id)} className="flex-1 md:flex-none py-2 md:py-0 bg-red-50 md:bg-transparent text-red-500 hover:text-red-700 text-xs font-bold rounded-lg transition-all">Hapus</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal CRUD */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden">
                            <form onSubmit={handleSubmit}>
                                <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
                                    <h2 className="text-xl font-bold">{editingId ? 'Edit Artikel' : 'Tulis Cerita Baru'}</h2>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">✕</button>
                                </div>

                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Judul Artikel</label>
                                            <input name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-black" placeholder="Masukan judul..." required />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Penulis</label>
                                            <input name="author" value={formData.author} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-black" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Cover Image</label>
                                            <input type="file" onChange={handleFileChange} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Konten Artikel</label>
                                            <textarea name="content" value={formData.content} onChange={handleInputChange} rows={8} className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-black resize-none" placeholder="Tulis cerita di sini..." required />
                                        </div>
                                    </div>
                                </div>

                                <div className="px-8 py-6 bg-gray-50 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600">Batal</button>
                                    <button type="submit" className="px-8 py-2 bg-black text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all">
                                        {editingId ? 'Update Jurnal' : 'Publish Sekarang'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}