"use client";

import React, { useState, useEffect, useRef } from "react";
import { MARJAD_SVG_DATA } from "@/components/layout/marjadPath";
import { ROSETTE_PATH } from "@/data/marjadRosettePath";

// Colors (100% Black background, authentic Moroccan terracotta for wordmark):
const BG_BLACK = "#000000";
const CLAY = "#c4622d";
const GOLD = "#d4a853";
const WHITE = "#ffffff";
const IVORY = "#e6dfd5";

// Luxury bezier curves
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  return function (t: number): number {
    let u = t;
    for (let i = 0; i < 6; i++) {
      const cx = 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u;
      const dx = 3 * (1 - u) * (1 - u) * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2);
      if (Math.abs(cx - t) < 0.0001) break;
      if (Math.abs(dx) < 1e-6) break;
      u = u - (cx - t) / dx;
    }
    u = Math.max(0, Math.min(1, u));
    return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
  };
}

// Flowing, luxurious letter assembly ease
const easeAssembly = cubicBezier(0.12, 1, 0.25, 1);
// Smooth cinematic zoom matching Video Project 27 (1) curve
const easeZoom = cubicBezier(0.5, 0.1, 0.35, 1.0);
const easeSchema = cubicBezier(0.65, 0, 0.25, 1);

function interpolate(
  t: number,
  input: number[],
  output: number[],
  useEasing = false
): number {
  if (t <= input[0]) return output[0];
  if (t >= input[input.length - 1]) return output[output.length - 1];
  let i = 0;
  while (i < input.length - 1 && t > input[i + 1]) i++;
  let p = (t - input[i]) / (input[i + 1] - input[i]);
  if (useEasing) p = easeSchema(p);
  return output[i] + p * (output[i + 1] - output[i]);
}

const mix = (t: number, a: number, b: number, x = 0, y = 1) =>
  interpolate(t, [a, b], [x, y], true);

// Shared radial topology for sacred geometry mesh
const radius = (a: number, k: number) => {
  if (k === 0) return 185;
  if (k === 1) return 165 / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
  if (k === 2) {
    const b = (((a + Math.PI / 2) % ((2 * Math.PI) / 3)) + (2 * Math.PI) / 3) % ((2 * Math.PI) / 3) - Math.PI / 3;
    return 118 / Math.cos(b);
  }
  if (k === 3) return 155 + 70 * Math.cos(8 * a);
  return 176 + 32 * Math.cos(4 * a);
};

const shape = (t: number) => {
  const k = interpolate(t, [0.43, 0.62, 0.85, 1.04, 1.25, 1.44, 1.66, 1.88], [0, 0, 1, 1, 2, 2, 3, 4]);
  const lo = Math.floor(k);
  const p = k - lo;
  let d = "";
  for (let i = 0; i < 192; i++) {
    const a = (i / 192) * Math.PI * 2;
    const r = radius(a, lo) * (1 - p) + radius(a, Math.min(4, lo + 1)) * p;
    d += `${i === 0 ? "M" : "L"}${Math.cos(a) * r},${Math.sin(a) * r}`;
  }
  return d + "Z";
};

// Facet layers for sacred geometry (White, Clay, Gold, Ivory)
const LAYERS = [
  { c: WHITE, d: -0.09, r: -19 },
  { c: CLAY, d: -0.06, r: 16 },
  { c: GOLD, d: -0.035, r: -10 },
  { c: IVORY, d: 0, r: 0 },
];

// Rich, theatrical configuration for the entrance of each individual letter
interface LetterConfig {
  fromX: number;
  fromY: number;
  fromRot: number;
  fromScale: number;
  delay: number;
}

const LETTER_CONFIGS: Record<string, LetterConfig> = {
  M: { fromX: -240, fromY: -260, fromRot: -24, fromScale: 0.35, delay: 0.0 },
  A1: { fromX: -130, fromY: -230, fromRot: 16, fromScale: 0.4, delay: 0.20 },
  R: { fromX: -15, fromY: -280, fromRot: -10, fromScale: 0.45, delay: 0.40 },
  Star: { fromX: -15, fromY: -280, fromRot: 45, fromScale: 0.2, delay: 0.40 },
  J: { fromX: 60, fromY: 260, fromRot: 18, fromScale: 0.45, delay: 0.60 },
  A2: { fromX: 150, fromY: -240, fromRot: -16, fromScale: 0.4, delay: 0.80 },
  D: { fromX: 260, fromY: -270, fromRot: 22, fromScale: 0.35, delay: 1.00 },
};

export function MarjadIntroLoader({ onFinish }: { onFinish?: () => void }) {
  const [isMounted, setIsMounted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [debugElapsed, setDebugElapsed] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const currentElapsed = debugElapsed !== null ? debugElapsed : elapsed;

  useEffect(() => {
    setIsMounted(true);
    // Expose helpers on window for visual QA and instant replaying
    if (typeof window !== "undefined") {
      (window as unknown as Record<string, unknown>).__restartIntro = () => {
        setDebugElapsed(null);
        startTimeRef.current = null;
        setElapsed(0);
        setIsFading(false);
        setIsDone(false);
      };
      (window as unknown as Record<string, unknown>).__setIntroElapsed = (t: number | null) => {
        setIsDone(false);
        setIsFading(false);
        setDebugElapsed(t);
      };
    }
  }, []);

  const completeIntro = () => {
    if (isFading || isDone) return;
    setIsFading(true);
    setTimeout(() => {
      setIsDone(true);
      onFinish?.();
    }, 600);
  };

  useEffect(() => {
    if (!isMounted || debugElapsed !== null) return;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const diff = (timestamp - startTimeRef.current) / 1000;
      setElapsed(diff);

      // Sequence: Snappy, seamless ~3.85s total then smooth fadeout
      if (diff >= 3.85) {
        completeIntro();
        return;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isMounted, debugElapsed]);

  if (isDone) return null;

  // Exact center of the Star inside the letter 'R' (viewBox: "0 0 643.94 139.56")
  // Star bounds: x = [300.18, 312.27], y = [31.46, 43.55]
  // Direct dive straight into the star center ("nishan f l-9elb d dik n-nejma")
  const starZoomOriginX = 47.555; // % of SVG width
  const starZoomOriginY = 26.870; // % of SVG height

  // =========================================================================
  // CONTINUOUS DIVE & SPONTANEOUS SCHEMA BLOOM:
  // - Starts at 1.82s immediately when letters assemble (zero delay)
  // - Deep continuous dive straight into the star (up to 15x scale, no stop)
  // - Schema emerges directly from the star's heart and blossoms outward
  // - Fully spontaneous ("spontané"), uninterrupted, zero cuts or stalls
  // =========================================================================
  const ZOOM_START = 1.82;
  const ZOOM_DUR = 0.68;
  const TARGET_ZOOM_SCALE = 15.0;

  const isZooming = currentElapsed >= ZOOM_START;
  const zoomProgress = Math.min(1, Math.max(0, (currentElapsed - ZOOM_START) / ZOOM_DUR));
  const zoomEased = easeZoom(zoomProgress);
  // Continuous smooth dive into the star without stopping
  const zoomScale = 1 + zoomEased * (TARGET_ZOOM_SCALE - 1);

  // Seamless dissolve as camera passes through the star
  const wordmarkOpacity = interpolate(currentElapsed, [0, 2.18, 2.45], [1, 1, 0]);

  // Sacred geometry schema emerges right as you reach the star (spontaneous & seamless)
  const isSchemaActive = currentElapsed >= 2.15;
  const schemaOpacity = interpolate(currentElapsed, [2.15, 2.40], [0, 1]);
  // Schema blossoms outward from the heart of the star
  const schemaBloomScale = interpolate(currentElapsed, [2.15, 2.50], [0.45, 1.0], true);

  // Sacred geometry morph timeline:
  const meshTime = interpolate(currentElapsed, [2.35, 3.55], [0.43, 2.45]);
  const rose = mix(meshTime, 1.85, 2.25, 0, 1);
  const rot = interpolate(
    meshTime,
    [0.43, 0.75, 1.05, 1.3, 1.55, 1.85, 2.3],
    [0, 100, 83, 205, 183, 280, 360],
    true
  );
  const roseRotation = mix(meshTime, 1.85, 2.3, -24, 0);

  // Helper function for flying letter assembly (generous time, silky smooth arrival)
  const getLetterStyle = (id: string) => {
    const cfg = LETTER_CONFIGS[id] || { fromX: 0, fromY: -100, fromRot: 0, fromScale: 0.8, delay: 0 };
    const dur = 0.82; // extended, luxurious duration for clear visibility
    const pRaw = Math.min(1, Math.max(0, (currentElapsed - cfg.delay) / dur));
    const p = easeAssembly(pRaw);
    const x = cfg.fromX * (1 - p);
    const y = cfg.fromY * (1 - p);
    const rot = cfg.fromRot * (1 - p);
    const scale = cfg.fromScale + (1 - cfg.fromScale) * p;
    const op = Math.min(1, pRaw * 1.8);

    return {
      transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`,
      transformOrigin: `${321.97}px ${69.78}px`,
      opacity: op,
    };
  };

  return (
    <div
      onClick={completeIntro}
      style={{ width: "100%", height: "100%", backgroundColor: BG_BLACK }}
      className={`fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center overflow-hidden transition-all duration-600 ease-out select-none cursor-pointer ${
        isFading ? "opacity-0 pointer-events-none scale-102" : "opacity-100 scale-100"
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. STAGE 1 & 2: FLYING LETTER ASSEMBLY & CONTINUOUS DIVE INTO STAR        */}
      {/* ========================================================================= */}
      {isMounted && wordmarkOpacity > 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: wordmarkOpacity }}
        >
          {/* Prominent, grand size for MARJAD wordmark */}
          <div className="w-full max-w-[420px] sm:max-w-[580px] md:max-w-[700px] lg:max-w-[800px] px-4 flex justify-center items-center">
            <svg
              viewBox={MARJAD_SVG_DATA.viewBox}
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto block select-none"
              style={{
                transform: `scale(${zoomScale})`,
                // DEEP DIVE DIRECTLY INTO STAR IN R ("nishan f nejma bla mat7bes")
                transformOrigin: `${starZoomOriginX}% ${starZoomOriginY}%`,
                willChange: "transform, opacity",
              }}
              aria-label="MARJAD"
            >
              {/* All letters and the star rendered in pure terracotta (#c4622d), without any light or flare */}
              {MARJAD_SVG_DATA.paths.map((p) => {
                const letterStyle = getLetterStyle(p.id);

                return (
                  <path
                    key={p.id}
                    d={p.d}
                    fill={CLAY}
                    style={letterStyle}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STAGE 3 & 4: SPONTANEOUS SACRED GEOMETRY SCHEMA BLOOM FROM THE STAR    */}
      {/* ========================================================================= */}
      {isMounted && isSchemaActive && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            opacity: schemaOpacity,
            willChange: "transform, opacity",
          }}
        >
          <svg
            viewBox="0 0 1920 1080"
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${schemaBloomScale})`,
              transformOrigin: "center center",
              willChange: "transform, opacity",
            }}
            className="w-full h-full object-contain"
          >
            <g transform="translate(960 540)">
              {/* Rotating and Morphing Sacred Geometry Layers */}
              {rose < 1 && (
                <g opacity={Math.max(0, 1 - rose)}>
                  {LAYERS.map((layer, i) => {
                    const shapeT = Math.max(0.43, meshTime + layer.d);
                    const layerRot = rot + layer.r * Math.sin(Math.min(meshTime * 6, 12));
                    const scale = 1 + (3 - i) * 0.035;
                    return (
                      <path
                        key={i}
                        d={shape(shapeT)}
                        fill={layer.c}
                        transform={`rotate(${layerRot}) scale(${scale})`}
                      />
                    );
                  })}
                </g>
              )}

              {/* Settling Moroccan Rosette Emblem in Solid Gold (#d4a853) */}
              {rose > 0 && (
                <g
                  opacity={Math.min(1, rose)}
                  transform={`scale(2.05) rotate(${roseRotation}) translate(-93.8, -93.8)`}
                >
                  <path
                    d={ROSETTE_PATH}
                    fill={GOLD}
                    className="drop-shadow-[0_0_24px_rgba(212,168,83,0.4)]"
                  />
                </g>
              )}
            </g>
          </svg>
        </div>
      )}

      {/* Subtle luxury brand mark at bottom */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center select-none pointer-events-none">
        <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#d4a853]/70">
          MARJAD ARTISANAT
        </span>
      </div>
    </div>
  );
}
