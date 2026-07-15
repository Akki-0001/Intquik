"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Building, 
  Mail, 
  Key, 
  CreditCard, 
  Bell, 
  Check, 
  RefreshCw, 
  Copy,
  Eye,
  EyeOff,
  Globe,
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { getDB, saveUser, MockUser } from "@/lib/db";

export default function SettingsPage() {
  const [user, setUser] = useState<MockUser | null>(null);

  // Profile Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [savedProfile, setSavedProfile] = useState(false);

  // Billing and Upgrade states
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const [billingSuccess, setBillingSuccess] = useState("");

  // API Key State
  const [apiKey, setApiKey] = useState("rp_live_4f89d38c29ab9f73c50de319");
  const [revealKey, setRevealKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Notification Toggles
  const [alertNegative, setAlertNegative] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [alertSms, setAlertSms] = useState(true);

  useEffect(() => {
    const db = getDB();
    if (db.user) {
      setUser(db.user);
      setName(db.user.name);
      setEmail(db.user.email);
      setCompany(db.user.companyName);
    }
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !company.trim()) return;

    const updatedUser = {
      id: user?.id || "usr-1",
      name,
      email,
      companyName: company,
      role: user?.role || "user",
      subscription: user?.subscription,
      token: user?.token || "mock-jwt-token-12345"
    };

    setUser(updatedUser);
    saveUser(updatedUser);
    
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2000);
  };

  const handleUpgradePlan = async (plan: 'Free' | 'Starter' | 'Professional' | 'Enterprise') => {
    setUpgradingPlan(plan);
    setBillingSuccess("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/my-subscription`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        
        // Update user state and local storage
        const updatedUser: MockUser = {
          ...user!,
          subscription: data.subscription,
        };
        setUser(updatedUser);
        saveUser(updatedUser);
        
        setBillingSuccess(`Successfully upgraded to the ${plan} plan!`);
        setTimeout(() => setBillingSuccess(""), 4000);
      } else {
        alert("Failed to update subscription. Please verify that the server is running on port 5000.");
      }
    } catch (err) {
      console.error(err);
      alert("Error upgrading subscription plan. Check your server connection.");
    } finally {
      setUpgradingPlan(null);
    }
  };

  const handleRegenerateKey = () => {
    const randomHex = Array.from({ length: 24 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    setApiKey(`rp_live_${randomHex}`);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 1500);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Profile Settings */}
      <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-6 rounded-3xl shadow-sm">
        <h3 className="text-sm font-bold text-blue-950 mb-2 flex items-center gap-1.5">
          <User className="w-4.5 h-4.5 text-blue-600" />
          <span>Profile & Account Details</span>
        </h3>
        <p className="text-xs text-gray-500 font-semibold mb-6">Modify your user profile and company name settings.</p>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] pl-9 pr-4 py-2.5 text-xs text-blue-950 focus:outline-none focus:border-blue-600 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5">Company Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] pl-9 pr-4 py-2.5 text-xs text-blue-950 focus:outline-none focus:border-blue-600 font-semibold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] pl-9 pr-4 py-2.5 text-xs text-blue-950 focus:outline-none focus:border-blue-600 font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-[#14142B] text-xs font-bold px-4 py-2.5 rounded-[14px] hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/10"
            >
              Save Profile Settings
            </button>
            {savedProfile && (
              <span className="text-xs text-blue-650 font-bold flex items-center gap-1">
                <Check className="w-4 h-4 text-[#FF5A3C] shrink-0" />
                <span>Saved!</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* 2. API Keys & Webhooks */}
      <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-6 rounded-3xl shadow-sm">
        <h3 className="text-sm font-bold text-blue-950 mb-2 flex items-center gap-1.5">
          <Key className="w-4.5 h-4.5 text-blue-600" />
          <span>API Access Credentials</span>
        </h3>
        <p className="text-xs text-gray-500 font-semibold mb-6">Integrate Intuik reviews & scan actions into your CRM, Slack or POS terminals.</p>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5">Secret API Key</label>
            <div className="flex gap-2">
              <div className="relative flex-1 bg-slate-550 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4 py-2.5 text-xs text-blue-950 font-mono font-bold flex items-center select-all bg-slate-50">
                {revealKey ? apiKey : "••••••••••••••••••••••••••••••••"}
              </div>

              <button
                onClick={() => setRevealKey(!revealKey)}
                className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] hover:bg-slate-50 text-gray-500 px-3 rounded-[14px] transition-colors"
                title="Reveal/Hide"
              >
                {revealKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              <button
                onClick={handleCopyKey}
                className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] hover:bg-slate-50 text-gray-500 px-3 rounded-[14px] transition-colors flex items-center justify-center min-w-[70px] text-[10px] font-bold"
              >
                {copiedKey ? <Check className="w-4 h-4 text-[#FF5A3C] shrink-0" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleRegenerateKey}
                className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] hover:bg-slate-50 text-gray-500 px-3 rounded-[14px] transition-colors"
                title="Regenerate"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Notifications */}
      <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-6 rounded-3xl shadow-sm">
        <h3 className="text-sm font-bold text-blue-950 mb-2 flex items-center gap-1.5">
          <Bell className="w-4.5 h-4.5 text-blue-600" />
          <span>Real-time Alert Notifications</span>
        </h3>
        <p className="text-xs text-slate-505 font-semibold mb-6">Manage how you want to be alerted of customer ratings.</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px]">
            <div>
              <p className="text-xs font-bold text-blue-900">Email alerts for low reviews</p>
              <p className="text-[10px] text-gray-500 font-semibold">Get instantly emailed when a private concern review is submitted (&lt; 3 stars).</p>
            </div>
            <input 
              type="checkbox"
              checked={alertNegative}
              onChange={(e) => setAlertNegative(e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px]">
            <div>
              <p className="text-xs font-bold text-blue-900">SMS Critical Intercepts</p>
              <p className="text-[10px] text-gray-500 font-semibold">Alert manager phone via SMS immediately on 1-star reviews.</p>
            </div>
            <input 
              type="checkbox"
              checked={alertSms}
              onChange={(e) => setAlertSms(e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px]">
            <div>
              <p className="text-xs font-bold text-blue-900">Weekly PDF Summary Report</p>
              <p className="text-[10px] text-gray-500 font-semibold">Receive a consolidated analytics performance summary report on Mondays.</p>
            </div>
            <input 
              type="checkbox"
              checked={weeklySummary}
              onChange={(e) => setWeeklySummary(e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. Billing Subscriptions & Plan Selector */}
      <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-6 rounded-3xl shadow-sm">
        <h3 className="text-sm font-bold text-blue-950 mb-2 flex items-center gap-1.5">
          <CreditCard className="w-4.5 h-4.5 text-blue-600" />
          <span>Select Subscription Plan</span>
        </h3>
        <p className="text-xs text-gray-500 font-semibold mb-4">Choose the plan that matches your business locations. Upgrade or change anytime.</p>

        {/* Success alert */}
        {billingSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-[14px] p-3 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span className="font-bold">{billingSuccess}</span>
          </div>
        )}

        {/* Current plan brief */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-[14px] p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase font-mono bg-blue-100/60 px-2.5 py-0.5 rounded-lg border border-blue-200/50">
                CURRENT PLAN: {user.subscription?.plan || "Free"}
              </span>
              <span className="text-xs text-gray-500 font-semibold">
                Status: {user.subscription?.status || "Active"}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-semibold mt-2">
              Renewal Expiration: {user.subscription?.endDate ? new Date(user.subscription.endDate).toLocaleDateString() : "30 days trial"}
            </p>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Free Plan */}
          <div className={`border rounded-[14px] p-4 flex flex-col justify-between ${
            user.subscription?.plan === "Free" ? "border-blue-500 bg-blue-50/10" : "border-slate-200 bg-white"
          }`}>
            <div>
              <p className="text-xs font-bold text-blue-900">Free Trial</p>
              <p className="text-2xl font-black text-blue-950 mt-2">$0<span className="text-xs font-normal text-gray-500">/mo</span></p>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">1 Business Location</p>
              <ul className="text-[10px] text-gray-500 space-y-1.5 mt-4">
                <li>• QR Code Generator</li>
                <li>• Private Feedbacks Feed</li>
                <li>• Basic analytics</li>
              </ul>
            </div>
            <button
              onClick={() => handleUpgradePlan("Free")}
              disabled={user.subscription?.plan === "Free" || upgradingPlan !== null}
              className={`w-full mt-6 py-2 rounded-[14px] text-[10px] font-bold transition-all ${
                user.subscription?.plan === "Free"
                  ? "bg-slate-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] hover:bg-slate-50 text-blue-800 shadow-sm"
              }`}
            >
              {user.subscription?.plan === "Free" ? "Active Plan" : "Select Free"}
            </button>
          </div>

          {/* Starter Plan */}
          <div className={`border rounded-[14px] p-4 flex flex-col justify-between ${
            user.subscription?.plan === "Starter" ? "border-blue-500 bg-blue-50/10" : "border-slate-200 bg-white"
          }`}>
            <div>
              <p className="text-xs font-bold text-blue-900">Starter Plan</p>
              <p className="text-2xl font-black text-blue-950 mt-2">$29<span className="text-xs font-normal text-gray-500">/mo</span></p>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">3 Business Locations</p>
              <ul className="text-[10px] text-gray-500 space-y-1.5 mt-4">
                <li>• Everything in Free</li>
                <li>• 3 Live Locations</li>
                <li>• Custom Review Prompts</li>
              </ul>
            </div>
            <button
              onClick={() => handleUpgradePlan("Starter")}
              disabled={user.subscription?.plan === "Starter" || upgradingPlan !== null}
              className={`w-full mt-6 py-2 rounded-[14px] text-[10px] font-bold transition-all ${
                user.subscription?.plan === "Starter"
                  ? "bg-slate-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-650 hover:bg-blue-700 text-[#14142B] shadow-md shadow-blue-500/10"
              }`}
            >
              {user.subscription?.plan === "Starter" ? "Active Plan" : "Upgrade Starter"}
            </button>
          </div>

          {/* Professional Plan */}
          <div className={`border rounded-[14px] p-4 flex flex-col justify-between ${
            user.subscription?.plan === "Professional" ? "border-blue-500 bg-blue-50/10" : "border-slate-200 bg-white"
          }`}>
            <div>
              <p className="text-xs font-bold text-blue-900">Professional</p>
              <p className="text-2xl font-black text-blue-950 mt-2">$79<span className="text-xs font-normal text-gray-500">/mo</span></p>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">10 Business Locations</p>
              <ul className="text-[10px] text-gray-500 space-y-1.5 mt-4">
                <li>• Everything in Starter</li>
                <li>• 10 Live Locations</li>
                <li>• AI Auto-Replies</li>
              </ul>
            </div>
            <button
              onClick={() => handleUpgradePlan("Professional")}
              disabled={user.subscription?.plan === "Professional" || upgradingPlan !== null}
              className={`w-full mt-6 py-2 rounded-[14px] text-[10px] font-bold transition-all ${
                user.subscription?.plan === "Professional"
                  ? "bg-slate-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-650 hover:bg-blue-700 text-[#14142B] shadow-md shadow-blue-500/10"
              }`}
            >
              {user.subscription?.plan === "Professional" ? "Active Plan" : "Upgrade Professional"}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className={`border rounded-[14px] p-4 flex flex-col justify-between ${
            user.subscription?.plan === "Enterprise" ? "border-blue-500 bg-blue-50/10" : "border-slate-200 bg-white"
          }`}>
            <div>
              <p className="text-xs font-bold text-blue-900">Enterprise</p>
              <p className="text-2xl font-black text-blue-950 mt-2">$249<span className="text-xs font-normal text-gray-500">/mo</span></p>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">Unlimited Locations</p>
              <ul className="text-[10px] text-gray-500 space-y-1.5 mt-4">
                <li>• Everything in Pro</li>
                <li>• Unlimited Locations</li>
                <li>• Custom API Key Access</li>
              </ul>
            </div>
            <button
              onClick={() => handleUpgradePlan("Enterprise")}
              disabled={user.subscription?.plan === "Enterprise" || upgradingPlan !== null}
              className={`w-full mt-6 py-2 rounded-[14px] text-[10px] font-bold transition-all ${
                user.subscription?.plan === "Enterprise"
                  ? "bg-slate-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-650 hover:bg-blue-700 text-[#14142B] shadow-md shadow-blue-500/10"
              }`}
            >
              {user.subscription?.plan === "Enterprise" ? "Active Plan" : "Upgrade Enterprise"}
            </button>
          </div>

        </div>
      </div>

      {/* 5. Visit Official Websites & Resources */}
      <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-6 rounded-3xl shadow-sm">
        <h3 className="text-sm font-bold text-blue-950 mb-2 flex items-center gap-1.5">
          <Globe className="w-4.5 h-4.5 text-blue-600" />
          <span>Explore Intuik Resources & Partner Sites</span>
        </h3>
        <p className="text-xs text-gray-500 font-semibold mb-6">Explore official resources, partner integrations, and client websites.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <a
            href="https://intuik.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] hover:border-slate-350 rounded-[14px] group transition-all"
          >
            <div>
              <p className="text-xs font-bold text-blue-900">Official Homepage</p>
              <p className="text-[9px] text-slate-450 mt-0.5">Explore marketing features</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-950 transition-colors" />
          </a>

          <a
            href="https://docs.intuik.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] hover:border-slate-350 rounded-[14px] group transition-all"
          >
            <div>
              <p className="text-xs font-bold text-blue-900">Documentation Hub</p>
              <p className="text-[9px] text-slate-450 mt-0.5">Integration guide tutorials</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-950 transition-colors" />
          </a>

          <a
            href="https://status.intuik.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] hover:border-slate-350 rounded-[14px] group transition-all"
          >
            <div>
              <p className="text-xs font-bold text-blue-900">System Live Status</p>
              <p className="text-[9px] text-slate-450 mt-0.5">API & SMS server status</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-950 transition-colors" />
          </a>

        </div>
      </div>

    </div>
  );
}
