"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  Loader2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck 
} from "lucide-react";
import { getDB, saveUser } from "@/lib/db";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const db = getDB();
    if (db.user) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to sign in. Please check your credentials.");
      }

      // Ensure the logged in user is actually an admin
      if (data.role !== "admin") {
        throw new Error("Access Denied: You do not have administrator privileges.");
      }

      // Save user details
      saveUser({
        id: data._id,
        name: data.name,
        email: data.email,
        companyName: data.companyName,
        role: data.role,
        subscription: data.subscription,
      });

      // Redirect based on role
      router.push("/dashboard/owner");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] text-[#283570] min-h-screen flex items-center justify-center font-sans p-6 relative overflow-hidden">
      
      <div className="w-full max-w-md bg-white border border-[#2E9E9C]/40 rounded-lg p-8 shadow relative z-10 animate-in fade-in duration-300">
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-[#5F6473] hover:text-[#283570] transition-colors">
            ← Back to Home
          </Link>
          <div className="bg-[#FFFFFF] px-2.5 py-0.5 border border-[#2E9E9C]/30 rounded-lg text-[10px] font-serif font-bold text-[#283570] tracking-wider uppercase">
            ADMIN ACCESS
          </div>
        </div>

        {/* Logo and Headings */}
        <div className="text-center mb-6">
          <div className="bg-[#283570] border border-[#2E9E9C]/40 p-2.5 rounded-lg inline-block mb-3">
            <ShieldCheck className="w-5 h-5 text-[#2E9E9C] stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#283570] tracking-tight">Super Admin Portal</h2>
          <p className="text-xs text-[#5F6473] font-semibold mt-1">
            Access Super Admin settings to manage clients & plans
          </p>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-750 text-xs rounded-lg p-3 mb-6 flex items-start gap-2">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-[#283570] uppercase tracking-wider block mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2E9E9C]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#2E9E9C]/35 rounded-lg pl-11 pr-4 py-3 text-xs text-[#283570] focus:outline-none focus:border-[#283570] focus:ring-1 focus:ring-[#283570] transition-colors placeholder:text-[#5F6473]/50 font-bold"
                placeholder="admin@intuik.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold text-[#283570] uppercase tracking-wider block">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2E9E9C]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#2E9E9C]/35 rounded-lg pl-11 pr-12 py-3 text-xs text-[#283570] focus:outline-none focus:border-[#283570] focus:ring-1 focus:ring-[#283570] transition-colors placeholder:text-[#5F6473]/50 font-bold font-mono"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2E9E9C] hover:text-[#283570] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#283570] hover:bg-[#141f36] text-[#FFFFFF] border border-[#2E9E9C]/60 font-serif font-bold py-3.5 rounded-lg transition-all mt-6 flex items-center justify-center gap-2 shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authorizing...</span>
              </>
            ) : (
              <>
                <span>Access Console</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
