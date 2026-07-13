"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail, User, Building, Loader2, AlertCircle } from "lucide-react";
import { getDB, saveUser } from "@/lib/db";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
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

    if (!name.trim() || !companyName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, companyName, email, password }),
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
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-[#6B6B6B] hover:text-[#283570] transition-colors">
            ← Back to Home
          </Link>
          <div className="bg-[#2E9E9C]/10 text-[#283570] border border-[#2E9E9C]/30 px-2 py-0.5 rounded-[6px] text-[10px] font-bold font-mono">
            14-DAY TRIAL
          </div>
        </div>

        {/* Logo and Headings */}
        <div className="text-center mb-6">
          <div className="bg-[#283570] p-2.5 rounded-[6px] inline-block mb-3 border border-[#2E9E9C]/30">
            <Sparkles className="w-6 h-6 text-[#2E9E9C] stroke-[2.5]" />
          </div>
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
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2E9E9C]" />
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
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2E9E9C]" />
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
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2E9E9C]" />
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
            <label className="text-xs font-bold text-[#283570] block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2E9E9C]" />
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
            className="w-full bg-[#283570] text-[#2E9E9C] hover:bg-[#2E9E9C] hover:text-[#283570] border border-[#2E9E9C] font-serif font-bold py-3 rounded-[6px] transition-colors duration-200 mt-6 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-xs"
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
