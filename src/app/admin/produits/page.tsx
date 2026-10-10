"use client";

export const dynamic = "force-dynamic";

import React, { useState, useMemo, useEffect, useCallback, useRef, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CustomSelect } from "@/components/admin/CustomSelect";
import {
  INITIAL_ADMIN_PRODUCTS,
  INITIAL_ADMIN_CATEGORIES,
  AdminProduct,
  addAdminNotification,
} from "@/lib/adminData";
import {
  ArrowUpDown,
  ShoppingBag,
  Star,
  Edit2,
  Trash2,
  X,
  RotateCcw,
  Package,
  Layers,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
} from "lucide-react";

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>(INITIAL_ADMIN_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_ADMIN_CATEGORIES);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("marjad_admin_products");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }
      const storedCats = localStorage.getItem("marjad_admin_categories");
      if (storedCats) {
        const parsedCats = JSON.parse(storedCats);
        if (Array.isArray(parsedCats) && parsedCats.length > 0) {
          setCategories(parsedCats);
        }
      }
    } catch {}
  }, []);

  const saveProducts = (updated: AdminProduct[]) => {
    setProducts(updated);
    try {
      localStorage.setItem("marjad_admin_products", JSON.stringify(updated));
    } catch {}
  };

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState("all");
  const [sortBy, setSortBy] = useState<
    "date-desc" | "date-asc" | "sales-desc" | "rating-desc" | "price-asc" | "price-desc" | "stock-asc"
  >("date-desc");

  const [highlightedId, setHighlightedId] = useState<string | number | null>(null);



  // Handle URL highlight param
  useEffect(() => {
    const highlight = searchParams.get("highlight");
    if (highlight) {
      setHighlightedId(highlight);
      const targetIndex = products.findIndex((p) => String(p.id) === String(highlight));
      if (targetIndex !== -1) {
        setCurrentPage(Math.floor(targetIndex / PAGE_SIZE) + 1);
      }
      setTimeout(() => {
        const el = document.getElementById(`product-${highlight}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);

      const timer = setTimeout(() => setHighlightedId(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, products]);

  // Filtering
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          (p.nameAr && p.nameAr.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }

    if (selectedStockStatus !== "all") {
      result = result.filter((p) => p.status === selectedStockStatus);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        case "sales-desc":
          return (b.salesCount || 0) - (a.salesCount || 0);
        case "rating-desc":
          return (b.rating || 0) - (a.rating || 0);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "stock-asc":
          return a.stock - b.stock;
        case "date-desc":
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

    return result;
  }, [products, searchQuery, selectedCategory, selectedStockStatus, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  const openCreateModal = () => {
    router.push("/admin/produits/new");
  };

  const openEditModal = (p: AdminProduct) => {
    router.push(`/admin/produits/edit/${p.id}`);
  };

  const handleDeleteProduct = (id: string | number) => {
    if (confirm("Voulez-vous vraiment supprimer cet article artisanal ?")) {
      const updated = products.filter((p) => p.id !== id);
      saveProducts(updated);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-5 max-w-[1680px] w-full mx-auto">
      {/* Top Header */}
      <AdminHeader
        title="Catalogue & Pièces d'Artisanat"
        subtitle="Supervision du stock atelier, tarifs en Dirhams et collections d'artisanat marocain."
        actionButton={{
          label: "Ajouter une Création",
          onClick: openCreateModal,
        }}
      />

      {/* Filter Row with 3 CustomSelects strictly in 1 single row (Pure White bg matching Vinillia) */}
      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-[#E9DCD5] shadow-xs relative z-20 space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 w-full">
          {/* Category Filter */}
          <div className="w-full min-w-0">
            <CustomSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              icon={Layers}
              options={[
                { value: "all", label: "Toutes les collections" },
                ...categories.map((c) => ({
                  value: c.slug,
                  label: c.name,
                })),
              ]}
            />
          </div>

          {/* Stock Status Filter */}
          <div className="w-full min-w-0">
            <CustomSelect
              value={selectedStockStatus}
              onChange={setSelectedStockStatus}
              icon={Package}
              options={[
                { value: "all", label: "Tous les états de stock" },
                { value: "in_stock", label: "En stock disponible" },
                { value: "low_stock", label: "Stock faible (Atelier)" },
                { value: "out_of_stock", label: "En rupture temporaire" },
              ]}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="w-full min-w-0">
            <CustomSelect
              value={sortBy}
              onChange={(v) => setSortBy(v as any)}
              icon={ArrowUpDown}
              options={[
                { value: "date-desc", label: "Trier : Nouveautés" },
                { value: "date-asc", label: "Trier : Plus anciens" },
                { value: "sales-desc", label: "Trier : Best-sellers" },
                { value: "rating-desc", label: "Trier : Mieux notés" },
                { value: "price-asc", label: "Trier : Prix croissant" },
                { value: "price-desc", label: "Trier : Prix décroissant" },
                { value: "stock-asc", label: "Trier : Stock faible" },
              ]}
            />
          </div>
        </div>

        {/* Reset button if filter is active */}
        {(selectedCategory !== "all" || selectedStockStatus !== "all" || sortBy !== "date-desc") && (
          <div className="flex items-center justify-end pt-1.5 border-t border-[#E9DCD5]/60">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedStockStatus("all");
                setSortBy("date-desc");
                setCurrentPage(1);
              }}
              className="text-[#6d381e] hover:text-[#542a15] text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-[#6d381e]/5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser les filtres</span>
            </button>
          </div>
        )}
      </div>

      {/* Products Display Container */}
      <div className="space-y-4">
        {/* Count Bar */}
        <div className="bg-white py-2.5 px-4 rounded-2xl border border-[#EDE9E6] shadow-2xs flex items-center justify-between">
          <span className="text-xs text-[#6B7280]">
            Affichage de{" "}
            <span className="font-bold text-[#1F2937]">
              {filteredProducts.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
              –{Math.min(currentPage * PAGE_SIZE, filteredProducts.length)}
            </span>{" "}
            sur <span className="font-bold text-[#6d381e]">{filteredProducts.length}</span> pièces d&apos;artisanat marocain
          </span>
          <span className="text-xs font-bold text-[#ba4e1a] bg-[#ba4e1a]/10 px-2.5 py-0.5 rounded-full">
            Artisanat 100% Fait Main
          </span>
        </div>

        {/* LUXURY GRID VIEW (matching Vinillia) */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E9DCD5] p-12 text-center">
            <Package className="w-12 h-12 text-[#E9DCD5] mx-auto mb-3" />
            <p className="font-serif text-lg font-bold text-[#1F2937]">Aucune création trouvée</p>
            <p className="text-xs text-neutral-400 mt-1">Ajustez vos filtres pour visualiser d&apos;autres créations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedProducts.map((p) => {
              const isHighlighted = String(highlightedId) === String(p.id);
              return (
                <div
                  key={p.id}
                  id={`product-${p.id}`}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between group ${
                    isHighlighted
                      ? "border-2 border-[#6d381e] ring-2 ring-[#6d381e]/20 shadow-md bg-[#6d381e]/5"
                      : "bg-white border-[#EDE9E6] shadow-2xs hover:shadow-md hover:border-[#6d381e]/40"
                  }`}
                >
                  {/* Image Pod - Refined compact height */}
                  <div className="relative h-44 sm:h-48 w-full bg-[#FAF7F2] border-b border-[#EDE9E6] overflow-hidden flex items-center justify-center">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badges Top-Right (Stock + Promo stacked) */}
                    <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1.5">
                      {p.status === "in_stock" && (
                        <span className="bg-[#6d381e] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-2xs whitespace-nowrap">
                          {p.stock} en stock
                        </span>
                      )}
                      {p.status === "low_stock" && (
                        <span className="bg-[#ba4e1a] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-2xs animate-pulse whitespace-nowrap">
                          Reste {p.stock}
                        </span>
                      )}
                      {p.status === "out_of_stock" && (
                        <span className="bg-[#1F2937] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-2xs whitespace-nowrap">
                          Épuisé
                        </span>
                      )}

                      {/* Promo Ribbon right under stock */}
                      {p.oldPrice && p.oldPrice > p.price && (
                        <span className="bg-[#ba4e1a] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-2xs whitespace-nowrap">
                          PROMO -{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content & Footer with Padding */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                    <div className="space-y-1.5">
                      {/* Category & ID */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[10px] font-semibold text-[#6d381e] uppercase tracking-wider bg-[#6d381e]/10 px-2 py-0.5 rounded-md">
                          {p.categoryName}
                        </span>
                        <span className="font-mono text-[10px] text-[#9CA3AF] bg-[#FAF6F4] px-1.5 py-0.5 rounded border border-[#EDE9E6]">
                          #{p.id}
                        </span>
                      </div>

                      {/* Product Name */}
                      <h3 className="font-serif font-bold text-sm text-[#1F2937] line-clamp-2 leading-snug group-hover:text-[#6d381e] transition-colors min-h-[38px]">
                        {p.name}
                      </h3>

                      {/* Sales & Rating */}
                      <div className="flex items-center justify-between text-xs text-[#6B7280]">
                        <div className="flex items-center gap-1.5">
                          <span className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {p.rating}
                          </span>
                          <span className="text-[#9CA3AF] text-[11px]">({p.reviewsCount})</span>
                        </div>
                        <span className="text-[11px] text-[#6B7280] font-medium">
                          {p.salesCount} vendus
                        </span>
                      </div>
                    </div>

                    {/* Price & Actions Bottom Bar */}
                    <div className="mt-1 flex items-center justify-between gap-2 pt-2 border-t border-[#EDE9E6]/60">
                      <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className="font-serif font-bold text-base text-[#ba4e1a] tracking-tight whitespace-nowrap">
                          {p.price} DH
                        </span>
                        {p.oldPrice && p.oldPrice > p.price && (
                          <span className="text-xs text-[#9CA3AF] line-through font-normal whitespace-nowrap">
                            {p.oldPrice} DH
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="w-8 h-8 rounded-full bg-[#FAF6F4] hover:bg-[#6d381e] text-[#6d381e] hover:text-white border border-[#EDE9E6] transition-all flex items-center justify-center cursor-pointer shadow-2xs hover:scale-105"
                          title={`Modifier - ${p.name}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="w-8 h-8 rounded-full bg-[#FAF6F4] hover:bg-rose-50 text-[#9CA3AF] hover:text-rose-600 border border-[#EDE9E6] transition-all flex items-center justify-center cursor-pointer hover:scale-105"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#E9DCD5] bg-white text-[#6d381e] hover:bg-[#6d381e]/5 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Précédent</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setCurrentPage(num)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentPage === num
                    ? "bg-[#6d381e] text-white shadow-2xs"
                    : "bg-white border border-[#E9DCD5] text-[#1F2937] hover:bg-[#FAF7F2]"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#E9DCD5] bg-white text-[#6d381e] hover:bg-[#6d381e]/5 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <span>Suivant</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminProduitsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-400">Chargement du catalogue...</div>}>
      <AdminProductsContent />
    </Suspense>
  );
}
