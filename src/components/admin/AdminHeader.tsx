"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Plus,
  X,
  ArrowRight,
  LogOut,
  Home,
  MapPin,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  Layers,
  MessageSquare,
  Video,
  Star,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  User,
} from "lucide-react";
import {
  INITIAL_ADMIN_PRODUCTS,
  INITIAL_ADMIN_CATEGORIES,
  INITIAL_ADMIN_ORDERS,
  INITIAL_ADMIN_REVIEWS,
  INITIAL_ADMIN_VIDEOS,
  AdminProduct,
  AdminCategory,
  AdminOrder,
  AdminReview,
  AdminTrendingVideo,
} from "@/lib/adminData";

interface AdminHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  actionButton?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  onSearchClick?: () => void;
  children?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  actionButton,
  onSearchClick,
  children,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatProduct, setSelectedStatProduct] = useState<AdminProduct | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut (Escape to close search/profile)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isSearchModalOpen) {
          closeSearchModal();
        } else if (showProfileMenu) {
          setShowProfileMenu(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchModalOpen, showProfileMenu]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isSearchModalOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isSearchModalOpen]);

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchQuery("");
    setSelectedStatProduct(null);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("marjad_admin_auth");
      localStorage.removeItem("marjad_admin_email");
      document.cookie = "marjad_admin_auth=; path=/; max-age=0";
    }
    router.push("/login");
  };

  // Determine current section
  const isDashboard = pathname === "/admin";
  const isProductsPage = pathname.startsWith("/admin/produits");
  const isCategoriesPage = pathname.startsWith("/admin/categories");
  const isOrdersPage = pathname.startsWith("/admin/commandes");
  const isReviewsPage = pathname.startsWith("/admin/commentaires");
  const isVideosPage = pathname.startsWith("/admin/videos");

  const searchHeaderTitle = useMemo(() => {
    if (isVideosPage) return "Recherche de Vidéos Artisanat & Reels";
    if (isReviewsPage) return "Recherche d'Avis Clients";
    if (isOrdersPage) return "Recherche de Commandes Client";
    if (isCategoriesPage) return "Recherche par Nom de Catégorie";
    if (isProductsPage) return "Recherche dans le Catalogue Produits";
    return "Recherche & Statistiques Produits";
  }, [isVideosPage, isReviewsPage, isOrdersPage, isCategoriesPage, isProductsPage]);

  const searchPlaceholder = useMemo(() => {
    if (isVideosPage) return "Rechercher une vidéo par nom de produit ou titre (ex: Tapis, Zellige, Cuivre)...";
    if (isReviewsPage) return "Rechercher un avis par produit, client ou mot-clé...";
    if (isOrdersPage) return "Rechercher par nom de client, ville ou N° commande (ex: Fatima, CMD-MAR, Casablanca)...";
    if (isCategoriesPage) return "Rechercher une catégorie (ex: Tapis, Luminaires, Zellige, Bois)...";
    if (isProductsPage) return "Rechercher une pièce d'artisanat (ex: Beni Ourain, Lanterne, Table Zellige)...";
    return "Rechercher un produit d'artisanat pour voir ses statistiques détaillées...";
  }, [isVideosPage, isReviewsPage, isOrdersPage, isCategoriesPage, isProductsPage]);

  // Live Datasets loaded from localStorage with fallback
  const liveProducts = useMemo(() => {
    if (typeof window === "undefined") return INITIAL_ADMIN_PRODUCTS;
    try {
      const stored = localStorage.getItem("marjad_admin_products");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ADMIN_PRODUCTS;
  }, [isSearchModalOpen]);

  const liveCategories = useMemo(() => {
    if (typeof window === "undefined") return INITIAL_ADMIN_CATEGORIES;
    try {
      const stored = localStorage.getItem("marjad_admin_categories");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ADMIN_CATEGORIES;
  }, [isSearchModalOpen]);

  const liveOrders = useMemo(() => {
    if (typeof window === "undefined") return INITIAL_ADMIN_ORDERS;
    try {
      const stored = localStorage.getItem("marjad_admin_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ADMIN_ORDERS;
  }, [isSearchModalOpen]);

  const liveReviews = useMemo(() => {
    if (typeof window === "undefined") return INITIAL_ADMIN_REVIEWS;
    try {
      const stored = localStorage.getItem("marjad_admin_reviews");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ADMIN_REVIEWS;
  }, [isSearchModalOpen]);

  const liveVideos = useMemo(() => {
    if (typeof window === "undefined") return INITIAL_ADMIN_VIDEOS;
    try {
      const stored = localStorage.getItem("marjad_admin_videos");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ADMIN_VIDEOS;
  }, [isSearchModalOpen]);

  // Filtered Datasets
  const matchingProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return liveProducts.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(q);
      const matchNameAr = p.nameAr?.toLowerCase().includes(q);
      const matchCat = p.categoryName?.toLowerCase().includes(q);
      return matchName || matchNameAr || matchCat;
    });
  }, [searchQuery, liveProducts]);

  const matchingCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return liveCategories.filter((c) => {
      const matchName = c.name?.toLowerCase().includes(q);
      const matchNameAr = c.nameAr?.toLowerCase().includes(q);
      const matchDesc = c.description?.toLowerCase().includes(q);
      return matchName || matchNameAr || matchDesc;
    });
  }, [searchQuery, liveCategories]);

  const matchingOrders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return liveOrders.filter((o) => {
      return (
        o.customerName?.toLowerCase().includes(q) ||
        o.id?.toLowerCase().includes(q) ||
        o.customerCity?.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, liveOrders]);

  const matchingReviews = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return liveReviews.filter((r) => {
      return (
        r.productName?.toLowerCase().includes(q) ||
        r.customerName?.toLowerCase().includes(q) ||
        r.comment?.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, liveReviews]);

  const matchingVideos = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return liveVideos.filter((v) => {
      return (
        v.title?.toLowerCase().includes(q) ||
        v.productName?.toLowerCase().includes(q) ||
        v.author?.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, liveVideos]);

  return (
    <div className="w-full space-y-3">
      {/* Top Main Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div className="space-y-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2937] tracking-tight">
              {title}
            </h1>
          </div>
          {subtitle && (
            <div className="text-xs text-[#4B5563] font-sans font-medium flex items-center gap-1.5 mt-0.5">
              {subtitle}
            </div>
          )}
        </div>

        {/* Right Controls: Search + Profile Avatar Button */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
          {/* Circular Search Icon Button */}
          <button
            type="button"
            onClick={() => {
              if (onSearchClick) {
                onSearchClick();
              } else {
                setIsSearchModalOpen(true);
              }
            }}
            className="w-10 h-10 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E9DCD5] hover:border-[#6d381e] text-[#6d381e] flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            title="Rechercher sur la plateforme"
            aria-label="Recherche admin"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* User Profile Avatar Button */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full bg-[#6d381e] hover:bg-[#542a15] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer ring-2 ring-transparent hover:ring-[#E9DCD5] overflow-hidden p-0 font-serif"
              title="Compte Administrateur MARJAD (contact.marjad@gmail.com)"
              aria-label="Menu du profil"
              aria-expanded={showProfileMenu}
            >
              <span>M</span>
            </button>

            {/* Profile Dropdown Modal */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#E9DCD5] shadow-2xl p-2.5 z-50 animate-in fade-in duration-150 text-left">
                {/* User Header with Avatar */}
                <div className="flex items-center gap-2.5 px-2 py-1.5 border-b border-[#EDE5E0] mb-1.5">
                  <div className="w-9 h-9 rounded-full bg-[#6d381e] text-white flex items-center justify-center font-bold text-xs shrink-0 border border-[#E9DCD5] font-serif">
                    M
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-[#1F2937] truncate">Admin MARJAD</p>
                    <p className="text-[10px] text-neutral-400 truncate">contact.marjad@gmail.com</p>
                  </div>
                </div>

                <div className="space-y-0.5 text-xs">
                  {/* Retour à la boutique */}
                  <Link
                    href="/"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full px-3 py-2 rounded-xl bg-[#6d381e]/10 hover:bg-[#6d381e]/20 text-[#6d381e] font-bold transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <Home className="w-4 h-4 text-[#6d381e] shrink-0" />
                    <span className="truncate">Retour à la boutique</span>
                  </Link>

                  {/* Tableau de bord */}
                  <Link
                    href="/admin"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full px-3 py-2 rounded-xl hover:bg-[#FAF7F2] text-[#1F2937] hover:text-[#6d381e] font-semibold transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-[#6d381e] shrink-0" />
                    <span>Tableau de bord</span>
                  </Link>

                  {/* Déconnexion */}
                  <div className="border-t border-[#EDE5E0] pt-1 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleLogout();
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-bold transition flex items-center gap-2.5 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub Row: Action Buttons */}
      {(actionButton || children) && (
        <div className="flex items-center gap-2.5 justify-end pt-1 flex-wrap">
          {actionButton &&
            (actionButton.href ? (
              <Link
                href={actionButton.href}
                className="inline-flex items-center gap-2 bg-[#6d381e] hover:bg-[#542a15] text-white text-xs font-semibold px-5 py-2 rounded-full shadow-[0_4px_14px_rgba(109,56,30,0.22)] hover:shadow-[0_6px_18px_rgba(109,56,30,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>{actionButton.label}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={actionButton.onClick}
                className="inline-flex items-center gap-2 bg-[#6d381e] hover:bg-[#542a15] text-white text-xs font-semibold px-5 py-2 rounded-full shadow-[0_4px_14px_rgba(109,56,30,0.22)] hover:shadow-[0_6px_18px_rgba(109,56,30,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{actionButton.label}</span>
              </button>
            ))}
          {children}
        </div>
      )}

      {/* SEARCH MODAL */}
      {isSearchModalOpen && (
        <div
          className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-20 p-4 animate-in fade-in duration-200"
          onClick={closeSearchModal}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl border border-[#E9DCD5] shadow-2xl p-5 overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* View 1: Detailed Product Stats (when selected on dashboard or search) */}
            {selectedStatProduct ? (
              <div className="space-y-4 overflow-y-auto pr-1">
                {/* Header with back button */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E9DCD5]/70">
                  <button
                    type="button"
                    onClick={() => setSelectedStatProduct(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#6d381e] hover:text-[#542a15] transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    <span>Retour à la recherche</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeSearchModal}
                    className="group w-8 h-8 rounded-full border border-[#6d381e] bg-white text-[#6d381e] hover:bg-[#6d381e] hover:text-white flex items-center justify-center transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Product Summary */}
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E9DCD5]">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E9DCD5] flex items-center justify-center p-1 shadow-2xs">
                    <Image
                      src={selectedStatProduct.image}
                      alt={selectedStatProduct.name}
                      fill
                      className="object-contain p-0.5"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-[#6d381e] uppercase tracking-wider bg-[#6d381e]/10 px-2 py-0.5 rounded-md">
                      {selectedStatProduct.categoryName}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-[#1F2937] truncate mt-1">
                      {selectedStatProduct.name}
                    </h4>
                    <p className="text-xs font-bold text-[#ba4e1a] mt-0.5">
                      {selectedStatProduct.price} DH
                    </p>
                  </div>
                </div>

                {/* KPIs Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E9DCD5]/60">
                    <div className="flex items-center gap-2 text-neutral-500 text-[10px] uppercase font-bold tracking-wider">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#6d381e]" />
                      <span>Ventes Totales</span>
                    </div>
                    <p className="text-xl font-bold font-serif text-[#1F2937] mt-1">
                      {selectedStatProduct.salesCount || 142} <span className="text-xs font-normal">unités</span>
                    </p>
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E9DCD5]/60">
                    <div className="flex items-center gap-2 text-neutral-500 text-[10px] uppercase font-bold tracking-wider">
                      <DollarSign className="w-3.5 h-3.5 text-[#6d381e]" />
                      <span>Chiffre d&apos;Affaires</span>
                    </div>
                    <p className="text-xl font-bold font-serif text-[#ba4e1a] mt-1">
                      {((selectedStatProduct.salesCount || 142) * selectedStatProduct.price).toLocaleString()} <span className="text-xs font-normal">DH</span>
                    </p>
                  </div>
                </div>

                {/* Villes les plus commandées */}
                <div className="p-3.5 bg-white rounded-2xl border border-[#E9DCD5] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#6d381e]" />
                      <span>Villes les plus commandées</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#6d381e] bg-[#6d381e]/10 px-2 py-0.5 rounded-full">
                      Top Villes Maroc
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF7F2] border border-[#E9DCD5]/60">
                      <span className="font-semibold text-[#1F2937]">Casablanca</span>
                      <span className="font-extrabold text-[#6d381e]">58 cmd (41%)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF7F2] border border-[#E9DCD5]/60">
                      <span className="font-semibold text-[#1F2937]">Rabat</span>
                      <span className="font-extrabold text-[#6d381e]">34 cmd (24%)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF7F2] border border-[#E9DCD5]/60">
                      <span className="font-semibold text-[#1F2937]">Marrakech</span>
                      <span className="font-extrabold text-[#6d381e]">22 cmd (15%)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF7F2] border border-[#E9DCD5]/60">
                      <span className="font-semibold text-[#1F2937]">Fès / Tanger</span>
                      <span className="font-extrabold text-[#6d381e]">15 cmd (10%)</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const targetId = selectedStatProduct.id;
                      closeSearchModal();
                      router.push(`/admin/produits?highlight=${targetId}`);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[#6d381e] hover:bg-[#542a15] text-white py-2.5 rounded-2xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <span>Voir cette pièce dans le catalogue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* View 2: Search Input & Results */
              <div className="space-y-4 flex flex-col min-h-0 flex-1">
                {/* Modal Title Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E9DCD5]/70 shrink-0">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F2937] leading-tight">
                      {searchHeaderTitle}
                    </h3>
                    <p className="text-[11px] text-[#4B5563]">
                      Système de recherche intelligent selon la page actuelle
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeSearchModal}
                    className="group w-8 h-8 rounded-full border border-[#6d381e] bg-white text-[#6d381e] hover:bg-[#6d381e] hover:text-white flex items-center justify-center transition-all duration-300 shrink-0 cursor-pointer"
                    title="Fermer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search Input Box */}
                <div className="relative shrink-0">
                  <Search className="w-4.5 h-4.5 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full bg-[#FAF7F2] border border-[#E9DCD5] focus:border-[#6d381e] focus:bg-white rounded-2xl py-2.5 pl-11 pr-10 text-xs sm:text-sm text-[#1F2937] placeholder-[#6B7280] transition outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2937] p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Results List */}
                <div className="overflow-y-auto flex-1 space-y-2 pr-1 min-h-[140px] max-h-[50vh]">
                  {/* Results on CATEGORIES Page */}
                  {isCategoriesPage && (
                    <>
                      {searchQuery ? (
                        matchingCategories.length === 0 ? (
                          <div className="py-8 text-center text-xs text-[#6B7280]">
                            Aucune catégorie trouvée pour &ldquo;{searchQuery}&rdquo;.
                          </div>
                        ) : (
                          matchingCategories.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                closeSearchModal();
                                router.push(`/admin/categories?highlight=${c.id}`);
                              }}
                              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#FAF7F2] border border-[#E9DCD5] transition text-left cursor-pointer group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-[#E9DCD5]">
                                  <Image src={c.image} alt={c.name} fill className="object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-serif font-bold text-xs text-[#1F2937] group-hover:text-[#6d381e] truncate">
                                    {c.name} {c.nameAr && <span className="font-arabic text-[#ba4e1a] text-[11px] ml-1">({c.nameAr})</span>}
                                  </p>
                                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                                    {c.description}
                                  </p>
                                  <span className="text-[10px] font-bold text-[#6d381e] bg-[#6d381e]/10 px-2 py-0.5 rounded-full inline-block mt-1">
                                    {c.itemCount} articles
                                  </span>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#6d381e] shrink-0" />
                            </button>
                          ))
                        )
                      ) : (
                        <div className="py-8 text-center text-xs text-neutral-400">
                          Tapez le nom d&apos;une catégorie (ex: Tapis, Zellige, Cuivre, Bois...)
                        </div>
                      )}
                    </>
                  )}

                  {/* Results on COMMANDES Page */}
                  {isOrdersPage && (
                    <>
                      {searchQuery ? (
                        matchingOrders.length === 0 ? (
                          <div className="py-8 text-center text-xs text-[#6B7280]">
                            Aucune commande trouvée pour &ldquo;{searchQuery}&rdquo;.
                          </div>
                        ) : (
                          matchingOrders.map((o) => (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => {
                                closeSearchModal();
                                router.push(`/admin/commandes?highlight=${o.id}`);
                              }}
                              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#FAF7F2] border border-[#E9DCD5] transition text-left cursor-pointer group"
                            >
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-xs text-[#6d381e]">
                                    {o.id}
                                  </span>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                                    {o.status}
                                  </span>
                                </div>
                                <p className="font-bold text-xs text-[#1F2937] truncate">
                                  {o.customerName} • {o.customerCity}
                                </p>
                                <p className="text-[11px] text-[#ba4e1a] font-bold">
                                  {o.total} DH
                                </p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#6d381e] shrink-0" />
                            </button>
                          ))
                        )
                      ) : (
                        <div className="py-8 text-center text-xs text-neutral-400">
                          Recherchez une commande par nom client, ville ou N° (#CMD-MAR...)
                        </div>
                      )}
                    </>
                  )}

                  {/* Results on COMMENTAIRES Page */}
                  {isReviewsPage && (
                    <>
                      {searchQuery ? (
                        matchingReviews.length === 0 ? (
                          <div className="py-8 text-center text-xs text-[#6B7280]">
                            Aucun commentaire trouvé pour &ldquo;{searchQuery}&rdquo;.
                          </div>
                        ) : (
                          matchingReviews.map((r) => (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => {
                                closeSearchModal();
                                router.push(`/admin/commentaires?highlight=${r.id}`);
                              }}
                              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#FAF7F2] border border-[#E9DCD5] transition text-left cursor-pointer group"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E9DCD5] flex items-center justify-center p-0.5 shadow-2xs">
                                  <Image src={r.productImage} alt={r.productName} fill className="object-contain p-0.5" sizes="48px" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-xs text-[#1F2937] truncate">
                                      {r.customerName} ({r.customerCity})
                                    </span>
                                    <div className="flex items-center text-amber-500 text-[10px]">
                                      <Star className="w-3 h-3 fill-amber-500" />
                                      <span className="font-bold ml-0.5">{r.rating}</span>
                                    </div>
                                  </div>
                                  <p className="text-[11px] text-[#6d381e] font-semibold truncate mt-0.5">
                                    {r.productName}
                                  </p>
                                  <p className="text-[11px] text-neutral-500 truncate italic">
                                    &ldquo;{r.comment}&rdquo;
                                  </p>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#6d381e] shrink-0" />
                            </button>
                          ))
                        )
                      ) : (
                        <div className="py-8 text-center text-xs text-neutral-400">
                          Recherchez un commentaire par nom de produit ou client...
                        </div>
                      )}
                    </>
                  )}

                  {/* Results on VIDÉOS Page */}
                  {isVideosPage && (
                    <>
                      {searchQuery ? (
                        matchingVideos.length === 0 ? (
                          <div className="py-8 text-center text-xs text-[#6B7280]">
                            Aucune vidéo trouvée pour &ldquo;{searchQuery}&rdquo;.
                          </div>
                        ) : (
                          matchingVideos.map((v) => (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => {
                                closeSearchModal();
                                router.push(`/admin/videos?highlight=${v.id}`);
                              }}
                              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#FAF7F2] border border-[#E9DCD5] transition text-left cursor-pointer group"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-stone-900 shrink-0 border border-[#E9DCD5]">
                                  <Image src={v.thumbnail} alt={v.title} fill className="object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-xs text-[#1F2937] line-clamp-1 group-hover:text-[#6d381e]">
                                    {v.title}
                                  </p>
                                  <p className="text-[11px] text-[#6d381e] font-medium mt-0.5">
                                    Produit: {v.productName}
                                  </p>
                                  <span className="text-[10px] text-neutral-400 font-bold">
                                    {v.views} vues • {v.likes} j&apos;aime
                                  </span>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#6d381e] shrink-0" />
                            </button>
                          ))
                        )
                      ) : (
                        <div className="py-8 text-center text-xs text-neutral-400">
                          Recherchez une vidéo TikTok par titre ou nom de produit...
                        </div>
                      )}
                    </>
                  )}

                  {/* Results on DASHBOARD & PRODUITS Page */}
                  {(isDashboard || isProductsPage) && (
                    <>
                      {searchQuery ? (
                        matchingProducts.length === 0 ? (
                          <div className="py-8 text-center text-xs text-[#6B7280]">
                            Aucune pièce trouvée pour &ldquo;{searchQuery}&rdquo;.
                          </div>
                        ) : (
                          matchingProducts.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                if (isDashboard) {
                                  setSelectedStatProduct(p);
                                } else {
                                  closeSearchModal();
                                  router.push(`/admin/produits?highlight=${p.id}`);
                                }
                              }}
                              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#FAF7F2] border border-[#E9DCD5] transition text-left cursor-pointer group"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E9DCD5] flex items-center justify-center p-0.5 shadow-2xs">
                                  <Image src={p.image} alt={p.name} fill className="object-contain p-0.5" sizes="48px" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-serif font-bold text-xs text-[#1F2937] group-hover:text-[#6d381e] truncate">
                                    {p.name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-bold text-[#6d381e] bg-[#6d381e]/10 px-2 py-0.5 rounded-md">
                                      {p.categoryName}
                                    </span>
                                    <span className="text-[11px] font-bold text-[#ba4e1a]">
                                      {p.price} DH
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <span className="text-[11px] font-bold text-[#6d381e] bg-[#6d381e]/10 px-2.5 py-1 rounded-xl shrink-0">
                                {isDashboard ? "Voir Stats" : "Voir"}
                              </span>
                            </button>
                          ))
                        )
                      ) : (
                        <div className="py-8 text-center text-xs text-neutral-400">
                          Tapez le nom d&apos;une pièce artisanale (ex: Beni Ourain, Zellige, Lanterne, Pouf...)
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Footer Tip */}
                <div className="pt-2 border-t border-[#E9DCD5]/60 flex items-center justify-between text-[11px] text-neutral-400 shrink-0">
                  <span>Appuyez sur <kbd className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-[10px] font-mono">Échap</kbd> pour fermer</span>
                  <span className="font-bold text-[#6d381e]">MARJAD Admin</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
