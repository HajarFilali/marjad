"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface DecorItem {
  id: number;
  title: string;
  image: string;
  widthClass: string;
  positionClass: string;
  delay: number;
}

// 5 Décorations murales réelles MARJAD
// Les 4 tableaux originaux sont maintenus exactement à leurs positions et tailles d'origine.
// Le nouveau tableau vertical "يا الله" est ajouté sur leur gauche et légèrement agrandi pour une présence murale élégante.
//
// Ordre d'apparition séquentiel (intervalle d'1s) :
// 1. "سبحان الله وبحمده" (Honeycomb)
// 2. "الحمد لله رب العالمين" (Étagère bois)
// 3. Panneau cintré vertical "يا الله" (Nouveau tableau agrandi, à gauche)
// 4. Miroir Soleil Artisanal (Rond en haut à droite)
// 5. Médaillon Calligraphie Royale (Rond au centre-gauche)
const WALL_DECORS: DecorItem[] = [
  {
    id: 1,
    title: "سبحان الله وبحمده",
    image: "/decor-honeycomb-calligraphy.webp",
    widthClass: "w-[120px] sm:w-[138px] lg:w-[155px]",
    positionClass: "top-[6px] sm:top-[8px] left-0",
    delay: 500,
  },
  {
    id: 2,
    title: "الحمد لله رب العالمين",
    image: "/decor-alhamdulillah-shelf.webp",
    widthClass: "w-[130px] sm:w-[150px] lg:w-[170px]",
    positionClass: "top-[76px] sm:top-[86px] lg:top-[96px] right-0",
    delay: 1500,
  },
  {
    id: 3,
    title: "لوحة يا الله الخشبية العريقة",
    image: "/decor-ya-allah-arch.webp",
    widthClass: "w-[72px] sm:w-[85px] lg:w-[98px]",
    positionClass: "top-[10px] sm:top-[12px] lg:top-[14px] -left-[84px] sm:-left-[100px] lg:-left-[116px]",
    delay: 2500,
  },
  {
    id: 4,
    title: "Miroir Soleil Artisanal",
    image: "/decor-sunburst-mirror.webp",
    widthClass: "w-[56px] sm:w-[64px] lg:w-[72px]",
    positionClass: "top-0 right-[28px] sm:right-[42px] lg:right-[58px]",
    delay: 3500,
  },
  {
    id: 5,
    title: "Médaillon Calligraphie Royale",
    image: "/decor-gold-medallion.webp",
    widthClass: "w-[56px] sm:w-[64px] lg:w-[72px]",
    positionClass: "top-[62px] sm:top-[70px] lg:top-[78px] left-[6px] sm:left-[10px]",
    delay: 4500,
  },
];

export default function WallArtGallery() {
  const [visibleCount, setVisibleCount] = useState<number>(0);

  // Animation séquentielle selon l'ordre exact demandé par l'utilisateur (intervalle d'1 seconde)
  useEffect(() => {
    setVisibleCount(0);
    const t1 = setTimeout(() => setVisibleCount(1), 500);
    const t2 = setTimeout(() => setVisibleCount(2), 1500);
    const t3 = setTimeout(() => setVisibleCount(3), 2500);
    const t4 = setTimeout(() => setVisibleCount(4), 3500);
    const t5 = setTimeout(() => setVisibleCount(5), 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleScrollToCatalogue = () => {
    const el = document.getElementById("boutique");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full select-none">
      
      {/* Conteneur mural : Placé haut sur le mur d'en face, sans aucun contact avec les canapés */}
      <div className="relative h-[155px] sm:h-[175px] lg:h-[195px] w-full">
        {WALL_DECORS.map((item, index) => {
          const isVisible = visibleCount > index;

          return (
            <div
              key={item.id}
              className={`absolute ${item.positionClass} transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-90 -translate-y-3 pointer-events-none"
              }`}
              style={{ zIndex: 20 + index }}
              onClick={handleScrollToCatalogue}
            >
              {/* Objet Décoratif : collé directement sur le mur avec ombre nette et hover scale sans texte */}
              <div
                className={`relative ${item.widthClass} cursor-pointer group transition-transform duration-300 hover:scale-108 active:scale-95`}
                style={{
                  filter:
                    "drop-shadow(0 5px 8px rgba(0,0,0,0.24)) drop-shadow(0 2px 3px rgba(0,0,0,0.14))",
                }}
              >
                <div className="relative w-full aspect-auto">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={260}
                    height={190}
                    priority
                    className="w-full h-auto object-contain transition-all duration-300 group-hover:brightness-105"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
