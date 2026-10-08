"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface CarouselCard {
  id: number;
  title: string;
  category: string;
  image: string;
}

const CARDS: CarouselCard[] = [
  {
    id: 0,
    title: "Cuivre Ciselé",
    category: "Lanterne royale de Marrakech",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 1,
    title: "Tapis Beni Ourain",
    category: "Pure laine de l'Atlas",
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Zellige de Fès",
    category: "Mosaïque taillée au menqach",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Pouf en Cuir",
    category: "Tannage végétal cousu main",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=900&auto=format&fit=crop",
  },
];

export default function HeroCarousel() {
  const [rotation, setRotation] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Clockwise motion: Slot 0 -> Slot 1 -> Slot 2 -> Slot 3 -> Slot 0
  // Faster interval (2200ms) as requested so cards rotate dynamically without waiting too long
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 4);
    }, 2200);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      className="relative w-full flex items-center justify-center lg:justify-end select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Compact container to ensure 100% full visibility without vertical overflow */}
      <div className="relative w-[300px] h-[285px] sm:w-[410px] sm:h-[365px] lg:w-[515px] lg:h-[435px] xl:w-[555px] xl:h-[455px] 2xl:w-[600px] 2xl:h-[485px] overflow-visible">
        
        {/* Responsive Transform Wrapper */}
        <div className="absolute inset-0 origin-top-left scale-[0.58] sm:scale-[0.80] lg:scale-100 w-[515px] h-[435px] xl:w-[555px] xl:h-[455px] 2xl:w-[600px] 2xl:h-[485px]">
          
          {/* The 4 Animated Carousel Cards (No borders, scaled, clean rounded corners) */}
          {CARDS.map((card, idx) => {
            const currentSlot = (idx + rotation) % 4;
            const slotClass = `hero-slot-${currentSlot}`;

            return (
              <div
                key={card.id}
                className={`hero-card-animated ${slotClass} shadow-lg bg-[#faf7f2] cursor-pointer group`}
                onClick={() => setRotation((prev) => (prev + 1) % 4)}
                title="Cliquez pour faire tourner"
              >
                <div className="relative w-full h-full rounded-[26px] overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 360px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={idx === 0}
                  />

                  {/* Subtle Gradient Overlay with Title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/75 via-[#000000]/15 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-white">
                    <span className="text-xs sm:text-sm font-bold tracking-wide drop-shadow-sm">
                      {card.title}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#ebd8be] line-clamp-1 drop-shadow-xs">
                      {card.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
}
