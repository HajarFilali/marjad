"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Banknote, Truck, ShieldCheck, User } from "lucide-react";

export function PromoBar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 35 && !window.location.hash) {
        setIsScrolled(false);
      } else if (scrollY > 40 || Boolean(window.location.hash)) {
        setIsScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    // Check across browser scroll restoration ticks
    const timers = [30, 80, 150, 300, 600, 1000].map((delay) =>
      setTimeout(handleScroll, delay)
    );

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      timers.forEach(clearTimeout);
    };
  }, []);

  const items = [
    {
      icon: Banknote,
      text: "Paiement COD à la réception",
    },
    {
      icon: Truck,
      text: "Toutes Villes · Express 48h–72h",
    },
    {
      icon: ShieldCheck,
      text: "Anti–Casse · Échange garanti",
    },
  ];

  // Repeat sequence so that half the track easily covers wide screens
  const trackItems = [...items, ...items, ...items, ...items];

  const isVisible = !isScrolled;

  // Hide PromoBar completely on /login and /admin pages
  if (pathname === "/login" || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      className={`promo-bar-container fixed top-0 left-0 right-0 w-full bg-[#000000] text-[#ffffff] select-none z-50 border-b border-[#ebd8be]/15 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        !isVisible
          ? "opacity-0 -translate-y-full pointer-events-none"
          : "opacity-100 translate-y-0 pointer-events-auto"
      }`}
      style={{
        height: "36px",
      }}
    >
      <div className="w-full h-full flex items-center justify-between">
        {/* Left part: Fills all available width right up to the border divider (No huge blank space) */}
        <div className="flex-1 min-w-0 h-full overflow-hidden relative flex items-center">
          <div className="animate-marquee flex items-center gap-8 sm:gap-10 whitespace-nowrap">
            {[...trackItems, ...trackItems].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-2 text-[11px] font-semibold tracking-wider">
                  <Icon className="w-3.5 h-3.5 text-[#d4a853] shrink-0 stroke-[2.2]" />
                  <span className="text-white hover:text-[#d4a853] transition-colors uppercase">
                    {item.text}
                  </span>
                  <span className="text-[#d4a853] font-bold ml-5">•</span>
                </div>
              );
            })}
          </div>
          {/* Subtle fade left edge only */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black to-transparent pointer-events-none" />
        </div>

        {/* Right part: Compact, snugly fitted Connexion button with clear vertical divider */}
        <div className="shrink-0 h-full flex items-center border-l border-white/25 pl-3 sm:pl-4 pr-3 sm:pr-5 bg-black z-10">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold text-stone-200 hover:text-[#d4a853] hover:bg-white/5 transition-all tracking-wide cursor-pointer group"
            title="Espace Connexion Administrateur"
          >
            <User className="w-3.5 h-3.5 text-[#d4a853] group-hover:scale-110 transition-transform" />
            <span className="font-medium">Connexion</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
