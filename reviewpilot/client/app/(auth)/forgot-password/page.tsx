"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Loader2, AlertCircle, CheckCircle, ArrowRight, Copy, Check } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim()) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP. Please try again.");
      }

      // OTP is only sent via email now

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOtp = async () => {
    if (otpCode) {
      await navigator.clipboard.writeText(otpCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleProceed = () => {
    router.push(`/reset-password?token=${otpCode}`);
  };

  return (
    <div className="bg-slate-50 text-blue-950 min-h-screen flex items-center justify-center font-sans p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/80 rounded-[32px] p-8 shadow-xl relative z-10 animate-in fade-in duration-300">
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/login" className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-950 transition-colors">
            ← Back to Login
          </Link>
          <div className="bg-slate-100 px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-gray-500 font-mono border border-slate-150">
            PASSWORD RESET
          </div>
        </div>

        {!success ? (
          <>
            {/* Logo and Headings */}
            <div className="text-center mb-6">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-[14px] shadow-lg shadow-blue-500/10 inline-block mb-3">
                <Sparkles className="w-6 h-6 text-[#14142B] stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-black text-blue-950 tracking-tight">Forgot Password?</h2>
              <p className="text-xs text-gray-500 font-semibold mt-1">
                Enter your email address and we&apos;ll generate a secure OTP to reset your password.
              </p>
            </div>

            {/* Error Notice */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-[14px] p-3 mb-6 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Request Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase block mb-1.5">
                  Business Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] pl-11 pr-4 py-3 text-xs text-blue-950 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-gray-400 font-bold"
                    placeholder="you@company.com"
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
                    <span>Generating OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset OTP</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-5">
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-emerald-600 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-blue-950 tracking-tight">OTP Generated!</h2>
              <p className="text-xs text-gray-500 font-semibold mt-2 leading-relaxed">
                Your password reset verification code for <strong className="text-blue-900">{email}</strong>:
              </p>
            </div>

            {/* OTP Display Box Removed to enforce email checking */}

            <div className="bg-amber-50 border border-amber-200 rounded-[14px] p-3 text-[11px] text-amber-700 font-semibold leading-relaxed text-left">
              <strong className="text-amber-800">⏱ Expires in 10 minutes.</strong> Use this code on the next screen to set your new password.
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => router.push(`/reset-password`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-[#14142B] text-xs font-bold px-6 py-3.5 rounded-[14px] transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2"
              >
                <span>Enter OTP to Reset Password</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onClick={handleSubmit}
                className="block w-full text-center text-[10px] font-bold text-gray-400 hover:text-gray-500 transition-colors mt-2"
              >
                Did not receive? Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
