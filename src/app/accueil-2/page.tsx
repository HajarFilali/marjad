"use client";

import React, { useState } from "react";
import { HeroSectionV2 } from "@/components/home/HeroSectionV2";
import { AccordionGallery } from "@/components/home/AccordionGallery";
import { ProductsSection } from "@/components/home/ProductsSection";
import { AboutSection } from "@/components/home/AboutSection";
import { CustomerVideosSection } from "@/components/home/CustomerVideosSection";
import { ContactSection } from "@/components/home/ContactSection";

export default function Accueil2Page() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    const boutiqueEl = document.getElementById("boutique");
    boutiqueEl?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#ffffff]">
      {/* 1. Hero Section V2 (Animation Scroll : Salon épuré au départ, puis flou de verre et texte montant progressivement) */}
      <HeroSectionV2 />

      {/* 2. Categories Accordion Gallery */}
      <AccordionGallery onSelectCategory={handleCategorySelect} />

      {/* 3. Products Section (Catalogue) */}
      <ProductsSection selectedCategory={selectedCategory} />

      {/* 4. À Propos Section (Artisans et Savoir-Faire) */}
      <AboutSection />

      {/* 5. Customer Videos / Reels Section */}
      <CustomerVideosSection />

      {/* 6. Online Contact Section */}
      <ContactSection />
    </div>
  );
}
