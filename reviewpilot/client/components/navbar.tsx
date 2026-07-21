"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, Bell, Plus, ArrowLeft } from "lucide-react";
import { getDB, MockUser } from "@/lib/db";

interface NavbarProps {
  setMobileMenuOpen: (open: boolean) => void;
}

const NAV_ITEMS = [
  { name: "Overview", href: "/dashboard" },
  { name: "Businesses", href: "/dashboard/businesses" },
  { name: "Reviews Feed", href: "/dashboard/reviews" },
  { name: "QR Generator", href: "/dashboard/qr-generator" },
  { name: "Analytics", href: "/dashboard/analytics" },
  { name: "Settings", href: "/dashboard/settings" },
];

export default function Navbar({ setMobileMenuOpen }: NavbarProps) {
  const pathname = usePathname();
  const activeItem = NAV_ITEMS.find(item => item.href === pathname) || { name: "Dashboard" };
  const [user, setUser] = useState<MockUser | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const db = getDB();
    if (db.user) {
      setUser(db.user);
    }
  }, []);

  useEffect(() => {
    if (user?.subscription?.endDate && user.subscription.plan !== "Free") {
      const end = new Date(user.subscription.endDate).getTime();
      const now = new Date().getTime();
      if (end > now) {
        setDaysLeft(Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
      } else {
        setDaysLeft(0);
      }
    }
  }, [user]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications) {
        const target = event.target as HTMLElement;
        if (!target.closest('.notification-container')) {
          setShowNotifications(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#FFFFFF] border-b border-slate-200 h-16 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Link 
            href="/" 
            className="text-[#6B6B6B] hover:text-slate-900 p-1 mr-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <img src="/logoen.png" alt="Intuik Logo" className="h-16 w-auto mix-blend-multiply object-contain" style={{ filter: 'brightness(1.1) contrast(1.2)' }} />
        </div>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="text-slate-900 hover:text-sky-600 p-1.5 rounded-[14px]"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Desktop Header bar */}
      <header className="hidden md:flex h-20 border-b border-slate-200 bg-[#FFFFFF] px-8 items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-[11px] font-sans tracking-tight font-bold text-slate-900 hover:text-sky-600 bg-white border border-slate-200 px-3.5 py-2 rounded-[14px] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home Page</span>
          </Link>
          <div className="h-5 w-[1px] bg-[#E2DDD1]" />
          <h1 className="text-base font-sans tracking-tight font-bold text-slate-900 tracking-tight">{activeItem.name}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative notification-container">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`text-slate-600 hover:text-sky-600 p-2.5 rounded-[12px] border transition-colors relative shadow-sm bg-white ${showNotifications ? 'border-sky-300 ring-2 ring-sky-100' : 'border-slate-200 hover:bg-slate-50'}`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-[16px] shadow-xl overflow-hidden z-50">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                  <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">1 New</span>
                </div>
                <div className="p-2">
                  <div className="p-3 hover:bg-slate-50 rounded-[12px] transition-colors cursor-pointer border border-transparent hover:border-slate-100 flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 mb-1">Subscription Status</p>
                      {(!user || !user.subscription || user.subscription.plan === 'Free') ? (
                        <p className="text-xs text-slate-500">You are currently on the <span className="font-bold text-slate-700">Free</span> plan. Upgrade to unlock premium features and add more locations.</p>
                      ) : (
                        <p className="text-xs text-slate-500">You are currently on the <span className="font-bold text-blue-600">{user.subscription.plan}</span> plan. Your subscription expires in <span className="font-bold text-rose-500">{daysLeft} days</span>.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Buy Plan / Renew Plan dynamic header button */}
          {user && (
            user.subscription?.status === "Active" && user.subscription?.plan !== "Free" ? (
              <Link
                href="/pricing"
                className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-sm font-bold px-5 py-2.5 rounded-[12px] flex items-center gap-2 transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
                <span>Renew Subscription</span>
              </Link>
            ) : (
              <Link
                href="/pricing"
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-[12px] flex items-center gap-2 transition-all shadow-md hover:shadow-sky-500/25"
              >
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <span>Buy Premium Plan</span>
              </Link>
            )
          )}

          <Link 
            href="/dashboard/qr-generator" 
            className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-[12px] flex items-center gap-2 transition-all shadow-md hover:shadow-slate-900/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create QR</span>
          </Link>
        </div>
      </header>
    </>
  );
}
