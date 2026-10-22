"use client";

import React, { useRef, useState, useEffect, useId } from "react";
import { MARJAD_SVG_DATA, MARJAD_PATH_DATA } from "@/components/layout/marjadPath";

export interface LaserMarjadWordmarkProps {
  fill?: string;
  className?: string;
  style?: React.CSSProperties;
  isRevealed?: boolean;
}

export function LaserMarjadWordmark({
  fill = "#c4622d",
  className,
  style,
  isRevealed = false,
}: LaserMarjadWordmarkProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Center coordinates of MARJAD (viewBox 0 0 643.94 139.56)
  const [cursor, setCursor] = useState<{ x: number; y: number }>({
    x: 321.97,
    y: 69.78,
  });
  const [isLit, setIsLit] = useState<boolean>(false);

  const rawId = useId();
  const id = rawId.replace(/:/g, "") + "_hero";

  const updateLaserCoordinates = (clientX: number, clientY: number) => {
    if (isRevealed) {
      if (isLit) setIsLit(false);
      return;
    }

    const svg = svgRef.current;
    if (!svg) return;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;

    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const localPt = pt.matrixTransform(ctm.inverse());

    // In SVG coordinates (viewBox 0 0 643.94 139.56)
    // Letters span from x: 0 to 644, y: 0 to 140.
    // Detection zone with smooth margin around the letters:
    const isOverLetters =
      localPt.x >= -35 &&
      localPt.x <= 680 &&
      localPt.y >= -25 &&
      localPt.y <= 165;

    if (isOverLetters) {
      const clampedY = Math.max(10, Math.min(130, localPt.y));
      setCursor({ x: localPt.x, y: clampedY });
      setIsLit(true);
    } else {
      setIsLit(false);
    }
  };

  // Global pointer tracking when in dark stage (!isRevealed)
  useEffect(() => {
    if (isRevealed) {
      setIsLit(false);
      return;
    }

    const handleWindowPointerMove = (e: PointerEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      if (animFrameRef.current === null) {
        animFrameRef.current = requestAnimationFrame(() => {
          animFrameRef.current = null;
          updateLaserCoordinates(mousePosRef.current.x, mousePosRef.current.y);
        });
      }
    };

    window.addEventListener("pointermove", handleWindowPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isRevealed]);

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
    <svg
      ref={svgRef}
      viewBox={MARJAD_SVG_DATA.viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: "visible", ...style }}
      aria-label="MARJAD"
    >
      <defs>
        {/* 1. Core Cursor Glow (Pure Luminous White Optical Laser) */}
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

        {/* 2. Soft Ambient Wash Gradient */}
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

        {/* 3. Multi-Stage Bloom Filter */}
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
      {/* LAYER 1: BASE AUTHENTIC MARJAD LOGO (#c4622d)                             */}
      {/* Pure Moroccan terracotta letters                                         */}
      {/* ========================================================================= */}
      <g fill={fill}>
        {MARJAD_SVG_DATA.paths.map((item) => (
          <path key={item.id} d={item.d} />
        ))}
      </g>

      {/* ========================================================================= */}
      {/* LAYER 2: INTERACTIVE RESEND-STYLE PURE WHITE LASER LIGHT BEAM             */}
      {/* Illuminates contour as cursor glides across letterforms                   */}
      {/* ========================================================================= */}
      <g
        className="transition-opacity duration-300 ease-out"
        style={{ opacity: isLit && !isRevealed ? 1 : 0 }}
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

        {/* 2D. Chromatic Aberration Dispersion Fringing (RGB Fringing) */}
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
  );
}
