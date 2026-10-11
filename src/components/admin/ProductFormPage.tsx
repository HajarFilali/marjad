"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AdminProduct,
  AdminCategory,
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
  UploadCloud,
  Trash2,
  Save,
  Tag,
  Info,
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
  const searchParams = useSearchParams();
  const selectedCatFromQuery = searchParams.get("selectedCat");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [products, setProducts] = useState<AdminProduct[]>(INITIAL_ADMIN_PRODUCTS);
  const [categories, setCategories] = useState<AdminCategory[]>(INITIAL_ADMIN_CATEGORIES);

  // Form states - artisan is fixed to master artisan of the house (no input needed)
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [material, setMaterial] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [technique, setTechnique] = useState("");
  const [finish, setFinish] = useState("");
  const [description, setDescription] = useState("");

  // Pricing & Promotion states (matching exact screenshot UI & logic)
  const [catalogPrice, setCatalogPrice] = useState<number | "">("");
  const [hasPromo, setHasPromo] = useState(false);
  const [promoPrice, setPromoPrice] = useState<number | "">("");
  const [selectedDiscountPct, setSelectedDiscountPct] = useState<number | null>(null);

  // Stock & Badges
  const [stock, setStock] = useState<number | "">("");
  const [isFeatured, setIsFeatured] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);

  // Images
  const [image, setImage] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [newAddImageUrl, setNewAddImageUrl] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 1. Load products & categories from localStorage
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

  // 2. Restore draft if returning from category creation page
  useEffect(() => {
    try {
      const draftStr = localStorage.getItem("marjad_product_form_draft");
      if (draftStr) {
        const draft = JSON.parse(draftStr);
        if (draft) {
          if (draft.name !== undefined) setName(draft.name);
          if (draft.nameAr !== undefined) setNameAr(draft.nameAr);
          if (draft.material !== undefined) setMaterial(draft.material);
          if (draft.dimensions !== undefined) setDimensions(draft.dimensions);
          if (draft.technique !== undefined) setTechnique(draft.technique);
          if (draft.finish !== undefined) setFinish(draft.finish);
          if (draft.description !== undefined) setDescription(draft.description);
          if (draft.catalogPrice !== undefined) setCatalogPrice(draft.catalogPrice);
          if (draft.hasPromo !== undefined) setHasPromo(draft.hasPromo);
          if (draft.promoPrice !== undefined) setPromoPrice(draft.promoPrice);
          if (draft.selectedDiscountPct !== undefined) setSelectedDiscountPct(draft.selectedDiscountPct);
          if (draft.stock !== undefined) setStock(draft.stock);
          if (draft.isFeatured !== undefined) setIsFeatured(draft.isFeatured);
          if (draft.isBestSeller !== undefined) setIsBestSeller(draft.isBestSeller);
          if (draft.isNewArrival !== undefined) setIsNewArrival(draft.isNewArrival);
          if (draft.image !== undefined) setImage(draft.image);
          if (draft.additionalImages !== undefined) setAdditionalImages(draft.additionalImages);
          if (draft.categorySlug) setCategorySlug(draft.categorySlug);
        }
        localStorage.removeItem("marjad_product_form_draft");
        sessionStorage.removeItem("marjad_nav_from_product");
      }

      if (selectedCatFromQuery) {
        setCategorySlug(selectedCatFromQuery);
      }
    } catch {}
  }, [selectedCatFromQuery]);

  // 3. When in edit mode, load product data (if no draft was restored)
  useEffect(() => {
    if (mode === "edit" && productId) {
      const p = products.find((it) => String(it.id) === String(productId));
      if (p) {
        setName((prev) => (prev ? prev : p.name || ""));
        setNameAr((prev) => (prev ? prev : p.nameAr || ""));
        setCategorySlug((prev) => (prev ? prev : p.categorySlug || ""));
        setMaterial((prev) => (prev ? prev : p.material || ""));
        setDimensions((prev) => (prev ? prev : p.dimensions || ""));
        setTechnique((prev) => (prev ? prev : (p as any).technique || ""));
        setFinish((prev) => (prev ? prev : p.finish || ""));
        setDescription((prev) => (prev ? prev : p.description || p.shortDescription || ""));

        // Pricing restoration:
        if (catalogPrice === "" && promoPrice === "") {
          if (p.oldPrice && p.oldPrice > p.price) {
            setHasPromo(true);
            setCatalogPrice(p.oldPrice);
            setPromoPrice(p.price);
            const pct = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
            setSelectedDiscountPct(pct);
          } else {
            setHasPromo(false);
            setCatalogPrice(typeof p.price === "number" ? p.price : "");
            setPromoPrice("");
            setSelectedDiscountPct(null);
          }
        }

        if (stock === "") setStock(p.stock !== undefined ? p.stock : "");
        if (!image) setImage(p.image || "");
        if (additionalImages.length === 0) {
          setAdditionalImages(p.images?.filter((img) => img !== p.image) || []);
        }
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
    return categories.find((c) => c.slug === categorySlug)?.name || "";
  }, [categories, categorySlug]);

  // Navigate to category creation page, saving the product form state to draft
  const handleGoToAddCategory = () => {
    const draft = {
      name,
      nameAr,
      categorySlug,
      material,
      dimensions,
      technique,
      finish,
      description,
      catalogPrice,
      hasPromo,
      promoPrice,
      selectedDiscountPct,
      stock,
      isFeatured,
      isBestSeller,
      isNewArrival,
      image,
      additionalImages,
      mode,
      productId,
    };
    try {
      localStorage.setItem("marjad_product_form_draft", JSON.stringify(draft));
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "/admin/produits/new";
      sessionStorage.setItem("marjad_nav_from_product", currentPath);
    } catch {}

    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "/admin/produits/new";
    router.push(`/admin/categories/new?from=product&returnUrl=${encodeURIComponent(currentPath)}`);
  };

  // Handle Discount Remise Button Click (-10%, -15%, etc.)
  const applyDiscount = (pct: number) => {
    if (!hasPromo) return;
    const base = typeof catalogPrice === "number" ? catalogPrice : Number(catalogPrice) || 0;
    if (base > 0) {
      const calculated = Math.round(base * (1 - pct / 100));
      setPromoPrice(calculated);
      setSelectedDiscountPct(pct);
    }
  };

  // Handle Catalog Price change with reactive discount updating
  const handleCatalogPriceChange = (val: string) => {
    if (val === "") {
      setCatalogPrice("");
      if (hasPromo && selectedDiscountPct) {
        setPromoPrice("");
      }
      return;
    }
    const num = Number(val);
    setCatalogPrice(num);
    if (hasPromo && selectedDiscountPct) {
      setPromoPrice(Math.round(num * (1 - selectedDiscountPct / 100)));
    }
  };

  // Handle Promo Toggle
  const handleTogglePromo = (checked: boolean) => {
    setHasPromo(checked);
    if (checked) {
      const base = typeof catalogPrice === "number" ? catalogPrice : Number(catalogPrice) || 0;
      if (base > 0 && promoPrice === "") {
        const calculated = Math.round(base * 0.8);
        setPromoPrice(calculated);
        setSelectedDiscountPct(20);
      }
    } else {
      setPromoPrice("");
      setSelectedDiscountPct(null);
    }
  };

  // Handle adding secondary images
  const handleAddImage = () => {
    if (newAddImageUrl.trim() && additionalImages.length < 3) {
      setAdditionalImages([...additionalImages, newAddImageUrl.trim()]);
      setNewAddImageUrl("");
    }
  };

  const handleRemoveAddImage = (idx: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== idx));
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Live Boutique preview product model
  const previewProduct: Product = useMemo(() => {
    const numCatalog = typeof catalogPrice === "number" ? catalogPrice : Number(catalogPrice) || 0;
    const numPromo = typeof promoPrice === "number" ? promoPrice : Number(promoPrice) || 0;

    const sellingPrice = hasPromo && numPromo > 0 ? numPromo : numCatalog;
    const crossedPrice = hasPromo && numCatalog > sellingPrice ? numCatalog : undefined;
    const discountPercent =
      hasPromo && crossedPrice && crossedPrice > sellingPrice
        ? Math.round(((crossedPrice - sellingPrice) / crossedPrice) * 100)
        : undefined;

    const mainImg = image.trim();
    const imgs = mainImg
      ? [mainImg, ...additionalImages]
      : additionalImages.length > 0
      ? additionalImages
      : [];

    return {
      id: productId || "preview-nouvelle-creation",
      slug: name ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "creation-artisanale",
      name: name.trim(),
      nameAr: nameAr.trim() || undefined,
      category: selectedCategoryName || "",
      categorySlug: categorySlug || "",
      price: sellingPrice,
      originalPrice: crossedPrice,
      discountPercent,
      rating: 5.0,
      reviewCount: 0,
      inStock: stock === "" || Number(stock) > 0,
      stockCount: typeof stock === "number" ? stock : Number(stock) || 0,
      isFeatured: isFeatured,
      isBestSeller: isBestSeller,
      isNewArrival: isNewArrival,
      images: imgs,
      description: description.trim(),
      shortDescription: description.trim(),
      artisan: {
        name: "Maâlem Artisan Marjad",
        city: "Fès Médina",
        craft: selectedCategoryName || "",
      },
      details: {
        material: material.trim(),
        dimensions: dimensions.trim(),
        origin: "Fès, Maroc",
        technique: technique.trim(),
      },
      tags: selectedCategoryName ? [selectedCategoryName] : [],
    };
  }, [
    productId,
    name,
    nameAr,
    selectedCategoryName,
    categorySlug,
    catalogPrice,
    promoPrice,
    hasPromo,
    stock,
    isFeatured,
    isBestSeller,
    isNewArrival,
    image,
    additionalImages,
    description,
    material,
    dimensions,
    technique,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentList = products.length > 0 ? products : INITIAL_ADMIN_PRODUCTS;
    const finalStock = typeof stock === "number" ? stock : Number(stock) || 0;
    const numCatalog = typeof catalogPrice === "number" ? catalogPrice : Number(catalogPrice) || 0;
    const numPromo = typeof promoPrice === "number" ? promoPrice : Number(promoPrice) || 0;

    const finalSellingPrice = hasPromo && numPromo > 0 ? numPromo : numCatalog;
    const finalOldPrice = hasPromo && numCatalog > finalSellingPrice ? numCatalog : undefined;

    const resolvedCategorySlug = categorySlug || categories[0]?.slug || "artisanat";
    const resolvedCategoryName = selectedCategoryName || categories[0]?.name || "Artisanat d'Art";
    const resolvedImage = image.trim() || "/decor-honeycomb-calligraphy.webp";

    const stockStatus: "in_stock" | "low_stock" | "out_of_stock" =
      finalStock <= 0 ? "out_of_stock" : finalStock <= 4 ? "low_stock" : "in_stock";

    if (mode === "edit" && productId) {
      const updated = currentList.map((p) =>
        String(p.id) === String(productId)
          ? {
              ...p,
              name: name.trim(),
              nameAr: nameAr.trim() || undefined,
              categorySlug: resolvedCategorySlug,
              categoryName: resolvedCategoryName,
              price: finalSellingPrice,
              oldPrice: finalOldPrice,
              stock: finalStock,
              status: stockStatus,
              artisanName: "Maâlem Artisan Marjad",
              artisanCity: "Fès Médina",
              material: material.trim(),
              dimensions: dimensions.trim(),
              finish: finish.trim(),
              technique: technique.trim(),
              isFeatured,
              isBestSeller,
              description: description.trim(),
              image: resolvedImage,
              images: [resolvedImage, ...additionalImages],
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
      const newProduct: AdminProduct & { technique?: string } = {
        id: newId,
        name: name.trim(),
        nameAr: nameAr.trim() || undefined,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        categorySlug: resolvedCategorySlug,
        categoryName: resolvedCategoryName,
        price: finalSellingPrice,
        oldPrice: finalOldPrice,
        stock: finalStock,
        status: stockStatus,
        dateAdded: new Date().toISOString().split("T")[0],
        salesCount: 0,
        rating: 5.0,
        reviewsCount: 0,
        image: resolvedImage,
        images: [resolvedImage, ...additionalImages],
        shortDescription: description.trim().slice(0, 100),
        description: description.trim(),
        artisanName: "Maâlem Artisan Marjad",
        artisanCity: "Fès Médina",
        material: material.trim(),
        dimensions: dimensions.trim(),
        finish: finish.trim(),
        technique: technique.trim(),
        isFeatured,
        isBestSeller,
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
      {/* Top Header */}
      <div className="space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2937]">
          {mode === "create" ? "Ajouter une Création d'Atelier" : "Modifier la Pièce d'Artisanat"}
        </h1>
        <p className="text-xs text-[#6B7280]">
          Renseignez les détails authentiques de la pièce. La carte client à droite se met à jour en temps réel.
        </p>
      </div>

      {/* Main Form Body: Left Single Card Form + Right Live Boutique Preview */}
      <form id="product-form" onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* LA PARTIE LEFT: Le formulaire prend toute la largeur restante disponible */}
          <div className="flex-1 min-w-0 bg-white rounded-3xl p-6 sm:p-8 border border-[#E9DCD5] shadow-xs space-y-7">
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
                  placeholder="Ex: Tableau Ruche 'سبحان الله وبحمده' ou Tapis Beni Ourain"
                  className="w-full bg-white border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] font-medium transition shadow-2xs"
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
                  placeholder="مثال: لوحة خلية النحل 'سبحان الله وبحمده' المذهبة"
                  className="w-full bg-white border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] font-arabic font-medium transition shadow-2xs"
                />
              </div>

              {/* Catégorie: liste déroulante avec option '+ Ajouter une catégorie' à la fin */}
              <div className="space-y-1.5">
                <label className="block font-bold text-xs text-[#1F2937]">
                  Catégorie de la création *
                </label>
                <CustomSelect
                  value={categorySlug}
                  onChange={(val) => setCategorySlug(val)}
                  options={categoryOptions}
                  icon={Layers}
                  placeholder="Sélectionner une catégorie..."
                  actionOptionLabel="+ Ajouter une catégorie"
                  onActionOptionClick={handleGoToAddCategory}
                  triggerClassName="w-full bg-white border border-[#E9DCD5] rounded-xl text-xs py-2.5 text-[#1F2937]"
                />
              </div>
            </div>

            {/* Section 2: Tarification & Promotion (Exact Style matching the screenshot) */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE9E6]">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#ba4e1a]" />
                  <h2 className="font-serif font-bold text-base sm:text-lg text-[#1F2937]">
                    Tarification &amp; Promotion
                  </h2>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-xs font-bold text-[#1F2937]">
                    Activer une promotion
                  </span>
                  <input
                    type="checkbox"
                    checked={hasPromo}
                    onChange={(e) => handleTogglePromo(e.target.checked)}
                    className="w-4 h-4 rounded text-[#6d381e] focus:ring-[#6d381e] cursor-pointer"
                  />
                </label>
              </div>

              {/* Layout 2 colonnes comme sur la capture */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-1">
                {/* Colonne Gauche: Prix Catalogue Initial & Nouveau Prix Promotionnel */}
                <div className="space-y-4">
                  {/* Prix Catalogue Initial */}
                  <div className="space-y-1">
                    <label className="block font-bold text-xs text-[#1F2937]">
                      Prix Catalogue Initial (DH) *
                    </label>
                    <p className="text-[11px] text-[#6B7280]">
                      Le prix initial avant réduction (qui sera barré en boutique).
                    </p>
                    <div className="relative flex items-center pt-0.5">
                      <input
                        type="number"
                        required
                        min={1}
                        value={catalogPrice}
                        onChange={(e) => handleCatalogPriceChange(e.target.value)}
                        placeholder="Ex: 250"
                        className="w-full bg-white border border-[#E9DCD5] rounded-2xl px-4 py-2.5 text-sm text-[#1F2937] font-serif font-bold outline-none focus:border-[#6d381e] pr-12 transition shadow-2xs"
                      />
                      <span className="absolute right-4 text-xs font-bold text-[#6B7280]">
                        DH
                      </span>
                    </div>
                  </div>

                  {/* Nouveau Prix Promotionnel */}
                  <div className="space-y-1">
                    <label className="block font-bold text-xs text-[#1F2937]">
                      Nouveau Prix Promotionnel (DH) {hasPromo ? "*" : ""}
                    </label>
                    <p className="text-[11px] text-[#6B7280]">
                      {hasPromo
                        ? "Le prix de vente après réduction appliqué aux clients."
                        : "Désactivé (cochez l'option ci-dessus)."}
                    </p>
                    <div className="relative flex items-center pt-0.5">
                      <input
                        type="number"
                        disabled={!hasPromo}
                        required={hasPromo}
                        min={1}
                        value={hasPromo ? promoPrice : ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? "" : Number(e.target.value);
                          setPromoPrice(val);
                          setSelectedDiscountPct(null);
                        }}
                        placeholder={hasPromo ? "Ex: 200" : "Prix promo désactivé"}
                        className={`w-full border rounded-2xl px-4 py-2.5 text-sm font-serif font-bold outline-none pr-12 transition shadow-2xs ${
                          !hasPromo
                            ? "bg-stone-50 border-[#E9DCD5] text-stone-400 placeholder:text-stone-400 placeholder:font-serif placeholder:font-normal cursor-not-allowed"
                            : "bg-white border-[#E9DCD5] text-[#1F2937] focus:border-[#6d381e]"
                        }`}
                      />
                      <span
                        className={`absolute right-4 text-xs font-bold ${
                          !hasPromo ? "text-stone-300" : "text-[#ba4e1a]"
                        }`}
                      >
                        DH
                      </span>
                    </div>
                  </div>
                </div>

                {/* Colonne Droite: Remise rapide en 1 clic */}
                <div className="bg-[#FAF7F2]/40 rounded-2xl border border-[#E9DCD5] p-4 sm:p-5 space-y-3 shadow-2xs">
                  <h3 className="font-bold text-xs text-[#1F2937]">
                    Remise rapide en 1 clic :
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[-10, -15, -20, -25, -30, -35, -50, -60, -70].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        disabled={!hasPromo}
                        onClick={() => applyDiscount(Math.abs(pct))}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                          !hasPromo
                            ? "bg-stone-100 text-stone-300 border border-stone-200/50 cursor-not-allowed"
                            : selectedDiscountPct === Math.abs(pct)
                            ? "bg-[#6d381e] text-white border border-[#6d381e] shadow-xs scale-102"
                            : "bg-white hover:bg-[#6d381e]/10 text-stone-700 hover:text-[#6d381e] border border-[#E9DCD5] shadow-2xs cursor-pointer hover:scale-102"
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] italic text-[#6B7280]">
                    {!hasPromo
                      ? 'Cochez "Activer une promotion" pour utiliser les remises.'
                      : selectedDiscountPct
                      ? `Remise de -${selectedDiscountPct}% appliquée avec succès.`
                      : "Cliquez sur une remise pour calculer le prix promotionnel."}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Stock & Disponibilité Atelier */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-2 pb-3 border-b border-[#EDE9E6]">
                <Package className="w-4 h-4 text-[#ba4e1a]" />
                <h2 className="font-serif font-bold text-base text-[#1F2937]">
                  Stock &amp; Visibilité Atelier
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Ex: 6"
                    className="w-full bg-white border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] font-bold outline-none focus:border-[#6d381e] shadow-2xs"
                  />
                  <span className="text-[10px] text-[#6B7280] mt-1.5 block">
                    {stock === "" ? (
                      <span className="text-[#8c827a]">Indiquez la quantité disponible</span>
                    ) : Number(stock) === 0 ? (
                      <span className="text-red-600 font-bold">⚠️ Pièce en rupture de stock</span>
                    ) : Number(stock) <= 4 ? (
                      <span className="text-amber-600 font-bold">⚠️ Stock faible (Alerte activée)</span>
                    ) : (
                      <span className="text-emerald-600 font-bold">✓ Stock optimal ({stock} pièces disponibles)</span>
                    )}
                  </span>
                </div>

                {/* Badges de mise en avant */}
                <div>
                  <label className="block font-bold text-xs text-[#1F2937] mb-2">
                    Visibilité &amp; Distinctions en boutique
                  </label>
                  <div className="space-y-2 pt-0.5">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded text-[#6d381e] focus:ring-[#6d381e] cursor-pointer"
                      />
                      <span className="text-xs text-[#1F2937] font-medium">
                        Coup de Cœur Atelier (À la Une sur l&apos;accueil)
                      </span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isBestSeller}
                        onChange={(e) => setIsBestSeller(e.target.checked)}
                        className="w-4 h-4 rounded text-[#6d381e] focus:ring-[#6d381e] cursor-pointer"
                      />
                      <span className="text-xs text-[#1F2937] font-medium">
                        Badge &quot;Best-Seller&quot; (Pièce très convoitée)
                      </span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isNewArrival}
                        onChange={(e) => setIsNewArrival(e.target.checked)}
                        className="w-4 h-4 rounded text-[#6d381e] focus:ring-[#6d381e] cursor-pointer"
                      />
                      <span className="text-xs text-[#1F2937] font-medium">
                        Badge &quot;Nouveauté&quot; (Création récente de l&apos;atelier)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Visuels & Galerie Studio */}
            <div className="space-y-4 pt-1">
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Ex: /decor-honeycomb-calligraphy.webp ou https://..."
                    className="flex-1 bg-white border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] font-mono text-[11px] outline-none focus:border-[#6d381e] shadow-2xs"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl border border-[#E9DCD5] bg-white hover:bg-stone-50 text-xs font-bold text-[#6d381e] flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-2xs"
                    title="Choisir une photo depuis votre appareil"
                  >
                    <UploadCloud className="w-4 h-4 text-[#ba4e1a]" />
                    <span>Importer</span>
                  </button>
                </div>
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
                    className="flex-1 bg-white border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    disabled={!newAddImageUrl.trim() || additionalImages.length >= 3}
                    className="px-4 py-2.5 bg-[#6d381e] hover:bg-[#542a15] text-white rounded-xl text-xs font-bold transition disabled:opacity-40 cursor-pointer shadow-2xs"
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

            {/* Section 5: Matières, Dimensions & Fiche Technique (Artisan is fixed to master artisan) */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-2 pb-3 border-b border-[#EDE9E6]">
                <Info className="w-4 h-4 text-[#ba4e1a]" />
                <h2 className="font-serif font-bold text-base text-[#1F2937]">
                  Matières, Dimensions &amp; Fiche Technique
                </h2>
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
                    placeholder="Ex: 100% Pure Laine d'agneau, Cuivre ciselé..."
                    className="w-full bg-white border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] transition shadow-2xs"
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
                    placeholder="Ex: 250 cm x 160 cm, Diamètre 45 cm..."
                    className="w-full bg-white border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] transition shadow-2xs"
                  />
                </div>
              </div>

              {/* Technique & Finition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                    Technique artisanale
                  </label>
                  <input
                    type="text"
                    value={technique}
                    onChange={(e) => setTechnique(e.target.value)}
                    placeholder="Ex: Nœuds berbères faits main, Poinçonnage au maillet..."
                    className="w-full bg-white border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] transition shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-xs text-[#1F2937] mb-1.5">
                    Finition &amp; Traitement
                  </label>
                  <input
                    type="text"
                    value={finish}
                    onChange={(e) => setFinish(e.target.value)}
                    placeholder="Ex: Huile végétale satinée, Patine à l'ancienne..."
                    className="w-full bg-white border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] transition shadow-2xs"
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
                  className="w-full bg-white border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] transition leading-relaxed resize-none shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* LA PARTIE RIGHT: Exact Boutique Product Card Preview with Dimensions 1:1 + Sticky Actions */}
          <div className="w-full lg:w-[285px] shrink-0 lg:sticky lg:top-6 space-y-3">
            {/* Exact Boutique Product Card Dimensions (w-[285px]) */}
            <div
              className="w-[285px] mx-auto select-none"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest("a") || target.closest("button")) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <ProductCard product={previewProduct} variant="grid" disableLink={true} />
            </div>

            {/* Actions: Annuler & Mettre à jour la pièce / Enregistrer */}
            <div className="flex items-center gap-2 w-[285px] mx-auto pt-1">
              <Link
                href="/admin/produits"
                className="w-20 text-center py-2.5 rounded-full border border-[#E9DCD5] text-xs font-bold text-[#6B7280] hover:bg-stone-50 transition cursor-pointer shrink-0"
              >
                Annuler
              </Link>
              <button
                type="submit"
                form="product-form"
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#6d381e] hover:bg-[#542a15] text-white text-xs font-bold py-2.5 px-3 rounded-full shadow-[0_4px_14px_rgba(109,56,30,0.22)] transition-all hover:scale-[1.01] cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {savedSuccess
                    ? "Enregistré !"
                    : mode === "create"
                    ? "Enregistrer"
                    : "Mettre à jour la pièce"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
