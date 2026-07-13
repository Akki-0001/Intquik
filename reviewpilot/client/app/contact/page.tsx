"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Navigation,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ArrowLeft,
  CheckCircle,
  MessageSquareCode
} from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg("Thank you! Your message has been sent successfully. Our team will get back to you shortly.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      // Clear toast after 5s
      setTimeout(() => setSuccessMsg(""), 5000);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 text-blue-950 min-h-screen font-sans relative flex flex-col justify-between">

      {/* Background Animated Blobs */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-blue-300/20 to-indigo-300/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-emerald-200/10 to-teal-300/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <LandingNavbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start w-full">

        {/* Left Side: Contact Information cards */}
        <div className="lg:col-span-5 space-y-8 text-left">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full inline-block">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight mt-4">
              We'd love to hear <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-650">
                from you.
              </span>
            </h1>
            <p className="text-base text-slate-800 font-semibold mt-3.5 leading-relaxed">
              Have questions about Intuik smart standees, custom NFC configurations, or enterprise pricing? Send us a message and our support team will reply within 24 hours.
            </p>
          </div>

          <div className="space-y-4">
            {/* Phone Card */}
            <a
              href="tel:+918421520817"
              className="bg-white/80 backdrop-blur-sm border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-5 rounded-[24px] flex items-center gap-4 hover:border-blue-600/30 transition-all shadow-sm group"
            >
              <div className="w-12 h-12 rounded-[14px] bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Phone Call & WhatsApp</h4>
                <p className="text-sm font-black text-blue-900 mt-0.5">+91 8421520817</p>
              </div>
            </a>

            {/* Email Card */}
            <a
              href="mailto:support@intuik.co"
              className="bg-white/80 backdrop-blur-sm border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-5 rounded-[24px] flex items-center gap-4 hover:border-blue-600/30 transition-all shadow-sm group"
            >
              <div className="w-12 h-12 rounded-[14px] bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Support Email</h4>
                <p className="text-sm font-black text-blue-900 mt-0.5">support@intuik.co</p>
              </div>
            </a>

            {/* Location Card */}
            <div className="bg-white/80 backdrop-blur-sm border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-5 rounded-[24px] flex items-center gap-4 hover:border-blue-600/30 transition-all shadow-sm group">
              <div className="w-12 h-12 rounded-[14px] bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Our Headquarters</h4>
                <p className="text-sm font-black text-blue-900 mt-0.5">Gurugram, Haryana, India</p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-white/80 backdrop-blur-sm border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-5 rounded-[24px] flex items-center gap-4 hover:border-blue-600/30 transition-all shadow-sm group">
              <div className="w-12 h-12 rounded-[14px] bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Business Hours</h4>
                <p className="text-sm font-black text-blue-900 mt-0.5">Mon - Sat: 9:00 AM - 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Message Form */}
        <div className="lg:col-span-7 bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/80 p-8 md:p-10 rounded-[36px] shadow-2xl shadow-blue-950/5 relative">

          {successMsg ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-300">
              <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center justify-center text-emerald-650 shadow-sm">
                <CheckCircle className="w-10 h-10 stroke-[2]" />
              </div>
              <div className="space-y-2 max-w-sm">
                <h3 className="text-lg font-black text-blue-950 tracking-tight">Message Received!</h3>
                <p className="text-base text-slate-800 font-semibold leading-relaxed">
                  {successMsg}
                </p>
              </div>
              <button
                onClick={() => setSuccessMsg("")}
                className="bg-slate-100 hover:bg-slate-200 text-blue-800 font-bold text-xs px-6 py-3 rounded-[14px] transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquareCode className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-black text-blue-950 tracking-tight">Submit Inquiry Form</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="text-base text-slate-800 font-bold uppercase block mb-1.5 tracking-wider">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Johnson"
                    className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3.5 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner placeholder:text-gray-400"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-base text-slate-800 font-bold uppercase block mb-1.5 tracking-wider">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. alex@example.com"
                    className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3.5 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-base text-slate-800 font-bold uppercase block mb-1.5 tracking-wider">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Bulk Order NFC Cards Discount Inquiry"
                  className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3.5 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner placeholder:text-gray-400"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-base text-slate-800 font-bold uppercase block mb-1.5 tracking-wider">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your business locations and reputation targets..."
                  className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3.5 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner placeholder:text-gray-400 resize-none leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-650 text-[#14142B] font-bold text-sm py-4 rounded-[14px] transition-all shadow-md shadow-blue-500/10 hover:shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-dark py-8 border-t border-slate-800 text-center text-xs font-bold text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Intuik. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#14142B] transition-colors">Home</Link>
            <Link href="/contact" className="text-[#14142B] hover:text-[#14142B] transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
