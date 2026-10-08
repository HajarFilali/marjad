"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Check,
  ShieldCheck,
  Truck,
  Banknote,
  Sparkles,
  MapPin,
  Share2,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  PackageCheck,
  Award,
  PhoneCall,
  X,
  Palette,
  Eye,
  Ruler,
  CheckCircle2,
  Star,
  Minus,
  Plus,
} from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import { DECOR_PRODUCTS, MOROCCAN_CITIES } from "@/data/mockProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { CustomSelect } from "@/components/ui/CustomSelect";

const cityOptions = MOROCCAN_CITIES.map((c) => ({
  value: c,
  label: c,
  icon: MapPin,
}));

// Couleurs de calligraphie et finitions métallisées de l'atelier
export const PRODUCT_COLORS = [
  {
    id: "dore",
    name: "Doré",
    label: "Or Impérial (Doré)",
    bgGradient: "bg-gradient-to-tr from-[#996515] via-[#D4AF37] to-[#F5D77F]",
    textColor: "text-[#D4AF37]",
  },
  {
    id: "argente",
    name: "Argenté",
    label: "Argent Miroir (Argenté)",
    bgGradient: "bg-gradient-to-tr from-[#6B7280] via-[#D1D5DB] to-[#F9FAFB]",
    textColor: "text-stone-400",
  },
  {
    id: "noir-or",
    name: "Noir & Or",
    label: "Noir Mat & Liseré Or",
    bgGradient: "bg-gradient-to-tr from-[#000000] via-[#1C1917] to-[#D4AF37]",
    textColor: "text-[#1C1917]",
  },
];

// Couleurs Nude & Tons Clairs pour les murs du Salon Marocain
const WALL_COLORS = [
  {
    id: "blanc",
    name: "Blanc Craie",
    hex: "#F5F3EF",
    image: "/images/salon-wall-blanc.webp",
    description: "Épure moderne et luminosité maximale",
  },
  {
    id: "babywhite",
    name: "Baby White",
    hex: "#F9F4EB",
    image: "/images/salon-wall-babywhite.webp",
    description: "Blanc cassé soyeux et nuance délicate",
  },
  {
    id: "creme",
    name: "Beige Crème",
    hex: "#F3EDE2",
    image: "/images/salon-wall-creme.webp",
    description: "Teinte chaleureuse et lumineuse naturelle",
  },
  {
    id: "sable",
    name: "Tadelakt Sable",
    hex: "#D8C6B1",
    image: "/images/salon-wall-sable.webp",
    description: "Inspiration minérale et désert marocain",
  },
  {
    id: "gris",
    name: "Gris Clair",
    hex: "#C3C0BA",
    image: "/images/salon-wall-gris.webp",
    description: "Gris perle doux et sobriété contemporaine",
  },
];

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addItem, openCart, items } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const inCart = items.some((item) => String(item.product.id) === String(product.id));

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(PRODUCT_COLORS[0]);
  const [selectedFinish, setSelectedFinish] = useState("Dorure Or Fin 24k");
  const [activeTab, setActiveTab] = useState<"specs" | "installation">("specs");
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<"salon" | "product">("salon");
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);
  const [selectedWallId, setSelectedWallId] = useState("blanc");
  const [isCodModalOpen, setIsCodModalOpen] = useState(false);
  const [codSubmitted, setCodSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedWall = WALL_COLORS.find((c) => c.id === selectedWallId) || WALL_COLORS[0];

  // Carousel ref and scroll state for "Créations Complémentaires"
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkCarouselScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  const scrollCarouselBy = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const amount = direction === "left" ? -300 : 300;
    carouselRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    checkCarouselScroll();
    window.addEventListener("resize", checkCarouselScroll);
    return () => window.removeEventListener("resize", checkCarouselScroll);
  }, [checkCarouselScroll]);

  // Track scroll position to synchronize sticky position and height when top promo bar disappears
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled((prev) => {
        if (prev && scrollY < 35) return false;
        if (!prev && scrollY > 55) return true;
        return prev;
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Keyboard and modal backdrop scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSimulatorModalOpen(false);
        setIsCodModalOpen(false);
      }
    };
    if (isSimulatorModalOpen || isCodModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isSimulatorModalOpen, isCodModalOpen]);

  // COD Form State
  const [isInlineCodOpen, setIsInlineCodOpen] = useState(false);
  const [codName, setCodName] = useState("");
  const [codPhone, setCodPhone] = useState("");
  const [codCity, setCodCity] = useState("Casablanca");
  const [codCustomCity, setCodCustomCity] = useState("");
  const [codAddress, setCodAddress] = useState("");

  const handleInlineCodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codName.trim() || !codPhone.trim() || !codAddress.trim()) return;
    if (codCity === "Autre ville" && !codCustomCity.trim()) return;

    const deliveryCity =
      codCity === "Autre ville" && codCustomCity.trim()
        ? codCustomCity.trim()
        : codCity;

    setCodSubmitted(true);

    const newOrder = {
      id: `CMD-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
      date: new Date().toISOString().split("T")[0],
      customerName: codName,
      city: deliveryCity,
      address: codAddress,
      items: [
        {
          name: product.name,
          quantity: quantity,
          price: product.price * quantity,
        },
      ],
      total: product.price * quantity,
      status: "En attente",
    };

    try {
      const existing = localStorage.getItem("marjad_orders");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newOrder);
      localStorage.setItem("marjad_orders", JSON.stringify(list));
    } catch (err) {}

    setTimeout(() => {
      setCodSubmitted(false);
      setIsInlineCodOpen(false);
      setCodName("");
      setCodPhone("");
      setCodAddress("");
      setCodCustomCity("");
    }, 2500);
  };

  const isFavorite = isInWishlist(product.id);

  const finishes = [
    { id: "gold", label: "Dorure Or Fin 24k", badge: "Signature" },
    { id: "brass", label: "Laiton Massif Ciselé", badge: "Classique" },
    { id: "wood", label: "Cèdre Naturel Ciré", badge: "Nature" },
  ];

  const handleAddToCart = () => {
    if (inCart) return;
    addItem(product, quantity, selectedColor.name);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      openCart();
    }, 600);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codName.trim() || !codPhone.trim()) return;
    setCodSubmitted(true);
    setTimeout(() => {
      setCodSubmitted(false);
      setIsCodModalOpen(false);
      addItem(product, quantity, selectedColor.name);
    }, 2000);
  };

  const complementaryProducts = DECOR_PRODUCTS.filter((p) => p.id !== product.id);

  return (
    <div className="bg-[#ffffff] min-h-screen text-[#1c1917] pb-8 sm:pb-10">
      
      {/* ================= HERO SHOWCASE SECTION (LEFT 40% STICKY | RIGHT 60% SCROLLABLE) ================= */}
      <div className="w-[92%] sm:w-[94%] max-w-7xl mx-auto px-0 pt-28 sm:pt-[122px] lg:pt-[124px]">
        
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 relative">
          
          {/* ================= LEFT: 42% STICKY PRODUCT IMAGE SHOWCASE ================= */}
          <div
            className="w-full lg:w-[42%] shrink-0 z-20 self-start lg:sticky"
            style={{
              top: isScrolled ? "92px" : "124px",
              transition: "top 500ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div className="flex items-start gap-2.5 sm:gap-3 w-full">
              
              {/* Vertical Column of Circular View Selectors on the Left */}
              <div className="flex flex-col items-center gap-1.5 pt-2 shrink-0">
                {/* 1. Salon Room View (Default Active) */}
                <button
                  type="button"
                  onClick={() => setActiveViewMode("salon")}
                  className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                    activeViewMode === "salon"
                      ? "border-[1.5px] border-[#ba4e1a] shadow-xs"
                      : "border-[1.5px] border-[#ebd8be] opacity-65 hover:opacity-100 hover:border-[#ba4e1a]/60"
                  }`}
                  title="Vue d'ambiance dans le salon marocain"
                  aria-label="Vue salon marocain"
                >
                  <Image
                    src={selectedWall.image}
                    alt="Salon marocain"
                    fill
                    sizes="48px"
                    className="object-cover object-center"
                  />
                </button>

                {/* 2. Standalone Product View on White Background */}
                <button
                  type="button"
                  onClick={() => setActiveViewMode("product")}
                  className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden transition-all duration-300 cursor-pointer bg-white ${
                    activeViewMode === "product"
                      ? "border-[1.5px] border-[#ba4e1a] shadow-xs"
                      : "border-[1.5px] border-[#ebd8be] opacity-65 hover:opacity-100 hover:border-[#ba4e1a]/60"
                  }`}
                  title="Vue détaillée du produit seul sur fond blanc"
                  aria-label="Vue produit seul"
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                  />
                </button>
              </div>

              {/* Main Showcase Box */}
              <div
                className={`flex-1 min-w-0 relative rounded-[32px] border border-[#ebd8be] flex flex-col justify-between shadow-[0_20px_45px_-18px_rgba(196,98,45,0.18)] overflow-hidden select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  activeViewMode === "salon" ? "bg-[#1a1714]" : "bg-white"
                } ${
                  isScrolled
                    ? "h-[512px] sm:h-[527px] lg:h-[532px]"
                    : "h-[480px] sm:h-[495px] lg:h-[500px]"
                }`}
              >
                {/* 1. Photorealistic Salon Background (Smooth Opacity Cross-fade) */}
                <div
                  className={`absolute inset-0 z-0 overflow-hidden transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    activeViewMode === "salon" ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={selectedWall.image}
                    alt={`Salon marocain - Mur ${selectedWall.name}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                    className="object-cover object-[center_42%]"
                  />
                  {/* Subtle room lighting vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />
                </div>

                {/* 2. Pure White Studio Background (Smooth Opacity Cross-fade) */}
                <div
                  className={`absolute inset-0 z-0 bg-white transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    activeViewMode === "product" ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                />

                {/* 3. Top Controls Bar: Agrandir la pièce on Left | Share & Wishlist on Right */}
                <div className="relative z-20 p-4 sm:p-5 flex items-center justify-between min-h-[58px]">
                  {/* Left: Agrandir la pièce (Salon Mode Only) */}
                  <div
                    className={`transition-all duration-500 ease-out ${
                      activeViewMode === "salon"
                        ? "opacity-100 translate-x-0 pointer-events-auto"
                        : "opacity-0 -translate-x-2 pointer-events-none"
                    }`}
                  >
                    <button
                      onClick={() => setIsSimulatorModalOpen(true)}
                      className="group/btn flex items-center gap-1.5 bg-black/55 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 hover:border-white/40 px-3.5 py-1.5 rounded-full shadow-md transition-all duration-300 hover:scale-105 cursor-pointer"
                      title="Agrandir la pièce en plein écran"
                      aria-label="Agrandir la pièce"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#e5a855] group-hover/btn:scale-110 transition-transform" />
                      <span className="text-[11px] font-bold tracking-tight hidden sm:inline">
                        Agrandir la pièce
                      </span>
                    </button>
                  </div>

                  {/* Right: Partager & Favoris (Visible in ALL view modes) */}
                  <div className="flex items-center gap-2 shrink-0 ml-auto">
                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      className={`p-2 rounded-full transition-all duration-300 shadow-sm cursor-pointer flex items-center justify-center relative hover:scale-110 ${
                        activeViewMode === "salon"
                          ? "bg-black/55 hover:bg-black/80 text-white border border-white/20 hover:border-white/40 backdrop-blur-md"
                          : "bg-[#faf6f0] hover:bg-white text-[#1c1917] border border-[#ebd8be] hover:border-[#ba4e1a]/40"
                      }`}
                      title="Partager ce produit"
                      aria-label="Partager ce produit"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      {copiedLink && (
                        <span className="absolute -bottom-8 right-0 bg-[#1c1917] text-white text-[10px] font-bold py-1 px-2 rounded-md whitespace-nowrap animate-in fade-in shadow-md z-30">
                          Lien copié !
                        </span>
                      )}
                    </button>

                    {/* Wishlist / Favorite Button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`p-2 rounded-full border transition-all duration-300 shadow-sm cursor-pointer flex items-center justify-center hover:scale-110 ${
                        isFavorite
                          ? activeViewMode === "salon"
                            ? "bg-black/70 border-red-400/60 text-red-400 backdrop-blur-md"
                            : "bg-white border-red-300 text-red-500 shadow-red-500/10"
                          : activeViewMode === "salon"
                          ? "bg-black/55 hover:bg-black/80 border-white/20 hover:border-white/40 text-white backdrop-blur-md"
                          : "bg-[#faf6f0] hover:bg-white border-[#ebd8be] text-[#1c1917] hover:border-[#ba4e1a]/40"
                      }`}
                      title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                      aria-label="Favoris"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          isFavorite ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* 4. UNIFIED SINGLE PRODUCT PIECE (Direct, synchronized translation and scaling!) */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform:
                      activeViewMode === "salon"
                        ? "translate(12%, -6%)"
                        : "translate(0%, 0%)",
                  }}
                >
                  <div
                    className="relative w-full h-full flex items-center justify-center pointer-events-auto transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      transform:
                        activeViewMode === "salon"
                          ? "scale(0.44)"
                          : "scale(1)",
                      transformOrigin: "center center",
                    }}
                  >
                    <div
                      className="relative flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
                      style={{
                        filter:
                          activeViewMode === "salon"
                            ? "drop-shadow(0 16px 28px rgba(0,0,0,0.40)) drop-shadow(0 4px 8px rgba(0,0,0,0.22))"
                            : "drop-shadow(0 20px 35px rgba(0,0,0,0.12))",
                      }}
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={720}
                        height={400}
                        priority
                        className="object-contain max-h-[290px] sm:max-h-[320px] lg:max-h-[340px] max-w-[88%] w-auto mx-auto block select-none pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Bottom Controls Bar: Only shown in Salon Mode (Wall Color Palette) */}
                <div
                  className={`relative z-20 p-3 sm:p-4 min-h-[72px] transition-opacity duration-500 ${
                    activeViewMode === "salon" ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="bg-black/60 backdrop-blur-lg border border-white/20 p-2.5 rounded-2xl shadow-xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 pl-1">
                      <div className="p-1 rounded-lg bg-white/10 text-[#e5a855]">
                        <Palette className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9.5px] uppercase font-black tracking-wider text-white/60">
                          Teinte du mur
                        </span>
                        <span className="text-[11.5px] font-bold text-white leading-tight">
                          {selectedWall.name}
                        </span>
                      </div>
                    </div>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {WALL_COLORS.map((color) => {
                        const isSelected = selectedWallId === color.id;
                        return (
                          <button
                            key={color.id}
                            onClick={() => setSelectedWallId(color.id)}
                            className={`relative w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? "scale-115 ring-2 ring-white ring-offset-2 ring-offset-black/70 shadow-md"
                                : "hover:scale-110 opacity-75 hover:opacity-100"
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={`${color.name} - ${color.description}`}
                            aria-label={color.name}
                          >
                            {isSelected && (
                              <span className="absolute inset-0 flex items-center justify-center">
                                <Check
                                  className={`w-3 h-3 ${
                                    color.id === "blanc" || color.id === "babywhite" || color.id === "creme"
                                      ? "text-stone-900"
                                      : "text-white"
                                  }`}
                                />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* ================= RIGHT: 58% SCROLLABLE PRODUCT DETAILS, OPTIONS & TABS ================= */}
          <div className="w-full lg:w-[58%] flex-1 flex flex-col">
            
            {/* 1. TOP BAR: Clickable Breadcrumbs (Accueil / Boutique / [Nom du produit]) */}
            <div className="flex items-center justify-between gap-3 pt-2.5 sm:pt-3.5 mb-2">
              <nav aria-label="Fil d'ariane" className="flex items-center gap-1.5 text-xs text-[#1c1917]/70 font-medium overflow-hidden">
                <Link href="/" className="hover:text-[#ba4e1a] transition-colors whitespace-nowrap">
                  Accueil
                </Link>
                <span className="text-[#ebd8be] font-bold">/</span>
                <Link href="/boutique" className="hover:text-[#ba4e1a] transition-colors whitespace-nowrap">
                  Boutique
                </Link>
                <span className="text-[#ebd8be] font-bold">/</span>
                <span className="text-[#ba4e1a] font-bold truncate max-w-[260px] sm:max-w-[360px]">
                  {product.name}
                </span>
              </nav>
            </div>

            {/* 2. CATEGORY (LEFT) & STOCK MESSAGE (FAR RIGHT) IN THE SAME ROW */}
            <div className="flex items-center justify-between gap-3 mt-1 mb-2">
              <Link
                href={`/boutique?categorie=${product.categorySlug || ""}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ba4e1a] bg-[#ba4e1a]/10 hover:bg-[#ba4e1a]/15 px-3 py-1 rounded-full border border-[#ba4e1a]/20 transition-colors"
              >
                {product.category || "Décoration Murale"}
              </Link>

              {product.inStock && typeof product.stockCount === "number" && product.stockCount <= 10 && (
                <div className="inline-flex items-center text-xs font-bold text-[#c2410c] bg-orange-50 px-3 py-1 rounded-full border border-orange-200/90 shadow-2xs">
                  <span>
                    En stock ({product.stockCount} {product.stockCount > 1 ? "restants" : "restant"})
                  </span>
                </div>
              )}
            </div>

            {/* 3. PRODUCT TITLE */}
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-serif font-black text-[#1c1917] tracking-tight leading-tight mt-1">
              {product.name}
            </h1>

            {/* 4. PRODUCT DESCRIPTION */}
            <p className="text-sm text-[#1c1917]/80 leading-relaxed font-normal mt-2">
              {product.description}
            </p>

            {/* 5. PRICE SECTION (Reduced gap, discount on far right, TVA sentence removed) */}
            <div className="pt-2 pb-1.5">
              <div className="flex items-baseline justify-between gap-3 w-full">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-[#ba4e1a] tracking-tight">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base sm:text-lg text-gray-400 line-through font-medium">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                {product.discountPercent && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#ba4e1a]/10 text-[#ba4e1a] border border-[#ba4e1a]/20 shrink-0">
                    Économisez {product.discountPercent}%
                  </span>
                )}
              </div>
            </div>

            {/* 6. DIMENSIONS ON LEFT (White BG) | AVIS & STARS ON FAR RIGHT (Direct on BG, no 5.0) */}
            <div className="flex items-center justify-between gap-3 py-2">
              {/* Left: Dimensions */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 text-xs font-bold text-[#8c6b51] bg-white px-3.5 py-1.5 rounded-xl border border-[#ebd8be] shadow-2xs">
                  <Ruler className="w-3.5 h-3.5 text-[#ba4e1a]" />
                  <span>
                    Dimensions : <strong className="text-[#1c1917]">{product.details?.dimensions || "75 cm × 28 cm"}</strong>
                  </span>
                </span>
              </div>

              {/* Far Right: Professional Star Rating & Reviews Count (Clean, no box) */}
              <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                <div className="flex items-center gap-0.5" title={`${product.rating}/5`}>
                  {[1, 2, 3, 4, 5].map((starIndex) => {
                    const fillRatio = Math.max(0, Math.min(1, product.rating - (starIndex - 1)));
                    return (
                      <span key={starIndex} className="relative inline-block w-4 h-4">
                        <Star className="w-4 h-4 text-[#ebd8be] fill-[#ebd8be] stroke-[1.2]" />
                        {fillRatio > 0 && (
                          <span
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${fillRatio * 100}%` }}
                          >
                            <Star className="w-4 h-4 text-amber-500 fill-amber-400 stroke-[1.2]" />
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
                <span className="text-xs text-[#1c1917]/65 font-medium ml-0.5">
                  ({product.reviewCount || 38} avis)
                </span>
              </div>
            </div>

            {/* 7. QUANTITY SELECTOR (Stylized, 100% white bg, label removed, tight padding, aligned right) */}
            <div className="flex items-center justify-end pt-1 pb-1">
              <div className="flex items-center border border-[#ebd8be] rounded-xl bg-white p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-7 h-7 rounded-lg bg-[#faf6f0] hover:bg-[#ebd8be]/40 disabled:opacity-40 text-[#1c1917] transition-all flex items-center justify-center cursor-pointer active:scale-90"
                  aria-label="Diminuer la quantité"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-bold text-sm text-[#1c1917] select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 rounded-lg bg-[#faf6f0] hover:bg-[#ebd8be]/40 text-[#1c1917] transition-all flex items-center justify-center cursor-pointer active:scale-90"
                  aria-label="Augmenter la quantité"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 8. COULEURS (Circular swatches only with hover tooltip) */}
            <div className="pt-2 pb-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1c1917]/75">
                  Couleur :
                </span>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {PRODUCT_COLORS.map((col) => {
                    const isSelected = selectedColor.id === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => {
                          setSelectedColor(col);
                          setSelectedFinish(col.label);
                        }}
                        title={col.name}
                        className={`group relative w-8 h-8 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center shadow-2xs ${
                          col.bgGradient
                        } ${
                          isSelected
                            ? "ring-2 ring-[#ba4e1a] scale-105 shadow-sm"
                            : "border border-black/10 hover:scale-110 hover:shadow-xs"
                        }`}
                      >
                        {isSelected && (
                          <Check
                            className={`w-3.5 h-3.5 ${
                              col.id === "argente" ? "text-stone-900" : "text-white"
                            }`}
                          />
                        )}

                        {/* Floating tooltip on hover */}
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none bg-[#1c1917] text-white text-[10.5px] font-bold py-1 px-2.5 rounded-md whitespace-nowrap shadow-lg z-30">
                          {col.name}
                          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-[#1c1917]" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 9. ACTION BUTTONS: "Ajouter au panier" & "Commande Express" IN ONE SINGLE ROW */}
            <div className="mt-3.5">
              {!isInlineCodOpen ? (
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {/* Bouton 1: Ajouter au panier (bloqué s'il est déjà dans le panier) */}
                  <button
                    disabled={inCart}
                    onClick={handleAddToCart}
                    className={`w-full py-3.5 px-3 sm:px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                      inCart
                        ? "bg-stone-100 border border-stone-200 text-stone-400 cursor-not-allowed shadow-none"
                        : addedAnimation
                        ? "bg-[#1c543f] text-white shadow-emerald-900/20"
                        : "bg-[#1c1917] hover:bg-[#ba4e1a] text-white shadow-[#1c1917]/20 hover:shadow-lg cursor-pointer active:scale-95"
                    }`}
                    title={inCart ? "Déjà dans le panier" : "Ajouter au panier"}
                  >
                    {inCart ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                        <span className="truncate">Déjà au panier</span>
                      </>
                    ) : addedAnimation ? (
                      <>
                        <Check className="w-4 h-4 animate-in zoom-in" />
                        <span className="truncate">Ajouté au panier !</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 shrink-0" />
                        <span className="truncate">Ajouter au panier</span>
                      </>
                    )}
                  </button>

                  {/* Bouton 2: Commande Express - Attire l'attention avec signal animé et shimmer */}
                  <button
                    type="button"
                    onClick={() => setIsInlineCodOpen(true)}
                    className="group/cta relative overflow-hidden w-full py-3.5 px-3 sm:px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-[#ba4e1a] via-[#c4622d] to-[#9c3a0c] hover:from-[#9c3a0c] hover:to-[#822f08] text-white transition-all duration-300 shadow-md shadow-[#ba4e1a]/25 hover:shadow-lg active:scale-95 cursor-pointer animate-cta-signal"
                  >
                    {/* Shimmer sweep effect */}
                    <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none animate-cta-shimmer" />

                    <PackageCheck className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover/cta:scale-110" />
                    <span className="truncate tracking-wide">Commande Express</span>
                  </button>
                </div>
              ) : (
                /* INLINE COD ORDER FORM DIRECTLY IN RIGHT COLUMN */
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#ebd8be] shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#ebd8be]/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#ba4e1a] text-white flex items-center justify-center shadow-xs">
                        <PackageCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1c1917]">
                          Commande Express
                        </h3>
                        <p className="text-[11px] text-[#1c1917]/60">
                          Paiement en espèces à la livraison (COD)
                        </p>
                      </div>
                    </div>

                    {/* Close button with signature hover:rotate-90 */}
                    <button
                      type="button"
                      onClick={() => setIsInlineCodOpen(false)}
                      className="group w-8 h-8 rounded-full border border-[#ebd8be] bg-white hover:bg-[#faf6f0] flex items-center justify-center text-[#1c1917]/70 hover:text-[#1c1917] transition-all duration-300 cursor-pointer shadow-2xs active:scale-95"
                      title="Fermer"
                      aria-label="Fermer"
                    >
                      <X className="w-4 h-4 stroke-[2] transition-transform duration-300 group-hover:rotate-90" />
                    </button>
                  </div>

                  {codSubmitted ? (
                    <div className="py-5 text-center animate-in zoom-in-95 duration-200">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2.5">
                        <Check className="w-6 h-6 stroke-[2.5]" />
                      </div>
                      <h4 className="text-sm font-black text-[#1c1917]">
                        Commande Confirmée avec Succès !
                      </h4>
                      <p className="text-xs text-[#1c1917]/70 mt-1 max-w-sm mx-auto">
                        Merci <strong>{codName}</strong>. Notre atelier vous contactera au <strong>{codPhone}</strong> pour l&apos;expédition vers <strong>{codCity === "Autre ville" && codCustomCity.trim() ? codCustomCity.trim() : codCity}</strong>.
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                        <span>Total : {formatPrice(product.price * quantity)}</span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleInlineCodSubmit} className="space-y-2.5">
                      {/* LIGNE 1 : Nom et Prénom + Téléphone (WhatsApp) sur la même ligne */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[11px] font-bold text-[#1c1917] block mb-1">
                            Nom et Prénom <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={codName}
                            onChange={(e) => setCodName(e.target.value)}
                            placeholder="Ex: Hajar Filali"
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#1c1917] block mb-1">
                            Numéro de Téléphone (WhatsApp) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            value={codPhone}
                            onChange={(e) => setCodPhone(e.target.value)}
                            placeholder="Ex: 06 12 34 56 78"
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a]"
                          />
                        </div>
                      </div>

                      {/* LIGNE 2 : Ville de Livraison (+ Précisez votre ville sur la même ligne si "Autre ville") */}
                      <div className={`grid gap-2.5 ${codCity === "Autre ville" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                        <div>
                          <label className="text-[11px] font-bold text-[#1c1917] block mb-1">
                            Ville de Livraison <span className="text-red-500">*</span>
                          </label>
                          <CustomSelect
                            value={codCity}
                            onChange={(val) => {
                              setCodCity(val);
                              if (val !== "Autre ville") {
                                setCodCustomCity("");
                              }
                            }}
                            options={cityOptions}
                            footerOption={{
                              value: "Autre ville",
                              label: "Autre ville",
                              icon: MapPin,
                            }}
                            icon={MapPin}
                            searchable={true}
                            searchPlaceholder="Rechercher une ville..."
                            placeholder="Sélectionnez votre ville"
                            className="w-full"
                          />
                        </div>

                        {codCity === "Autre ville" && (
                          <div className="animate-in fade-in slide-in-from-left-2 duration-200">
                            <label className="text-[11px] font-bold text-[#1c1917] block mb-1">
                              Précisez votre ville <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <MapPin className="w-3.5 h-3.5 text-[#ba4e1a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                required
                                value={codCustomCity}
                                onChange={(e) => setCodCustomCity(e.target.value)}
                                placeholder="Entrez le nom de votre ville..."
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a]"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* LIGNE 3 : Adresse de livraison toute seule sur sa ligne */}
                      <div>
                        <label className="text-[11px] font-bold text-[#1c1917] block mb-1">
                          Adresse de livraison <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={codAddress}
                          onChange={(e) => setCodAddress(e.target.value)}
                          placeholder="Quartier, rue, numéro d'immeuble ou maison..."
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a]"
                        />
                      </div>

                      {/* Bouton de confirmation unique (Pas de bouton Annuler) */}
                      <div className="pt-1">
                        <button
                          type="submit"
                          className="group/codsubmit relative overflow-hidden w-full py-3.5 px-4 rounded-xl font-extrabold text-xs bg-gradient-to-r from-[#ba4e1a] via-[#c4622d] to-[#9c3a0c] hover:from-[#9c3a0c] hover:to-[#822f08] text-white shadow-md shadow-[#ba4e1a]/25 hover:shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          {/* Shimmer sweep effect */}
                          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none animate-cta-shimmer" />

                          <PackageCheck className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover/codsubmit:scale-110" />
                          <span className="relative z-10">Confirmer ma commande ({formatPrice(product.price * quantity)})</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Direct WhatsApp Contact line */}
            <div className="mt-3.5 text-center">
              <a
                href={`https://wa.me/212600000000?text=${encodeURIComponent(
                  `Bonjour MARJAD, je souhaite commander la pièce "${product.name}" (${formatPrice(product.price)}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1c543f] hover:underline"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Besoin d&apos;un conseil sur mesure ? Discuter sur WhatsApp</span>
              </a>
            </div>

            {/* ================= 3 REASSURANCE PILLARS ================= */}
            <div className="w-full grid grid-cols-3 gap-2.5 sm:gap-3 mt-4">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-white border border-[#ebd8be]/50 text-center shadow-2xs">
                <Truck className="w-4 h-4 text-[#ba4e1a] mx-auto mb-1" />
                <span className="text-[11px] font-bold block text-[#1c1917]">Livraison 48h</span>
                <span className="text-[9.5px] sm:text-[10px] text-[#1c1917]/60">Gratuite au Maroc</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-2xl bg-white border border-[#ebd8be]/50 text-center shadow-2xs">
                <Banknote className="w-4 h-4 text-[#ba4e1a] mx-auto mb-1" />
                <span className="text-[11px] font-bold block text-[#1c1917]">Paiement Cash</span>
                <span className="text-[9.5px] sm:text-[10px] text-[#1c1917]/60">À la réception (COD)</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-2xl bg-white border border-[#ebd8be]/50 text-center shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#ba4e1a] mx-auto mb-1" />
                <span className="text-[11px] font-bold block text-[#1c1917]">Anti-Casse</span>
                <span className="text-[9.5px] sm:text-[10px] text-[#1c1917]/60">Échange garanti</span>
              </div>
            </div>

            {/* ================= 3 INFORMATION TABS (MOVED TO RIGHT COLUMN) ================= */}
            <div className="mt-4 pt-1">
              
              {/* Tab Navigation Buttons */}
              <div className="flex items-center gap-2 border-b border-[#ebd8be]/40 pb-2.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab("specs")}
                  className={`pb-2 px-3 text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer border-b-2 -mb-[12px] whitespace-nowrap ${
                    activeTab === "specs"
                      ? "border-[#ba4e1a] text-[#ba4e1a]"
                      : "border-transparent text-[#1c1917]/60 hover:text-[#1c1917]"
                  }`}
                >
                  Caractéristiques & Matériaux
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("installation")}
                  className={`pb-2 px-3 text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer border-b-2 -mb-[12px] whitespace-nowrap ${
                    activeTab === "installation"
                      ? "border-[#ba4e1a] text-[#ba4e1a]"
                      : "border-transparent text-[#1c1917]/60 hover:text-[#1c1917]"
                  }`}
                >
                  Conseils d&apos;Installation
                </button>
              </div>

              {/* Tab Content Display */}
              <div className="pt-5">
                {activeTab === "specs" && (
                  <div className="space-y-5 bg-white p-5 sm:p-6 rounded-2xl border border-[#ebd8be] shadow-2xs">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#ba4e1a] mb-2.5">
                        Fiche Technique
                      </h4>
                      <dl className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between border-b border-[#ebd8be]/40 pb-1.5">
                          <dt className="text-[#1c1917]/70 font-medium">Dimensions</dt>
                          <dd className="font-bold text-[#1c1917]">{product.details?.dimensions || "Format d'apparat"}</dd>
                        </div>
                        <div className="flex justify-between border-b border-[#ebd8be]/40 pb-1.5">
                          <dt className="text-[#1c1917]/70 font-medium">Matériaux nobles</dt>
                          <dd className="font-bold text-[#1c1917]">{product.details?.material || "Bois noble & Métal d'art"}</dd>
                        </div>
                        <div className="flex justify-between border-b border-[#ebd8be]/40 pb-1.5">
                          <dt className="text-[#1c1917]/70 font-medium">Origine</dt>
                          <dd className="font-bold text-[#1c1917]">{product.details?.origin || "Royaume du Maroc"}</dd>
                        </div>
                        <div className="flex justify-between border-b border-[#ebd8be]/40 pb-1.5">
                          <dt className="text-[#1c1917]/70 font-medium">Technique</dt>
                          <dd className="font-bold text-[#1c1917]">{product.details?.technique || "Sculpture et ciselure à la main"}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="pt-2 border-t border-[#ebd8be]/40">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#ba4e1a] mb-2">
                        Garanties de Fabrication
                      </h4>
                      <ul className="space-y-2 text-xs text-[#1c1917]/80">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>Bois de premier choix séché sous abri pendant 3 ans</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>Dorure traitée anti-oxydation pour une brillance éternelle</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>Accroches murales renforcées déjà pré-installées au dos</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}


                {activeTab === "installation" && (
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#ebd8be] space-y-3 shadow-2xs">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#1c1917]">
                      Guide de pose rapide (Inclus dans votre colis) :
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-[#faf6f0] border border-[#ebd8be]/60">
                        <span className="w-5 h-5 rounded-full bg-[#ba4e1a] text-white text-[11px] font-bold flex items-center justify-center mb-1.5">1</span>
                        <strong className="block text-xs text-[#1c1917] mb-0.5">Repérage mural</strong>
                        <p className="text-[#1c1917]/70 text-[11px]">Positionnez à hauteur des yeux (idéalement 1m55). Un gabarit papier est fourni.</p>
                      </div>
                      <div className="p-3 rounded-xl bg-[#faf6f0] border border-[#ebd8be]/60">
                        <span className="w-5 h-5 rounded-full bg-[#ba4e1a] text-white text-[11px] font-bold flex items-center justify-center mb-1.5">2</span>
                        <strong className="block text-xs text-[#1c1917] mb-0.5">Fixation solide</strong>
                        <p className="text-[#1c1917]/70 text-[11px]">Deux chevilles et vis dorées sont incluses dans le coffret pour une pose discrète.</p>
                      </div>
                      <div className="p-3 rounded-xl bg-[#faf6f0] border border-[#ebd8be]/60">
                        <span className="w-5 h-5 rounded-full bg-[#ba4e1a] text-white text-[11px] font-bold flex items-center justify-center mb-1.5">3</span>
                        <strong className="block text-xs text-[#1c1917] mb-0.5">Entretien doux</strong>
                        <p className="text-[#1c1917]/70 text-[11px]">Dépoussiérer simplement avec un chiffon microfibre sec. Sans produits corrosifs.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= SEPARATOR (90% WIDTH) ================= */}
      <div className="w-[90%] mx-auto border-t border-[#ebd8be]/50 mt-8 sm:mt-10" />

      {/* ================= RELATED CREATIONS (HARMONIE DÉCO) ================= */}
      <section className="w-full pt-6 sm:pt-8 px-0">
        <div className="w-[92%] sm:w-[94%] max-w-7xl mx-auto px-0 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#ba4e1a]">
            Harmonie Déco
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#1c1917] mt-1">
            Créations Complémentaires
          </h3>
        </div>

        {/* Carousel Container: Full screen edge-to-edge with 0 left/right padding */}
        <div className="relative w-full group/carousel px-0">
          {/* Left subtle shadow & fade overlay */}
          <div
            className={`pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 z-20 transition-opacity duration-300 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          >
            <div className="w-full h-full bg-gradient-to-r from-white via-white/85 to-transparent relative">
              <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/[0.04] to-transparent" />
            </div>
          </div>

          {/* Right subtle shadow & fade overlay */}
          <div
            className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-20 transition-opacity duration-300 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          >
            <div className="w-full h-full bg-gradient-to-l from-white via-white/85 to-transparent relative">
              <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/[0.04] to-transparent" />
            </div>
          </div>

          {/* Navigation Arrows for desktop hover */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollCarouselBy("left")}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-white border border-[#ebd8be] shadow-lg items-center justify-center text-[#1c1917] hover:text-[#ba4e1a] transition-all hover:scale-105 active:scale-95 cursor-pointer opacity-0 group-hover/carousel:opacity-100"
              aria-label="Défiler vers la gauche"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollCarouselBy("right")}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-white border border-[#ebd8be] shadow-lg items-center justify-center text-[#1c1917] hover:text-[#ba4e1a] transition-all hover:scale-105 active:scale-95 cursor-pointer opacity-0 group-hover/carousel:opacity-100"
              aria-label="Défiler vers la droite"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* 4 Décorations en 1 seul rang horizontal avec défilement fluide overflow-x */}
          <div
            ref={carouselRef}
            onScroll={checkCarouselScroll}
            className="flex gap-4 sm:gap-5 overflow-x-auto pt-4 pb-6 px-0 no-scrollbar scroll-smooth"
          >
            {complementaryProducts.map((p, index) => (
              <div
                key={p.id}
                className={`w-[260px] sm:w-[275px] md:w-[285px] shrink-0 py-3 ${
                  index === 0 ? "ml-4 sm:ml-6 lg:ml-8" : ""
                } ${
                  index === complementaryProducts.length - 1 ? "mr-4 sm:mr-6 lg:mr-8" : ""
                }`}
              >
                <ProductCard product={p} variant="grid" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAST COD CHECKOUT MODAL ================= */}
      {isCodModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsCodModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl border border-[#ebd8be] p-6 sm:p-8 shadow-2xl overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton Fermer avec rotation fluide */}
            <button
              onClick={() => setIsCodModalOpen(false)}
              className="group absolute top-4 right-4 w-8 h-8 rounded-full border border-[#ebd8be] hover:border-[#c4622d] bg-white hover:bg-[#c4622d]/10 flex items-center justify-center text-[#1c1917]/60 hover:text-[#c4622d] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
              aria-label="Fermer la commande rapide"
              title="Fermer (Échap)"
            >
              <X className="w-4 h-4 stroke-[2] transition-transform duration-300 group-hover:rotate-90" />
            </button>

            {codSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h3 className="font-serif font-black text-2xl text-[#1c1917]">
                  Commande Express Validée !
                </h3>
                <p className="text-sm text-[#1c1917]/70 max-w-sm mx-auto">
                  Merci <strong>{codName}</strong>. Notre conseiller vous contactera au <strong>{codPhone}</strong> pour confirmer l&apos;expédition de votre pièce.
                </p>
                <div className="pt-4">
                  <span className="text-xs font-bold text-[#ba4e1a] bg-[#faf6f0] px-4 py-2 rounded-full border border-[#ebd8be]">
                    Paiement à la livraison : {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#ebd8be]/40">
                  <div className="w-14 h-14 rounded-2xl bg-[#faf6f0] border border-[#ebd8be] p-2 flex items-center justify-center shrink-0">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="object-contain max-h-[50px] w-auto"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#ba4e1a] uppercase tracking-wider block">
                      Commande Express (Paiement à la livraison)
                    </span>
                    <h3 className="font-serif font-black text-base text-[#1c1917] line-clamp-1">
                      {product.name}
                    </h3>
                    <span className="text-xs font-bold text-[#ba4e1a]">
                      {quantity} x {formatPrice(product.price)} = {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleCodSubmit} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-[#1c1917] block mb-1">
                      Nom et Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={codName}
                      onChange={(e) => setCodName(e.target.value)}
                      placeholder="Ex: Hajar El Fassi"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ebd8be] bg-[#faf6f0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1c1917] block mb-1">
                      Numéro de Téléphone (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={codPhone}
                      onChange={(e) => setCodPhone(e.target.value)}
                      placeholder="Ex: 06 12 34 56 78"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ebd8be] bg-[#faf6f0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#1c1917] block mb-1">
                        Ville *
                      </label>
                      <input
                        type="text"
                        required
                        value={codCity}
                        onChange={(e) => setCodCity(e.target.value)}
                        placeholder="Ex: Casablanca"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#ebd8be] bg-[#faf6f0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#1c1917] block mb-1">
                        Finition choisie
                      </label>
                      <input
                        type="text"
                        disabled
                        value={selectedFinish}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#ebd8be] bg-gray-100 text-xs font-bold text-[#1c1917]/70 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1c1917] block mb-1">
                      Adresse de livraison *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={codAddress}
                      onChange={(e) => setCodAddress(e.target.value)}
                      placeholder="Quartier, Rue, N° d'appartement..."
                      className="w-full px-4 py-2 rounded-xl border border-[#ebd8be] bg-[#faf6f0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#ba4e1a] to-[#9c3a0c] hover:from-[#9c3a0c] hover:to-[#822f08] text-white transition-all duration-300 shadow-md shadow-[#ba4e1a]/25 hover:shadow-lg active:scale-95 cursor-pointer mt-2"
                  >
                    Confirmer ma commande ({formatPrice(product.price * quantity)})
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL AGRANDIR LA PIÈCE (SIMULATEUR SALON MAROCAIN PLEIN ÉCRAN - STYLE CARTE 70%x90%) ================= */}
      {isSimulatorModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSimulatorModalOpen(false);
          }}
        >
          {/* Modal Container: Exact Left-Card Style at 70% Width & 90% Height */}
          <div
            className="w-[94%] sm:w-[82%] lg:w-[70%] h-[88%] sm:h-[90%] max-h-[90vh] rounded-[32px] sm:rounded-[36px] bg-[#1a1714] border border-[#ebd8be] shadow-2xl relative overflow-hidden flex flex-col justify-between select-none animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Photorealistic Salon Background Filling Entire Div */}
            <div className="absolute inset-0 z-0">
              <Image
                src={selectedWall.image}
                alt={`Salon marocain - Mur ${selectedWall.name}`}
                fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                priority
                className="object-cover object-[center_42%] transition-all duration-700 ease-out"
              />
              {/* Subtle room lighting vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />
            </div>

            {/* Top Floating Controls Bar */}
            <div className="relative z-20 p-4 sm:p-6 flex items-center justify-between">
              {/* Simulateur 3D Badge (Sans icône verte) */}
              <div className="flex items-center bg-black/55 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-md">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-white">
                  Simulateur Salon 3D • Plein Écran
                </span>
              </div>

              {/* Close Button X avec animation de rotation fluide signature */}
              <button
                onClick={() => setIsSimulatorModalOpen(false)}
                className="group w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/55 hover:bg-black/85 backdrop-blur-md text-white/80 hover:text-white border border-white/20 hover:border-white/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                title="Fermer le simulateur (Échap)"
                aria-label="Fermer le simulateur"
              >
                <X className="w-5 h-5 stroke-[2] transition-transform duration-300 group-hover:rotate-90" />
              </button>
            </div>

            {/* Realistic Wall Mounted Product Piece (Shifted Right, Balanced Height & Refined Scale) */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
              style={{ transform: "translate(12%, -8%)" }}
            >
              <div className="relative pointer-events-auto transition-transform duration-700 ease-out hover:scale-105">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={560}
                  height={560}
                  priority
                  className="object-contain max-h-[130px] sm:max-h-[160px] lg:max-h-[185px] max-w-[200px] sm:max-w-[250px] lg:max-w-[290px] w-auto drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.22)] transition-all duration-500 filter"
                />
              </div>
            </div>

            {/* Bottom Interactive Wall Color Palette Bar (Floating in Room) */}
            <div className="relative z-20 p-4 sm:p-6">
              <div className="bg-black/60 backdrop-blur-lg border border-white/20 p-3 sm:p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 max-w-xl mx-auto">
                <div className="flex items-center gap-2.5 pl-1">
                  <div className="p-1.5 rounded-lg bg-white/10 text-[#e5a855]">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black tracking-wider text-white/60">
                      Teinte du mur
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                      {selectedWall.name}
                    </span>
                  </div>
                </div>

                {/* Color Swatches */}
                <div className="flex items-center gap-2 sm:gap-2.5">
                  {WALL_COLORS.map((color) => {
                    const isSelected = selectedWallId === color.id;
                    return (
                      <button
                        key={color.id}
                        onClick={() => setSelectedWallId(color.id)}
                        className={`relative w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? "scale-115 ring-2 ring-white ring-offset-2 ring-offset-black/70 shadow-md"
                            : "hover:scale-110 opacity-75 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={`${color.name} - ${color.description}`}
                        aria-label={color.name}
                      >
                        {isSelected && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <Check
                              className={`w-3.5 h-3.5 ${
                                color.id === "blanc" || color.id === "babywhite" || color.id === "creme"
                                  ? "text-stone-900"
                                  : "text-white"
                              }`}
                            />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

