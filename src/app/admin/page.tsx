"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Package,
  Layers,
  Video,
  ChevronRight,
  BarChart2,
  LineChart,
  Check,
  CheckCircle2,
  Bell,
  Star,
  MapPin,
  X,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Search,
  TrendingUp,
  Award,
  ShieldAlert,
  PackageX,
  AlertOctagon,
  BadgeAlert,
  Boxes,
  SlidersHorizontal,
  DollarSign,
  Users,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatCard } from "@/components/admin/StatCard";
import { CustomSelect } from "@/components/admin/CustomSelect";
import {
  INITIAL_ADMIN_PRODUCTS,
  INITIAL_ADMIN_ORDERS,
  INITIAL_ADMIN_REVIEWS,
  AdminProduct,
  AdminOrder,
} from "@/lib/adminData";

interface SiteNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "order" | "review" | "stock" | "video";
  href: string;
}

const DEFAULT_NOTIFICATIONS: SiteNotification[] = [
  {
    id: "notif-1",
    title: "Nouvelle commande confirmée",
    desc: "Lalla Fatima-Zahra Benali a commandé le Tapis Beni Ourain 'Atlas Royal' (3 200 DH).",
    time: "Il y a 12 min",
    type: "order",
    href: "/admin/commandes",
  },
  {
    id: "notif-2",
    title: "Stock faible en atelier",
    desc: "Il ne reste que 2 exemplaires de l'Arche Mauresque Cintrée 'يا الله'.",
    time: "Il y a 1h",
    type: "stock",
    href: "/admin/produits",
  },
  {
    id: "notif-3",
    title: "Nouvel avis 5 étoiles reçu",
    desc: "Dr. Mehdi Tazi : 'Finition royale et cuivre d'une grande noblesse'.",
    time: "Il y a 3h",
    type: "review",
    href: "/admin/commentaires",
  },
];

// Helper to calculate smooth Monotone Cubic Spline passing accurately through data points without sag
function getSmoothCurvePath(pts: { x: number; y: number }[]): string {
  if (!pts || pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  if (pts.length === 2) {
    return `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} L ${pts[1].x.toFixed(1)} ${pts[1].y.toFixed(1)}`;
  }

  const n = pts.length;
  const dx: number[] = [];
  const dy: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dX = pts[i + 1].x - pts[i].x;
    const dY = pts[i + 1].y - pts[i].y;
    dx.push(dX);
    dy.push(dY);
    m.push(dX === 0 ? 0 : dY / dX);
  }

  const tangents: number[] = [];
  tangents.push(m[0]);
  for (let i = 1; i < n - 1; i++) {
    if (m[i - 1] * m[i] <= 0) {
      tangents.push(0);
    } else {
      tangents.push((m[i - 1] + m[i]) / 2);
    }
  }
  tangents.push(m[n - 2]);

  let path = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const dX = dx[i];
    const cp1x = p1.x + dX / 3;
    const cp1y = p1.y + (tangents[i] * dX) / 3;
    const cp2x = p2.x - dX / 3;
    const cp2y = p2.y - (tangents[i + 1] * dX) / 3;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return path;
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<AdminProduct[]>(INITIAL_ADMIN_PRODUCTS);
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ADMIN_ORDERS);
  const [notifications, setNotifications] = useState<SiteNotification[]>(DEFAULT_NOTIFICATIONS);
  const [selectedCityProduct, setSelectedCityProduct] = useState<AdminProduct | null>(null);

  // Search & Detailed Product Stats Modal states (Vinillia style)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [selectedProductStats, setSelectedProductStats] = useState<AdminProduct | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Period filter (J | S | M | A)
  const [chartPeriod, setChartPeriod] = useState<"J" | "S" | "M" | "A">("S");
  // Chart Type (bar | line)
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [stockAlertFilter, setStockAlertFilter] = useState<string>("all");

  const lineContainerRef = useRef<HTMLDivElement>(null);
  const [hoverCurvePoint, setHoverCurvePoint] = useState<{ x: number; y: number; label: string; val: number } | null>(null);

  // Moroccan cities weights for distributing orders realistically by city
  const MOROCCAN_CITIES = useMemo(
    () => [
      { city: "Casablanca", weight: 0.36 },
      { city: "Rabat", weight: 0.22 },
      { city: "Marrakech", weight: 0.16 },
      { city: "Tanger", weight: 0.10 },
      { city: "Fès", weight: 0.06 },
      { city: "Agadir", weight: 0.05 },
      { city: "Meknès", weight: 0.03 },
      { city: "Kénitra", weight: 0.02 },
    ],
    []
  );

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (isSearchModalOpen && !selectedProductStats) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 70);
      return () => clearTimeout(timer);
    }
  }, [isSearchModalOpen, selectedProductStats]);

  // Keyboard shortcut (Escape to close search/stats modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedProductStats) {
          setSelectedProductStats(null);
        } else if (isSearchModalOpen) {
          setIsSearchModalOpen(false);
          setProductSearchQuery("");
        } else if (selectedCityProduct) {
          setSelectedCityProduct(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchModalOpen, selectedProductStats, selectedCityProduct]);

  // Synchronize with boutique items & localStorage
  useEffect(() => {
    try {
      const SYNC_KEY = "marjad_admin_boutique_synced_v8";
      const hasSynced = localStorage.getItem(SYNC_KEY);

      if (!hasSynced) {
        localStorage.setItem("marjad_admin_products", JSON.stringify(INITIAL_ADMIN_PRODUCTS));
        localStorage.setItem("marjad_admin_orders", JSON.stringify(INITIAL_ADMIN_ORDERS));
        localStorage.setItem("marjad_admin_reviews", JSON.stringify(INITIAL_ADMIN_REVIEWS));
        localStorage.setItem(SYNC_KEY, "true");
        setProducts(INITIAL_ADMIN_PRODUCTS);
        setOrders(INITIAL_ADMIN_ORDERS);
      } else {
        const storedP = localStorage.getItem("marjad_admin_products");
        if (storedP) {
          const parsedP = JSON.parse(storedP);
          if (Array.isArray(parsedP) && parsedP.length > 0) setProducts(parsedP);
        }
        const storedO = localStorage.getItem("marjad_admin_orders");
        if (storedO) {
          const parsedO = JSON.parse(storedO);
          if (Array.isArray(parsedO) && parsedO.length > 0) setOrders(parsedO);
        }
      }

      const storedNotifs = localStorage.getItem("marjad_admin_notifications");
      if (storedNotifs) {
        const parsedN = JSON.parse(storedNotifs);
        if (Array.isArray(parsedN)) setNotifications(parsedN);
      }
    } catch {}
  }, []);

  const handleDeleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    try {
      localStorage.setItem("marjad_admin_notifications", JSON.stringify(updated));
    } catch {}
  };

  // KPIs
  const pendingOrders = useMemo(() => orders.filter((o) => o.status === "pending").length, [orders]);
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + (o.total || 0), 0), [orders]);
  const inStockCount = useMemo(() => products.filter((p) => p.stock > 0).length, [products]);

  // Top 5 Best-Selling Products from the boutique
  const topBestSellingProducts = useMemo(() => {
    const salesMap = new Map<string | number, number>();
    orders.forEach((o) => {
      if (o.status !== "cancelled") {
        o.items?.forEach((it) => {
          salesMap.set(it.productId, (salesMap.get(it.productId) || 0) + (it.quantity || 1));
        });
      }
    });

    const list = products.map((p) => ({
      ...p,
      calculatedSales: salesMap.get(p.id) || (p.salesCount > 0 ? p.salesCount : 0),
    }));

    return list.sort((a, b) => b.calculatedSales - a.calculatedSales).slice(0, 5);
  }, [products, orders]);

  // Boutique products only matching search
  const searchMatchingProducts = useMemo(() => {
    const q = productSearchQuery.toLowerCase().trim();
    // Strictly filter boutique products that are not deleted
    const boutiqueProducts = products.filter((p) => !p.isDeleted);
    if (!q) {
      return boutiqueProducts;
    }
    return boutiqueProducts.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(q);
      const matchNameAr = p.nameAr?.toLowerCase().includes(q);
      const matchCat = p.categoryName?.toLowerCase().includes(q);
      const matchDesc =
        p.shortDescription?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      return matchName || matchNameAr || matchCat || matchDesc;
    });
  }, [products, productSearchQuery]);

  // Statistics calculation for the selected product in search modal
  const productStatsData = useMemo(() => {
    if (!selectedProductStats) return null;

    const productOrders = orders.filter((o) => {
      if (o.status === "cancelled") return false;
      return o.items?.some(
        (it) =>
          it.productId === selectedProductStats.id ||
          it.name?.toLowerCase().includes(selectedProductStats.name.toLowerCase().slice(0, 15))
      );
    });

    let totalSoldFromOrders = 0;
    const realCityCounts: { [city: string]: number } = {};

    productOrders.forEach((o) => {
      const matchingItems = o.items?.filter(
        (it) =>
          it.productId === selectedProductStats.id ||
          it.name?.toLowerCase().includes(selectedProductStats.name.toLowerCase().slice(0, 15))
      );
      matchingItems?.forEach((it) => {
        const qty = it.quantity || 1;
        totalSoldFromOrders += qty;
        if (o.customerCity) {
          realCityCounts[o.customerCity] = (realCityCounts[o.customerCity] || 0) + qty;
        }
      });
    });

    const totalSold = Math.max(
      1,
      (selectedProductStats.salesCount || 0) + totalSoldFromOrders
    );
    const totalRevenue = totalSold * (selectedProductStats.price || 1200);
    const totalOrdersCount = Math.max(productOrders.length, Math.round(totalSold * 0.85));

    const citiesData = MOROCCAN_CITIES.map((c) => {
      const real = realCityCounts[c.city] || 0;
      const count = Math.max(1, Math.round(totalOrdersCount * c.weight) + real);
      return {
        city: c.city,
        ordersCount: count,
        revenue: count * (selectedProductStats.price || 1200),
      };
    });

    const totalCityOrders = citiesData.reduce((sum, c) => sum + c.ordersCount, 0) || 1;
    const sortedCities = citiesData
      .map((c) => ({
        ...c,
        percentage: Math.round((c.ordersCount / totalCityOrders) * 100),
      }))
      .sort((a, b) => b.ordersCount - a.ordersCount);

    const recentOrders =
      productOrders.length > 0
        ? productOrders.slice(0, 4).map((o) => {
            const item = o.items?.find(
              (it) =>
                it.productId === selectedProductStats.id ||
                it.name?.toLowerCase().includes(selectedProductStats.name.toLowerCase().slice(0, 15))
            );
            return {
              id: o.id,
              customerName: o.customerName || "Client MARJAD",
              customerCity: o.customerCity || "Casablanca",
              date: o.date,
              quantity: item?.quantity || 1,
              total: (item?.quantity || 1) * (item?.price || selectedProductStats.price),
              status: o.status,
            };
          })
        : [
            {
              id: `CMD-${Math.floor(1000 + Math.random() * 9000)}`,
              customerName: "Lalla Fatima-Zahra Benali",
              customerCity: "Casablanca",
              date: "Aujourd'hui, 14:20",
              quantity: 1,
              total: selectedProductStats.price,
              status: "delivered",
            },
            {
              id: `CMD-${Math.floor(1000 + Math.random() * 9000)}`,
              customerName: "Sidi Mehdi Tazi",
              customerCity: "Rabat",
              date: "Hier, 11:45",
              quantity: 2,
              total: selectedProductStats.price * 2,
              status: "shipped",
            },
            {
              id: `CMD-${Math.floor(1000 + Math.random() * 9000)}`,
              customerName: "Kenza Alami",
              customerCity: "Marrakech",
              date: "Il y a 2 jours",
              quantity: 1,
              total: selectedProductStats.price,
              status: "delivered",
            },
            {
              id: `CMD-${Math.floor(1000 + Math.random() * 9000)}`,
              customerName: "Moulay Idriss Mansouri",
              customerCity: "Fès",
              date: "Il y a 3 jours",
              quantity: 1,
              total: selectedProductStats.price,
              status: "confirmed",
            },
          ];

    return {
      totalSold,
      totalRevenue,
      totalOrdersCount,
      sortedCities,
      recentOrders,
    };
  }, [selectedProductStats, orders, MOROCCAN_CITIES]);

  // Breakdown for best-seller card click
  const bestSellerCityBreakdown = useMemo(() => {
    if (!selectedCityProduct) return [];
    const totalSales = selectedCityProduct.salesCount || 100;
    const price = selectedCityProduct.price || 1200;

    const realCityCounts: { [city: string]: number } = {};
    orders.forEach((o) => {
      if (o.status !== "cancelled" && o.customerCity) {
        const item = o.items?.find(
          (it) => it.productId === selectedCityProduct.id || it.name === selectedCityProduct.name
        );
        if (item) {
          realCityCounts[o.customerCity] = (realCityCounts[o.customerCity] || 0) + (item.quantity || 1);
        }
      }
    });

    const result = MOROCCAN_CITIES.map((c) => {
      const real = realCityCounts[c.city] || 0;
      const count = Math.max(1, Math.round(totalSales * c.weight) + real);
      return {
        city: c.city,
        ordersCount: count,
        revenue: count * price,
      };
    });

    const sumCounts = result.reduce((acc, r) => acc + r.ordersCount, 0) || 1;

    return result
      .map((r) => ({
        ...r,
        percentage: Math.round((r.ordersCount / sumCounts) * 100),
      }))
      .sort((a, b) => b.ordersCount - a.ordersCount);
  }, [selectedCityProduct, orders, MOROCCAN_CITIES]);

  // Chart data based on selected period
  const currentChartBars = useMemo(() => {
    let bars: { label: string; val: number }[] = [];

    if (chartPeriod === "J") {
      const hours = ["08h", "10h", "12h", "14h", "16h", "18h", "20h", "22h"];
      bars = hours.map((h, i) => ({
        label: h,
        val: [1, 2, 4, 3, 5, 4, 3, 1][i] || 1,
      }));
    } else if (chartPeriod === "S") {
      const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
      bars = days.map((d, i) => ({
        label: d,
        val: [3, 5, 8, 4, 6, 7, 2][i] || 2,
      }));
    } else if (chartPeriod === "M") {
      bars = Array.from({ length: 15 }, (_, i) => ({
        label: `J${i * 2 + 1}`,
        val: Math.max(1, ((i * 3 + 2) % 7) + 2),
      }));
    } else {
      const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct"];
      bars = months.map((m, i) => ({
        label: m,
        val: [18, 22, 29, 25, 34, 38, 42, 36, 45, 52][i] || 20,
      }));
    }

    const max = Math.max(...bars.map((b) => b.val), 1);
    return bars.map((b) => ({
      ...b,
      isPeak: b.val === max && b.val > 0,
    }));
  }, [chartPeriod]);

  const maxChartVal = useMemo(
    () => Math.max(...currentChartBars.map((b) => b.val), 1),
    [currentChartBars]
  );

  // Smooth spline curve computation for line chart
  const lineChartData = useMemo(() => {
    const pts = currentChartBars.map((b, i) => {
      const x = (i / Math.max(1, currentChartBars.length - 1)) * 960 + 20;
      const y = 160 - (b.val / maxChartVal) * 120;
      return { x, y, label: b.label, val: b.val };
    });

    const linePath = getSmoothCurvePath(pts);
    let areaPath = "";
    if (pts.length > 0) {
      const firstX = pts[0].x.toFixed(1);
      const lastX = pts[pts.length - 1].x.toFixed(1);
      areaPath = `${linePath} L ${lastX} 176 L ${firstX} 176 Z`;
    }

    return { pts, linePath, areaPath };
  }, [currentChartBars, maxChartVal]);

  const handleLineChartMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!lineContainerRef.current) return;
    const rect = lineContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, mouseX / rect.width));

    const targetIdx = Math.round(ratio * (lineChartData.pts.length - 1));
    const closest = lineChartData.pts[targetIdx];
    if (closest) {
      setHoverCurvePoint(closest);
    }
  };

  const handleLineChartMouseLeave = () => {
    setHoverCurvePoint(null);
  };

  // Stock alerts list
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= 4 || p.status === "out_of_stock" || p.status === "low_stock");
  }, [products]);

  const filteredLowStockProducts = useMemo(() => {
    if (stockAlertFilter === "rupture") {
      return lowStockProducts.filter((p) => p.stock === 0 || p.status === "out_of_stock");
    }
    if (stockAlertFilter === "faible") {
      return lowStockProducts.filter((p) => p.stock > 0 && p.stock <= 4);
    }
    return lowStockProducts;
  }, [lowStockProducts, stockAlertFilter]);

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1680px] w-full mx-auto pb-12">
      {/* 1. TOP HEADER DIRECTION GÉNÉRALE */}
      <AdminHeader
        title="MARJAD - Direction Générale"
        subtitle={
          <div className="flex items-center gap-2 text-xs text-[#6B7280] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Maison d&apos;Artisanat Marocain d&apos;Exception • Vue Globale Atelier & Ventes</span>
          </div>
        }
        onSearchClick={() => {
          setIsSearchModalOpen(true);
        }}
      />

      {/* 2. STAT CARDS ROW (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          label="Commandes Clients"
          value={orders.length}
          change="+14.8%"
          changeType="positive"
          icon={ShoppingBag}
          subtext={pendingOrders > 0 ? `${pendingOrders} en attente de traitement` : "Toutes les commandes traitées"}
          accentVariant="walnut"
        />
        <StatCard
          label="Volume des Ventes"
          value={`${totalRevenue.toLocaleString()} DH`}
          change="+24.5%"
          changeType="positive"
          icon={TrendingUp}
          subtext="Encaissé à la livraison (Cash on Delivery)"
          accentVariant="terracotta"
        />
        <StatCard
          label="Catalogue d'Artisanat"
          value={products.length}
          change={`${inStockCount} en stock`}
          changeType="neutral"
          icon={Package}
          subtext="Pièces confectionnées à la main"
          accentVariant="sand"
        />
        <StatCard
          label="Avis & Satisfaction"
          value="4.9 / 5"
          change="+0.3"
          changeType="positive"
          icon={Star}
          subtext={`${INITIAL_ADMIN_REVIEWS.length} témoignages vérifiés`}
          accentVariant="sage"
        />
      </div>

      {/* 3. ROW 2: TOP 5 BEST-SELLING PRODUCTS + 4 ESSENTIAL ADMIN SHORTCUTS IN THE SAME ROW (EXACT VINILLIA STYLE) */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-stretch">
        {/* 5 Best-Selling Products: takes flex-1 */}
        <div className="flex-1 min-w-0">
          {(() => {
            const activeBestProducts = topBestSellingProducts.filter(
              (p) => (p.calculatedSales || 0) > 0
            );

            if (activeBestProducts.length === 0) {
              return (
                <div className="bg-[#FAF7F2] border border-[#E9DCD5] rounded-3xl p-6 flex flex-col items-center justify-center text-center h-full w-full space-y-2.5 min-h-[195px]">
                  <div className="w-10 h-10 rounded-full bg-[#6d381e]/10 text-[#6d381e] flex items-center justify-center">
                    <Award className="w-5 h-5 text-[#6d381e]" />
                  </div>
                  <p className="font-serif font-bold text-sm sm:text-base text-[#1F2937]">
                    Aucun produit best
                  </p>
                  <p className="text-xs text-[#6B7280] max-w-sm leading-relaxed">
                    Les créations les plus vendues s&apos;afficheront ici automatiquement dès les premières commandes.
                  </p>
                </div>
              );
            }

            const remainingSlots = 5 - activeBestProducts.length;

            const colSpanClasses: Record<number, string> = {
              1: "lg:col-span-1",
              2: "lg:col-span-2",
              3: "lg:col-span-3",
              4: "lg:col-span-4",
            };

            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 h-full">
                {activeBestProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setSelectedCityProduct(product)}
                    className="bg-[#FAF7F2] border border-[#E9DCD5] rounded-3xl p-3 sm:p-3.5 flex flex-col items-center justify-center relative hover:shadow-md hover:border-[#6d381e]/40 transition-all duration-200 text-center group cursor-pointer h-full w-full min-h-[195px]"
                    title={`Cliquer pour voir la répartition par ville (${product.name})`}
                  >
                    {/* Tiny star indicator in top-right */}
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#6d381e]/10 flex items-center justify-center">
                      <Star className="w-3 h-3 text-[#6d381e] fill-[#6d381e]" />
                    </div>

                    {/* Avatar with circle border */}
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white shadow-xs group-hover:scale-105 transition-transform mb-1.5 bg-white shrink-0">
                      <Image
                        src={product.image || "/images/products/prod-tapis.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Name */}
                    <p
                      className="font-bold text-xs sm:text-[13px] text-[#1F2937] leading-tight line-clamp-1 group-hover:text-[#6d381e] transition-colors"
                      title={product.name}
                    >
                      {product.name}
                    </p>

                    {/* Sales & Price */}
                    <div className="mt-1 flex flex-col items-center gap-0.5">
                      <p className="text-[11px] text-[#6B7280] font-medium">
                        {product.calculatedSales} {product.calculatedSales === 1 ? "Vente" : "Ventes"}
                      </p>
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-[#6d381e] bg-white px-2.5 py-0.5 rounded-full border border-[#E9DCD5] shadow-2xs group-hover:border-[#6d381e]/30 transition-colors">
                        {product.price} DH
                      </span>
                    </div>
                  </button>
                ))}

                {remainingSlots > 0 && (
                  <div
                    className={`bg-[#FAF7F2] border border-[#E9DCD5] rounded-3xl p-4 flex flex-col items-center justify-center text-center h-full w-full space-y-1.5 min-h-[195px] ${
                      colSpanClasses[remainingSlots] || ""
                    }`}
                  >
                    <Award className="w-4 h-4 text-[#6d381e]/40" />
                    <p className="font-serif font-bold text-xs sm:text-sm text-[#1F2937]">
                      Aucun autre produit best
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* 4 Essential Admin Shortcuts with reduced padding + 4th TikTok Reels button */}
        <div className="w-full lg:w-[250px] xl:w-[270px] shrink-0 bg-[#6d381e] rounded-3xl p-2.5 sm:p-3 text-white flex flex-col justify-center shadow-md border border-[#6d381e]/30">
          <div className="flex flex-col justify-between h-full gap-1.5">
            {/* 1. Commandes */}
            <Link
              href="/admin/commandes"
              className="flex items-center justify-between p-1.5 sm:p-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 transition-all duration-200 group cursor-pointer flex-1"
              title="Consulter et gérer les commandes clients"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6.5 h-6.5 rounded-xl bg-white/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#FAF7F2]" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-white block leading-tight truncate">
                    Commandes
                  </span>
                  <span className="text-[10px] text-white/70 block leading-tight truncate">
                    {pendingOrders > 0 ? `${pendingOrders} en attente` : "Toutes traitées"}
                  </span>
                </div>
              </div>
              {pendingOrders > 0 ? (
                <span className="text-[10px] font-extrabold bg-[#ba4e1a] text-white px-2 py-0.5 rounded-full shadow-2xs shrink-0">
                  {pendingOrders}
                </span>
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-white/60 group-hover:translate-x-0.5 transition-transform shrink-0" />
              )}
            </Link>

            {/* 2. Produits */}
            <Link
              href="/admin/produits"
              className="flex items-center justify-between p-1.5 sm:p-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 transition-all duration-200 group cursor-pointer flex-1"
              title="Gérer le catalogue des créations et l'inventaire"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6.5 h-6.5 rounded-xl bg-white/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Package className="w-3.5 h-3.5 text-[#FAF7F2]" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-white block leading-tight truncate">
                    Produits
                  </span>
                  <span className="text-[10px] text-white/70 block leading-tight truncate">
                    {inStockCount} en stock
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full shrink-0">
                {products.length}
              </span>
            </Link>

            {/* 3. Avis Clients */}
            <Link
              href="/admin/commentaires"
              className="flex items-center justify-between p-1.5 sm:p-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 transition-all duration-200 group cursor-pointer flex-1"
              title="Consulter les avis clients"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6.5 h-6.5 rounded-xl bg-white/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Star className="w-3.5 h-3.5 text-[#FAF7F2]" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-white block leading-tight truncate">
                    Avis Clients
                  </span>
                  <span className="text-[10px] text-white/70 block leading-tight truncate">
                    {INITIAL_ADMIN_REVIEWS.length} avis reçus
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full shrink-0">
                4.9 ★
              </span>
            </Link>

            {/* 4. Vidéos TikTok & Reels */}
            <Link
              href="/admin/videos"
              className="flex items-center justify-between p-1.5 sm:p-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 transition-all duration-200 group cursor-pointer flex-1"
              title="Ajouter et gérer les vidéos TikTok"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6.5 h-6.5 rounded-xl bg-white/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Video className="w-3.5 h-3.5 text-[#FAF7F2]" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-white block leading-tight truncate">
                    Vidéos & Reels
                  </span>
                  <span className="text-[10px] text-white/70 block leading-tight truncate">
                    Flux TikTok Atelier
                  </span>
                </div>
              </div>
              <span className="text-[9.5px] font-extrabold bg-[#ba4e1a] text-white px-2 py-0.5 rounded-full shadow-2xs shrink-0 flex items-center gap-0.5">
                + Ajouter
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. ROW 3: ORDER STATISTICS CHART (2/3) + NOTIFICATIONS (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Left: Order Statistics Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E9DCD5] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between min-h-[300px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E9DCD5]/60">
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#1F2937]">
                Statistiques des Commandes (COD)
              </h3>
              <p className="text-xs text-[#6B7280]">
                Volume des commandes validées par période
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Period Switcher: J, S, M, A */}
              <div className="flex items-center bg-[#FAF7F2] p-1 rounded-full border border-[#E9DCD5] gap-0.5">
                {(["J", "S", "M", "A"] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => {
                      setChartPeriod(period);
                      setHoverCurvePoint(null);
                    }}
                    className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center transition cursor-pointer ${
                      chartPeriod === period
                        ? "bg-[#6d381e] text-white shadow-2xs"
                        : "text-[#6B7280] hover:text-[#1F2937]"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>

              {/* View Switcher: Bar vs Line */}
              <div className="flex items-center bg-[#FAF7F2] p-1 rounded-full border border-[#E9DCD5] gap-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setChartType("bar");
                    setHoverCurvePoint(null);
                  }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition cursor-pointer ${
                    chartType === "bar"
                      ? "bg-[#6d381e] text-white shadow-2xs"
                      : "text-[#6B7280] hover:text-[#1F2937]"
                  }`}
                  title="Affichage en colonnes"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChartType("line");
                    setHoverCurvePoint(null);
                  }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition cursor-pointer ${
                    chartType === "line"
                      ? "bg-[#6d381e] text-white shadow-2xs"
                      : "text-[#6B7280] hover:text-[#1F2937]"
                  }`}
                  title="Affichage en ligne (graphe)"
                >
                  <LineChart className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Chart Body */}
          <div className="flex-1 flex flex-col justify-end pt-6 pb-2 relative">
            {/* Background gridlines */}
            <div className="absolute inset-x-0 top-6 h-28 flex flex-col justify-between pointer-events-none opacity-25">
              <div className="border-b border-dashed border-[#E9DCD5] w-full" />
              <div className="border-b border-dashed border-[#E9DCD5] w-full" />
              <div className="border-b border-dashed border-[#E9DCD5] w-full" />
            </div>

            {chartType === "bar" ? (
              <div className="flex items-end justify-between border-b border-[#E9DCD5] gap-2 pt-4">
                {currentChartBars.map((bar, i) => {
                  const heightPercent =
                    maxChartVal > 0 ? Math.max(10, Math.round((bar.val / maxChartVal) * 100)) : 10;

                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-end flex-1 group cursor-pointer"
                      title={`${bar.label}: ${bar.val} commandes`}
                    >
                      {/* Circular Number Badge */}
                      <div className="mb-2 flex items-center justify-center">
                        <span className="w-6 h-6 rounded-full border border-[#E9DCD5] bg-white text-[#1F2937] text-[10.5px] font-bold flex items-center justify-center shadow-2xs select-none">
                          {bar.val}
                        </span>
                      </div>

                      {/* Bar */}
                      <div className="w-full flex items-end justify-center h-28">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-6 sm:w-8 max-w-[32px] rounded-t-xl transition-all duration-300 ${
                            bar.isPeak
                              ? "bg-gradient-to-t from-[#ba4e1a] to-[#d4642d] shadow-xs ring-2 ring-[#ba4e1a]/20"
                              : "bg-[#6d381e]/25 group-hover:bg-[#6d381e]/60"
                          }`}
                        />
                      </div>

                      <span className="text-[11px] font-semibold text-[#6B7280] mt-2">
                        {bar.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                ref={lineContainerRef}
                onMouseMove={handleLineChartMouseMove}
                onMouseLeave={handleLineChartMouseLeave}
                className="relative w-full h-44 border-b border-[#E9DCD5] overflow-hidden cursor-crosshair pt-2"
              >
                <svg
                  viewBox="0 0 1000 176"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                >
                  <defs>
                    <linearGradient id="marjadWaveChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6d381e" stopOpacity="0.28" />
                      <stop offset="65%" stopColor="#ba4e1a" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#6d381e" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Gradient Area Fill */}
                  {lineChartData.areaPath && (
                    <path d={lineChartData.areaPath} fill="url(#marjadWaveChartGrad)" />
                  )}

                  {/* Spline Curve Line */}
                  {lineChartData.linePath && (
                    <path
                      d={lineChartData.linePath}
                      fill="none"
                      stroke="#6d381e"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>

                {/* Tooltip point riding strictly on curve */}
                {hoverCurvePoint && (
                  <div
                    style={{
                      left: `${(hoverCurvePoint.x / 1000) * 100}%`,
                      top: `${(hoverCurvePoint.y / 176) * 100}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 flex flex-col items-center"
                  >
                    <div className="w-4 h-4 rounded-full bg-[#ba4e1a] border-2 border-white shadow-md animate-ping absolute" />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#6d381e] border-2 border-white shadow-md relative" />
                    <div className="absolute bottom-5 bg-[#1F2937] text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
                      {hoverCurvePoint.label} : {hoverCurvePoint.val} commandes
                    </div>
                  </div>
                )}

                {/* Bottom Labels */}
                <div className="absolute inset-x-0 bottom-1 flex justify-between px-2 text-[10px] text-[#6B7280] font-semibold pointer-events-none">
                  {currentChartBars.map((b, i) => (
                    <span key={i}>{b.label}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Notifications Panel */}
        <div className="bg-white border border-[#E9DCD5] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E9DCD5]/60">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#E9DCD5] flex items-center justify-center text-[#6d381e]">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#1F2937] leading-tight">
                    Notifications Atelier
                  </h3>
                  <span className="text-[10px] text-[#6B7280]">
                    Flux d&apos;activité récent
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#ba4e1a] bg-[#ba4e1a]/10 px-2 py-0.5 rounded-full">
                {notifications.length}
              </span>
            </div>

            {/* List */}
            <div className="space-y-2 mt-3.5">
              {notifications.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/70" />
                  <p className="text-xs text-[#6B7280]">
                    Aucune notification non lue
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-start justify-between gap-2 p-2 rounded-xl bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] border border-transparent hover:border-[#E9DCD5] transition group"
                  >
                    <Link href={notif.href} className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-[#1F2937] truncate group-hover:text-[#6d381e]">
                          {notif.title}
                        </p>
                        <span className="text-[9px] text-[#9CA3AF] shrink-0 font-medium">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B7280] line-clamp-1 mt-0.5">
                        {notif.desc}
                      </p>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteNotification(notif.id)}
                      className="text-stone-300 hover:text-rose-500 p-0.5 rounded transition cursor-pointer"
                      title="Supprimer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-[#E9DCD5]/40 text-left">
            <span className="text-[10.5px] text-stone-400 font-medium">
              Synchronisation atelier en temps réel
            </span>
          </div>
        </div>
      </div>

      {/* 5. ROW 4: ALERTE STOCK FAIBLE & RUPTURES (Matching Vinillia standards) */}
      <div className="bg-white border border-[#E9DCD5] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E9DCD5]/60 relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5]/60 flex items-center justify-center text-[#991B1B] shrink-0 shadow-2xs">
              <ShieldAlert className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-[#1F2937]">
                  Alerte Stock Faible &amp; Ruptures
                </h3>
                <span className="bg-[#FEF2F2] text-[#991B1B] border border-[#FCA5A5] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                  {filteredLowStockProducts.length}{" "}
                  {stockAlertFilter === "rupture"
                    ? "en rupture"
                    : stockAlertFilter === "faible"
                    ? "en stock faible"
                    : "pièces critiques"}
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] font-medium mt-0.5">
                Pièces d&apos;artisanat presque épuisées ou en rupture nécessitant un réapprovisionnement auprès des coopératives.
              </p>
            </div>
          </div>

          {/* Filter dropdown */}
          <div className="w-[200px] shrink-0">
            <CustomSelect
              value={stockAlertFilter}
              onChange={(val) => setStockAlertFilter(val)}
              icon={SlidersHorizontal}
              options={[
                { value: "all", label: "Toutes les alertes" },
                { value: "rupture", label: "En rupture (0)" },
                { value: "faible", label: "Stock faible (≤ 4)" },
              ]}
              triggerClassName="bg-[#FAF7F2] border border-[#E9DCD5] rounded-xl text-xs py-2"
            />
          </div>
        </div>

        {/* Grid or Empty State */}
        {filteredLowStockProducts.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="font-bold text-sm text-[#1F2937]">
              {stockAlertFilter === "rupture"
                ? "Aucune pièce en rupture de stock"
                : stockAlertFilter === "faible"
                ? "Aucune pièce en stock faible"
                : "Tous les stocks d'artisanat sont à un niveau optimal"}
            </p>
            <p className="text-xs text-[#6B7280] mt-1">
              Les ateliers disposent d&apos;un approvisionnement suffisant pour les commandes en cours.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredLowStockProducts.map((product) => {
              const isOutOfStock = product.stock === 0 || product.status === "out_of_stock";
              const isCritical = product.stock <= 2 && !isOutOfStock;

              return (
                <div
                  key={product.id}
                  className="bg-white border border-[#E9DCD5] hover:border-[#6d381e]/40 shadow-xs hover:shadow-md transition-all duration-200 rounded-3xl p-4 flex flex-col justify-between group"
                >
                  {/* Top Bar: Urgency Badge + Price */}
                  <div className="flex items-center justify-between gap-2">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-[#991B1B] bg-[#FEF2F2] border border-[#FCA5A5]/70 px-2.5 py-1 rounded-full shadow-2xs whitespace-nowrap shrink-0">
                        <PackageX className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                        <span>Rupture Atelier</span>
                      </span>
                    ) : isCritical ? (
                      <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-[#9A3412] bg-[#FFF7ED] border border-[#FDBA74]/70 px-2.5 py-1 rounded-full shadow-2xs whitespace-nowrap shrink-0">
                        <AlertOctagon className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                        <span>Critique ({product.stock})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-[#854D0E] bg-[#FEFCE8] border border-[#FDE047]/70 px-2.5 py-1 rounded-full shadow-2xs whitespace-nowrap shrink-0">
                        <BadgeAlert className="w-3.5 h-3.5 text-[#CA8A04] shrink-0" />
                        <span>Faible ({product.stock})</span>
                      </span>
                    )}

                    <span className="text-xs font-black text-[#ba4e1a] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#E9DCD5] shadow-2xs whitespace-nowrap shrink-0">
                      {product.price} DH
                    </span>
                  </div>

                  {/* Middle: Product Thumbnail + Title + Category */}
                  <div className="flex items-center gap-3.5 my-3.5">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white shadow-xs bg-[#FAF7F2] shrink-0 group-hover:scale-105 transition-transform">
                      <Image
                        src={product.image || "/images/products/prod-tapis.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-[#ba4e1a] uppercase tracking-wider block truncate">
                        {product.categoryName}
                      </span>
                      <p
                        className="text-xs sm:text-[13px] font-bold text-[#1F2937] group-hover:text-[#6d381e] transition-colors line-clamp-2 leading-snug mt-0.5"
                        title={product.name}
                      >
                        {product.name}
                      </p>
                      <span className="text-[10.5px] text-[#6B7280] block truncate mt-0.5">
                        {product.artisanName || "Maâlem Artisan"}
                      </span>
                    </div>
                  </div>

                  {/* Bottom: Stock Gauge & Quick Action Link */}
                  <div className="mt-auto pt-2.5 border-t border-[#E9DCD5]/60 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 text-[#6B7280]">
                        <Boxes className="w-3.5 h-3.5 text-[#6B7280]" />
                        <span className="font-medium">Stock restant :</span>
                      </div>
                      <span
                        className={`font-black ${
                          isOutOfStock
                            ? "text-[#DC2626]"
                            : isCritical
                            ? "text-[#EA580C]"
                            : "text-[#B45309]"
                        }`}
                      >
                        {isOutOfStock ? "0 unité" : `${product.stock} unités`}
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full bg-[#E9DCD5]/60 rounded-full h-1.5 overflow-hidden">
                      <div
                        style={{
                          width: isOutOfStock
                            ? "0%"
                            : `${Math.min(100, Math.max(15, (product.stock / 6) * 100))}%`,
                        }}
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOutOfStock
                            ? "bg-red-500"
                            : isCritical
                            ? "bg-amber-500"
                            : "bg-[#6d381e]"
                        }`}
                      />
                    </div>

                    <Link
                      href={`/admin/produits?highlight=${product.id}`}
                      className="w-full mt-1.5 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-[11px] font-bold border border-[#E9DCD5] text-[#6d381e] hover:bg-[#FAF7F2] transition cursor-pointer"
                    >
                      <span>Gérer la pièce dans le catalogue</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. MODAL RÉPARTITION PAR VILLE POUR LE PRODUIT BEST-SELLER */}
      {selectedCityProduct && (
        <div
          className="fixed inset-0 z-[160] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedCityProduct(null)}
        >
          <div
            className="bg-white rounded-[32px] max-w-lg w-full border border-[#E9DCD5] shadow-2xl p-6 relative overflow-hidden space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCityProduct(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#6d381e] bg-white text-[#6d381e] hover:bg-[#6d381e] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Product Identity */}
            <div className="flex items-center gap-3.5 pr-8">
              <div className="w-14 h-14 rounded-2xl overflow-hidden relative border border-[#E9DCD5] shrink-0 bg-stone-50">
                <Image
                  src={selectedCityProduct.image}
                  alt={selectedCityProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-[#ba4e1a] bg-[#ba4e1a]/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {selectedCityProduct.categoryName}
                </span>
                <h3 className="font-serif font-bold text-base text-[#1F2937] mt-0.5 truncate">
                  {selectedCityProduct.name}
                </h3>
                <p className="text-xs font-bold text-[#6d381e]">
                  {selectedCityProduct.price} DH •{" "}
                  <span className="font-medium text-[#6B7280]">
                    {selectedCityProduct.salesCount} ventes totales
                  </span>
                </p>
              </div>
            </div>

            {/* Cities Distribution */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#1F2937]">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#ba4e1a]" />
                  <span>Répartition des Ventes au Maroc</span>
                </span>
                <span className="text-[11px] text-[#6d381e] font-bold bg-[#6d381e]/10 px-2 py-0.5 rounded-full">
                  Top 8 Villes
                </span>
              </div>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {bestSellerCityBreakdown.map((item, idx) => {
                  const isTop = idx === 0;
                  return (
                    <div
                      key={item.city}
                      className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E9DCD5]/60 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1F2937]">{item.city}</span>
                          {isTop && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-[#C5A059] text-white px-2 py-0.2 rounded-full shadow-2xs">
                              N°1 🏆
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-[11px] font-semibold text-[#6d381e]">
                            {item.ordersCount} cmd ({item.revenue.toLocaleString()} DH)
                          </span>
                          <span className="text-[11px] font-bold text-[#6d381e] bg-white px-2 py-0.5 rounded-full border border-[#E9DCD5]">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-[#E9DCD5]/60 rounded-full h-1.5 overflow-hidden">
                        <div
                          style={{ width: `${Math.max(6, item.percentage)}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            isTop
                              ? "bg-gradient-to-r from-[#C5A059] to-[#D4AF37]"
                              : "bg-[#6d381e]"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/admin/produits?highlight=${selectedCityProduct.id}`}
                onClick={() => setSelectedCityProduct(null)}
                className="w-full flex items-center justify-center gap-2 bg-[#6d381e] hover:bg-[#542a15] text-white py-2.5 rounded-2xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <span>Gérer cette création dans le catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL RECHERCHE & STATISTIQUES PRODUITS BOUTIQUE (STYLE VINILLIA) */}
      {isSearchModalOpen && (
        <div
          className="fixed inset-0 z-[160] bg-black/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4 pt-16 sm:pt-4 animate-in fade-in duration-200 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsSearchModalOpen(false);
              setSelectedProductStats(null);
              setProductSearchQuery("");
            }
          }}
        >
          <div
            className={`bg-white rounded-3xl border border-[#E9DCD5] shadow-[0_20px_60px_rgba(109,56,30,0.22)] max-w-2xl w-full overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-150 ${
              selectedProductStats ? "my-auto" : "mb-10"
            }`}
          >
            {/* VUE 1 : RECHERCHE DES PRODUITS DE LA BOUTIQUE */}
            {!selectedProductStats ? (
              <div className="p-4.5 sm:p-6 space-y-4">
                {/* En-tête de la recherche */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E9DCD5]/70">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F2937] leading-tight">
                      Recherche & Statistiques Créations
                    </h3>
                    <p className="text-[11px] text-[#6B7280]">
                      Cliquez sur une pièce d&apos;artisanat pour afficher ses statistiques détaillées et sa répartition par ville au Maroc
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchModalOpen(false);
                      setProductSearchQuery("");
                    }}
                    className="group w-8 h-8 rounded-full border border-[#6d381e] bg-white text-[#6d381e] hover:bg-[#6d381e] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xs cursor-pointer shrink-0"
                    title="Fermer"
                    aria-label="Fermer"
                  >
                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>

                {/* Champ de recherche */}
                <div className="relative">
                  <Search className="w-4.5 h-4.5 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    placeholder="Rechercher par nom de création ou catégorie (ex: Beni Ourain, Zellige, Lanterne, Pouf)..."
                    className="w-full bg-[#FAF7F2] border border-[#E9DCD5] focus:border-[#6d381e] focus:bg-white rounded-2xl py-2.5 pl-11 pr-10 text-xs sm:text-sm text-[#1F2937] placeholder-[#6B7280] transition outline-none"
                  />
                  {productSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setProductSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2937] p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Liste des résultats : Produits de la boutique UNIQUEMENT */}
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] px-1 font-medium">
                    <span>
                      {productSearchQuery.trim()
                        ? "Résultats de recherche"
                        : "Pièces disponibles en boutique"}
                    </span>
                    <span className="font-bold text-[#6d381e]">
                      {searchMatchingProducts.length} {searchMatchingProducts.length > 1 ? "créations" : "création"}
                    </span>
                  </div>

                  {searchMatchingProducts.length === 0 ? (
                    <div className="text-center py-10 space-y-2.5">
                      <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E9DCD5] text-[#6d381e] flex items-center justify-center mx-auto">
                        <Search className="w-5 h-5" />
                      </div>
                      <p className="font-serif text-sm font-bold text-[#1F2937]">
                        Aucune création trouvée pour &ldquo;{productSearchQuery}&rdquo;
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        Vérifiez l&apos;orthographe ou essayez un autre mot-clé du catalogue MARJAD.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {searchMatchingProducts.map((p) => {
                        const isLowStock = p.stock > 0 && p.stock <= 4;
                        const isOutOfStock = p.stock <= 0;
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedProductStats(p)}
                            className="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border border-[#E9DCD5]/70 hover:border-[#6d381e] hover:bg-[#FAF7F2] transition-all duration-150 cursor-pointer text-left"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#E9DCD5] shrink-0 bg-stone-50">
                                <Image
                                  src={p.image}
                                  alt={p.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-[9.5px] font-bold text-[#ba4e1a] uppercase tracking-wider bg-[#ba4e1a]/10 px-1.5 py-0.5 rounded">
                                    {p.categoryName}
                                  </span>
                                  <span className="text-[10px] text-[#6B7280]">
                                    Réf: {p.id}
                                  </span>
                                </div>
                                <h4 className="font-serif font-bold text-xs text-[#1F2937] group-hover:text-[#6d381e] transition truncate">
                                  {p.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[11px] font-bold text-[#6d381e]">
                                    {p.price} DH
                                  </span>
                                  <span className="text-[10px] text-[#E9DCD5]">•</span>
                                  <span
                                    className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full ${
                                      isOutOfStock
                                        ? "bg-red-50 text-red-600 border border-red-200"
                                        : isLowStock
                                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    }`}
                                  >
                                    {isOutOfStock
                                      ? "Rupture"
                                      : isLowStock
                                      ? `Stock faible: ${p.stock}`
                                      : `En stock (${p.stock})`}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0 pl-3 flex items-center gap-2">
                              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-[#6d381e] bg-white border border-[#E9DCD5] group-hover:bg-[#6d381e] group-hover:text-white group-hover:border-[#6d381e] px-2.5 py-1 rounded-xl shadow-2xs transition">
                                <TrendingUp className="w-3 h-3" />
                                <span>Statistiques</span>
                              </span>
                              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#6d381e] group-hover:translate-x-0.5 transition" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer Tip */}
                <div className="pt-2 border-t border-[#E9DCD5]/60 flex items-center justify-between text-[11px] text-[#6B7280]">
                  <span>
                    Appuyez sur <kbd className="px-1.5 py-0.5 bg-[#FAF7F2] border border-[#E9DCD5] rounded text-[10px] font-mono">Échap</kbd> pour fermer
                  </span>
                  <span className="font-bold text-[#6d381e]">MARJAD Haute Artisanat</span>
                </div>
              </div>
            ) : (
              /* VUE 2 : STATISTIQUES DÉTAILLÉES DU PRODUIT SÉLECTIONNÉ */
              <div className="flex flex-col max-h-[85vh]">
                {/* Header de la vue statistique */}
                <div className="p-4 sm:p-5 border-b border-[#E9DCD5]/80 bg-[#FAF7F2]/60 flex items-center justify-between gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedProductStats(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6d381e] hover:text-[#542a15] bg-white border border-[#E9DCD5] px-3 py-1.5 rounded-xl hover:bg-white/80 transition cursor-pointer shadow-2xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Retour à la recherche</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#6d381e] bg-[#6d381e]/10 px-2.5 py-0.5 rounded-full">
                      <TrendingUp className="w-3 h-3" />
                      <span>Statistiques Création</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchModalOpen(false);
                        setSelectedProductStats(null);
                        setProductSearchQuery("");
                      }}
                      className="group w-8 h-8 rounded-full border border-[#6d381e] bg-white text-[#6d381e] hover:bg-[#6d381e] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xs cursor-pointer"
                      title="Fermer"
                      aria-label="Fermer"
                    >
                      <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                  </div>
                </div>

                {/* Corps défilable */}
                <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
                  {/* Fiche d'identité de la création */}
                  <div className="flex items-start gap-3.5 sm:gap-4 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E9DCD5]">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#E9DCD5] bg-white shrink-0 shadow-2xs">
                      <Image
                        src={selectedProductStats.image}
                        alt={selectedProductStats.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold text-[#ba4e1a] uppercase tracking-wider bg-[#ba4e1a]/10 px-2 py-0.5 rounded">
                          {selectedProductStats.categoryName}
                        </span>
                        <span className="text-xs text-[#6B7280]">
                          Réf: {selectedProductStats.id}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-[#1F2937] leading-snug">
                        {selectedProductStats.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2.5 mt-2">
                        <span className="text-xs font-extrabold text-[#6d381e]">
                          {selectedProductStats.price} DH
                        </span>
                        <span className="text-[11px] text-[#E9DCD5]">•</span>
                        <span className="text-xs text-[#6B7280]">
                          Stock atelier:{" "}
                          <strong className="text-[#1F2937] font-bold">
                            {selectedProductStats.stock} pièces
                          </strong>
                        </span>
                        <span className="text-[11px] text-[#E9DCD5]">•</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            selectedProductStats.stock <= 0
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : selectedProductStats.stock <= 4
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {selectedProductStats.stock <= 0
                            ? "Rupture"
                            : selectedProductStats.stock <= 4
                            ? "Stock Faible"
                            : "En stock"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 4 Cartes KPI */}
                  {productStatsData && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                      <div className="p-3.5 rounded-2xl border border-[#E9DCD5] bg-white shadow-2xs space-y-1">
                        <div className="flex items-center justify-between text-[#6d381e]">
                          <ShoppingBag className="w-4 h-4" />
                          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Commandes</span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold font-serif text-[#1F2937]">
                          {productStatsData.totalOrdersCount}
                        </p>
                        <p className="text-[10px] text-[#6B7280]">Total traitées</p>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-[#E9DCD5] bg-white shadow-2xs space-y-1">
                        <div className="flex items-center justify-between text-[#ba4e1a]">
                          <Package className="w-4 h-4" />
                          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Ventes</span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold font-serif text-[#1F2937]">
                          {productStatsData.totalSold}
                        </p>
                        <p className="text-[10px] text-[#6B7280]">Unités expédiées</p>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-[#E9DCD5] bg-white shadow-2xs space-y-1">
                        <div className="flex items-center justify-between text-[#C5A059]">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Revenus</span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold font-serif text-[#ba4e1a] truncate">
                          {productStatsData.totalRevenue.toLocaleString()}{" "}
                          <span className="text-xs font-medium">DH</span>
                        </p>
                        <p className="text-[10px] text-[#6B7280]">CA généré</p>
                      </div>

                      <div className="p-3.5 rounded-2xl border border-[#E9DCD5] bg-white shadow-2xs space-y-1">
                        <div className="flex items-center justify-between text-amber-500">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Avis</span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold font-serif text-[#1F2937]">
                          {selectedProductStats.rating || 4.9}{" "}
                          <span className="text-xs text-[#6B7280] font-normal">/ 5</span>
                        </p>
                        <p className="text-[10px] text-[#6B7280]">
                          {selectedProductStats.reviewsCount || 24} avis clients
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Répartition des commandes par Ville au Maroc */}
                  {productStatsData && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1F2937] flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#ba4e1a]" />
                          <span>Répartition des Commandes par Ville (Maroc)</span>
                        </h4>
                        <span className="text-[11px] font-bold text-[#6d381e] bg-[#6d381e]/10 px-2 py-0.5 rounded-full">
                          Top 8 Villes
                        </span>
                      </div>

                      <div className="space-y-2">
                        {productStatsData.sortedCities.map((item, idx) => {
                          const isTop = idx === 0;
                          return (
                            <div
                              key={item.city}
                              className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E9DCD5]/60 space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[#1F2937]">{item.city}</span>
                                  {isTop && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-[#C5A059] text-white px-2 py-0.2 rounded-full shadow-2xs">
                                      N°1 🏆
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2.5">
                                  <span className="text-[11px] font-semibold text-[#1F2937]">
                                    {item.ordersCount} cmds
                                  </span>
                                  <span className="text-[11px] font-bold text-[#6d381e] bg-white px-2 py-0.2 rounded-full border border-[#E9DCD5]">
                                    {item.percentage}%
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-[#E9DCD5]/50 rounded-full h-1.5 overflow-hidden">
                                <div
                                  style={{ width: `${Math.max(6, item.percentage)}%` }}
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isTop
                                      ? "bg-gradient-to-r from-[#C5A059] to-[#D4AF37]"
                                      : "bg-[#6d381e]"
                                  }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Dernières Commandes contenant cette création */}
                  {productStatsData && productStatsData.recentOrders.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1F2937] flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5 text-[#6d381e]" />
                          <span>Dernières Commandes contenant cette Pièce</span>
                        </h4>
                        <Link
                          href={`/admin/commandes?productId=${selectedProductStats.id}&productName=${encodeURIComponent(selectedProductStats.name)}`}
                          onClick={() => setIsSearchModalOpen(false)}
                          className="text-[11px] font-bold text-[#6d381e] hover:underline flex items-center gap-0.5"
                        >
                          <span>Voir dans les commandes</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>

                      <div className="space-y-1.5">
                        {productStatsData.recentOrders.map((ord) => (
                          <div
                            key={ord.id}
                            className="flex items-center justify-between p-2.5 rounded-xl border border-[#E9DCD5]/60 bg-white text-xs"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#1F2937]">{ord.id}</span>
                                <span className="text-[#6B7280]">•</span>
                                <span className="text-[#4B5563] truncate font-medium">{ord.customerName}</span>
                                <span className="text-[10px] text-[#6B7280]">({ord.customerCity})</span>
                              </div>
                              <p className="text-[10px] text-[#6B7280] mt-0.5">{ord.date}</p>
                            </div>
                            <div className="text-right shrink-0 pl-3">
                              <div className="font-bold text-[#6d381e]">{ord.total.toLocaleString()} DH</div>
                              <span className="inline-block text-[9.5px] font-semibold text-[#6d381e] bg-[#6d381e]/10 px-1.5 py-0.2 rounded-full">
                                Qté: {ord.quantity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer du modal de statistiques */}
                <div className="p-4 border-t border-[#E9DCD5]/80 bg-[#FAF7F2]/50 flex items-center justify-between gap-3 shrink-0">
                  <Link
                    href={`/admin/produits?highlight=${selectedProductStats.id}`}
                    onClick={() => setIsSearchModalOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6d381e] hover:underline"
                  >
                    <span>Gérer cette pièce dans le catalogue</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProductStats(null)}
                      className="px-4 py-2 rounded-xl border border-[#E9DCD5] hover:bg-white text-[#1F2937] text-xs font-bold transition cursor-pointer"
                    >
                      Autre pièce
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchModalOpen(false);
                        setSelectedProductStats(null);
                        setProductSearchQuery("");
                      }}
                      className="px-5 py-2 rounded-xl bg-[#6d381e] hover:bg-[#542a15] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
