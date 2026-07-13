import React from "react";
import { TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
}

export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/60 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:border-blue-500/20">
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">{title}</span>
        <div className="bg-slate-100/60 p-2 rounded-[14px] border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/30 shadow-inner">
          {icon}
        </div>
      </div>
      <div className="text-2xl md:text-3xl font-black text-blue-950 tracking-tight">{value}</div>
      
      {trend && (
        <div className="text-[10px] text-slate-450 mt-2 flex items-center gap-1 font-semibold">
          {trend.isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
          ) : null}
          <span className={trend.isPositive ? "text-emerald-600 font-bold" : "text-gray-400 font-bold"}>
            {trend.value}
          </span>
          <span className="font-medium text-gray-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
