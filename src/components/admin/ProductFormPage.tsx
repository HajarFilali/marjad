"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AdminProduct,
  INITIAL_ADMIN_PRODUCTS,
  INITIAL_ADMIN_CATEGORIES,
  addAdminNotification,
} from "@/lib/adminData";
import { CustomSelect } from "@/components/admin/CustomSelect";
import {
  Package,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  UploadCloud,
  FileImage,
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  Sparkles,
  MapPin,
  Tag,
  ShoppingBag,
  Star,
  Info,
  DollarSign,
} from "lucide-react";

interface ProductFormPageProps {
  mode: "create" | "edit";
  productId?: string | number;
}

export const ProductFormPage: React.FC<ProductFormPageProps> = ({
  mode,
  productId,
}) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [products, setProducts] = useState<AdminProduct[]>(INITIAL_ADMIN_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_ADMIN_CATEGORIES);

  // Form states
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [categorySlug, setCategorySlug] = useState("tapis-berberes");
  const [artisanName, setArtisanName] = useState("");
  const [artisanCity, setArtisanCity] = useState("Fès Médina");
  const [material, setMaterial] = useState("100% Pure Laine d'agneau de l'Atlas");
  const [dimensions, setDimensions] = useState("250 cm x 160 cm");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(1800);
  const [hasPromo, setHasPromo] = useState(false);
  const [oldPrice, setOldPrice] = useState<number>(2400);
  const [stock, setStock] = useState<number>(6);
  const [image, setImage] = useState("/images/products/prod-tapis.jpg");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [newAddImageUrl, setNewAddImageUrl] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load products & categories from localStorage
  useEffect(() => {
    try {
      const storedProds = localStorage.getItem("marjad_admin_products");
      if (storedProds) {
        const parsed = JSON.parse(storedProds);
        if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
      }
      const storedCats = localStorage.getItem("marjad_admin_categories");
      if (storedCats) {
        const parsedCats = JSON.parse(storedCats);
        if (Array.isArray(parsedCats) && parsedCats.length > 0) setCategories(parsedCats);
      }
    } catch {}
  }, []);

  // When edit mode, load product data
  useEffect(() => {
    if (mode === "edit" && productId) {
      const p = products.find((it) => String(it.id) === String(productId));
      if (p) {
        setName(p.name);
        setNameAr(p.nameAr || "");
        setCategorySlug(p.categorySlug || "tapis-berberes");
        setArtisanName(p.artisanName || "Maâlem Artisan Marjad");
        setArtisanCity(p.artisanCity || "Marrakech Médina");
        setMaterial(p.material || "Laine & Soie végétale");
        setDimensions(p.dimensions || "Dimensions sur mesure");
        setDescription(p.description || p.shortDescription || "");
        setPrice(p.price || 1500);
        if (p.oldPrice && p.oldPrice > p.price) {
          setHasPromo(true);
          setOldPrice(p.oldPrice);
        } else {
          setHasPromo(false);
        }
        setStock(p.stock !== undefined ? p.stock : 8);
        setImage(p.image || "/images/products/prod-tapis.jpg");
        setAdditionalImages(p.images?.filter((img) => img !== p.image) || []);
      }
    }
  }, [mode, productId, products]);

  const categoryOptions = useMemo(() => {
    return categories.map((c) => ({
      value: c.slug,
      label: c.name,
    }));
  }, [categories]);

  const selectedCategoryName = useMemo(() => {
    return categories.find((c) => c.slug === categorySlug)?.name || "Artisanat d'Art";
  }, [categories, categorySlug]);

  const handleAddImage = () => {
    if (newAddImageUrl.trim() && additionalImages.length < 3) {
      setAdditionalImages([...additionalImages, newAddImageUrl.trim()]);
      setNewAddImageUrl("");
    }
  };

  const handleRemoveAddImage = (idx: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentList = products.length > 0 ? products : INITIAL_ADMIN_PRODUCTS;
    const finalStock = Number(stock) || 0;
    const stockStatus: "in_stock" | "low_stock" | "out_of_stock" =
      finalStock <= 0 ? "out_of_stock" : finalStock <= 4 ? "low_stock" : "in_stock";

    if (mode === "edit" && productId) {
      const updated = currentList.map((p) =>
        String(p.id) === String(productId)
          ? {
              ...p,
              name: name.trim(),
              nameAr: nameAr.trim() || undefined,
              categorySlug,
              categoryName: selectedCategoryName,
              price: Number(price),
              oldPrice: hasPromo ? Number(oldPrice) : undefined,
              stock: finalStock,
              status: stockStatus,
              artisanName: artisanName.trim(),
              artisanCity: artisanCity.trim(),
              material: material.trim(),
              dimensions: dimensions.trim(),
              description: description.trim(),
              image: image.trim(),
              images: [image.trim(), ...additionalImages],
            }
          : p
      );
      setProducts(updated);
      try {
        localStorage.setItem("marjad_admin_products", JSON.stringify(updated));
      } catch {}
      addAdminNotification({
        title: "Pièce Modifiée",
        desc: `${name} a été mise à jour dans le catalogue.`,
        type: "order",
      });
    } else {
      const newId = `prod-${Date.now()}`;
      const newProduct: AdminProduct = {
        id: newId,
        name: name.trim(),
        nameAr: nameAr.trim() || undefined,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        categorySlug,
        categoryName: selectedCategoryName,
        price: Number(price),
        oldPrice: hasPromo ? Number(oldPrice) : undefined,
        stock: finalStock,
        status: stockStatus,
        dateAdded: new Date().toISOString().split("T")[0],
        salesCount: 0,
        rating: 5.0,
        reviewsCount: 0,
        image: image.trim() || "/images/products/prod-tapis.jpg",
        images: [image.trim() || "/images/products/prod-tapis.jpg", ...additionalImages],
        shortDescription: description.trim().slice(0, 100),
        description: description.trim(),
        artisanName: artisanName.trim() || "Maâlem Artisan Marjad",
        artisanCity: artisanCity.trim() || "Fès Médina",
        material: material.trim(),
        dimensions: dimensions.trim(),
        isFeatured: true,
      };

      const updated = [newProduct, ...currentList];
      setProducts(updated);
      try {
        localStorage.setItem("marjad_admin_products", JSON.stringify(updated));
      } catch {}
      addAdminNotification({
        title: "Nouvelle Création Publiée",
        desc: `${name} a été ajoutée à la boutique MARJAD.`,
        type: "order",
      });
    }

    setSavedSuccess(true);
    setTimeout(() => {
      router.push("/admin/produits");
    }, 800);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1500px] w-full mx-auto space-y-6 pb-20">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9DCD5]">
        <div className="space-y-1">
          <Link
            href="/admin/produits"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ba4e1a] hover:text-[#6d381e] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour au catalogue des créations</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2937]">
            {mode === "create" ? "Ajouter une Création d'Atelier" : "Modifier la Pièce d'Artisanat"}
          </h1>
          <p className="text-xs text-[#6B7280]">
            Renseignez les détails authentiques de la pièce. Ces informations sont directement valorisées sur la fiche produit client.
          </p>
        </div>

        {/* Quick action buttons on top */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/produits"
            className="px-4 py-2.5 rounded-full border border-[#E9DCD5] text-xs font-bold text-[#6B7280] hover:bg-stone-50 transition cursor-pointer"
          >
            Annuler
          </Link>
          <button
            type="submit"
            form="product-form"
            className="inline-flex items-center gap-2 bg-[#6d381e] hover:bg-[#542a15] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-[0_4px_14px_rgba(109,56,30,0.22)] transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? "Enregistré avec succès !" : mode === "create" ? "Enregistrer la création" : "Mettre à jour la pièce"}</span>
          </button>
        </div>
      </div>

      {/* Main Form Body */}
      <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Informations Générales & Fiche Artisanale (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card 1: Fiche d'Identité */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E9DCD5] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#EDE9E6]">
                <Package className="w-4 h-4 text-[#ba4e1a]" />
                <h2 className="font-serif font-bold text-base text-[#1F2937]">
                  Fiche d&apos;Identité de la Pièce
                </h2>
              </div>

              {/* Nom Français */}
              <div>
                <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                  Nom de la pièce (Français) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Tapis Beni Ourain 'Atlas Royal'"
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
                  placeholder="مثال: زربية بني ورين الملكية من صوف الأطلس"
                  className="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] font-arabic font-medium transition"
                />
              </div>

              {/* Collection / Catégorie */}
              <div>
                <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                  Collection &amp; Métier d&apos;Art *
                </label>
                <CustomSelect
                  value={categorySlug}
                  onChange={(val) => setCategorySlug(val)}
                  options={categoryOptions}
                  icon={Layers}
                  triggerClassName="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl text-xs py-2.5 text-[#1F2937]"
                />
              </div>

              {/* Artisan & Ville */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                    Maâlem / Artisan / Coopérative
                  </label>
                  <input
                    type="text"
                    value={artisanName}
                    onChange={(e) => setArtisanName(e.target.value)}
                    placeholder="Ex: Coopérative Tithrit"
                    className="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] transition"
                  />
                </div>
                <div>
                  <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                    Ville ou Région d&apos;Origine
                  </label>
                  <input
                    type="text"
                    value={artisanCity}
                    onChange={(e) => setArtisanCity(e.target.value)}
                    placeholder="Ex: Fès Médina, Marrakech, Taza..."
                    className="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] transition"
                  />
                </div>
              </div>

              {/* Dimensions & Matières */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                    Matière noble
                  </label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Ex: 100% Pure Laine d'agneau"
                    className="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] transition"
                  />
                </div>
                <div>
                  <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                    Dimensions de la pièce
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="Ex: 250 cm x 160 cm"
                    className="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] transition"
                  />
                </div>
              </div>

              {/* Récit & Savoir-Faire */}
              <div>
                <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                  Récit artisanal &amp; Histoire de la création *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez l'origine, les symboles géométriques, les heures de travail nécessaires à sa réalisation..."
                  className="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] transition leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* Card 2: Visuels Additionnels */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E9DCD5] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE9E6]">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#ba4e1a]" />
                  <h2 className="font-serif font-bold text-base text-[#1F2937]">
                    Galerie d&apos;Ambiance (Photos Secondaires)
                  </h2>
                </div>
                <span className="text-[10px] text-[#6B7280]">
                  Max 3 photos additionnelles
                </span>
              </div>

              {/* Add image input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAddImageUrl}
                  onChange={(e) => setNewAddImageUrl(e.target.value)}
                  placeholder="https://... ou /images/products/..."
                  className="flex-1 bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e]"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  disabled={!newAddImageUrl.trim() || additionalImages.length >= 3}
                  className="px-4 py-2.5 bg-[#6d381e] hover:bg-[#542a15] text-white rounded-xl text-xs font-bold transition disabled:opacity-40 cursor-pointer"
                >
                  Ajouter
                </button>
              </div>

              {/* Thumbnails */}
              {additionalImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {additionalImages.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-2xl overflow-hidden border border-[#E9DCD5] group bg-[#FAF6F4]"
                    >
                      <Image src={imgUrl} alt="Vue additionnelle" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveAddImage(i)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition cursor-pointer"
                        title="Supprimer la photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Tarification, Stock & Live Preview (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 3: Prix & Stock */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E9DCD5] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#EDE9E6]">
                <Tag className="w-4 h-4 text-[#ba4e1a]" />
                <h2 className="font-serif font-bold text-base text-[#1F2937]">
                  Tarification &amp; Stock Atelier
                </h2>
              </div>

              {/* Prix en DH */}
              <div>
                <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                  Prix de Vente (DH) *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] font-bold outline-none focus:border-[#6d381e]"
                  />
                  <span className="absolute right-4 text-xs font-bold text-[#ba4e1a]">
                    DH (TTC)
                  </span>
                </div>
              </div>

              {/* Promo Switch */}
              <div className="pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasPromo}
                    onChange={(e) => setHasPromo(e.target.checked)}
                    className="w-4 h-4 rounded text-[#6d381e] focus:ring-[#6d381e] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#1F2937]">
                    Appliquer un prix barré (Promotion atelier)
                  </span>
                </label>

                {hasPromo && (
                  <div className="mt-3">
                    <label className="block font-bold text-xs text-[#6B7280] mb-1">
                      Ancien Prix Barré (DH)
                    </label>
                    <input
                      type="number"
                      min={price}
                      value={oldPrice}
                      onChange={(e) => setOldPrice(Number(e.target.value))}
                      className="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl px-4 py-2 text-xs text-[#1F2937] outline-none focus:border-[#6d381e]"
                    />
                  </div>
                )}
              </div>

              {/* Stock */}
              <div className="pt-2 border-t border-[#EDE9E6]">
                <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                  Stock disponible en atelier *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] font-bold outline-none focus:border-[#6d381e]"
                />
                <span className="text-[10.5px] text-[#6B7280] mt-1 block">
                  {stock === 0 ? (
                    <span className="text-red-600 font-bold">⚠️ Pièce marquée en rupture</span>
                  ) : stock <= 4 ? (
                    <span className="text-amber-600 font-bold">⚠️ Stock faible (Alerte activée)</span>
                  ) : (
                    <span className="text-emerald-600 font-bold">✓ Stock optimal</span>
                  )}
                </span>
              </div>

              {/* Photo Principale Studio */}
              <div className="pt-2 border-t border-[#EDE9E6]">
                <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                  Photo Principale (Studio) *
                </label>
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/products/prod-tapis.jpg ou lien web"
                  className="w-full bg-[#FAF6F4] border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] font-mono text-[11px] outline-none focus:border-[#6d381e]"
                />
              </div>
            </div>

            {/* Card 4: LIVE PREVIEW DU CATALOGUE */}
            <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#E9DCD5] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E9DCD5]/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#6d381e]">
                  <Sparkles className="w-4 h-4 text-[#ba4e1a]" />
                  <span>Aperçu de la Carte Catalogue</span>
                </div>
                <span className="text-[10px] font-bold text-[#ba4e1a] bg-[#ba4e1a]/10 px-2 py-0.5 rounded-full">
                  Rendu Client
                </span>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden border border-[#EDE9E6] shadow-sm flex flex-col justify-between">
                {/* Image */}
                <div className="relative aspect-square w-full bg-[#FAF6F4] overflow-hidden">
                  <Image
                    src={image || "/images/products/prod-tapis.jpg"}
                    alt={name || "Aperçu"}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#6d381e] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
                    Fait Main
                  </span>
                  {hasPromo && oldPrice > price && (
                    <span className="absolute top-3 right-3 bg-[#ba4e1a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                      -{Math.round(((oldPrice - price) / oldPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#ba4e1a] tracking-wider block">
                    {selectedCategoryName}
                  </span>
                  <p className="font-serif font-bold text-sm text-[#1F2937] line-clamp-1">
                    {name || "Nom de la création"}
                  </p>
                  {nameAr && (
                    <p className="text-xs text-[#6B7280] font-arabic line-clamp-1" dir="rtl">
                      {nameAr}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-[#EDE9E6]">
                    <div>
                      <span className="text-base font-extrabold text-[#6d381e]">
                        {price} DH
                      </span>
                      {hasPromo && oldPrice > price && (
                        <span className="text-xs text-neutral-400 line-through ml-2">
                          {oldPrice} DH
                        </span>
                      )}
                    </div>
                    <span className="text-[10.5px] text-[#6B7280]">
                      {artisanCity || "Maroc"}
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
