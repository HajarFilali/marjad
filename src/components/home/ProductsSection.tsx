"use client";

import React from "react";
import Link from "next/link";
import { Award, ArrowRight } from "lucide-react";
import { DECOR_PRODUCTS } from "@/data/mockProducts";
import { ProductCard } from "@/components/product/ProductCard";

interface ProductsSectionProps {
  selectedCategory?: string;
}

export function ProductsSection({ selectedCategory = "all" }: ProductsSectionProps) {
  // Filter products if a category is selected, otherwise take all decor products
  const filteredProducts =
    selectedCategory === "all"
      ? DECOR_PRODUCTS
      : DECOR_PRODUCTS.filter((p) =>
          p.category.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  const pool = filteredProducts.length > 0 ? filteredProducts : DECOR_PRODUCTS;
  // Exactly 2 rows of 4 products = 8 products
  const displayProducts = pool.slice(0, 8);

  return (
    <section
      id="boutique"
      className="scroll-mt-24 sm:scroll-mt-28 pt-3 pb-5 sm:pb-6 lg:pb-8 bg-[#ffffff] relative overflow-hidden"
    >
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#fbf5ee] rounded-full blur-3xl pointer-events-none -z-10 opacity-70" />

      {/* ================= SECTION HEADER ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#ba4e1a] inline-flex items-center gap-1.5 bg-[#ba4e1a]/8 px-3.5 py-1.5 rounded-full border border-[#ba4e1a]/15">
          <Award className="w-3.5 h-3.5 text-[#ba4e1a] stroke-[2.2]" />
          Collection Artisanale Phare
        </span>

        <h2 className="mt-2.5 text-3xl sm:text-4xl lg:text-[42px] font-serif font-black text-[#1c1917] tracking-tight">
          Nos Pièces de Décoration
        </h2>

        <p className="mt-2 text-sm sm:text-base text-[#1c1917]/70 font-medium max-w-2xl mx-auto">
          Découvrez notre sélection exclusive de créations faites main, alliant l&apos;authenticité des matières nobles au raffinement du design marocain.
        </p>
      </div>

      {/* ================= 2 ROWS OF 4 PRODUCTS (8 PRODUCTS TOTAL) ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* ================= BUTTON: VOIR TOUTE LA BOUTIQUE ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 flex justify-center">
        <Link
          href="/boutique"
          className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#ba4e1a] to-[#9c3a0c] hover:from-[#9c3a0c] hover:to-[#822f08] text-white font-extrabold text-sm transition-all duration-300 shadow-md shadow-[#ba4e1a]/25 hover:shadow-lg hover:shadow-[#ba4e1a]/35 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
        >
          <span>Voir toute la boutique</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
