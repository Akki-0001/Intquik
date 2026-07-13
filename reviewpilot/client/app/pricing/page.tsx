"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight, QrCode, Headphones, MessageCircle } from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";

export default function PricingPage() {
  const handlePurchasePlan = (plan: string) => {
    window.location.href = `/checkout?plan=${plan}`;
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-500/20 selection:text-slate-900">
      <LandingNavbar />

      <section className="py-16 px-6 relative overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #0EA5E9 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/[0.03] rounded-full blur-[150px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest bg-white shadow-sm px-3.5 py-1.5 rounded-full border border-sky-100">
              Our Products
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading tracking-tight font-extrabold leading-tight text-slate-900 mb-6">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Growth Engine</span>
            </h1>
            <p className="text-slate-700 max-w-lg text-lg font-medium">
              Three powerful products to accelerate your business. Pick one or
              combine them for maximum impact.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Product 2 — AI Telecalling Agent */}
            <div className="trust-card flex flex-col justify-between relative overflow-hidden group transition-all duration-300 bg-white">
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
                    <span className="text-xs text-slate-400 font-bold">
                      / year
                    </span>
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
                onClick={() => handlePurchasePlan("Premium")}
                className="btn-primary w-full mt-4 shadow-lg hover:shadow-sky-500/25"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>

            {/* Product 1 — Smart AI-Review QR Kit (Best Seller) */}
            <div className="trust-card flex flex-col justify-between relative group transition-all duration-300 scale-[1.05] border-sky-200 shadow-xl shadow-sky-500/10 hover:border-sky-300 bg-white z-10 lg:-mt-4 lg:mb-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-extrabold px-6 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-slate-900/20 z-20 ring-4 ring-white whitespace-nowrap">
                Best Seller
              </div>

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
                    <span className="text-xs text-slate-400 font-bold">
                      / year
                    </span>
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
                onClick={() => handlePurchasePlan("Professional")}
                className="btn-primary w-full mt-4 shadow-lg hover:shadow-sky-500/25"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>

            {/* Product 3 — WhatsApp Chatbot */}
            <div className="trust-card flex flex-col justify-between relative overflow-hidden group transition-all duration-300 bg-white">
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
                    <span className="text-xs text-slate-400 font-bold">
                      / year
                    </span>
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
                onClick={() => handlePurchasePlan("Elite")}
                className="btn-primary w-full mt-4 shadow-lg hover:shadow-sky-500/25"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-slate-400 text-xs font-semibold">
              All plans billed annually • Cancel anytime • Setup assistance included
            </p>
          </div>
        </div>
      </section>

      <footer className="footer-dark py-12 px-6 border-t border-slate-800 text-center text-xs font-bold text-slate-400">
        <p>© 2026 Intuik. All rights reserved.</p>
      </footer>
    </main>
  );
}
