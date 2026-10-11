"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  MessageSquare,
  Video,
  Menu,
  X,
  Headphones,
  ArrowUpRight,
  Home,
} from "lucide-react";

interface AdminSidebarProps {
  pendingOrdersCount?: number;
  totalProductsCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  pendingOrdersCount = 0,
  totalProductsCount = 93,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get("returnUrl");
  const fromParam = searchParams?.get("from");

  // Determine if the user is in the category form but came from the product form
  const [isFromProduits, setIsFromProduits] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedNav = sessionStorage.getItem("marjad_nav_from_product");
      const hasDraft = !!localStorage.getItem("marjad_product_form_draft");
      const isComingFromProd =
        fromParam === "product" ||
        !!returnUrl?.includes("/admin/produits") ||
        !!storedNav?.includes("/admin/produits") ||
        hasDraft;

      setIsFromProduits(
        Boolean(pathname?.startsWith("/admin/categories/new") && isComingFromProd)
      );
    }
  }, [pathname, returnUrl, fromParam]);

  const mainNavItems = [
    {
      label: "Tableau de bord",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Produits",
      href: "/admin/produits",
      icon: Package,
      badge: totalProductsCount.toString(),
    },
    {
      label: "Catégories",
      href: "/admin/categories",
      icon: Layers,
      badge: "6",
    },
    {
      label: "Commandes",
      href: "/admin/commandes",
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined,
      badgeHighlight: true,
    },
    {
      label: "Commentaires",
      href: "/admin/commentaires",
      icon: MessageSquare,
    },
    {
      label: "Vidéos",
      href: "/admin/videos",
      icon: Video,
    },
  ];

  const isActive = (href: string, exact = false) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/";
    }
    // When in category creation originating from a product form, keep Produits highlighted!
    if (isFromProduits) {
      if (href === "/admin/produits") return true;
      if (href === "/admin/categories") return false;
    }
    if (exact) return pathname === href;
    return pathname?.startsWith(href);
  };

  const renderActiveNotches = () => (
    <>
      {/* Courbure supérieure inversée : transition fluide et continue vers le canevas blanc */}
      <svg
        className="hidden lg:block absolute -top-8 right-0 w-8 h-8 pointer-events-none z-30"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 32C17.673 32 32 14.327 32 0V32H0Z"
          fill="#FFFFFF"
        />
      </svg>
      {/* Courbure inférieure inversée */}
      <svg
        className="hidden lg:block absolute -bottom-8 right-0 w-8 h-8 pointer-events-none z-30"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0C17.673 0 32 17.673 32 32V0H0Z"
          fill="#FFFFFF"
        />
      </svg>
    </>
  );

  const navContent = (
    <div className="flex flex-col justify-between h-full bg-[#FAF6F0] text-[#6d381e] select-none relative overflow-y-auto lg:overflow-visible py-3">
      {/* Logo & Navigation */}
      <div className="space-y-3">
        {/* Brand Header: Logo MARJAD officiel */}
        <div className="px-4 pt-2.5 pb-1.5">
          <div className="flex items-center justify-center relative py-1">
            <Link
              href="/"
              className="flex items-center justify-center group"
              title="MARJAD - Sélection Artisanale"
            >
              <Image
                src="/logo.png"
                alt="MARJAD"
                width={170}
                height={46}
                priority
                className="h-9 w-auto object-contain group-hover:scale-102 transition-transform duration-200"
              />
            </Link>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="space-y-1 relative">
          {mainNavItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <div key={item.label} className="relative">
                {active && renderActiveNotches()}
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`cursor-pointer ${
                    active
                      ? "bg-white text-[#ba4e1a] font-bold rounded-l-full ml-3 w-[calc(100%-0.75rem)] pl-4 pr-5 py-2.5 relative z-30 flex items-center justify-between shadow-2xs"
                      : "text-[#6d381e]/80 hover:text-[#6d381e] hover:bg-white/50 transition-colors duration-150 mx-3 px-3.5 py-2 rounded-2xl font-medium flex items-center justify-between"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        active
                          ? "bg-[#FAF6F0] text-[#ba4e1a]"
                          : "text-[#6d381e]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="tracking-wide text-[13px] font-semibold">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        active
                          ? "bg-[#FAF6F0] text-[#ba4e1a] border border-[#ebd8be]"
                          : item.badgeHighlight
                          ? "bg-[#ba4e1a] text-white shadow-xs"
                          : "bg-white/80 text-[#6d381e] border border-[#ebd8be]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Section inférieure: Retour à l'accueil & Support */}
      <div className="px-3.5 space-y-2 pt-2 pb-1 border-t border-[#ebd8be]/60">
        {/* Bouton Retour à l'accueil */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-3.5 rounded-2xl bg-white hover:bg-[#FFFDFB] text-[#6d381e] border border-[#ebd8be] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between group cursor-pointer hover:scale-[1.01]"
          title="Retourner à l'accueil du site pour voir la boutique"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#FAF6F0] border border-[#ebd8be] flex items-center justify-center text-[#ba4e1a] group-hover:scale-105 transition-transform shrink-0">
              <Home className="w-3.5 h-3.5 text-[#ba4e1a]" />
            </div>
            <div className="text-left">
              <span className="block leading-tight font-bold text-xs text-[#ba4e1a]">
                Retour à l&apos;accueil
              </span>
              <span className="text-[10px] text-[#6d381e]/70 font-medium block">
                Voir le site en direct
              </span>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#ba4e1a] transition-transform shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        {/* Ligne Support 24/7 */}
        <div className="flex items-center justify-between px-2 py-0.5 text-[10.5px] text-[#6d381e]/75">
          <div className="flex items-center gap-1.5 font-medium">
            <Headphones className="w-3 h-3 text-[#6d381e]" />
            <span>Support 24/7 Marjad</span>
          </div>
          <span className="flex items-center gap-1 text-[9.5px] text-emerald-600 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            En ligne
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Header mobile avec menu burger */}
      <div className="lg:hidden bg-[#FAF6F0] text-[#6d381e] px-4 py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-2xs border-b border-[#ebd8be]">
        <Link href="/admin" className="flex items-center">
          <Image
            src="/logo.png"
            alt="MARJAD"
            width={130}
            height={36}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#6d381e] hover:bg-white/40 rounded-xl transition cursor-pointer"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-72 sm:w-80 h-full bg-[#FAF6F0] shadow-2xl ml-0"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-68 xl:w-72 bg-[#FAF6F0] shrink-0 sticky top-0 h-screen">
        {navContent}
      </aside>
    </>
  );
};
