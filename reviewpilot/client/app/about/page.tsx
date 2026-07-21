"use client";

import React from "react";
import Link from "next/link";
import { Star, Shield, Zap, Target } from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";

export default function AboutPage() {
  return (
    <div className="bg-slate-50 text-blue-950 min-h-screen font-sans relative flex flex-col justify-between overflow-x-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-blue-300/20 to-indigo-300/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-emerald-200/10 to-teal-300/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <LandingNavbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 w-full flex-grow">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-3 py-1.5 rounded-full inline-block mb-4">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-blue-950 tracking-tight mb-6">
            Empowering local businesses with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Intuik Technologies</span>
          </h1>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            We believe that every great local business deserves a 5-star reputation. At Intuik, we blend cutting-edge AI software with physical smart-hardware to make collecting authentic reviews effortless.
          </p>
        </div>

        {/* Vision & Mission Sections */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-blue-950 tracking-tight">The Future of Reputation</h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              Getting reviews is historically difficult. Customers love your service, but the friction of finding your Google page and writing a thoughtful comment stops them. 
              <br/><br/>
              <strong>Intuik Technologies</strong> was founded to eliminate this friction entirely. Our physical smart-standees instantly launch an AI-powered review experience right on your customer's phone via NFC technology. It's smart, frictionless, and incredibly effective.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-sky-400 rounded-3xl transform rotate-3 scale-[1.02] opacity-10"></div>
            <img 
              src="/nfc_standee_in_shop.png" 
              alt="Intuik Smart Standee in action" 
              className="rounded-3xl shadow-xl w-full h-[400px] object-cover relative z-10"
            />
          </div>
        </div>

        {/* Core Values */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-blue-950 tracking-tight mb-4">Our Core Pillars</h2>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium">We built our platform on these fundamental principles to ensure your business always succeeds.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-white p-6 rounded-[24px] shadow-sm hover:shadow-md transition-shadow border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-blue-950 mb-2">Zero Friction</h3>
            <p className="text-sm text-slate-500 font-medium">Customers tap their phone and are writing a review in under 3 seconds.</p>
          </div>
          
          <div className="bg-white p-6 rounded-[24px] shadow-sm hover:shadow-md transition-shadow border border-slate-100">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-blue-950 mb-2">AI-Powered</h3>
            <p className="text-sm text-slate-500 font-medium">We suggest thoughtful review templates so customers don't have to suffer from writer's block.</p>
          </div>

          <div className="bg-white p-6 rounded-[24px] shadow-sm hover:shadow-md transition-shadow border border-slate-100">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-blue-950 mb-2">Verified Trust</h3>
            <p className="text-sm text-slate-500 font-medium">All reviews filter directly to Google or Yelp to build authentic, lasting trust.</p>
          </div>

          <div className="bg-white p-6 rounded-[24px] shadow-sm hover:shadow-md transition-shadow border border-slate-100">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-blue-950 mb-2">Data Driven</h3>
            <p className="text-sm text-slate-500 font-medium">Beautiful dashboards give you real-time insights into your reputation growth.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-dark py-8 border-t border-slate-200 text-center text-xs font-bold text-slate-500 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Intuik Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/about" className="text-blue-600 transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
