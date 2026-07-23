"use client";

import React, { useState } from "react";
import { 
  Bot, 
  Sparkles, 
  Star, 
  CheckCircle, 
  Send, 
  RefreshCcw,
  MessageSquare
} from "lucide-react";

type PendingReview = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  timeAgo: string;
  aiDraft: string | null;
  status: "pending" | "generating" | "drafted" | "published";
};

const MOCK_REVIEWS: PendingReview[] = [
  {
    id: "r1",
    customerName: "Sarah Jenkins",
    rating: 5,
    comment: "Absolutely loved the service here! The team was super helpful and the coffee was the best I've had in the city. Will definitely be coming back.",
    timeAgo: "2 hours ago",
    aiDraft: null,
    status: "pending"
  },
  {
    id: "r2",
    customerName: "Mike R.",
    rating: 4,
    comment: "Good experience overall. Food took a little longer than expected but the manager was very nice about it and gave us a free dessert. Great recovery.",
    timeAgo: "5 hours ago",
    aiDraft: null,
    status: "pending"
  },
  {
    id: "r3",
    customerName: "Elena V.",
    rating: 5,
    comment: "This place never disappoints! Found them through the QR code on the table. 10/10 recommend the avocado toast.",
    timeAgo: "1 day ago",
    aiDraft: null,
    status: "pending"
  }
];

export default function AIRepliesPage() {
  const [reviews, setReviews] = useState<PendingReview[]>(MOCK_REVIEWS);
  const [activeTab, setActiveTab] = useState<"pending" | "resolved">("pending");

  const pendingCount = reviews.filter(r => r.status !== "published").length;

  const generateReply = (id: string) => {
    // 1. Set status to generating
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "generating" } : r));

    // 2. Simulate AI stream delay
    setTimeout(() => {
      const review = reviews.find(r => r.id === id);
      if (!review) return;
      
      let draft = "";
      if (review.rating === 5) {
        draft = `Hi ${review.customerName}, thank you so much for the wonderful 5-star review! We are thrilled to hear you had such a great experience. We look forward to welcoming you back soon!`;
      } else {
        draft = `Hi ${review.customerName}, thank you for your feedback! We're glad you enjoyed your visit and we appreciate your patience. We hope to see you again soon for a perfect 5-star experience.`;
      }
      
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "drafted", aiDraft: draft } : r));
    }, 1500);
  };

  const publishReply = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "published" } : r));
  };

  const updateDraft = (id: string, text: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, aiDraft: text } : r));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1.5 uppercase tracking-wider">
            <Bot className="w-3.5 h-3.5" />
            <span>Google Review Growth System</span>
          </div>
          <h2 className="text-xl font-black text-blue-950 tracking-tight">AI Auto-Replies</h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">Never leave a review unanswered. Let AI draft personalized, SEO-optimized responses instantly.</p>
        </div>
      </div>

      {/* GMB Connection & Auto-Reply Settings */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-[20px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
            <span className="text-xl font-bold text-blue-600">G</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-blue-950">Google My Business Integration</h3>
            <p className="text-xs text-gray-500 font-medium mt-1 max-w-md">Connect your Google account to automatically pull in real reviews and post AI-generated replies directly to your profile.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <button className="bg-white border border-slate-200 text-blue-950 text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            Connect Account
          </button>
          
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-600">Auto-Reply:</span>
            <button 
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              role="switch"
              aria-checked="false"
              onClick={(e) => {
                const isChecked = e.currentTarget.getAttribute('aria-checked') === 'true';
                e.currentTarget.setAttribute('aria-checked', (!isChecked).toString());
                e.currentTarget.classList.toggle('bg-indigo-600');
                e.currentTarget.classList.toggle('bg-slate-200');
                const span = e.currentTarget.querySelector('span');
                if (span) {
                  span.classList.toggle('translate-x-6');
                  span.classList.toggle('translate-x-1');
                }
              }}
            >
              <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs & Stats */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-6">
          <button 
            onClick={() => setActiveTab("pending")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "pending" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-blue-950"}`}
          >
            Needs Reply ({pendingCount})
          </button>
          <button 
            onClick={() => setActiveTab("resolved")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "resolved" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-blue-950"}`}
          >
            Resolved ({reviews.length - pendingCount})
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.filter(r => activeTab === "pending" ? r.status !== "published" : r.status === "published").map(review => (
          <div key={review.id} className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/80 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row gap-6 transition-all">
            
            {/* Customer Review Info */}
            <div className="lg:w-1/2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                    {review.customerName[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-950">{review.customerName}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">{review.timeAgo}</span>
                    </div>
                  </div>
                </div>
                {/* Google Logo Mock */}
                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-500">G</span>
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-100 rounded-[14px] p-4">
                <p className="text-sm text-blue-800 leading-relaxed font-medium">"{review.comment}"</p>
              </div>
            </div>

            {/* AI Reply Section */}
            <div className="lg:w-1/2 bg-indigo-50/50 border border-indigo-100/60 rounded-[14px] p-5 relative overflow-hidden">
              {review.status === "pending" && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-indigo-100">
                    <Bot className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-blue-950">Draft a smart reply</h4>
                    <p className="text-xs font-medium text-gray-500 mt-1 max-w-[250px]">Our AI will analyze the sentiment and draft a perfect, professional response.</p>
                  </div>
                  <button 
                    onClick={() => generateReply(review.id)}
                    className="bg-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-[14px] hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md shadow-indigo-500/20"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Reply</span>
                  </button>
                </div>
              )}

              {review.status === "generating" && (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <RefreshCcw className="w-8 h-8 text-indigo-500 animate-spin" />
                  <p className="text-xs font-bold text-indigo-600 animate-pulse">Analyzing context & drafting response...</p>
                </div>
              )}

              {(review.status === "drafted" || review.status === "published") && (
                <div className="h-full flex flex-col animate-in fade-in zoom-in duration-500">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-100/50 px-2.5 py-1 rounded-lg">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Draft Generated</span>
                    </div>
                    {review.status === "published" && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Published to Google</span>
                      </div>
                    )}
                  </div>
                  
                  <textarea 
                    value={review.aiDraft || ""}
                    onChange={(e) => updateDraft(review.id, e.target.value)}
                    disabled={review.status === "published"}
                    className="flex-1 w-full bg-white border border-indigo-100 rounded-[14px] p-4 text-sm font-medium text-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none mb-4 shadow-inner disabled:bg-slate-50 disabled:text-gray-500"
                  />

                  {review.status === "drafted" && (
                    <div className="flex justify-end gap-3 mt-auto">
                      <button 
                        onClick={() => generateReply(review.id)}
                        className="text-xs font-bold text-gray-500 hover:text-indigo-600 px-3 py-2 transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCcw className="w-3.5 h-3.5" />
                        <span>Regenerate</span>
                      </button>
                      <button 
                        onClick={() => publishReply(review.id)}
                        className="bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-[14px] hover:bg-blue-900 transition-colors flex items-center gap-2 shadow-md shadow-blue-950/10"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish Reply</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        ))}

        {reviews.filter(r => activeTab === "pending" ? r.status !== "published" : r.status === "published").length === 0 && (
          <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-blue-950">You're all caught up!</h3>
            <p className="text-sm font-medium text-gray-500 mt-1">There are no {activeTab} reviews at the moment.</p>
          </div>
        )}

      </div>
    </div>
  );
}
