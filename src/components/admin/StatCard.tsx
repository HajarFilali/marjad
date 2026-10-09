"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  subtext?: string;
  accentVariant?: "walnut" | "terracotta" | "sand" | "sage";
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#E9DCD5] shadow-2xs hover:shadow-xs hover:border-[#6d381e]/40 transition-all duration-200 flex flex-col justify-between min-h-[140px] sm:min-h-[150px] group">
      {/* Header: Professional walnut icon badge on left + label next to it */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#6d381e] group-hover:scale-105 transition-transform border border-[#E9DCD5]/60 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-[#6d381e]" />
        </div>
        <span className="text-xs sm:text-[13px] font-semibold text-[#4B5563] leading-snug line-clamp-1">
          {label}
        </span>
      </div>

      {/* Centered big value in bold serif */}
      <div className="flex-1 flex items-center justify-center py-2 sm:py-3">
        <div className="text-2xl sm:text-3xl font-bold text-[#1F2937] font-serif tracking-tight text-center">
          {value}
        </div>
      </div>
    </div>
  );
};
