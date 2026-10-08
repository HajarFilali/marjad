"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CustomSelect } from "@/components/admin/CustomSelect";
import {
  INITIAL_ADMIN_ORDERS,
  AdminOrder,
  addAdminNotification,
} from "@/lib/adminData";
import { MOROCCAN_CITIES } from "@/data/mockProducts";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Eye,
  MapPin,
  MessageCircle,
  Package,
  Globe,
  Share2,
  X,
  Phone,
  RotateCcw,
  Filter,
} from "lucide-react";

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ADMIN_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("marjad_admin_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders(parsed);
        }
      }
    } catch {}
  }, []);

  const saveOrders = (updated: AdminOrder[]) => {
    setOrders(updated);
    try {
      localStorage.setItem("marjad_admin_orders", JSON.stringify(updated));
    } catch {}
  };

  // URL highlight
  useEffect(() => {
    const highlight = searchParams.get("highlight");
    if (highlight) {
      setHighlightedId(highlight);
      setTimeout(() => {
        const el = document.getElementById(`order-${highlight}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);

      const timer = setTimeout(() => setHighlightedId(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleUpdateStatus = (orderId: string, newStatus: AdminOrder["status"]) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    saveOrders(updated);

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }

    const statusLabel =
      newStatus === "delivered"
        ? "Livrée"
        : newStatus === "shipped"
        ? "Expédiée"
        : newStatus === "confirmed"
        ? "Confirmée"
        : newStatus === "cancelled"
        ? "Annulée"
        : "En attente";

    addAdminNotification({
      title: `Commande ${statusLabel}`,
      desc: `La commande ${orderId} est désormais ${statusLabel.toLowerCase()}.`,
      type: "order",
    });
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !searchQuery ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerPhone.includes(searchQuery) ||
        o.customerCity.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      const matchCity = selectedCity === "all" || o.customerCity === selectedCity;

      return matchSearch && matchStatus && matchCity;
    });
  }, [orders, searchQuery, statusFilter, selectedCity]);

  // Order Counts
  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  const getSourceBadge = (source?: string) => {
    const src = source || "Site Web";
    if (src.includes("Instagram")) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-pink-200">
          <Share2 className="w-3 h-3 text-pink-500" /> Instagram Ads
        </span>
      );
    }
    if (src.includes("TikTok")) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-neutral-900/10 text-neutral-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-neutral-300">
          <Share2 className="w-3 h-3 text-neutral-800" /> TikTok Ads
        </span>
      );
    }
    if (src.includes("Facebook")) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
          <Globe className="w-3 h-3 text-blue-600" /> Facebook Ads
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 bg-[#6d381e]/10 text-[#6d381e] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#6d381e]/20">
        <Globe className="w-3 h-3 text-[#6d381e]" /> Site Web Direct
      </span>
    );
  };

  const getStatusBadge = (status: AdminOrder["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> En attente
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#6d381e]/10 text-[#6d381e] text-xs font-bold px-3 py-1 rounded-full border border-[#6d381e]/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmée
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#ba4e1a]/10 text-[#ba4e1a] text-xs font-bold px-3 py-1 rounded-full border border-[#ba4e1a]/20">
            <Truck className="w-3.5 h-3.5" /> Expédiée
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Livrée (Payé)
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-600 text-xs font-bold px-3 py-1 rounded-full border border-neutral-200">
            <AlertCircle className="w-3.5 h-3.5" /> Annulée
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-5 max-w-[1680px] w-full mx-auto">
      {/* Top Header */}
      <AdminHeader
        title="Gestion & Suivi des Commandes"
        subtitle={`Suivi logistique et expédition au Maroc avec paiement à la livraison COD (${orders.length} commandes).`}
      />

      {/* Count + Filter Bar: Pure white bg matching Vinillia, Select for Statut and Select for Ville */}
      <div className="bg-white py-2 px-3 sm:px-4 rounded-2xl border border-[#EDE9E6] shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* Select Statut */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B7280] font-semibold shrink-0">Statut :</span>
            <div className="w-[180px]">
              <CustomSelect
                value={statusFilter}
                onChange={setStatusFilter}
                icon={Filter}
                options={[
                  { value: "all", label: `Tous les statuts (${counts.all})` },
                  { value: "pending", label: `En attente (${counts.pending})` },
                  { value: "confirmed", label: `Confirmée (${counts.confirmed})` },
                  { value: "shipped", label: `Expédiée (${counts.shipped})` },
                  { value: "delivered", label: `Livrée (${counts.delivered})` },
                  { value: "cancelled", label: `Annulée (${counts.cancelled})` },
                ]}
              />
            </div>
          </div>

          {/* Select Ville */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B7280] font-semibold shrink-0">Ville :</span>
            <div className="w-[180px]">
              <CustomSelect
                value={selectedCity}
                onChange={setSelectedCity}
                icon={MapPin}
                options={[
                  { value: "all", label: "Toutes les villes" },
                  ...MOROCCAN_CITIES.map((city) => ({
                    value: city,
                    label: city,
                  })),
                ]}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6B7280]">
            Total : <span className="font-bold text-[#1F2937]">{filteredOrders.length}</span> commandes
          </span>
          {(statusFilter !== "all" || selectedCity !== "all") && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter("all");
                setSelectedCity("all");
              }}
              className="text-xs text-[#6d381e] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Orders Table Container matching Vinillia */}
      <div className="bg-white rounded-3xl border border-[#E9DCD5] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E9DCD5] text-[11px] font-bold text-[#6d381e] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5 whitespace-nowrap">Commande</th>
                <th className="py-3 px-5 whitespace-nowrap">Client & Contact</th>
                <th className="py-3 px-5 whitespace-nowrap">Ville</th>
                <th className="py-3 px-4 whitespace-nowrap">Articles</th>
                <th className="py-3 px-5 whitespace-nowrap">Total</th>
                <th className="py-3 px-4 whitespace-nowrap">Canal</th>
                <th className="py-3 px-5 whitespace-nowrap">Statut</th>
                <th className="py-3 px-5 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9DCD5]/60 text-[#1F2937]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    Aucune commande trouvée.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isHighlighted = highlightedId === order.id;
                  return (
                    <tr
                      key={order.id}
                      id={`order-${order.id}`}
                      className={`transition-colors ${
                        isHighlighted
                          ? "bg-[#6d381e]/10 border-y-2 border-[#6d381e]"
                          : "hover:bg-[#FAF7F2]/60"
                      }`}
                    >
                      <td className="py-3 px-5 whitespace-nowrap">
                        <span className="font-mono font-bold text-[#1F2937] block text-sm">
                          {order.id}
                        </span>
                        <span className="text-xs text-neutral-400 block mt-0.5">
                          {order.date}
                        </span>
                      </td>

                      <td className="py-3 px-5 whitespace-nowrap">
                        <p className="font-bold text-sm text-[#1F2937]">{order.customerName}</p>
                        <a
                          href={`https://wa.me/212${order.customerPhone.replace(/[^0-9]/g, "").slice(-9)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[#6d381e] hover:underline inline-flex items-center gap-1.5 mt-0.5 font-medium"
                        >
                          <MessageCircle className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                          <span>{order.customerPhone}</span>
                        </a>
                      </td>

                      <td className="py-3 px-5 whitespace-nowrap">
                        <span className="font-bold text-sm text-[#1F2937] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#ba4e1a]" />
                          {order.customerCity}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 flex-nowrap">
                          {order.items.slice(0, 1).map((it, idx) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedOrder(order)}
                              className="relative w-12 h-12 rounded-xl bg-white border border-[#EDE9E6] shadow-2xs shrink-0 flex items-center justify-center p-1 cursor-pointer hover:scale-105 transition-transform"
                              title={`${it.name} (x${it.quantity})`}
                            >
                              <Image
                                src={it.image || "/images/products/prod-tapis.jpg"}
                                alt={it.name}
                                fill
                                className="object-contain p-1"
                              />
                              <span className="absolute -top-1.5 -right-1.5 bg-[#6d381e] text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                                x{it.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-5 whitespace-nowrap">
                        <span className="font-serif font-bold text-base text-[#ba4e1a] block">
                          {order.total} DH
                        </span>
                        <span className="text-[11px] text-neutral-400 block">
                          Paiement livraison
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {getSourceBadge(order.source)}
                      </td>

                      <td className="py-3 px-5 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>

                      <td className="py-3 px-5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#6d381e] text-[#6d381e] hover:text-white border border-[#E9DCD5] transition flex items-center justify-center cursor-pointer shadow-2xs"
                            title="Voir les détails"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateStatus(order.id, e.target.value as AdminOrder["status"])
                            }
                            className="bg-[#FAF7F2] border border-[#E9DCD5] rounded-xl px-2 py-1 text-[11px] font-semibold text-[#1F2937] outline-none cursor-pointer focus:border-[#6d381e]"
                          >
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmée</option>
                            <option value="shipped">Expédiée</option>
                            <option value="delivered">Livrée (Payé)</option>
                            <option value="cancelled">Annulée</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] max-w-lg w-full border border-[#E9DCD5] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#E9DCD5] bg-[#FAF7F2] hover:bg-[#6d381e] hover:text-white flex items-center justify-center transition cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#6d381e]">
                    {selectedOrder.id}
                  </span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1F2937] mt-1">
                  Commande de {selectedOrder.customerName}
                </h3>
                <p className="text-xs text-neutral-400">{selectedOrder.date}</p>
              </div>

              {/* Customer Box */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E9DCD5] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1F2937]">Coordonnées de livraison</span>
                  <a
                    href={`https://wa.me/212${selectedOrder.customerPhone.replace(/[^0-9]/g, "").slice(-9)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#6d381e] font-bold hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>
                <p className="text-neutral-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#ba4e1a]" /> {selectedOrder.customerPhone}
                </p>
                <p className="text-neutral-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#ba4e1a]" /> {selectedOrder.customerCity} — {selectedOrder.customerAddress}
                </p>
                {selectedOrder.notes && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200 mt-1">
                    Note client : {selectedOrder.notes}
                  </p>
                )}
              </div>

              {/* Ordered Items */}
              <div className="space-y-2">
                <p className="font-bold text-xs text-[#1F2937]">Pièces artisanales commandées</p>
                <div className="divide-y divide-[#E9DCD5]/60 border border-[#E9DCD5] rounded-2xl overflow-hidden bg-white">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#FAF7F2] relative border border-[#EDE9E6] shrink-0">
                          <Image
                            src={item.image || "/images/products/prod-tapis.jpg"}
                            alt={item.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-serif font-bold text-[#1F2937] truncate">{item.name}</p>
                          <p className="text-[11px] text-neutral-400">Quantité : {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-[#ba4e1a] shrink-0">
                        {item.price * item.quantity} DH
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Status Selector */}
              <div className="flex items-center justify-between p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E9DCD5]">
                <span className="font-bold text-xs text-[#1F2937]">Total à encaisser (COD) :</span>
                <span className="font-serif font-bold text-lg text-[#ba4e1a]">
                  {selectedOrder.total} DH
                </span>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-[#1F2937]">
                  Modifier le statut de la commande :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(["pending", "confirmed", "shipped", "delivered", "cancelled"] as AdminOrder["status"][]).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                        className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer capitalize ${
                          selectedOrder.status === st
                            ? "bg-[#6d381e] text-white border-[#6d381e] shadow-2xs"
                            : "bg-white text-[#1F2937] border-[#E9DCD5] hover:bg-[#FAF7F2]"
                        }`}
                      >
                        {st === "pending"
                          ? "En attente"
                          : st === "confirmed"
                          ? "Confirmée"
                          : st === "shipped"
                          ? "Expédiée"
                          : st === "delivered"
                          ? "Livrée"
                          : "Annulée"}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCommandesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-400">Chargement des commandes...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
