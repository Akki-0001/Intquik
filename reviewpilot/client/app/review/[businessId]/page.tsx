"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Star, Check, Globe, Send, MessageSquare, AlertCircle, Smartphone, Copy, Wand2, Sparkles } from "lucide-react";
import { getDB, Business, saveReviews, saveScans, Scan, Review } from "@/lib/db";

export default function PublicReviewFunnel() {
  const params = useParams();
  const businessId = params.businessId as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [step, setStep] = useState<"suggestions" | "feedback" | "google" | "thankyou">("suggestions");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  // AI Suggestions
  const aiSuggestions = [
    "The service was incredibly fast and the staff was super friendly! Highly recommend.",
    "Amazing experience from start to finish. Clean space and great atmosphere.",
    "Best in town! Exceeded all my expectations. Will definitely be coming back."
  ];
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  
  // Feedback Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Scan session recording
  const [scanId, setScanId] = useState<string>("");

  useEffect(() => {
    if (!businessId) return;

    const loadPublicBusiness = async () => {
      // 1. Determine device type
      let device: 'mobile' | 'desktop' | 'tablet' = 'mobile';
      if (typeof window !== 'undefined') {
        const w = window.innerWidth;
        if (w > 1024) device = 'desktop';
        else if (w > 768) device = 'tablet';
      }

      const db = getDB();
      // Try to load business from backend
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/public/${businessId}`);
        if (res.ok) {
          const b = await res.json();
          const biz: Business = {
            id: b._id,
            name: b.name,
            googleReviewUrl: b.googleReviewUrl,
            yelpReviewUrl: b.yelpReviewUrl,
            primaryColor: b.primaryColor,
            ratingThreshold: b.ratingThreshold,
            logoUrl: b.logoUrl,
            isActive: b.isActive !== undefined ? b.isActive : true,
            createdAt: b.createdAt || new Date().toISOString(),
          };
          setBusiness(biz);

          // Track scan on backend
          const scanRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/${b._id}/scan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ device }),
          });

          if (scanRes.ok) {
            const scanData = await scanRes.json();
            setScanId(scanData.scanId);
          }
          return;
        }
      } catch (err) {
        console.error("Backend offline, loading business from local storage", err);
      }

      // Local Storage Fallback
      const biz = db.businesses.find(b => b.id === businessId);
      if (biz) {
        setBusiness(biz);
        const newScanId = `scan-${Date.now()}`;
        setScanId(newScanId);
        
        const newScan: Scan = {
          id: newScanId,
          businessId: biz.id,
          timestamp: new Date().toISOString(),
          device,
          converted: false
        };
        const updatedScans = [...db.scans, newScan];
        saveScans(updatedScans);
      }
    };

    loadPublicBusiness();
  }, [businessId]);

  const submitPublicReviewBackground = async (currentRating: number, commentText: string) => {
    if (!business) return;
    
    // 1. Submit review
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          rating: currentRating,
          customerName: "Anonymous Google User",
          customerEmail: "no-email@google.com",
          comment: commentText,
          status: "public",
        }),
      });

      // 2. Mark scan converted
      if (scanId && !scanId.startsWith("scan-")) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/${business.id}/scan/${scanId}`, {
          method: "PUT",
        });
      }
    } catch (err) {
      console.error("Failed to sync review/scan to backend", err);
    }

    // Local Storage Mock fallback
    const db = getDB();
    const updatedScans = db.scans.map(s => {
      if (s.id === scanId) return { ...s, converted: true };
      return s;
    });
    saveScans(updatedScans);

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      businessId: business.id,
      customerName: "Anonymous Google User",
      customerEmail: "no-email@google.com",
      rating: currentRating,
      comment: commentText,
      status: "public",
      createdAt: new Date().toISOString()
    };
    saveReviews([newReview, ...db.reviews]);
  };

  const handleRatingSubmit = (selectedRating: number) => {
    setRating(selectedRating);
    if (!business) return;

    if (selectedRating >= business.ratingThreshold) {
      setStep("suggestions");
    } else {
      setStep("feedback");
    }
  };

  const handleSuggestionClick = (text: string) => {
    setSelectedSuggestion(text);
    setRating(5);
    // Copy to clipboard for easy pasting in Google
    navigator.clipboard.writeText(text).catch(() => {});
    
    if (business && business.googleReviewUrl) {
      window.open(business.googleReviewUrl, "_blank", "noopener,noreferrer");
    }
    
    setStep("thankyou");
    submitPublicReviewBackground(5, text);
  };

  const handleGoogleRedirect = async () => {
    setStep("thankyou");
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    if (!comment.trim()) {
      setError("Please add details about how we can improve.");
      return;
    }
    
    setSubmitting(true);

    // 1. Submit review to backend
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          rating,
          customerName: name || "Anonymous Customer",
          customerEmail: email || "customer@feedback.com",
          comment,
          status: "private",
        }),
      });

      // 2. Mark scan converted
      if (res.ok && scanId && !scanId.startsWith("scan-")) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/${business.id}/scan/${scanId}`, {
          method: "PUT",
        });
      }
    } catch (err) {
      console.error("Failed to submit review to backend", err);
    }

    // Local Storage fallback
    const db = getDB();
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      businessId: business.id,
      customerName: name || "Anonymous Customer",
      customerEmail: email || "customer@feedback.com",
      rating,
      comment: comment,
      status: "private",
      createdAt: new Date().toISOString()
    };
    saveReviews([newReview, ...db.reviews]);

    const updatedScans = db.scans.map(s => {
      if (s.id === scanId) return { ...s, converted: true };
      return s;
    });
    saveScans(updatedScans);

    setSubmitting(false);
    setStep("thankyou");
  };

  if (!business || business.isActive === false) {
    return (
      <div className="bg-[#FFFFFF] text-[#2B2B2B] min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-4 max-w-sm bg-white border border-[#E2DDD1] rounded-[6px] p-8 shadow-sm">
          <AlertCircle className="w-10 h-10 text-[#2E9E9C] mx-auto" />
          <p className="text-sm font-serif font-bold text-[#283570]">
            {!business ? "Business location not found" : "Review Portal Inactive"}
          </p>
          <p className="text-xs text-[#6B6B6B] font-medium leading-relaxed">
            {!business 
              ? "The QR link you scanned does not seem to match a registered business profile."
              : `The feedback link for "${business.name}" has been temporarily deactivated by the administrator.`
            }
          </p>
        </div>
      </div>
    );
  }

  const primaryColor = business.primaryColor || "#283570";

  return (
    <div className="bg-[#FFFFFF] text-[#2B2B2B] min-h-screen flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-[#F8FAFC]/40 to-transparent pointer-events-none" />

      {/* Main Review Portal Container */}
      <div className="w-full max-w-md bg-white border border-[#E2DDD1] rounded-[6px] overflow-hidden shadow-sm relative">
        
        {/* Color accent bar */}
        <div className="h-1.5 w-full bg-[#283570]" />

        <div className="p-6 sm:p-8 flex flex-col justify-between min-h-[440px]">
          
          {/* STEP 1: INITIAL RATING & AI SUGGESTIONS */}
          {/* STEP 1: AI SUGGESTIONS (SHOWN DIRECTLY) */}
          {step === "suggestions" && (
            <div className="flex-grow flex flex-col text-center space-y-6">
              <div>
                <div 
                  className="w-16 h-16 rounded-[6px] flex items-center justify-center text-[#2E9E9C] text-2xl font-serif font-bold shadow-sm mx-auto mb-4 border border-[#E2DDD1] bg-[#283570]"
                >
                  {business.name[0].toUpperCase()}
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#283570] tracking-tight">{business.name}</h2>
                <p className="text-xs text-[#6B6B6B] font-semibold mt-1">
                  Select a review below to copy and post to Google, or write your own.
                </p>
              </div>

              {/* AI 1-Tap Suggestions */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 justify-center mb-3">
                  <Wand2 className="w-4 h-4 text-[#2E9E9C]" />
                  <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">1-Tap Smart Reviews</span>
                </div>
                
                {aiSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="w-full bg-[#FFFFFF] border border-[#E2DDD1] hover:border-[#2E9E9C] hover:bg-[#F8FAFC]/20 p-4 rounded-[6px] text-left transition-all group flex flex-col gap-3 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-white border border-[#E2DDD1] p-1.5 rounded-[6px] text-[#283570] group-hover:scale-105 transition-transform shrink-0">
                        <Star className="w-3.5 h-3.5 fill-[#2E9E9C] text-[#2E9E9C]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#2B2B2B] leading-relaxed">"{suggestion}"</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full mt-1 bg-[#283570] text-[#2E9E9C] hover:bg-[#2E9E9C] hover:text-[#283570] border border-[#2E9E9C]/20 font-serif font-bold py-2.5 rounded-[6px] text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy & Post to Google</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 py-1">
                <div className="h-px bg-[#E2DDD1] flex-1" />
                <span className="text-[9px] font-bold text-[#6B6B6B] uppercase tracking-widest">or write your own</span>
                <div className="h-px bg-[#E2DDD1] flex-1" />
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSuggestionClick(comment); }} className="space-y-3 pb-2">
                <textarea 
                  rows={2} 
                  required
                  placeholder="I loved the service..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-[#FFFFFF] hover:bg-white border border-[#E2DDD1] rounded-[6px] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] resize-none placeholder:text-[#6B6B6B] font-semibold transition-colors shadow-sm"
                />
                <button
                  type="submit"
                  className="w-full bg-[#283570] hover:bg-[#2E9E9C] text-[#2E9E9C] hover:text-[#283570] border border-[#2E9E9C]/20 font-serif font-bold py-3 rounded-[6px] text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy & Post to Google</span>
                </button>
              </form>

              <div className="mt-auto pt-3 text-[9px] text-[#6B6B6B] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2E9E9C]" />
                <span>Powered by Intuik AI</span>
              </div>
            </div>
          )}

          {/* STEP 2: POSITIVE ROUTING PAGE (GOOGLE LINK REDIRECTION) */}
          {step === "google" && (
            <div className="flex-grow flex flex-col justify-center text-center space-y-8 py-4">
              <div>
                <div className="w-12 h-12 bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] flex items-center justify-center text-[#283570] mx-auto mb-4">
                  <Check className="w-4 h-4 text-[#FF5A3C] shrink-0" />
                </div>
                <h2 className="text-xl font-serif font-bold text-[#283570]">Thank You!</h2>
                <p className="text-xs text-[#6B6B6B] font-semibold mt-2 leading-relaxed">
                  Could you take 10 seconds to share this on Google? It helps our local business immensely!
                </p>
              </div>

              {selectedSuggestion && (
                <div className="bg-[#FFFFFF] border border-[#E2DDD1] p-4 rounded-[6px] text-left relative group">
                  <p className="text-xs text-[#2B2B2B] italic">"{selectedSuggestion}"</p>
                  <div className="absolute -top-3 -right-2 bg-[#283570] text-[#2E9E9C] border border-[#2E9E9C]/30 text-[9px] font-bold px-2 py-0.5 rounded-[6px] flex items-center gap-1 shadow-sm">
                    <Check className="w-4 h-4 text-[#FF5A3C] shrink-0" />
                    Copied to Clipboard!
                  </div>
                </div>
              )}

              <div className="bg-[#FFFFFF] p-4 border border-[#E2DDD1] rounded-[6px] max-w-xs mx-auto w-full">
                <div className="flex justify-center mb-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < rating ? "fill-[#2E9E9C] text-[#2E9E9C]" : "text-[#E2DDD1]"}`} 
                    />
                  ))}
                </div>
                <p className="text-[9px] text-[#6B6B6B] font-bold">Redirecting to Google Business Portal...</p>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={handleGoogleRedirect}
                  className="w-full bg-[#283570] text-[#2E9E9C] hover:bg-[#2E9E9C] hover:text-[#283570] font-serif font-bold py-3 rounded-[6px] text-xs transition-colors flex items-center justify-center gap-1.5 border border-[#2E9E9C]/20"
                >
                  <Globe className="w-4 h-4" />
                  <span>Write a Review on Google</span>
                </button>

                {business.yelpReviewUrl && (
                  <a
                    href={business.yelpReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleGoogleRedirect}
                    className="w-full bg-white border border-[#E2DDD1] text-[#283570] hover:bg-[#FFFFFF] font-serif font-bold py-3 rounded-[6px] text-xs transition-colors block text-center shadow-sm"
                  >
                    Review us on Yelp instead
                  </a>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: PRIVATE FEEDBACK COMPLAINT FORM */}
          {step === "feedback" && (
            <div className="flex-grow flex flex-col justify-between space-y-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#283570] text-center">We value your input</h2>
                <p className="text-xs text-[#6B6B6B] font-semibold mt-1 text-center leading-relaxed">
                  We are sorry your experience wasn't ideal. Please leave details below. Your submission goes directly to our business owner privately so we can make things right.
                </p>
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] p-2.5 rounded-[6px] flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Your Name (Optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FFFFFF] hover:bg-white border border-[#E2DDD1] rounded-[6px] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] placeholder:text-[#6B6B6B] font-semibold transition-colors"
                />
                
                <input 
                  type="email" 
                  placeholder="Your Email (Optional for updates)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FFFFFF] hover:bg-white border border-[#E2DDD1] rounded-[6px] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] placeholder:text-[#6B6B6B] font-semibold transition-colors"
                />

                <textarea 
                  rows={3} 
                  required
                  placeholder="What went wrong and how can we resolve it?"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    setError("");
                  }}
                  className="w-full bg-[#FFFFFF] hover:bg-white border border-[#E2DDD1] rounded-[6px] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] resize-none placeholder:text-[#6B6B6B] font-semibold transition-colors"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#283570] hover:bg-[#2E9E9C] text-[#2E9E9C] hover:text-[#283570] border border-[#2E9E9C]/20 font-serif font-bold py-3 rounded-[6px] text-xs transition-all mt-4 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? "Sending..." : "Submit Private Feedback"}</span>
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: THANK YOU CONFIRMATION SCREEN */}
          {step === "thankyou" && (
            <div className="flex-grow flex flex-col justify-center text-center space-y-6 py-8">
              <div className="w-12 h-12 bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] flex items-center justify-center text-[#283570] mx-auto">
                <Check className="w-4 h-4 text-[#FF5A3C] shrink-0" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-[#283570]">Thank You!</h2>
                <p className="text-xs text-[#6B6B6B] font-semibold mt-2 px-4 leading-relaxed">
                  Your feedback has been successfully recorded. We appreciate your support and help in improving our service.
                </p>
              </div>
              <div className="text-[10px] text-[#6B6B6B] font-bold">
                You can now close this tab.
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
