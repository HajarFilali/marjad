"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AdminCategory,
  INITIAL_ADMIN_CATEGORIES,
  addAdminNotification,
} from "@/lib/adminData";
import {
  Layers,
  Image as ImageIcon,
  ArrowLeft,
  Save,
  Sparkles,
  Info,
} from "lucide-react";

interface CategoryFormPageProps {
  mode: "create" | "edit";
  categoryId?: string;
}

export const CategoryFormPage: React.FC<CategoryFormPageProps> = ({
  mode,
  categoryId,
}) => {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategory[]>(INITIAL_ADMIN_CATEGORIES);

  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("/images/categories/cat-tapis.jpg");
  const [itemCount, setItemCount] = useState<number>(24);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("marjad_admin_categories");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) setCategories(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (mode === "edit" && categoryId) {
      const c = categories.find((it) => it.id === categoryId || it.slug === categoryId);
      if (c) {
        setName(c.name);
        setNameAr(c.nameAr || "");
        setSlug(c.slug);
        setDescription(c.description);
        setImage(c.image);
        setItemCount(c.itemCount || 20);
      }
    }
  }, [mode, categoryId, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentList = categories.length > 0 ? categories : INITIAL_ADMIN_CATEGORIES;
    const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (mode === "edit" && categoryId) {
      const updated = currentList.map((c) =>
        c.id === categoryId || c.slug === categoryId
          ? {
              ...c,
              name: name.trim(),
              nameAr: nameAr.trim() || undefined,
              slug: finalSlug,
              description: description.trim(),
              image: image.trim(),
              itemCount: Number(itemCount),
            }
          : c
      );
      setCategories(updated);
      try {
        localStorage.setItem("marjad_admin_categories", JSON.stringify(updated));
      } catch {}
      addAdminNotification({
        title: "Collection Mise à Jour",
        desc: `La collection ${name} a été modifiée.`,
        type: "order",
      });
    } else {
      const newCategory: AdminCategory = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        nameAr: nameAr.trim() || undefined,
        slug: finalSlug,
        description: description.trim(),
        image: image.trim() || "/images/categories/cat-tapis.jpg",
        itemCount: Number(itemCount),
        dateAdded: new Date().toISOString().split("T")[0],
      };
      const updated = [newCategory, ...currentList];
      setCategories(updated);
      try {
        localStorage.setItem("marjad_admin_categories", JSON.stringify(updated));
      } catch {}
      addAdminNotification({
        title: "Nouvelle Collection Créée",
        desc: `La collection ${name} a été ajoutée aux métiers d'art MARJAD.`,
        type: "order",
      });
    }

    setSavedSuccess(true);
    setTimeout(() => {
      router.push("/admin/categories");
    }, 800);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1300px] w-full mx-auto space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9DCD5]">
        <div className="space-y-1">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ba4e1a] hover:text-[#6d381e] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour aux collections &amp; métiers d&apos;art</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2937]">
            {mode === "create" ? "Ajouter une Nouvelle Collection" : "Modifier la Collection"}
          </h1>
          <p className="text-xs text-[#6B7280]">
            Définissez l&apos;identité et l&apos;histoire de ce métier d&apos;art marocain.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/categories"
            className="px-4 py-2.5 rounded-full border border-[#E9DCD5] text-xs font-bold text-[#6B7280] hover:bg-stone-50 transition cursor-pointer"
          >
            Annuler
          </Link>
          <button
            type="submit"
            form="category-form"
            className="inline-flex items-center gap-2 bg-[#6d381e] hover:bg-[#542a15] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-[0_4px_14px_rgba(109,56,30,0.22)] transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? "Enregistré avec succès !" : mode === "create" ? "Créer la collection" : "Mettre à jour"}</span>
          </button>
        </div>
      </div>

      <form id="category-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Informations de la Collection (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E9DCD5] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#EDE9E6]">
                <Layers className="w-4 h-4 text-[#ba4e1a]" />
                <h2 className="font-serif font-bold text-base text-[#1F2937]">
                  Détails du Métier d&apos;Art
                </h2>
              </div>

              {/* Nom Français */}
              <div>
                <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                  Nom de la collection (Français) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (mode === "create") {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  placeholder="Ex: Tapis Berbères"
                  className="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] font-medium transition"
                />
              </div>

              {/* Nom Arabe */}
              <div>
                <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                  Nom en Arabe (Calligraphie)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: زرابي أمازيغية أصيلة"
                  className="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] font-arabic font-medium transition"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                  Identifiant URL (Slug) *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ex: tapis-berberes"
                  className="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] font-mono text-[11px] outline-none focus:border-[#6d381e] transition"
                />
              </div>

              {/* Nombre de pièces */}
              <div>
                <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                  Nombre estimé de créations
                </label>
                <input
                  type="number"
                  min={0}
                  value={itemCount}
                  onChange={(e) => setItemCount(Number(e.target.value))}
                  className="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] transition"
                />
              </div>

              {/* Description du patrimoine */}
              <div>
                <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                  Histoire &amp; Héritage du métier d&apos;art *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Expliquez la noblesse de ce savoir-faire, les matières utilisées et les régions emblématiques du Royaume..."
                  className="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] transition leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Image & Live Preview (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E9DCD5] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#EDE9E6]">
                <ImageIcon className="w-4 h-4 text-[#ba4e1a]" />
                <h2 className="font-serif font-bold text-base text-[#1F2937]">
                  Image d&apos;Illustration
                </h2>
              </div>

              <div>
                <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                  Chemin d&apos;accès ou URL de l&apos;image *
                </label>
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/categories/cat-tapis.jpg ou lien https://..."
                  className="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] font-mono text-[11px] outline-none focus:border-[#6d381e]"
                />
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#E9DCD5] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E9DCD5]/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#6d381e]">
                  <Sparkles className="w-4 h-4 text-[#ba4e1a]" />
                  <span>Aperçu de la Carte Collection</span>
                </div>
                <span className="text-[10px] font-bold text-[#ba4e1a] bg-[#ba4e1a]/10 px-2 py-0.5 rounded-full">
                  Rendu Boutique
                </span>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden border border-[#EDE9E6] shadow-sm">
                <div className="relative aspect-[16/10] w-full bg-[#FAF6F4] overflow-hidden">
                  <Image
                    src={image || "/images/categories/cat-tapis.jpg"}
                    alt={name || "Aperçu"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="font-serif font-bold text-base leading-tight">
                      {name || "Nom de la Collection"}
                    </p>
                    {nameAr && (
                      <p className="text-xs text-white/80 font-arabic mt-0.5" dir="rtl">
                        {nameAr}
                      </p>
                    )}
                    <span className="inline-block mt-1 text-[10px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                      {itemCount} créations disponibles
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
