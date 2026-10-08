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
  change,
  changeType = "positive",
  icon: Icon,
  subtext,
  accentVariant = "walnut",
}) => {
  const getStyles = () => {
    switch (accentVariant) {
      case "terracotta":
        return {
          iconBg: "bg-[#ba4e1a]/10",
          iconColor: "text-[#ba4e1a]",
          borderHover: "hover:border-[#ba4e1a]/50",
          dot: "bg-[#ba4e1a]",
        };
      case "sand":
        return {
          iconBg: "bg-[#c59a59]/15",
          iconColor: "text-[#9e7638]",
          borderHover: "hover:border-[#c59a59]/50",
          dot: "bg-[#c59a59]",
        };
      case "sage":
        return {
          iconBg: "bg-[#4E7365]/10",
          iconColor: "text-[#4E7365]",
          borderHover: "hover:border-[#4E7365]/50",
          dot: "bg-[#4E7365]",
        };
      case "walnut":
      default:
        return {
          iconBg: "bg-[#6d381e]/10",
          iconColor: "text-[#6d381e]",
          borderHover: "hover:border-[#6d381e]/50",
          dot: "bg-[#6d381e]",
        };
    }
  };

  const theme = getStyles();

  return (
    <div
      className={`bg-white p-5 sm:p-6 rounded-3xl border border-[#EDE9E6] shadow-[0_4px_16px_rgba(109,56,30,0.04)] hover:shadow-[0_8px_24px_rgba(109,56,30,0.08)] ${theme.borderHover} transition-all duration-300 group`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B7280] font-sans">
          {label}
        </span>
        <div
          className={`w-11 h-11 rounded-full ${theme.iconBg} ${theme.iconColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-2xs`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="font-serif font-bold text-3xl text-[#1F2937] tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              changeType === "positive"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : changeType === "negative"
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : "bg-[#EDE9E6] text-[#4B5563]"
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs text-[#6B7280] mt-2 font-sans font-medium flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
          <span>{subtext}</span>
        </p>
      )}
    </div>
  );
};
