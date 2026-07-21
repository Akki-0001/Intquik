"use client";

import React, { useState } from "react";
import { Star, MessageSquare, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { getDB, Review, saveReviews } from "@/lib/db";

interface ReviewCardProps {
  review: Review;
  businessName?: string;
  onRefresh?: () => void;
}

export default function ReviewCard({ review, businessName, onRefresh }: ReviewCardProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const handleArchive = async () => {
    setIsArchiving(true);
    const db = getDB();
    if (db.user && !review.id.startsWith("rev-")) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${review.id}/archive`, {
          method: "PUT",
          credentials: "include",
        });
      } catch (err) {
        console.error("Failed to archive review on backend", err);
      }
    }
    
    // For local fallback or fast UI update
    const updatedReviews = db.reviews.filter(r => r.id !== review.id);
    saveReviews(updatedReviews);
    if (onRefresh) onRefresh();
    setIsArchiving(false);
  };

  const handleSaveReply = async () => {
    const db = getDB();
    if (db.user && !review.id.startsWith("rev-")) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${review.id}/reply`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reply: replyText }),
          credentials: "include",
        });
      } catch (err) {
        console.error("Failed to save reply on backend", err);
      }
    }

    const updatedReviews = db.reviews.map(r => {
      if (r.id === review.id) {
        return { ...r, reply: replyText };
      }
      return r;
    });
    saveReviews(updatedReviews);
    setIsReplying(false);
    setReplyText("");
    if (onRefresh) onRefresh();
  };

  const handleGenerateAIReply = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let draft = "";
      const name = review.customerName.split(" ")[0];
      if (review.rating >= 4) {
        draft = `Hi ${name}, thank you so much for the wonderful ${review.rating}-star review! We are absolutely thrilled to hear you had a great experience and we look forward to welcoming you back soon!`;
      } else {
        draft = `Hi ${name}, thank you for taking the time to share your feedback. We are truly sorry to hear that your experience did not meet your expectations. We'd love to learn more and make this right. Please reach out to our team directly.`;
      }
      setReplyText(draft);
      setIsGenerating(false);
    }, 700);
  };

  return (
    <div 
      className={`bg-white/80 border p-6 rounded-[28px] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.015)] relative group ${
        review.rating >= 4 
          ? "border-slate-200/60 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/[0.015]" 
          : "border-slate-200/60 hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/[0.015]"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        
        {/* Left: Star rating & Customer Info */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${
                    i < review.rating ? "fill-amber-450 text-amber-450" : "text-slate-200"
                  }`} 
                />
              ))}
            </div>

            {businessName && (
              <span className="text-[9px] text-blue-650 font-black uppercase font-mono bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/50 tracking-wider">
                {businessName}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-blue-950">
              <span>{review.customerName}</span>
              <span className="text-gray-400 font-medium font-mono text-[10px]">({review.customerEmail})</span>
            </div>
            <p className="text-xs md:text-sm text-slate-650 leading-relaxed italic font-medium mt-1.5 pl-2 border-l-2 border-slate-200/80">
              "{review.comment || "No comment provided."}"
            </p>
          </div>

          {/* Reply rendering */}
          {review.reply && !isReplying && (
            <div className="bg-slate-50 border border-slate-100 rounded-[14px] p-4 mt-4 flex items-start gap-3 shadow-inner">
              <MessageSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[9px] text-gray-400 font-bold">
                  <span className="font-black uppercase tracking-wider text-gray-500">Response Sent</span>
                  <span>•</span>
                  <span>Owner</span>
                </div>
                <p className="text-xs text-slate-650 mt-1 italic font-medium">
                  "{review.reply}"
                </p>
                <button
                  onClick={() => {
                    setIsReplying(true);
                    setReplyText(review.reply || "");
                  }}
                  className="text-[10px] text-blue-600 hover:text-blue-700 hover:underline mt-2.5 font-bold transition-colors"
                >
                  Edit Reply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Action Badges & Buttons */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 shrink-0 self-stretch md:self-auto pt-1 md:pt-0">
          
          <div className="space-y-1.5 text-left md:text-right">
            {/* Status Badge */}
            {review.status === "public" ? (
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                Public Redirect
              </span>
            ) : (
              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                Private Intercept
              </span>
            )}
            <div className="text-[9px] text-gray-400 font-mono font-bold mt-1">
              {new Date(review.createdAt).toLocaleDateString()} at {new Date(review.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex flex-wrap items-center justify-end md:justify-start gap-2 md:mt-4">
            {!review.reply && !isReplying && (
              <button
                onClick={() => {
                  setIsReplying(true);
                  setReplyText("");
                }}
                className="bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/80 hover:bg-slate-100 text-[11px] font-bold px-3 py-1.5 rounded-[14px] text-blue-800 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-405" />
                <span>Reply</span>
              </button>
            )}
            <button
              onClick={handleArchive}
              disabled={isArchiving}
              className="bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-[11px] font-bold px-3 py-1.5 rounded-[14px] text-slate-600 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{isArchiving ? "Done..." : "Mark Done"}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Inline Replying Interface */}
      {isReplying && (
        <div className="bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/40 rounded-[14px] p-4 mt-4 space-y-3.5 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-blue-650 font-bold">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Compose Response</span>
            </div>
            <button
              onClick={handleGenerateAIReply}
              disabled={isGenerating}
              className="text-[10px] font-bold text-white bg-blue-650 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-all shadow-md shadow-blue-500/10 active:scale-95 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 fill-white stroke-none" />
              <span>{isGenerating ? "Generating..." : "AI Generate"}</span>
            </button>
          </div>

          <textarea
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Thank the customer or address their concern..."
            className="w-full bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/80 rounded-[14px] p-3 text-xs text-blue-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all resize-none font-semibold leading-relaxed"
          />

          <div className="flex justify-end gap-2.5">
            <button
              onClick={() => {
                setIsReplying(false);
                setReplyText("");
              }}
              className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] hover:bg-slate-50 text-gray-500 text-[10px] font-bold px-4 py-2 rounded-[14px] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveReply}
              className="bg-blue-600 text-white text-[10px] font-bold px-4 py-2 rounded-[14px] hover:bg-blue-700 flex items-center gap-1.5 shadow-md shadow-blue-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="w-3 h-3" />
              <span>Save & Submit</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
