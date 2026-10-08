"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export function CartDrawer() {
  const { isCartOpen, closeCart, items, updateQuantity, removeItem, totalItems } = useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-[#ffffff] shadow-2xl flex flex-col border-l border-[#ebd8be] animate-in slide-in-from-right duration-300">
          
          {/* Header - Reduced padding & animated close button */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#ebd8be]/60 bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#faf6f0] border border-[#ebd8be] flex items-center justify-center text-[#ba4e1a] shadow-2xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-serif font-black text-[#1c1917]">
                Mon Panier
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#faf6f0] text-[#1c1917]/70 border border-[#ebd8be]/60">
                {totalItems} {totalItems > 1 ? "articles" : "article"}
              </span>
            </div>

            {/* Signature Close Button with Hover Rotation */}
            <button
              onClick={closeCart}
              className="group w-8 h-8 rounded-full border border-[#ebd8be] bg-white hover:bg-[#faf6f0] flex items-center justify-center text-[#1c1917]/70 hover:text-[#1c1917] transition-all duration-300 cursor-pointer shadow-2xs active:scale-95"
              aria-label="Fermer le panier"
            >
              <X className="w-4 h-4 stroke-[2] transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#faf6f0] border border-[#ebd8be] flex items-center justify-center mb-3 text-[#ba4e1a]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-serif font-black text-[#1c1917] mb-1">
                  Votre panier est vide
                </h3>
                <p className="text-xs text-[#1c1917]/60 max-w-xs mb-5">
                  Explorez nos pièces d&apos;artisanat marocain faites main par nos maîtres artisans.
                </p>
                <Link
                  href="/boutique"
                  onClick={closeCart}
                  className="px-5 py-2.5 bg-[#ba4e1a] hover:bg-[#9c3a0c] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
                >
                  <span>Découvrir les collections</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor || ""}-${item.selectedSize || ""}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#ebd8be]/70 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/produit/${item.product.slug}`}
                    onClick={closeCart}
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

                  {/* Middle Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#ba4e1a] block truncate">
                      {item.product.category || "Artisanat"}
                    </span>
                    <Link
                      href={`/produit/${item.product.slug}`}
                      onClick={closeCart}
                      className="text-xs font-bold text-[#1c1917] truncate block hover:text-[#ba4e1a] transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <span className="text-xs font-black text-[#1c1917] mt-0.5 block">
                      {formatPrice(item.product.price)}
                    </span>
                  </div>

                  {/* Right: Quantity Stepper & Soft Red Delete Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center border border-[#ebd8be] rounded-lg bg-[#faf6f0] p-0.5 shadow-2xs">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-5 h-5 rounded bg-white hover:bg-[#ebd8be]/50 text-[#1c1917] flex items-center justify-center text-xs transition-colors cursor-pointer"
                        aria-label="Diminuer"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#1c1917] select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-5 h-5 rounded bg-white hover:bg-[#ebd8be]/50 text-[#1c1917] flex items-center justify-center text-xs transition-colors cursor-pointer"
                        aria-label="Augmenter"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                      title="Supprimer du panier"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer: NO TOTAL as requested! Exactly 2 Buttons: "Voir mon panier" & "Commander Maintenant" */}
          {items.length > 0 && (
            <div className="border-t border-[#ebd8be]/60 bg-white p-4">
              <div className="grid grid-cols-2 gap-2.5">
                {/* Button 1: Voir mon panier */}
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    router.push("/panier");
                  }}
                  className="w-full py-3 px-3 rounded-xl border border-[#ebd8be] bg-white hover:bg-[#faf6f0] text-[#1c1917] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#ba4e1a]" />
                  <span>Voir mon panier</span>
                </button>

                {/* Button 2: Commander Maintenant */}
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    router.push("/commande");
                  }}
                  className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-[#ba4e1a] to-[#9c3a0c] hover:from-[#9c3a0c] hover:to-[#822f08] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#ba4e1a]/25 hover:shadow-lg active:scale-95 cursor-pointer"
                >
                  <span>Commander</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
