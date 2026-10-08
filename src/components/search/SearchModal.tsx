"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";
import { DECOR_PRODUCTS } from "@/data/mockProducts";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Les 5 catégories officielles de la boutique MARJAD
const BOUTIQUE_CATEGORIES = [
  { label: "Calligraphie Murale", query: "Calligraphie Murale" },
  { label: "Étagères & Mobilier", query: "Étagères & Mobilier Mural" },
  { label: "Arches & Panneaux", query: "Arches & Panneaux" },
  { label: "Miroirs d'Art", query: "Miroirs d'Art" },
  { label: "Médaillons & Reliefs", query: "Médaillons & Reliefs" },
];

// Fonction de normalisation insensible aux accents français et diacritiques arabes
function normalizeSearchText(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents (é, è, ê -> e)
    .replace(/[\u064B-\u065F]/g, "") // Supprime les voyelles arabes (تنوين، شدة، فتحة...)
    .trim();
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [addedId, setAddedId] = useState<string | number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { addItem } = useCart();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = normalizeSearchText(query);
  const isSearching = normalizedQuery.length > 0;

  // Filtrage STRICT sur les produits présents dans la boutique (DECOR_PRODUCTS uniquement)
  const results = isSearching
    ? DECOR_PRODUCTS.filter((product) => {
        const q = normalizedQuery;
        const name = normalizeSearchText(product.name);
        const nameAr = product.nameAr ? normalizeSearchText(product.nameAr) : "";
        const cat = normalizeSearchText(product.category);
        const catSlug = product.categorySlug ? normalizeSearchText(product.categorySlug) : "";
        const desc = normalizeSearchText(product.description || "");
        const shortDesc = product.shortDescription ? normalizeSearchText(product.shortDescription) : "";
        const tags = (product.tags || []).map((t) => normalizeSearchText(t));
        const artisanName = product.artisan?.name ? normalizeSearchText(product.artisan.name) : "";
        const artisanCity = product.artisan?.city ? normalizeSearchText(product.artisan.city) : "";
        const artisanCraft = product.artisan?.craft ? normalizeSearchText(product.artisan.craft) : "";

        return (
          name.includes(q) ||
          nameAr.includes(q) ||
          cat.includes(q) ||
          catSlug.includes(q) ||
          desc.includes(q) ||
          shortDesc.includes(q) ||
          tags.some((t) => t.includes(q)) ||
          artisanName.includes(q) ||
          artisanCity.includes(q) ||
          artisanCraft.includes(q)
        );
      })
    : [];

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleSelectProduct = (product: Product) => {
    onClose();
    router.push(`/produit/${product.slug}`);
  };

  const handleCategoryClick = (categoryQuery: string) => {
    if (query === categoryQuery) {
      setQuery("");
    } else {
      setQuery(categoryQuery);
    }
    inputRef.current?.focus();
  };

  return (
    // Overlay centré : cliquer n'importe où sur le fond ferme la modale
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/55 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Conteneur compact et raffiné aux finitions artisanales marocaines */}
      <div
        className={`w-[94vw] sm:w-[560px] md:w-[600px] max-w-[600px] ${
          isSearching ? "max-h-[82vh]" : "h-auto"
        } bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-[#ebd8be]/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden transition-all duration-300 animate-in zoom-in-95`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête : compact, élégant et épuré */}
        <div className="p-4 sm:p-5 pb-3 border-b border-[#ebd8be]/40 flex items-start justify-between gap-3 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-serif font-black text-[#1c1917] tracking-tight flex items-center gap-2">
              <span>Recherche Boutique</span>
              <span className="text-[10px] font-sans font-extrabold uppercase tracking-wider text-[#c4622d] bg-[#c4622d]/10 px-2 py-0.5 rounded-full">
                {DECOR_PRODUCTS.length} pièces
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-[#1c1917]/60 font-medium mt-0.5 leading-snug">
              Explorez nos créations en boutique : Calligraphies, Miroirs, Étagères, Arches &amp; Médaillons.
            </p>
          </div>

          {/* Bouton Fermer professionnel avec rotation fluide */}
          <button
            onClick={onClose}
            className="group w-8 h-8 rounded-full border border-[#ebd8be] hover:border-[#c4622d] bg-white hover:bg-[#c4622d]/10 flex items-center justify-center text-[#1c1917]/60 hover:text-[#c4622d] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shrink-0 shadow-2xs"
            aria-label="Fermer la recherche"
            title="Fermer (Échap)"
          >
            <X className="w-4 h-4 stroke-[2] transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {/* Champ de recherche compact + Suggestions des 5 catégories boutique */}
        <div className={`p-4 sm:p-5 ${isSearching ? "pb-3" : "pb-5"} shrink-0`}>
          <div className="relative flex items-center rounded-full border border-[#ba4e1a]/30 px-3.5 py-2 sm:py-2.5 bg-white shadow-2xs focus-within:border-[#ba4e1a] focus-within:ring-2 focus-within:ring-[#ba4e1a]/20 transition-all">
            <Search className="w-4 h-4 text-[#ba4e1a] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher en boutique (ex: Tableau Ruche, Miroir, Console, Arche)..."
              className="w-full ml-2.5 bg-transparent text-xs sm:text-sm text-[#1c1917] placeholder:text-stone-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="p-1 text-stone-400 hover:text-[#1c1917] hover:bg-stone-100 rounded-full transition-all cursor-pointer"
                aria-label="Effacer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Suggestions des catégories de la boutique */}
          <div className="mt-2.5 pt-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-[#1c1917]/50 uppercase tracking-wider shrink-0">
                Catégories :
              </span>
              {BOUTIQUE_CATEGORIES.map((cat) => {
                const isActive = normalizeSearchText(query) === normalizeSearchText(cat.query);
                return (
                  <button
                    key={cat.label}
                    onClick={() => handleCategoryClick(cat.query)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 ${
                      isActive
                        ? "bg-[#ba4e1a] text-white border-[#ba4e1a] shadow-xs"
                        : "bg-[#f5ede2]/80 hover:bg-[#ba4e1a] text-[#1c1917]/80 hover:text-white border-[#ebd8be]/70"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION RESULTATS : S'affiche UNIQUEMENT lorsque l'utilisateur commence à chercher */}
        {isSearching && (
          <div className="flex-1 px-4 sm:px-5 pb-5 overflow-y-auto space-y-2 max-h-[380px] min-h-0 border-t border-[#ebd8be]/30 pt-3">
            <div className="flex items-center justify-between text-[11px] text-[#1c1917]/60 font-semibold px-1 pb-1 border-b border-[#ebd8be]/30">
              <span>
                Résultats trouvés ({results.length})
              </span>
              <button
                onClick={() => setQuery("")}
                className="text-[#ba4e1a] hover:underline font-bold cursor-pointer"
              >
                Tout effacer
              </button>
            </div>

            {results.length > 0 ? (
              <div className="space-y-2 pt-0.5">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="group flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#faf7f2]/80 hover:bg-white border border-[#ebd8be]/50 hover:border-[#ba4e1a]/40 hover:shadow-xs transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Conteneur d'image avec object-contain : image 100% visible et non coupée */}
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#faf6f0] border border-[#ebd8be]/70 p-1 flex items-center justify-center shrink-0">
                        <Image
                          src={product.images[0] || "/logo.png"}
                          alt={product.name}
                          fill
                          className="object-contain p-0.5 transition-transform duration-300 group-hover:scale-105"
                          sizes="64px"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#ba4e1a] bg-[#ba4e1a]/10 px-1.5 py-0.5 rounded-full inline-block">
                            {product.category}
                          </span>
                          {product.nameAr && (
                            <span className="text-[10px] font-serif text-[#1c1917]/50 truncate hidden sm:inline" dir="rtl">
                              {product.nameAr}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-[#1c1917] truncate group-hover:text-[#ba4e1a] transition-colors mt-0.5">
                          {product.name}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-[#1c1917]/60 truncate">
                          {product.shortDescription || product.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-black text-[#1c1917] whitespace-nowrap block">
                          {product.price.toLocaleString("fr-FR")} MAD
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[10px] text-stone-400 line-through block">
                            {product.originalPrice.toLocaleString("fr-FR")} MAD
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95 ${
                          addedId === product.id
                            ? "bg-[#1c543f] text-white"
                            : "bg-[#1c1917] hover:bg-[#ba4e1a] text-white"
                        }`}
                        title="Ajouter au panier"
                      >
                        {addedId === product.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Ajouté</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 text-white" />
                            <span>Ajouter</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center space-y-1.5 bg-[#faf7f2]/50 rounded-xl border border-dashed border-[#ebd8be]">
                <div className="w-9 h-9 rounded-full bg-[#ba4e1a]/10 text-[#ba4e1a] flex items-center justify-center mx-auto">
                  <Search className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-[#1c1917]">
                  Aucune création trouvée pour &laquo;&nbsp;{query}&nbsp;&raquo;
                </p>
                <p className="text-[10px] text-[#1c1917]/60 max-w-xs mx-auto">
                  Essayez un autre mot-clé ou cliquez sur l&apos;une des catégories de la boutique ci-dessus.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
