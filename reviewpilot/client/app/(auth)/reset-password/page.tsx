"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Lock, Loader2, AlertCircle, CheckCircle, ArrowRight, Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token") || "";

  const [otp, setOtp] = useState(urlToken);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otp.trim()) {
      setError("Please enter the 6-digit OTP verification code.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: otp.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password. OTP may be invalid or expired.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/80 rounded-[32px] p-8 shadow-xl relative z-10 animate-in fade-in duration-300">
      {/* Back Link */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/login" className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-950 transition-colors">
          ← Back to Login
        </Link>
        <div className="bg-slate-100 px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-gray-500 font-mono border border-slate-150">
          CHOOSE PASSWORD
        </div>
      </div>

      {!success ? (
        <>
          {/* Logo and Headings */}
          <div className="text-center mb-6">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-[14px] shadow-lg shadow-blue-500/10 inline-block mb-3">
              <Sparkles className="w-6 h-6 text-[#14142B] stroke-[2.5]" />
            </div>
            <h2 className="text-2xl font-black text-blue-950 tracking-tight">Reset Password</h2>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Configure a strong, new secure password for your Intuik account below.
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-[14px] p-3 mb-6 flex items-start gap-2">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!urlToken && (
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase block mb-1.5">6-Digit OTP Code</label>
                <div className="relative">
                  <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] pl-11 pr-4 py-3 text-xs text-blue-950 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-gray-400 font-bold tracking-[4px] text-center"
                    placeholder="123456"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase block mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] pl-11 pr-12 py-3 text-xs text-blue-950 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-gray-400 font-bold font-mono"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-950 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase block mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] pl-11 pr-12 py-3 text-xs text-blue-950 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-gray-400 font-bold font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-[#14142B] font-bold py-3.5 rounded-[14px] hover:bg-blue-700 transition-colors mt-6 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Password...</span>
                </>
              ) : (
                <>
                  <span>Change Password</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center py-6 space-y-6">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-full w-16 h-16 flex items-center justify-center text-emerald-650 mx-auto">
            <CheckCircle className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-blue-950 tracking-tight">Password Reset Successfully!</h2>
            <p className="text-xs text-gray-500 font-semibold mt-2 leading-relaxed">
              Your password has been changed. You will be redirected to the login page shortly, or you can click below.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/login"
              className="inline-block bg-blue-950 hover:bg-[#1A1F5C] text-[#14142B] border-none shadow-sm rounded-full hover:bg-[#181C4C] text-xs font-bold px-6 py-3 rounded-[14px] transition-all shadow-sm"
            >
              Go to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-slate-50 text-blue-950 min-h-screen flex items-center justify-center font-sans p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <Suspense fallback={
        <div className="w-full max-w-md bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/80 rounded-[32px] p-8 shadow-xl text-center flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-xs text-gray-500 font-bold mt-4">Loading Reset Form...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
