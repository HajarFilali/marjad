"use client";

import React, { useEffect, useState } from "react";
import { ShoppingBag, Users, ChevronDown } from "lucide-react";
import WallArtGallery from "@/components/home/WallArtGallery";

export function HeroSectionV2() {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Dès que l'utilisateur commence à scroller (> 20px), la révélation s'active
      setIsRevealed(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToCatalogue = () => {
    const el = document.getElementById("boutique");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToAbout = () => {
    const el = document.getElementById("a-propos");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTriggerReveal = () => {
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  return (
    <div className="relative w-full h-[145vh]">
      {/* Conteneur Sticky plein écran pour animer le hero lors du défilement */}
      <section className="sticky top-0 w-full h-screen min-h-[580px] max-h-[920px] overflow-hidden bg-[#faf7f2] flex items-center pt-16 sm:pt-20">
        
        {/* 1. Salon Background Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: "url('/hero-moroccan-salon.webp')",
            backgroundPosition: "center 45%",
            transform: isRevealed ? "scale(1.02)" : "scale(1)",
          }}
        />

        {/* 2. Tableaux fixés sur le mur du fond à droite (en face, évitant totalement le mur incliné de gauche) */}
        <div className="absolute top-[136px] sm:top-[144px] lg:top-[148px] right-[4%] sm:right-[6%] md:right-[8%] lg:right-[10%] xl:right-[12%] z-10 pointer-events-auto w-[90vw] max-w-[340px] sm:w-[380px] lg:w-[420px]">
          <WallArtGallery />
        </div>

        {/* 3. Frosted Glass Voile Adouci (Effet dépoli léger et subtil, sans couvrir excessivement l'image) */}
        {/* S'active au scroll : flou doux de 6px avec voile translucide très léger */}
        <div
          className={`absolute inset-0 z-15 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none ${
            isRevealed ? "opacity-100 backdrop-blur-[6px]" : "opacity-0 backdrop-blur-none"
          }`}
          style={{
            background: isRevealed
              ? "linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(250, 247, 242, 0.08) 100%)"
              : "transparent",
          }}
        />

        {/* 4. Main Content Container (Typographie libre et aérée directement sur l'image floutée, SANS div/carte fermée) */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
          <div
            className={`max-w-xl flex flex-col justify-center space-y-4 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isRevealed
                ? "translate-y-0 opacity-100 pointer-events-auto"
                : "translate-y-20 opacity-0 pointer-events-none"
            }`}
          >
            {/* Étape 1 : Tagline Badge (Monte en premier) */}
            <div
              className={`inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full shadow-2xs transition-all duration-700 ease-out delay-100 ${
                isRevealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{
                background: "rgba(255, 255, 255, 0.65)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[#c4622d] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#c4622d]">
                Sélection artisanale · COD Maroc
              </span>
            </div>

            {/* Étape 2 : Headline (Directement sur l'image floutée, grand et majestueux) */}
            <h1
              className={`text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-serif font-black tracking-tight text-[#1c1917] leading-[1.12] transition-all duration-700 ease-out delay-250 ${
                isRevealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              Maison marocaine, <br />
              <span className="text-[#c4622d]">calme moderne</span>
            </h1>

            {/* Étape 3 : Moroccan Accent Line */}
            <div
              className={`flex items-center gap-2 text-[#d4a853] transition-all duration-700 ease-out delay-400 ${
                isRevealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <span className="text-base select-none">◇</span>
              <div className="w-16 h-px bg-gradient-to-r from-[#d4a853]/70 to-transparent" />
            </div>

            {/* Étape 4 : Subtitle (Texte fluide et ouvert) */}
            <p
              className={`text-sm sm:text-base text-[#383431] leading-relaxed font-medium max-w-lg transition-all duration-700 ease-out delay-550 ${
                isRevealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              Sélection d&apos;artisanat et de décoration d&apos;exception, pensée pour des intérieurs apaisés et authentiques.
            </p>

            {/* Étape 5 : 2 Boutons d'Action (1 mot chacun, sur une seule ligne) */}
            <div
              className={`flex flex-row items-center gap-3 pt-2 transition-all duration-700 ease-out delay-700 ${
                isRevealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              {/* Bouton 1 : Boutique */}
              <button
                onClick={handleScrollToCatalogue}
                className="px-6 py-3 bg-[#c4622d] hover:bg-[#9e461a] text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-sm shadow-[#c4622d]/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Boutique</span>
              </button>

              {/* Bouton 2 : Artisans */}
              <button
                onClick={handleScrollToAbout}
                className="px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#1c1917] hover:text-[#c4622d] active:scale-95 cursor-pointer hover:bg-white/60 whitespace-nowrap"
                style={{
                  background: "rgba(255, 255, 255, 0.55)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                }}
              >
                <Users className="w-4 h-4 text-[#57534e]" />
                <span>Artisans</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5. Animated Mouse Scroll Indicator (Couleurs du Logo MARJAD : Or #d4a853 & Terracotta #c4622d) */}
        {/* Surélevée pour être bien visible, et animée pour inviter au clic et au défilement */}
        <button
          onClick={handleTriggerReveal}
          className={`absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 z-25 flex flex-col items-center gap-1 cursor-pointer transition-all duration-500 select-none group focus:outline-none ${
            isRevealed ? "opacity-0 pointer-events-none translate-y-4" : "opacity-95 hover:opacity-100"
          }`}
          aria-label="Cliquer ou faire défiler pour découvrir"
        >
          {/* Silhouette de la souris aux couleurs du logo MARJAD */}
          <div
            className="w-6 h-10 rounded-full border-2 border-[#c4622d] flex items-start justify-center p-1 shadow-md backdrop-blur-md bg-white/40 group-hover:scale-110 group-hover:border-[#d4a853] transition-all duration-300"
            style={{
              boxShadow: "0 4px 16px rgba(196, 98, 45, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.8)",
            }}
          >
            {/* Molette animée (Dégradé Or #d4a853 & Terracotta #c4622d qui rebondit pour simuler le défilement et le clic) */}
            <div className="w-1.5 h-2.5 rounded-full bg-gradient-to-b from-[#d4a853] to-[#c4622d] animate-bounce shadow-xs" />
          </div>

          {/* Flèche subtile vers le bas qui palpite pour indiquer de cliquer pour descendre */}
          <ChevronDown className="w-4 h-4 text-[#c4622d] group-hover:text-[#d4a853] transition-colors duration-300 animate-pulse" />
        </button>

        {/* Seamless Transition Gradient Dissolve to Pure White (#ffffff) */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-32 sm:h-44 lg:h-52 pointer-events-none z-10 transition-opacity duration-600 ease-out ${
            isRevealed ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.18) 28%, rgba(255, 255, 255, 0.60) 60%, rgba(255, 255, 255, 0.92) 85%, #ffffff 100%)",
          }}
        />
      </section>
    </div>
  );
}
