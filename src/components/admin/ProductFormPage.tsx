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
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types/product";
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

  // Live Boutique preview product model
  const previewProduct: Product = useMemo(() => {
    const discountPercent =
      hasPromo && oldPrice > price
        ? Math.round(((oldPrice - price) / oldPrice) * 100)
        : undefined;

    return {
      id: productId || "preview-nouvelle-creation",
      slug: name ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "creation-artisanale",
      name: name.trim() || "Nom de la Création d'Artisanat",
      nameAr: nameAr.trim() || undefined,
      category: selectedCategoryName,
      categorySlug: categorySlug,
      price: Number(price) || 0,
      originalPrice: hasPromo ? Number(oldPrice) : undefined,
      discountPercent,
      rating: 5.0,
      reviewCount: 1,
      inStock: Number(stock) > 0,
      stockCount: Number(stock) || 0,
      isFeatured: true,
      isBestSeller: false,
      images: [image.trim() || "/images/products/prod-tapis.jpg", ...additionalImages],
      description: description.trim() || "Pièce d'artisanat marocain d'exception confectionnée à la main par nos maîtres artisans.",
      shortDescription: description.trim() || "Création artisanale marocaine authentique.",
      artisan: {
        name: artisanName.trim() || "Maâlem Artisan Marjad",
        city: artisanCity.trim() || "Marrakech Médina",
        craft: selectedCategoryName,
      },
      details: {
        material: material.trim() || "Matières nobles marocaines",
        dimensions: dimensions.trim() || "Dimensions sur mesure",
        origin: artisanCity.trim() || "Maroc",
      },
      tags: [selectedCategoryName, "Artisanat", "Fait Main"],
    };
  }, [
    productId,
    name,
    nameAr,
    selectedCategoryName,
    categorySlug,
    price,
    hasPromo,
    oldPrice,
    stock,
    image,
    additionalImages,
    description,
    artisanName,
    artisanCity,
    material,
    dimensions,
  ]);

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
      {/* Top Header without the return link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9DCD5]">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2937]">
            {mode === "create" ? "Ajouter une Création d'Atelier" : "Modifier la Pièce d'Artisanat"}
          </h1>
          <p className="text-xs text-[#6B7280]">
            Renseignez les détails authentiques de la pièce. La carte client à droite se met à jour en temps réel.
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

      {/* Main Form Body: Left Single Card Form + Right Live Boutique Preview */}
      <form id="product-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LA PARTIE LEFT: Tout rassemblé dans UN SEUL DIV (Unified Single Card) */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E9DCD5] shadow-xs space-y-6">
            {/* Section 1: Informations Générales & Identité */}
            <div className="space-y-4">
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
            </div>

            {/* Section 2: Tarification & Stock Atelier */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-3 border-b border-[#EDE9E6]">
                <Tag className="w-4 h-4 text-[#ba4e1a]" />
                <h2 className="font-serif font-bold text-base text-[#1F2937]">
                  Tarification &amp; Stock Atelier
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Prix de Vente */}
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

                {/* Stock disponible */}
                <div>
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
                  <span className="text-[10px] text-[#6B7280] mt-1 block">
                    {stock === 0 ? (
                      <span className="text-red-600 font-bold">⚠️ Pièce en rupture</span>
                    ) : stock <= 4 ? (
                      <span className="text-amber-600 font-bold">⚠️ Stock faible (Alerte activée)</span>
                    ) : (
                      <span className="text-emerald-600 font-bold">✓ Stock optimal</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Promo Switch */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E9DCD5]/80 space-y-3">
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
                  <div>
                    <label className="block font-bold text-xs text-[#6B7280] mb-1">
                      Ancien Prix Barré (DH)
                    </label>
                    <input
                      type="number"
                      min={price}
                      value={oldPrice}
                      onChange={(e) => setOldPrice(Number(e.target.value))}
                      placeholder="Ex: 2400"
                      className="w-full bg-white border border-[#E9DCD5] rounded-xl px-4 py-2 text-xs text-[#1F2937] font-bold outline-none focus:border-[#6d381e]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Visuels & Galerie */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE9E6]">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#ba4e1a]" />
                  <h2 className="font-serif font-bold text-base text-[#1F2937]">
                    Visuels &amp; Galerie Studio
                  </h2>
                </div>
                <span className="text-[10.5px] text-[#6B7280]">
                  Photo principale + max 3 photos
                </span>
              </div>

              {/* Photo Principale Studio */}
              <div>
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

              {/* Photos Additionnelles */}
              <div className="space-y-2 pt-1">
                <label className="block font-bold text-xs text-[#1F2937]">
                  Photos Secondaires d&apos;Ambiance (Optionnel)
                </label>
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

                {additionalImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {additionalImages.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-2xl overflow-hidden border border-[#E9DCD5] group bg-white flex items-center justify-center p-1.5 shadow-2xs"
                      >
                        <Image src={imgUrl} alt="Vue additionnelle" fill className="object-contain p-1" sizes="100px" />
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

            {/* Section 4: Artisanat & Fiche Technique */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-3 border-b border-[#EDE9E6]">
                <Info className="w-4 h-4 text-[#ba4e1a]" />
                <h2 className="font-serif font-bold text-base text-[#1F2937]">
                  Artisanat, Dimensions &amp; Récit
                </h2>
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

            {/* Bottom Submit Row inside the card */}
            <div className="pt-4 border-t border-[#EDE9E6] flex items-center justify-end gap-3">
              <Link
                href="/admin/produits"
                className="px-5 py-2.5 rounded-full border border-[#E9DCD5] text-xs font-bold text-[#6B7280] hover:bg-stone-50 transition cursor-pointer"
              >
                Annuler
              </Link>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#6d381e] hover:bg-[#542a15] text-white text-xs font-bold px-7 py-2.5 rounded-full shadow-[0_4px_14px_rgba(109,56,30,0.22)] transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{savedSuccess ? "Enregistré avec succès !" : mode === "create" ? "Enregistrer la création" : "Mettre à jour la pièce"}</span>
              </button>
            </div>
          </div>

          {/* LA PARTIE RIGHT: Exact Boutique Product Card Preview with Animations */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#6d381e]">
                <Sparkles className="w-4 h-4 text-[#ba4e1a]" />
                <span>Aperçu Boutique (Rendu Client en Direct)</span>
              </div>
              <span className="text-[10px] font-bold text-[#ba4e1a] bg-[#ba4e1a]/10 px-2.5 py-0.5 rounded-full">
                Interactive
              </span>
            </div>

            {/* Exact Boutique Product Card with tilt, hover salon room, badge, size */}
            <div
              className="w-full max-w-[340px] mx-auto select-none"
              onClick={(e) => {
                // Prevent navigation when clicking card in admin preview
                const target = e.target as HTMLElement;
                if (target.closest("a") || target.closest("button")) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <ProductCard product={previewProduct} variant="grid" />
            </div>

            <p className="text-[11px] text-[#6B7280] text-center italic">
              Survolez la carte pour tester l&apos;animation d&apos;ambiance salon et l&apos;effet 3D.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
