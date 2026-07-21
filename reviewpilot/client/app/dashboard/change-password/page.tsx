"use client";

import React, { useState } from "react";
import { Lock, CheckCircle, ShieldAlert } from "lucide-react";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill out all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    // Success response
    setSuccess("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1.5 uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5" />
          <span>Security Panel</span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-blue-950 tracking-tight">Change Password</h2>
        <p className="text-xs text-gray-500 font-semibold mt-1">Ensure your account credentials remain private and secure.</p>
      </div>

      {/* Form Container Card */}
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-6 md:p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.025)]">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 tracking-wider">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3.5 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner placeholder:text-gray-400"
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 tracking-wider">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3.5 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner placeholder:text-gray-400"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 tracking-wider">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50/50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4.5 py-3.5 text-xs font-semibold text-blue-950 focus:outline-none focus:border-blue-600 shadow-inner placeholder:text-gray-400"
              required
            />
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="text-[11px] text-rose-600 font-bold flex items-center gap-1 bg-rose-50/50 border border-rose-100 p-2.5 rounded-[14px] animate-in slide-in-from-top-1">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-[14px] animate-in slide-in-from-top-1">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-[14px] transition-all shadow-md shadow-blue-500/10 hover:shadow-lg active:scale-[0.98]"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
