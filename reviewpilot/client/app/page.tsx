"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  QrCode,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Check,
  ArrowRight,
  Building,
  Smartphone,
  MessageSquare,
  Globe,
  Award,
  ChevronRight,
  Zap,
  Phone,
  UserCheck,
  Navigation,
  X,
  Headphones,
  CalendarCheck,
  Filter,
  Languages,
  BarChart3,
  RefreshCw,
  Mic,
  MessageCircle,
  Bot,
  CreditCard,
  Reply,
  Search,
  KeyRound,
  MapPin,
} from "lucide-react";
import { getDB, saveBusinesses, saveUser, Business } from "@/lib/db";
import LandingNavbar from "@/components/LandingNavbar";


const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  let transformInit = "translate-y-16 scale-95";
  if (direction === "left") transformInit = "-translate-x-16 opacity-0";
  if (direction === "right") transformInit = "translate-x-16 opacity-0";

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0 translate-x-0 scale-100" : `opacity-0 ${transformInit}`} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function LandingPage() {
  const router = useRouter();

  // User Session & Plan purchase
  const [user, setUser] = useState<any>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [purchasingPlan, setPurchasingPlan] = useState<string | null>(null);

  useEffect(() => {
    const db = getDB();
    if (db.user) {
      // Check if it's the default placeholder user or a logged-in one
      setUser(db.user);
    }

    // Auto-open upgrade modal if query param is set
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("upgrade") === "true") {
        setIsBuyModalOpen(true);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    }
  }, []);

  const handleSignOut = () => {
    saveUser(null);
    setUser(null);
    window.location.reload();
  };

  const handlePurchasePlan = (planName: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    router.push(`/checkout?plan=${planName}`);
  };

  // Stats counters simulation
  const [reviewsCount, setReviewsCount] = useState(128470);
  useEffect(() => {
    const interval = setInterval(() => {
      setReviewsCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white text-slate-900 min-h-screen font-sans selection:bg-blue-900/20 selection:text-slate-900 relative">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-20 px-6">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-[15%] w-3 h-3 bg-slate-300 rounded-full opacity-80" />
        <div className="absolute bottom-40 right-[40%] w-2 h-2 bg-slate-200 rounded-full opacity-80" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-center lg:text-left z-20">
            <ScrollReveal direction="up" delay={0}>
              <p className="text-slate-600 font-medium text-base md:text-lg tracking-wide uppercase">
                Boost Your Business Communication
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={150}>
              <h1 className="text-[40px] sm:text-[50px] md:text-[58px] font-extrabold tracking-tight text-slate-900 leading-[1.1] font-sans">
                Smart Automation <br />
                For Business{" "}
                <span className="relative inline-block">
                  Growth
                  {/* Yellow hand-drawn underline SVG */}
                  <svg
                    className="absolute w-full h-[12px] -bottom-1 left-0 text-[#fbbf24]"
                    viewBox="0 0 200 20"
                    preserveAspectRatio="none"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 15C45.5 5 135 -3 198 12"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="text-gray-400">.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={300}>
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed mt-2">
                Transform your customer interactions with automated contact
                tools, and digital engagement — designed to grow your business.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={450}>
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start items-center mt-6">
                <Link
                  href="/register"
                  className="bg-slate-900 text-white hover:bg-slate-800 font-bold px-8 py-3.5 rounded-full transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(15,23,42,0.5)] hover:-translate-y-0.5 text-[15px]"
                >
                  Learn More
                </Link>

                <a
                  href="https://wa.me/919958754255"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white text-slate-900 border border-slate-200 shadow-sm hover:bg-slate-50 flex items-center justify-center hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-[15px]">+91 9958754255</span>
                </a>
              </div>
            </ScrollReveal>

            {/* Quick Metrics */}
            <div className="flex items-center justify-center lg:justify-start mt-10">
              <div className="bg-white px-5 py-3 rounded-[14px] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] flex items-center gap-4">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="#f1f5f9"
                      strokeWidth="4"
                      fill="transparent"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="#14142B"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray="125"
                      strokeDashoffset="25"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-sm font-extrabold text-slate-900">
                    15k+
                  </span>
                </div>
                <div className="text-left pr-2">
                  <div className="flex gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-3 h-3 fill-blue-900 text-sky-600 stroke-none"
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Active Businesses
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <ScrollReveal
            direction="up"
            delay={200}
            className="lg:col-span-6 relative flex justify-center lg:justify-end mt-12 lg:mt-0 h-[500px]"
          >
            {/* Abstract Blob Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-slate-200 to-slate-100 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-70 blur-xl animate-pulse"></div>

            {/* Main Image with Floating Animation */}
            <div className="relative z-10 w-full max-w-[450px] h-full flex items-center justify-center animate-float group">
              {/* Dynamic Glow Behind Image */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 blur-3xl rounded-full scale-75 -z-10 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-blue-500/50 group-hover:to-purple-500/50 transition-all duration-700 ease-in-out"></div>

              <img
                src="/f1.png"
                alt="Intuik Smart QR Standee"
                className="w-full h-auto object-cover rounded-3xl scale-[1.15] shadow-2xl drop-shadow-[0_20px_50px_rgba(30,58,138,0.3)] relative z-10"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute bottom-20 -right-6 z-20 bg-white px-5 py-3 rounded-[14px] shadow-xl flex items-center gap-2 border border-gray-100 transform hover:-translate-y-1 transition-transform">


            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Partners Grayscale logo banner */}
      <section className="bg-white border-y border-[#E2E8F0] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest font-sans">
            Trusted by 15,000+ businesses across India
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-slate-900/65 font-bold text-xs uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-sky-600" />
              <span>Cafes & Bistros</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-600" />
              <span>Retail Boutiques</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-600" />
              <span>Hotels & Clinics</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-500 shrink-0" />
              <span>GMB Partners</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Summary Section */}
      <section id="features" className="bg-slate-50 text-slate-900 py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="eyebrow mb-4 inline-block">Powerful Capabilities</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Scale Your Business <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Automatically</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-16 text-lg">
            Our suite of AI-driven tools helps you capture leads, engage customers 24/7, and skyrocket your online reputation effortlessly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-left">
            <div className="trust-card">
              <div className="w-14 h-14 rounded-xl bg-sky-50 flex items-center justify-center mb-6 shadow-sm"><QrCode className="w-7 h-7 text-sky-600" /></div>
              <h3 className="text-xl font-heading font-bold mb-3">Smart AI-Review QR Kit</h3>
              <p className="text-slate-600 mb-6">Generate personalized Google review QR codes and auto-reply to reviews using AI to boost local SEO.</p>
              <ul className="space-y-2 mb-0">
                <li className="flex items-center gap-2 text-base text-slate-800 font-semibold"><Check className="w-4 h-4 text-amber-500" /> Custom Branded Link</li>
                <li className="flex items-center gap-2 text-base text-slate-800 font-semibold"><Check className="w-4 h-4 text-amber-500" /> AI SEO Prompts</li>
                <li className="flex items-center gap-2 text-base text-slate-800 font-semibold"><Check className="w-4 h-4 text-amber-500" /> Auto-Replies</li>
              </ul>
            </div>
            <div className="trust-card">
              <div className="w-14 h-14 rounded-xl bg-sky-50 flex items-center justify-center mb-6 shadow-sm"><Headphones className="w-7 h-7 text-sky-600" /></div>
              <h3 className="text-xl font-heading font-bold mb-3">AI Telecalling Agent</h3>
              <p className="text-slate-600 mb-6">A human-like voice AI that books appointments and follows up with leads in multiple languages.</p>
              <ul className="space-y-2 mb-0">
                <li className="flex items-center gap-2 text-base text-slate-800 font-semibold"><Check className="w-4 h-4 text-amber-500" /> Natural Voice Engine</li>
                <li className="flex items-center gap-2 text-base text-slate-800 font-semibold"><Check className="w-4 h-4 text-amber-500" /> Auto-Scheduling</li>
                <li className="flex items-center gap-2 text-base text-slate-800 font-semibold"><Check className="w-4 h-4 text-amber-500" /> CRM Integration</li>
              </ul>
            </div>
            <div className="trust-card">
              <div className="w-14 h-14 rounded-xl bg-sky-50 flex items-center justify-center mb-6 shadow-sm"><MessageCircle className="w-7 h-7 text-sky-600" /></div>
              <h3 className="text-xl font-heading font-bold mb-3">WhatsApp Chatbot</h3>
              <p className="text-slate-600 mb-6">Automate product discovery and lead qualification 24x7 with interactive WhatsApp bots.</p>
              <ul className="space-y-2 mb-0">
                <li className="flex items-center gap-2 text-base text-slate-800 font-semibold"><Check className="w-4 h-4 text-amber-500" /> 24/7 Auto Replies</li>
                <li className="flex items-center gap-2 text-base text-slate-800 font-semibold"><Check className="w-4 h-4 text-amber-500" /> Smart Lead Qualify</li>
                <li className="flex items-center gap-2 text-base text-slate-800 font-semibold"><Check className="w-4 h-4 text-amber-500" /> Payments & Flows</li>
              </ul>
            </div>
          </div>

          <Link href="/features" className="btn-primary inline-flex shadow-lg hover:shadow-sky-500/25">
            See All Detailed Features <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* How it Works */}
      <section
        id="how-it-works"
        className="py-16 px-6 max-w-7xl mx-auto text-center"
      >
        <div className="flex flex-col items-center gap-4 mb-12">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-widest bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] px-3.5 py-1.5 rounded-[14px] font-sans">
            Simple 3-Step Flow
          </span>
          <h2 className="text-3xl md:text-5xl font-sans tracking-tight font-bold text-slate-900 leading-tight">
            How It Works
          </h2>
          <p className="text-slate-700 max-w-md text-lg font-medium">
            Collect verified reviews with absolutely zero friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-[#FFFFFF] border border-slate-200 p-6 rounded-[14px] shadow-sm hover:border-slate-200 hover:scale-[1.01] transition-all relative text-left">
            <div className="w-12 h-12 rounded-full bg-white text-sky-600 border-2 border-[#2361F5] flex items-center justify-center font-sans tracking-tight font-bold text-sm mb-6 shadow-sm">
              01
            </div>
            <h3 className="text-lg font-sans tracking-tight font-bold text-slate-900 mb-2">
              Place standee at checkout
            </h3>
            <p className="text-base text-slate-800 leading-relaxed font-semibold">
              Set up the custom acrylic standee on your counter or table, with
              its integrated smart NFC chip and high-contrast QR code.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-slate-200 p-6 rounded-[14px] shadow-sm hover:border-slate-200 hover:scale-[1.01] transition-all relative text-left">
            <div className="w-12 h-12 rounded-full bg-white text-sky-600 border-2 border-[#2361F5] flex items-center justify-center font-sans tracking-tight font-bold text-sm mb-6 shadow-sm">
              02
            </div>
            <h3 className="text-lg font-sans tracking-tight font-bold text-slate-900 mb-2">
              Customer taps or scans
            </h3>
            <p className="text-base text-slate-800 leading-relaxed font-semibold">
              The customer places their phone near the standee (NFC) or scans
              the QR code. The portal launches instantly in their browser.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-slate-200 p-6 rounded-[14px] shadow-sm hover:border-slate-200 hover:scale-[1.01] transition-all relative text-left">
            <div className="w-12 h-12 rounded-full bg-white text-sky-600 border-2 border-[#2361F5] flex items-center justify-center font-sans tracking-tight font-bold text-sm mb-6 shadow-sm">
              03
            </div>
            <h3 className="text-lg font-sans tracking-tight font-bold text-slate-900 mb-2">
              Selects AI Review suggestion
            </h3>
            <p className="text-base text-slate-800 leading-relaxed font-semibold">
              The user selects one of our smart AI review prompts (copied
              instantly), and is immediately sent to Google Reviews to paste and
              post.
            </p>
          </div>
        </div>
      </section>

      {/* Product Card Detail */}
      <section
        id="product"
        className="py-16 px-6 border-t border-[#e2e8f0]/80 relative"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-widest bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] px-3 py-1.5 rounded-[14px] self-center lg:self-start font-sans">
              Premium Hardware Set
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans tracking-tight font-bold text-slate-900 leading-snug">
              Google Review Tap Standee & Card <br />
              <span className="text-sky-600 text-base md:text-lg font-bold block mt-2 leading-relaxed font-sans">
                White PVC Card with High-Performance NTAG213 Chip & fall-back
                Branded QR Code sign
              </span>
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-semibold">
              Get Google Reviews instantly using physical tap-and-go technology.
              The smart NFC chip communicates directly with nearby smartphones,
              launching your custom review landing page in less than a second.
              Equipped with a custom fallback QR code for older devices.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 text-left border-t border-[#E2E8F0] pt-6">
              <div className="flex gap-3.5 items-start">
                <div className="bg-[#FFFFFF] border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-2 rounded-[14px] text-sky-600 shrink-0">
                  <Smartphone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-sans tracking-tight font-bold text-slate-900 text-xs">
                    Smart NFC Chip
                  </h4>
                  <p className="text-base text-slate-800 font-semibold mt-1">
                    Built-in high-performance smart chip triggers the portal
                    automatically on touch. No app download needed.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="bg-[#FFFFFF] border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-2 rounded-[14px] text-sky-600 shrink-0">
                  <QrCode className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-sans tracking-tight font-bold text-slate-900 text-xs">
                    Custom Branded QRs
                  </h4>
                  <p className="text-base text-slate-800 font-semibold mt-1">
                    Interactive QR generator to generate high-contrast codes
                    branded with your primary color.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="bg-[#FFFFFF] border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-2 rounded-[14px] text-sky-600 shrink-0">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-sans tracking-tight font-bold text-slate-900 text-xs">
                    Credit Card Size
                  </h4>
                  <p className="text-base text-slate-800 font-semibold mt-1">
                    Sleek, lightweight, ultra-thin PVC design matches standard
                    credit card dimensions (85.6mm x 54mm).
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="bg-[#FFFFFF] border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-2 rounded-[14px] text-sky-600 shrink-0">
                  <Zap className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-sans tracking-tight font-bold text-slate-900 text-xs">
                    Real-Time Stats
                  </h4>
                  <p className="text-base text-slate-800 font-semibold mt-1">
                    Track views, scans, and converted positive reviews. Shield
                    negative comments before they reach Google.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative rounded-[20px] overflow-hidden shadow-2xl drop-shadow-[0_20px_50px_rgba(30,58,138,0.15)] w-full max-w-md group transition-all">
              <img
                src="/1234.png"
                alt="Google Review Smart Connect QR Standee and Card"
                className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products & Pricing Section */}
      <section
        id="pricing"
        className="py-16 px-6 bg-white border-t border-slate-200 relative overflow-hidden"
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #2361F5 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/[0.03] rounded-full blur-[150px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest bg-white/5 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] px-3.5 py-1.5 rounded-[14px] font-sans">
              Our Products
            </span>
            <h2 className="text-3xl md:text-5xl font-sans tracking-tight font-bold text-slate-900">
              Choose Your <span className="text-sky-600">Growth Engine</span>
            </h2>
            <p className="text-slate-700 max-w-lg text-lg font-medium">
              Three powerful products to accelerate your business. Pick one or
              combine them for maximum impact.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Product 2 — AI Telecalling Agent */}
            <div className="trust-card flex flex-col justify-between relative overflow-hidden group transition-all duration-300">
              {/* Glow */}

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-[14px] bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-sans tracking-tight font-bold text-slate-900 leading-tight">
                      AI Telecalling
                    </h3>
                    <p className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">
                      Voice AI Agent
                    </p>
                  </div>
                </div>

                <div className="mb-6 pb-5 border-b border-slate-200">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-sans tracking-tight font-extrabold text-slate-900">
                      ₹14,999
                    </span>
                    <span className="text-xs text-gray-400 font-bold">
                      / year
                    </span>
                  </div>
                  <p className="text-base text-slate-800 font-semibold mt-1">
                    Human-like AI voice calls
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Human-Like AI Voice</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Smart Appointment Scheduling</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Lead Filtering & Scoring</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Multi-Lingual (7+ Languages)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>CRM Integration</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Real-time Analytics</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Smart Re-try Engine</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="btn-primary w-full mt-4 z-10"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Product 1 — Smart AI-Review QR Kit (Best Seller) */}
            <div className="trust-card flex flex-col justify-between relative group transition-all duration-300 scale-[1.05] border-sky-200 shadow-xl shadow-sky-500/10 hover:border-sky-300 bg-white z-10 lg:-mt-4 lg:mb-4">
              {/* Glow container */}
              <div className="absolute inset-0 overflow-hidden rounded-[14px] pointer-events-none">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-900/5 rounded-full blur-3xl" />
              </div>

              {/* Best Seller badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-extrabold px-6 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-slate-900/20 z-20 ring-4 ring-white whitespace-nowrap">
                Best Seller
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className="w-12 h-12 rounded-[14px] bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-sans tracking-tight font-bold text-slate-900 leading-tight">
                      Smart AI-Review
                    </h3>
                    <p className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">
                      QR Kit
                    </p>
                  </div>
                </div>

                <div className="mb-6 pb-5 border-b border-slate-200">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-sans tracking-tight font-extrabold text-slate-900">
                      ₹4,999
                    </span>
                    <span className="text-xs text-gray-400 font-bold">
                      / year
                    </span>
                  </div>
                  <p className="text-base text-slate-800 font-semibold mt-1">
                    Best for growing businesses
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Personalized Google Review QR & Link</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>AI SEO-Friendly Review Suggestions</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Keywords Updation Dashboard</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>AI Auto Reply to All Reviews</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Printed QR Code Standee</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-sky-600 font-bold">
                      Free Smart NFC Card
                    </span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handlePurchasePlan("Professional")}
                className="btn-primary w-full mt-4 z-10"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Product 3 — WhatsApp Chatbot */}
            <div className="trust-card flex flex-col justify-between relative overflow-hidden group transition-all duration-300">
              {/* Glow */}
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-500/3 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-[14px] bg-amber-500/10 border border-[#FF5A3C]/25 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-sans tracking-tight font-bold text-slate-900 leading-tight">
                      WhatsApp Chatbot
                    </h3>
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                      Button-Based Automation
                    </p>
                  </div>
                </div>

                <div className="mb-6 pb-5 border-b border-[#FF5A3C]/15">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-sans tracking-tight font-extrabold text-slate-900">
                      ₹9,999
                    </span>
                    <span className="text-xs text-gray-400 font-bold">
                      / year
                    </span>
                  </div>
                  <p className="text-base text-slate-800 font-semibold mt-1">
                    24×7 WhatsApp automation
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>24×7 Auto Replies</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Smart Lead Qualification</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Instant Product Suggestions</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Multi-Language Support</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Payment & CRM Integration</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-base text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Button-Based Flow Builder</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="btn-primary w-full mt-4 z-10"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Bottom note */}
          <div className="text-center mt-12">
            <p className="text-gray-400 text-xs font-semibold">
              All plans billed annually • Cancel anytime • Setup assistance
              included
            </p>
          </div>
        </div>
      </section>
      <section className="py-16 px-6 bg-white/40 border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center flex flex-col items-center gap-4 mb-12">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-widest bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] px-3.5 py-1.5 rounded-[14px] font-sans">
              Success Stories
            </span>
            <h2 className="text-2xl md:text-4xl font-sans tracking-tight font-bold text-slate-900">
              Loved by Business Owners
            </h2>
            <p className="text-slate-700 max-w-md text-lg font-medium">
              Real reviews from local stores, clinics, and franchises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-6.5 rounded-[14px] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-3.5 h-3.5 fill-blue-900 text-sky-600 stroke-none"
                    />
                  ))}
                </div>
                <p className="text-base text-slate-800 leading-relaxed font-medium italic">
                  "Our café in Mumbai got over 120 Google reviews in the first
                  month alone of putting the Intuik tap card on our billing
                  counter. It works instantly!"
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-8 h-8 rounded-[14px] bg-[#FFFFFF] border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] text-slate-900 flex items-center justify-center font-bold text-sm">
                  RK
                </div>
                <div>
                  <h4 className="text-xs font-sans tracking-tight font-bold text-slate-900">
                    Rohan Kulkarni
                  </h4>
                  <p className="text-sm text-slate-700 font-bold">
                    Brew & Bite Café (Mumbai)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-6.5 rounded-[14px] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-3.5 h-3.5 fill-blue-900 text-sky-600 stroke-none"
                    />
                  ))}
                </div>
                <p className="text-base text-slate-800 leading-relaxed font-medium italic">
                  "As a dentist, patient trust is everything. The Intuik NFC
                  card is perfect. We hand it to patients at checkout, they tap,
                  and we get 5-star ratings directly."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-8 h-8 rounded-[14px] bg-[#FFFFFF] border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] text-slate-900 flex items-center justify-center font-bold text-sm">
                  AS
                </div>
                <div>
                  <h4 className="text-xs font-sans tracking-tight font-bold text-slate-900">
                    Dr. Ananya Sharma
                  </h4>
                  <p className="text-sm text-slate-700 font-bold">
                    Smile Care Dental (Delhi)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-6.5 rounded-[14px] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-3.5 h-3.5 fill-blue-900 text-sky-600 stroke-none"
                    />
                  ))}
                </div>
                <p className="text-base text-slate-800 leading-relaxed font-medium italic">
                  "We operate 4 organic salon locations in Bangalore. The
                  private feedback shield has saved us from 3 different negative
                  reviews by catching issues early."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-8 h-8 rounded-[14px] bg-[#FFFFFF] border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] text-slate-900 flex items-center justify-center font-bold text-sm">
                  VR
                </div>
                <div>
                  <h4 className="text-xs font-sans tracking-tight font-bold text-slate-900">
                    Vikram Rao
                  </h4>
                  <p className="text-sm text-slate-700 font-bold">
                    Aura Salon & Spa (Bangalore)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-16 px-6 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-widest bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] px-3.5 py-1.5 rounded-[14px] font-sans">
              FAQ
            </span>
            <h2 className="text-2xl md:text-3xl font-sans tracking-tight font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <details className="group border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] p-5 [&_summary::-webkit-details-marker]:hidden bg-white">
              <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                <h3 className="text-base md:text-lg font-sans tracking-tight font-bold text-slate-900">
                  Do customers need to install an app to tap or scan?
                </h3>
                <span className="text-sky-600 group-open:rotate-180 transition-transform">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </span>
              </summary>
              <p className="text-sm text-slate-800 leading-relaxed font-semibold mt-3 pt-3 border-t border-[#E2E8F0]">
                No, customers do not need to install any app. The NFC chip
                launches the web portal natively inside their phone's built-in
                browser (Safari or Chrome) in a fraction of a second.
              </p>
            </details>

            <details className="group border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] p-5 [&_summary::-webkit-details-marker]:hidden bg-white">
              <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                <h3 className="text-base md:text-lg font-sans tracking-tight font-bold text-slate-900">
                  What is the difference between NFC and QR code?
                </h3>
                <span className="text-sky-600 group-open:rotate-180 transition-transform">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </span>
              </summary>
              <p className="text-sm text-slate-800 leading-relaxed font-semibold mt-3 pt-3 border-t border-[#E2E8F0]">
                NFC (Near Field Communication) works on touch: clients place
                their phone near the standee to open the page. The QR code works
                by scanning with the camera as a fallback. Every Intuik standee
                includes both.
              </p>
            </details>

            <details className="group border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] p-5 [&_summary::-webkit-details-marker]:hidden bg-white">
              <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                <h3 className="text-base md:text-lg font-sans tracking-tight font-bold text-slate-900">
                  How does the negative review shield work?
                </h3>
                <span className="text-sky-600 group-open:rotate-180 transition-transform">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </span>
              </summary>
              <p className="text-sm text-slate-800 leading-relaxed font-semibold mt-3 pt-3 border-t border-[#E2E8F0]">
                When a user selects a low rating (below your threshold, e.g. 3
                stars), the funnel redirects them to a private comment form on
                the dashboard instead of Google Reviews. This allows you to
                resolve client issues privately.
              </p>
            </details>
          </div>
        </div>
      </section>


      {/* Purchase Plan Modal */}
      {isBuyModalOpen && user && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] w-full max-w-4xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-250 text-slate-900">
            <button
              onClick={() => setIsBuyModalOpen(false)}
              className="absolute top-6 right-6 text-sky-600 hover:text-slate-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-widest bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] px-3 py-1 rounded-[14px] font-sans font-semibold">
                Premium Plans
              </span>
              <h3 className="text-2xl md:text-3xl font-sans tracking-tight font-bold text-slate-900 mt-2">
                Activate Intuik Premium
              </h3>
              <p className="text-sm text-slate-800 font-medium mt-1">
                Select a plan below to activate your account for company:{" "}
                <strong className="text-slate-900">{user.companyName}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Plan 1 */}
              <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] p-6 flex flex-col justify-between group">
                <div>
                  <h4 className="font-sans tracking-tight font-bold text-slate-900">
                    Starter
                  </h4>
                  <p className="text-[10px] text-slate-700 font-semibold mt-0.5">
                    Ideal for single locations
                  </p>
                  <div className="my-5">
                    <span className="text-3xl font-sans tracking-tight font-extrabold text-slate-900">
                      ₹699
                    </span>
                    <span className="text-sm text-slate-800 font-bold">
                      {" "}
                      / year
                    </span>
                  </div>
                  <ul className="space-y-2.5 text-sm text-slate-800 border-t border-[#E2E8F0] pt-4 font-semibold">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />{" "}
                      <span>1 Active Location</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />{" "}
                      <span>Standard QR Code</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />{" "}
                      <span>Basic Scan Analytics</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handlePurchasePlan("Starter")}
                  disabled={purchasingPlan !== null}
                  className="mt-6 w-full bg-white hover:bg-[#141f36] text-[#FFFFFF] border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] font-sans tracking-tight font-bold text-xs py-3 rounded-[14px] transition-all disabled:opacity-50"
                >
                  {purchasingPlan === "Starter"
                    ? "Processing..."
                    : "Select Starter"}
                </button>
              </div>

              {/* Plan 2 */}
              <div className="bg-white border-2 border-[#14142B] rounded-[14px] p-6 relative shadow flex flex-col justify-between group">
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-white text-sky-600 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] text-[11px] font-bold px-2.5 py-0.5 rounded-[14px] uppercase tracking-wider">
                  Best Seller
                </div>
                <div>
                  <h4 className="font-sans tracking-tight font-bold text-slate-900">
                    Growth
                  </h4>
                  <p className="text-[10px] text-slate-700 font-semibold mt-0.5">
                    Best for growing stores
                  </p>
                  <div className="my-5">
                    <span className="text-3xl font-sans tracking-tight font-extrabold text-slate-900">
                      ₹1,599
                    </span>
                    <span className="text-sm text-slate-800 font-bold">
                      {" "}
                      / year
                    </span>
                  </div>
                  <ul className="space-y-2.5 text-sm text-slate-800 border-t border-[#E2E8F0] pt-4 font-semibold">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />{" "}
                      <span>5 Active Locations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />{" "}
                      <span>AI SEO Review Prompts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />{" "}
                      <span>Keywords Dashboard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />{" "}
                      <span>AI Review Auto-Replies</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handlePurchasePlan("Professional")}
                  disabled={purchasingPlan !== null}
                  className="mt-6 w-full bg-white text-sky-600 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] font-sans tracking-tight font-bold text-xs py-3 rounded-[14px] hover:bg-[#141f36] transition-all shadow disabled:opacity-50"
                >
                  {purchasingPlan === "Professional"
                    ? "Processing..."
                    : "Select Growth"}
                </button>
              </div>

              {/* Plan 3 */}
              <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] p-6 flex flex-col justify-between group">
                <div>
                  <h4 className="font-sans tracking-tight font-bold text-slate-900">
                    Enterprise
                  </h4>
                  <p className="text-[10px] text-slate-700 font-semibold mt-0.5">
                    For chain franchises
                  </p>
                  <div className="my-5">
                    <span className="text-3xl font-sans tracking-tight font-extrabold text-slate-900">
                      ₹3,499
                    </span>
                    <span className="text-sm text-slate-800 font-bold">
                      {" "}
                      / year
                    </span>
                  </div>
                  <ul className="space-y-2.5 text-sm text-slate-800 border-t border-[#E2E8F0] pt-4 font-semibold">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />{" "}
                      <span>Unlimited Locations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />{" "}
                      <span>White-labeled Domains</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />{" "}
                      <span>API & Webhooks</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handlePurchasePlan("Enterprise")}
                  disabled={purchasingPlan !== null}
                  className="mt-6 w-full bg-white hover:bg-[#141f36] text-[#FFFFFF] border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] font-sans tracking-tight font-bold text-xs py-3 rounded-[14px] transition-all disabled:opacity-50"
                >
                  {purchasingPlan === "Enterprise"
                    ? "Processing..."
                    : "Select Enterprise"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Footer Section */}
      <footer className="relative footer-dark pt-10 pb-6 overflow-hidden border-t border-slate-800 mt-8 selection:bg-sky-500 selection:text-white">
        {/* Glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-900/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #2361F5 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 mb-8 border-b border-slate-200 pb-8">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <div className="flex items-center mb-4">
                <div className="bg-white/95 py-2.5 px-4 rounded-[14px] shadow-lg shadow-[#2361F5]/10 border border-white/20 inline-flex items-center justify-center">
                  <img
                    src="/logoen.png"
                    alt="Intuik Logo"
                    className="h-14 w-auto mix-blend-multiply object-contain"
                    style={{ filter: "contrast(1.05)" }}
                  />
                </div>
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6 max-w-sm">
                Elevating local businesses with premium AI-powered review
                acquisition, smart NFC tap cards, and intelligent auto-reply
                systems.
              </p>

              {/* Newsletter */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">
                  Stay Updated
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] text-sm text-slate-900 px-4 py-2.5 rounded-[14px] w-full max-w-[240px] focus:outline-none focus:border-slate-200 transition-colors placeholder:text-slate-600"
                  />
                  <button className="bg-sky-500 hover:bg-sky-400 text-white p-2.5 rounded-[14px] transition-colors shadow-md flex items-center justify-center shrink-0">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-200">
                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-8 h-8 rounded-full bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-slate-200 transition-all hover:scale-110 shadow-sm hover:shadow-[0_0_15px_rgba(201,166,107,0.15)]"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-slate-200 transition-all hover:scale-110 shadow-sm hover:shadow-[0_0_15px_rgba(201,166,107,0.15)]"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-slate-200 transition-all hover:scale-110 shadow-sm hover:shadow-[0_0_15px_rgba(201,166,107,0.15)]"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-slate-200 transition-all hover:scale-110 shadow-sm hover:shadow-[0_0_15px_rgba(201,166,107,0.15)]"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 lg:ml-12">
              {/* Products */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  Products
                </h4>
                <ul className="space-y-4 text-sm font-medium text-slate-400">
                  <li>
                    <a
                      href="/features#smart-qr"
                      className="hover:text-sky-600 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-blue-900/0 group-hover:bg-blue-900 transition-all" />{" "}
                      Smart QR Kit
                    </a>
                  </li>
                  <li>
                    <a
                      href="/features#telecalling"
                      className="hover:text-sky-600 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-blue-900/0 group-hover:bg-blue-900 transition-all" />{" "}
                      AI Telecalling
                    </a>
                  </li>
                  <li>
                    <a
                      href="/features#whatsapp"
                      className="hover:text-sky-600 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-blue-900/0 group-hover:bg-blue-900 transition-all" />{" "}
                      WhatsApp Bot
                    </a>
                  </li>
                  <li>
                    <a
                      href="/features#smart-qr"
                      className="hover:text-sky-600 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-blue-900/0 group-hover:bg-blue-900 transition-all" />{" "}
                      NFC Standees
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-sky-600" />
                  Company
                </h4>
                <ul className="space-y-4 text-sm font-medium text-slate-400">
                  <li>
                    <a
                      href="#"
                      className="hover:text-sky-600 transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-sky-600 transition-colors"
                    >
                      Partner Program
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-sky-600 transition-colors"
                    >
                      Case Studies
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-sky-600 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div className="col-span-2 md:col-span-1">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-sky-600" />
                  Contact
                </h4>
                <ul className="space-y-5 text-sm font-medium text-slate-400">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-4.5 h-4.5 text-sky-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      313, Ganpati Arcade,
                      <br />
                      Gurgaon, Haryana 122001
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <MessageSquare className="w-4.5 h-4.5 text-sky-600 shrink-0" />
                    <a
                      href="mailto:intuiktechnologies@gmail.com"
                      className="hover:text-sky-600 transition-colors"
                    >
                      intuiktechnologies@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-slate-400 font-medium">
            <p>
              © {new Date().getFullYear()} Intuik Technologies. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-sky-500 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-sky-500 transition-colors">
                Privacy
              </a>
              <div className="flex items-center gap-2 text-sky-500 ml-2 pl-6 border-l border-slate-700">
                <Globe className="w-3.5 h-3.5" />
                <span>India (EN)</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
