"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { TiltedCard } from "@/components/ui/TiltedCard";

interface ProductCardProps {
  product: Product;
  variant?: "grid" | "list";
}

export function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  const { addItem, items } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isJustAdded, setIsJustAdded] = useState(false);
  const isFav = isInWishlist(product.id);
  const hasPromo = product.originalPrice && product.originalPrice > product.price;

  // Vérifier si le produit est déjà dans le panier
  const inCart = items.some((item) => String(item.product.id) === String(product.id));

  // Wide pieces vs Tall/vertical pieces
  const isTallPiece =
    product.category.toLowerCase().includes("miroir") ||
    product.category.toLowerCase().includes("arche") ||
    product.category.toLowerCase().includes("médaillon") ||
    product.id === "decor-3" ||
    product.id === "decor-4" ||
    product.id === "decor-5" ||
    product.id === "decor-8" ||
    product.id === "decor-9" ||
    product.id === "decor-10" ||
    product.slug.includes("miroir") ||
    product.slug.includes("arche") ||
    product.slug.includes("medaillon") ||
    product.slug.includes("disque");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) return;
    addItem(product, 1);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 1200);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  // =========================================================================
  // 1. VARIANT LIST (Affichage horizontal 1 produit par ligne à 100% de largeur)
  // =========================================================================
  if (variant === "list") {
    return (
      <TiltedCard maxRotate={3.5} scaleOnHover={1.01} perspective={1400} showGlare={true} className="w-full">
        <Link
          href={`/produit/${product.slug}`}
          prefetch={true}
          className="group relative flex flex-col sm:flex-row w-full sm:min-h-[235px] rounded-3xl bg-white border border-[#ebd8be]/70 shadow-xs hover:shadow-xl hover:shadow-[#ba4e1a]/12 hover:border-[#ba4e1a]/40 transition-all duration-300 overflow-hidden cursor-pointer select-none"
        >
        {/* LA PARTIE LEFT : Dimensions EXACTES de l'encadré image de la grille 3 colonnes (Largeur ~285-290px, Hauteur 235px) */}
        <div className="relative w-full sm:w-[285px] lg:w-[290px] h-[220px] sm:h-auto sm:min-h-[235px] shrink-0 flex items-center justify-center p-5 bg-gradient-to-b from-[#faf6f0] via-[#f7efe6]/70 to-[#f5ece1]/40 overflow-hidden">
          {/* Fond salon au hover */}
          <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 ease-out pointer-events-none overflow-hidden">
            <Image
              src="/images/salon-card-hover.webp"
              alt="Salon marocain d'ambiance"
              fill
              sizes="(max-width: 640px) 100vw, 300px"
              className="object-cover object-[center_35%] transition-transform duration-700 ease-out group-hover:scale-103"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/15 transition-colors" />
          </div>

          {/* Badge Promo */}
          {hasPromo && product.discountPercent && (
            <span className="absolute top-3.5 left-3.5 z-10 px-2.5 py-1 rounded-full text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-wider bg-[#ba4e1a] text-white shadow-xs">
              -{product.discountPercent}%
            </span>
          )}

          {/* Visuel du produit avec taille et comportement strictement identiques aux cartes 3 colonnes */}
          <div
            className={`relative w-full h-full flex items-center justify-center z-10 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isTallPiece
                ? "group-hover:scale-[0.30] group-hover:-translate-y-[26px]"
                : "group-hover:scale-55 group-hover:-translate-y-8"
            }`}
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              width={240}
              height={240}
              priority={false}
              className="object-contain max-h-[165px] sm:max-h-[175px] w-auto drop-shadow-xs group-hover:drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)] transition-all duration-600"
            />
          </div>
        </div>

        {/* LA PARTIE RIGHT : Catégorie, Nom, Description détaillée, Matières, Prix, et Boutons Panier + Favoris */}
        <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col justify-between bg-white border-t sm:border-t-0 sm:border-l border-[#ebd8be]/40">
          <div>
            {/* Catégorie */}
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#ba4e1a] block mb-1">
              {product.category}
            </span>

            {/* Nom du produit */}
            <h3 className="font-serif font-bold text-base sm:text-lg lg:text-xl text-[#1c1917] group-hover:text-[#ba4e1a] transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>

            {/* Description : Strictement 2 lignes avec 3 points (...) */}
            <p className="text-xs sm:text-sm text-[#78716c] line-clamp-2 mt-1.5 leading-relaxed">
              {product.description}
            </p>

            {/* Détails matières : Taille de police agrandie et bien lisible */}
            {product.details?.material && (
              <div className="mt-2 text-xs sm:text-[13px] text-[#57534e] font-medium flex items-center gap-2">
                <span className="text-[#ba4e1a] font-bold shrink-0">Matière :</span>
                <span className="truncate">{product.details.material}</span>
              </div>
            )}
          </div>

          {/* Ligne inférieure (Sans bordure sous la matière) : Prix à gauche, Bouton Panier + Bouton Favoris à droite */}
          <div className="flex items-center justify-between gap-3 mt-3 pt-1">
            {/* Prix */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-[#1c1917]">
                {formatPrice(product.price)}
              </span>
              {hasPromo && (
                <span className="text-xs sm:text-sm font-semibold text-[#8c827a] line-through">
                  {formatPrice(product.originalPrice!)}
                </span>
              )}
            </div>

            {/* Bouton Panier & Bouton Favoris côte à côte */}
            <div className="flex items-center gap-2">
              {/* Bouton Panier (Bloqué / Gris si déjà dans le panier) */}
              <button
                onClick={handleAddToCart}
                disabled={inCart}
                className={`inline-flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shadow-xs ${
                  inCart
                    ? "bg-[#e5e5e5] text-[#737373] border border-[#d4d4d4] cursor-not-allowed opacity-85"
                    : isJustAdded
                    ? "bg-emerald-600 text-white scale-102 cursor-pointer"
                    : "bg-[#1c1917] hover:bg-[#ba4e1a] text-white active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
                }`}
                title={inCart ? "Déjà dans le panier" : "Ajouter au panier"}
                aria-label={inCart ? "Déjà dans le panier" : "Ajouter au panier"}
              >
                {inCart ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#525252] stroke-[2.5]" />
                    <span>Au panier</span>
                  </>
                ) : isJustAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                    <span>Ajouté</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Ajouter au panier</span>
                  </>
                )}
              </button>

              {/* Bouton Favoris juste à côté du bouton panier */}
              <button
                onClick={handleToggleFavorite}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#ebd8be] flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer ${
                  isFav
                    ? "bg-red-50 border-red-200 text-red-500 scale-105"
                    : "bg-white hover:bg-[#faf8f5] text-[#1c1917]/70 hover:text-red-500 hover:border-red-200"
                }`}
                title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                aria-label="Favoris"
              >
                <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </TiltedCard>
  );
}

  // =========================================================================
  // 2. VARIANT GRID (Affichage standard en grille 3 colonnes avec TiltedCard)
  // =========================================================================
  return (
    <TiltedCard maxRotate={9} scaleOnHover={1.02} showGlare={true} className="h-full">
      <Link
        href={`/produit/${product.slug}`}
        prefetch={true}
        className="group relative flex flex-col h-full rounded-3xl bg-white border border-[#ebd8be]/70 shadow-xs hover:shadow-xl hover:shadow-[#ba4e1a]/12 hover:border-[#ba4e1a]/40 transition-all duration-400 overflow-hidden cursor-pointer select-none"
      >
        {/* 1. TOP HALF: Product visual with interactive Salon Room hover simulation */}
        <div className="relative w-full h-[220px] sm:h-[235px] flex items-center justify-center p-5 bg-gradient-to-b from-[#faf6f0] via-[#f7efe6]/70 to-[#f5ece1]/40 overflow-hidden">
          {/* Photorealistic Salon Room Background (Fades in smoothly on hover) */}
          <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 ease-out pointer-events-none overflow-hidden">
            <Image
              src="/images/salon-card-hover.webp"
              alt="Salon marocain d'ambiance"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-[center_35%] transition-transform duration-700 ease-out group-hover:scale-103"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/15 transition-colors" />
          </div>

          {/* Promo Badge if discount exists */}
          {hasPromo && product.discountPercent && (
            <span className="absolute top-3.5 left-3.5 z-10 px-2.5 py-1 rounded-full text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-wider bg-[#ba4e1a] text-white shadow-xs">
              -{product.discountPercent}%
            </span>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer ${
              isFav
                ? "bg-white text-red-500 scale-105 shadow-sm"
                : "bg-white/85 hover:bg-white text-[#1c1917]/60 hover:text-red-500 hover:scale-110"
            }`}
            title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
            aria-label="Favoris"
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
          </button>

          {/* Product Cutout Visual */}
          <div
            className={`relative w-full h-full flex items-center justify-center z-10 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isTallPiece
                ? "group-hover:scale-[0.30] group-hover:-translate-y-[26px]"
                : "group-hover:scale-55 group-hover:-translate-y-8"
            }`}
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              width={240}
              height={240}
              priority={false}
              className="object-contain max-h-[165px] sm:max-h-[175px] w-auto drop-shadow-xs group-hover:drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)] transition-all duration-600"
            />
          </div>
        </div>

        {/* 2. BOTTOM HALF: Category first, then Name, compact price & cart button */}
        <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between bg-white border-t border-[#ebd8be]/40">
          <div>
            <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-widest text-[#ba4e1a] block mb-1">
              {product.category}
            </span>
            <h3 className="font-serif font-bold text-sm sm:text-[15px] lg:text-base text-[#1c1917] line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center justify-between mt-2.5 pt-0">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-[15px] sm:text-base font-extrabold text-[#1c1917]">
                {formatPrice(product.price)}
              </span>
              {hasPromo && (
                <span className="text-xs sm:text-[12.5px] font-semibold text-[#8c827a] line-through">
                  {formatPrice(product.originalPrice!)}
                </span>
              )}
            </div>

            {/* Bouton Panier (Bloqué / Gris si déjà dans le panier) */}
            <button
              onClick={handleAddToCart}
              disabled={inCart}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs ${
                inCart
                  ? "bg-[#e5e5e5] text-[#737373] border border-[#d4d4d4] cursor-not-allowed opacity-85"
                  : isJustAdded
                  ? "bg-emerald-600 text-white scale-105 cursor-pointer"
                  : "bg-[#1c1917] hover:bg-[#ba4e1a] active:scale-95 text-white hover:shadow-md cursor-pointer"
              }`}
              title={inCart ? "Déjà dans le panier" : "Ajouter au panier"}
              aria-label={inCart ? "Déjà dans le panier" : "Ajouter au panier"}
            >
              {inCart ? (
                <Check className="w-3.5 h-3.5 text-[#525252] stroke-[2.5]" />
              ) : isJustAdded ? (
                <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
              )}
            </button>
          </div>
        </div>
      </Link>
    </TiltedCard>
  );
}
