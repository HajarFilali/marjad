"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Vérification de la session administrateur
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("marjad_admin_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push("/login");
      }
    }
  }, [router]);

  // Écran de chargement sécurisé
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#ba4e1a] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-[#6d381e]/80 uppercase tracking-widest font-sans">
            Chargement de la Direction Générale...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#FAF6F0] flex flex-col lg:flex-row antialiased selection:bg-[#ba4e1a] selection:text-white overflow-hidden">
      {/* Sidebar persistante avec courbures d'onglets intégrées */}
      <Suspense fallback={<aside className="w-64 bg-[#FAF6F0] hidden lg:block" />}>
        <AdminSidebar
          pendingOrdersCount={0}
          totalProductsCount={93}
        />
      </Suspense>

      {/* Canevas de contenu blanc arrondi, encadré par le fond doux MARJAD */}
      <div className="flex-1 flex flex-col min-w-0 py-2.5 sm:py-3.5 lg:py-4 pr-2.5 sm:pr-3.5 lg:pr-4 pl-0 h-full">
        <main className="flex-1 flex flex-col min-w-0 bg-white rounded-[22px] sm:rounded-[28px] lg:rounded-[34px] overflow-y-auto overflow-x-hidden relative z-10 border-0 shadow-none h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
