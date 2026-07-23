"use client";

import React from "react";
import Link from "next/link";
import {
  Mic,
  Headphones,
  CalendarCheck,
  Filter,
  Languages,
  Globe,
  BarChart3,
  MessageCircle,
  Zap,
  Sparkles,
  CreditCard,
  Bot,
  Award,
  QrCode,
  Search,
  KeyRound,
  MessageSquare,
  Smartphone,
  Check,
  ArrowRight,
} from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";

export default function FeaturesPage() {
  const handlePurchasePlan = (plan: string) => {
    window.location.href = `/checkout?plan=${plan}`;
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-600 font-sans selection:bg-sky-500 selection:text-white">
      <LandingNavbar />

      <div className="pt-32 pb-20 px-6 max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <span className="eyebrow inline-block mb-4">Detailed Features</span>
          <h1 className="text-5xl md:text-7xl font-heading text-slate-900 font-extrabold tracking-tighter leading-tight">
            Everything You Need to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600 drop-shadow-sm">Scale Automatically</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto mt-6 text-lg">
            Dive deep into our three core product offerings. Discover how our AI, WhatsApp bots, and Smart QR kits work together to grow your business.
          </p>
        </div>

        {/* 1. Smart AI-Review QR Kit */}
        <section id="smart-qr" className="bg-white rounded-[14px] shadow-[0_4px_20px_rgba(20,20,43,0.06)] p-8 md:p-12 mb-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3">
              <span className="eyebrow mb-2 inline-block">Best Seller</span>
              <h2 className="text-4xl font-heading text-slate-900 font-extrabold tracking-tight mb-4">Smart AI-Review QR Kit</h2>
              <p className="mb-6">
                Everything you need to dominate Google Reviews. Personalized QR codes, AI-generated SEO reviews, keyword dashboard, auto-replies, and a free NFC card.
              </p>
              <div className="mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-heading text-slate-900 font-extrabold">₹4,999</span>
                  <span className="text-sm font-bold">/ year</span>
                </div>
              </div>
              <button onClick={() => handlePurchasePlan("Professional")} className="btn-primary w-full">
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><QrCode className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">Personalized QR & Link</h3>
                <p className="text-sm">Get a custom-branded QR code tailored to your Google Business Profile. Zero friction for customers.</p>
              </div>
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><Search className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">AI SEO-Friendly Reviews</h3>
                <p className="text-sm">AI generates keyword-rich prompts that customers can post — boosting your ranking organically.</p>
              </div>
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><KeyRound className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">Keywords Dashboard</h3>
                <p className="text-sm">Update and fine-tune keywords. Control exactly which search terms your business dominates.</p>
              </div>
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><MessageSquare className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">AI Auto Reply</h3>
                <p className="text-sm">Automatically generates professional replies for every new Google review.</p>
              </div>
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><Award className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">Printed QR Standee</h3>
                <p className="text-sm">Premium acrylic standee shipped to your location, ready for the checkout counter.</p>
              </div>
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><Smartphone className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">Free Smart NFC Card</h3>
                <p className="text-sm">Customers tap their phone, and your Google review portal opens instantly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. AI Telecalling Agent */}
        <section id="telecalling" className="bg-white rounded-[14px] shadow-[0_4px_20px_rgba(20,20,43,0.06)] p-8 md:p-12 mb-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3">
              <span className="eyebrow mb-2 inline-block">Voice AI Technology</span>
              <h2 className="text-4xl font-heading text-slate-900 font-extrabold tracking-tight mb-4">AI Telecalling Agent</h2>
              <p className="mb-6">
                Automate outbound calls, follow-ups, and appointment booking with our AI voice agent that speaks naturally in Hinglish, Hindi, English, and regional languages.
              </p>
              <div className="mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-heading text-slate-900 font-extrabold">₹14,999</span>
                  <span className="text-sm font-bold">/ year</span>
                </div>
              </div>
              <Link href="/register" className="btn-primary w-full text-center">
                Get Started <ArrowRight className="w-4 h-4 ml-2 inline" />
              </Link>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><Headphones className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">Human-Like AI Voice</h3>
                <p className="text-sm">Natural and conversational — zero robotic tone. Customers won't notice the difference.</p>
              </div>
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><CalendarCheck className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">Smart Scheduling</h3>
                <p className="text-sm">AI automatically books, reschedules, and confirms appointments with calendar sync.</p>
              </div>
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><Filter className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">Lead Filtering</h3>
                <p className="text-sm">Qualifies leads during conversations, forwarding only hot prospects to your team.</p>
              </div>
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><Languages className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">Multi-Lingual</h3>
                <p className="text-sm">Hinglish, Hindi, English, and regional languages — auto adapts mid-call.</p>
              </div>
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><Globe className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">CRM Integration</h3>
                <p className="text-sm">Syncs call logs and lead data directly into your existing workflow.</p>
              </div>
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><BarChart3 className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">Real-time Analytics</h3>
                <p className="text-sm">Live dashboards for call success rate, conversion ratios, and sentiment analysis.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WhatsApp Chatbot */}
        <section id="whatsapp" className="bg-white rounded-[14px] shadow-[0_4px_20px_rgba(20,20,43,0.06)] p-8 md:p-12 mb-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3">
              <span className="eyebrow mb-2 inline-block">Button-Based Automation</span>
              <h2 className="text-4xl font-heading text-slate-900 font-extrabold tracking-tight mb-4">WhatsApp Chatbot</h2>
              <p className="mb-6">
                Stop losing customers to slow replies. Automate product discovery, lead qualification, and appointment booking 24×7 on WhatsApp.
              </p>
              <div className="mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-heading text-slate-900 font-extrabold">₹9,999</span>
                  <span className="text-sm font-bold">/ year</span>
                </div>
              </div>
              <Link href="/register" className="btn-primary w-full text-center">
                Get Started <ArrowRight className="w-4 h-4 ml-2 inline" />
              </Link>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><Zap className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">24×7 Auto Replies</h3>
                <p className="text-sm">Never miss an inquiry. Engage with customers instantly at any time of day.</p>
              </div>
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><MessageCircle className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">Smart Lead Qualification</h3>
                <p className="text-sm">Guides users through interactive questions to filter and capture qualified leads.</p>
              </div>
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><Sparkles className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">Instant Product Suggestions</h3>
                <p className="text-sm">Recommends products based on queries with rich media and quick-reply buttons.</p>
              </div>
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><Languages className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">Multi-Language Support</h3>
                <p className="text-sm">Bot auto-detects and switches between English, Hindi, Hinglish, and more.</p>
              </div>
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><CreditCard className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">Payments & CRM</h3>
                <p className="text-sm">Integrates seamlessly with Razorpay, Zoho, HubSpot, and your backend.</p>
              </div>
              <div className="trust-card p-6 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5 shadow-sm border border-sky-100"><Bot className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-heading text-slate-900 font-bold mb-2">Button-Based Flow Builder</h3>
                <p className="text-sm">Simple visual flow builder to guide customers step-by-step.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
