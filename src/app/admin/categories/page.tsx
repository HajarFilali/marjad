"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CustomSelect } from "@/components/admin/CustomSelect";
import {
  INITIAL_ADMIN_CATEGORIES,
  INITIAL_ADMIN_PRODUCTS,
  AdminCategory,
  AdminProduct,
  addAdminNotification,
} from "@/lib/adminData";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  X,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

function AdminCategoriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<AdminCategory[]>(INITIAL_ADMIN_CATEGORIES);
  const [products, setProducts] = useState<AdminProduct[]>(INITIAL_ADMIN_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "items-desc" | "items-asc">("items-desc");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedProds = localStorage.getItem("marjad_admin_products");
      if (storedProds) {
        const parsedP = JSON.parse(storedProds);
        if (Array.isArray(parsedP) && parsedP.length > 0) {
          setProducts(parsedP);
        }
      }

      const stored = localStorage.getItem("marjad_admin_categories");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Si les données en cache contiennent encore d'anciennes catégories de démonstration (ex: tapis-berberes)
          const hasOldDemo = parsed.some((it) => it.slug === "tapis-berberes" || it.slug === "poterie-ceramique");
          if (!hasOldDemo) {
            setCategories(parsed);
          } else {
            setCategories(INITIAL_ADMIN_CATEGORIES);
            localStorage.setItem("marjad_admin_categories", JSON.stringify(INITIAL_ADMIN_CATEGORIES));
          }
        }
      }
    } catch {}
  }, []);

  const saveCategories = (updated: AdminCategory[]) => {
    setCategories(updated);
    try {
      localStorage.setItem("marjad_admin_categories", JSON.stringify(updated));
    } catch {}
  };

  // URL highlight
  useEffect(() => {
    const highlight = searchParams.get("highlight");
    if (highlight) {
      setHighlightedId(highlight);
      setTimeout(() => {
        const el = document.getElementById(`category-${highlight}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);

      const timer = setTimeout(() => setHighlightedId(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Filtering & Sorting
  const filteredCategories = useMemo(() => {
    let result = [...categories];

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.nameAr && c.nameAr.includes(q)) ||
          c.description.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "items-asc":
          return (a.itemCount || 0) - (b.itemCount || 0);
        case "items-desc":
        default:
          return (b.itemCount || 0) - (a.itemCount || 0);
      }
    });

    return result;
  }, [categories, searchQuery, sortBy]);

  const openCreateModal = () => {
    router.push("/admin/categories/new");
  };

  const openEditModal = (cat: AdminCategory) => {
    router.push(`/admin/categories/edit/${cat.id}`);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette catégorie d'artisanat ?")) {
      const updated = categories.filter((c) => c.id !== id);
      saveCategories(updated);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-5 max-w-[1680px] w-full mx-auto">
      {/* Top Header */}
      <AdminHeader
        title="Catégories & Collections d'Artisanat"
        subtitle="Organisation des familles de métiers d'art, description des traditions et inventaire."
        actionButton={{
          label: "Ajouter une Catégorie",
          onClick: openCreateModal,
        }}
      />

      {/* Filter Bar: Pure white bg matching Vinillia, only Sort dropdown with appropriate width (w-[220px]) + Total count on right */}
      <div className="bg-white py-2 px-3 sm:px-4 rounded-2xl border border-[#EDE9E6] shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6B7280] font-semibold shrink-0">Trier :</span>
          <div className="w-[220px]">
            <CustomSelect
              value={sortBy}
              onChange={(v) => setSortBy(v as any)}
              icon={ArrowUpDown}
              options={[
                { value: "items-desc", label: "Plus de pièces d'abord" },
                { value: "items-asc", label: "Moins de pièces d'abord" },
                { value: "name-asc", label: "Nom alphabétique (A à Z)" },
                { value: "name-desc", label: "Nom alphabétique (Z à A)" },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6B7280]">
            Total : <span className="font-bold text-[#1F2937]">{filteredCategories.length}</span> collections
          </span>
          {sortBy !== "items-desc" && (
            <button
              onClick={() => setSortBy("items-desc")}
              className="text-xs text-[#6d381e] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Categories Display Container */}
      <div className="space-y-4">

        {/* LUXURY GRID VIEW (matching Products page structure) */}
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E9DCD5] p-12 text-center">
            <Layers className="w-12 h-12 text-[#E9DCD5] mx-auto mb-3" />
            <p className="font-serif text-lg font-bold text-[#1F2937]">Aucune catégorie trouvée</p>
            <p className="text-xs text-neutral-400 mt-1">Modifiez votre recherche pour trouver une collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {filteredCategories.map((c) => {
              const isHighlighted = String(highlightedId) === String(c.id);
              const dynamicCount = products.filter(
                (p) => p.categorySlug === c.slug || p.categoryName?.toLowerCase() === c.name.toLowerCase()
              ).length;
              const totalCount = dynamicCount > 0 ? dynamicCount : (c.itemCount || 0);

              return (
                <div
                  key={c.id}
                  id={`category-${c.id}`}
                  className={`rounded-3xl border p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between gap-4 group ${
                    isHighlighted
                      ? "border-2 border-[#6d381e] ring-2 ring-[#6d381e]/20 shadow-md bg-[#6d381e]/5"
                      : "bg-white border-[#EDE9E6] shadow-2xs hover:shadow-md hover:border-[#6d381e]/40"
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Top tags row */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10.5px] text-[#9CA3AF] bg-[#FAF6F4] px-2.5 py-1 rounded-md border border-[#EDE9E6]">
                        #{c.slug}
                      </span>
                      <span className="bg-[#ba4e1a] text-white text-[10.5px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                        {totalCount} {totalCount === 1 ? "pièce" : "pièces"}
                      </span>
                    </div>

                    {/* Titles: French & Arabic Calligraphy */}
                    <div>
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1F2937] leading-snug group-hover:text-[#6d381e] transition-colors">
                        {c.name}
                      </h3>
                      {c.nameAr && (
                        <p className="font-arabic text-sm sm:text-base text-[#ba4e1a] mt-1 font-medium" dir="rtl">
                          {c.nameAr}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3">
                      {c.description || "Aucune description renseignée."}
                    </p>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#EDE9E6]/70 mt-1">
                    <span className="text-xs font-bold text-[#ba4e1a] flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Catalogue actif</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(c)}
                        className="w-8 h-8 rounded-full bg-[#FAF6F4] hover:bg-[#6d381e] text-[#6d381e] hover:text-white border border-[#EDE9E6] transition-all flex items-center justify-center cursor-pointer shadow-2xs hover:scale-105"
                        title={`Modifier - ${c.name}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(c.id)}
                        className="w-8 h-8 rounded-full bg-[#FAF6F4] hover:bg-rose-50 text-[#9CA3AF] hover:text-rose-600 border border-[#EDE9E6] transition-all flex items-center justify-center cursor-pointer hover:scale-105"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-400">Chargement des catégories...</div>}>
      <AdminCategoriesContent />
    </Suspense>
  );
}
