"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  QrCode, 
  Download, 
  Printer, 
  Building, 
  Sparkles, 
  Type, 
  Palette, 
  Grid,
  FileCheck,
  Star,
  Coffee,
  Heart,
  Activity,
  Nfc,
  CreditCard
} from "lucide-react";
import { getDB, Business } from "@/lib/db";

import QRCode from "qrcode";

// Helper to generate a real QR code matrix grid using the qrcode package
const generateRealQrMatrix = (bizId?: string) => {
  // Point the QR code directly to the frontend review page
  // The frontend handles scan tracking via API call on load.
  const frontendUrl = typeof window !== 'undefined' ? window.location.origin : "https://intquik-amr2.vercel.app";
  const url = bizId ? `${frontendUrl}/review/${bizId}` : "http://intuik.com";
  
  // Use High error correction so the center badge doesn't break scannability
  const qr = QRCode.create(url, { errorCorrectionLevel: 'H' });
  const size = qr.modules.size;
  const matrix: number[][] = [];
  
  for (let y = 0; y < size; y++) {
    const row: number[] = [];
    for (let x = 0; x < size; x++) {
      row.push(qr.modules.data[y * size + x]);
    }
    matrix.push(row);
  }
  return matrix;
};

export default function QrGeneratorPage() {
  const searchParams = useSearchParams();
  const bizIdParam = searchParams.get("bizId");

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(null);

  // Customizer state
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [dotStyle, setDotStyle] = useState<"square" | "rounded" | "dots">("square");
  const [centerIcon, setCenterIcon] = useState<"none" | "star" | "coffee" | "heart" | "health">("none");
  const [tagline, setTagline] = useState("Scan to Review Us!");
  const [offerText, setOfferText] = useState("Help our local business grow");
  const [saving, setSaving] = useState(false);

  // QR grid representation
  const [qrMatrix, setQrMatrix] = useState<number[][]>([]);
  
  // Preview mode
  const [previewMode, setPreviewMode] = useState<"qr" | "nfc">("qr");

  const loadQRConfig = async (bizId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qr/${bizId}`, {
        credentials: "include",
      });
      if (res.ok) {
        const config = await res.json();
        setFgColor("#000000");
        setBgColor("#FFFFFF");
        setDotStyle("square");
        setCenterIcon("none");
        setTagline(config.tagline || "Scan to Review Us!");
        setOfferText(config.offerText || "Help our local business grow");
      }
    } catch (err) {
      console.error("Failed to load QR Config from backend", err);
    }
  };

  const loadData = async () => {
    const db = getDB();
    if (db.user) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((b: any) => ({
            id: b._id,
            name: b.name,
            googleReviewUrl: b.googleReviewUrl,
            yelpReviewUrl: b.yelpReviewUrl,
            primaryColor: b.primaryColor,
            ratingThreshold: b.ratingThreshold,
            logoUrl: b.logoUrl,
            createdAt: b.createdAt,
          }));
          setBusinesses(mapped);

          let activeBiz = mapped[0] || null;
          if (bizIdParam) {
            const found = mapped.find((b: any) => b.id === bizIdParam);
            if (found) activeBiz = found;
          }
          setSelectedBiz(activeBiz);
          if (activeBiz) {
            setFgColor("#000000");
            loadQRConfig(activeBiz.id);
          }
          return;
        }
      } catch (err) {
        console.error("Backend offline, falling back to local storage", err);
      }
    }

    setBusinesses(db.businesses);
    let activeBiz = db.businesses[0] || null;
    if (bizIdParam) {
      const found = db.businesses.find(b => b.id === bizIdParam);
      if (found) activeBiz = found;
    }
    setSelectedBiz(activeBiz);
    if (activeBiz) {
      setFgColor("#000000");
    }
  };

  useEffect(() => {
    loadData();
    setQrMatrix(generateRealQrMatrix(bizIdParam || ""));
  }, [bizIdParam]);

  const handleBizChange = (id: string) => {
    const found = businesses.find(b => b.id === id) || null;
    setSelectedBiz(found);
    if (found) {
      setFgColor("#000000");
      const db = getDB();
      if (db.user) {
        loadQRConfig(found.id);
      }
      setQrMatrix(generateRealQrMatrix(found.id));
    }
  };


  const handleSaveConfig = async () => {
    if (!selectedBiz) return;
    setSaving(true);
    const db = getDB();
    if (db.user) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qr/${selectedBiz.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fgColor,
            bgColor,
            dotStyle,
            centerIcon,
            tagline,
            offerText,
          }),
          credentials: "include",
        });
        if (res.ok) {
          alert("QR Code settings saved successfully!");
        }
      } catch (err) {
        console.error("Failed to save QR Config to backend", err);
      }
    }
    setSaving(false);
  };

  // Download Action
  const handleDownloadSvg = () => {
    const svgEl = document.getElementById("qr-svg");
    if (!svgEl) return;
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `intuik-qr-${selectedBiz?.name.toLowerCase().replace(/\s+/g, "-") || "code"}.svg`;
    link.click();
  };

  // Print Action
  const handlePrint = () => {
    window.print();
  };

  if (!selectedBiz) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-3">
          <Building className="w-10 h-10 text-gray-400 mx-auto" />
          <p className="text-sm font-bold text-gray-500">Please create a business profile first.</p>
          <Link href="/dashboard/businesses" className="text-xs text-blue-600 font-bold hover:underline">
            Go to Businesses page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 print:bg-white print:text-black">
      
      {/* Header instructions */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Review Growth System</span>
          </div>
          <h2 className="text-xl font-black text-blue-950 tracking-tight">Smart CONNECT QR & NFC</h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">Brand, customize, and print vector QR codes or order pre-configured NFC Tap-to-Review cards.</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={handleDownloadSvg}
            className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] text-blue-800 text-xs font-bold px-4 py-2.5 rounded-[14px] hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Download SVG</span>
          </button>
          
          <button
            onClick={() => setPreviewMode("nfc")}
            className="bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-[14px] hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-lg shadow-indigo-500/10"
          >
            <Nfc className="w-4 h-4" />
            <span>Order NFC Cards</span>
          </button>
        </div>
      </div>

      {/* Main Builder Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Customize Panel */}
        <div className="lg:col-span-6 space-y-6 print:hidden">
          <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/80 p-6 rounded-3xl space-y-6 shadow-sm">
            
            {/* Location selector */}
            <div>
              <label className="text-xs font-bold text-blue-800 block mb-2 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-blue-600" />
                <span>Selected Location</span>
              </label>
              <select
                value={selectedBiz.id}
                onChange={(e) => handleBizChange(e.target.value)}
                className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4 py-2.5 text-xs text-blue-950 focus:outline-none font-semibold"
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Custom texts */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-blue-600" />
                <span>Custom Table Card Copy</span>
              </h3>
              
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Header Headline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Scan to Review Us!"
                  className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4 py-2 text-xs text-blue-950 focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Sub-headline Description</label>
                <input
                  type="text"
                  value={offerText}
                  onChange={(e) => setOfferText(e.target.value)}
                  placeholder="Help our local business grow"
                  className="w-full bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-[14px] px-4 py-2 text-xs text-blue-950 focus:outline-none font-semibold"
                />
              </div>
            </div>

            {/* Styling */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-blue-600" />
                <span>Professional QR Design</span>
              </h3>
              <p className="text-xs text-gray-500 font-semibold">
                Your QR code uses a clean, high-contrast professional design for maximum scannability on all devices.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={saving}
                className="w-full bg-blue-600 text-white text-xs font-bold py-2.5 rounded-[14px] hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10"
              >
                <QrCode className="w-4 h-4" />
                <span>{saving ? "Saving Configuration..." : "Save QR Settings"}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Right Side: Visual Preview / Table Tent Print Layout */}
        <div className="lg:col-span-6 flex flex-col items-center gap-6">
          
          {/* View Toggle */}
          <div className="flex bg-slate-100 p-1.5 rounded-[14px] w-full max-w-[340px] print:hidden">
            <button
              onClick={() => setPreviewMode("qr")}
              className={`flex-1 py-2 rounded-[14px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${previewMode === "qr" ? "bg-white text-blue-950 shadow-sm" : "text-gray-500 hover:text-blue-800"}`}
            >
              <QrCode className="w-4 h-4" />
              <span>Smart QR Stand</span>
            </button>
            <button
              onClick={() => setPreviewMode("nfc")}
              className={`flex-1 py-2 rounded-[14px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${previewMode === "nfc" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "text-gray-500 hover:text-blue-800"}`}
            >
              <Nfc className="w-4 h-4" />
              <span>NFC Card Mockup</span>
            </button>
          </div>

          {previewMode === "qr" ? (
            <>
              {/* Card Standing Tent Display container */}
              <div className="relative w-[340px] bg-white text-blue-950 border border-slate-300 shadow-2xl p-8 rounded-3xl flex flex-col items-center justify-between text-center select-none print:shadow-none print:border-none print:w-full print:max-w-md print:-mt-10">
                
                {/* Folds Indicator */}
            <div className="absolute top-2 left-0 right-0 flex justify-center print:hidden">
              <span className="text-[9px] font-mono text-gray-400 tracking-wider">▲ STANDING TABLE TENT TEMPLATE ▲</span>
            </div>

            {/* Business Logo branding bubble */}
            {selectedBiz.logoUrl ? (
              <img 
                src={selectedBiz.logoUrl} 
                alt={selectedBiz.name} 
                className="w-14 h-14 rounded-[14px] object-cover shadow-md mb-6 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]"
              />
            ) : (
              <div 
                className="w-14 h-14 rounded-[14px] flex items-center justify-center text-white text-xl font-bold shadow-md mb-6"
                style={{ backgroundColor: fgColor }}
              >
                {selectedBiz.name[0].toUpperCase()}
              </div>
            )}

            {/* Custom Copy texts */}
            <div className="space-y-1.5 mb-6">
              <h3 className="text-xl font-extrabold tracking-tight text-blue-950">{tagline}</h3>
              <p className="text-xs font-semibold text-gray-500 px-6 leading-relaxed">{offerText}</p>
            </div>

            {/* Dynamic Vector SVG QR Code */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-6 flex justify-center items-center">
              <svg 
                id="qr-svg"
                width="160" 
                height="160" 
                viewBox={`0 0 ${qrMatrix.length} ${qrMatrix.length}`} 
                style={{ backgroundColor: bgColor }}
                className="w-40 h-40"
              >
                {/* Background */}
                <rect width={qrMatrix.length} height={qrMatrix.length} fill={bgColor} />
                
                {/* Grid Dots */}
                {qrMatrix.map((row, y) => {
                  return row.map((val, x) => {
                    if (val === 0) return null;
                    
                    // Render finder patterns as clean solid structures
                    const size = qrMatrix.length;
                    const isFinder = 
                      (x < 7 && y < 7) || 
                      (x > size - 8 && y < 7) || 
                      (x < 7 && y > size - 8);

                    if (isFinder) {
                      // Custom rendering finder squares
                      return (
                        <rect 
                          key={`${x}-${y}`} 
                          x={x} 
                          y={y} 
                          width="1" 
                          height="1" 
                          fill={fgColor} 
                        />
                      );
                    }

                    // Dot shape customizations
                    if (dotStyle === "rounded") {
                      return (
                        <rect 
                          key={`${x}-${y}`} 
                          x={x + 0.15} 
                          y={y + 0.15} 
                          width="0.7" 
                          height="0.7" 
                          rx="0.35" 
                          fill={fgColor} 
                        />
                      );
                    } else if (dotStyle === "dots") {
                      return (
                        <circle 
                          key={`${x}-${y}`} 
                          cx={x + 0.5} 
                          cy={y + 0.5} 
                          r="0.3" 
                          fill={fgColor} 
                        />
                      );
                    } else {
                      return (
                        <rect 
                          key={`${x}-${y}`} 
                          x={x} 
                          y={y} 
                          width="1" 
                          height="1" 
                          fill={fgColor} 
                        />
                      );
                    }
                  });
                })}

                {/* Center Badge logo overlay overlay */}
                {centerIcon !== "none" && (
                  <>
                    <rect x={qrMatrix.length/2 - 2.5} y={qrMatrix.length/2 - 2.5} width="5" height="5" fill={bgColor} rx="1" />
                    <rect x={qrMatrix.length/2 - 2} y={qrMatrix.length/2 - 2} width="4" height="4" fill={fgColor} rx="0.5" />
                    {centerIcon === "star" && (
                      <path 
                        d={`M${qrMatrix.length/2} ${qrMatrix.length/2 - 1.5}l.5 1h1.1l-.8.6.3 1-.9-.6-.9.6.3-1-.8-.6h1.1z`}
                        fill={bgColor} 
                      />
                    )}
                    {centerIcon === "coffee" && (
                      <path 
                        d={`M${qrMatrix.length/2 - 1} ${qrMatrix.length/2 - 0.5}h2v1.5a1 1 0 01-1 1h0a1 1 0 01-1-1zm2 .3h.5a.5.5 0 01.5.5v0a.5.5 0 01-.5.5h-.5z`}
                        fill={bgColor} 
                        stroke={bgColor}
                        strokeWidth="0.2"
                      />
                    )}
                    {centerIcon === "heart" && (
                      <path 
                        d={`M${qrMatrix.length/2} ${qrMatrix.length/2 + 1.5}s-2-1.2-2-2.2a1 1 0 011.7-.7l.3.3.3-.3a1 1 0 011.7.7c0 1-2 2.2-2 2.2z`}
                        fill={bgColor} 
                      />
                    )}
                    {centerIcon === "health" && (
                      <path 
                        d={`M${qrMatrix.length/2 - 0.5} ${qrMatrix.length/2 - 1.5}h1v3h-1zm-1 1h3v1h-3z`}
                        fill={bgColor} 
                      />
                    )}
                  </>
                )}

              </svg>
            </div>

            {/* Stars visual */}
            <div className="flex gap-1 justify-center mb-6">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>

            {/* Footer tag */}
            <div className="border-t border-slate-100 pt-4 w-full flex flex-col gap-0.5 text-center">
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Feedback portal link</span>
              <span className="text-[10px] font-bold text-blue-900 font-mono tracking-tight lowercase">
                intuik.com/rev/{selectedBiz.id}
              </span>
            </div>

          </div>
          </>
          ) : (
            // NFC Card Mockup
            <div className="relative w-[340px] h-[215px] rounded-[14px] shadow-2xl flex flex-col items-center justify-center text-center select-none overflow-hidden group hover:-translate-y-2 transition-transform duration-500" style={{ backgroundColor: bgColor }}>
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, ${fgColor} 0%, transparent 70%)` }} />
              
              <div className="absolute top-4 right-4 opacity-50">
                <Nfc className="w-8 h-8" style={{ color: fgColor }} />
              </div>

              {/* Business Logo branding bubble */}
              {selectedBiz.logoUrl ? (
                <img 
                  src={selectedBiz.logoUrl} 
                  alt={selectedBiz.name} 
                  className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-white/20 mb-4 z-10"
                />
              ) : (
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4 z-10"
                  style={{ backgroundColor: fgColor }}
                >
                  {selectedBiz.name[0].toUpperCase()}
                </div>
              )}

              <h3 className="text-xl font-black tracking-tight z-10" style={{ color: fgColor }}>{selectedBiz.name}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60 z-10" style={{ color: fgColor }}>Tap to Review</p>
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10 opacity-40">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" style={{ color: fgColor }} />)}
                </div>
                <CreditCard className="w-4 h-4" style={{ color: fgColor }} />
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
