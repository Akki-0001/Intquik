"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Sparkles, 
  Star, 
  Shapes,
  CreditCard,
  Lock,
  LogOut, 
  X,
  Navigation
} from "lucide-react";
import { saveUser, MockUser } from "@/lib/db";

interface SidebarProps {
  user: MockUser;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Sidebar({ user, mobileMenuOpen, setMobileMenuOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      saveUser(null);
      router.push("/");
    }
  };

  const navItems = user.role === "admin" 
    ? [
        { name: "Clients & DB", href: "/dashboard/owner", icon: Sparkles },
        { name: "Change Password", href: "/dashboard/change-password", icon: Lock },
      ]
    : [
        { name: "Reviews", href: "/dashboard", icon: Star },
        { name: "Category", href: "/dashboard/category", icon: Shapes },
        { name: "Plans", href: "/dashboard/plans", icon: CreditCard },
        { name: "Change Password", href: "/dashboard/change-password", icon: Lock },
      ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden flex justify-end">
          <div className="w-64 bg-slate-50 h-full border-l border-slate-200 p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="font-sans tracking-tight font-bold text-slate-900 text-sm">Navigation</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
 
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={(e) => {
                        const isProtected = item.name !== "Plans" && item.name !== "Change Password" && item.name !== "Clients & DB";
                        const isFreeOrInactive = user.role !== "admin" && (user.subscription?.plan === "Free" || user.subscription?.status !== "Active");
                        if (isProtected && isFreeOrInactive) {
                          e.preventDefault();
                          alert("Please buy or renew a plan to access this feature.");
                          router.push("/dashboard/plans");
                        }
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-sm font-semibold transition-all duration-200 group ${
                        isActive 
                          ? "bg-white text-sky-600 border-l-[3px] border-sky-500 shadow-sm font-bold" 
                          : "text-slate-600 hover:text-sky-600 hover:bg-white"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-sky-600" : "text-slate-400 group-hover:text-sky-500"}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors text-left group"
                >
                  <LogOut className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-rose-500 transition-colors" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
 
            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center gap-3 bg-white border border-slate-100 shadow-sm p-3 rounded-[14px]">
                <div className="bg-sky-50 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sky-600 text-xs shadow-inner">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{user.companyName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-50 border-r border-slate-200 p-6 flex-col justify-between shrink-0 sticky top-0 h-screen z-20">
        <div>
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="p-1.5 -ml-1.5 rounded-[16px] border border-transparent hover:border-slate-200 hover:bg-slate-100/50 transition-all duration-300 cursor-pointer">
              <img src="/logoen.png" alt="Intuik Logo" className="h-24 w-auto mix-blend-multiply object-contain" style={{ filter: 'brightness(1.1) contrast(1.2)' }} />
            </div>
          </div>
 
          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    const isProtected = item.name !== "Plans" && item.name !== "Change Password" && item.name !== "Clients & DB";
                    const isFreeOrInactive = user.role !== "admin" && (user.subscription?.plan === "Free" || user.subscription?.status !== "Active");
                    if (isProtected && isFreeOrInactive) {
                      e.preventDefault();
                      alert("Please buy or renew a plan to access this feature.");
                      router.push("/dashboard/plans");
                    }
                  }}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-[14px] text-sm font-semibold transition-all duration-200 group ${
                    isActive 
                      ? "bg-white text-sky-600 border-l-[3px] border-sky-500 shadow-sm font-bold relative" 
                      : "text-slate-600 hover:text-sky-600 hover:bg-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-sky-600" : "text-slate-400 group-hover:text-sky-500"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-[14px] text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 text-left group"
            >
              <LogOut className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-rose-500 transition-colors" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
 
        {/* User profile box */}
        <div className="border-t border-slate-200 pt-6">
          <div className="flex items-center gap-3 bg-white border border-slate-100 shadow-sm p-3.5 rounded-[14px]">
            <div className="bg-sky-50 w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sky-600 text-xs shadow-inner">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{user.companyName}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
