"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  X,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";
import { getDB, Review, Business } from "@/lib/db";
import ReviewCard from "@/components/review-card";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBiz, setSelectedBiz] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedType, setSelectedType] = useState("all"); // all, public, private
 
  const loadData = async () => {
    const db = getDB();
    if (db.user) {
      try {
        const bizRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses`, {
          credentials: "include",
        });
        const revRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
          credentials: "include",
        });

        if (bizRes.ok && revRes.ok) {
          const businessesData = await bizRes.json();
          const reviewsData = await revRes.json();

          const mappedBiz = businessesData.map((b: any) => ({
            id: b._id,
            name: b.name,
            googleReviewUrl: b.googleReviewUrl,
            yelpReviewUrl: b.yelpReviewUrl,
            primaryColor: b.primaryColor,
            ratingThreshold: b.ratingThreshold,
            logoUrl: b.logoUrl,
            createdAt: b.createdAt,
          }));

          const mappedReviews = reviewsData.map((r: any) => ({
            id: r._id,
            businessId: r.businessId?._id || r.businessId,
            customerName: r.customerName,
            customerEmail: r.customerEmail,
            rating: r.rating,
            comment: r.comment,
            status: r.status,
            reply: r.reply,
            createdAt: r.createdAt,
          }));

          setReviews(mappedReviews);
          setBusinesses(mappedBiz);
          return;
        }
      } catch (err) {
        console.error("Backend offline, falling back to local storage", err);
      }
    }

    setReviews(db.reviews);
    setBusinesses(db.businesses);
  };
 
  useEffect(() => {
    loadData();
  }, []);

  // Filter Logic
  const filteredReviews = reviews.filter(r => {
    const matchSearch = 
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchBiz = selectedBiz === "all" || r.businessId === selectedBiz;
    
    const matchRating = selectedRating === "all" || r.rating.toString() === selectedRating;
    
    const matchType = 
      selectedType === "all" || 
      (selectedType === "public" && r.status === "public") ||
      (selectedType === "private" && r.status === "private");

    return matchSearch && matchBiz && matchRating && matchType;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-blue-950 tracking-tight">Review Feed</h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">Monitor all positive Google review redirects and handle private customer concerns.</p>
        </div>
        
        <button
          onClick={() => {
            alert("Exporting reviews to CSV format...");
            const headers = "ID,Customer Name,Email,Rating,Type,Comment,Date\n";
            const rows = filteredReviews.map(r => 
              `"${r.id}","${r.customerName}","${r.customerEmail}",${r.rating},"${r.status}","${r.comment.replace(/"/g, '""')}","${r.createdAt}"`
            ).join("\n");
            
            const blob = new Blob([headers + rows], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('download', `intuik-export-${Date.now()}.csv`);
            a.click();
          }}
          className="bg-white border border-slate-205 text-slate-705 text-xs font-bold px-4 py-2.5 rounded-[14px] hover:bg-slate-50 transition-colors flex items-center gap-1.5 self-start sm:self-center shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4 text-blue-600" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/80 rounded-3xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shadow-sm">
        
        {/* Search */}
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1.5">Search Keywords</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Name, email, comment..."
              className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] pl-9 pr-4 py-2 text-xs text-blue-950 focus:outline-none focus:border-blue-600 font-semibold placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Business Select */}
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1.5">Business Location</label>
          <select
            value={selectedBiz}
            onChange={(e) => setSelectedBiz(e.target.value)}
            className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-3 py-2 text-xs text-blue-950 focus:outline-none focus:border-blue-600 font-semibold"
          >
            <option value="all">All Locations</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Rating Select */}
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1.5">Star Rating</label>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-3 py-2 text-xs text-blue-950 focus:outline-none focus:border-blue-600 font-semibold"
          >
            <option value="all">All Stars</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {/* Status Select */}
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1.5">Review Channel</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-3 py-2 text-xs text-blue-950 focus:outline-none focus:border-blue-600 font-semibold"
          >
            <option value="all">All Channels</option>
            <option value="public">Public (Redirected)</option>
            <option value="private">Private (Feedback Form)</option>
          </select>
        </div>

      </div>

      {/* Reviews feed grid */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-12 text-center">
            <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-500">No reviews found matching filters</p>
            <p className="text-xs text-gray-400 font-semibold mt-1">Try resetting the search terms or location dropdowns.</p>
          </div>
        ) : (
          filteredReviews.map((review) => {
            const biz = businesses.find(b => b.id === review.businessId);
            return (
              <ReviewCard 
                key={review.id} 
                review={review} 
                businessName={biz?.name}
                onRefresh={loadData}
              />
            );
          })
        )}
      </div>

    </div>
  );
}
