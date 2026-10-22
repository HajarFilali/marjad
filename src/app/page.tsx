"use client";

import React, { useState } from "react";
import { MarjadIntroLoader } from "@/components/home/MarjadIntroLoader";
import { HeroSection } from "@/components/home/HeroSection";
import { AccordionGallery } from "@/components/home/AccordionGallery";
import { ProductsSection } from "@/components/home/ProductsSection";
import { AboutSection } from "@/components/home/AboutSection";
import { CustomerVideosSection } from "@/components/home/CustomerVideosSection";
import { ContactSection } from "@/components/home/ContactSection";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    const boutiqueEl = document.getElementById("boutique");
    boutiqueEl?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#ffffff]">
      {/* 0. Motion Logo Intro Loader */}
      <MarjadIntroLoader />

      {/* 1. Hero Section (Screenshot 3 Layout) */}
      <HeroSection />

      {/* 2. Categories Accordion Gallery (Reactbits Accordion Gallery) */}
      <AccordionGallery onSelectCategory={handleCategorySelect} />

      {/* 3. Products Section (Screenshot 2 Layout: 6 products 3x2) */}
      <ProductsSection selectedCategory={selectedCategory} />

      {/* 4. À Propos Section (Screenshot 1 Layout: Sliced Mosaic Image Collage) */}
      <AboutSection />

      {/* 5. Expériences Clients en Vidéo (Customer Videos / Reels Section) */}
      <CustomerVideosSection />

      {/* 6. Contact & Confection Sur-Mesure Section */}
      <ContactSection />
    </div>
  );
}
