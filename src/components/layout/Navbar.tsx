"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ShoppingBag, Heart, Menu, X, ArrowRight, Users, Banknote, Truck, ShieldCheck, Search } from "lucide-react";
import { SearchModal } from "@/components/search/SearchModal";

export function Navbar() {
  const pathname = usePathname();
  const { openCart, totalItems } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();
  const [currentLang, setCurrentLang] = useState<"FR" | "AR">("FR");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Initialize to false on both server and client for deterministic hydration match
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);

  // Active section tracking ("accueil", "boutique", "a-propos", "contact")
  const [activeSection, setActiveSection] = useState<string>("accueil");

  // Navigation Links: Accueil, Boutique, À propos, Contact
  const navLinks = [
    { id: "accueil", label: "Accueil", href: "/" },
    { id: "boutique", label: "Boutique", href: "/boutique" },
    { id: "a-propos", label: "À propos", href: "/#a-propos" },
    { id: "contact", label: "Contact", href: "/contact" },
  ];

  // Synchronous layout check to sync state right after hydration & route changes
  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const scrollY = window.scrollY;
    const hasHash = Boolean(window.location.hash);
    const isScrolledPage = scrollY > 40 || hasHash;

    if (pathname === "/contact") {
      setActiveSection("contact");
    } else if (pathname === "/boutique") {
      setActiveSection("boutique");
    } else if (pathname === "/login") {
      setActiveSection("");
    } else if (hasHash) {
      setActiveSection(window.location.hash.replace("#", ""));
    } else {
      setActiveSection("accueil");
    }

    if (isScrolledPage) {
      document.documentElement.classList.add("is-scrolled-page");
      setIsScrolled(true);
      if (bgRef.current) {
        bgRef.current.style.background = "#ffffff";
      }
    } else {
      document.documentElement.classList.remove("is-scrolled-page");
      setIsScrolled(false);
      if (bgRef.current) {
        bgRef.current.style.background =
          pathname === "/"
            ? "linear-gradient(90deg, #ffffff 0%, #ffffff 28%, rgba(255, 255, 255, 0.70) 54%, rgba(255, 255, 255, 0.35) 100%)"
            : "#ffffff";
      }
    }
  }, [pathname]);

  // Scroll listener for hero loading background, promo bar dissolve threshold, and section spy
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const effectiveY = scrollY;

      if (pathname === "/") {
        const heroSection = document.querySelector("section");
        const maxScroll = heroSection ? Math.max(300, heroSection.offsetHeight - 120) : 450;
        const p = Math.min(1, Math.max(0, effectiveY / maxScroll));

        if (bgRef.current) {
          if (p >= 1) {
            bgRef.current.style.background = "#ffffff";
          } else {
            const solidWhiteStop = 28 + p * 72;
            const midStop = Math.min(100, solidWhiteStop + (100 - solidWhiteStop) * 0.40);
            bgRef.current.style.background = `linear-gradient(90deg, #ffffff 0%, #ffffff ${solidWhiteStop.toFixed(1)}%, rgba(255, 255, 255, 0.70) ${midStop.toFixed(1)}%, rgba(255, 255, 255, 0.35) 100%)`;
          }
        }

        // Active section spy on home page (only for local anchors)
        const aProposEl = document.getElementById("a-propos");
        const aProposTop = aProposEl ? aProposEl.offsetTop - 260 : 999999;

        if (effectiveY >= aProposTop) {
          setActiveSection("a-propos");
        } else {
          setActiveSection("accueil");
        }

        if (effectiveY < 35 && !window.location.hash) {
          document.documentElement.classList.remove("is-scrolled-page");
          try { sessionStorage.setItem("marjad_scrolled", "0"); } catch (e) {}
          setIsScrolled(false);
        } else if (effectiveY > 40 || Boolean(window.location.hash)) {
          document.documentElement.classList.add("is-scrolled-page");
          try { sessionStorage.setItem("marjad_scrolled", String(scrollY)); } catch (e) {}
          setIsScrolled(true);
        }
      } else {
        if (bgRef.current) {
          bgRef.current.style.background = "#ffffff";
        }
        if (pathname === "/contact") {
          setActiveSection("contact");
        } else if (pathname === "/login") {
          setActiveSection("");
        } else {
          setActiveSection("boutique");
        }
        if (effectiveY < 35 && !window.location.hash) {
          document.documentElement.classList.remove("is-scrolled-page");
          try { sessionStorage.setItem("marjad_scrolled", "0"); } catch (e) {}
          setIsScrolled(false);
        } else if (effectiveY > 40 || Boolean(window.location.hash)) {
          document.documentElement.classList.add("is-scrolled-page");
          try { sessionStorage.setItem("marjad_scrolled", String(scrollY)); } catch (e) {}
          setIsScrolled(true);
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    handleScroll();

    // Catch asynchronous browser scroll restoration ticks
    const timers = [30, 80, 150, 300, 600, 1000].map((delay) =>
      setTimeout(handleScroll, delay)
    );

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(animationFrameId);
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  const handleNavLinkClick = (e: React.MouseEvent, link: { id: string; href: string }) => {
    if (link.id === "accueil") {
      setActiveSection("accueil");
      setIsScrolled(false);
      document.documentElement.classList.remove("is-scrolled-page");
      try { sessionStorage.setItem("marjad_scrolled", "0"); } catch (e) {}
      if (pathname === "/") {
        e.preventDefault();
        if (window.location.hash) {
          window.history.pushState(null, "", "/");
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (link.id === "a-propos") {
      setActiveSection("a-propos");
      setIsScrolled(true);
      document.documentElement.classList.add("is-scrolled-page");
      try { sessionStorage.setItem("marjad_scrolled", "999"); } catch (e) {}
      if (pathname === "/") {
        e.preventDefault();
        const el = document.getElementById("a-propos");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", "/#a-propos");
        }
      }
    } else if (link.id === "contact") {
      setActiveSection("contact");
    } else if (link.id === "boutique") {
      setActiveSection("boutique");
    }
  };

  const isFusedHero =
    pathname === "/" &&
    !isScrolled &&
    !mobileMenuOpen;

  // Hide Navbar completely on /login and /admin pages
  if (pathname === "/login" || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
    <nav
      className={`fixed left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[94%] max-w-7xl transition-all duration-500 ease-out border-[#ebd8be]/80 ${
        isScrolled
          ? "top-3 sm:top-4 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)]"
          : "top-[44px] sm:top-[48px] shadow-[0_16px_36px_-10px_rgba(0,0,0,0.08)]"
      }`}
      style={{
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "rgba(235, 216, 190, 0.8)",
        borderTopLeftRadius: mobileMenuOpen ? "24px" : "9999px",
        borderTopRightRadius: mobileMenuOpen ? "24px" : "9999px",
        borderBottomRightRadius: mobileMenuOpen ? "24px" : "9999px",
        borderBottomLeftRadius: mobileMenuOpen ? "24px" : isFusedHero ? "0px" : "9999px",
        transition: "all 500ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Scroll-Linked Loading Background: White on the left (matching neck & card) expands to the right */}
      <div
        ref={bgRef}
        className="nav-bg-overlay absolute inset-0 pointer-events-none z-0 transition-all duration-500"
        style={{
          borderTopLeftRadius: mobileMenuOpen ? "24px" : "9999px",
          borderTopRightRadius: mobileMenuOpen ? "24px" : "9999px",
          borderBottomRightRadius: mobileMenuOpen ? "24px" : "9999px",
          borderBottomLeftRadius: mobileMenuOpen ? "24px" : isFusedHero ? "0px" : "9999px",
          transition: "all 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          background:
            "linear-gradient(90deg, #ffffff 0%, #ffffff 28%, rgba(255, 255, 255, 0.70) 54%, rgba(255, 255, 255, 0.35) 100%)",
        }}
      />

      <div className="relative z-10 w-full px-5 sm:px-7 lg:px-9">
        {/* Sleek height: h-14 sm:h-16 */}
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#1c1917] hover:text-[#c4622d] transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Left: Official Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              onClick={(e) => {
                setActiveSection("accueil");
                setIsScrolled(false);
                document.documentElement.classList.remove("is-scrolled-page");
                try { sessionStorage.setItem("marjad_scrolled", "0"); } catch (e) {}
                if (pathname === "/") {
                  e.preventDefault();
                  if (window.location.hash) {
                    window.history.pushState(null, "", "/");
                  }
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="flex items-center group py-1"
            >
              <Image
                src="/logo.png"
                alt="MARJAD - Sélection artisanale"
                width={135}
                height={35}
                priority
                className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-102"
              />
            </Link>
          </div>

          {/* Center: 4 Links in French - Centered relative to navbar width */}
          <div className="hidden md:flex items-center space-x-7 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive =
                pathname === "/contact"
                  ? link.id === "contact"
                  : pathname === "/boutique"
                  ? link.id === "boutique"
                  : pathname === "/"
                  ? activeSection === link.id
                  : pathname === link.href;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(e, link)}
                  className={`text-[13px] tracking-wide transition-colors relative py-1 ${
                    isActive
                      ? "text-[#c4622d] font-bold after:w-full after:bg-[#c4622d]"
                      : "text-[#1c1917] font-semibold hover:text-[#c4622d] after:w-0 hover:after:w-full after:bg-[#c4622d]/60"
                  } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: Exact Order Requested -> [FR / AR] then [Favoris] then [Panier on FAR RIGHT] */}
          <div className="flex items-center space-x-3 sm:space-x-4">

            {/* 1. Language Selector: FR / AR Div */}
            <div className="flex items-center p-0.5 bg-[#ffffff] border border-[#ebd8be] rounded-full shadow-2xs">
              <button
                onClick={() => setCurrentLang("FR")}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-full transition-all duration-200 ${currentLang === "FR"
                    ? "bg-[#1c1917] text-[#ffffff] shadow-xs"
                    : "text-[#1c1917]/70 hover:text-[#1c1917]"
                  }`}
              >
                FR
              </button>
              <button
                onClick={() => setCurrentLang("AR")}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-full transition-all duration-200 ${currentLang === "AR"
                    ? "bg-[#1c1917] text-[#ffffff] shadow-xs"
                    : "text-[#1c1917]/70 hover:text-[#1c1917]"
                  }`}
              >
                AR
              </button>
            </div>

            {/* 2. Bouton Recherche (Recherche intelligente produits) - Entre [FR/AR] et [Favoris] */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 text-[#1c1917] hover:text-[#c4622d] relative transition-colors cursor-pointer group"
              title="Rechercher des produits"
              aria-label="Recherche"
            >
              <Search className="w-5 h-5 stroke-[1.8] transition-transform group-hover:scale-110" />
            </button>

            {/* 3. Favoris (Wishlist Drawer) */}
            <button
              onClick={openWishlist}
              className="p-1.5 text-[#1c1917] hover:text-[#c4622d] relative transition-colors cursor-pointer"
              title="Mes Favoris"
              aria-label="Favoris"
            >
              <Heart className="w-5 h-5 stroke-[1.8]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c4622d] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* 4. Panier (Cart Page /panier) - FAR RIGHT as requested */}
            <Link
              href="/panier"
              className="p-1.5 text-[#1c1917] hover:text-[#c4622d] relative transition-colors cursor-pointer"
              title="Mon Panier"
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c4622d] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </Link>

          </div>
        </div>
      </div>

      {/* ================= FUSED HERO CARD & CONNECTOR NECK (Unified Solid Container) ================= */}
      {pathname === "/" && (
        <div
          className={`fused-hero-card-container absolute -left-[1px] top-full w-full max-w-[385px] sm:max-w-[445px] lg:max-w-[485px] z-30 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            !isFusedHero
              ? "opacity-0 -translate-y-8 scale-[0.96] pointer-events-none"
              : "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          }`}
          style={{
            transformOrigin: "top left",
            willChange: "transform, opacity",
          }}
        >
          {/* Connector Neck: 100% Vector Driven - Zero Cover Strips */}
          <div
            className="relative h-[70px] pointer-events-none z-20"
            style={{
              width: 240,
              borderLeft: "1px solid rgba(235, 216, 190, 0.8)",
            }}
          >
            <svg
              width="240"
              height="70"
              viewBox="0 0 240 70"
              className="w-[240px] h-[70px] block overflow-visible pointer-events-none"
              fill="none"
            >
              <defs>
                <linearGradient
                  id="neckArcBorder"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="70"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#ddcab3" />
                  <stop offset="100%" stopColor="#e8d8c2" />
                </linearGradient>
              </defs>
              {/* Pure solid white fill: extends 4px into nav and 4px into card so no horizontal seam can exist */}
              <path
                d="M 0 -4 L 240 -4 L 240 0.5 A 34.5 34.5 0 0 0 240 69.5 L 240 74 L 0 74 Z"
                fill="#ffffff"
              />
              {/* Perimeter border: Concave turnaround arc A 34.5 34.5 perfectly color-calibrated to nav bottom (#ddcab3) and card top (#e8d8c2) */}
              <path
                d="M 240 0.5 A 34.5 34.5 0 0 0 240 69.5"
                fill="none"
                stroke="url(#neckArcBorder)"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Hero Content Card */}
          <div className="relative w-full z-10 -mt-[1px]">
            <div
              className="p-5 sm:p-6 lg:p-6.5 rounded-b-[32px] rounded-tr-[28px] rounded-tl-none relative flex flex-col space-y-3.5 sm:space-y-4 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.08)] box-border"
              style={{
                background:
                  "linear-gradient(180deg, #ffffff 0%, #ffffff 22%, rgba(255, 255, 255, 0.85) 55%, rgba(255, 255, 255, 0.50) 82%, rgba(255, 255, 255, 0.32) 100%)",
                backdropFilter: "blur(28px) saturate(180%)",
                WebkitBackdropFilter: "blur(28px) saturate(180%)",
                border: "1px solid rgba(235, 216, 190, 0.8)",
              }}
            >
              {/* Headline */}
              <div>
                <h1 className="text-2xl sm:text-[27px] lg:text-[29px] font-serif font-black tracking-tight text-[#1c1917] leading-[1.16]">
                  L’artisanat marocain, <br />
                  <span className="text-[#a84414]">au cœur de votre intérieur</span>
                </h1>

                {/* Moroccan authentic geometric motif (Khatam zellige) */}
                <div className="flex items-center gap-2 pt-2.5 pb-1">
                  <svg
                    className="w-4 h-4 text-[#a84414] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="5" y="5" width="14" height="14" rx="1.5" />
                    <rect x="5" y="5" width="14" height="14" rx="1.5" transform="rotate(45 12 12)" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  </svg>
                  <div className="w-16 h-[1.5px] bg-gradient-to-r from-[#a84414] via-[#a84414]/40 to-transparent rounded-full" />
                </div>
              </div>

              {/* Value Proposition Description - spaced comfortably */}
              <p className="text-xs sm:text-[13px] text-[#1c1917]/85 leading-relaxed font-medium pt-1">
                Découvrez des créations uniques mêlant bois, métal et motifs marocains, pensées pour apporter une touche d&apos;authenticité et d&apos;élégance à votre espace.
              </p>

              {/* 3 Piliers de Réassurance Client (COD, Toutes Villes, Anti-Casse) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-0.5">
                {/* Pilier 1 : Paiement COD */}
                <div
                  className="p-2 sm:p-2.5 rounded-2xl flex flex-col justify-between gap-1.5 transition-all duration-300 hover:bg-white/90 hover:shadow-xs group cursor-default"
                  style={{
                    background: "rgba(255, 255, 255, 0.70)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.85)",
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#f5ede2] border border-[#ebd8be]/50 flex items-center justify-center shrink-0 shadow-2xs">
                      <Banknote className="w-3.5 h-3.5 text-[#a84414]" />
                    </div>
                    <p className="text-[11px] sm:text-xs font-bold text-[#1c1917] tracking-tight whitespace-nowrap">
                      Paiement COD
                    </p>
                  </div>
                  <p className="text-[9.5px] sm:text-[10px] text-[#1c1917]/70 font-medium leading-tight pl-0.5">
                    À la réception
                  </p>
                </div>

                {/* Pilier 2 : Toutes Villes */}
                <div
                  className="p-2 sm:p-2.5 rounded-2xl flex flex-col justify-between gap-1.5 transition-all duration-300 hover:bg-white/90 hover:shadow-xs group cursor-default"
                  style={{
                    background: "rgba(255, 255, 255, 0.70)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.85)",
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#f5ede2] border border-[#ebd8be]/50 flex items-center justify-center shrink-0 shadow-2xs">
                      <Truck className="w-3.5 h-3.5 text-[#a84414]" />
                    </div>
                    <p className="text-[11px] sm:text-xs font-bold text-[#1c1917] tracking-tight whitespace-nowrap">
                      Toutes Villes
                    </p>
                  </div>
                  <p className="text-[9.5px] sm:text-[10px] text-[#1c1917]/70 font-medium leading-tight pl-0.5">
                    Express 48h–72h
                  </p>
                </div>

                {/* Pilier 3 : Anti-Casse */}
                <div
                  className="p-2 sm:p-2.5 rounded-2xl flex flex-col justify-between gap-1.5 transition-all duration-300 hover:bg-white/90 hover:shadow-xs group cursor-default"
                  style={{
                    background: "rgba(255, 255, 255, 0.70)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.85)",
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#f5ede2] border border-[#ebd8be]/50 flex items-center justify-center shrink-0 shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#a84414]" />
                    </div>
                    <p className="text-[11px] sm:text-xs font-bold text-[#1c1917] tracking-tight whitespace-nowrap">
                      Anti–Casse
                    </p>
                  </div>
                  <p className="text-[9.5px] sm:text-[10px] text-[#1c1917]/70 font-medium leading-tight pl-0.5">
                    Échange garanti
                  </p>
                </div>
              </div>

              {/* Action Buttons - sits directly and comfortably under description */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1.5 sm:pt-2">
                <Link
                  href="/boutique"
                  className="group flex-1 px-4 py-2.5 bg-gradient-to-r from-[#ba4e1a] to-[#9c3a0c] hover:from-[#9c3a0c] hover:to-[#822f08] text-white font-extrabold text-xs rounded-xl transition-all duration-300 shadow-md shadow-[#ba4e1a]/30 hover:shadow-lg hover:shadow-[#ba4e1a]/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-white" />
                  <span>Explorer la Boutique</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>

                <button
                  onClick={() => {
                    const el = document.getElementById("a-propos");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 text-xs font-black text-[#1c1917] hover:text-[#9c3a0c] hover:bg-white active:scale-95 cursor-pointer whitespace-nowrap hover:-translate-y-0.5 border border-[#ebd8be]/60 bg-white/70"
                >
                  <Users className="w-3.5 h-3.5 text-[#a84414]" />
                  <span>Notre Histoire</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="relative z-10 md:hidden mt-2 mx-2 mb-3 bg-[#ffffff]/95 backdrop-blur-xl border border-[#ebd8be]/60 rounded-2xl px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive =
              pathname === "/contact"
                ? link.id === "contact"
                : pathname === "/boutique"
                ? link.id === "boutique"
                : pathname === "/"
                ? activeSection === link.id
                : pathname === link.href;
            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavLinkClick(e, link);
                }}
                className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[#c4622d]/10 text-[#c4622d] font-bold"
                    : "text-[#1c1917] hover:bg-[#faf7f2] hover:text-[#c4622d]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
    
    {/* Modal de recherche intelligente & catalogue */}
    <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
