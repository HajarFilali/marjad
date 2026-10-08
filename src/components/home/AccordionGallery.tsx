"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Palette } from "lucide-react";

export interface CategoryPanel {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  craft: string;
  count: number;
  image: string;
  description: string;
}

export const CATEGORIES: CategoryPanel[] = [
  {
    id: "calligraphie",
    slug: "calligraphie",
    name: "Calligraphie Murale",
    nameAr: "خط عربي ولوحات مذهبة",
    craft: "Bois noble & Dorure 24K",
    count: 2,
    image: "/decor-honeycomb-calligraphy.webp",
    description: "Compositions alvéolaires 'سبحان الله وبحمده' gravées en relief selon la tradition marocaine.",
  },
  {
    id: "etagere",
    slug: "etagere",
    name: "Étagères & Mobilier Mural",
    nameAr: "رفوف جدارية فاخرة",
    craft: "Noyer massif & Laiton",
    count: 2,
    image: "/decor-alhamdulillah-shelf.webp",
    description: "Consoles murales 'الحمد لله رب العالمين' en noyer sauvage d'Atlas et plateau en laiton doré.",
  },
  {
    id: "arche",
    slug: "arche",
    name: "Arches & Panneaux",
    nameAr: "أقواس أندلسية محفورة",
    craft: "Cèdre de l'Atlas parfumé",
    count: 2,
    image: "/decor-ya-allah-arch.webp",
    description: "Arches mauresques cintrées 'يا الله' inspirées des mihrabs andalous et des médersas de Fès.",
  },
  {
    id: "miroir",
    slug: "miroir",
    name: "Miroirs d'Art",
    nameAr: "مرايا شمسية أصيلة",
    craft: "Miroiterie & Ébénisterie",
    count: 2,
    image: "/decor-sunburst-mirror.webp",
    description: "Miroirs solaires rayonnants assemblés en segments de bois précieux et sertissage de laiton.",
  },
  {
    id: "medaillon",
    slug: "medaillon",
    name: "Médaillons & Reliefs",
    nameAr: "دروع وميداليات دائرية",
    craft: "Chêne sculpté & Cire d'abeille",
    count: 2,
    image: "/decor-gold-medallion.webp",
    description: "Médaillons d'apparat circulaires ciselés au burin avec arabesques royales et patine dorée.",
  },
];

interface AccordionGalleryProps {
  onSelectCategory?: (slug: string) => void;
}

export function AccordionGallery({ onSelectCategory }: AccordionGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const router = useRouter();

  const handleCardClick = (index: number, cat: CategoryPanel) => {
    if (activeIndex === index) {
      if (onSelectCategory) {
        onSelectCategory(cat.slug);
      }
      router.push(`/boutique?category=${cat.id}`);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <section id="categories" className="pt-10 pb-12 sm:pt-14 sm:pb-14 bg-[#ffffff] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ba4e1a] inline-flex items-center gap-1.5 bg-[#ba4e1a]/8 px-3.5 py-1.5 rounded-full border border-[#ba4e1a]/15">
            <Palette className="w-3.5 h-3.5 text-[#ba4e1a] stroke-[2.2]" />
            Métiers & Savoir-Faire
          </span>
          <h2 className="mt-2.5 text-3xl sm:text-4xl lg:text-[42px] font-serif font-black text-[#1c1917] tracking-tight">
            Nos Collections d&apos;Artisanat
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#1c1917]/70 font-medium">
            Survolez ou cliquez sur une catégorie pour visualiser nos créations intégrées dans un salon marocain d&apos;exception.
          </p>
        </div>

        {/* Reactbits Accordion Gallery Container */}
        <div className="flex flex-col md:flex-row h-[500px] md:h-[440px] w-full gap-2 sm:gap-2.5 p-1">
          {CATEGORIES.map((cat, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={cat.id}
                onClick={() => handleCardClick(index, cat)}
                onMouseEnter={() => setActiveIndex(index)}
                title={isActive ? `Voir la boutique filtrée par ${cat.name}` : `Découvrir ${cat.name}`}
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-out select-none group border border-[#ebd8be]/70 shadow-sm ${
                  isActive
                    ? "flex-[4] shadow-[0_16px_36px_-8px_rgba(0,0,0,0.30),0_4px_16px_rgba(0,0,0,0.12)]"
                    : "flex-1 opacity-90 hover:opacity-100 shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
                }`}
              >
                {/* 1. Photorealistic Moroccan Salon Room Background (Identique à l'effet hover de la liste des produits) */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <Image
                    src="/images/salon-card-hover.webp"
                    alt="Salon marocain d'ambiance"
                    fill
                    sizes="(max-width: 768px) 100vw, 35vw"
                    className={`object-cover object-[center_35%] transition-transform duration-700 ease-out ${
                      isActive ? "scale-108" : "scale-100 brightness-95"
                    }`}
                  />
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* 2. Product Art Piece mounted directly on the Salon Wall (m3elleq f l-hit, pas f s-sqef) */}
                <div className="absolute inset-x-0 top-[24%] sm:top-[26%] z-10 flex items-center justify-center pointer-events-none">
                  <div
                    className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center ${
                      isActive
                        ? "scale-100"
                        : "scale-85 opacity-90"
                    }`}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      width={180}
                      height={180}
                      className={`object-contain ${
                        cat.id === "arche" || cat.id === "miroir" || cat.id === "medaillon"
                          ? "max-h-[96px] sm:max-h-[105px] md:max-h-[112px]"
                          : "max-h-[80px] sm:max-h-[90px] md:max-h-[96px] max-w-[155px] sm:max-w-[175px]"
                      } w-auto drop-shadow-[0_10px_18px_rgba(0,0,0,0.65)] transition-all duration-700`}
                    />
                  </div>
                </div>

                {/* 3. Dark/Warm Gradient Bottom Overlay for Maximum Typography Contrast */}
                <div
                  className={`absolute inset-0 z-20 transition-opacity duration-500 pointer-events-none ${
                    isActive
                      ? "bg-gradient-to-t from-[#000000]/95 via-[#000000]/55 to-transparent"
                      : "bg-gradient-to-t from-[#000000]/85 via-[#000000]/30 to-transparent"
                  }`}
                />

                {/* Content for Inactive Panel (Vertical Title on Desktop) */}
                {!isActive && (
                  <div className="absolute inset-0 z-30 flex flex-col justify-end items-center p-4 pb-6 pointer-events-none">
                    <span className="hidden md:block text-xs font-bold uppercase tracking-widest text-[#ffffff] [writing-mode:vertical-rl] rotate-180 mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {cat.name}
                    </span>
                    <span className="md:hidden text-xs font-bold text-[#ffffff] text-center drop-shadow-md">
                      {cat.name}
                    </span>
                  </div>
                )}

                {/* Content for Active Panel */}
                {isActive && (
                  <div className="absolute inset-0 z-30 p-5 sm:p-7 flex flex-col justify-end text-white animate-in fade-in duration-500">
                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-3 py-1 text-[11px] font-bold tracking-wider uppercase rounded-full bg-[#d4a853] text-[#000000] shadow-xs">
                        {cat.craft}
                      </span>
                      <span className="text-xs text-[#ffffff]/90 font-medium drop-shadow-xs">
                        • {cat.count} Créations
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#ffffff] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                      {cat.name}
                    </h3>

                    {/* Description */}
                    <p className="mt-1.5 text-xs sm:text-sm text-[#ffffff]/95 max-w-md line-clamp-2 leading-relaxed font-medium drop-shadow-xs">
                      {cat.description}
                    </p>

                    {/* Action Link: Navigate to Boutique filtered by this category */}
                    <div className="mt-3.5 pt-1">
                      <Link
                        href={`/boutique?category=${cat.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectCategory) onSelectCategory(cat.slug);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c4622d] hover:bg-[#9e461a] text-[#ffffff] text-xs font-bold transition-all shadow-md active:scale-95 group/btn cursor-pointer"
                      >
                        <span>Voir les articles</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
