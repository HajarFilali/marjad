"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AdminCategory,
  INITIAL_ADMIN_CATEGORIES,
  addAdminNotification,
} from "@/lib/adminData";
import {
  Layers,
  Save,
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
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const fromParam = searchParams.get("from");

  const [effectiveReturnUrl, setEffectiveReturnUrl] = useState<string | null>(returnUrl);
  const [isFromProduct, setIsFromProduct] = useState(false);

  useEffect(() => {
    let target = returnUrl;
    if (!target && typeof window !== "undefined") {
      target = sessionStorage.getItem("marjad_nav_from_product");
    }
    const hasDraft =
      typeof window !== "undefined" && !!localStorage.getItem("marjad_product_form_draft");
    const cameFromProd =
      fromParam === "product" || !!target?.includes("/admin/produits") || hasDraft;

    if (cameFromProd) {
      setIsFromProduct(true);
      setEffectiveReturnUrl(target || "/admin/produits/new");
    } else {
      setIsFromProduct(false);
      setEffectiveReturnUrl(target || null);
    }
  }, [returnUrl, fromParam]);

  const [categories, setCategories] = useState<AdminCategory[]>(INITIAL_ADMIN_CATEGORIES);

  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Charger les catégories depuis le stockage local
  useEffect(() => {
    try {
      const storedCats = localStorage.getItem("marjad_admin_categories");
      if (storedCats) {
        const parsedC = JSON.parse(storedCats);
        if (Array.isArray(parsedC) && parsedC.length > 0) {
          const hasOldDemo = parsedC.some((it) => it.slug === "tapis-berberes" || it.slug === "poterie-ceramique");
          if (!hasOldDemo) {
            setCategories(parsedC);
          } else {
            setCategories(INITIAL_ADMIN_CATEGORIES);
            localStorage.setItem("marjad_admin_categories", JSON.stringify(INITIAL_ADMIN_CATEGORIES));
          }
        }
      }
    } catch {}
  }, []);

  // Mode modification : charger les données existantes de la catégorie
  useEffect(() => {
    if (mode === "edit" && categoryId) {
      const c = categories.find((it) => it.id === categoryId || it.slug === categoryId);
      if (c) {
        setName(c.name);
        setNameAr(c.nameAr || "");
        setSlug(c.slug);
        setDescription(c.description);
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
            }
          : c
      );
      setCategories(updated);
      try {
        localStorage.setItem("marjad_admin_categories", JSON.stringify(updated));
      } catch {}
      addAdminNotification({
        title: "Catégorie Mise à Jour",
        desc: `La catégorie ${name} a été modifiée.`,
        type: "order",
      });
    } else {
      const newCategory: AdminCategory = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        nameAr: nameAr.trim() || undefined,
        slug: finalSlug,
        description: description.trim(),
        image: "",
        itemCount: 0,
        dateAdded: new Date().toISOString().split("T")[0],
      };
      const updated = [newCategory, ...currentList];
      setCategories(updated);
      try {
        localStorage.setItem("marjad_admin_categories", JSON.stringify(updated));
      } catch {}
      addAdminNotification({
        title: "Nouvelle Catégorie Créée",
        desc: `La catégorie ${name} a été ajoutée aux métiers d'art MARJAD.`,
        type: "order",
      });
    }

    setSavedSuccess(true);
    setTimeout(() => {
      if (isFromProduct && effectiveReturnUrl) {
        router.push(`${effectiveReturnUrl}?selectedCat=${encodeURIComponent(finalSlug)}`);
      } else {
        router.push("/admin/categories");
      }
    }, 700);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFromProduct && effectiveReturnUrl) {
      router.push(effectiveReturnUrl);
    } else {
      router.push("/admin/categories");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1100px] w-full mx-auto space-y-6 pb-20">
      {/* Header avec Titre et Boutons Annuler / Enregistrer EN HAUT */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9DCD5]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2937]">
            {mode === "create" ? "Ajouter une Nouvelle Catégorie" : "Modifier la Catégorie"}
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Définissez l&apos;identité et l&apos;histoire de cette collection d&apos;artisanat marocain.
          </p>
        </div>

        {/* Boutons d'Action (Annuler & Créer/Mettre à jour) EN HAUT */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 rounded-full border border-[#E9DCD5] text-xs font-bold text-[#6B7280] hover:bg-stone-50 transition cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="category-form"
            className="inline-flex items-center justify-center gap-2 bg-[#6d381e] hover:bg-[#542a15] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-[0_4px_14px_rgba(109,56,30,0.22)] transition-all hover:scale-[1.01] cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 shrink-0" />
            <span>
              {savedSuccess
                ? "Enregistré avec succès !"
                : mode === "create"
                ? "Créer la catégorie"
                : "Mettre à jour la catégorie"}
            </span>
          </button>
        </div>
      </div>

      {/* Formulaire pleine largeur (100% de largeur, sans colonne d'aperçu) */}
      <form id="category-form" onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9DCD5] shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EDE9E6]">
            <Layers className="w-4 h-4 text-[#ba4e1a]" />
            <h2 className="font-serif font-bold text-base text-[#1F2937]">
              Détails du Métier d&apos;Art
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nom Français */}
            <div>
              <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                Nom de la catégorie (Français) *
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
                placeholder="Ex: Calligraphie Murale"
                className="w-full bg-white border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] font-medium transition shadow-2xs"
              />
            </div>

            {/* Nom Arabe (Calligraphie) */}
            <div>
              <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                Nom en Arabe (Calligraphie)
              </label>
              <input
                type="text"
                dir="rtl"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="مثال: خط عربي ولوحات مذهبة"
                className="w-full bg-white border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] font-arabic font-medium transition shadow-2xs"
              />
            </div>
          </div>

          {/* Slug URL */}
          <div>
            <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
              Identifiant URL (Slug) *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ex: calligraphie"
              className="w-full bg-white border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] font-mono text-[11px] outline-none focus:border-[#6d381e] transition shadow-2xs"
            />
          </div>

          {/* Description / Histoire du patrimoine */}
          <div>
            <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
              Histoire &amp; Héritage de la catégorie *
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Expliquez la noblesse de ce savoir-faire, les matières utilisées et les traditions d'artisanat marocain..."
              className="w-full bg-white border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] transition leading-relaxed resize-none shadow-2xs"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
