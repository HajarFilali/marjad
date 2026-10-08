"use client";

import React, { useRef, useEffect } from "react";
import WallArtGallery from "@/components/home/WallArtGallery";

export function HeroSection() {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateGradient = () => {
      if (!gradientRef.current) return;
      const scrollY = window.scrollY;

      // Start fading in progressively after 20px, fully visible by 200px
      const rawProgress = Math.min(1, Math.max(0, (scrollY - 20) / 180));
      // Organic smoothstep easing (zero sudden jump, soft acceleration, silky landing)
      const progress = rawProgress * rawProgress * (3 - 2 * rawProgress);

      gradientRef.current.style.opacity = progress.toFixed(3);
      // Subtle upward glide of 22px as user scrolls down
      const translateY = ((1 - progress) * 22).toFixed(1);
      gradientRef.current.style.transform = `translateY(${translateY}px)`;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateGradient);
        ticking = true;
      }
    };

    // Run on initial mount
    updateGradient();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#faf7f2] pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12 min-h-[610px] lg:h-[calc(100vh-20px)] lg:min-h-[660px] max-h-[770px] flex items-center">
      
      {/* 1. Salon Background Image: nette et sans aucun filtre d'assombrissement */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: "url('/hero-moroccan-salon.webp')",
          backgroundPosition: "center 45%",
        }}
      />

      {/* 2. Tableaux fixés sur le mur du fond à droite (en face, évitant totalement le mur incliné de gauche) */}
      <div className="absolute top-[136px] sm:top-[144px] lg:top-[148px] right-[4%] sm:right-[6%] md:right-[8%] lg:right-[10%] xl:right-[12%] z-20 pointer-events-auto w-[90vw] max-w-[340px] sm:w-[380px] lg:w-[420px]">
        <WallArtGallery />
      </div>

      {/* 3. Main Content Container: Espace réservé pour la carte fusionnée à la Navbar */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 pointer-events-none">
        <div className="w-full max-w-[385px] sm:max-w-[445px] lg:max-w-[485px] min-h-[260px] sm:min-h-[280px]" />
      </div>

      {/* 4. Seamless Organic Scroll-Driven Dissolve to Pure White (#ffffff) */}
      <div
        ref={gradientRef}
        className="absolute bottom-0 left-0 right-0 h-32 sm:h-44 lg:h-56 pointer-events-none z-10 transition-[opacity,transform] duration-500 ease-out"
        style={{
          opacity: 0,
          transform: "translateY(22px)",
          willChange: "opacity, transform",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.16) 26%, rgba(255, 255, 255, 0.58) 58%, rgba(255, 255, 255, 0.92) 85%, #ffffff 100%)",
        }}
      />
    </section>
  );
}
