"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Check, Headphones, QrCode, MessageCircle, ArrowRight } from "lucide-react";
import { getDB } from "@/lib/db";

interface PlanTier {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
}

const PLAN_TIERS: PlanTier[] = [
  {
    name: "AI Telecalling",
    price: "₹14,999",
    period: "year",
    desc: "Human-like AI voice calls",
    features: [
      "Human-Like AI Voice",
      "Smart Appointment Scheduling",
      "Lead Filtering & Scoring",
      "Multi-Lingual (7+ Languages)",
      "CRM Integration",
      "Real-time Analytics"
    ],
  },
  {
    name: "Smart AI-Review",
    price: "₹4,999",
    period: "year",
    desc: "Best for growing businesses",
    features: [
      "Personalized QR & Link",
      "AI SEO-Friendly Suggestions",
      "AI Auto Reply to Reviews",
      "Keywords Dashboard",
      "Printed QR Code Standee",
      "Free Smart NFC Card"
    ],
  },
  {
    name: "WhatsApp Chatbot",
    price: "₹9,999",
    period: "year",
    desc: "24x7 WhatsApp automation",
    features: [
      "24x7 Auto Replies",
      "Smart Lead Qualification",
      "Product Suggestions",
      "Payment & CRM Integration",
      "Multi-Language Support"
    ],
  }
];

export default function PlansPage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<string>("Free");

  useEffect(() => {
    const db = getDB();
    if (db.user) {
      setCurrentPlan(db.user.subscription?.plan || "Free");
    }
  }, []);

  const handleSelectPlan = (planName: string) => {
    router.push(`/checkout?plan=${planName}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1.5 uppercase tracking-wider">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Billing & Plans</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-blue-950 tracking-tight">Subscription Plans</h2>
        <p className="text-xs text-gray-500 font-semibold mt-1">Select and manage your pricing tier to access professional review tools.</p>
      </div>

      {/* Grid of pricing plans matching landing page design */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mt-8">
        {/* Product 1 — AI Telecalling */}
        <div className={`trust-card flex flex-col justify-between relative overflow-hidden group transition-all duration-300 bg-white ${
          currentPlan === "AI Telecalling" ? "border-sky-500 shadow-md ring-1 ring-sky-500" : ""
        }`}>
          {currentPlan === "AI Telecalling" && (
            <div className="absolute top-4 right-4 bg-sky-100 text-sky-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Active Plan
            </div>
          )}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-[14px] bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Headphones className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="text-lg font-heading tracking-tight font-bold text-slate-900 leading-tight">
                  AI Telecalling
                </h3>
                <p className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">
                  Voice AI Agent
                </p>
              </div>
            </div>

            <div className="mb-6 pb-5 border-b border-slate-100">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-sans tracking-tight font-extrabold text-slate-900">
                  ₹14,999
                </span>
                <span className="text-xs text-slate-400 font-bold">/ year</span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">
                Human-like AI voice calls
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Human-Like AI Voice</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Smart Appointment Scheduling</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Lead Filtering & Scoring</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Multi-Lingual (7+ Languages)</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>CRM Integration</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Real-time Analytics</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleSelectPlan("Premium")}
            disabled={currentPlan === "AI Telecalling"}
            className={`w-full mt-4 flex items-center justify-center font-bold px-[24px] py-[12px] rounded-md transition-all ${
              currentPlan === "AI Telecalling" 
                ? "bg-slate-100 text-slate-400 cursor-default" 
                : "bg-sky-600 hover:bg-sky-700 text-white shadow-[0_4px_6px_-1px_rgba(2,132,199,0.2)] hover:shadow-sky-500/25"
            }`}
          >
            <span>{currentPlan === "AI Telecalling" ? "Current Active Plan" : "Get Started"}</span>
            {currentPlan !== "AI Telecalling" && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </div>

        {/* Product 2 — Smart AI-Review QR Kit (Best Seller) */}
        <div className={`trust-card flex flex-col justify-between relative group transition-all duration-300 scale-[1.05] shadow-xl shadow-sky-500/10 hover:border-sky-300 bg-white z-10 lg:-mt-4 lg:mb-4 ${
          currentPlan === "Smart AI-Review" ? "border-sky-500 ring-2 ring-sky-500" : "border-sky-200"
        }`}>
          {currentPlan === "Smart AI-Review" ? (
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-[10px] font-extrabold px-6 py-2 rounded-full uppercase tracking-widest shadow-lg z-20 ring-4 ring-white whitespace-nowrap">
               Active Plan
             </div>
          ) : (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-extrabold px-6 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-slate-900/20 z-20 ring-4 ring-white whitespace-nowrap">
              Best Seller
            </div>
          )}

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 mt-2">
              <div className="w-12 h-12 rounded-[14px] bg-slate-50 border border-slate-100 flex items-center justify-center">
                <QrCode className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="text-lg font-heading tracking-tight font-bold text-slate-900 leading-tight">
                  Smart AI-Review
                </h3>
                <p className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">
                  QR Kit
                </p>
              </div>
            </div>

            <div className="mb-6 pb-5 border-b border-slate-100">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-sans tracking-tight font-extrabold text-slate-900">
                  ₹4,999
                </span>
                <span className="text-xs text-slate-400 font-bold">/ year</span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">
                Best for growing businesses
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Personalized QR & Link</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>AI SEO-Friendly Suggestions</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>AI Auto Reply to Reviews</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Keywords Dashboard</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Printed QR Code Standee</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-sky-600 font-bold">Free Smart NFC Card</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleSelectPlan("Professional")}
            disabled={currentPlan === "Smart AI-Review"}
            className={`w-full mt-4 flex items-center justify-center font-bold px-[24px] py-[12px] rounded-md transition-all ${
              currentPlan === "Smart AI-Review" 
                ? "bg-slate-100 text-slate-400 cursor-default" 
                : "bg-sky-600 hover:bg-sky-700 text-white shadow-[0_4px_6px_-1px_rgba(2,132,199,0.2)] hover:shadow-sky-500/25"
            }`}
          >
            <span>{currentPlan === "Smart AI-Review" ? "Current Active Plan" : "Get Started"}</span>
            {currentPlan !== "Smart AI-Review" && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </div>

        {/* Product 3 — WhatsApp Chatbot */}
        <div className={`trust-card flex flex-col justify-between relative overflow-hidden group transition-all duration-300 bg-white ${
          currentPlan === "WhatsApp Chatbot" ? "border-sky-500 shadow-md ring-1 ring-sky-500" : ""
        }`}>
          {currentPlan === "WhatsApp Chatbot" && (
            <div className="absolute top-4 right-4 bg-sky-100 text-sky-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Active Plan
            </div>
          )}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-[14px] bg-slate-50 border border-slate-100 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="text-lg font-heading tracking-tight font-bold text-slate-900 leading-tight">
                  WhatsApp Chatbot
                </h3>
                <p className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">
                  Automated Engagement
                </p>
              </div>
            </div>

            <div className="mb-6 pb-5 border-b border-slate-100">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-sans tracking-tight font-extrabold text-slate-900">
                  ₹9,999
                </span>
                <span className="text-xs text-slate-400 font-bold">/ year</span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">
                24×7 WhatsApp automation
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>24×7 Auto Replies</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Smart Lead Qualification</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Product Suggestions</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Payment & CRM Integration</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-800 font-semibold">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Multi-Language Support</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleSelectPlan("Elite")}
            disabled={currentPlan === "WhatsApp Chatbot"}
            className={`w-full mt-4 flex items-center justify-center font-bold px-[24px] py-[12px] rounded-md transition-all ${
              currentPlan === "WhatsApp Chatbot" 
                ? "bg-slate-100 text-slate-400 cursor-default" 
                : "bg-sky-600 hover:bg-sky-700 text-white shadow-[0_4px_6px_-1px_rgba(2,132,199,0.2)] hover:shadow-sky-500/25"
            }`}
          >
            <span>{currentPlan === "WhatsApp Chatbot" ? "Current Active Plan" : "Get Started"}</span>
            {currentPlan !== "WhatsApp Chatbot" && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
}
