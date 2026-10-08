"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Ruler, Clock } from "lucide-react";

export function ContactSection() {
  return (
    <section
      id="atelier-sur-mesure"
      className="w-full bg-[#ffffff] py-16 sm:py-20 lg:py-26 relative overflow-hidden"
    >
      {/* ========================================================================= */}
      {/* BULLES D'AMBIANCE EN ARRIÈRE-PLAN (Fouqa3at aux teintes MARJAD)            */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* 1. Bulle centrale douce en beige/sable clair derrière le texte */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[560px] h-[340px] sm:h-[460px] rounded-full bg-gradient-to-tr from-[#fcf6ee] via-[#f7ebd8]/55 to-[#fdf9f4] blur-3xl opacity-85"
        />

        {/* 2. Bulle d'ambiance terracotta/marron doux côté gauche */}
        <div
          aria-hidden="true"
          className="absolute -left-16 sm:-left-24 top-1/4 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-br from-[#c4622d]/14 via-[#e07f4b]/9 to-transparent blur-2xl opacity-60"
        />

        {/* 3. Bulle circulaire texturée flottante côté gauche bas */}
        <div
          aria-hidden="true"
          className="absolute left-6 sm:left-20 bottom-10 sm:bottom-14 w-24 sm:w-36 h-24 sm:h-36 rounded-full bg-gradient-to-tr from-[#c4622d]/10 via-[#ebd8be]/25 to-white/60 border border-[#c4622d]/15 shadow-sm blur-[1px] opacity-75 animate-bubble-float"
        />

        {/* 4. Petite bulle discrète côté gauche haut */}
        <div
          aria-hidden="true"
          className="absolute left-[22%] top-8 sm:top-12 w-14 sm:w-20 h-14 sm:h-20 rounded-full bg-gradient-to-br from-[#ebd8be]/35 to-[#c4622d]/8 border border-[#c4622d]/10 blur-[1px] opacity-65 animate-bubble-float-reverse"
        />

        {/* 5. Bulle d'ambiance marron/or doux côté droit */}
        <div
          aria-hidden="true"
          className="absolute -right-16 sm:-right-24 bottom-1/4 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-tl from-[#9e461a]/12 via-[#d4a853]/10 to-transparent blur-2xl opacity-60"
        />

        {/* 6. Bulle circulaire texturée flottante côté droit haut */}
        <div
          aria-hidden="true"
          className="absolute right-6 sm:right-20 top-10 sm:top-14 w-28 sm:w-40 h-28 sm:h-40 rounded-full bg-gradient-to-bl from-[#d4a853]/14 via-[#ebd8be]/30 to-white/60 border border-[#d4a853]/15 shadow-sm blur-[1px] opacity-70 animate-bubble-float-reverse"
        />

        {/* 7. Petite bulle discrète côté droit bas */}
        <div
          aria-hidden="true"
          className="absolute right-[22%] bottom-8 sm:bottom-12 w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-gradient-to-tl from-[#c4622d]/10 to-[#ebd8be]/20 border border-[#c4622d]/10 blur-[1px] opacity-65 animate-bubble-float"
        />
      </div>

      {/* ========================================================================= */}
      {/* CONTENU PRINCIPAL CENTRÉ                                                 */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* 1. Pill Tag with Professional Craft Ruler Icon */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c4622d]/10 border border-[#c4622d]/25 text-[#9a4316] text-xs font-bold uppercase tracking-widest mb-5 backdrop-blur-xs">
          <Ruler className="w-3.5 h-3.5 text-[#c4622d]" />
          <span>Contact &amp; Confection Sur-Mesure</span>
        </div>

        {/* 2. Main Title Centered */}
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-black text-[#1c1917] tracking-tight leading-[1.2] max-w-3xl mb-5">
          Une Idée, Un Projet ?{" "}
          <span className="text-[#c4622d]">Donnons Vie à Vos Envies</span>
        </h2>

        {/* 3. Short & Concise Description Centered */}
        <p className="text-[#57534e] text-sm sm:text-base leading-relaxed font-normal max-w-2xl mx-auto mb-8">
          Que vous souhaitiez faire confectionner un tapis sur-mesure à vos dimensions exactes, personnaliser une suspension en cuivre ciselé ou aménager un Riad d&apos;exception, nos maîtres artisans vous accompagnent personnellement à chaque étape.
        </p>

        {/* 4. Primary CTA Button Centered */}
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-3 px-8 sm:px-9 py-4 sm:py-4.5 rounded-2xl bg-[#c4622d] hover:bg-[#a8471b] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#c4622d]/25 hover:shadow-xl hover:shadow-[#c4622d]/35 transition-all duration-300 active:scale-[0.98] group whitespace-nowrap cursor-pointer mb-3"
        >
          <span>Accéder à l&apos;Espace Contact &amp; Atelier</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        {/* 5. Response Guarantee Underneath Centered */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#78716c] font-medium">
          <Clock className="w-3.5 h-3.5 text-[#c4622d]" />
          <span>Réponse garantie sous 2h ouvrées</span>
        </div>
      </div>
    </section>
  );
}
