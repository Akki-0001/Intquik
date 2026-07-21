"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  X
} from "lucide-react";
import { getDB, saveBusinesses, Business, Review, Scan } from "@/lib/db";
import BusinessCard from "@/components/business-card";

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editBizId, setEditBizId] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string>("Free");

  const getPlanLimit = (plan: string) => {
    if (plan === "Starter") return 3;
    if (plan === "Professional") return 10;
    if (plan === "Enterprise") return 999999;
    return 1; // Free
  };
 
  // Form Fields
  const [name, setName] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [yelpUrl, setYelpUrl] = useState("");
  const [color, setColor] = useState("#0D9488"); // Teal default
  const [threshold, setThreshold] = useState(4);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const loadData = async () => {
    const db = getDB();
    setReviews(db.reviews);
    setScans(db.scans);

    if (db.user) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          // We map database _id to id to keep frontend compatible
          const mapped = data.map((b: any) => ({
            id: b._id,
            name: b.name,
            googleReviewUrl: b.googleReviewUrl,
            yelpReviewUrl: b.yelpReviewUrl,
            primaryColor: b.primaryColor,
            ratingThreshold: b.ratingThreshold,
            logoUrl: b.logoUrl,
            createdAt: b.createdAt,
          }));
          setBusinesses(mapped);
          saveBusinesses(mapped);
          return;
        }
      } catch (err) {
        console.error("Backend offline, falling back to local storage", err);
      }
    }
    setBusinesses(db.businesses);
  };

  useEffect(() => {
    loadData();
    const db = getDB();
    if (db.user && db.user.subscription) {
      setUserPlan(db.user.subscription.plan);
    }
  }, []);

  const handleAddBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !googleUrl.trim()) return;

    const db = getDB();
    if (db.user) {
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("googleReviewUrl", googleUrl);
        if (yelpUrl) formData.append("yelpReviewUrl", yelpUrl);
        formData.append("primaryColor", color);
        formData.append("ratingThreshold", threshold.toString());
        if (logoFile) formData.append("logo", logoFile);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (res.ok) {
          const b = await res.json();
          const newBiz: Business = {
            id: b._id,
            name: b.name,
            googleReviewUrl: b.googleReviewUrl,
            yelpReviewUrl: b.yelpReviewUrl,
            primaryColor: b.primaryColor,
            ratingThreshold: b.ratingThreshold,
            logoUrl: b.logoUrl,
            createdAt: b.createdAt,
          };
          const updatedList = [...businesses, newBiz];
          setBusinesses(updatedList);
          saveBusinesses(updatedList);

          // Reset form
          setName("");
          setGoogleUrl("");
          setYelpUrl("");
          setColor("#0D9488");
          setThreshold(4);
          setLogoFile(null);
          setShowAddForm(false);
          return;
        } else if (res.status === 403) {
          const errData = await res.json();
          alert(errData.message || "Upgrade your plan to add more business locations!");
          return;
        }
      } catch (err) {
        console.error("Failed to add business to backend", err);
      }
    }

    // Local Storage Mock fallback if not logged in or backend offline
    const newBiz: Business = {
      id: `biz-${Date.now()}`,
      name: name,
      googleReviewUrl: googleUrl,
      yelpReviewUrl: yelpUrl || undefined,
      primaryColor: color,
      ratingThreshold: threshold,
      createdAt: new Date().toISOString()
    };
    const updatedList = [...businesses, newBiz];
    setBusinesses(updatedList);
    saveBusinesses(updatedList);

    // Reset form
    setName("");
    setGoogleUrl("");
    setYelpUrl("");
    setColor("#0D9488");
    setThreshold(4);
    setLogoFile(null);
    setShowAddForm(false);
  };

  const handleDeleteBusiness = async (id: string) => {
    if (!confirm("Are you sure you want to delete this business profile? This will also remove the review routing link.")) return;

    const db = getDB();
    if (db.user && !id.startsWith("biz-")) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          const updatedList = businesses.filter(b => b.id !== id);
          setBusinesses(updatedList);
          saveBusinesses(updatedList);
          return;
        }
      } catch (err) {
        console.error("Failed to delete business on backend", err);
      }
    }

    const updatedList = businesses.filter(b => b.id !== id);
    setBusinesses(updatedList);
    saveBusinesses(updatedList);
  };

  const handleStartEdit = (biz: Business) => {
    setEditBizId(biz.id);
    setName(biz.name);
    setGoogleUrl(biz.googleReviewUrl);
    setYelpUrl(biz.yelpReviewUrl || "");
    setColor(biz.primaryColor);
    setThreshold(biz.ratingThreshold);
    setLogoFile(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBizId) return;

    const db = getDB();
    if (db.user && !editBizId.startsWith("biz-")) {
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("googleReviewUrl", googleUrl);
        formData.append("yelpReviewUrl", yelpUrl);
        formData.append("primaryColor", color);
        formData.append("ratingThreshold", threshold.toString());
        if (logoFile) formData.append("logo", logoFile);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/${editBizId}`, {
          method: "PUT",
          body: formData,
          credentials: "include",
        });

        if (res.ok) {
          const b = await res.json();
          const updatedBiz: Business = {
            id: b._id,
            name: b.name,
            googleReviewUrl: b.googleReviewUrl,
            yelpReviewUrl: b.yelpReviewUrl,
            primaryColor: b.primaryColor,
            ratingThreshold: b.ratingThreshold,
            logoUrl: b.logoUrl,
            createdAt: b.createdAt,
          };
          const updatedList = businesses.map(item => item.id === editBizId ? updatedBiz : item);
          setBusinesses(updatedList);
          saveBusinesses(updatedList);

          // Reset
          setEditBizId(null);
          setName("");
          setGoogleUrl("");
          setYelpUrl("");
          setColor("#0D9488");
          setThreshold(4);
          setLogoFile(null);
          return;
        }
      } catch (err) {
        console.error("Failed to edit business on backend", err);
      }
    }

    const updatedList = businesses.map(b => {
      if (b.id === editBizId) {
        return {
          ...b,
          name,
          googleReviewUrl: googleUrl,
          yelpReviewUrl: yelpUrl || undefined,
          primaryColor: color,
          ratingThreshold: threshold
        };
      }
      return b;
    });

    setBusinesses(updatedList);
    saveBusinesses(updatedList);
    
    // Reset
    setEditBizId(null);
    setName("");
    setGoogleUrl("");
    setYelpUrl("");
    setColor("#0D9488");
    setThreshold(4);
    setLogoFile(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-blue-950 tracking-tight">Your Businesses</h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">Add, manage, and edit locations and review routing URL integrations.</p>
        </div>
        {!showAddForm && !editBizId && (
          businesses.length >= getPlanLimit(userPlan) ? (
            <Link
              href="/dashboard/settings"
              className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold px-4 py-2.5 rounded-[14px] hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>⚠️ Limit Reached ({businesses.length}/{getPlanLimit(userPlan)}) - Upgrade Plan</span>
            </Link>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-[14px] hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-500/15"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Business</span>
            </button>
          )
        )}
      </div>

      {/* Add / Edit Form Panel */}
      {(showAddForm || editBizId) && (
        <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/85 rounded-3xl p-6 shadow-md relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-blue-950">
              {editBizId ? "Edit Business Profile" : "Add New Business Location"}
            </h3>
            <button 
              onClick={() => {
                setShowAddForm(false);
                setEditBizId(null);
              }}
              className="text-gray-400 hover:text-blue-950"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={editBizId ? handleSaveEdit : handleAddBusiness} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-blue-800 block mb-1.5">Business / Location Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Apex Dental Clinic"
                  className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4 py-2.5 text-xs text-blue-950 focus:outline-none focus:border-blue-600 font-semibold placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-blue-800 block mb-1.5">Google Review Link</label>
                <input
                  type="url"
                  required
                  value={googleUrl}
                  onChange={(e) => setGoogleUrl(e.target.value)}
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4 py-2.5 text-xs text-blue-950 focus:outline-none focus:border-blue-600 font-semibold placeholder:text-gray-400"
                />
                <span className="text-[10px] text-gray-400 font-semibold mt-1 block">Redirect URL when customer gives a positive score.</span>
              </div>

              <div>
                <label className="text-xs font-bold text-blue-800 block mb-1.5">Yelp Review Link (Optional)</label>
                <input
                  type="url"
                  value={yelpUrl}
                  onChange={(e) => setYelpUrl(e.target.value)}
                  placeholder="https://www.yelp.com/biz/..."
                  className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4 py-2.5 text-xs text-blue-950 focus:outline-none focus:border-blue-600 font-semibold placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-blue-800 block mb-2">Primary Funnel Theme Color</label>
                <div className="flex gap-2">
                  {[
                    { hex: "#4F46E5", label: "Indigo" },
                    { hex: "#0D9488", label: "Teal" },
                    { hex: "#E11D48", label: "Rose" },
                    { hex: "#D97706", label: "Amber" },
                    { hex: "#10B981", label: "Emerald" }
                  ].map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setColor(c.hex)}
                      className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-105"
                      style={{ 
                        backgroundColor: c.hex,
                        borderColor: color === c.hex ? '#1E293B' : 'transparent'
                      }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-blue-800 block mb-1.5">Upload Logo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setLogoFile(e.target.files[0]);
                    }
                  }}
                  className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4 py-2 text-xs text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-blue-800 block mb-1.5">
                  Rating Funnel Threshold: <strong className="text-blue-600">{threshold} Stars & Above</strong>
                </label>
                <select
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4 py-2.5 text-xs text-blue-950 focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value={5}>5 Stars only (Redirect 5★ only to Google, others go to feedback)</option>
                  <option value={4}>4 Stars and up (Recommended: Redirect 4★ and 5★ to Google)</option>
                  <option value={3}>3 Stars and up (Redirect 3★, 4★, and 5★ to Google)</option>
                </select>
                <span className="text-[10px] text-gray-400 font-semibold mt-1 block">Scores below this value route to a private internal feedback form.</span>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditBizId(null);
                  }}
                  className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] hover:bg-slate-50 text-gray-500 text-xs font-bold px-4 py-2 rounded-[14px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white text-xs font-bold px-5 py-2 rounded-[14px] hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-all"
                >
                  {editBizId ? "Save Changes" : "Create Profile"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((biz) => (
          <BusinessCard 
            key={biz.id}
            business={biz}
            scansCount={scans.filter(s => s.businessId === biz.id).length}
            reviewsCount={reviews.filter(r => r.businessId === biz.id).length}
            onEdit={handleStartEdit}
            onDelete={handleDeleteBusiness}
          />
        ))}
      </div>

    </div>
  );
}
