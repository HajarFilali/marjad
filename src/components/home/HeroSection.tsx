"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Users,
  ArrowRight,
  Banknote,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { LaserMarjadWordmark } from "./LaserMarjadWordmark";
import { DECOR_PRODUCTS } from "@/data/mockProducts";

export function HeroSection() {
  // Top 3 emblematic products from DECOR_PRODUCTS
  const heroProducts = DECOR_PRODUCTS.slice(0, 3);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Centered showcase & interactive reveal state
  const [isRevealed, setIsRevealed] = useState(false);
  const [centerOffset, setCenterOffset] = useState<number>(175);
  const [targetScale, setTargetScale] = useState<number>(1.95);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const marjadWrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const bottomDivsRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);

  // Transition cooldown to prevent jitter
  const lastTransitionTimeRef = useRef<number>(0);
  const isRevealedRef = useRef<boolean>(isRevealed);
  isRevealedRef.current = isRevealed;

  // Flashlight Torch Cursor State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isHovering: false });
  const [smoothSectionPos, setSmoothSectionPos] = useState({ x: 0, y: 0 });
  const [smoothDivsPos, setSmoothDivsPos] = useState({ x: 0, y: 0 });
  const [smoothWelcomePos, setSmoothWelcomePos] = useState({ x: 0, y: 0 });
  const targetSectionRef = useRef({ x: 0, y: 0 });
  const currentSectionRef = useRef({ x: 0, y: 0 });
  const targetDivsRef = useRef({ x: 0, y: 0 });
  const currentDivsRef = useRef({ x: 0, y: 0 });
  const targetWelcomeRef = useRef({ x: 0, y: 0 });
  const currentWelcomeRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  // Smooth lerp loop for the flashlight cursor
  useEffect(() => {
    if (isRevealed) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    let isRunning = true;
    const loop = () => {
      if (!isRunning) return;

      const dxSec = targetSectionRef.current.x - currentSectionRef.current.x;
      const dySec = targetSectionRef.current.y - currentSectionRef.current.y;
      const isMoving = Math.abs(dxSec) > 0.1 || Math.abs(dySec) > 0.1;

      currentSectionRef.current.x += dxSec * 0.18;
      currentSectionRef.current.y += dySec * 0.18;

      currentDivsRef.current.x += (targetDivsRef.current.x - currentDivsRef.current.x) * 0.18;
      currentDivsRef.current.y += (targetDivsRef.current.y - currentDivsRef.current.y) * 0.18;

      currentWelcomeRef.current.x += (targetWelcomeRef.current.x - currentWelcomeRef.current.x) * 0.18;
      currentWelcomeRef.current.y += (targetWelcomeRef.current.y - currentWelcomeRef.current.y) * 0.18;

      if (isMoving) {
        setSmoothSectionPos({
          x: Math.round(currentSectionRef.current.x * 10) / 10,
          y: Math.round(currentSectionRef.current.y * 10) / 10,
        });
        setSmoothDivsPos({
          x: Math.round(currentDivsRef.current.x * 10) / 10,
          y: Math.round(currentDivsRef.current.y * 10) / 10,
        });
        setSmoothWelcomePos({
          x: Math.round(currentWelcomeRef.current.x * 10) / 10,
          y: Math.round(currentWelcomeRef.current.y * 10) / 10,
        });
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      isRunning = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRevealed]);

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (isRevealed) return;
    if (sectionRef.current) {
      const sRect = sectionRef.current.getBoundingClientRect();
      targetSectionRef.current = {
        x: clientX - sRect.left,
        y: clientY - sRect.top,
      };
      if (!mousePos.isHovering) {
        currentSectionRef.current = { ...targetSectionRef.current };
      }
    }
    if (bottomDivsRef.current) {
      const dRect = bottomDivsRef.current.getBoundingClientRect();
      targetDivsRef.current = {
        x: clientX - dRect.left,
        y: clientY - dRect.top,
      };
      if (!mousePos.isHovering) {
        currentDivsRef.current = { ...targetDivsRef.current };
      }
    }
    if (welcomeRef.current) {
      const wRect = welcomeRef.current.getBoundingClientRect();
      targetWelcomeRef.current = {
        x: clientX - wRect.left,
        y: clientY - wRect.top,
      };
      if (!mousePos.isHovering) {
        currentWelcomeRef.current = { ...targetWelcomeRef.current };
      }
    }
    if (!mousePos.isHovering) {
      setMousePos({ x: clientX, y: clientY, isHovering: true });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMouseLeave = () => {
    if (isRevealed) return;
    setMousePos((prev) => ({ ...prev, isHovering: false }));
  };

  // Global pointer move tracking when in unrevealed dark stage
  useEffect(() => {
    if (isRevealed) return;
    const handleGlobalPointerMove = (e: PointerEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };
    window.addEventListener("pointermove", handleGlobalPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleGlobalPointerMove);
  }, [isRevealed]);

  // Compute exact center offset and scale for the centered MARJAD wordmark
  useEffect(() => {
    setIsMounted(true);
    const compute = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMob = w < 640;
      setIsMobile(isMob);

      // Base width of the MARJAD container at header position
      const baseWidth = isMob ? 300 : w < 768 ? 390 : w < 1024 ? 490 : 565;
      // Target width in unrevealed state: ~88% of screen width (capped at 1150px)
      const desiredWidth = Math.min(1150, w * 0.88);
      const s = Math.max(1.15, desiredWidth / baseWidth);
      setTargetScale(s);

      // Natural center of MARJAD wordmark inside sectionRef at scrollY=0:
      // sectionRef has paddingTop = 92px
      // marjadWrapperRef has pt-4.5 (18px)
      // SVG aspect ratio: 67 / 565
      const baseH = baseWidth * (67 / 565);
      const naturalCenterY = 92 + (isMob ? 18 : 22) + baseH / 2;
      const screenCenterY = h / 2;

      // Exact translation along Y to position MARJAD at exact screenCenterY:
      const computedOffset = screenCenterY - naturalCenterY;
      setCenterOffset(Math.round(computedOffset));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Broadcast reveal state for header synchronization
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__MARJAD_REVEALED__ = isRevealed;
      window.dispatchEvent(
        new CustomEvent("marjad-hero-state", { detail: { isRevealed } })
      );
    }
  }, [isRevealed]);

  // Reveal handler (transition to white state with divs)
  const reveal = useCallback(() => {
    const now = Date.now();
    if (now - lastTransitionTimeRef.current < 400) return;
    lastTransitionTimeRef.current = now;
    setIsRevealed(true);
  }, []);

  // Unreveal handler (transition back to full black MARJAD view when scrolling up at top)
  const unreveal = useCallback(() => {
    const now = Date.now();
    if (now - lastTransitionTimeRef.current < 400) return;
    lastTransitionTimeRef.current = now;
    window.scrollTo({ top: 0, behavior: "instant" });
    setIsRevealed(false);
  }, []);

  // Interactive bidirectional reveal and unreveal
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastTransitionTimeRef.current < 350) return;

      if (!isRevealedRef.current) {
        // In black stage: scrolling down triggers reveal
        if (e.deltaY > 10) {
          reveal();
        }
      } else {
        // In revealed stage: if user is at the top of the page (scrollY <= 4) and scrolls UP
        if (window.scrollY <= 4 && e.deltaY < -12) {
          unreveal();
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchSwipe = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const diff = touchY - touchStartY; // positive = swipe down, negative = swipe up
      const now = Date.now();
      if (now - lastTransitionTimeRef.current < 350) return;

      if (!isRevealedRef.current) {
        // In black stage: swiping up reveals
        if (diff < -25) {
          reveal();
        }
      } else {
        // In revealed stage: swiping down while at top of page (scrollY <= 4) unreveals
        if (window.scrollY <= 4 && diff > 35) {
          unreveal();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isRevealedRef.current) {
        if (e.key === "ArrowDown" || e.key === " " || e.key === "Enter" || e.key === "PageDown") {
          reveal();
        }
      } else {
        if (window.scrollY <= 4 && (e.key === "ArrowUp" || e.key === "PageUp")) {
          unreveal();
        }
      }
    };

    const handlePageScroll = () => {
      if (!isRevealedRef.current && window.scrollY > 6) {
        reveal();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchSwipe, { passive: true });
    window.addEventListener("scroll", handlePageScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchSwipe);
      window.removeEventListener("scroll", handlePageScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [reveal, unreveal]);

  // Continuous smooth scroll tracking to match PromoBar and Navbar
  useEffect(() => {
    let ticking = false;
    let prevP = -1;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sy = window.scrollY;
          const p = Math.min(1, Math.max(0, sy / 36));
          if (p !== prevP) {
            setScrollProgress(p);
            prevP = p;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Half-height of centered MARJAD wordmark for band exclusion
  const baseW = isMobile ? 300 : 565;
  const baseH = baseW * (67 / 565);
  const marjadHalfH = (baseH * targetScale) / 2;
  const screenCenterH = typeof window !== "undefined" ? window.innerHeight / 2 : 320;

  // Whether the cursor is hovering inside the centered MARJAD band (no cards or welcome text allowed here)
  const isCursorInMarjadBand =
    !isRevealed && Math.abs(smoothSectionPos.y - screenCenterH) < marjadHalfH + 20;

  // Whether the bottom cards should be illuminated (only when cursor is strictly BELOW MARJAD)
  const isBottomDivsIlluminated =
    !isRevealed && mousePos.isHovering && !isCursorInMarjadBand && smoothSectionPos.y > screenCenterH + 10;

  // Whether the top welcome should be illuminated (only when cursor is strictly ABOVE MARJAD)
  const isWelcomeIlluminated =
    !isRevealed && mousePos.isHovering && !isCursorInMarjadBand && smoothSectionPos.y < screenCenterH - 20;

  return (
    <div
      className={`relative w-full min-h-screen lg:h-[calc(100vh+85px)] transition-colors duration-900 cubic-bezier(0.16, 1, 0.3, 1) ${
        isRevealed ? "bg-white" : "bg-black"
      }`}
    >
      {/* Sticky Full-Viewport Hero Container */}
      <section
        ref={sectionRef}
        onClick={() => !isRevealed && reveal()}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseLeave={handleMouseLeave}
        className={`relative lg:sticky lg:top-0 w-full min-h-screen lg:h-screen lg:overflow-hidden flex flex-col justify-between transition-colors duration-900 cubic-bezier(0.16, 1, 0.3, 1) ${
          isRevealed ? "bg-white" : "bg-black"
        } px-4 sm:px-6 lg:px-8 pb-2 sm:pb-2.5 lg:pb-3 ${
          !isRevealed ? "cursor-pointer" : ""
        }`}
        style={{
          paddingTop: `${94 - scrollProgress * 36}px`,
          willChange: "padding-top",
        }}
      >
        {/* Flashlight Ambient Light Beam (Follows cursor on black stage - subtle and discreet) */}
        {!isRevealed && mousePos.isHovering && (
          <div
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 180px at ${smoothSectionPos.x}px ${smoothSectionPos.y}px, rgba(255, 240, 220, 0.015) 0%, rgba(200, 159, 83, 0.008) 40%, transparent 70%)`,
            }}
          />
        )}

        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0 relative z-20">
          {/* ========================================================================= */}
          {/* 1. TOP SECRET "BIENVENUE" (In dark stage) & STYLIZED "MARJAD" WORDMARK   */}
          {/* ========================================================================= */}
          <div
            ref={marjadWrapperRef}
            className="w-full flex justify-center items-center pt-4.5 pb-3.5 sm:pt-5 sm:pb-4 lg:pt-5.5 lg:pb-4.5 shrink-0 relative z-40 min-h-[90px]"
          >
            {/* Top Secret "Bienvenue chez MARJAD" Ticker - Revealed by cursor flashlight in dark state */}
            <div
              ref={welcomeRef}
              className="absolute -inset-x-4 sm:-inset-x-6 lg:-inset-x-8 top-0 bottom-0 flex items-center overflow-hidden pointer-events-none select-none transition-opacity duration-500 z-10"
              style={{
                opacity: isRevealed ? 0 : isWelcomeIlluminated ? 1 : 0,
                WebkitMaskImage: !isRevealed
                  ? `radial-gradient(circle 260px at ${smoothWelcomePos.x}px ${smoothWelcomePos.y}px, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.35) 50%, transparent 80%)`
                  : "none",
                maskImage: !isRevealed
                  ? `radial-gradient(circle 260px at ${smoothWelcomePos.x}px ${smoothWelcomePos.y}px, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.35) 50%, transparent 80%)`
                  : "none",
              }}
            >
              <div className="flex w-max animate-marquee-left items-center select-none py-2">
                {[...Array(2)].map((_, groupIdx) => (
                  <div key={groupIdx} className="flex items-center shrink-0">
                    {[
                      { text: "Bienvenue chez MARJAD", color: "gold" },
                      { text: "Bienvenue chez MARJAD", color: "white" },
                      { text: "Bienvenue chez MARJAD", color: "gold" },
                      { text: "Bienvenue chez MARJAD", color: "white" },
                      { text: "Bienvenue chez MARJAD", color: "gold" },
                      { text: "Bienvenue chez MARJAD", color: "white" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center shrink-0">
                        {/* Moroccan Rosette Icon in Brown */}
                        <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 relative shrink-0 mx-4 sm:mx-6 lg:mx-8">
                          <Image
                            src="/moroccan-logo-symbol-brown.png"
                            alt=""
                            width={28}
                            height={28}
                            className="w-full h-full object-contain brightness-110 drop-shadow-[0_1px_6px_rgba(196,98,45,0.4)]"
                          />
                        </div>
                        {/* Single-line text: Bienvenue chez MARJAD */}
                        <span
                          className={`text-base sm:text-lg md:text-xl lg:text-2xl font-serif font-black tracking-[0.22em] uppercase whitespace-nowrap ${
                            item.color === "gold"
                              ? "text-[#d4a853] drop-shadow-[0_2px_14px_rgba(212,168,83,0.4)]"
                              : "text-[#faf3eb] drop-shadow-[0_2px_14px_rgba(255,255,255,0.35)]"
                          }`}
                        >
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Centered MARJAD Wordmark - Completely visible, bright and prominent */}
            <div
              className="w-full max-w-[300px] sm:max-w-[390px] md:max-w-[490px] lg:max-w-[565px] px-2 flex flex-col items-center relative z-40"
              style={{
                transform: !isMounted
                  ? "none"
                  : isRevealed
                  ? `translate3d(0, 0, 0) scale(${1 + scrollProgress * 0.08})`
                  : `translate3d(0, ${centerOffset}px, 0) scale(${isMobile ? 1.25 : targetScale})`,
                transformOrigin: "center center",
                transition: isMounted ? "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                willChange: "transform",
              }}
            >
              <LaserMarjadWordmark
                fill="#c4622d"
                isRevealed={isRevealed}
                className={`w-full h-auto transition-all duration-900 cubic-bezier(0.16, 1, 0.3, 1) ${
                  isRevealed
                    ? "drop-shadow-[0_2px_10px_rgba(196,98,45,0.07)]"
                    : "drop-shadow-none"
                }`}
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. HERO CONTENT: Bottom Divs (Illuminated only BELOW MARJAD)             */}
          {/* ========================================================================= */}
          <div
            ref={bottomDivsRef}
            style={{
              WebkitMaskImage: !isRevealed
                ? isBottomDivsIlluminated
                  ? `radial-gradient(circle 200px at ${smoothDivsPos.x}px ${smoothDivsPos.y}px, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 45%, transparent 75%)`
                  : "radial-gradient(circle 0px at 0px 0px, transparent 0%, transparent 100%)"
                : "none",
              maskImage: !isRevealed
                ? isBottomDivsIlluminated
                  ? `radial-gradient(circle 200px at ${smoothDivsPos.x}px ${smoothDivsPos.y}px, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 45%, transparent 75%)`
                  : "radial-gradient(circle 0px at 0px 0px, transparent 0%, transparent 100%)"
                : "none",
              opacity: isRevealed ? 1 : isBottomDivsIlluminated ? 1 : 0,
              transition: isMounted
                ? "opacity 900ms cubic-bezier(0.16, 1, 0.3, 1)"
                : "none",
              pointerEvents: isRevealed ? "auto" : "none",
              willChange: "opacity",
            }}
            className="flex flex-col lg:flex-row gap-3 sm:gap-3.5 lg:gap-4.5 items-stretch justify-between flex-1 min-h-0 relative z-10"
          >
            {/* Smooth dark gradient shadow on top of background cards - Never touches MARJAD */}
            {!isRevealed && (
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-44 z-20 select-none rounded-t-[26px] transition-opacity duration-900"
                style={{
                  background:
                    "linear-gradient(to bottom, #000000 0%, #000000 28%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.4) 75%, transparent 100%)",
                }}
              />
            )}
            
            {/* ================= LEFT BOX: DESCRIPTION ================= */}
            <div className="flex-1 min-w-0 flex flex-col h-full">
              <div className="w-full h-full p-4 sm:p-5 lg:p-6 rounded-[22px] sm:rounded-[26px] bg-white border border-[#ebd8be]/80 shadow-[0_4px_22px_-4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                <div>
                  {/* Artisanal Badge with Official Moroccan Rosette Emblem (No star) */}
                  <div className="inline-flex items-center gap-2 text-[10px] sm:text-[10.5px] font-bold uppercase tracking-widest text-[#ba4e1a] bg-[#faf6f0] px-3 py-1 rounded-full border border-[#ebd8be]/70 mb-2 sm:mb-2.5 shadow-2xs">
                    <div className="w-3.5 h-3.5 relative shrink-0">
                      <Image
                        src="/moroccan-logo-symbol.png"
                        alt=""
                        width={14}
                        height={14}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span>Artisanat Marocain d&apos;Exception</span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-lg sm:text-xl lg:text-[25px] font-serif font-black text-[#1c1917] leading-[1.2] tracking-tight mb-2">
                    L&apos;artisanat marocain, <br className="hidden sm:inline" />
                    <span className="text-[#ba4e1a]">au cœur de votre intérieur</span>
                  </h1>

                  {/* Moroccan Rosette Emblem Divider (Exact Logo Rosette + Matching Gold Border) */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 relative shrink-0">
                      <Image
                        src="/moroccan-logo-symbol.png"
                        alt="Symbole Marjad"
                        width={18}
                        height={18}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="w-20 sm:w-24 h-[1.5px] bg-gradient-to-r from-[#c89f53] via-[#c89f53]/45 to-transparent rounded-full" />
                  </div>

                  {/* Value Proposition Description */}
                  <p className="text-xs sm:text-[13px] lg:text-[13.5px] text-[#1c1917]/85 leading-relaxed font-medium">
                    Découvrez des créations uniques mêlant bois noble, métal ciselé et motifs ancestraux, pensées pour apporter une touche d&apos;authenticité et d&apos;élégance à votre espace de vie.
                  </p>
                </div>

                {/* 3 Pillars of Reassurance (bg-white, prominent icons, larger clear font) */}
                <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-[#ebd8be]/60">
                  {/* Pilier 1 : Paiement COD */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#ebd8be]/80 flex flex-col justify-between gap-1 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-lg bg-[#faf6f0] border border-[#ebd8be]/70 flex items-center justify-center shrink-0">
                        <Banknote className="w-3.5 h-3.5 text-[#ba4e1a] stroke-[2.2]" />
                      </div>
                      <p className="text-[11px] sm:text-[11.5px] font-bold text-[#1c1917] tracking-tight whitespace-nowrap">
                        Paiement COD
                      </p>
                    </div>
                    <p className="text-[9px] sm:text-[9.5px] text-[#1c1917]/75 font-medium leading-tight pl-0.5">
                      À la livraison
                    </p>
                  </div>

                  {/* Pilier 2 : Toutes Villes */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#ebd8be]/80 flex flex-col justify-between gap-1 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-lg bg-[#faf6f0] border border-[#ebd8be]/70 flex items-center justify-center shrink-0">
                        <Truck className="w-3.5 h-3.5 text-[#ba4e1a] stroke-[2.2]" />
                      </div>
                      <p className="text-[11px] sm:text-[11.5px] font-bold text-[#1c1917] tracking-tight whitespace-nowrap">
                        Toutes Villes
                      </p>
                    </div>
                    <p className="text-[9px] sm:text-[9.5px] text-[#1c1917]/75 font-medium leading-tight pl-0.5">
                      Express 48h–72h
                    </p>
                  </div>

                  {/* Pilier 3 : Anti-Casse */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#ebd8be]/80 flex flex-col justify-between gap-1 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-lg bg-[#faf6f0] border border-[#ebd8be]/70 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#ba4e1a] stroke-[2.2]" />
                      </div>
                      <p className="text-[11px] sm:text-[11.5px] font-bold text-[#1c1917] tracking-tight whitespace-nowrap">
                        Anti–Casse
                      </p>
                    </div>
                    <p className="text-[9px] sm:text-[9.5px] text-[#1c1917]/75 font-medium leading-tight pl-0.5">
                      Échange garanti
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= RIGHT SIDE: 3 PRODUCTS + BUTTONS (Stylized Luxury Design) ================= */}
            <div className="w-full lg:w-[560px] xl:w-[600px] shrink-0 flex flex-col justify-between gap-2.5 sm:gap-3 h-full">
              {/* Top: 3 Products in a Single Row */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:gap-3.5 flex-1 min-h-0">
                {heroProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/boutique`}
                    className="group relative flex flex-col justify-between p-3 sm:p-3.5 rounded-[20px] sm:rounded-[24px] bg-white border border-[#ebd8be]/85 hover:border-[#c4622d]/80 shadow-[0_4px_18px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(186,78,26,0.12)] transition-all duration-400 hover:-translate-y-1 overflow-hidden h-full"
                  >
                    {/* Top Row: Category Pill & Discount Badge */}
                    <div className="w-full flex items-center justify-between mb-1.5 shrink-0">
                      <span className="text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-[#ba4e1a] bg-[#faf6f0] px-2.5 py-0.5 rounded-full border border-[#ebd8be]/70 line-clamp-1">
                        {product.category}
                      </span>
                      {product.discountPercent && (
                        <span className="text-[8.5px] font-bold text-white bg-gradient-to-r from-[#ba4e1a] to-[#9c3a0c] px-2 py-0.5 rounded-full shadow-2xs">
                          -{product.discountPercent}%
                        </span>
                      )}
                    </div>

                    {/* Product Showcase Podium (Luxury ambient background) */}
                    <div className="relative w-full flex-1 min-h-[95px] max-h-[145px] sm:max-h-[160px] my-1.5 flex items-center justify-center bg-gradient-to-b from-[#faf6f0]/50 via-white to-white rounded-xl p-1.5">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 33vw, 20vw"
                        className="object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.09)] transition-transform duration-500 group-hover:scale-108"
                      />
                    </div>

                    {/* Product Title & Price */}
                    <div className="w-full pt-2 border-t border-[#ebd8be]/60 text-left shrink-0">
                      <h3 className="text-[11px] sm:text-xs font-bold text-[#1c1917] line-clamp-1 group-hover:text-[#ba4e1a] transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-[13px] font-black text-[#ba4e1a]">
                            {product.price} DH
                          </span>
                          {product.originalPrice && (
                            <span className="text-[8.5px] sm:text-[9px] text-[#8c827a] line-through">
                              {product.originalPrice} DH
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-[#ba4e1a] opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                          &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Bottom: Buttons Container spanning the exact width of the 3 products */}
              <div className="w-full rounded-[16px] sm:rounded-[20px] bg-white border border-[#ebd8be]/80 p-2 sm:p-2.5 flex flex-row items-center justify-between gap-2.5 sm:gap-3.5 shadow-[0_4px_18px_-4px_rgba(0,0,0,0.03)] shrink-0">
                {/* Button 1: Explorer la boutique */}
                <Link
                  href="/boutique"
                  className="flex-1 py-2.5 px-3.5 sm:px-5 rounded-full bg-gradient-to-r from-[#ba4e1a] to-[#9c3a0c] hover:from-[#9c3a0c] hover:to-[#822f08] text-white font-extrabold text-xs sm:text-[12.5px] transition-all duration-300 shadow-md shadow-[#ba4e1a]/25 hover:shadow-lg hover:shadow-[#ba4e1a]/35 hover:-translate-y-0.5 flex items-center justify-center gap-2 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-white" />
                  <span>Explorer la boutique</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>

                {/* Button 2: Notre histoire */}
                <Link
                  href="/a-propos"
                  className="flex-1 py-2.5 px-3.5 sm:px-5 rounded-full bg-[#faf6f0] hover:bg-[#f4ece4] text-[#1c1917] hover:text-[#ba4e1a] font-bold text-xs sm:text-[12.5px] border border-[#ebd8be] transition-all duration-300 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 flex items-center justify-center gap-2 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Users className="w-3.5 h-3.5 text-[#ba4e1a]" />
                  <span>Notre histoire</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
