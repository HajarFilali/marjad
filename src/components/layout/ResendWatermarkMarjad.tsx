"use client";

import React, { useRef, useState, useEffect, useId } from "react";
import { MARJAD_SVG_DATA, MARJAD_PATH_DATA } from "./marjadPath";

export function ResendWatermarkMarjad() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const sweepRafRef = useRef<number | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isHoveredRef = useRef<boolean>(false);
  const hasSweptOnScrollRef = useRef<boolean>(false);

  // Logo center coordinates: (321.97, 69.78)
  const [cursor, setCursor] = useState<{ x: number; y: number }>({
    x: 321.97,
    y: 69.78,
  });
  const [isLit, setIsLit] = useState<boolean>(false);
  const [sweepOpacity, setSweepOpacity] = useState<number>(0);

  const rawId = useId();
  const id = rawId.replace(/:/g, "");

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
      if (sweepRafRef.current !== null) cancelAnimationFrame(sweepRafRef.current);
    };
  }, []);

  // Smooth entrance beam sweep across MARJAD (D -> M) when scrolled into view
  const triggerAutoSweep = () => {
    if (isHoveredRef.current) return;
    if (sweepRafRef.current !== null) cancelAnimationFrame(sweepRafRef.current);

    const startX = 740; // right of 'D'
    const endX = -90;   // left of 'M'
    const duration = 1500; // ms
    const startTime = performance.now();
    const yPos = 69.78;

    setIsLit(true);

    const animateSweep = (now: number) => {
      if (isHoveredRef.current) {
        setSweepOpacity(1);
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth cubic easeInOut
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentX = startX + (endX - startX) * ease;
      setCursor({ x: currentX, y: yPos });

      // Envelope opacity
      let op = 1;
      if (progress < 0.12) op = progress / 0.12;
      else if (progress > 0.85) op = Math.max(0, (1 - progress) / 0.15);

      setSweepOpacity(op);

      if (progress < 1) {
        sweepRafRef.current = requestAnimationFrame(animateSweep);
      } else {
        setIsLit(false);
        setSweepOpacity(0);
        sweepRafRef.current = null;
      }
    };

    sweepRafRef.current = requestAnimationFrame(animateSweep);
  };

  // IntersectionObserver to trigger auto-sweep on scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasSweptOnScrollRef.current) {
              hasSweptOnScrollRef.current = true;
              const timer = setTimeout(() => {
                triggerAutoSweep();
              }, 220);
              return () => clearTimeout(timer);
            }
          } else {
            hasSweptOnScrollRef.current = false;
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Mouse Move Handler: Converts screen mouse coordinates to exact SVG coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    isHoveredRef.current = true;
    if (sweepRafRef.current !== null) {
      cancelAnimationFrame(sweepRafRef.current);
      sweepRafRef.current = null;
    }

    mousePosRef.current = { x: e.clientX, y: e.clientY };

    if (animFrameRef.current === null) {
      animFrameRef.current = requestAnimationFrame(() => {
        animFrameRef.current = null;
        const svg = svgRef.current;
        const ctm = svg?.getScreenCTM();
        if (!svg || !ctm) return;

        const pt = svg.createSVGPoint();
        pt.x = mousePosRef.current.x;
        pt.y = mousePosRef.current.y;
        const localPt = pt.matrixTransform(ctm.inverse());

        // Keep y clamped within the letter vertical bounds so the laser beam is always centered on the letterforms
        const clampedY = Math.max(10, Math.min(130, localPt.y));
        setCursor({ x: localPt.x, y: clampedY });
        setIsLit(true);
        setSweepOpacity(1);
      });
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsLit(false);
  };

  const x = cursor.x;
  const y = cursor.y;

  // Resend chromatic aberration metric: distance from center
  const centerX = 321.97;
  const centerY = 69.78;
  const p =
    0.6 *
    Math.sqrt(
      Math.pow((x - centerX) / centerX, 2) + Math.pow((y - centerY) / centerY, 2)
    );

  const wordmarkD = MARJAD_PATH_DATA.d;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseMove}
      aria-hidden="true"
      className="relative w-full h-full flex justify-center items-end pb-8 sm:pb-9 select-none overflow-hidden cursor-default group pointer-events-auto"
    >
      <div className="relative w-full max-h-[85px] sm:max-h-[105px] lg:max-h-[120px] max-w-[700px] sm:max-w-[820px] lg:max-w-[920px] px-3 sm:px-6 flex justify-center items-end">
        {/* SINGLE ALL-IN-ONE VECTOR SVG FOR PERFECT SUB-PIXEL ALIGNMENT */}
        <svg
          ref={svgRef}
          viewBox={MARJAD_SVG_DATA.viewBox}
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block select-none pointer-events-none"
          style={{ overflow: "visible" }}
          aria-label="MARJAD"
        >
          <defs>
            {/* 1. Core Cursor Glow (Pure Luminous White Optical Laser - Exact Resend & Vinilia Light) */}
            <radialGradient
              id={`cursor-glow-${id}`}
              cx={x}
              cy={y}
              r="150"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
              <stop offset="12%" stopColor="rgba(255, 255, 255, 0.9)" />
              <stop offset="35%" stopColor="rgba(255, 255, 255, 0.55)" />
              <stop offset="65%" stopColor="rgba(255, 255, 255, 0.15)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </radialGradient>

            {/* 2. Soft Ambient Wash Gradient (Pure White Aura) */}
            <radialGradient
              id={`cursor-wash-${id}`}
              cx={x}
              cy={y}
              r="360"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.7)" />
              <stop offset="25%" stopColor="rgba(255, 255, 255, 0.3)" />
              <stop offset="60%" stopColor="rgba(255, 255, 255, 0.08)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </radialGradient>

            {/* 3. Multi-Stage Bloom Filter (Crisp SourceGraphic + tight bloom + diffuse aura) */}
            <filter
              id={`glow-filter-${id}`}
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* 4. Ambient Wide Glow Filter */}
            <filter
              id={`ambient-glow-${id}`}
              x="-200%"
              y="-200%"
              width="500%"
              height="500%"
            >
              <feGaussianBlur stdDeviation="15" result="blur" />
            </filter>

            {/* 5. Chromatic Aberration Blur Filter */}
            <filter
              id={`aberration-blur-${id}`}
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="3.5" result="blur" />
            </filter>

            {/* 6. Cursor Mask for Ambient & Aberration Layers */}
            <mask id={`cursor-mask-${id}`}>
              <rect
                x="-250"
                y="-150"
                width="1144"
                height="440"
                fill={`url(#cursor-glow-${id})`}
              />
            </mask>
          </defs>

          {/* ========================================================================= */}
          {/* LAYER 1: 100% VISIBLE AUTHENTIC MARJAD LOGO (#c4622d)                     */}
          {/* Pure, clear authentic Moroccan terracotta letters                         */}
          {/* ========================================================================= */}
          <g fill="#c4622d">
            {MARJAD_SVG_DATA.paths.map((item) => (
              <path key={item.id} d={item.d} />
            ))}
          </g>

          {/* ========================================================================= */}
          {/* LAYER 2: INTERACTIVE RESEND-STYLE PURE WHITE LASER LIGHT BEAM             */}
          {/* Exact optical rim-light contour beam as seen on Resend & Vinilia          */}
          {/* ========================================================================= */}
          <g
            className="transition-opacity duration-300 ease-out"
            style={{ opacity: isLit ? sweepOpacity : 0 }}
          >
            {/* 2A. Ambient Glow Stroke (Masked by cursor glow) */}
            <g filter={`url(#ambient-glow-${id})`}>
              <path
                d={wordmarkD}
                fill="none"
                mask={`url(#cursor-mask-${id})`}
                stroke="rgba(255, 255, 255, 0.7)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* 2B. Razor-Sharp Core Light Beam (Pure White Laser Outline) */}
            <g filter={`url(#glow-filter-${id})`}>
              <path
                d={wordmarkD}
                fill="none"
                stroke={`url(#cursor-glow-${id})`}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* 2C. Soft Ambient Wash Beam */}
            <g filter={`url(#glow-filter-${id})`}>
              <path
                d={wordmarkD}
                fill="none"
                stroke={`url(#cursor-wash-${id})`}
                strokeWidth="1.0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* 2D. Chromatic Aberration Dispersion Fringing (Prismatic RGB Fringing) */}
            <g filter={`url(#aberration-blur-${id})`}>
              <path
                d={wordmarkD}
                fill="none"
                mask={`url(#cursor-mask-${id})`}
                stroke="rgba(255, 75, 75, 0.45)"
                strokeWidth={3.2 * p}
                strokeLinecap="round"
                strokeLinejoin="round"
                transform={`translate(${-(2.4 * p)}, ${-p})`}
              />
              <path
                d={wordmarkD}
                fill="none"
                mask={`url(#cursor-mask-${id})`}
                stroke="rgba(60, 160, 255, 0.45)"
                strokeWidth={3.2 * p}
                strokeLinecap="round"
                strokeLinejoin="round"
                transform={`translate(${2.4 * p}, ${p})`}
              />
              <path
                d={wordmarkD}
                fill="none"
                mask={`url(#cursor-mask-${id})`}
                stroke="rgba(60, 255, 140, 0.25)"
                strokeWidth={3.2 * p}
                strokeLinecap="round"
                strokeLinejoin="round"
                transform={`translate(${2.4 * p}, ${p})`}
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
