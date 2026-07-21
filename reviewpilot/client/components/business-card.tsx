"use client";

import React from "react";
import Link from "next/link";
import { 
  Building, 
  Star, 
  QrCode, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Eye 
} from "lucide-react";
import { Business } from "@/lib/db";

interface BusinessCardProps {
  business: Business;
  scansCount: number;
  reviewsCount: number;
  onEdit: (business: Business) => void;
  onDelete: (id: string) => void;
}

export default function BusinessCard({ 
  business, 
  scansCount, 
  reviewsCount, 
  onEdit, 
  onDelete 
}: BusinessCardProps) {
  return (
    <div className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)]/60 rounded-[28px] p-6 flex flex-col justify-between hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/[0.02] hover:-translate-y-1 transition-all duration-300 relative group">
      
      {/* Upper Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {business.logoUrl ? (
              <img 
                src={business.logoUrl} 
                alt={business.name} 
                className="w-12 h-12 rounded-[14px] object-cover shadow-sm border border-slate-100/80"
              />
            ) : (
              <div 
                className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white text-base font-extrabold shadow-md shadow-blue-500/5"
                style={{ 
                  backgroundColor: business.primaryColor,
                  backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.15), rgba(0,0,0,0.05))` 
                }}
              >
                {business.name[0].toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-sm font-extrabold text-blue-950 group-hover:text-blue-650 transition-colors">{business.name}</h3>
              <span className="text-[10px] text-gray-400 font-mono font-semibold">ID: {business.id}</span>
            </div>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={() => onEdit(business)}
              className="p-2 bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] hover:bg-slate-100 text-slate-450 hover:text-slate-950 rounded-[14px] transition-all"
              title="Edit Profile"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(business.id)}
              className="p-2 bg-slate-50 border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] hover:bg-red-50 text-slate-455 hover:text-red-650 rounded-[14px] transition-all"
              title="Delete Location"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Channels Info */}
        <div className="space-y-2.5 pt-3.5 border-t border-slate-100/60">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>Routing Threshold</span>
            <span className="font-bold text-blue-650 flex items-center gap-0.5">
              <span>&gt;= {business.ratingThreshold}</span>
              <Star className="w-3 h-3 fill-blue-550 stroke-none mb-0.5" />
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-550 font-semibold">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Google URL
            </span>
            <a 
              href={business.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-0.5 truncate max-w-[140px]"
            >
              <span>View Link</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          {business.yelpReviewUrl && (
            <div className="flex items-center justify-between text-xs text-slate-550 font-semibold">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Yelp URL
              </span>
              <a 
                href={business.yelpReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-0.5 truncate max-w-[140px]"
              >
                <span>View Link</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Stats row & public funnel actions */}
      <div className="mt-6 pt-4 border-t border-slate-100/60 flex items-center justify-between gap-4">
        
        {/* Scans and reviews counter */}
        <div className="flex gap-4">
          <div>
            <div className="text-xs font-bold text-blue-950 font-mono leading-none">{scansCount}</div>
            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">Scans</div>
          </div>
          <div>
            <div className="text-xs font-bold text-blue-950 font-mono leading-none">{reviewsCount}</div>
            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">Reviews</div>
          </div>
        </div>

        {/* Action links */}
        <div className="flex gap-2">
          <Link
            href={`/dashboard/qr-generator?bizId=${business.id}`}
            className="bg-white border-none shadow-[0_4px_20px_rgba(26,31,92,0.08)] hover:bg-slate-50 text-blue-800 text-[10px] font-bold px-3 py-2 rounded-[14px] flex items-center gap-1.5 transition-all"
          >
            <QrCode className="w-3.5 h-3.5 text-gray-500" />
            <span>QR</span>
          </Link>

          <Link
            href={`/review/${business.id}`}
            target="_blank"
            className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-2 rounded-[14px] flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Portal</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
