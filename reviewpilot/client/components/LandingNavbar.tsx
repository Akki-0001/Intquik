"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { getDB, saveUser } from "@/lib/db";

export default function LandingNavbar() {
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const db = getDB();
    if (db.user) {
      setUser(db.user);
    }
    
    // Outside click handler for dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    saveUser(null);
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 h-[90px] md:h-[110px] transition-all duration-500 relative">
        
        {/* Left Section: Hamburger + Logo */}
        <div className="flex items-center gap-2 sm:gap-4 h-full">
          {/* Mobile Menu Toggle Button (Left Side) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-slate-900 p-2 hover:bg-slate-100 rounded-full transition-colors z-50 -ml-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center group cursor-pointer h-full z-50">
            <div className="flex flex-col justify-center h-full pt-1 pb-1">
              <img
                src="/logoen.png"
                alt="Intuik Logo"
                className="h-[60px] md:h-[80px] w-auto mix-blend-multiply object-contain hover:scale-105 transition-transform duration-300 origin-left"
                style={{ filter: "brightness(1.1) contrast(1.2)" }}
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links (Center) */}
        <nav className="hidden lg:flex items-center gap-10 text-[15px] font-extrabold text-slate-900 tracking-wide">
          <Link href="/" className="relative hover:text-sky-600 transition-colors py-2 group">
            <span>Home</span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-sky-500 rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
          </Link>
          <Link href="/about" className="relative hover:text-sky-600 transition-colors py-2 group">
            <span>About Us</span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-sky-500 rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
          </Link>
          <Link href="/pricing" className="relative hover:text-sky-600 transition-colors py-2 group">
            <span>Pricing</span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-sky-500 rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
          </Link>
          <Link href="/features" className="relative hover:text-sky-600 transition-colors py-2 group">
            <span>Product</span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-sky-500 rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
          </Link>
          <Link href="/contact" className="relative hover:text-sky-600 transition-colors py-2 group">
            <span>Contact Us</span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-sky-500 rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
          </Link>
        </nav>

        {/* Right Section: Auth Button / User Controls */}
        <div className="flex items-center gap-2 sm:gap-4 z-50">
          {user ? (
            <div 
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 sm:px-4 py-2 rounded-full hover:bg-slate-100 transition-all shadow-sm"
              >
                <div className="w-7 h-7 rounded-full bg-white text-sky-600 flex items-center justify-center font-bold text-xs shadow-inner shrink-0">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div className="flex-col text-left hidden sm:flex">
                  <span className="text-xs font-bold text-slate-900 leading-none">
                    {user.name}
                  </span>
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase mt-1 tracking-widest">
                    {user.subscription?.plan || "Free"}
                  </span>
                </div>
              </button>

              {/* Dropdown Menu */}
              <div className={`absolute right-0 top-full pt-4 w-64 sm:w-72 transition-all duration-300 z-50 origin-top-right ${isDropdownOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'}`}>
                <div className="bg-white border border-slate-100 rounded-[14px] shadow-xl p-4 sm:p-5 space-y-4 text-left relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-sky-600" />
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                      Active Profile
                    </h4>
                    <p className="text-[15px] font-bold text-slate-900 mt-1 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">
                      {user.companyName}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        Subscription
                      </span>
                      <span className="font-extrabold text-slate-900 bg-sky-50 px-2 py-1 rounded-md">
                        {user.subscription?.plan || "Free"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block w-full bg-sky-500 hover:bg-sky-600 text-white text-center py-2.5 rounded-[14px] font-bold text-sm transition-colors shadow-md"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-center py-2.5 rounded-[14px] font-bold text-sm transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:block text-sm font-bold text-slate-900 hover:text-sky-600 transition-colors px-2"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-slate-900 text-white border border-slate-900 text-xs sm:text-sm font-extrabold px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
              >
                <span>Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      <div className={`lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-[500px] py-4' : 'max-h-0 py-0'}`}>
        <nav className="flex flex-col px-6 gap-4 font-bold text-slate-900">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-sky-600 py-2 border-b border-slate-100">Home</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-sky-600 py-2 border-b border-slate-100">About Us</Link>
          <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-sky-600 py-2 border-b border-slate-100">Pricing</Link>
          <Link href="/features" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-sky-600 py-2 border-b border-slate-100">Product</Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-sky-600 py-2 border-b border-slate-100">Contact Us</Link>
          
          {!user && (
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sky-600 py-2 font-bold sm:hidden">Sign In</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
