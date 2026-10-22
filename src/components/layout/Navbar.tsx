"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  ShoppingBag,
  Heart,
  Menu,
  X,
  Search,
  ChevronDown,
} from "lucide-react";
import { SearchModal } from "@/components/search/SearchModal";
import { DECOR_PRODUCTS } from "@/data/mockProducts";

const STORE_NAV_CATEGORIES = [
  { slug: "calligraphie", name: "Calligraphie Murale" },
  { slug: "etagere", name: "Étagères & Mobilier Mural" },
  { slug: "arche", name: "Arches & Panneaux" },
  { slug: "miroir", name: "Miroirs d'Art" },
  { slug: "medaillon", name: "Médaillons & Reliefs" },
];

export function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();
  const [currentLang, setCurrentLang] = useState<"FR" | "AR">("FR");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Active section tracking
  const [activeSection, setActiveSection] = useState<string>("accueil");

  // Dropdown Catégories
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic counts for each category
  const navCategories = useMemo(() => {
    return STORE_NAV_CATEGORIES.map((cat) => {
      const normSlug = cat.slug
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const count = DECOR_PRODUCTS.filter((p) => {
        const normProdCat = p.category
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        return (
          normProdCat.includes(normSlug) ||
          (normSlug.includes("calligraphie") && normProdCat.includes("calligraphie")) ||
          (normSlug.includes("etagere") && normProdCat.includes("etagere")) ||
          (normSlug.includes("arche") && normProdCat.includes("arche")) ||
          (normSlug.includes("miroir") && normProdCat.includes("miroir")) ||
          (normSlug.includes("medaillon") && normProdCat.includes("medaillon"))
        );
      }).length;
      return {
        ...cat,
        count,
      };
    });
  }, []);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Auto-close dropdowns on route changes
  useEffect(() => {
    setIsCategoriesOpen(false);
    setMobileCategoriesOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const [headerTop, setHeaderTop] = useState<number>(36);
  const [heroRevealed, setHeroRevealed] = useState(false);

  // Synchronize with Hero reveal state
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).__MARJAD_REVEALED__) {
      setHeroRevealed(true);
    }
    const handleHeroState = (e: any) => {
      setHeroRevealed(e.detail.isRevealed);
    };
    window.addEventListener("marjad-hero-state", handleHeroState);
    return () => window.removeEventListener("marjad-hero-state", handleHeroState);
  }, []);

  const isDark = pathname === "/" && !heroRevealed;

  // Sync scroll state continuously with PromoBar without redundant re-renders
  useEffect(() => {
    let ticking = false;
    let prevTop = -1;
    let prevScrolled = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const topVal = Math.max(0, 36 - scrollY);
          const scrolled = scrollY > 30;
          if (topVal !== prevTop) {
            setHeaderTop(topVal);
            prevTop = topVal;
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
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation Links
  const navLinks = [
    { id: "accueil", label: "Accueil", href: "/" },
    { id: "boutique", label: "Boutique", href: "/boutique" },
    { id: "a-propos", label: "À propos", href: "/a-propos" },
    { id: "contact", label: "Contact", href: "/contact" },
  ];

  // Hide Navbar completely on /login, /admin and /profile pages
  if (pathname === "/login" || pathname?.startsWith("/admin") || pathname === "/profile") {
    return null;
  }

  return (
    <>
      <header
        className="fixed left-0 right-0 z-[100] pointer-events-none"
        style={{
          top: `${headerTop}px`,
          willChange: "top",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between h-13 sm:h-14">
          {/* ========================================================================= */}
          {/* 1. LEFT: OFFICIAL LOGO (White in dark stage, Terracotta on reveal/pages) */}
          {/* ========================================================================= */}
          <div className="pointer-events-auto flex items-center h-full">
            <Link
              href="/"
              onClick={() => {
                setActiveSection("accueil");
                if (pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="relative flex items-center h-8 sm:h-9 lg:h-9.5 w-[115px] sm:w-[130px] lg:w-[140px] group transition-all duration-300 select-none"
            >
              {/* White Logo (shown when navbar & hero are dark) */}
              <Image
                src="/logo-white.png"
                alt="MARJAD - Sélection artisanale"
                width={140}
                height={36}
                priority
                className={`absolute inset-0 h-full w-auto object-contain transition-opacity duration-900 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-102 ${
                  isDark ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
              />
              {/* Authentic Terracotta / Brown Logo (shown on light background & revealed) */}
              <Image
                src="/logo.png"
                alt="MARJAD - Sélection artisanale"
                width={140}
                height={36}
                priority
                className={`absolute inset-0 h-full w-auto object-contain transition-opacity duration-900 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-102 ${
                  isDark ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
                }`}
              />
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* 2. CENTER: FLUSH-TOP NAVBAR PILL (Rounded-b-[26px], perfect centerline) */}
          {/* ========================================================================= */}
          <nav
            aria-label="Navigation principale"
            className={`pointer-events-auto hidden md:flex items-center space-x-7 lg:space-x-9 px-8 sm:px-10 lg:px-12 h-full rounded-t-none rounded-b-[24px] sm:rounded-b-[28px] border-x border-b border-t-0 shadow-[0_8px_26px_-4px_rgba(0,0,0,0.12)] transition-all duration-900 cubic-bezier(0.16, 1, 0.3, 1) ${
              isDark
                ? "bg-[#141210]/85 border-white/10 text-white/90 backdrop-blur-md"
                : "bg-white border-[#ebd8be]/45 text-[#1c1917]"
            }`}
          >
            {/* 1. Accueil */}
            <Link
              href="/"
              onClick={() => setActiveSection("accueil")}
              className={`text-[13px] tracking-wide transition-colors relative py-0.5 font-semibold ${
                pathname === "/" && activeSection === "accueil"
                  ? "text-[#ba4e1a] font-bold"
                  : isDark
                  ? "text-white/85 hover:text-white"
                  : "text-[#1c1917] hover:text-[#ba4e1a]"
              }`}
            >
              Accueil
              {pathname === "/" && activeSection === "accueil" && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#ba4e1a] rounded-full" />
              )}
            </Link>

            {/* 2. Boutique */}
            <Link
              href="/boutique"
              onClick={() => setActiveSection("boutique")}
              className={`text-[13px] tracking-wide transition-colors relative py-0.5 font-semibold ${
                pathname === "/boutique"
                  ? "text-[#ba4e1a] font-bold"
                  : isDark
                  ? "text-white/85 hover:text-white"
                  : "text-[#1c1917] hover:text-[#ba4e1a]"
              }`}
            >
              Boutique
              {pathname === "/boutique" && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#ba4e1a] rounded-full" />
              )}
            </Link>

            {/* 3. Catégories Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => {
                if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                setIsCategoriesOpen(true);
              }}
              onMouseLeave={() => {
                dropdownTimeoutRef.current = setTimeout(() => {
                  setIsCategoriesOpen(false);
                }, 220);
              }}
            >
              <button
                type="button"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className={`flex items-center gap-1 text-[13px] tracking-wide font-semibold py-0.5 transition-colors cursor-pointer ${
                  isCategoriesOpen || pathname.includes("category")
                    ? "text-[#ba4e1a]"
                    : isDark
                    ? "text-white/85 hover:text-white"
                    : "text-[#1c1917] hover:text-[#ba4e1a]"
                }`}
                aria-expanded={isCategoriesOpen}
                aria-haspopup="true"
              >
                <span>Catégories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCategoriesOpen ? "rotate-180 text-[#ba4e1a]" : isDark ? "text-white/60" : "text-[#78716c]"
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isCategoriesOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-64 z-50 animate-in fade-in zoom-in-95 duration-200"
                  style={{ willChange: "transform, opacity" }}
                >
                  <div className="bg-white/98 backdrop-blur-xl border border-[#ebd8be]/80 rounded-2xl p-2 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.12)] space-y-0.5">
                    {navCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/boutique?category=${cat.slug}`}
                        onClick={() => {
                          setIsCategoriesOpen(false);
                          if (typeof window !== "undefined") {
                            window.dispatchEvent(
                              new CustomEvent("marjad_category_selected", { detail: cat.slug })
                            );
                          }
                        }}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#1c1917] hover:bg-[#faf7f2] hover:text-[#ba4e1a] transition-all group"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform">
                          {cat.name}
                        </span>
                        <span className="text-[11px] text-[#8c827a] font-normal group-hover:text-[#ba4e1a] transition-colors ml-2">
                          ({cat.count})
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. À propos */}
            <Link
              href="/a-propos"
              onClick={() => setActiveSection("a-propos")}
              className={`text-[13px] tracking-wide transition-colors relative py-0.5 font-semibold ${
                pathname === "/a-propos"
                  ? "text-[#ba4e1a] font-bold"
                  : isDark
                  ? "text-white/85 hover:text-white"
                  : "text-[#1c1917] hover:text-[#ba4e1a]"
              }`}
            >
              À propos
              {pathname === "/a-propos" && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#ba4e1a] rounded-full" />
              )}
            </Link>

            {/* 5. Contact */}
            <Link
              href="/contact"
              onClick={() => setActiveSection("contact")}
              className={`text-[13px] tracking-wide transition-colors relative py-0.5 font-semibold ${
                pathname === "/contact"
                  ? "text-[#ba4e1a] font-bold"
                  : isDark
                  ? "text-white/85 hover:text-white"
                  : "text-[#1c1917] hover:text-[#ba4e1a]"
              }`}
            >
              Contact
              {pathname === "/contact" && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#ba4e1a] rounded-full" />
              )}
            </Link>
          </nav>

          <div className="pointer-events-auto flex items-center space-x-2.5 sm:space-x-3.5 h-full">
            {/* 1. Language Selector: FR / AR Div */}
            <div
              className={`flex items-center p-0.5 rounded-full shadow-2xs transition-all duration-900 cubic-bezier(0.16, 1, 0.3, 1) ${
                isDark
                  ? "bg-[#141210]/85 border border-white/10 backdrop-blur-md"
                  : "bg-white/80 border border-[#ebd8be] backdrop-blur-md"
              }`}
            >
              <button
                onClick={() => setCurrentLang("FR")}
                className={`px-2 py-0.5 text-[10.5px] font-bold rounded-full transition-all duration-200 cursor-pointer ${
                  currentLang === "FR"
                    ? isDark
                      ? "bg-white text-black shadow-xs"
                      : "bg-[#1c1917] text-white shadow-xs"
                    : isDark
                    ? "text-white/70 hover:text-white"
                    : "text-[#1c1917]/70 hover:text-[#1c1917]"
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setCurrentLang("AR")}
                className={`px-2 py-0.5 text-[10.5px] font-bold rounded-full transition-all duration-200 cursor-pointer ${
                  currentLang === "AR"
                    ? isDark
                      ? "bg-white text-black shadow-xs"
                      : "bg-[#1c1917] text-white shadow-xs"
                    : isDark
                    ? "text-white/70 hover:text-white"
                    : "text-[#1c1917]/70 hover:text-[#1c1917]"
                }`}
              >
                AR
              </button>
            </div>

            {/* 2. Bouton Recherche */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-1.5 transition-colors cursor-pointer group ${
                isDark ? "text-white/90 hover:text-[#ba4e1a]" : "text-[#1c1917] hover:text-[#ba4e1a]"
              }`}
              title="Rechercher des produits"
              aria-label="Recherche"
            >
              <Search className="w-5 h-5 stroke-[1.8] transition-transform group-hover:scale-110" />
            </button>

            {/* 3. Favoris (Wishlist Drawer) */}
            <button
              onClick={openWishlist}
              className={`p-1.5 relative transition-colors cursor-pointer group ${
                isDark ? "text-white/90 hover:text-[#ba4e1a]" : "text-[#1c1917] hover:text-[#ba4e1a]"
              }`}
              title="Mes Favoris"
              aria-label="Favoris"
            >
              <Heart className="w-5 h-5 stroke-[1.8] transition-transform group-hover:scale-110" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ba4e1a] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* 4. Panier (Cart Page /panier) */}
            <Link
              href="/panier"
              className={`p-1.5 relative transition-colors cursor-pointer group ${
                isDark ? "text-white/90 hover:text-[#ba4e1a]" : "text-[#1c1917] hover:text-[#ba4e1a]"
              }`}
              title="Mon Panier"
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8] transition-transform group-hover:scale-110" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ba4e1a] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* 5. Mobile Menu Toggle Button */}
            <div className="flex items-center md:hidden pl-1">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-1.5 transition-colors cursor-pointer ${
                  isDark ? "text-white/90 hover:text-[#ba4e1a]" : "text-[#1c1917] hover:text-[#ba4e1a]"
                }`}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE MENU DROPDOWN (Responsive Navigation) */}
        {/* ========================================================================= */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto md:hidden max-w-md mx-auto mt-2 px-4 animate-in slide-in-from-top-2 duration-200">
            <div className="bg-white/95 backdrop-blur-xl border border-[#ebd8be] rounded-2xl p-4 shadow-xl space-y-1">
              {/* Accueil */}
              <Link
                href="/"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveSection("accueil");
                }}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  pathname === "/" && activeSection === "accueil"
                    ? "bg-[#ba4e1a]/10 text-[#ba4e1a] font-bold"
                    : "text-[#1c1917] hover:bg-[#faf7f2] hover:text-[#ba4e1a]"
                }`}
              >
                Accueil
              </Link>

              {/* Boutique */}
              <Link
                href="/boutique"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveSection("boutique");
                }}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  pathname === "/boutique"
                    ? "bg-[#ba4e1a]/10 text-[#ba4e1a] font-bold"
                    : "text-[#1c1917] hover:bg-[#faf7f2] hover:text-[#ba4e1a]"
                }`}
              >
                Boutique
              </Link>

              {/* Catégories Accordion (Mobile) */}
              <div className="rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileCategoriesOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#1c1917] hover:bg-[#faf7f2] hover:text-[#ba4e1a] transition-colors cursor-pointer"
                >
                  <span>Catégories</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileCategoriesOpen ? "rotate-180 text-[#ba4e1a]" : "text-[#78716c]"
                    }`}
                  />
                </button>

                {mobileCategoriesOpen && (
                  <div className="pl-3 pr-2 py-1 space-y-0.5 bg-[#FAF7F2]/70 rounded-xl my-1 border border-[#EDE9E6]">
                    {navCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/boutique?category=${cat.slug}`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileCategoriesOpen(false);
                          if (typeof window !== "undefined") {
                            window.dispatchEvent(
                              new CustomEvent("marjad_category_selected", { detail: cat.slug })
                            );
                          }
                        }}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#1c1917] hover:bg-white hover:text-[#ba4e1a] transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[11px] text-[#8c827a]">({cat.count})</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* À propos */}
              <Link
                href="/a-propos"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveSection("a-propos");
                }}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  pathname === "/a-propos"
                    ? "bg-[#ba4e1a]/10 text-[#ba4e1a] font-bold"
                    : "text-[#1c1917] hover:bg-[#faf7f2] hover:text-[#ba4e1a]"
                }`}
              >
                À propos
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveSection("contact");
                }}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  pathname === "/contact"
                    ? "bg-[#ba4e1a]/10 text-[#ba4e1a] font-bold"
                    : "text-[#1c1917] hover:bg-[#faf7f2] hover:text-[#ba4e1a]"
                }`}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Modal de recherche intelligente & catalogue */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
