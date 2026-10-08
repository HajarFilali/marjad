"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Heart,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    if (!promoCode.trim()) return;

    if (promoCode.trim().toUpperCase() === "MARJAD10") {
      setDiscount(0.1);
      setPromoSuccess("Code promo appliqué (-10%) !");
    } else if (promoCode.trim().toUpperCase() === "BIENVENUE") {
      setDiscount(0.15);
      setPromoSuccess("Code promo appliqué (-15%) !");
    } else {
      setPromoError("Code promo invalide.");
    }
  };

  const deliveryFee = subtotal >= 800 || subtotal === 0 ? 0 : 35;
  const discountAmount = subtotal * discount;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  return (
    <div className="bg-[#ffffff] min-h-screen pt-[124px] sm:pt-[132px] pb-10">
      <div className="w-[94%] sm:w-[92%] max-w-7xl mx-auto">
        
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#ebd8be] p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto my-8">
            <div className="w-14 h-14 rounded-full bg-[#faf6f0] border border-[#ebd8be] flex items-center justify-center mx-auto mb-3 text-[#ba4e1a]">
              <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h1 className="font-serif font-black text-2xl text-[#1c1917] mb-2">
              Votre Panier est vide
            </h1>
            <p className="text-xs text-[#1c1917]/70 max-w-sm mx-auto mb-5">
              Explorez nos pièces d&apos;artisanat marocain d&apos;exception pour sublimer votre intérieur.
            </p>
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ba4e1a] to-[#9c3a0c] hover:from-[#9c3a0c] hover:to-[#822f08] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
            >
              <span>Explorer la Boutique</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            
            {/* ================= LEFT COLUMN: MON PANIER (Balanced compact height) ================= */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-[#ebd8be] p-5 sm:p-6 shadow-sm flex flex-col h-[465px] sm:h-[475px] max-h-[475px] overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#ebd8be]/60 shrink-0 mb-3">
                <h1 className="font-serif font-black text-xl sm:text-2xl text-[#1c1917]">
                  Mon Panier
                </h1>
                <span className="text-xs font-medium text-stone-500">
                  {totalItems} {totalItems > 1 ? "articles" : "article"}
                </span>
              </div>

              {/* Scrollable Items List (overflow-y) */}
              <div className="flex-1 min-h-0 overflow-y-auto pr-1.5 space-y-3">
                {items.map((item) => {
                  const isFav = isInWishlist(item.product.id);
                  return (
                    <div
                      key={`${item.product.id}-${item.selectedColor || ""}-${item.selectedSize || ""}`}
                      className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-stone-200/90 bg-white hover:border-[#ba4e1a]/40 transition-colors shadow-2xs"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Thumbnail */}
                        <Link
                          href={`/produit/${item.product.slug}`}
                          className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-[#ebd8be] shrink-0 flex items-center justify-center shadow-2xs group/thumb"
                        >
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            sizes="64px"
                            className="object-contain p-1.5 transition-transform duration-300 group-hover/thumb:scale-105"
                          />
                        </Link>

                        {/* Title & Info */}
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ba4e1a] block truncate">
                            {item.product.category || "Artisanat Marocain"}
                          </span>
                          <Link
                            href={`/produit/${item.product.slug}`}
                            className="font-serif font-bold text-xs sm:text-sm text-[#1c1917] hover:text-[#ba4e1a] transition-colors block truncate"
                          >
                            {item.product.name}
                          </Link>
                          {item.selectedColor && (
                            <span className="text-[11px] text-stone-500 block mt-0.5 truncate">
                              Finition : <strong className="text-stone-700">{item.selectedColor}</strong>
                            </span>
                          )}
                          <span className="text-xs font-bold text-stone-900 mt-0.5 block">
                            {formatPrice(item.product.price)} <span className="text-[10px] font-normal text-stone-400">/ unité</span>
                          </span>
                        </div>
                      </div>

                      {/* Right: Stepper on top, Circular Heart & Trash below (Exactly as Vinillia Screenshot 3) */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {/* Stepper pill */}
                        <div className="flex items-center border border-stone-200 rounded-full bg-white px-2.5 py-1 shadow-2xs">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="text-stone-400 hover:text-stone-800 transition-colors cursor-pointer p-0.5"
                            aria-label="Diminuer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-stone-800 select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="text-stone-400 hover:text-stone-800 transition-colors cursor-pointer p-0.5"
                            aria-label="Augmenter"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Actions: Heart circle + Trash circle side-by-side */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleWishlist(item.product)}
                            className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                              isFav
                                ? "bg-red-50 text-red-500 border-red-200"
                                : "bg-white border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-200"
                            }`}
                            title="Favoris"
                            aria-label="Favoris"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-red-500" : ""}`} />
                          </button>

                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="w-7 h-7 rounded-full border border-red-100 bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                            title="Supprimer"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ================= RIGHT COLUMN: RÉCAPITULATIF (Restored natural height hugging content like Vinillia) ================= */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-[#ebd8be] p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3.5 border-b border-[#ebd8be]/60 mb-4">
                <h2 className="font-serif font-black text-xl text-[#1c1917]">
                  Récapitulatif
                </h2>
                <span className="text-xs font-medium text-stone-500">
                  {totalItems} {totalItems > 1 ? "articles" : "article"}
                </span>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="CODE PROMO"
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a] uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#6b7280] hover:bg-[#ba4e1a] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    Appliquer
                  </button>
                </div>
                {promoSuccess && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>{promoSuccess}</span>
                  </p>
                )}
                {promoError && (
                  <p className="text-[11px] text-red-500 font-bold mt-1">
                    {promoError}
                  </p>
                )}
              </form>

              {/* Summary Calculations */}
              <div className="space-y-2 text-xs pb-3 border-b border-[#ebd8be]/60">
                <div className="flex justify-between text-[#1c1917]/70">
                  <span>Sous-total Panier</span>
                  <span className="font-bold text-[#1c1917]">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Remise ({discount * 100}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#1c1917]/70">
                  <span>Livraison Estimée</span>
                  <span className="font-bold text-[#1c1917]">
                    {deliveryFee === 0 ? "Gratuite (Offerte)" : formatPrice(deliveryFee)}
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex items-baseline justify-between py-3">
                <span className="font-serif font-black text-base text-[#1c1917]">
                  Total
                </span>
                <span className="font-serif font-black text-2xl text-[#ba4e1a]">
                  {formatPrice(finalTotal)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => router.push("/commande")}
                className="w-full py-3.5 rounded-2xl bg-[#ba4e1a] hover:bg-[#9c3a0c] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#ba4e1a]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 mb-2.5"
              >
                <span>Commander Maintenant</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Continuer les achats Link (Under checkout button as in Vinillia) */}
              <div className="text-center mb-4">
                <Link
                  href="/boutique"
                  className="text-xs font-bold text-[#1c1917]/65 hover:text-[#ba4e1a] transition-colors inline-block"
                >
                  ← Continuer les achats
                </Link>
              </div>

              {/* Reassurance Badge */}
              <div className="pt-3 border-t border-[#ebd8be]/50 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] text-[#1c1917]/70 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ba4e1a]" />
                <span>Produits 100% Authentiques & Paiement Sécurisé</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
