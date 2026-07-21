"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, XCircle, LayoutGrid, Sparkles } from "lucide-react";

interface Category {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("rp_custom_categories");
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      const defaultCats: Category[] = [
        { id: "cat-1", name: "GENERAL", isActive: true, createdAt: "18-06-2026" },
        { id: "cat-2", name: "SERVICE", isActive: true, createdAt: "18-06-2026" },
        { id: "cat-3", name: "PRODUCT", isActive: true, createdAt: "18-06-2026" },
        { id: "cat-4", name: "FOOD / BEVERAGE", isActive: true, createdAt: "08-06-2026" },
        { id: "cat-5", name: "AMBIENCE", isActive: true, createdAt: "08-06-2026" },
        { id: "cat-6", name: "STAFF BEHAVIOR", isActive: true, createdAt: "08-06-2026" },
      ];
      setCategories(defaultCats);
      localStorage.setItem("rp_custom_categories", JSON.stringify(defaultCats));
    }
  }, []);

  const saveCategoriesToStorage = (updated: Category[]) => {
    setCategories(updated);
    localStorage.setItem("rp_custom_categories", JSON.stringify(updated));
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const formattedName = newCategoryName.trim().toUpperCase();
    if (categories.some(c => c.name === formattedName)) {
      alert("Category already exists!");
      return;
    }

    const dateStr = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: formattedName,
      isActive: true,
      createdAt: dateStr
    };

    const updated = [...categories, newCat];
    saveCategoriesToStorage(updated);
    setNewCategoryName("");
    setSuccessMsg("Category added successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleToggleStatus = (id: string) => {
    const updated = categories.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c);
    saveCategoriesToStorage(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const updated = categories.filter(c => c.id !== id);
      saveCategoriesToStorage(updated);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1.5 uppercase tracking-wider">
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Config Panel</span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-blue-950 tracking-tight">Review Categories</h2>
        <p className="text-xs text-gray-500 font-semibold mt-1">Manage all categories that can be assigned to generated reviews.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="bg-white/80 backdrop-blur-md border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] h-fit">
          <h3 className="text-sm font-black text-blue-950 mb-4 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Create Category</span>
          </h3>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 tracking-wider">Category Name</label>
              <input
                type="text"
                placeholder="e.g. PACKAGING"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4 py-3 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner placeholder:text-gray-400"
                required
              />
            </div>

            {successMsg && (
              <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{successMsg}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-[14px] transition-all shadow-md shadow-blue-500/10 hover:shadow-lg flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </button>
          </form>
        </div>

        {/* Categories Table List */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-md border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/30 bg-slate-100/30 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="py-4 px-6 w-16">Sr. No.</th>
                  <th className="py-4 px-6">Category Name</th>
                  <th className="py-4 px-6 w-32">Status</th>
                  <th className="py-4 px-6 w-32">Created Date</th>
                  <th className="py-4 px-6 w-24 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150/40 text-xs font-semibold text-blue-800">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 px-6 text-center text-gray-400">
                      No review categories configured.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat, index) => (
                    <tr key={cat.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 px-6 font-mono text-gray-400">{index + 1}</td>
                      <td className="py-4 px-6 font-black text-blue-900 tracking-tight">{cat.name}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(cat.id)}
                          className={`inline-flex items-center text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all ${
                            cat.isActive 
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" 
                              : "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100"
                          }`}
                        >
                          {cat.isActive ? "ACTIVE" : "INACTIVE"}
                        </button>
                      </td>
                      <td className="py-4 px-6 font-mono text-[11px] text-gray-400">{cat.createdAt}</td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleDelete(cat.id)}
                          title="Delete Category"
                          className="p-2 bg-slate-100/80 hover:bg-red-50 hover:text-red-600 text-gray-500 rounded-[14px] border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
