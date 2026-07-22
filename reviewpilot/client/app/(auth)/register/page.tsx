"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail, User, Building, Loader2, AlertCircle, Phone } from "lucide-react";
import { getDB, saveUser } from "@/lib/db";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const db = getDB();
    if (db.user) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name.trim() || !companyName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, companyName, email, phone, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create account. Please try again.");
      }

      saveUser({
        id: data._id,
        name: data.name,
        email: data.email,
        companyName: data.companyName,
        role: data.role || "user",
        subscription: data.subscription,
        token: data.token,
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] text-[#2B2B2B] min-h-screen flex items-center justify-center font-sans p-6 relative overflow-hidden">
      <div className="w-full max-w-md bg-white border border-[#E2DDD1] rounded-[6px] p-8 shadow-sm relative z-10">
        
        {/* Back Link */}
        <div className="mb-6 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-[#6B6B6B] hover:text-[#283570] transition-colors">
            ← Back to Home
          </Link>
        </div>

        {/* Logo and Headings */}
        <div className="text-center mb-6">
          <img src="/logoen.png" alt="Intuik Logo" className="h-20 w-auto object-contain mx-auto mb-3 mix-blend-multiply" style={{ filter: 'brightness(1.1) contrast(1.2)' }} />
          <h2 className="text-2xl font-serif font-bold text-[#283570] tracking-tight">Create Your Account</h2>
          <p className="text-xs text-[#6B6B6B] font-semibold mt-2">Get setup and collect reviews in 2 minutes</p>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-750 text-xs rounded-[6px] p-3 mb-4 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#283570] block mb-1">Your Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#283570]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] pl-11 pr-4 py-2.5 text-sm text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] transition-colors placeholder:text-gray-400 font-semibold"
                placeholder="Alex Mercer"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#283570] block mb-1">Company Name</label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#283570]" />
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] pl-11 pr-4 py-2.5 text-sm text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] transition-colors placeholder:text-gray-400 font-semibold"
                placeholder="Pilot Group Ltd"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#283570] block mb-1">Business Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#283570]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] pl-11 pr-4 py-2.5 text-sm text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] transition-colors placeholder:text-gray-400 font-semibold"
                placeholder="alex@pilotgroup.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#283570] block mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#283570]" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] pl-11 pr-4 py-2.5 text-sm text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] transition-colors placeholder:text-gray-400 font-semibold"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#283570] block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#283570]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#E2DDD1] rounded-[6px] pl-11 pr-4 py-2.5 text-sm text-[#2B2B2B] focus:outline-none focus:border-[#2E9E9C] transition-colors placeholder:text-gray-400 font-semibold"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#283570] hover:bg-[#141f36] text-[#FFFFFF] border border-[#2E9E9C]/60 font-serif font-bold py-3.5 rounded-lg transition-all mt-6 flex items-center justify-center gap-2 shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#2E9E9C]" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register & Begin</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Toggle link */}
        <div className="text-center mt-6 text-xs text-[#6B6B6B] font-semibold">
          <span>Already have an account? </span>
          <Link href="/login" className="text-[#283570] font-bold hover:text-[#2E9E9C] transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
