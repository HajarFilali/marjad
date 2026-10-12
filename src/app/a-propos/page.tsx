"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  Gem,
  Hammer,
  Layers,
  Compass,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ShoppingBag,
  MessageCircle,
  PackageCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { DECOR_PRODUCTS } from "@/data/mockProducts";

// ============================================================================
// DONNÉES CONCISES • MAISON MARJAD (MAÂLEM SAÏD • MEKNÈS)
// ============================================================================

// 1. Les 5 Cartes Décalées (Effet Stop-Motion Scroll Pinned, conforme au dessin de l'utilisateur)
const STACKED_CARDS = [
  {
    step: "01",
    tag: "L'Origine & La Vocation",
    title: "Sublimer les Intérieurs par l'Authenticité",
    excerpt:
      "MARJAD fait entrer la chaleur et la noblesse de l'artisanat marocain dans les intérieurs modernes. Chaque création est une pièce unique pensée pour traverser le temps.",
    pills: ["Pièce Unique", "Patrimoine Vivant", "Art de Vivre"],
    highlight: "Patrimoine Vivant",
    icon: Compass,
  },
  {
    step: "02",
    tag: "L'Atelier Impérial",
    title: "100% Façonné à la Main à Meknès",
    excerpt:
      "Toutes nos créations sont sculptées par Maâlem Saïd dans son atelier à Meknès. Plus de trente ans de métier garantissent un façonnage précis et une finition soignée.",
    pills: ["Maâlem Saïd", "Atelier Meknès", "Fait Main Intégral"],
    highlight: "Maître Artisan",
    icon: Hammer,
  },
  {
    step: "03",
    tag: "L'Exigence des Matériaux",
    title: "Cèdre de l'Atlas & Noyer Sauvage",
    excerpt:
      "Sélection exclusive de bois nobles séchés naturellement. Zéro résine, zéro plastique composite, pour préserver le veinage vivant et le parfum du bois centenaire.",
    pills: ["Cèdre Odorant", "Noyer Massif", "Zéro Plastique"],
    highlight: "Matières Nobles",
    icon: Gem,
  },
  {
    step: "04",
    tag: "L'Artisanat d'Apparat",
    title: "Calligraphie en Relief & Dorure d'Or",
    excerpt:
      "Les formules sacrées et arabesques sont sculptées en trois dimensions, rehaussées de pigments dorés lumineux et de laiton brossé capturant la lumière du salon.",
    pills: ["Relief 3D", "Dorure Texturée", "Laiton Massif"],
    highlight: "Dorure & Laiton",
    icon: Award,
  },
  {
    step: "05",
    tag: "L'Engagement Client",
    title: "Emballage Caisse & Garantie Anti-Casse",
    excerpt:
      "Chaque création est protégée dans une caisse renforcée sur-mesure. Expédition sécurisée partout au Maroc avec garantie d'échange immédiat en cas d'aléa.",
    pills: ["Caisse Renforcée", "Livraison Partout au Maroc", "Échange Garanti"],
    highlight: "Garantie Anti-Casse",
    icon: ShieldCheck,
  },
];

// 2. Les 4 Créations Signatures de Maâlem Saïd (Best Products Décor Mural)
const SIGNATURE_PRODUCTS = [
  {
    product: DECOR_PRODUCTS[0], // Hexagones Alvéoles 'سبحان الله وبحمده' (Calligraphie Murale)
    description:
      "Composition alvéolaire sculptée en relief monobloc, rehaussée de marbre noble et calligraphie dorée 24 carats captant les reflets du salon.",
  },
  {
    product: DECOR_PRODUCTS[2], // Arche Mauresque Cintrée 'يا الله' (Arches & Panneaux)
    description:
      "Panneau cintré d'arche andalouse taillé à la gouge dans le cèdre sauvage de l'Atlas, orné d'incrustations dorées et de la divine formule 'يا الله'.",
  },
  {
    product: DECOR_PRODUCTS[1], // Étagère Murale 'الحمد لله رب العالمين' (Étagères & Mobilier Mural)
    description:
      "Console murale sculptée en noyer noble séché naturellement avec tablette en laiton pur brossé et calligraphie royale en relief.",
  },
  {
    product: DECOR_PRODUCTS[3], // Miroir Soleil Artisanal en Bois & Laiton (Miroirs d'Art)
    description:
      "Marqueterie radiale solaire assemblée à la main avec segments de bois précieux, double liseré de laiton doré et miroir biseauté.",
  },
];

// Décalage en quinconce (alternating staggered rhythm conforme au croquis de l'utilisateur)
// Carte 1 (haut), Carte 2 (bas), Carte 3 (haut), Carte 4 (bas)
const STAGGER_OFFSETS = [
  "lg:-translate-y-6 xl:-translate-y-7",
  "lg:translate-y-6 xl:translate-y-7 sm:translate-y-3",
  "lg:-translate-y-6 xl:-translate-y-7",
  "lg:translate-y-6 xl:translate-y-7 sm:translate-y-3",
];

// 4. Les 4 Engagements MARJAD
const WHY_US_CARDS = [
  {
    icon: Gem,
    title: "Matières Nobles Uniquement",
    desc: "Cèdre sauvage de l'Atlas, noyer massif séché naturellement, laiton pur et marbre noble. Zéro résine, zéro plastique composite.",
  },
  {
    icon: Hammer,
    title: "100% Façonné par Maâlem Saïd",
    desc: "Chaque création est une pièce originale conçue, sculptée et finie à la main dans notre atelier à Meknès par un seul maître d'art.",
  },
  {
    icon: PackageCheck,
    title: "Conditionnement Anti-Casse",
    desc: "Chaque création bénéficie d'une caisse renforcée sur-mesure avec protection triple épaisseur et garantie d'échange immédiat.",
  },
  {
    icon: Layers,
    title: "Design Épuré & Intemporel",
    desc: "L'élégance du patrimoine marocain épurée avec subtilité pour s'intégrer harmonieusement dans les intérieurs contemporains les plus raffinés.",
  },
];

export default function AProposPage() {
  // Référence pour la section des 5 cartes décalées
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const activeCardIndexRef = useRef(0);
  activeCardIndexRef.current = activeCardIndex;

  // État de direction de navigation pour le bouton unique sous les cartes :
  // - "down" : quand l'utilisateur descend depuis Maître Artisan -> "Passer à la suite"
  // - "up" : quand l'utilisateur remonte depuis les Gestes d'Atelier -> "Remonter au Fondateur"
  const [navDirection, setNavDirection] = useState<"down" | "up">("down");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScrollDir = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;

      if (Math.abs(diff) > 4) {
        if (diff > 0) {
          setNavDirection("down");
        } else {
          setNavDirection("up");
        }
        lastScrollY.current = currentY;
      }
    };

    window.addEventListener("scroll", handleScrollDir, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollDir);
  }, []);

  // Écouteur de molette (wheel) fluide sur la zone des cartes :
  // Fait défiler les 5 cartes (0 -> 1 -> 2 -> 3 -> 4) sans agrandir le gap avec la section supérieure.
  // Quand on atteint la fin ou le début, le scroll naturel de la page prend le relais.
  useEffect(() => {
    const container = cardsContainerRef.current;
    if (!container) return;

    let lastWheelTime = 0;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      const currentIdx = activeCardIndexRef.current;

      if (e.deltaY > 0) {
        setNavDirection("down");
        // Scroll vers le bas
        if (currentIdx < STACKED_CARDS.length - 1) {
          e.preventDefault();
          if (now - lastWheelTime > 260) {
            lastWheelTime = now;
            setActiveCardIndex((prev) => Math.min(STACKED_CARDS.length - 1, prev + 1));
          }
        }
      } else if (e.deltaY < 0) {
        setNavDirection("up");
        // Scroll vers le haut
        if (currentIdx > 0) {
          e.preventDefault();
          if (now - lastWheelTime > 260) {
            lastWheelTime = now;
            setActiveCardIndex((prev) => Math.max(0, prev - 1));
          }
        }
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Fonctions de saut direct (Passer directement à la suite ou Remonter)
  const scrollToArtisan = () => {
    const el = document.getElementById("section-artisan");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToGestes = () => {
    const el = document.getElementById("section-gestes");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-[#ffffff] min-h-screen">
      {/* ========================================================================= */}
      {/* 1. TOP HERO : MAÂLEM SAÏD (IMAGE À GAUCHE & PRÉSENTATION UX ÉPURÉE)       */}
      {/* ========================================================================= */}
      <section
        id="section-artisan"
        className="bg-white min-h-[100dvh] pt-[104px] sm:pt-[112px] flex flex-col justify-center"
      >
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center py-6 sm:py-8 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center w-full">
            
            {/* GAUCHE (lg:col-span-5) : Portrait dans le Cadre Ovale Sculpté en Bois Marron */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[400px] xl:max-w-[430px] mx-auto transition-transform duration-500 hover:scale-[1.015]">
                <Image
                  src="/mallem-said-portrait-v3.png"
                  alt="Maâlem Saïd • Artisan Fondateur MARJAD"
                  width={842}
                  height={1024}
                  priority
                  className="w-auto h-auto max-h-[440px] sm:max-h-[470px] lg:max-h-[490px] xl:max-h-[510px] object-contain mx-auto select-none"
                />
              </div>
            </div>

            {/* DROITE (lg:col-span-7) : Présentation d'Excellence & Informations Clients */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-3.5 text-left">
              
              {/* Badge Fondateur */}
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#fbf5ee] border border-[#b34718]/40 text-[#b34718] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <svg
                  className="w-3 h-3 text-[#b34718]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
                <span>MAÎTRE ARTISAN • ATELIER MEKNÈS</span>
              </div>

              {/* Titre Principal (Tailles Affinées & Équilibrées) */}
              <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-serif font-black text-[#1c1917] tracking-tight leading-[1.18]">
                Maâlem Saïd, <br />
                <span className="text-[#b34718] italic font-normal font-serif text-lg sm:text-xl lg:text-[23px] block mt-0.5">
                  Maître du Bois Noble &amp; du Laiton
                </span>
              </h1>

              {/* Séparateur avec Emblème Officiel du Logo MARJAD au Centre */}
              <div className="flex items-center gap-3.5 py-1 max-w-xl">
                <div className="h-[1.5px] sm:h-[2px] flex-1 bg-[#d4a853] rounded-full" />
                <Image
                  src="/moroccan-logo-symbol.png"
                  alt="Emblème MARJAD"
                  width={36}
                  height={36}
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
                />
                <div className="h-[1.5px] sm:h-[2px] flex-1 bg-[#d4a853] rounded-full" />
              </div>

              {/* Récit avec Détails Artisanaux */}
              <div className="space-y-2 text-[#292524] text-xs sm:text-[13px] leading-relaxed max-w-xl">
                <p>
                  Au cœur de la cité impériale de <strong className="text-[#1c1917] font-bold">Meknès, Maâlem Saïd</strong> perpétue plus de trente ans de tabletterie d&apos;art. Chaque création MARJAD est sculptée individuellement à la main dans son atelier, perpétuant les gestes ancestraux de la sculpture sur bois.
                </p>
                <p>
                  Travaillant exclusivement le <strong className="text-[#1c1917] font-bold">cèdre de l&apos;Atlas</strong> et le <strong className="text-[#1c1917] font-bold">noyer massif</strong>, il incruste le laiton avec une précision d&apos;orfèvre pour créer des pièces d&apos;exception qui traversent le temps.
                </p>
              </div>

              {/* 2 Cartes de Détails Artisanaux */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5 max-w-xl">
                <div className="p-3 sm:p-3.5 rounded-2xl bg-[#fcf7f1] border border-[#ebd8be] flex items-center gap-3 hover:border-[#b34718]/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#f4e4d6] flex items-center justify-center shrink-0">
                    <svg
                      className="w-4.5 h-4.5 text-[#b34718]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-xs sm:text-[12px] font-serif font-bold text-[#1c1917]">
                      100% Fait Main à Meknès
                    </p>
                    <p className="text-[10px] sm:text-[10.5px] text-[#66615b] mt-0.5 leading-snug">
                      Sculpté au ciseau dans son atelier, chaque pièce est unique et signée.
                    </p>
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-[#fcf7f1] border border-[#ebd8be] flex items-center gap-3 hover:border-[#b34718]/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#f4e4d6] flex items-center justify-center shrink-0">
                    <svg
                      className="w-4.5 h-4.5 text-[#b34718]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
                      <path d="M11 3 8 9l4 12 4-12-3-6" />
                      <path d="M2 9h20" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-xs sm:text-[12px] font-serif font-bold text-[#1c1917]">
                      Bois Nobles &amp; Laiton Massif
                    </p>
                    <p className="text-[10px] sm:text-[10.5px] text-[#66615b] mt-0.5 leading-snug">
                      Cèdre odorant et noyer naturel. Zéro plastique, zéro résine.
                    </p>
                  </div>
                </div>
              </div>

              {/* Boutons d'Action Rapides */}
              <div className="flex flex-wrap items-center justify-start gap-3 pt-1">
                <Link
                  href="/boutique"
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#b34718] hover:bg-[#963a12] text-white text-xs sm:text-[12.5px] font-serif font-bold rounded-full transition-all shadow-md shadow-[#b34718]/25 hover:shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-white stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <span>Découvrir la Boutique</span>
                  <svg className="w-3.5 h-3.5 text-white stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                <a
                  href="https://wa.me/212654321098?text=Bonjour%20MARJAD%2C%20je%20souhaite%20contacter%20l%27atelier%20de%20Ma%C3%A2lem%20Sa%C3%AFd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#fbf7f2] hover:bg-white border border-[#b34718] text-[#1c1917] hover:text-[#b34718] text-xs sm:text-[12.5px] font-serif font-bold rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-2xs hover:shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 text-[#b34718] stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                  </svg>
                  <span>Contacter l&apos;Atelier</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SECTION CARTES EN STACK DÉCALÉ • EFFET CIRCULAIRE                      */}
      {/* ========================================================================= */}
      <section
        id="section-essentiel"
        ref={cardsContainerRef}
        className="relative z-10 isolate bg-white pt-16 sm:pt-24 lg:pt-28 pb-10 sm:pb-12 lg:pb-13"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            
            {/* GAUCHE (lg:col-span-5) : En-tête & Narration Approfondie */}
            <div className="lg:col-span-5 space-y-4 text-center lg:text-left self-start lg:self-start -mt-2 sm:-mt-3 lg:mt-0 lg:pt-2">
              
              {/* Badge Histoire & Savoir-Faire */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ba4e1a]/10 border border-[#ba4e1a]/25 text-[#ba4e1a] text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-[#ba4e1a]" />
                <span>Histoire &amp; Savoir-Faire</span>
              </div>

              {/* Titre Principal */}
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-black text-[#1c1917] tracking-tight leading-[1.2]">
                L&apos;Essentiel de MARJAD, <br />
                <span className="text-[#ba4e1a] italic font-normal font-serif text-xl sm:text-2xl lg:text-[26px]">
                  Cinq Piliers d&apos;Excellence
                </span>
              </h2>

              {/* Description Approfondie & Détaillée */}
              <div className="space-y-3.5 text-[#44403c] text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0">
                <p>
                  Fondée sur la passion du geste juste et l&apos;amour des matières nobles, la Maison MARJAD réinvente l&apos;art de vivre marocain en alliant authenticité séculaire et design contemporain.
                </p>
                <p className="text-[#57534e]">
                  De la sélection exigeante du cèdre odorant dans les forêts de l&apos;Atlas jusqu&apos;au polissage final au laiton massif dans notre atelier de Meknès, chaque étape de confection obéit à une quête absolue de perfection et de pérennité.
                </p>
              </div>

            </div>

            {/* DROITE (lg:col-span-7) : Stack Visuel Circulaire des 5 Cartes Décalées */}
            <div className="lg:col-span-7 flex flex-col justify-center items-center">

              {/* Stack des Cartes Décalées avec Emblèmes & Finitions d'Apparat */}
              <div className="relative w-[calc(100%-48px)] sm:w-full max-w-lg lg:max-w-xl mx-auto h-[350px] sm:h-[335px]">
                {STACKED_CARDS.map((card, idx) => {
                  // k est la profondeur relative par rapport à activeCardIndex (0 = devant, 4 = au fond)
                  const k = (idx - activeCardIndex + STACKED_CARDS.length) % STACKED_CARDS.length;
                  const isFront = k === 0;

                  // Décalage diagonal étagé selon le croquis
                  const translateX = k * 12;
                  const translateY = -k * 10;
                  const scale = 1 - k * 0.02;
                  const zIndex = 20 - k * 2;
                  const opacity = isFront ? 1 : Math.max(0.72, 1 - k * 0.07);

                  return (
                    <div
                      key={card.step}
                      onClick={() =>
                        setActiveCardIndex(isFront ? (idx + 1) % STACKED_CARDS.length : idx)
                      }
                      className={`absolute inset-0 rounded-3xl transition-all duration-500 ease-out p-6 sm:p-7 flex flex-col justify-between cursor-pointer select-none overflow-hidden ${
                        isFront
                          ? "bg-white border-2 border-[#ba4e1a] ring-1 ring-[#d4a853]/35 shadow-[0_22px_45px_-12px_rgba(186,78,26,0.22),0_8px_20px_rgba(0,0,0,0.06)]"
                          : "bg-[#fdfbf9] border border-[#ebd8be] hover:border-[#ba4e1a]/50 shadow-[0_6px_18px_rgba(0,0,0,0.04)]"
                      }`}
                      style={{
                        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                        opacity,
                        zIndex,
                        pointerEvents: "auto",
                      }}
                    >
                      {/* ========================================================= */}
                      {/* MOTIFS ARABESQUES DU LOGO DANS LE FOND (3 OCCURRENCES)    */}
                      {/* ========================================================= */}
                      
                      {/* 1. Haut-Gauche (Partie Left) - Visible et élégant */}
                      <div className="absolute -top-7 -left-7 sm:-top-8 sm:-left-8 w-24 h-24 sm:w-28 sm:h-28 pointer-events-none select-none opacity-25 sm:opacity-30 transition-transform duration-500">
                        <Image
                          src="/moroccan-logo-symbol.png"
                          alt=""
                          width={112}
                          height={112}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* 2. Bas-Droite (Partie Right) - Visible et élégant */}
                      <div className="absolute -bottom-7 -right-7 sm:-bottom-8 sm:-right-8 w-24 h-24 sm:w-28 sm:h-28 pointer-events-none select-none opacity-25 sm:opacity-30 transition-transform duration-500">
                        <Image
                          src="/moroccan-logo-symbol.png"
                          alt=""
                          width={112}
                          height={112}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* 3. Centre Parfait (Width & Height) - Filigrane discret (Baha) */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-56 sm:h-56 pointer-events-none select-none opacity-[0.06] sm:opacity-[0.07] transition-transform duration-700">
                        <Image
                          src="/moroccan-logo-symbol.png"
                          alt=""
                          width={224}
                          height={224}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* ========================================================= */}
                      {/* CONTENU NOBLE & ARTISANAL DE LA CARTE                    */}
                      {/* ========================================================= */}
                      <div className="relative z-10 space-y-2.5">
                        
                        {/* En-tête : Numérotation Stylée à Droite (Coin haut-gauche dégagé pour révéler le motif du logo) */}
                        <div className="flex items-center justify-end min-h-[28px]">
                          {/* Numérotation / Ordre Stylé (01 / 05) */}
                          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#fbf8f4] to-[#f5ecdf] border border-[#e2cfb7] shadow-2xs select-none">
                            <span className="font-serif font-black text-xs sm:text-[13px] text-[#1c1917] tracking-tight">
                              {card.step}
                            </span>
                            <span className="text-[11px] font-serif text-[#ba4e1a] font-bold">/</span>
                            <span className="text-[11px] font-serif text-[#8c827a] font-medium">05</span>
                          </div>
                        </div>

                        {/* Titre Principal Raffiné */}
                        <h3 className="text-lg sm:text-[21px] font-serif font-black text-[#1c1917] leading-snug tracking-tight">
                          {card.title}
                        </h3>

                        {/* Liseré Séparateur Artisanal Or & Terracotta */}
                        <div className="flex items-center gap-2 py-0.5">
                          <div className="w-10 h-[2px] bg-gradient-to-r from-[#ba4e1a] to-[#d4a853] rounded-full" />
                          <div className="w-1.5 h-1.5 rotate-45 bg-[#d4a853] rounded-[1px]" />
                          <div className="w-6 h-[1px] bg-[#d4a853]/40 rounded-full" />
                        </div>

                        {/* Récit / Description Approfondie */}
                        <p className="text-xs sm:text-[13px] text-[#44403c] leading-relaxed font-normal">
                          {card.excerpt}
                        </p>
                      </div>

                      {/* Footer de la Carte avec Badges Raffinés (Sans icône qui clignote) */}
                      <div className="relative z-10 pt-3 border-t border-[#ebd8be]/70 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          {card.pills.map((pill) => (
                            <span
                              key={pill}
                              className="text-[10px] sm:text-[10.5px] font-semibold text-[#292524] bg-[#faf6f0] px-2.5 py-1 rounded-lg border border-[#ebd8be] hover:border-[#ba4e1a]/40 transition-colors shadow-2xs"
                            >
                              {pill}
                            </span>
                          ))}
                        </div>

                        {isFront && (
                          <span className="hidden sm:inline-flex items-center text-[10px] font-bold text-[#ba4e1a] bg-[#ba4e1a]/8 px-2.5 py-1 rounded-full border border-[#ba4e1a]/20 shrink-0 shadow-2xs">
                            <span>{card.highlight}</span>
                          </span>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Bouton Dynamique Unique sous les cartes */}
              <div className="w-full max-w-lg lg:max-w-xl flex justify-end items-center mt-3.5 px-1">
                {navDirection === "down" ? (
                  <button
                    type="button"
                    onClick={scrollToGestes}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fbf5ee] hover:bg-[#ba4e1a] text-[#ba4e1a] hover:text-white border border-[#ba4e1a]/30 text-xs font-bold transition-all duration-300 shadow-2xs hover:shadow-xs cursor-pointer group"
                    title="Passer aux Gestes d'Atelier"
                  >
                    <span>Passer à la suite</span>
                    <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={scrollToArtisan}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fbf5ee] hover:bg-[#ba4e1a] text-[#ba4e1a] hover:text-white border border-[#ba4e1a]/30 text-xs font-bold transition-all duration-300 shadow-2xs hover:shadow-xs cursor-pointer group"
                    title="Remonter vers la présentation du Fondateur"
                  >
                    <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
                    <span>Remonter au Fondateur</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 3. LES GESTES D'EXCELLENCE DE MAÂLEM SAÏD : LES 4 CRÉATIONS SIGNATURES    */}
      {/* ========================================================================= */}
      <section id="section-gestes" className="bg-white pt-10 sm:pt-14 pb-16 sm:pb-24 scroll-mt-20 sm:scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-2.5 mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ba4e1a]/10 text-[#ba4e1a] text-xs font-bold uppercase tracking-wider">
              <Hammer className="w-3.5 h-3.5 text-[#ba4e1a]" />
              <span>Savoir-Faire &amp; Gestes d&apos;Atelier</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#1c1917] tracking-tight">
              Les Gestes d&apos;Excellence de Maâlem Saïd
            </h2>

            <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed max-w-xl mx-auto">
              De la taille monobloc du bois jusqu&apos;à la ciselure du laiton, découvrez nos créations signatures façonnées à la main par Maâlem Saïd à Meknès.
            </p>
          </div>

          {/* Grille 4 Cartes Produits en Quinconce (1 ligne de 4, une carte haute, une carte basse conforme au croquis) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 items-start pt-2 lg:pt-6">
            {SIGNATURE_PRODUCTS.map((item, idx) => (
              <div
                key={item.product.id}
                className={`w-full transition-transform duration-500 ${STAGGER_OFFSETS[idx % STAGGER_OFFSETS.length]}`}
              >
                <ProductCard
                  product={item.product}
                  variant="grid"
                  hideFavorite={true}
                  hidePriceAndCart={true}
                  customDescription={item.description}
                />
              </div>
            ))}
          </div>

          {/* Bouton vers la boutique complète */}
          <div className="mt-8 sm:mt-10 text-center">
            <Link
              href="/boutique"
              className="inline-flex items-center gap-3 px-8 py-3.5 sm:px-10 sm:py-4 rounded-full bg-gradient-to-r from-[#B84D19] via-[#AA4313] to-[#9A380A] hover:from-[#A84212] hover:via-[#9A380A] hover:to-[#883007] text-white text-sm sm:text-base font-bold transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(184,77,25,0.4),0_4px_10px_-2px_rgba(154,56,10,0.3)] hover:shadow-[0_14px_30px_-5px_rgba(184,77,25,0.5),0_6px_14px_-2px_rgba(154,56,10,0.4)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
            >
              <span>Explorer Toute la Collection en Boutique</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1.5 text-white" />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION MAISON MARJAD • MEKNÈS (PRÉSENTATION & EMPLACEMENT VIDÉO)     */}
      {/* ========================================================================= */}
      <section className="bg-white pt-4 sm:pt-6 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* GAUCHE (Partie Left) : Invitation & Récit Concis sur la Maison MARJAD */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ba4e1a]/10 border border-[#ba4e1a]/20 text-[#ba4e1a] text-xs font-bold uppercase tracking-widest">
                <Award className="w-3.5 h-3.5 text-[#ba4e1a]" />
                <span>Maison MARJAD • Meknès</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#1c1917] leading-[1.2]">
                Faites Entrer la Beauté du Maroc <br />
                <span className="text-[#ba4e1a]">dans Votre Intérieur</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#44403c] leading-relaxed">
                Née de la passion pour le bois noble et les gestes séculaires, la Maison MARJAD imagine des créations d&apos;exception sculptées à la main par <strong className="text-[#1c1917]">Maâlem Saïd</strong> dans son atelier impérial à Meknès. Des pièces uniques qui allient tradition marocaine et art de vivre contemporain.
              </p>

              {/* Boutons d'Action */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/boutique"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#ba4e1a] to-[#9c3a0c] hover:from-[#9c3a0c] hover:to-[#822f08] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-[#ba4e1a]/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>Explorer la Boutique</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 bg-white border border-[#ebd8be] hover:border-[#ba4e1a] text-[#1c1917] hover:text-[#ba4e1a] font-bold text-xs sm:text-sm rounded-xl transition-all hover:bg-[#faf7f2] flex items-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#ba4e1a]" />
                  <span>Demande Sur-Mesure / Contact</span>
                </Link>
              </div>

              {/* Réassurance livraison & échange */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#78716c]">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#ba4e1a]" />
                  <span>Livraison Sécurisée Partout au Maroc</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#ba4e1a]" />
                  <span>Garantie Remplacement Anti-Casse</span>
                </div>
              </div>
            </div>

            {/* DROITE (Partie Right) : Cadre Réservé pour la Vidéo (Fond Blanc, Bordure Marron & Arrondi) */}
            <div className="lg:col-span-6">
              <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-3xl bg-white border-2 border-[#b84d19]/40 shadow-xs flex items-center justify-center overflow-hidden">
                {/* Cadre vidéo réservé - prêt pour l'intégration du salon marocain */}
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
