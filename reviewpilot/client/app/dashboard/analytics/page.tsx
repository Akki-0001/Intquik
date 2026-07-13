"use client";

import React, { useState, useEffect } from "react";
import {
  Building,
  TrendingUp,
  Smartphone,
  Globe,
  ShieldAlert,
  BarChart3,
  Calendar,
  SmartphoneIcon,
  LaptopIcon,
  TabletIcon
} from "lucide-react";
import { getDB, Review, Scan, Business } from "@/lib/db";

export default function AnalyticsPage() {
  const [data, setData] = useState<{
    businesses: Business[];
    reviews: Review[];
    scans: Scan[];
  }>({ businesses: [], reviews: [], scans: [] });

  const [selectedBizId, setSelectedBizId] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDB();
    setData({
      businesses: db.businesses,
      reviews: db.reviews,
      scans: db.scans,
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Filter Data
  const scans = selectedBizId === "all" ? data.scans : data.scans.filter(s => s.businessId === selectedBizId);
  const reviews = selectedBizId === "all" ? data.reviews : data.reviews.filter(r => r.businessId === selectedBizId);

  // Stats Calculations
  const totalScans = scans.length;
  const totalReviews = reviews.length;
  const publicReviews = reviews.filter(r => r.status === "public").length;
  const privateReviews = reviews.filter(r => r.status === "private").length;

  const reviewRate = totalScans > 0 ? ((totalReviews / totalScans) * 100).toFixed(0) : "0";
  const redirectRate = totalReviews > 0 ? ((publicReviews / totalReviews) * 100).toFixed(0) : "0";

  // Device Breakdown
  const devices = scans.reduce((acc, s) => {
    acc[s.device] = (acc[s.device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mobileCount = devices['mobile'] || 0;
  const tabletCount = devices['tablet'] || 0;
  const desktopCount = devices['desktop'] || 0;
  const maxDeviceCount = Math.max(mobileCount, tabletCount, desktopCount, 1);

  // Group scans/reviews by date for 10-day bar chart
  const last10Days = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const chartData = last10Days.map(dateStr => {
    const dailyScans = scans.filter(s => s.timestamp.startsWith(dateStr)).length;
    const dailyReviews = reviews.filter(r => r.createdAt.startsWith(dateStr)).length;
    return { date: dateStr, scans: dailyScans, reviews: dailyReviews };
  });

  const maxChartVal = Math.max(...chartData.map(d => d.scans), 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Header and filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-blue-950 tracking-tight">Performance Analytics</h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">Analyze QR scan conversion, device demographics, and public routing metrics.</p>
        </div>

        {/* Business Selector */}
        <div className="flex items-center gap-2 bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] px-3 py-1.5 rounded-[14px] shadow-sm">
          <Building className="w-4 h-4 text-blue-600 shrink-0" />
          <select
            value={selectedBizId}
            onChange={(e) => setSelectedBizId(e.target.value)}
            className="bg-transparent border-none text-xs text-blue-800 focus:outline-none cursor-pointer pr-4 font-bold"
          >
            <option value="all">All Locations</option>
            {data.businesses.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

        {/* Card 1 */}
        <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/80 p-5 rounded-3xl shadow-sm">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total scans</p>
          <div className="text-2xl md:text-3xl font-extrabold text-blue-950 mt-2">{totalScans}</div>
          <div className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3 text-blue-650" />
            <span className="text-blue-600 font-bold">+12%</span>
            <span>scan growth</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/80 p-5 rounded-3xl shadow-sm">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Conversion rate</p>
          <div className="text-2xl md:text-3xl font-extrabold text-blue-950 mt-2">{reviewRate}%</div>
          <div className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1 font-semibold">
            <span>Scan to feedback completion</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/80 p-5 rounded-3xl shadow-sm">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Google Redirects</p>
          <div className="text-2xl md:text-3xl font-extrabold text-blue-600 mt-2">{publicReviews}</div>
          <div className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1 font-semibold">
            <span className="text-blue-600 font-bold">{redirectRate}%</span>
            <span>routed to public lists</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/80 p-5 rounded-3xl shadow-sm">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Negative Shielded</p>
          <div className="text-2xl md:text-3xl font-extrabold text-amber-600 mt-2">{privateReviews}</div>
          <div className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1 font-semibold">
            <span>Concerns resolved privately</span>
          </div>
        </div>

      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Timeline Stacked Bar Chart */}
        <div className="lg:col-span-8 bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-6 rounded-3xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-blue-950">Scan Conversion Timeline</h3>
                <p className="text-[11px] text-gray-500 font-semibold">Scans vs reviews completed over the last 10 days</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-slate-100 border border-slate-205 rounded" />
                  <span>Scans</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded" />
                  <span>Reviews</span>
                </div>
              </div>
            </div>

            {/* Custom SVG Stacked Bar Chart */}
            <div className="h-56 w-full relative pt-4 flex items-end">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-slate-100 w-full h-0" />
                <div className="border-b border-slate-100 w-full h-0" />
                <div className="border-b border-slate-100 w-full h-0" />
                <div className="border-b border-slate-100 w-full h-0" />
              </div>

              <div className="flex-1 h-full w-full flex items-end justify-between relative px-2 z-10">
                {chartData.map((d, idx) => {
                  const scansPct = (d.scans / maxChartVal) * 100;
                  const reviewsPct = (d.reviews / maxChartVal) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end px-1.5">

                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] text-[9px] font-bold px-2 py-1 rounded-[14px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-25 text-left space-y-0.5 text-blue-900">
                        <p className="text-gray-400 font-bold">{new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                        <p className="text-slate-650">Scans: <span className="font-mono font-black">{d.scans}</span></p>
                        <p className="text-blue-600">Reviews: <span className="font-mono font-black">{d.reviews}</span></p>
                      </div>

                      {/* Bar Stack */}
                      <div className="w-full relative h-full flex flex-col justify-end">
                        {/* Scans bar */}
                        <div
                          className="w-full bg-slate-100 rounded-t-lg absolute bottom-0 left-0 transition-all group-hover:bg-slate-200"
                          style={{ height: `${Math.max(scansPct, 4)}%` }}
                        />
                        {/* Reviews overlay bar */}
                        <div
                          className="w-full bg-blue-600 rounded-t-lg absolute bottom-0 left-0 transition-all group-hover:bg-blue-750 z-10"
                          style={{ height: `${Math.max(reviewsPct, 2)}%` }}
                        />
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* X-axis */}
            <div className="flex justify-between px-2 mt-4 text-[9px] text-gray-400 font-bold font-mono">
              {chartData.map((d, idx) => {
                const dateObj = new Date(d.date);
                return (
                  <span key={idx}>
                    {dateObj.getDate()}/{dateObj.getMonth() + 1}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Device breakdown (Horizontal bars) */}
        <div className="lg:col-span-4 bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] p-6 rounded-3xl shadow-sm">
          <h3 className="text-sm font-bold text-blue-950 mb-1">Device Breakdown</h3>
          <p className="text-[11px] text-gray-500 font-semibold mb-6">Device models customers scanned from</p>

          <div className="space-y-5">
            {/* Mobile bar */}
            <div>
              <div className="flex justify-between text-xs font-bold text-blue-800 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <SmartphoneIcon className="w-4 h-4 text-blue-600" />
                  <span>Mobile Smartphone</span>
                </div>
                <span className="font-mono text-gray-500">{mobileCount} scans</span>
              </div>
              <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/60">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(mobileCount / maxDeviceCount) * 100}%` }} />
              </div>
            </div>

            {/* Tablet bar */}
            <div>
              <div className="flex justify-between text-xs font-bold text-blue-800 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <TabletIcon className="w-4 h-4 text-indigo-500" />
                  <span>iPad & Tablet</span>
                </div>
                <span className="font-mono text-gray-500">{tabletCount} scans</span>
              </div>
              <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/60">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(tabletCount / maxDeviceCount) * 100}%` }} />
              </div>
            </div>

            {/* Desktop test scans bar */}
            <div>
              <div className="flex justify-between text-xs font-bold text-blue-800 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <LaptopIcon className="w-4 h-4 text-purple-500" />
                  <span>Desktop Simulators</span>
                </div>
                <span className="font-mono text-gray-500">{desktopCount} scans</span>
              </div>
              <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/60">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(desktopCount / maxDeviceCount) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Scan Log Table */}
      <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-blue-950">Live Activity Scan Log</h3>
          <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Real-time scan logs and submission states</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">Device</th>
                <th className="py-3 px-6">Location</th>
                <th className="py-3 px-6">Submitted Review?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-gray-500">
              {scans.slice(0, 5).map((scan) => {
                const biz = data.businesses.find(b => b.id === scan.businessId);
                return (
                  <tr key={scan.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-6 font-mono text-gray-500">{new Date(scan.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-6 capitalize font-semibold">{scan.device}</td>
                    <td className="py-3 px-6 font-bold text-blue-950">{biz?.name || "Unknown"}</td>
                    <td className="py-3 px-6">
                      {scan.converted ? (
                        <span className="bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-lg text-[10px]">
                          Yes
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-550 font-bold px-2 py-0.5 rounded-lg text-[10px]">
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
