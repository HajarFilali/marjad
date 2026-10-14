"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CustomSelect } from "@/components/admin/CustomSelect";
import {
  INITIAL_ADMIN_VIDEOS,
  INITIAL_ADMIN_PRODUCTS,
  AdminTrendingVideo,
  AdminProduct,
  addAdminNotification,
} from "@/lib/adminData";
import {
  Plus,
  Play,
  Edit2,
  Trash2,
  UploadCloud,
  X,
  Link as LinkIcon,
  ShoppingBag,
} from "lucide-react";

function AdminVideosContent() {
  const searchParams = useSearchParams();
  const [videos, setVideos] = useState<AdminTrendingVideo[]>(INITIAL_ADMIN_VIDEOS);
  const [products, setProducts] = useState<AdminProduct[]>(INITIAL_ADMIN_PRODUCTS);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Modal create/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<AdminTrendingVideo | null>(null);

  // Form states
  const [selectedProductId, setSelectedProductId] = useState<string | number>("1");
  const [uploadMode, setUploadMode] = useState<"url" | "file">("url");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFileName, setVideoFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize with LocalStorage and external update events
  useEffect(() => {
    const loadVideos = () => {
      try {
        const stored = localStorage.getItem("marjad_admin_videos");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setVideos(parsed);
          } else {
            localStorage.setItem("marjad_admin_videos", JSON.stringify(INITIAL_ADMIN_VIDEOS));
            setVideos(INITIAL_ADMIN_VIDEOS);
          }
        } else {
          localStorage.setItem("marjad_admin_videos", JSON.stringify(INITIAL_ADMIN_VIDEOS));
          setVideos(INITIAL_ADMIN_VIDEOS);
        }

        const storedProds = localStorage.getItem("marjad_admin_products");
        if (storedProds) {
          const parsedP = JSON.parse(storedProds);
          if (Array.isArray(parsedP) && parsedP.length > 0) {
            setProducts(parsedP);
          }
        }
      } catch {}
    };

    loadVideos();
    const handleUpdate = () => loadVideos();
    window.addEventListener("marjad_videos_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("marjad_videos_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const saveVideos = (updated: AdminTrendingVideo[]) => {
    setVideos(updated);
    try {
      localStorage.setItem("marjad_admin_videos", JSON.stringify(updated));
      window.dispatchEvent(new Event("marjad_videos_updated"));
    } catch {}
  };

  // URL highlight
  useEffect(() => {
    const highlight = searchParams.get("highlight");
    if (highlight) {
      setHighlightedId(highlight);
      setTimeout(() => {
        const el = document.getElementById(`video-${highlight}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);

      const timer = setTimeout(() => setHighlightedId(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const selectedProduct = useMemo(() => {
    return products.find((p) => String(p.id) === String(selectedProductId)) || products[0];
  }, [products, selectedProductId]);

  const productOptions = useMemo(() => {
    return products.map((p) => ({
      value: String(p.id),
      label: `${p.name} (${p.price} DH)`,
    }));
  }, [products]);

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
  };

  const openCreateModal = () => {
    setEditingVideo(null);
    const prod = products[0];
    setSelectedProductId(prod?.id || "1");
    setUploadMode("url");
    setVideoUrl("");
    setVideoFileName("");
    setIsModalOpen(true);
  };

  const openEditModal = (video: AdminTrendingVideo) => {
    setEditingVideo(video);
    setSelectedProductId(video.productId || "1");
    setVideoUrl(video.videoUrl || "");
    setUploadMode(
      video.videoUrl && !video.videoUrl.startsWith("http") && !video.videoUrl.startsWith("/")
        ? "file"
        : "url"
    );
    setVideoFileName("");
    setIsModalOpen(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = selectedProduct;
    const finalProductName = prod?.name || "Création Artisanale";
    const finalCategory = prod?.categoryName || "Artisanat d'exception";
    const finalTitle = `Fabrication artisanale : ${finalProductName}`;
    const finalThumbnail = prod?.image || "/images/products/prod-tapis.jpg";
    const finalPrice = `${prod?.price || 1200} DH`;
    const finalVideoUrl = videoUrl.trim() || "/pinterest_video.mp4";

    if (editingVideo) {
      const updated = videos.map((v) =>
        v.id === editingVideo.id
          ? {
              ...v,
              title: v.title || finalTitle,
              productId: prod?.id,
              productName: finalProductName,
              category: finalCategory,
              productSlug: prod?.slug || v.productSlug,
              productImage: finalThumbnail,
              price: finalPrice,
              videoUrl: finalVideoUrl,
              thumbnail: finalThumbnail,
            }
          : v
      );
      saveVideos(updated);
      addAdminNotification({
        title: "Vidéo Modifiée",
        desc: `${finalProductName} a été mise à jour.`,
        type: "video",
      });
    } else {
      const newVideo: AdminTrendingVideo = {
        id: `vid-${Date.now()}`,
        title: finalTitle,
        author: "@marjad_officiel",
        customerName: "@marjad_officiel",
        city: "Atelier Marjad",
        views: "Nouveau",
        likes: "0",
        productId: prod?.id,
        productName: finalProductName,
        category: finalCategory,
        productSlug: prod?.slug || "artisanat",
        productImage: finalThumbnail,
        price: finalPrice,
        videoUrl: finalVideoUrl,
        thumbnail: finalThumbnail,
        active: true,
        dateAdded: new Date().toISOString().split("T")[0],
      };
      saveVideos([newVideo, ...videos]);
      addAdminNotification({
        title: "Nouvelle Vidéo Publiée",
        desc: `Vidéo associée à ${finalProductName} ajoutée au flux.`,
        type: "video",
      });
    }

    setIsModalOpen(false);
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette vidéo d'artisanat ?")) {
      const updated = videos.filter((v) => v.id !== id);
      saveVideos(updated);
      addAdminNotification({
        title: "Vidéo Supprimée",
        desc: "La vidéo a été retirée du flux.",
        type: "video",
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1680px] w-full mx-auto">
      {/* Top Header matching Vinilia */}
      <AdminHeader
        title="Vidéos de l'Atelier & Démonstrations"
        subtitle="Supervisez le flux vidéo viral de la maison d'artisanat et associez vos créations vedettes."
      >
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-[#6d381e] hover:bg-[#542a15] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-[0_4px_14px_rgba(109,56,30,0.22)] transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Vidéo TikTok / Reel</span>
        </button>
      </AdminHeader>

      {/* Videos Count Bar */}
      <div className="bg-white py-2.5 px-4 rounded-2xl border border-[#EDE9E6] shadow-2xs flex items-center justify-between">
        <span className="text-xs text-[#6B7280]">
          Affichage de <span className="font-bold text-[#1F2937]">{videos.length}</span> vidéos synchronisées avec la boutique
        </span>
        <span className="text-xs font-bold text-[#ba4e1a] bg-[#ba4e1a]/10 px-2.5 py-0.5 rounded-full">
          Reels Verticaux 9:16
        </span>
      </div>

      {/* Video Reels Grid matching Vinilia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => {
          const isHighlighted = highlightedId === video.id;
          const matchedProd = products.find(
            (p) => String(p.id) === String(video.productId) || p.name === video.productName
          );
          const taggedImage = video.productImage || matchedProd?.image || video.thumbnail;

          return (
            <div
              key={video.id}
              id={`video-${video.id}`}
              className={`aspect-[9/15] bg-[#1F2937] rounded-[28px] overflow-hidden shadow-sm transition-all duration-300 flex flex-col justify-between group relative select-none ${
                isHighlighted
                  ? "border-2 border-[#6d381e] ring-4 ring-[#6d381e]/30 shadow-2xl scale-[1.02] z-20"
                  : "border border-[#E9DCD5]/70 hover:border-[#6d381e]/60 hover:shadow-[0_12px_32px_rgba(109,56,30,0.2)]"
              }`}
            >
              {/* Video stream or Thumbnail */}
              {video.videoUrl ? (
                <video
                  src={video.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <Image
                  src={video.thumbnail || "/images/products/prod-tapis.jpg"}
                  alt={video.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              )}

              {/* Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40 pointer-events-none" />

              {/* Top Bar: Action Buttons (Modifier & Supprimer) */}
              <div className="relative z-10 p-4 flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 text-white/90 backdrop-blur-md border border-white/20">
                  {video.author || "@marjad_officiel"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(video)}
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#6d381e] text-white backdrop-blur-md border border-white/20 shadow-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
                    title="Modifier la vidéo"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteVideo(video.id)}
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-rose-600 text-white backdrop-blur-md border border-white/20 shadow-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
                    title="Supprimer la vidéo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Play Button Indicator */}
              <div className="relative z-10 flex items-center justify-center my-auto pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-xl group-hover:bg-[#6d381e] group-hover:border-[#6d381e] transition duration-300">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </div>

              {/* Bottom Card Content with Product Info: Category top, Name below, Price */}
              <div className="relative z-10 p-4 space-y-3">
                {video.title && (
                  <p className="text-xs font-semibold text-white/95 line-clamp-2 leading-snug drop-shadow-md">
                    {video.title}
                  </p>
                )}

                {/* Tagged Product Box */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/80 flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-white shrink-0 overflow-hidden border border-[#E9DCD5] shadow-2xs relative flex items-center justify-center p-1">
                    <Image
                      src={taggedImage}
                      alt={video.productName}
                      fill
                      className="object-contain p-0.5"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    {/* 1. Catégorie en haut */}
                    <p className="text-[10px] text-[#ba4e1a] font-bold uppercase tracking-wider truncate">
                      {video.category || matchedProd?.categoryName || "Artisanat d'exception"}
                    </p>
                    {/* 2. Nom du produit sous la catégorie */}
                    <p className="font-serif text-xs font-bold text-[#1F2937] truncate" title={video.productName}>
                      {video.productName}
                    </p>
                    {/* 3. Prix */}
                    <p className="text-xs font-extrabold text-[#1F2937] whitespace-nowrap">
                      {video.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LUXURY 2-COLUMN MODAL AJOUT / MODIFICATION VIDÉO (Formulaire style Vinilia) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] max-w-3xl w-full max-h-[92vh] flex flex-col border border-[#E9DCD5] shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Close Button Top Right */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="group absolute top-5 right-5 w-9 h-9 rounded-full border border-[#E9DCD5] bg-[#FAF6F4] hover:bg-[#6d381e] hover:border-[#6d381e] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xs cursor-pointer z-30"
              title="Fermer"
            >
              <X className="w-4 h-4 text-[#6d381e] group-hover:text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs custom-scrollbar">
              {/* Header Title */}
              <div className="pr-10">
                <span className="text-[11px] uppercase font-bold text-[#ba4e1a] tracking-widest block mb-0.5">
                  FLUX VIDÉO & REELS ARTISANAT
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1F2937]">
                  {editingVideo ? "Modifier la Vidéo Reel" : "Ajouter une Vidéo TikTok / Reel"}
                </h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Associez un geste d&apos;artisan ou une démonstration d&apos;atelier directement à une pièce du catalogue.
                </p>
              </div>

              <form id="video-form" onSubmit={handleSaveVideo} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* LEFT COLUMN: Compte Officiel bloqué + Sélecteur Produit + Fiche Produit (Col 6) */}
                  <div className="lg:col-span-6 space-y-4">
                    {/* Compte Officiel bloqué */}
                    <div>
                      <label className="block font-bold text-[#1F2937] mb-1.5 text-xs">
                        Compte Officiel
                      </label>
                      <input
                        type="text"
                        value="@marjad_officiel"
                        disabled
                        readOnly
                        className="w-full bg-[#FAF6F4]/70 border border-[#E9DCD5] rounded-xl px-3.5 py-2.5 text-xs text-[#6B7280] font-medium cursor-not-allowed select-none focus:outline-none"
                      />
                    </div>

                    {/* Sélectionner le produit */}
                    <div>
                      <label className="block font-bold text-[#1F2937] mb-1.5 text-xs">
                        Sélectionner le produit *
                      </label>
                      <CustomSelect
                        value={String(selectedProductId)}
                        onChange={handleProductSelect}
                        options={productOptions}
                        icon={ShoppingBag}
                        placeholder="Sélectionnez un produit"
                        triggerClassName="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl text-xs py-2.5 text-[#1F2937]"
                      />
                    </div>

                    {/* Fiche Produit sans background beige extérieur */}
                    {selectedProduct && (
                      <div className="bg-white rounded-2xl p-3.5 border border-[#EDE9E6] flex items-center gap-3.5 shadow-2xs">
                        <div className="w-14 h-14 rounded-xl bg-white shrink-0 overflow-hidden border border-[#E9DCD5] relative flex items-center justify-center p-1 shadow-2xs">
                          <Image
                            src={selectedProduct.image || "/images/products/prod-tapis.jpg"}
                            alt={selectedProduct.name}
                            fill
                            className="object-contain p-0.5"
                            sizes="56px"
                          />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          {/* 1. Catégorie en haut */}
                          <p className="text-[10px] font-bold text-[#ba4e1a] uppercase tracking-wider truncate">
                            {selectedProduct.categoryName || "Artisanat d'exception"}
                          </p>
                          {/* 2. Nom du produit sous la catégorie */}
                          <p className="font-serif text-xs font-bold text-[#1F2937] truncate" title={selectedProduct.name}>
                            {selectedProduct.name}
                          </p>
                          {/* 3. Prix */}
                          <p className="text-xs font-extrabold text-[#1F2937]/90 mt-0.5">
                            {selectedProduct.price} DH
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RIGHT COLUMN: Source Vidéo (Tabs: Lien URL vidéo ou Fichier vidéo) (Col 6) */}
                  <div className="lg:col-span-6 space-y-4">
                    {/* Tabs Switch */}
                    <div>
                      <label className="block font-bold text-[#1F2937] mb-1.5 text-xs">
                        Source de la vidéo *
                      </label>
                      <div className="bg-[#FAF6F4] p-1 rounded-full border border-[#E9DCD5] grid grid-cols-2 gap-1 mb-3">
                        <button
                          type="button"
                          onClick={() => setUploadMode("url")}
                          className={`py-2 px-3 rounded-full text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                            uploadMode === "url"
                              ? "bg-[#6d381e] text-white shadow-2xs"
                              : "text-[#6B7280] hover:text-[#1F2937]"
                          }`}
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>Lien URL vidéo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setUploadMode("file")}
                          className={`py-2 px-3 rounded-full text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                            uploadMode === "file"
                              ? "bg-[#6d381e] text-white shadow-2xs"
                              : "text-[#6B7280] hover:text-[#1F2937]"
                          }`}
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Fichier vidéo</span>
                        </button>
                      </div>
                    </div>

                    {/* When Lien URL vidéo is selected: only show URL input */}
                    {uploadMode === "url" ? (
                      <div>
                        <label className="block font-bold text-[#1F2937] mb-1.5 text-xs">
                          Lien URL de la vidéo *
                        </label>
                        <div className="relative flex items-center">
                          <LinkIcon className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 pointer-events-none" />
                          <input
                            type="url"
                            required={uploadMode === "url"}
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="https://... (Lien MP4, TikTok ou vidéo)"
                            className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-[#FAF6F4] border border-[#E9DCD5] outline-none focus:border-[#6d381e] font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    ) : (
                      /* When Fichier vidéo is selected: only show File Dropzone */
                      <div>
                        <label className="block font-bold text-[#1F2937] mb-1.5 text-xs">
                          Importer un fichier vidéo *
                        </label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              const url = URL.createObjectURL(f);
                              setVideoUrl(url);
                              setVideoFileName(f.name);
                            }
                          }}
                        />
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-7 border-2 border-dashed border-[#E9DCD5] hover:border-[#6d381e] rounded-2xl flex flex-col items-center justify-center gap-2 bg-[#FAF6F4] hover:bg-[#FAF7F2] text-[#6d381e] cursor-pointer transition p-4 text-center"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#ba4e1a]/10 flex items-center justify-center text-[#ba4e1a]">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-xs block text-[#1F2937]">
                              {videoFileName ? videoFileName : "Cliquez pour importer votre fichier vidéo"}
                            </span>
                            <span className="text-[10px] text-[#6B7280]">
                              Format vertical (MP4, MOV, WebM)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer Pinned: Annuler & Publier la vidéo */}
            <div className="px-6 sm:px-8 py-4 bg-[#FAF7F2] border-t border-[#E9DCD5] flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-[#E9DCD5] text-xs font-bold text-[#6B7280] hover:bg-stone-50 transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                form="video-form"
                className="px-7 py-2.5 rounded-xl bg-[#6d381e] hover:bg-[#542a15] text-white text-xs font-bold shadow-md shadow-[#6d381e]/25 transition cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                {editingVideo ? "Enregistrer la vidéo" : "Publier la vidéo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminVideosPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-400">Chargement des vidéos...</div>}>
      <AdminVideosContent />
    </Suspense>
  );
}
