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
  UserCheck, 
  ShieldCheck 
} from "lucide-react";
import { getDB, saveUser } from "@/lib/db";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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

  // Handle tab change
  const handleTabChange = (tab: "email" | "phone") => {
    setActiveTab(tab);
    setError("");
    setEmail("");
    setPhone("");
    setPassword("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (activeTab === "email") {
      if (!email.trim() || !password.trim()) {
        setError("Please fill in all email and password fields.");
        setLoading(false);
        return;
      }
    } else {
      if (!phone.trim()) {
        setError("Please enter your phone number.");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // In a real scenario, the backend would handle phone login separately
        body: JSON.stringify(activeTab === "email" ? { email, password } : { phone, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to sign in. Please check your credentials.");
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

      // Redirect based on role and plan
      if (data.role === "admin") {
        router.push("/dashboard/owner");
      } else if (data.subscription?.plan === "Free" || data.subscription?.status !== "Active") {
        router.push("/dashboard/plans");
      } else {
        router.push("/dashboard");
      }
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
            SECURE ACCESS
          </div>
        </div>

        {/* Logo and Headings */}
        <div className="text-center mb-6">
          <img src="/logoen.png" alt="Intuik Logo" className="h-20 w-auto object-contain mx-auto mb-3 mix-blend-multiply" style={{ filter: 'brightness(1.1) contrast(1.2)' }} />
          <h2 className="text-2xl font-serif font-bold text-[#283570] tracking-tight">Intuik</h2>
          <p className="text-xs text-[#5F6473] font-semibold mt-1">
            Sign in to manage your business locations & review routing
          </p>
        </div>

        {/* Login Tabs Selector */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#FFFFFF] border border-[#2E9E9C]/30 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => handleTabChange("email")}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "email"
                ? "bg-[#283570] text-[#FFFFFF] border border-[#2E9E9C]/30 shadow-sm"
                : "text-[#5F6473] hover:text-[#283570]"
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#FF5A3C] shrink-0" />
            <span>Email Login</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleTabChange("phone")}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "phone"
                ? "bg-[#283570] text-[#FFFFFF] border border-[#2E9E9C]/30 shadow-sm"
                : "text-[#5F6473] hover:text-[#283570]"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#FF5A3C] shrink-0" />
            <span>Phone No. Login</span>
          </button>
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
          {activeTab === "email" ? (
            <div>
              <label className="text-[10px] font-bold text-[#283570] uppercase tracking-wider block mb-1.5">
                Business Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2E9E9C]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#2E9E9C]/35 rounded-lg pl-11 pr-4 py-3 text-xs text-[#283570] focus:outline-none focus:border-[#283570] focus:ring-1 focus:ring-[#283570] transition-colors placeholder:text-[#5F6473]/50 font-bold"
                  placeholder="you@company.com"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-[10px] font-bold text-[#283570] uppercase tracking-wider block mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2E9E9C] text-xs font-bold">+91</div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#2E9E9C]/35 rounded-lg pl-11 pr-4 py-3 text-xs text-[#283570] focus:outline-none focus:border-[#283570] focus:ring-1 focus:ring-[#283570] transition-colors placeholder:text-[#5F6473]/50 font-bold"
                  placeholder="9876543210"
                />
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-[#283570] uppercase tracking-wider block">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold text-[#2E9E9C] hover:text-[#283570] transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2E9E9C]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required={activeTab === "email"}
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
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#283570] hover:bg-[#141f36] text-[#FFFFFF] border border-[#2E9E9C]/60 font-serif font-bold py-3.5 rounded-lg transition-all mt-6 flex items-center justify-center gap-2 shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing you in...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Toggle link */}
        <div className="text-center mt-6 text-xs text-[#5F6473] font-semibold">
          <span>Don't have an account? </span>
          <Link href="/register" className="text-[#2E9E9C] font-serif font-bold hover:text-[#283570] transition-colors">
            Start free trial
          </Link>
        </div>
      </div>
    </div>
  );
}
