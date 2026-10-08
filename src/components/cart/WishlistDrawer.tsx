"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import {
  X,
  Trash2,
  Heart,
  ShoppingBag,
  Package,
  Search,
  Clock,
  Check,
  ArrowRight,
} from "lucide-react";

interface OrderRecord {
  id: string;
  date: string;
  customerName: string;
  city: string;
  address: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: string;
}

const DEFAULT_ORDERS: OrderRecord[] = [
  {
    id: "CMD-2026-CCE9EE52-441",
    date: "2026-10-05",
    customerName: "Hajar Filali",
    city: "Meknès",
    address: "Hamria, Rue Beyrouth",
    items: [
      { name: "Tableau Ruche 'سبحان الله وبحمده'", quantity: 1, price: 1350 },
    ],
    total: 1350,
    status: "En attente",
  },
  {
    id: "CMD-2026-AF3AED0E-EBF",
    date: "2026-10-02",
    customerName: "Hajar Filali",
    city: "Meknès",
    address: "Hamria, Rue Beyrouth",
    items: [
      { name: "Arche Mauresque Cintrée 'يا الله'", quantity: 1, price: 1850 },
    ],
    total: 1850,
    status: "En attente",
  },
];

export function WishlistDrawer() {
  const { isWishlistOpen, closeWishlist, wishlist, toggleWishlist, wishlistCount } = useWishlist();
  const { addItem, items: cartItems } = useCart();
  const [activeTab, setActiveTab] = useState<"favoris" | "commandes">("favoris");
  const [addedIds, setAddedIds] = useState<Record<string | number, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<OrderRecord[]>(DEFAULT_ORDERS);

  // Load orders from localStorage if any recent checkout was made
  useEffect(() => {
    try {
      const stored = localStorage.getItem("marjad_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders([...parsed, ...DEFAULT_ORDERS]);
        }
      }
    } catch (e) {}
  }, [isWishlistOpen]);

  if (!isWishlistOpen) return null;

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={closeWishlist}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-[#ffffff] shadow-2xl flex flex-col border-l border-[#ebd8be] animate-in slide-in-from-right duration-300">
          
          {/* Header - Adapts based on active tab */}
          <div className="px-5 py-4 border-b border-[#ebd8be]/60 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#faf6f0] border border-[#ebd8be] flex items-center justify-center text-[#ba4e1a] shadow-2xs">
                  {activeTab === "favoris" ? (
                    <Heart className="w-4 h-4 fill-[#ba4e1a]" />
                  ) : (
                    <Package className="w-4 h-4 text-[#ba4e1a]" />
                  )}
                </div>
                <h2 className="text-lg font-serif font-black text-[#1c1917]">
                  {activeTab === "favoris" ? "Mes Favoris" : "Mes Commandes"}
                </h2>
              </div>

              {/* Signature Close Button with Hover Rotation */}
              <button
                onClick={closeWishlist}
                className="group w-8 h-8 rounded-full border border-[#ebd8be] bg-white hover:bg-[#faf6f0] flex items-center justify-center text-[#1c1917]/70 hover:text-[#1c1917] transition-all duration-300 cursor-pointer shadow-2xs active:scale-95"
                aria-label="Fermer"
              >
                <X className="w-4 h-4 stroke-[2] transition-transform duration-300 group-hover:rotate-90" />
              </button>
            </div>

            {/* Subheader Filter Tabs (Unified Pill Bar like in Vinillia with MARJAD colors) */}
            <div className="mt-3.5 p-1 bg-[#faf6f0] rounded-full border border-[#ebd8be]/70 flex items-center gap-1">
              <button
                onClick={() => setActiveTab("favoris")}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "favoris"
                    ? "bg-[#ba4e1a] text-white shadow-xs"
                    : "text-[#1c1917]/70 hover:text-[#1c1917]"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${activeTab === "favoris" ? "text-white" : "text-stone-400"}`} />
                <span>Mes Favoris</span>
                <span
                  className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ml-0.5 font-bold ${
                    activeTab === "favoris"
                      ? "bg-white/25 text-white"
                      : "bg-[#ebd8be]/60 text-[#1c1917]/70"
                  }`}
                >
                  {wishlistCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("commandes")}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "commandes"
                    ? "bg-[#ba4e1a] text-white shadow-xs"
                    : "text-[#1c1917]/70 hover:text-[#1c1917]"
                }`}
              >
                <Package className={`w-3.5 h-3.5 ${activeTab === "commandes" ? "text-white" : "text-stone-400"}`} />
                <span>Mes Commandes</span>
              </button>
            </div>
          </div>

          {/* TAB 1: MES FAVORIS (Matching Screenshot 2 - NO continuer mes achats link) */}
          {activeTab === "favoris" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-14 h-14 rounded-full bg-[#faf6f0] border border-[#ebd8be] flex items-center justify-center mb-3 text-[#ba4e1a]">
                    <Heart className="w-7 h-7 stroke-[1.5]" />
                  </div>
                  <h3 className="text-base font-serif font-black text-[#1c1917] mb-1">
                    Votre liste de favoris est vide
                  </h3>
                  <p className="text-xs text-[#1c1917]/60 max-w-xs">
                    Enregistrez vos créations artisanales coups de cœur pour les retrouver facilement.
                  </p>
                </div>
              ) : (
                wishlist.map((product) => {
                  const inCart = cartItems.some((item) => String(item.product.id) === String(product.id));
                  return (
                    <div
                      key={product.id}
                      className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl border border-[#ebd8be]/80 shadow-2xs hover:shadow-xs transition-shadow"
                    >
                      {/* Thumbnail */}
                      <Link
                        href={`/produit/${product.slug}`}
                        onClick={closeWishlist}
                        className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-[#ebd8be] shrink-0 flex items-center justify-center shadow-2xs group/thumb"
                      >
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-contain p-1.5 transition-transform duration-300 group-hover/thumb:scale-105"
                        />
                      </Link>

                      {/* Middle Info */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#ba4e1a] block truncate">
                          {product.category || "Artisanat"}
                        </span>
                        <Link
                          href={`/produit/${product.slug}`}
                          onClick={closeWishlist}
                          className="text-xs font-bold text-[#1c1917] truncate block hover:text-[#ba4e1a] transition-colors"
                        >
                          {product.name}
                        </Link>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xs font-black text-[#1c1917]">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-gray-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Controls: Trash & Au Panier */}
                      <div className="flex flex-col items-end justify-between self-stretch shrink-0 py-0.5">
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer p-0.5"
                          title="Retirer des favoris"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          disabled={inCart}
                          onClick={() => {
                            if (!inCart) {
                              addItem(product, 1);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs select-none ${
                            inCart
                              ? "bg-stone-100 text-stone-400 border border-stone-200/80 cursor-not-allowed opacity-80 shadow-none"
                              : "bg-[#ba4e1a] hover:bg-[#9c3a0c] text-white active:scale-95 cursor-pointer"
                          }`}
                          title={inCart ? "Déjà dans le panier" : "Ajouter au panier"}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Au panier</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: MES COMMANDES (Matching exactly Image 1) */}
          {activeTab === "commandes" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par N° de commande ou téléphone..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a]"
                />
              </div>

              {/* Orders List */}
              <div className="space-y-3.5">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 text-xs text-[#1c1917]/60">
                    Aucune commande trouvée.
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl border border-stone-200/90 bg-white shadow-2xs space-y-2 hover:shadow-xs transition-shadow"
                    >
                      {/* Top: Order ID + Status */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-stone-800 bg-stone-100 border border-stone-200/60 px-2.5 py-0.5 rounded-md">
                          {order.id}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span>{order.status}</span>
                        </span>
                      </div>

                      {/* Date */}
                      <span className="text-[11px] text-stone-400 font-medium block">
                        {order.date}
                      </span>

                      {/* Customer info */}
                      <div className="text-xs pt-2 border-t border-stone-100">
                        <p className="font-bold text-stone-900">
                          {order.customerName} • <span className="font-normal text-stone-600">{order.city}</span>
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {order.address}
                        </p>
                      </div>

                      {/* Order items */}
                      <div className="space-y-1 pt-2 border-t border-stone-100 text-xs">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center text-stone-800">
                            <span className="truncate pr-2">{it.quantity}x {it.name}</span>
                            <span className="font-bold text-stone-900 shrink-0">{it.price} DH</span>
                          </div>
                        ))}
                      </div>

                      {/* Total Amount */}
                      <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-xs">
                        <span className="font-medium text-stone-600">Montant Total :</span>
                        <span className="font-serif font-black text-sm text-[#ba4e1a]">
                          {order.total} DH
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
