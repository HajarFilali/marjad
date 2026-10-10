"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  Truck,
  Banknote,
  Headset,
  Ruler,
  RefreshCw,
  Phone,
  Mail,
  X,
  Lock,
  PackageCheck,
  HelpCircle,
  Search,
  CheckCircle2,
  ShieldCheck,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { MoroccanWoodLattice } from "./MoroccanWoodLattice";
import { MARJAD_PATH_DATA } from "./marjadPath";

export type SupportTab = "suivi" | "livraison" | "retours" | "faq" | "confidentialite";

export function Footer() {
  const pathname = usePathname();

  const [activeSupportTab, setActiveSupportTab] = useState<SupportTab | null>(null);
  const [modalFaqIndex, setModalFaqIndex] = useState<number | null>(0);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingStatus, setTrackingStatus] = useState<string | null>(null);

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    setTrackingStatus(
      `Colis N° ${trackingNumber.trim().toUpperCase()} : En cours d'acheminement express par notre transporteur partenaire. Livraison estimée sous 24h à 48h ouvrées.`
    );
  };

  const watermarkRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const hasTriggeredSweepRef = useRef<boolean>(false);

  // Mouse interactive spotlight handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!watermarkRef.current || !spotlightRef.current) return;
    const rect = watermarkRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightRef.current.style.setProperty("--mouse-x", `${x}px`);
    spotlightRef.current.style.setProperty("--mouse-y", `${y}px`);
    spotlightRef.current.style.setProperty("--mouse-opacity", "1");
  };

  const handleMouseLeave = () => {
    if (!spotlightRef.current) return;
    spotlightRef.current.style.setProperty("--mouse-opacity", "0");
  };

  // Scroll entrance beam sweep: sweeps right-to-left across MARJAD (D -> M)
  const startBeamSweep = () => {
    if (!watermarkRef.current || !beamRef.current) return;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const rect = watermarkRef.current.getBoundingClientRect();
    const width = rect.width || (typeof window !== "undefined" ? window.innerWidth : 1200);
    // Start at right edge beyond 'D', finish at left edge beyond 'M'
    const startX = width + 140;
    const endX = -140;
    const duration = 1250; // smooth and fast pass ("ghadi ydouz deghya")
    const startTime = performance.now();
    const centerY = rect.height ? rect.height * 0.52 : 140;

    beamRef.current.style.setProperty("--beam-y", `${centerY}px`);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Graceful cubic easeInOut
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentX = startX + (endX - startX) * ease;

      // Opacity envelope: ramp up first 12%, full beam, ramp down last 12%
      let opacity = 1;
      if (progress < 0.12) {
        opacity = progress / 0.12;
      } else if (progress > 0.88) {
        opacity = Math.max(0, (1 - progress) / 0.12);
      }

      if (beamRef.current) {
        beamRef.current.style.setProperty("--beam-x", `${currentX}px`);
        beamRef.current.style.setProperty("--beam-opacity", `${opacity}`);
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        if (beamRef.current) {
          beamRef.current.style.setProperty("--beam-opacity", "0");
        }
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  // Trigger beam sweep whenever user scrolls into the footer section
  useEffect(() => {
    const target = watermarkRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasTriggeredSweepRef.current) {
              hasTriggeredSweepRef.current = true;
              // Brief tick so user sees the sweep as the footer slides into view
              const timer = setTimeout(() => {
                startBeamSweep();
              }, 160);
              return () => clearTimeout(timer);
            }
          } else {
            // Reset when scrolled out of view so re-scrolling into footer triggers it again!
            hasTriggeredSweepRef.current = false;
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeSupportTab !== null) {
        setActiveSupportTab(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSupportTab]);

  // Ticker reassurance items for continuous marquee (Left to Right)
  const tickerItems = [
    { text: "100% FAIT MAIN & AUTHENTIQUE", icon: BadgeCheck },
    { text: "LIVRAISON PARTOUT AU MAROC", icon: Truck },
    { text: "PAIEMENT À LA LIVRAISON", icon: Banknote },
    { text: "SERVICE CLIENT DÉDIÉ 7J/7", icon: Headset },
    { text: "CONFECTION SUR-MESURE", icon: Ruler },
    { text: "RETOURS & ÉCHANGES GARANTIS", icon: RefreshCw },
  ];

  // Repeat sequence for seamless endless loop
  const marqueeList = [...tickerItems, ...tickerItems, ...tickerItems];

  // Hide footer completely on /boutique, /login, /panier, /commande and /admin pages
  // (Placed AFTER all hooks to strictly adhere to React Rules of Hooks)
  if (
    pathname === "/boutique" ||
    pathname === "/login" ||
    pathname?.startsWith("/panier") ||
    pathname?.startsWith("/commande") ||
    pathname?.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <>
      <footer className="w-full bg-[#000000] text-[#ffffff] rounded-t-[2.5rem] sm:rounded-t-[3.5rem] border-t border-neutral-900 overflow-hidden relative shadow-2xl">
        {/* ========================================================================= */}
        {/* BACKGROUND: MOROCCAN MASHRABIYA LATTICE SPREAD ALL OVER THE FOOTER (COVER) */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          <MoroccanWoodLattice className="w-full h-full" />
        </div>

        {/* ========================================================================= */}
        {/* 1. REASSURANCE TICKER BAR (Infinite Marquee Left-to-Right with Side Fades) */}
        {/* ========================================================================= */}
        <div className="relative w-full py-2.5 sm:py-3 overflow-hidden bg-[#000000] select-none">
          {/* Left Edge Shadow / Fade Overlay */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#000000] via-[#000000]/90 to-transparent z-10" />

          {/* Right Edge Shadow / Fade Overlay */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#000000] via-[#000000]/90 to-transparent z-10" />

          {/* Scrolling track */}
          <div
            className="flex items-center"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            }}
          >
            <div className="animate-marquee-ltr flex items-center gap-8 sm:gap-12 whitespace-nowrap">
              {marqueeList.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-neutral-300 hover:text-white transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#d4a853] shrink-0 stroke-[2.2]" />
                    <span>{item.text}</span>
                    <span className="text-[#d4a853]/70 font-bold ml-4 sm:ml-6">•</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN 4-COLUMN CONTENT SECTION (Vinillia Single-Row Balanced Layout)     */}
        {/* ========================================================================= */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-3 sm:pt-4 pb-1 sm:pb-2">
          <div className="flex flex-wrap lg:flex-nowrap items-start justify-between gap-6 lg:gap-8 py-0.5">
            
            {/* --- COLUMN 1: CONTACT --- */}
            <div className="shrink-0 space-y-2">
              <p className="text-xs font-bold tracking-[0.22em] text-[#c4622d] uppercase text-left">
                Contact
              </p>

              {/* Official Logo */}
              <Link href="/" className="inline-flex items-center group py-0">
                <Image
                  src="/logo.png"
                  alt="MARJAD - Sélection artisanale"
                  width={180}
                  height={48}
                  className="h-[38px] sm:h-[44px] w-auto object-contain transition-transform group-hover:scale-105"
                />
              </Link>

              {/* WhatsApp & Email (Vinillia exact style) */}
              <div className="flex flex-col items-start space-y-2 pt-0">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/212654321098?text=Bonjour%20MARJAD,%20je%20souhaite%20des%20informations%20sur%20vos%20cr%C3%A9ations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 pt-0.5"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border border-white/20 bg-white/[0.08] flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300 shadow-sm shrink-0">
                    <Phone className="w-4 h-4 text-white group-hover:text-[#c4622d] transition-colors" />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-medium">WhatsApp</p>
                    <p className="text-sm font-semibold text-white tracking-tight group-hover:text-white/90 transition-colors">
                      +212 6 54 32 10 98
                    </p>
                  </div>
                </a>

                {/* Email Support */}
                <a
                  href="mailto:contact@marjad.ma"
                  className="group flex items-center gap-3"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border border-white/20 bg-white/[0.08] flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300 shadow-sm shrink-0">
                    <Mail className="w-4 h-4 text-white group-hover:text-[#c4622d] transition-colors" />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-medium">Support Email</p>
                    <p className="text-sm font-semibold text-white tracking-tight group-hover:text-white/90 transition-colors">
                      contact@marjad.ma
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* --- COLUMN 2: BOUTIQUE (4 Clean Links) --- */}
            <div className="shrink-0 space-y-2">
              <p className="text-xs font-bold tracking-[0.22em] text-[#c4622d] uppercase">
                Boutique
              </p>
              <ul className="space-y-2.5">
                {[
                  { label: "Tous les Produits", href: "/boutique" },
                  { label: "Tapis Berbères Fait Main", href: "/boutique?category=tapis" },
                  { label: "Luminaires & Cuivre Ciselé", href: "/boutique?category=luminaires" },
                  { label: "Tables en Zellige & Mosaïque", href: "/boutique?category=zellige" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[13px] font-medium text-white/80 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* --- COLUMN 3: SUPPORT (5 Clean Interactive Links) --- */}
            <div className="shrink-0 space-y-2">
              <p className="text-xs font-bold tracking-[0.22em] text-[#c4622d] uppercase">
                Support
              </p>
              <ul className="space-y-2.5">
                {[
                  { label: "Suivi de Commande", tab: "suivi" as const },
                  { label: "Livraison & Expédition", tab: "livraison" as const },
                  { label: "Retours & Échanges", tab: "retours" as const },
                  { label: "Questions Fréquentes (FAQ)", tab: "faq" as const },
                  { label: "Politique de Confidentialité", tab: "confidentialite" as const },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSupportTab(item.tab);
                        setTrackingStatus(null);
                      }}
                      className="text-[13px] font-medium text-white/80 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block text-left cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* --- COLUMN 4: RÉSEAUX SOCIAUX (Horizontal Row) --- */}
            <div className="shrink-0 space-y-2">
              <p className="text-xs font-bold tracking-[0.22em] text-[#c4622d] uppercase">
                Réseaux Sociaux
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                {/* 1. Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram MARJAD"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#c4622d] hover:scale-110 hover:border-white transition-all duration-200 shadow-sm"
                >
                  <svg
                    className="w-4 h-4 fill-none stroke-current stroke-2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>

                {/* 2. Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook MARJAD"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#c4622d] hover:scale-110 hover:border-white transition-all duration-200 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* 3. TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok MARJAD"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#c4622d] hover:scale-110 hover:border-white transition-all duration-200 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.93-4.47V8.77a8.27 8.27 0 0 0 4.84 1.56V6.88c-.34-.05-.68-.12-1-.19z" />
                  </svg>
                </a>

                {/* 4. WhatsApp */}
                <a
                  href="https://wa.me/212654321098"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp MARJAD"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#c4622d] hover:scale-110 hover:border-white transition-all duration-200 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. LOWER SECTION (Watermark with Auto-Sweep & Mouse Spotlight)            */}
        {/* ========================================================================= */}
        <div className="relative z-10 w-full select-none mt-2.5 sm:mt-3.5 h-[235px] sm:h-[255px] lg:h-[275px] overflow-hidden">
          {/* MASSIVE WATERMARK WITH AUTO-SWEEP BEAM (D -> M) & MOUSE SPOTLIGHT */}
          <div
            ref={watermarkRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseMove}
            className="relative w-full h-full flex justify-center items-end pb-8 sm:pb-9 select-none overflow-hidden cursor-default group pointer-events-auto"
          >
            {/* 1. Base ambient watermark: Clean unified outline with 2.5px crisp white border */}
            <svg
              viewBox={MARJAD_PATH_DATA.viewBox}
              className="w-full h-auto max-h-[150px] sm:max-h-[175px] lg:max-h-[200px] max-w-[1040px] sm:max-w-[1140px] lg:max-w-[1200px] px-3 sm:px-6 pointer-events-none select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={MARJAD_PATH_DATA.d}
                fill="none"
                stroke="rgba(255, 255, 255, 0.82)"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{
                  filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.90))",
                }}
              />
            </svg>

            {/* 2. Auto Scroll Beam Sweep Layer (Sweeps Right to Left: D -> M on scroll into view) */}
            <div
              ref={beamRef}
              aria-hidden="true"
              className="absolute inset-0 flex justify-center items-end pb-8 sm:pb-9 pointer-events-none select-none transition-opacity duration-300"
              style={{
                opacity: "var(--beam-opacity, 0)",
                WebkitMaskImage:
                  "radial-gradient(180px circle at var(--beam-x, -500px) var(--beam-y, 50%), black 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)",
                maskImage:
                  "radial-gradient(180px circle at var(--beam-x, -500px) var(--beam-y, 50%), black 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)",
              }}
            >
              <svg
                viewBox={MARJAD_PATH_DATA.viewBox}
                className="w-full h-auto max-h-[150px] sm:max-h-[175px] lg:max-h-[200px] max-w-[1040px] sm:max-w-[1140px] lg:max-w-[1200px] px-3 sm:px-6 pointer-events-none select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d={MARJAD_PATH_DATA.d}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.95)"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  style={{
                    filter:
                      "drop-shadow(0 0 6px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 14px rgba(233, 220, 213, 0.45))",
                  }}
                />
              </svg>
            </div>

            {/* 3. Interactive Mouse Spotlight Layer (Soft, elegant light matching Vinillia exact style) */}
            <div
              ref={spotlightRef}
              aria-hidden="true"
              className="absolute inset-0 flex justify-center items-end pb-8 sm:pb-9 pointer-events-none select-none transition-opacity duration-300"
              style={{
                opacity: "var(--mouse-opacity, 0)",
                WebkitMaskImage:
                  "radial-gradient(180px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), black 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)",
                maskImage:
                  "radial-gradient(180px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), black 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)",
              }}
            >
              <svg
                viewBox={MARJAD_PATH_DATA.viewBox}
                className="w-full h-auto max-h-[150px] sm:max-h-[175px] lg:max-h-[200px] max-w-[1040px] sm:max-w-[1140px] lg:max-w-[1200px] px-3 sm:px-6 pointer-events-none select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d={MARJAD_PATH_DATA.d}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.95)"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  style={{
                    filter:
                      "drop-shadow(0 0 6px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 14px rgba(233, 220, 213, 0.45))",
                  }}
                />
              </svg>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. BOTTOM COPYRIGHT & LEGAL BAR (Floating cleanly without dark box overlay) */}
          {/* ========================================================================= */}
          <div className="pointer-events-auto absolute bottom-0 inset-x-0 z-20 w-full px-5 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between text-[10px] text-white/80 font-medium uppercase tracking-[0.18em] gap-2">
            <p className="text-center sm:text-left drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
              © {new Date().getFullYear()} MARJAD. Tous droits réservés.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
              <span>100% Fait Main au Maroc</span>
              <span>•</span>
              <span>Paiement à la Livraison</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 5. MULTI-TAB SUPPORT & SERVICE CLIENT MODAL WITH MOROCCAN WOOD LATTICE     */}
      {/* ========================================================================= */}
      {activeSupportTab && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveSupportTab(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[88vh] text-white rounded-3xl border border-[#c4622d]/40 shadow-2xl relative bg-black flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background with authentic Moroccan Mashrabiya Lattice (dark at top, zakhrafa at bottom) */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 rounded-3xl">
              <MoroccanWoodLattice className="w-full h-full" />
              {/* Soft dark overlay: pitch black at top, subtle lattice reveal at bottom */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, #000000 0%, #000000 22%, rgba(0,0,0,0.96) 45%, rgba(0,0,0,0.80) 75%, rgba(0,0,0,0.42) 100%)",
                }}
              />
            </div>

            {/* Modal Header */}
            <div className="relative z-10 p-5 sm:p-6 pb-3 sm:pb-4 border-b border-white/10 bg-black/60 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#c4622d]/20 border border-[#c4622d]/40 flex items-center justify-center text-[#c4622d] shadow-sm shrink-0">
                    {activeSupportTab === "suivi" && <Truck className="w-5 h-5" />}
                    {activeSupportTab === "livraison" && <PackageCheck className="w-5 h-5" />}
                    {activeSupportTab === "retours" && <RefreshCw className="w-5 h-5" />}
                    {activeSupportTab === "faq" && <HelpCircle className="w-5 h-5" />}
                    {activeSupportTab === "confidentialite" && <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
                      {activeSupportTab === "suivi" && "Suivi de votre Commande"}
                      {activeSupportTab === "livraison" && "Livraison & Expédition"}
                      {activeSupportTab === "retours" && "Garantie & Retours 7 Jours"}
                      {activeSupportTab === "faq" && "Questions Fréquentes (FAQ)"}
                      {activeSupportTab === "confidentialite" && "Politique de Confidentialité"}
                    </h3>
                    <p className="text-xs text-[#d4a853] font-medium tracking-wide">
                      Maison MARJAD • Espace Support &amp; Conciergerie Artisanale
                    </p>
                  </div>
                </div>

                {/* Bouton Fermer professionnel avec rotation fluide */}
                <button
                  type="button"
                  onClick={() => setActiveSupportTab(null)}
                  className="group w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full border border-white/20 hover:border-[#c4622d] bg-white/10 hover:bg-[#c4622d]/20 flex items-center justify-center text-white/70 hover:text-[#c4622d] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shrink-0 shadow-sm"
                  aria-label="Fermer"
                  title="Fermer (Échap)"
                >
                  <X className="w-4 h-4 stroke-[2] transition-transform duration-300 group-hover:rotate-90" />
                </button>
              </div>

              {/* Horizontal Scrollable Tabs */}
              <div className="flex items-center gap-1.5 sm:gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: "suivi" as const, label: "Suivi de Commande" },
                  { id: "livraison" as const, label: "Livraison & Expédition" },
                  { id: "retours" as const, label: "Retours & Échanges" },
                  { id: "faq" as const, label: "Questions Fréquentes" },
                  { id: "confidentialite" as const, label: "Confidentialité" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveSupportTab(tab.id);
                      setTrackingStatus(null);
                    }}
                    className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      activeSupportTab === tab.id
                        ? "bg-[#c4622d] text-white shadow-md shadow-[#c4622d]/30 font-bold"
                        : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body (Scrollable with Moroccan Zakhrafa at the bottom) */}
            <div className="relative z-10 flex-1 overflow-y-auto p-5 sm:p-7 pb-8 sm:pb-12 text-sm text-neutral-200 leading-relaxed">
              <div key={activeSupportTab} className="animate-tab-enter space-y-6">
                {/* TAB 1: SUIVI */}
                {activeSupportTab === "suivi" && (
                  <div className="space-y-6">
                    {/* Tracking input tool */}
                    <div className="rounded-2xl border border-[#c4622d]/30 bg-white/[0.04] p-4 sm:p-5 space-y-3">
                      <h4 className="text-xs uppercase tracking-wider text-[#d4a853] font-bold">
                        Rechercher l&apos;état d&apos;un colis
                      </h4>
                      <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="Entrez votre N° de commande (ex: MAR-2489) ou téléphone..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/35 text-xs sm:text-sm focus:outline-none focus:border-[#c4622d] transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-[#c4622d] hover:bg-[#b05322] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                        >
                          Vérifier
                        </button>
                      </form>

                      {trackingStatus && (
                        <div className="mt-3 p-3.5 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#4ade80] text-xs flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{trackingStatus}</span>
                        </div>
                      )}
                    </div>

                    {/* 4 Steps Journey */}
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-[#d4a853] font-bold mb-3">
                        Le cycle d&apos;acheminement de votre pièce
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          {
                            step: "01",
                            title: "Façonnage & Préparation",
                            desc: "Votre création est préparée dans nos ateliers partenaires (Fès, Marrakech ou Meknès).",
                          },
                          {
                            step: "02",
                            title: "Contrôle Qualité Minutieux",
                            desc: "Vérification des finitions, du tissage et des mesures avant scellage hermétique protecteur.",
                          },
                          {
                            step: "03",
                            title: "Expédition Express Sécurisée",
                            desc: "Prise en charge par notre transporteur privé. Notification par SMS dès le départ.",
                          },
                          {
                            step: "04",
                            title: "Livraison & Paiement Espèces",
                            desc: "Le livreur vous contacte avant son passage. Vous vérifiez votre commande et réglez sur place.",
                          },
                        ].map((item) => (
                          <div
                            key={item.step}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex gap-3.5 items-start"
                          >
                            <span className="text-sm font-black text-[#c4622d] font-mono shrink-0">
                              {item.step}
                            </span>
                            <div>
                              <h5 className="font-bold text-white text-xs sm:text-sm">{item.title}</h5>
                              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: LIVRAISON */}
                {activeSupportTab === "livraison" && (
                  <div className="space-y-6">
                    {/* Delivery delays cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#d4a853]">
                          Casablanca &amp; Rabat
                        </div>
                        <div className="text-xl font-bold font-serif text-white mt-1">24h à 48h</div>
                        <div className="text-xs text-neutral-400 mt-1">Livraison prioritaire en direct</div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#d4a853]">
                          Grandes Villes
                        </div>
                        <div className="text-xl font-bold font-serif text-white mt-1">48h à 72h</div>
                        <div className="text-xs text-neutral-400 mt-1">Marrakech, Tanger, Fès, Agadir...</div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#d4a853]">
                          Autres Régions
                        </div>
                        <div className="text-xl font-bold font-serif text-white mt-1">72h à 96h</div>
                        <div className="text-xs text-neutral-400 mt-1">Acheminement sécurisé provinces</div>
                      </div>
                    </div>

                    {/* Pricing and packaging */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 space-y-2">
                        <div className="flex items-center gap-2 text-[#22c55e] font-bold text-xs uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Frais de Port Clairs</span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed">
                          • <strong>Livraison GRATUITE</strong> dès 800 DH d&apos;achat sur l&apos;ensemble du catalogue.<br />
                          • Forfait standard de <strong>35 DH</strong> pour les commandes inférieures.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 space-y-2">
                        <div className="flex items-center gap-2 text-[#d4a853] font-bold text-xs uppercase tracking-wider">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Emballage Haute Protection</span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed">
                          Chaque luminaire en laiton martelé et table en zellige est protégé dans un coffrage renforcé avec film anti-chocs pour garantir une réception impeccable.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: RETOURS */}
                {activeSupportTab === "retours" && (
                  <div className="space-y-5">
                    <div className="rounded-2xl border border-[#c4622d]/30 bg-[#c4622d]/10 p-4 sm:p-5 flex items-start gap-3.5">
                      <RefreshCw className="w-5 h-5 text-[#c4622d] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-serif font-bold text-white text-sm sm:text-base">
                          Garantie Sérénité : 7 Jours pour changer d&apos;avis
                        </h4>
                        <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                          Chez MARJAD, nous souhaitons que chaque création s&apos;intègre harmonieusement dans votre intérieur. Si la pièce ne vous convient pas totalement, vous disposez de 7 jours après réception pour un échange ou un remboursement.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          title: "1. Contactez l'Atelier",
                          desc: "Envoyez un simple message à notre conciergerie WhatsApp (+212 6 54 32 10 98) en mentionnant votre nom et la référence.",
                        },
                        {
                          title: "2. État d'Origine",
                          desc: "L'article doit être propre, non utilisé et replacé soigneusement dans son emballage de protection d'origine.",
                        },
                        {
                          title: "3. Récupération à Domicile",
                          desc: "Notre transporteur partenaire passe récupérer le colis directement chez vous, sans besoin de vous déplacer.",
                        },
                        {
                          title: "4. Remboursement Rapide",
                          desc: "Dès validation par nos artisans, votre remboursement est immédiatement émis par virement bancaire ou échange direct.",
                        },
                      ].map((step) => (
                        <div
                          key={step.title}
                          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-1.5"
                        >
                          <h5 className="font-bold text-white text-xs sm:text-sm">{step.title}</h5>
                          <p className="text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: FAQ (Smooth Animated Accordion) */}
                {activeSupportTab === "faq" && (
                  <div className="space-y-3">
                    {[
                      {
                        q: "Comment se déroule le paiement en espèces à la livraison ?",
                        a: "Vous passez commande en ligne en toute sérénité, sans renseigner de coordonnées bancaires. Notre équipe confirme l'adresse par WhatsApp ou téléphone. À l'arrivée du colis, vous inspectez votre article et réglez le montant exact en espèces auprès du livreur.",
                      },
                      {
                        q: "Toutes vos créations sont-elles authentiquement faites à la main ?",
                        a: "Oui, à 100%. Chacune de nos pièces (tapis berbères, ferronneries, luminaires en cuivre, tables zellige) est confectionnée manuellement par des maîtres artisans marocains reconnus, garantissant un cachet unique et un savoir-faire préservé.",
                      },
                      {
                        q: "Puis-je commander des dimensions personnalisées sur-mesure ?",
                        a: "Absolument ! Qu'il s'agisse des dimensions d'un tapis Beni Ourain pour votre salon ou d'une suspension en laiton spécifique, nos artisans conçoivent vos pièces sur-mesure. Transmettez-nous vos souhaits via WhatsApp pour un devis gratuit sous 24h.",
                      },
                      {
                        q: "Comment entretenir les tapis, luminaires et zelliges ?",
                        a: "Chaque commande est accompagnée de conseils d'experts : les tapis en laine naturelle s'aspirent délicatement sans brosse ; les cuivres et laitons conservent leur patine avec un chiffon doux microfibre sans produit décapant abrasif.",
                      },
                      {
                        q: "Que faire en cas d'imprévu ou de colis endommagé ?",
                        a: "Chaque envoi est entièrement assuré. En cas de dommage constaté à la livraison, signalez-le simplement sur WhatsApp avec une photo. Nous procédons au remplacement et à la réexpédition immédiate sans frais supplémentaires.",
                      },
                    ].map((faq, idx) => {
                      const isOpen = modalFaqIndex === idx;
                      return (
                        <div
                          key={idx}
                          className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                            isOpen
                              ? "border-[#c4622d]/45 bg-white/[0.06] shadow-sm shadow-[#c4622d]/10"
                              : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.04]"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setModalFaqIndex(isOpen ? null : idx)}
                            className="w-full py-3.5 px-4 sm:px-5 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-white hover:text-[#d4a853] transition-colors cursor-pointer group"
                          >
                            <span className={isOpen ? "text-[#d4a853] font-bold" : ""}>{faq.q}</span>
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ml-2 ${
                                isOpen
                                  ? "bg-[#c4622d]/25 text-[#c4622d] rotate-180"
                                  : "bg-white/5 text-neutral-400 group-hover:text-white"
                              }`}
                            >
                              <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300" />
                            </div>
                          </button>
                          
                          {/* Animated Collapsible Container via CSS Grid */}
                          <div
                            className={`grid transition-all duration-300 ease-in-out ${
                              isOpen
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0 pointer-events-none"
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-white/10 pt-3 bg-white/[0.02]">
                                {faq.a}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TAB 5: CONFIDENTIALITÉ */}
                {activeSupportTab === "confidentialite" && (
                  <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4a853]">
                        1. Collecte des Données Personnelles
                      </h4>
                      <p>
                        Dans le cadre de votre navigation et de la passation de commandes sur le site MARJAD, nous collectons uniquement les informations indispensables au bon acheminement de vos créations artisanales (Nom, Prénom, Numéro de téléphone pour la coordination du livreur, Adresse de livraison au Maroc et Adresse email).
                      </p>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4a853]">
                        2. Paiement à la Livraison &amp; Sécurité
                      </h4>
                      <p>
                        MARJAD privilégie le paiement en espèces à la livraison. Vos coordonnées bancaires ne sont jamais collectées ni traitées en ligne sans votre consentement explicite. Vos données restent strictement confidentielles et ne sont jamais cédées ni vendues à des tiers publicitaires.
                      </p>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4a853]">
                        3. Échanges WhatsApp &amp; Confection Sur-Mesure
                      </h4>
                      <p>
                        Lorsque vous nous transmettez des photos de vos salons, pièces ou dimensions pour la confection personnalisée d&apos;un tapis ou d&apos;un luminaire, ces documents sont utilisés exclusivement par nos maîtres artisans pour la réalisation de votre projet.
                      </p>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4a853]">
                        4. Vos Droits d&apos;Accès &amp; de Rectification
                      </h4>
                      <p>
                        Conformément à la loi marocaine n° 09-08, vous disposez d&apos;un droit permanent d&apos;accès, de rectification et d&apos;opposition sur vos données personnelles par simple message à{" "}
                        <strong className="text-[#d4a853]">contact@marjad.ma</strong> ou via notre service client WhatsApp au{" "}
                        <strong className="text-white">+212 6 54 32 10 98</strong>.
                      </p>
                    </section>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


