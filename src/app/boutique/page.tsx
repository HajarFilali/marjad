"use client";

import React, { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DECOR_PRODUCTS } from "@/data/mockProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  X,
  Compass,
  Award,
  Layers,
  Palette,
  Coins,
  Tag,
  Clock,
  TrendingUp,
  Grid3X3,
  LayoutList,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Les 5 catégories authentiques des créations MARJAD
const STORE_CATEGORIES = [
  { id: "all", name: "Toute la Boutique", slug: "all" },
  { id: "calligraphie", name: "Calligraphie Murale", slug: "calligraphie" },
  { id: "etagere", name: "Étagères & Mobilier Mural", slug: "etagere" },
  { id: "arche", name: "Arches & Panneaux", slug: "arche" },
  { id: "miroir", name: "Miroirs d'Art", slug: "miroir" },
  { id: "medaillon", name: "Médaillons & Reliefs", slug: "medaillon" },
];

const SORT_OPTIONS = [
  { value: "default", label: "Sélection recommandée", icon: ArrowUpDown },
  { value: "price-asc", label: "Prix : croissant", icon: ArrowUpDown },
  { value: "price-desc", label: "Prix : décroissant", icon: ArrowUpDown },
  { value: "rating", label: "Mieux notés", icon: Award },
];

const ITEMS_PER_PAGE = 9;

function BoutiqueContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || searchParams.get("cat");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxBudget, setMaxBudget] = useState<number>(2500);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("all");
  const [specialCollection, setSpecialCollection] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Synchronisation dynamique du paramètre de catégorie depuis l'URL
  useEffect(() => {
    if (categoryParam) {
      const p = categoryParam.toLowerCase();
      const matched = STORE_CATEGORIES.find(
        (c) =>
          c.id.toLowerCase() === p ||
          c.slug.toLowerCase() === p ||
          p.includes(c.id.toLowerCase()) ||
          c.slug.toLowerCase().includes(p)
      );
      if (matched) {
        setSelectedCategory(matched.slug);
      } else {
        setSelectedCategory(categoryParam);
      }
      setCurrentPage(1);
    }
  }, [categoryParam]);

  // Positionnement 100% FIXE du panneau de filtres avec symétrie parfaite des gaps (Haut = Bas)
  const asideRef = useRef<HTMLElement>(null);
  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const updatePosition = () => {
      if (!asideRef.current) return;
      const rect = asideRef.current.getBoundingClientRect();
      if (window.innerWidth >= 1024) {
        const isAtTop = window.scrollY < 35;
        // At top: Navbar is at 48px, height 60px => bottom at 108px. Gap 18px => top = 126px.
        // Scrolled: Navbar is at 16px, height 60px => bottom at 76px. Gap 18px => top = 96px.
        const topOffset = isAtTop ? 126 : 96;
        setSidebarStyle({
          position: "fixed",
          top: `${topOffset}px`,
          bottom: "18px",
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          zIndex: 30,
          transition: "top 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        });
      } else {
        setSidebarStyle({});
      }
    };

    updatePosition();
    const frameId = requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, []);

  // Extraction dynamique et distincte des matières depuis les créations
  const availableMaterials = useMemo(() => {
    const rawSet = new Set<string>();

    DECOR_PRODUCTS.forEach((product) => {
      if (product.details?.material) {
        const parts = product.details.material
          .split(/[,&]/)
          .map((m) => m.trim())
          .filter(Boolean);

        parts.forEach((part) => {
          const formatted = part.charAt(0).toUpperCase() + part.slice(1);
          if (formatted.length > 2) {
            rawSet.add(formatted);
          }
        });
      }
    });

    const uniqueList = Array.from(rawSet).sort((a, b) => a.localeCompare(b, "fr"));

    return [
      { label: "Toutes les matières", value: "all" },
      ...uniqueList.map((m) => ({ label: m, value: m.toLowerCase() })),
    ];
  }, []);

  // Options de catégories pour le CustomSelect avec comptage précis
  const categoryOptions = useMemo(() => {
    return STORE_CATEGORIES.map((cat) => {
      const count =
        cat.slug === "all"
          ? DECOR_PRODUCTS.length
          : DECOR_PRODUCTS.filter((p) => {
              const catLower = cat.slug.toLowerCase();
              const prodCat = p.category.toLowerCase();
              return (
                prodCat.includes(catLower) ||
                (catLower === "calligraphie" && prodCat.includes("calligraphie")) ||
                (catLower === "etagere" && prodCat.includes("étagère")) ||
                (catLower === "arche" && prodCat.includes("arche")) ||
                (catLower === "miroir" && prodCat.includes("miroir")) ||
                (catLower === "medaillon" && prodCat.includes("médaillon"))
              );
            }).length;
      return {
        value: cat.slug,
        label: cat.name,
        count,
        icon: Layers,
      };
    });
  }, []);

  // Filtrage combiné sur les créations authentiques
  const filteredProducts = useMemo(() => {
    return DECOR_PRODUCTS.filter((product) => {
      // 1. Recherche texte (nom, catégorie, description, tags, artisan)
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchName = product.name.toLowerCase().includes(q);
        const matchNameAr = product.nameAr?.toLowerCase().includes(q) || false;
        const matchCategory = product.category.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        const matchArtisan = product.artisan?.name.toLowerCase().includes(q) || false;
        const matchCity = product.artisan?.city.toLowerCase().includes(q) || false;
        const matchTag = product.tags?.some((t) => t.toLowerCase().includes(q)) || false;
        if (!matchName && !matchNameAr && !matchCategory && !matchDesc && !matchArtisan && !matchCity && !matchTag) {
          return false;
        }
      }

      // 2. Filtre Catégorie
      if (selectedCategory !== "all") {
        const catLower = selectedCategory.toLowerCase();
        const prodCat = product.category.toLowerCase();
        const matchesCategory =
          prodCat.includes(catLower) ||
          (catLower.includes("calligraphie") && prodCat.includes("calligraphie")) ||
          (catLower.includes("etagere") && prodCat.includes("étagère")) ||
          (catLower.includes("arche") && prodCat.includes("arche")) ||
          (catLower.includes("miroir") && prodCat.includes("miroir")) ||
          (catLower.includes("medaillon") && prodCat.includes("médaillon"));

        if (!matchesCategory) {
          return false;
        }
      }

      // 3. Collections Spéciales
      if (specialCollection === "promo") {
        const hasPromo = product.originalPrice && product.originalPrice > product.price;
        if (!hasPromo) return false;
      } else if (specialCollection === "nouveautes") {
        const isNew = product.tags?.some((t) => t.toLowerCase().includes("nouveau") || t.toLowerCase().includes("récent")) || ["decor-1", "decor-2", "decor-3", "decor-4"].includes(String(product.id));
        if (!isNew) return false;
      } else if (specialCollection === "bestsellers") {
        if (product.rating < 4.8) return false;
      }

      // 4. Filtre Budget Maximum (Slider)
      if (product.price > maxBudget) return false;

      // 5. Filtre Matière
      if (selectedMaterial !== "all") {
        const mat = selectedMaterial.toLowerCase();
        const detailsMat = product.details?.material?.toLowerCase() || "";
        const desc = product.description.toLowerCase();
        const tags = product.tags?.map((t) => t.toLowerCase()) || [];
        const hasMaterial =
          detailsMat.includes(mat) ||
          desc.includes(mat) ||
          tags.some((t) => t.includes(mat));
        if (!hasMaterial) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // default
    });
  }, [searchQuery, selectedCategory, specialCollection, maxBudget, selectedMaterial, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    specialCollection !== "all" ||
    maxBudget < 2500 ||
    selectedMaterial !== "all" ||
    sortBy !== "default";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSpecialCollection("all");
    setMaxBudget(2500);
    setSelectedMaterial("all");
    setSortBy("default");
    setCurrentPage(1);
  };

  // Réinitialiser la page à 1 lors du changement de filtres ou de recherche
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, maxBudget, selectedMaterial, specialCollection, sortBy]);

  // Calculs de pagination (9 créations par page)
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  // Compteurs pour les collections
  const promoCount = useMemo(
    () => DECOR_PRODUCTS.filter((p) => p.originalPrice && p.originalPrice > p.price).length,
    []
  );
  const bestCount = useMemo(
    () => DECOR_PRODUCTS.filter((p) => p.rating >= 4.8).length,
    []
  );

  // Pourcentage slider budget (Min 800 MAD, Max 2500 MAD)
  const sliderPercentage = Math.min(100, Math.max(0, ((maxBudget - 800) / (2500 - 800)) * 100));

  return (
    <div className="bg-[#ffffff] pt-28 sm:pt-[126px] pb-2 sm:pb-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* 2-COLUMN MAIN LAYOUT :                                                    */}
        {/* LEFT (22%) = FILTRES ONLY (FIXE & STICKY, FOND BEIGE #faf8f5)             */}
        {/* RIGHT (78%) = HEADER CARD (BLANC) + SUB-BAR (BLANC) + PRODUITS            */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 relative">

          {/* ======================================================================= */}
          {/* LA PARTIE LEFT (22% Width) : FILTRES UNIQUE & 100% FIXE                 */}
          {/* ======================================================================= */}
          <aside
            ref={asideRef}
            className={`w-full lg:w-[22%] shrink-0 ${
              mobileFiltersOpen ? "block" : "hidden lg:block"
            }`}
          >
            {/* Background beige #faf8f5 : Gap du haut (sous la navbar) = Gap du bas (au-dessus du bas de l'écran) */}
            <div
              style={sidebarStyle}
              className="rounded-3xl bg-[#faf8f5] border border-[#ebd8be] p-4.5 sm:p-5 pb-6 shadow-xs space-y-4 overflow-y-auto no-scrollbar"
            >
              
              {/* En-tête Filtres */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#ebd8be]/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#c4622d]/10 text-[#c4622d] flex items-center justify-center shrink-0">
                    <SlidersHorizontal className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-sm sm:text-base text-[#1c1917]">
                      Filtres Les Créations
                    </h2>
                    <p className="text-[10px] text-[#78716c] font-medium">
                      Affinez votre sélection MARJAD
                    </p>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#c4622d] hover:text-[#9e461a] hover:bg-[#c4622d]/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Réinitialiser</span>
                  </button>
                )}
              </div>

              {/* SECTION 1: COLLECTIONS SPÉCIALES */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#78716c]">
                  <Tag className="w-3.5 h-3.5 text-[#c4622d]" />
                  <span>Collections Spéciales</span>
                </div>

                <div className="space-y-1.5">
                  {[
                    { id: "promo", label: "Pièces en Promotion", count: promoCount, icon: Tag },
                    { id: "nouveautes", label: "Nouveautés de l'Atelier", count: 4, icon: Clock },
                    { id: "bestsellers", label: "Meilleures Ventes", count: bestCount, icon: TrendingUp },
                  ].map((item) => {
                    const isChecked = specialCollection === item.id;
                    const ItemIcon = item.icon;
                    return (
                      <label
                        key={item.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer font-medium select-none ${
                          isChecked
                            ? "bg-[#c4622d]/10 border-[#c4622d] text-[#c4622d] font-bold"
                            : "bg-white/60 border-[#ebd8be]/60 text-[#57534e] hover:bg-white hover:border-[#ebd8be]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <ItemIcon className="w-3.5 h-3.5 text-[#c4622d]" />
                          <span className="text-xs">{item.label}</span>
                          <span className="text-[10px] text-[#78716c] font-normal">({item.count})</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setSpecialCollection(isChecked ? "all" : item.id)
                          }
                          className="w-4 h-4 rounded border-[#ebd8be] accent-[#c4622d] cursor-pointer"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: CATÉGORIE D'ARTISANAT */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#78716c]">
                  <Layers className="w-3.5 h-3.5 text-[#c4622d]" />
                  <span>Catégorie de Décor</span>
                </div>

                <CustomSelect
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categoryOptions}
                  icon={Layers}
                  className="w-full"
                />
              </div>

              {/* SECTION 3: MATIÈRES NOBLES & SAVOIR-FAIRE */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#78716c]">
                  <Palette className="w-3.5 h-3.5 text-[#c4622d]" />
                  <span>Matières &amp; Métiers d&apos;Art</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {availableMaterials.map((m) => {
                    const isSelected = selectedMaterial === m.value;
                    return (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setSelectedMaterial(isSelected ? "all" : m.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-[#c4622d] border-[#c4622d] text-white shadow-2xs"
                            : "bg-white border-[#ebd8be] text-[#57534e] hover:border-[#c4622d] hover:text-[#c4622d]"
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 4: BUDGET MAXIMUM (SLIDER RANGE) */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#1c1917]">
                    <Coins className="w-4 h-4 text-[#c4622d]" />
                    <span>BUDGET MAXIMUM</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white border border-[#ebd8be] shadow-2xs text-xs font-bold text-[#1c1917]">
                    {maxBudget} MAD
                  </div>
                </div>

                <div className="relative py-1">
                  <input
                    type="range"
                    min={800}
                    max={2500}
                    step={50}
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#c4622d] focus:outline-none"
                    style={{
                      background: `linear-gradient(to right, #c4622d 0%, #c4622d ${sliderPercentage}%, #ebd8be ${sliderPercentage}%, #ebd8be 100%)`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-semibold text-[#78716c] px-0.5">
                  <span>800 MAD</span>
                  <span>1 650 MAD</span>
                  <span>2 500 MAD</span>
                </div>
              </div>

            </div>
          </aside>

          {/* ======================================================================= */}
          {/* LA PARTIE RIGHT (78% Width) : HEADER + SUB-BAR + PRODUITS               */}
          {/* ======================================================================= */}
          <main className="flex-1 min-w-0 w-full lg:w-[78%] space-y-4">
            
            {/* 1. TOP HEADER CARD (Fond Blanc, Sans fil d'Ariane) */}
            <div className="rounded-3xl bg-white border border-[#ebd8be] px-4 sm:px-5 py-3.5 sm:py-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c4622d]/10 text-[#9a4316] text-[11px] font-bold uppercase tracking-wider shrink-0 w-fit">
                  <Compass className="w-3.5 h-3.5 text-[#c4622d]" />
                  <span>CATALOGUE OFFICIEL</span>
                </div>

                {/* Droite : Barre de recherche intégrée sur la même ligne (Fond Blanc) */}
                <div className="relative w-full sm:w-72 lg:w-80">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par nom, matière..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-[#ebd8be] text-xs text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:ring-1 focus:ring-[#c4622d] focus:border-[#c4622d] transition-all font-medium"
                  />
                  <Search className="w-4 h-4 text-[#78716c] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#78716c] hover:text-[#1c1917] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Titre & Description de la Boutique */}
              <div className="mt-2.5 sm:mt-3">
                <h1 className="text-xl sm:text-2xl font-serif font-black text-[#1c1917] tracking-tight">
                  Boutique <span className="text-[#c4622d] italic">MARJAD</span>
                </h1>
                <p className="mt-1 text-xs text-[#78716c] font-medium leading-relaxed max-w-2xl">
                  Explorez l&apos;intégralité de nos pièces d&apos;artisanat marocain d&apos;exception et créations 100% authentiques faites main.
                </p>
              </div>
            </div>

            {/* 2. SUB-BAR : COMPTEUR + TRI + VUES (Fond Blanc) */}
            <div className="rounded-2xl bg-white border border-[#ebd8be] px-4 py-2.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-[#78716c] font-medium">
                Affichage de{" "}
                <span className="font-bold text-[#1c1917]">
                  {filteredProducts.length === 0 ? 0 : startIndex + 1}
                </span>
                {" à "}
                <span className="font-bold text-[#1c1917]">{endIndex}</span> sur{" "}
                <span className="font-bold text-[#c4622d]">{filteredProducts.length}</span> créations
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <div className="w-56 sm:w-60">
                  <CustomSelect
                    value={sortBy}
                    onChange={setSortBy}
                    options={SORT_OPTIONS}
                    icon={ArrowUpDown}
                    className="w-full text-xs"
                  />
                </div>

                <div className="flex items-center p-0.5 rounded-lg border border-[#ebd8be] bg-[#faf8f5]">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-all cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-[#c4622d] text-white shadow-2xs"
                        : "text-[#78716c] hover:text-[#1c1917]"
                    }`}
                    title="Vue Grille (3 par ligne)"
                  >
                    <Grid3X3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-all cursor-pointer ${
                      viewMode === "list"
                        ? "bg-[#c4622d] text-white shadow-2xs"
                        : "text-[#78716c] hover:text-[#1c1917]"
                    }`}
                    title="Vue Liste (1 par ligne)"
                  >
                    <LayoutList className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3. GRILLE DE PRODUITS : EXACTEMENT 3 PAR LIGNE SUR ÉCRAN ORDINATEUR (LG & XL) */}
            {paginatedProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5"
                    : "space-y-4"
                }
              >
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-white border border-[#ebd8be] p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#c4622d]/10 text-[#c4622d] flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#1c1917]">
                  Aucune création trouvée
                </h3>
                <p className="text-xs text-[#78716c] max-w-sm mx-auto">
                  Aucun article ne correspond à vos critères de recherche actuels.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c4622d] text-white text-xs font-bold hover:bg-[#9e461a] transition-all shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réinitialiser les filtres</span>
                </button>
              </div>
            )}

            {/* 4. PAGINATION */}
            {totalPages > 1 && (
              <div className="pt-1.5 sm:pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-[#78716c] font-medium order-2 sm:order-1">
                  Page <span className="font-bold text-[#1c1917]">{currentPage}</span> sur{" "}
                  <span className="font-bold text-[#1c1917]">{totalPages}</span>
                </div>

                <div className="flex items-center gap-1.5 order-1 sm:order-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      currentPage === 1
                        ? "bg-[#faf8f5] border-[#ebd8be]/50 text-[#a8a29e] cursor-not-allowed opacity-60"
                        : "bg-white border-[#ebd8be] text-[#1c1917] hover:border-[#ba4e1a] hover:text-[#ba4e1a] hover:shadow-2xs cursor-pointer active:scale-95"
                    }`}
                    aria-label="Page précédente"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Précédent</span>
                  </button>

                  {getPageNumbers().map((page, idx) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`dots-${idx}`}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs text-[#a8a29e] font-bold"
                        >
                          ...
                        </span>
                      );
                    }

                    const pageNum = Number(page);
                    const isActive = pageNum === currentPage;

                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                          isActive
                            ? "bg-[#ba4e1a] text-white shadow-xs"
                            : "bg-white border border-[#ebd8be] text-[#1c1917] hover:border-[#ba4e1a] hover:text-[#ba4e1a] hover:shadow-2xs cursor-pointer active:scale-95"
                        }`}
                        aria-label={`Page ${pageNum}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      currentPage === totalPages
                        ? "bg-[#faf8f5] border-[#ebd8be]/50 text-[#a8a29e] cursor-not-allowed opacity-60"
                        : "bg-white border-[#ebd8be] text-[#1c1917] hover:border-[#ba4e1a] hover:text-[#ba4e1a] hover:shadow-2xs cursor-pointer active:scale-95"
                    }`}
                    aria-label="Page suivante"
                  >
                    <span>Suivant</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}

export default function BoutiquePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#ffffff]" />}>
      <BoutiqueContent />
    </Suspense>
  );
}
