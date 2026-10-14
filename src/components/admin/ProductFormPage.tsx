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
  Plus,
  Sparkles,
  Ruler,
  Palette,
  Check,
} from "lucide-react";

export interface ImageVariantItem {
  id: string;
  url: string; // Base64 dataURL or public URL
  dimensions: string; // Dimensions spécifiques à cette pièce/photo (commence vide)
  colorName: string; // Nom de la nuance combinée (ex: "Noir Mat & Doré")
  colorHex: string; // Couleur dominante de la calligraphie/motif
  bgHex: string; // Moitié gauche: Couleur du support / fond
  accentHex: string; // Moitié droite: Couleur de la calligraphie / écriture
  bgGradient?: string;
  isPrimary?: boolean;
}

interface ProductFormPageProps {
  mode: "create" | "edit";
  productId?: string | number;
}

// Fonction de détection automatique des 2 couleurs (Fond gauche + Calligraphie/Écriture droite)
const detectProductDualColors = (
  imageSrc: string
): Promise<{
  id: string;
  name: string;
  hex: string;
  bgHex: string;
  accentHex: string;
  bgGradient: string;
  textColor: string;
}> => {
  return new Promise((resolve) => {
    if (!imageSrc || typeof window === "undefined") {
      return resolve({
        id: "noir-dore",
        name: "Noir Mat & Doré",
        hex: "#D4AF37",
        bgHex: "#1C1917",
        accentHex: "#D4AF37",
        bgGradient: "linear-gradient(90deg, #1C1917 50%, #D4AF37 50%)",
        textColor: "text-[#D4AF37]",
      });
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const w = 64;
        const h = 64;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("no context");

        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h).data;

        // Échantillonnage des 4 coins pour identifier le fond blanc studio
        const cornerIndices = [0, (w - 1) * 4, ((h - 1) * w) * 4, ((h - 1) * w + (w - 1)) * 4];
        let studioR = 0, studioG = 0, studioB = 0;
        cornerIndices.forEach((idx) => {
          studioR += imgData[idx];
          studioG += imgData[idx + 1];
          studioB += imgData[idx + 2];
        });
        studioR /= 4;
        studioG /= 4;
        studioB /= 4;
        const isWhiteStudio = studioR > 215 && studioG > 215 && studioB > 215;

        type PixelInfo = { r: number; g: number; b: number; brightness: number };
        const productPixels: PixelInfo[] = [];

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          if (a < 100) continue;
          if (isWhiteStudio && r > 232 && g > 232 && b > 232) continue;
          const distToStudio = Math.sqrt((r - studioR) ** 2 + (g - studioG) ** 2 + (b - studioB) ** 2);
          if (distToStudio < 22) continue;

          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          productPixels.push({ r, g, b, brightness });
        }

        if (productPixels.length === 0) {
          return resolve({
            id: "noir-dore",
            name: "Noir Mat & Doré",
            hex: "#D4AF37",
            bgHex: "#1C1917",
            accentHex: "#D4AF37",
            bgGradient: "linear-gradient(90deg, #1C1917 50%, #D4AF37 50%)",
            textColor: "text-[#D4AF37]",
          });
        }

        let darkR = 0, darkG = 0, darkB = 0, darkCount = 0;
        let brightR = 0, brightG = 0, brightB = 0, brightCount = 0;
        let goldR = 0, goldG = 0, goldB = 0, goldCount = 0;

        for (const p of productPixels) {
          if (p.r > 130 && p.g > 95 && p.b < 120 && p.r > p.b + 25) {
            goldR += p.r;
            goldG += p.g;
            goldB += p.b;
            goldCount++;
          }
          if (p.brightness < 85) {
            darkR += p.r;
            darkG += p.g;
            darkB += p.b;
            darkCount++;
          } else if (p.brightness > 130) {
            brightR += p.r;
            brightG += p.g;
            brightB += p.b;
            brightCount++;
          }
        }

        const toHex = (r: number, g: number, b: number) =>
          `#${((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b))
            .toString(16)
            .slice(1)
            .toUpperCase()}`;

        let detectedBgHex = "#1C1917";
        let detectedAccentHex = "#D4AF37";
        let baseName = "Noir Mat";
        let accentName = "Doré";

        // Détection de la couleur du fond / support (gauche)
        if (darkCount > productPixels.length * 0.25) {
          const avgR = darkR / darkCount;
          const avgG = darkG / darkCount;
          const avgB = darkB / darkCount;
          if (avgR > 65 && avgG > 40 && avgB < 50 && avgR > avgB) {
            detectedBgHex = toHex(avgR, avgG, avgB);
            baseName = "Noyer Marron";
          } else {
            detectedBgHex = toHex(Math.min(30, avgR), Math.min(30, avgG), Math.min(30, avgB));
            baseName = "Noir Mat";
          }
        } else {
          const nonGold = productPixels.filter(
            (p) => !(p.r > 130 && p.g > 95 && p.b < 120 && p.r > p.b + 25)
          );
          if (nonGold.length > 0) {
            let sumR = 0, sumG = 0, sumB = 0;
            nonGold.forEach((p) => {
              sumR += p.r;
              sumG += p.g;
              sumB += p.b;
            });
            detectedBgHex = toHex(sumR / nonGold.length, sumG / nonGold.length, sumB / nonGold.length);
            baseName = "Blanc Épuré";
          }
        }

        // Détection de la couleur de la calligraphie / écriture (droite)
        if (goldCount > 0) {
          detectedAccentHex = toHex(goldR / goldCount, goldG / goldCount, goldB / goldCount);
          accentName = "Doré (Or 24k)";
        } else if (brightCount > 0 && darkCount > productPixels.length * 0.3) {
          const avgR = brightR / brightCount;
          const avgG = brightG / brightCount;
          const avgB = brightB / brightCount;
          detectedAccentHex = toHex(avgR, avgG, avgB);
          accentName = "Argenté Miroir";
        } else {
          detectedAccentHex = "#D4AF37";
          accentName = "Doré";
        }

        const fullName = `${baseName} & ${accentName}`;

        resolve({
          id: `var-${detectedBgHex.replace("#", "")}-${detectedAccentHex.replace("#", "")}`.toLowerCase(),
          name: fullName,
          hex: detectedAccentHex,
          bgHex: detectedBgHex,
          accentHex: detectedAccentHex,
          bgGradient: `linear-gradient(90deg, ${detectedBgHex} 50%, ${detectedAccentHex} 50%)`,
          textColor: "text-[#D4AF37]",
        });
      } catch {
        resolve({
          id: "noir-dore",
          name: "Noir Mat & Doré",
          hex: "#D4AF37",
          bgHex: "#1C1917",
          accentHex: "#D4AF37",
          bgGradient: "linear-gradient(90deg, #1C1917 50%, #D4AF37 50%)",
          textColor: "text-[#D4AF37]",
        });
      }
    };
    img.onerror = () => {
      resolve({
        id: "noir-dore",
        name: "Noir Mat & Doré",
        hex: "#D4AF37",
        bgHex: "#1C1917",
        accentHex: "#D4AF37",
        bgGradient: "linear-gradient(90deg, #1C1917 50%, #D4AF37 50%)",
        textColor: "text-[#D4AF37]",
      });
    };
    img.src = imageSrc;
  });
};

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
  const [dimensionsList, setDimensionsList] = useState<string[]>([""]);
  const [detectedColors, setDetectedColors] = useState<
    Array<{ id: string; name: string; hex: string; bgGradient?: string; textColor?: string }>
  >([]);
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

  // Images & Variantes
  const [image, setImage] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [imageVariants, setImageVariants] = useState<ImageVariantItem[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
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
          if (Array.isArray(draft.imageVariants) && draft.imageVariants.length > 0) {
            const mapped: ImageVariantItem[] = draft.imageVariants.map((v: any, idx: number) => ({
              id: v.id || `var-${idx}`,
              url: v.url,
              dimensions: v.dimensions || "",
              colorName: v.colorName || "Finition",
              colorHex: v.colorHex || "#D4AF37",
              bgHex: v.bgHex || "#1C1917",
              accentHex: v.accentHex || v.colorHex || "#D4AF37",
              bgGradient: `linear-gradient(90deg, ${v.bgHex || "#1C1917"} 50%, ${v.accentHex || v.colorHex || "#D4AF37"} 50%)`,
              isPrimary: v.isPrimary ?? idx === 0,
            }));
            setImageVariants(mapped);
          }
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

        // Variantes d'images avec détection de couleur & dimensions
        if (p.imageVariants && Array.isArray(p.imageVariants) && p.imageVariants.length > 0) {
          const mapped: ImageVariantItem[] = p.imageVariants.map((v, idx) => ({
            id: v.id || `var-${idx}`,
            url: v.url,
            dimensions: v.dimensions || p.dimensions || "",
            colorName: v.colorName || "Finition",
            colorHex: v.colorHex || "#D4AF37",
            bgHex: v.bgHex || "#1C1917",
            accentHex: v.accentHex || v.colorHex || "#D4AF37",
            bgGradient: `linear-gradient(90deg, ${v.bgHex || "#1C1917"} 50%, ${v.accentHex || v.colorHex || "#D4AF37"} 50%)`,
            isPrimary: idx === 0,
          }));
          setImageVariants(mapped);
        } else if (p.colors && Array.isArray(p.colors) && p.colors.length > 0) {
          const mapped: ImageVariantItem[] = p.colors.map((c, idx) => ({
            id: c.id || `var-${idx}`,
            url: c.imageUrl || p.images?.[c.imageIndex ?? idx] || p.image || "/decor-honeycomb-calligraphy.webp",
            dimensions: c.dimensions || p.dimensions || "",
            colorName: c.name || "Finition",
            colorHex: c.hex || "#D4AF37",
            bgHex: c.bgHex || (c.id === "noir-or" ? "#1C1917" : c.id === "argente" ? "#1C1917" : "#3E2723"),
            accentHex: c.accentHex || c.hex || "#D4AF37",
            bgGradient: `linear-gradient(90deg, ${c.bgHex || "#1C1917"} 50%, ${c.accentHex || c.hex || "#D4AF37"} 50%)`,
            isPrimary: idx === 0,
          }));
          setImageVariants(mapped);
        } else if (p.image || (p.images && p.images.length > 0)) {
          const allImgs = [p.image, ...(p.images || [])].filter(
            (img, i, arr): img is string => Boolean(img) && arr.indexOf(img) === i
          );
          const mapped: ImageVariantItem[] = allImgs.map((url, idx) => ({
            id: `var-${idx}`,
            url,
            dimensions: p.dimensions || "",
            colorName: idx === 0 ? "Finition Principale" : `Variante ${idx + 1}`,
            colorHex: idx === 0 ? "#D4AF37" : "#1C1917",
            bgHex: idx === 0 ? "#3E2723" : "#1C1917",
            accentHex: idx === 0 ? "#D4AF37" : "#D1D5DB",
            bgGradient: `linear-gradient(90deg, ${idx === 0 ? "#3E2723" : "#1C1917"} 50%, ${idx === 0 ? "#D4AF37" : "#D1D5DB"} 50%)`,
            isPrimary: idx === 0,
          }));
          setImageVariants(mapped);
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
      imageVariants,
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

  // Traitement direct de l'import des fichiers images avec analyse automatique de couleur (fond + calligraphie)
  const processImageFiles = async (files: FileList | File[]) => {
    const fileArr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileArr.length === 0) return;

    setIsProcessingImages(true);
    try {
      const newItems: ImageVariantItem[] = [];

      for (let i = 0; i < fileArr.length; i++) {
        const file = fileArr[i];
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Détection chromatique bicolore (fond gauche + calligraphie droite)
        const detected = await detectProductDualColors(dataUrl);

        newItems.push({
          id: `var-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          url: dataUrl,
          dimensions: "", // Commence vide comme demandé pour que l'utilisateur saisisse les dimensions
          colorName: detected.name,
          colorHex: detected.hex,
          bgHex: detected.bgHex,
          accentHex: detected.accentHex,
          bgGradient: detected.bgGradient,
          isPrimary: imageVariants.length === 0 && i === 0,
        });
      }

      setImageVariants((prev) => {
        const next = [...prev, ...newItems];
        if (!next.some((v) => v.isPrimary) && next.length > 0) {
          next[0].isPrimary = true;
        }
        return next;
      });

      if (newItems.length > 0 && (!image || imageVariants.length === 0)) {
        setImage(newItems[0].url);
      }
    } catch (err) {
      console.error("Erreur lors de l'import des images :", err);
    } finally {
      setIsProcessingImages(false);
    }
  };

  // Modifier les dimensions d'une variante spécifique
  const handleUpdateVariantDimensions = (id: string, newDim: string) => {
    setImageVariants((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          if (v.isPrimary) {
            setDimensions(newDim);
          }
          return { ...v, dimensions: newDim };
        }
        return v;
      })
    );
  };

  // Modifier le nom de la couleur d'une variante
  const handleUpdateVariantColorName = (id: string, newName: string) => {
    setImageVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, colorName: newName } : v))
    );
  };

  // Modifier la couleur du fond (gauche)
  const handleUpdateVariantBgHex = (id: string, newBgHex: string) => {
    setImageVariants((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const bg = newBgHex;
          const accent = v.accentHex || v.colorHex;
          return {
            ...v,
            bgHex: bg,
            bgGradient: `linear-gradient(90deg, ${bg} 50%, ${accent} 50%)`,
          };
        }
        return v;
      })
    );
  };

  // Modifier la couleur de la calligraphie (droite)
  const handleUpdateVariantAccentHex = (id: string, newAccentHex: string) => {
    setImageVariants((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const bg = v.bgHex || "#1C1917";
          const accent = newAccentHex;
          return {
            ...v,
            accentHex: accent,
            colorHex: accent,
            bgGradient: `linear-gradient(90deg, ${bg} 50%, ${accent} 50%)`,
          };
        }
        return v;
      })
    );
  };

  // Supprimer une variante
  const handleRemoveVariant = (id: string) => {
    setImageVariants((prev) => {
      const filtered = prev.filter((v) => v.id !== id);
      if (filtered.length > 0 && !filtered.some((v) => v.isPrimary)) {
        filtered[0].isPrimary = true;
        setImage(filtered[0].url);
        if (filtered[0].dimensions) setDimensions(filtered[0].dimensions);
      } else if (filtered.length === 0) {
        setImage("");
      }
      return filtered;
    });
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

    const primaryVar = imageVariants.find((v) => v.isPrimary) || imageVariants[0];
    const mainImg = primaryVar?.url || image.trim();
    const imgs =
      imageVariants.length > 0
        ? [primaryVar?.url || imageVariants[0].url, ...imageVariants.filter((v) => v !== primaryVar).map((v) => v.url)]
        : mainImg
        ? [mainImg, ...additionalImages]
        : additionalImages.length > 0
        ? additionalImages
        : [];

    const dynamicColors =
      imageVariants.length > 0
        ? imageVariants.map((v, idx) => ({
            id: v.id,
            name: v.colorName,
            hex: v.accentHex || v.colorHex,
            bgHex: v.bgHex || "#1C1917",
            accentHex: v.accentHex || v.colorHex || "#D4AF37",
            dimensions: v.dimensions,
            imageIndex: idx,
            imageUrl: v.url,
            bgGradient: v.bgGradient || `linear-gradient(90deg, ${v.bgHex || "#1C1917"} 50%, ${v.accentHex || v.colorHex || "#D4AF37"} 50%)`,
          }))
        : undefined;

    const currentDims = primaryVar?.dimensions || dimensions.trim() || "";

    return {
      id: productId || "preview-nouvelle-creation",
      slug: name ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "creation-artisanale",
      name: name.trim(),
      nameAr: nameAr.trim() || undefined,
      category: selectedCategoryName.trim(),
      categorySlug: categorySlug || "",
      price: sellingPrice > 0 ? sellingPrice : 0,
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
      colors: dynamicColors,
      description: description.trim(),
      shortDescription: description.trim(),
      artisan: {
        name: "Maâlem Artisan Marjad",
        city: "Fès Médina",
        craft: selectedCategoryName || "Artisanat d'Art",
      },
      details: {
        material: material.trim(),
        dimensions: currentDims,
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
    imageVariants,
    additionalImages,
    description,
    material,
    dimensions,
    technique,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (imageVariants.length === 0 && !image.trim()) {
      alert("Veuillez importer au moins une photo pour cette création.");
      return;
    }

    const currentList = products.length > 0 ? products : INITIAL_ADMIN_PRODUCTS;
    const finalStock = typeof stock === "number" ? stock : Number(stock) || 0;
    const numCatalog = typeof catalogPrice === "number" ? catalogPrice : Number(catalogPrice) || 0;
    const numPromo = typeof promoPrice === "number" ? promoPrice : Number(promoPrice) || 0;

    const finalSellingPrice = hasPromo && numPromo > 0 ? numPromo : numCatalog;
    const finalOldPrice = hasPromo && numCatalog > finalSellingPrice ? numCatalog : undefined;

    const resolvedCategorySlug = categorySlug || categories[0]?.slug || "artisanat";
    const resolvedCategoryName = selectedCategoryName || categories[0]?.name || "Artisanat d'Art";
    const primaryVar = imageVariants.find((v) => v.isPrimary) || imageVariants[0];
    const resolvedImage = primaryVar?.url || image.trim() || "/decor-honeycomb-calligraphy.webp";
    const resolvedImages =
      imageVariants.length > 0
        ? [primaryVar?.url || imageVariants[0].url, ...imageVariants.filter((v) => v !== primaryVar).map((v) => v.url)]
        : [resolvedImage, ...additionalImages];

    const resolvedDimensions = primaryVar?.dimensions || dimensions.trim() || "75 cm × 28 cm";

    const resolvedColors =
      imageVariants.length > 0
        ? imageVariants.map((v, idx) => ({
            id: v.id,
            name: v.colorName,
            hex: v.accentHex || v.colorHex,
            bgHex: v.bgHex || "#1C1917",
            accentHex: v.accentHex || v.colorHex || "#D4AF37",
            dimensions: v.dimensions,
            imageIndex: idx,
            imageUrl: v.url,
            bgGradient: v.bgGradient || `linear-gradient(90deg, ${v.bgHex || "#1C1917"} 50%, ${v.accentHex || v.colorHex || "#D4AF37"} 50%)`,
          }))
        : undefined;

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
              dimensions: resolvedDimensions,
              finish: finish.trim(),
              technique: technique.trim(),
              isFeatured,
              isBestSeller,
              description: description.trim(),
              image: resolvedImage,
              images: resolvedImages,
              colors: resolvedColors,
              imageVariants: imageVariants.length > 0 ? imageVariants : undefined,
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
        images: resolvedImages,
        colors: resolvedColors,
        imageVariants: imageVariants.length > 0 ? imageVariants : undefined,
        shortDescription: description.trim().slice(0, 100),
        description: description.trim(),
        artisanName: "Maâlem Artisan Marjad",
        artisanCity: "Fès Médina",
        material: material.trim(),
        dimensions: resolvedDimensions,
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
                    className="w-4 h-4 rounded accent-[#6d381e] cursor-pointer"
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
                        className="w-4 h-4 rounded accent-[#6d381e] cursor-pointer"
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
                        className="w-4 h-4 rounded accent-[#6d381e] cursor-pointer"
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
                        className="w-4 h-4 rounded accent-[#6d381e] cursor-pointer"
                      />
                      <span className="text-xs text-[#1F2937] font-medium">
                        Badge &quot;Nouveauté&quot; (Création récente de l&apos;atelier)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Galerie Photos & Nuances */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE9E6]">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#ba4e1a]" />
                  <h2 className="font-serif font-bold text-base text-[#1F2937]">
                    Photos &amp; Nuances
                  </h2>
                </div>
              </div>

              {/* Zone d'importation Drag & Drop (Aucune saisie manuelle d'URL) */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    processImageFiles(e.dataTransfer.files);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-7 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                  isDragOver
                    ? "border-[#ba4e1a] bg-[#ba4e1a]/5 scale-[1.01]"
                    : "border-[#E9DCD5] hover:border-[#ba4e1a]/70 hover:bg-[#FAF7F2]/60 bg-[#FAF7F2]/30"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      processImageFiles(e.target.files);
                      e.target.value = "";
                    }
                  }}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-white border border-[#E9DCD5] flex items-center justify-center text-[#ba4e1a] shadow-xs transition">
                  {isProcessingImages ? (
                    <Sparkles className="w-6 h-6 text-[#ba4e1a] animate-spin" />
                  ) : (
                    <UploadCloud className="w-6 h-6 text-[#ba4e1a]" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-[#1F2937]">
                    {isProcessingImages
                      ? "Extraction chromatique & analyse des pièces en cours..."
                      : "Cliquez pour importer ou glissez-déposez vos photos ici"}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    Glissez-déposez vos photos ici ou cliquez pour importer (PNG, JPG, WEBP).
                  </p>
                </div>
              </div>

              {/* Liste détaillée des Variantes & Photos importées */}
              {imageVariants.length > 0 && (
                <div className="space-y-3 pt-2">
                  <label className="block font-bold text-xs text-[#1F2937]">
                    Pièces et finitions importées ({imageVariants.length}) :
                  </label>

                  <div className="space-y-3">
                    {imageVariants.map((variant, index) => {
                      return (
                        <div
                          key={variant.id}
                          className="p-4 rounded-2xl border border-[#E9DCD5] shadow-2xs hover:border-stone-300 bg-white flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all"
                        >
                          {/* Miniature */}
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-[#E9DCD5] bg-stone-50 shrink-0 flex items-center justify-center">
                            <Image
                              src={variant.url}
                              alt={`Photo ${index + 1}`}
                              fill
                              className="object-contain p-1"
                              sizes="96px"
                            />
                          </div>

                          {/* Détails : 1. Couleur (Pastille + Fond + Calligraphie + Nom sur 1 ligne) + 2. Dimensions & Supprimer sur 1 ligne */}
                          <div className="flex-1 min-w-0 space-y-2.5 w-full">
                            {/* Ligne 1: Couleur (Pastille bicolore, sélecteurs Fond/Calligraphie et nom de la nuance sur la même ligne) */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[11px] font-bold text-[#6B7280] flex items-center gap-1 shrink-0">
                                <Palette className="w-3.5 h-3.5 text-[#ba4e1a]" />
                                Couleur :
                              </span>

                              {/* Pastille bicolore */}
                              <div
                                className="relative w-7 h-7 rounded-full border border-black/15 shadow-2xs overflow-hidden shrink-0"
                                style={{
                                  background: `linear-gradient(90deg, ${variant.bgHex || "#1C1917"} 50%, ${variant.accentHex || variant.colorHex || "#D4AF37"} 50%)`,
                                }}
                                title="Pastille bicolore : Fond à gauche, Calligraphie à droite"
                              />

                              {/* Deux sélecteurs de teintes (Fond / Calligraphie) */}
                              <div className="flex items-center gap-1 shrink-0">
                                <label
                                  className="flex items-center gap-1 bg-stone-50 border border-[#E9DCD5] px-2 py-1 rounded-lg cursor-pointer hover:bg-stone-100 transition shadow-2xs text-[10.5px]"
                                  title="Changer la couleur du fond (Moitié gauche)"
                                >
                                  <span className="text-[10px] font-semibold text-stone-700">Fond:</span>
                                  <span
                                    className="w-3 h-3 rounded-full border border-black/20"
                                    style={{ backgroundColor: variant.bgHex || "#1C1917" }}
                                  />
                                  <input
                                    type="color"
                                    value={variant.bgHex || "#1C1917"}
                                    onChange={(e) => handleUpdateVariantBgHex(variant.id, e.target.value)}
                                    className="hidden"
                                  />
                                </label>

                                <label
                                  className="flex items-center gap-1 bg-stone-50 border border-[#E9DCD5] px-2 py-1 rounded-lg cursor-pointer hover:bg-stone-100 transition shadow-2xs text-[10.5px]"
                                  title="Changer la couleur de la calligraphie (Moitié droite)"
                                >
                                  <span className="text-[10px] font-semibold text-stone-700">Calligraphie:</span>
                                  <span
                                    className="w-3 h-3 rounded-full border border-black/20"
                                    style={{ backgroundColor: variant.accentHex || variant.colorHex || "#D4AF37" }}
                                  />
                                  <input
                                    type="color"
                                    value={variant.accentHex || variant.colorHex || "#D4AF37"}
                                    onChange={(e) => handleUpdateVariantAccentHex(variant.id, e.target.value)}
                                    className="hidden"
                                  />
                                </label>
                              </div>

                              {/* Nom de la nuance sur la même ligne */}
                              <input
                                type="text"
                                value={variant.colorName}
                                onChange={(e) => handleUpdateVariantColorName(variant.id, e.target.value)}
                                placeholder="Nom de la nuance (ex: Blanc Épuré & Doré)"
                                className="flex-1 min-w-[140px] bg-white border border-[#E9DCD5] rounded-xl px-3 py-1 text-xs text-[#1F2937] font-semibold outline-none focus:border-[#6d381e] shadow-2xs"
                              />
                            </div>

                            {/* Ligne 2: Dimensions + Bouton Supprimer ensemble sur la même ligne */}
                            <div className="flex items-center gap-2 w-full">
                              <span className="text-[11px] font-bold text-[#6B7280] flex items-center gap-1 shrink-0">
                                <Ruler className="w-3.5 h-3.5 text-[#ba4e1a]" />
                                Dimensions :
                              </span>
                              <input
                                type="text"
                                required
                                value={variant.dimensions}
                                onChange={(e) => handleUpdateVariantDimensions(variant.id, e.target.value)}
                                placeholder="Ex: 80 cm × 50 cm ou Ø 45 cm"
                                className="flex-1 min-w-0 bg-white border border-[#E9DCD5] rounded-xl px-3 py-1 text-xs text-[#1F2937] font-semibold outline-none focus:border-[#6d381e] shadow-2xs"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveVariant(variant.id)}
                                className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                                title="Supprimer cette photo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Aperçu direct des pastilles bicolores dans Info Produit */}
                  <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E9DCD5] flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#ba4e1a]" />
                      <span className="text-xs font-bold text-[#1F2937]">
                        Pastilles bicolores dans la fiche produit (&quot;Info Produit&quot;) :
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {imageVariants.map((v) => (
                        <div
                          key={v.id}
                          className="group relative flex items-center"
                          title={`${v.colorName} - ${v.dimensions || "Dimensions non définies"}`}
                        >
                          <div
                            className="w-7 h-7 rounded-full border border-black/15 shadow-2xs transition-transform hover:scale-110 cursor-pointer overflow-hidden"
                            style={{
                              background: `linear-gradient(90deg, ${v.bgHex || "#1C1917"} 50%, ${v.accentHex || v.colorHex || "#D4AF37"} 50%)`,
                            }}
                          />
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-[#1c1917] text-white text-[10px] font-bold py-0.5 px-2 rounded whitespace-nowrap shadow-md z-30">
                            {v.colorName} {v.dimensions ? `(${v.dimensions})` : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
                    Dimensions globales / par défaut de la pièce
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="Ex: 250 cm x 160 cm, Diamètre 45 cm..."
                    className="w-full bg-white border border-[#E9DCD5] rounded-xl px-4 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#6d381e] transition shadow-2xs"
                  />
                  <span className="text-[10px] text-[#6B7280] mt-1 block">
                    {imageVariants.length > 0
                      ? "Synchronisé avec la photo principale. Vos pièces ci-dessus conservent leurs dimensions spécifiques."
                      : "Sert de dimension par défaut si aucune photo avec dimensions n'est importée."}
                  </span>
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
            {/* Aperçu direct sous la forme exacte de la carte produit boutique */}
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
