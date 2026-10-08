"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  INITIAL_ADMIN_REVIEWS,
  AdminReview,
  addAdminNotification,
} from "@/lib/adminData";
import {
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  X,
  Quote,
} from "lucide-react";

function AdminReviewsContent() {
  const searchParams = useSearchParams();
  const [reviews, setReviews] = useState<AdminReview[]>(INITIAL_ADMIN_REVIEWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("marjad_admin_reviews");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews(parsed);
        }
      }
    } catch {}
  }, []);

  const saveReviews = (updated: AdminReview[]) => {
    setReviews(updated);
    try {
      localStorage.setItem("marjad_admin_reviews", JSON.stringify(updated));
    } catch {}
  };

  // URL highlight
  useEffect(() => {
    const highlight = searchParams.get("highlight");
    if (highlight) {
      setHighlightedId(highlight);
      setTimeout(() => {
        const el = document.getElementById(`review-${highlight}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);

      const timer = setTimeout(() => setHighlightedId(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const stats = useMemo(() => {
    return {
      all: reviews.length,
      pending: reviews.filter((r) => r.status === "pending").length,
      approved: reviews.filter((r) => r.status === "approved").length,
      rejected: reviews.filter((r) => r.status === "rejected").length,
    };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchSearch =
        !searchQuery ||
        r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customerCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "all" || r.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [reviews, searchQuery, statusFilter]);

  const handleUpdateStatus = (id: string, status: AdminReview["status"]) => {
    const updated = reviews.map((r) => (r.id === id ? { ...r, status } : r));
    saveReviews(updated);
    addAdminNotification({
      title: `Avis ${status === "approved" ? "Approuvé" : "Rejeté"}`,
      desc: `L'avis client #${id} a été mis à jour.`,
      type: "review",
    });
  };

  const handleDeleteReview = (id: string) => {
    if (confirm("Voulez-vous supprimer cet avis client ?")) {
      const updated = reviews.filter((r) => r.id !== id);
      saveReviews(updated);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-5 max-w-[1680px] w-full mx-auto">
      {/* Top Header without add button (Admins moderate reviews, they do not write them) */}
      <AdminHeader
        title="Avis Clients & Témoignages"
        subtitle={`Modération des retours d'expérience et notes vérifiées sur les créations d'artisanat (${reviews.length} avis).`}
      />

      {/* Filter Row: Status Pills matching Vinillia (Ratings select removed as requested) */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="bg-[#FAF6F4] p-1 rounded-full border border-[#E9DCD5] inline-flex items-center gap-1 shadow-2xs overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              statusFilter === "all"
                ? "bg-[#6d381e] text-white shadow-xs"
                : "text-[#4B5563] hover:text-[#1F2937]"
            }`}
          >
            <span>Tous ({stats.all})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("pending")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              statusFilter === "pending"
                ? "bg-[#6d381e] text-white shadow-xs"
                : "text-[#4B5563] hover:text-[#1F2937]"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>En attente ({stats.pending})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("approved")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              statusFilter === "approved"
                ? "bg-[#6d381e] text-white shadow-xs"
                : "text-[#4B5563] hover:text-[#1F2937]"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approuvés ({stats.approved})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("rejected")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              statusFilter === "rejected"
                ? "bg-[#6d381e] text-white shadow-xs"
                : "text-[#4B5563] hover:text-[#1F2937]"
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejetés ({stats.rejected})</span>
          </button>
        </div>

        <span className="text-xs text-[#6B7280]">
          Total : <span className="font-bold text-[#1F2937]">{filteredReviews.length}</span> avis clients
        </span>
      </div>

      {/* Reviews Cards Grid (2 per row matching Vinillia) */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E9DCD5] p-12 text-center w-full">
          <MessageSquare className="w-12 h-12 text-[#E9DCD5] mx-auto mb-3" />
          <p className="font-serif text-lg font-bold text-[#1F2937]">Aucun avis trouvé</p>
          <p className="text-xs text-neutral-400 mt-1">
            Ajustez vos filtres pour visualiser d&apos;autres avis clients.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {filteredReviews.map((review) => {
            const isHighlighted = highlightedId === review.id;
            return (
              <div
                key={review.id}
                id={`review-${review.id}`}
                className={`rounded-3xl border p-5 transition-all duration-300 flex flex-col justify-between gap-4 ${
                  isHighlighted
                    ? "bg-[#6d381e]/5 border-2 border-[#6d381e] ring-2 ring-[#6d381e]/20 shadow-md"
                    : "bg-white border-[#E9DCD5] shadow-2xs hover:shadow-md hover:border-[#6d381e]/30"
                }`}
              >
                <div className="space-y-3">
                  {/* Header: Product Image + Product Name + Stars */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="relative w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0 border border-[#E9DCD5] shadow-2xs">
                        <Image
                          src={review.productImage || "/images/products/prod-tapis.jpg"}
                          alt={review.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-[#6d381e] truncate block">
                          {review.productName}
                        </span>
                        {/* Rating Stars + Date on same line */}
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-stone-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-neutral-400 font-medium">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 border ${
                        review.status === "approved"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : review.status === "pending"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-rose-50 text-rose-800 border-rose-200"
                      }`}
                    >
                      {review.status === "approved"
                        ? "Approuvé"
                        : review.status === "pending"
                        ? "En attente"
                        : "Rejeté"}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-6 h-6 rounded-full bg-[#6d381e]/10 text-[#6d381e] flex items-center justify-center font-bold text-[10px]">
                      {review.customerName.charAt(0)}
                    </div>
                    <span className="font-bold text-[#1F2937]">{review.customerName}</span>
                    <span className="text-neutral-400 text-[11px]">• {review.customerCity}</span>
                  </div>

                  {/* Comment */}
                  <div className="space-y-1">
                    {review.title && (
                      <h4 className="font-serif font-bold text-xs text-[#1F2937]">
                        {review.title}
                      </h4>
                    )}
                    <p className="text-xs text-[#4B5563] italic leading-relaxed bg-[#FAF7F2] p-3 rounded-2xl border border-[#E9DCD5]/60">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-2 border-t border-[#E9DCD5]/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-neutral-400">
                    Avis vérifié MARJAD
                  </span>

                  <div className="flex items-center gap-1.5">
                    {review.status !== "approved" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(review.id, "approved")}
                        className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border border-emerald-200"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Approuver</span>
                      </button>
                    )}

                    {review.status !== "rejected" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(review.id, "rejected")}
                        className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border border-amber-200"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Rejeter</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteReview(review.id)}
                      className="w-7 h-7 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition flex items-center justify-center cursor-pointer border border-rose-200"
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
  );
}

export default function AdminCommentairesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-400">Chargement des avis...</div>}>
      <AdminReviewsContent />
    </Suspense>
  );
}
