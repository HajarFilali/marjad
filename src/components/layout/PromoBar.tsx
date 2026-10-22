"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Banknote,
  Truck,
  ShieldCheck,
  User,
  ChevronDown,
  LogOut,
} from "lucide-react";

export function PromoBar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    fullName?: string;
    email?: string;
    avatarUrl?: string;
  } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check auth and user info
  useEffect(() => {
    const checkAuth = () => {
      try {
        const auth =
          typeof window !== "undefined" &&
          localStorage.getItem("marjad_admin_auth") === "true";
        setIsLoggedIn(auth);

        const stored = localStorage.getItem("marjad_user_profile");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUserProfile(parsed);
        } else if (auth) {
          const email = localStorage.getItem("marjad_admin_email") || "contact.marjad@gmail.com";
          setUserProfile({
            fullName: "Marjad Admin",
            email,
          });
        } else {
          setUserProfile(null);
        }
      } catch (e) {
        console.warn("Auth check error:", e);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("marjad_auth_change", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("marjad_auth_change", checkAuth);
    };
  }, [pathname]);

  // Handle click outside & escape to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("marjad_admin_auth");
      localStorage.removeItem("marjad_admin_email");
      document.cookie = "marjad_admin_auth=; path=/; max-age=0";
      setIsLoggedIn(false);
      setIsDropdownOpen(false);
      window.dispatchEvent(new Event("marjad_auth_change"));
    } catch (e) {
      console.warn("Logout error:", e);
    }
  };

  const [translateY, setTranslateY] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let ticking = false;
    let prevOffset = -1;
    let prevScrolled = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const offset = Math.min(36, Math.max(0, scrollY));
          const scrolled = scrollY > 30;
          if (offset !== prevOffset) {
            setTranslateY(-offset);
            setOpacity(Math.max(0, 1 - offset / 28));
            prevOffset = offset;
          }
          if (scrolled !== prevScrolled) {
            setIsScrolled(scrolled);
            prevScrolled = scrolled;
          }
          ticking = false;
        });
        ticking = true;
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

  // Hide PromoBar completely on /login, /admin and /profile pages
  if (pathname === "/login" || pathname?.startsWith("/admin") || pathname === "/profile") {
    return null;
  }

  return (
    <div
      className="promo-bar-container fixed top-0 left-0 right-0 w-full bg-[#000000] text-[#ffffff] select-none z-[101] border-b border-[#ebd8be]/15"
      style={{
        height: "36px",
        transform: `translateY(${translateY}px)`,
        opacity,
        pointerEvents: opacity < 0.1 ? "none" : "auto",
        willChange: "transform, opacity",
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

        {/* Right part: Connexion button OR User Profile dropdown when logged in */}
        <div
          ref={dropdownRef}
          className="shrink-0 h-full flex items-center border-l border-white/25 pl-2 sm:pl-3 pr-3 sm:pr-5 bg-black z-20 relative"
        >
          {isLoggedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex items-center gap-1.5 sm:gap-2 text-white hover:text-[#d4a853] transition-colors cursor-pointer group py-1"
                title="Mon Compte Administrateur"
              >
                {userProfile?.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.fullName || "Admin"}
                    className="w-4.5 h-4.5 rounded-full object-cover border border-[#d4a853]"
                  />
                ) : (
                  <div className="w-4.5 h-4.5 rounded-full bg-[#ba4e1a] text-white flex items-center justify-center font-bold text-[9px]">
                    {(userProfile?.fullName || "M").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-[11px] font-semibold text-white group-hover:text-[#d4a853] max-w-[110px] sm:max-w-[140px] truncate transition-colors">
                  {userProfile?.fullName || "Marjad Admin"}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-stone-300 group-hover:text-[#d4a853] transition-all duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Exact Dropdown matching Vinillia reference screenshot */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border border-[#EDE5E0] p-3 text-[#1F2937] z-[200] animate-in fade-in zoom-in-95 duration-150">
                  {/* Header: User Avatar + Name + Email */}
                  <div className="flex items-center gap-3 px-1.5 py-1">
                    {userProfile?.avatarUrl ? (
                      <img
                        src={userProfile.avatarUrl}
                        alt={userProfile.fullName || "Admin"}
                        className="w-10 h-10 rounded-full object-cover border border-[#ba4e1a] shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#6d381e] text-white flex items-center justify-center font-serif font-bold text-base shrink-0 shadow-xs">
                        {(userProfile?.fullName || "M").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs sm:text-sm text-[#1F2937] truncate">
                        {userProfile?.fullName || "Marjad Admin"}
                      </h4>
                      <p className="text-[11px] text-neutral-400 font-medium truncate">
                        {userProfile?.email || "contact.marjad@gmail.com"}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-2 border-t border-[#EDE5E0]" />

                  {/* Navigation Links */}
                  <div className="space-y-1">
                    <Link
                      href="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#6d381e]/10 text-[#6d381e] font-bold text-xs transition cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#ba4e1a] shrink-0" />
                      <span>Tableau de bord Admin</span>
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#FAF7F2] text-[#1F2937] hover:text-[#6d381e] font-semibold text-xs transition cursor-pointer"
                    >
                      <User className="w-4 h-4 text-neutral-500 shrink-0" />
                      <span>Mon Profil</span>
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="my-1.5 border-t border-[#EDE5E0]" />

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold text-xs transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold text-stone-200 hover:text-[#d4a853] hover:bg-white/5 transition-all tracking-wide cursor-pointer group"
              title="Espace Connexion Administrateur"
            >
              <User className="w-3.5 h-3.5 text-[#d4a853] group-hover:scale-110 transition-transform" />
              <span className="font-medium">Connexion</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
