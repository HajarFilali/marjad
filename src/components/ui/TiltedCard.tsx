"use client";

import React, { useRef, useState, useCallback } from "react";

interface TiltedCardProps {
  children: React.ReactNode;
  className?: string;
  maxRotate?: number;
  scaleOnHover?: number;
  perspective?: number;
  showGlare?: boolean;
}

/**
 * TiltedCard - 3D Perspective Tilt Card reacting to pointer cursor (React Bits inspired)
 * https://reactbits.dev/components/tilted-card
 */
export function TiltedCard({
  children,
  className = "",
  maxRotate = 9,
  scaleOnHover = 1.025,
  perspective = 1000,
  showGlare = true,
}: TiltedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>(
    `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
  );
  const [glare, setGlare] = useState<{ opacity: number; x: number; y: number }>({
    opacity: 0,
    x: 50,
    y: 50,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Invert Y for natural perspective tilt: mouse top tilts card back, mouse bottom tilts card forward
      const rotateX = -((y - centerY) / centerY) * maxRotate;
      const rotateY = ((x - centerX) / centerX) * maxRotate;

      setTransform(
        `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scaleOnHover}, ${scaleOnHover}, 1)`
      );

      if (showGlare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        setGlare({ opacity: 0.35, x: glareX, y: glareY });
      }
    },
    [maxRotate, scaleOnHover, perspective, showGlare]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform(
      `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    );
    if (showGlare) {
      setGlare((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative will-change-transform ${className}`}
      style={{
        transform,
        transformStyle: "flat",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
        transition: isHovered
          ? "transform 0.12s ease-out"
          : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}

      {/* Dynamic 3D Glare Sheen following cursor */}
      {showGlare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl z-30 transition-opacity duration-300 overflow-hidden"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle 260px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.08) 45%, transparent 75%)`,
          }}
        />
      )}
    </div>
  );
}
