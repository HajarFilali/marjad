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

  // Référence et progression du scroll pour le Hero Mediast-Style
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [scrollP, setScrollP] = useState(0);

  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const el = heroSectionRef.current;
          if (el) {
            const rect = el.getBoundingClientRect();
            const totalScrollable = el.offsetHeight - window.innerHeight;
            if (totalScrollable > 0) {
              const scrolled = -rect.top;
              const p = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
              setScrollP(p);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // État de direction de navigation pour le bouton unique sous les cartes :
  // - "down" : quand l'utilisateur descend -> "Passer à la suite"
  // - "up" : quand l'utilisateur remonte -> "Remonter en haut"
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
  // Défile les cartes SEULEMENT quand la section et le bouton "Passer à la suite" sont bien visibles à l'écran.
  // Quand on scroll pour entrer dans la section ou quand on a fini les cartes, le scroll naturel de la page n'est jamais bloqué.
  useEffect(() => {
    const container = cardsContainerRef.current;
    if (!container) return;

    let lastWheelTime = 0;

    const handleWheel = (e: WheelEvent) => {
      // Ignorer les micro-variations ou inerties faibles
      if (Math.abs(e.deltaY) < 16) return;

      const viewportHeight = window.innerHeight;
      const rect = container.getBoundingClientRect();
      const btn = document.getElementById("btn-passer-suite") || document.getElementById("btn-passer-container");
      const btnRect = btn ? btn.getBoundingClientRect() : null;

      const currentIdx = activeCardIndexRef.current;
      const now = Date.now();

      if (e.deltaY > 0) {
        setNavDirection("down");

        // Pour intercepter et changer les cartes en descendant (01 -> 05) :
        // Le bouton "Passer à la suite" DOIT être visible dans le viewport,
        // et le haut de la section doit être convenablement engagé dans l'écran.
        const isButtonInView = btnRect
          ? btnRect.bottom <= viewportHeight + 25
          : rect.bottom <= viewportHeight + 30;
        const isTopEngaged = rect.top <= 140;
        const isFullyFramed = isButtonInView && isTopEngaged;

        if (isFullyFramed && currentIdx < STACKED_CARDS.length - 1) {
          e.preventDefault();
          if (now - lastWheelTime > 300) {
            lastWheelTime = now;
            setActiveCardIndex((prev) => Math.min(STACKED_CARDS.length - 1, prev + 1));
          }
        }
        // Si le bouton n'est pas encore visible ou si on a atteint la dernière carte (05) :
        // Aucun blocage -> le scroll naturel de la page continue librement vers le bas !
      } else if (e.deltaY < 0) {
        setNavDirection("up");

        // Pour intercepter et remonter les cartes en montant (05 -> 01) :
        // Le haut de la section doit être visible (pas scrollé hors de l'écran vers le haut).
        const isTopInView = rect.top >= -25;
        const isBottomStillVisible = rect.bottom >= viewportHeight * 0.35;
        const isFullyFramed = isTopInView && isBottomStillVisible;

        if (isFullyFramed && currentIdx > 0) {
          e.preventDefault();
          if (now - lastWheelTime > 300) {
            lastWheelTime = now;
            setActiveCardIndex((prev) => Math.max(0, prev - 1));
          }
        }
        // Si le haut n'est pas encore visible ou si on est à la première carte (01) :
        // Aucun blocage -> le scroll naturel vers le haut remonte vers le hero !
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Fonctions de saut direct (Passer directement à la suite ou Remonter)
  const scrollToMaison = () => {
    const el = document.getElementById("section-maison");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToGestes = () => {
    const el = document.getElementById("section-gestes");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Calculs géométriques et cinématiques pour l'effet Mediast
  const vInset = (23 * (1 - scrollP)).toFixed(2);
  const hInset = (28 * (1 - scrollP)).toFixed(2);
  const radius = (28 * (1 - scrollP)).toFixed(1);
  const zoom = (1 + 0.3 * (1 - scrollP)).toFixed(3);
  const clipPathValue = `inset(${vInset}% ${hInset}% ${vInset}% ${hInset}% round ${radius}px)`;

  return (
    <div className="bg-[#ffffff] min-h-screen">
      {/* ========================================================================= */}
      {/* 1. TOP HERO : EXPANSION CINÉMATIQUE SUR FOND BLANC • MAISON MARJAD         */}
      {/* ========================================================================= */}
      <section
        id="section-maison"
        ref={heroSectionRef}
        className="relative bg-white text-[#1c1917] -mt-[44px] sm:-mt-[48px]"
        style={{ minHeight: "260vh" }}
      >
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-white">
          
          {/* Motifs Filigranes Arabesques du Logo MARJAD en Arrière-Plan */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden select-none transition-opacity duration-300"
            style={{ opacity: Math.max(0, 1 - scrollP * 1.8) }}
          >
            {/* 1. Haut Gauche (Ajusté en taille & Visible) */}
            <div className="absolute -top-7 -left-7 lg:-top-9 lg:-left-9 w-36 h-36 sm:w-44 sm:h-44 lg:w-56 lg:h-56 opacity-[0.19] sm:opacity-[0.21] rotate-[-12deg] transition-transform duration-500">
              <Image
                src="/moroccan-logo-symbol.png"
                alt=""
                width={224}
                height={224}
                className="w-full h-full object-contain"
              />
            </div>

            {/* 2. Haut Droite (Léger & Discret comme initialement) */}
            <div className="absolute -top-10 -right-10 lg:-top-14 lg:-right-14 w-44 h-44 sm:w-56 sm:h-56 lg:w-72 lg:h-72 opacity-[0.055] rotate-[15deg]">
              <Image
                src="/moroccan-logo-symbol.png"
                alt=""
                width={288}
                height={288}
                className="w-full h-full object-contain"
              />
            </div>

            {/* 3. Au-dessus du média, incliné vers la Gauche (Léger & Subtil) */}
            <div className="absolute top-[8%] sm:top-[10%] left-[16%] sm:left-[22%] lg:left-[24%] w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 opacity-[0.065] sm:opacity-[0.075] rotate-[-8deg]">
              <Image
                src="/moroccan-logo-symbol.png"
                alt=""
                width={176}
                height={176}
                className="w-full h-full object-contain"
              />
            </div>

            {/* 4. En-dessous du média, incliné vers la Droite (Léger & Subtil) */}
            <div className="absolute bottom-[8%] sm:bottom-[10%] right-[16%] sm:right-[22%] lg:right-[24%] w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 opacity-[0.065] sm:opacity-[0.075] rotate-[14deg]">
              <Image
                src="/moroccan-logo-symbol.png"
                alt=""
                width={176}
                height={176}
                className="w-full h-full object-contain"
              />
            </div>

            {/* 5. Bas Gauche (Léger & Discret comme initialement) */}
            <div className="absolute -bottom-10 -left-10 lg:-bottom-12 lg:-left-12 w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 opacity-[0.05] rotate-[45deg]">
              <Image
                src="/moroccan-logo-symbol.png"
                alt=""
                width={256}
                height={256}
                className="w-full h-full object-contain"
              />
            </div>

            {/* 6. Bas Droite (Ajusté en taille & Visible) */}
            <div className="absolute -bottom-7 -right-7 lg:-bottom-9 lg:-right-9 w-32 h-32 sm:w-40 sm:h-40 lg:w-52 lg:h-52 opacity-[0.19] sm:opacity-[0.21] rotate-[-20deg] transition-transform duration-500">
              <Image
                src="/moroccan-logo-symbol.png"
                alt=""
                width={208}
                height={208}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Côté Gauche : Savoir-Faire & Signature Maâlem Saïd (Bespoke MARJAD) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-start gap-2.5 transition-opacity duration-200 select-none"
            style={{ opacity: Math.max(0, 1 - scrollP * 2.2) }}
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#8c6d48] font-bold">
              Atelier d&apos;Art
            </span>
            <p className="font-serif text-sm lg:text-base text-[#1c1917] font-semibold leading-snug max-w-[190px]">
              Façonné à la main par Maâlem Saïd
            </p>
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-gradient-to-r from-[#c4622d] to-transparent" />
              <span className="text-[11px] text-[#78716c] font-light">Meknès, Maroc</span>
            </div>
          </div>

          {/* Côté Droit : Art de Vivre & Pièces Uniques (Bespoke MARJAD) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-end text-right gap-2.5 transition-opacity duration-200 select-none"
            style={{ opacity: Math.max(0, 1 - scrollP * 2.2) }}
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#8c6d48] font-bold">
              Matières Nobles
            </span>
            <p className="font-serif text-sm lg:text-base text-[#1c1917] font-semibold leading-snug max-w-[190px]">
              Cèdre sauvage de l&apos;Atlas &amp; Noyer pur
            </p>
            <div className="flex items-center justify-end gap-2">
              <span className="text-[11px] text-[#78716c] font-light">Sculpture en relief</span>
              <div className="h-px w-8 bg-gradient-to-l from-[#d4a853] to-transparent" />
            </div>
          </div>

          {/* Conteneur Média avec Clip-Path Dynamique & Effet d'Ouverture */}
          <div
            className="absolute inset-0 [will-change:clip-path]"
            style={{
              clipPath: clipPathValue,
              filter: scrollP < 0.92 ? "drop-shadow(0 20px 45px rgba(28,25,23,0.14))" : "none",
            }}
          >
            {/* Vidéo d'Arrière-Plan de l'Atelier / Maison MARJAD avec Effet de Zoom & Loop */}
            <div
              className="absolute inset-0 [will-change:transform]"
              style={{ transform: `scale(${zoom})` }}
            >
              <video
                ref={heroVideoRef}
                src="/videos/vvvv.mp4"
                poster="/hero-moroccan-salon.webp"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="h-full w-full object-cover select-none pointer-events-none"
              />
            </div>

            {/* Gradient d'Ambiance pour Contraste & Élégance */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(90deg, rgba(20,18,16,0.92) 0%, rgba(20,18,16,0.72) 42%, rgba(20,18,16,0.25) 75%, rgba(20,18,16,0.15) 100%), linear-gradient(to top, rgba(20,18,16,0.92) 0%, rgba(20,18,16,0.3) 50%, transparent 100%)",
                opacity: Math.min(1, Math.max(0.18, scrollP * 1.3)),
              }}
            />

            {/* Contenu Dévoilé après Ouverture Plein Écran (Scroll >= 0.45) */}
            <div
              className="absolute inset-0 flex flex-col justify-end transition-opacity duration-300"
              style={{
                opacity: Math.max(0, (scrollP - 0.45) / 0.55),
                pointerEvents: scrollP > 0.55 ? "auto" : "none",
              }}
            >
              <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 pb-[clamp(32px,8vh,80px)] text-white">
                <p className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.24em] text-[#d4a853]">
                  Bois Noble · Laiton Massif · Geste Ancestral
                </p>

                <h1 className="mt-3 sm:mt-4 text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-black text-white leading-[1.18] tracking-tight max-w-3xl">
                  Faites entrer la beauté du Maroc <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e2b768] via-[#d4a853] to-[#c4622d]">
                    dans votre intérieur.
                  </span>
                </h1>

                <div className="my-4 sm:my-5 h-[3px] w-[76px] bg-[#c4622d] rounded-full" />

                <p className="max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-white/80">
                  Née de la passion pour le bois noble et les gestes séculaires, la Maison MARJAD imagine des créations d&apos;exception sculptées à la main par <strong className="text-white font-bold">Maâlem Saïd</strong> dans son atelier impérial à Meknès. Des pièces uniques qui allient tradition marocaine et art de vivre contemporain.
                </p>

                {/* Boutons d'Action */}
                <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/boutique"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-xs sm:text-sm font-bold bg-[#c4622d] hover:bg-[#9e461a] text-white transition-all shadow-lg shadow-[#c4622d]/35 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-white" />
                    <span>Explorer la Boutique</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-xs sm:text-sm font-bold border border-white/25 hover:border-white/60 bg-[#141210]/60 hover:bg-[#141210] text-white transition-all backdrop-blur-xs hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#d4a853]" />
                    <span>Demande Sur-Mesure / Contact</span>
                  </Link>
                </div>

                {/* Réassurance Livraison & Échange */}
                <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-white/60">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#c4622d]" />
                    <span>Livraison Sécurisée Partout au Maroc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-[#c4622d]" />
                    <span>Garantie Remplacement Anti-Casse</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Indication Défiler pour explorer */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-7 z-20 flex flex-col items-center gap-2.5 select-none transition-opacity duration-150"
            style={{ opacity: Math.max(0, 1 - scrollP * 2.8) }}
          >
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.28em] text-[#8c6d48]">
              <span className="h-px w-6 bg-[#c4622d]/40" />
              <span>Défiler pour explorer</span>
              <span className="h-px w-6 bg-[#c4622d]/40" />
            </div>
            <div className="w-5 h-8 rounded-full border border-[#8c6d48]/40 flex justify-center pt-1.5">
              <span className="w-1 h-2 rounded-full bg-[#c4622d] animate-bounce" />
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
        className="relative z-10 isolate bg-white pt-8 sm:pt-12 lg:pt-14 pb-8 sm:pb-10"
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
              <div id="btn-passer-container" className="w-full max-w-lg lg:max-w-xl flex justify-end items-center mt-3.5 px-1">
                {navDirection === "down" ? (
                  <button
                    id="btn-passer-suite"
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
                    id="btn-passer-suite"
                    type="button"
                    onClick={scrollToMaison}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fbf5ee] hover:bg-[#ba4e1a] text-[#ba4e1a] hover:text-white border border-[#ba4e1a]/30 text-xs font-bold transition-all duration-300 shadow-2xs hover:shadow-xs cursor-pointer group"
                    title="Remonter vers la présentation Maison MARJAD"
                  >
                    <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
                    <span>Remonter en haut</span>
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


    </div>
  );
}
