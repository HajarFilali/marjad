"use client";

import React, { useState } from "react";

export default function ArchitectLampShowcase() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full max-w-[680px] mx-auto select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 
        ========================================================================
        HIGH-PRECISION 3D ARCHITECT TASK LAMP (100% CODED SVG)
        - Exact anatomical match to reference screenshot:
          * Tall two-tone vertical base stem with collar ring
          * Hinge 1 at top of vertical stem
          * Steeper lower arm with dual struts & mid-clamp
          * Elbow joint with authentic circular electrical cable loop
          * Upper arm with cross-spacer bracket
          * Swivel head with top wire loop & black collar band
          * Rich 3D copper bell shade with stepped shoulder & specular highlights
          * Dramatic geometric light cone projecting onto Moroccan luxury salon
        ========================================================================
      */}
      <svg
        viewBox="0 0 760 520"
        className="w-full h-auto block overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Exact Geometric Light Cone Clip Path matching shade rim angle */}
          <clipPath id="lampLightBeamClip">
            <polygon points="292,158 760,268 760,520 335,520 228,226" />
          </clipPath>

          {/* 3D Photorealistic Copper Bell Shade Gradient */}
          <linearGradient id="lampBellCopper3D" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#f8ab74" />
            <stop offset="16%" stopColor="#e5763a" />
            <stop offset="40%" stopColor="#be521e" />
            <stop offset="68%" stopColor="#7e2e0a" />
            <stop offset="88%" stopColor="#451503" />
            <stop offset="100%" stopColor="#220901" />
          </linearGradient>

          {/* Copper Collar Gradient */}
          <linearGradient id="baseCollarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cf723d" />
            <stop offset="35%" stopColor="#e58953" />
            <stop offset="70%" stopColor="#9e471d" />
            <stop offset="100%" stopColor="#562109" />
          </linearGradient>

          {/* Dark Walnut Wood / Gunmetal Post Gradient */}
          <linearGradient id="lampDarkWood" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a2d1d" />
            <stop offset="40%" stopColor="#633c27" />
            <stop offset="80%" stopColor="#2e190e" />
            <stop offset="100%" stopColor="#150a04" />
          </linearGradient>

          {/* Metallic Copper Strut Gradient */}
          <linearGradient id="lampStrutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cf7743" />
            <stop offset="30%" stopColor="#9e4d22" />
            <stop offset="70%" stopColor="#6d3011" />
            <stop offset="100%" stopColor="#3b1605" />
          </linearGradient>

          {/* Gleaming Polished Brass for Joints, Knobs, Screws */}
          <linearGradient id="lampBrass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#eab308" />
            <stop offset="75%" stopColor="#a16207" />
            <stop offset="100%" stopColor="#452404" />
          </linearGradient>

          {/* 3D Perspective Base Plate Gradients */}
          <linearGradient id="baseTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b35e2e" />
            <stop offset="45%" stopColor="#823c17" />
            <stop offset="100%" stopColor="#4e210a" />
          </linearGradient>
          <linearGradient id="baseFrontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#632b0f" />
            <stop offset="100%" stopColor="#2c0f04" />
          </linearGradient>

          {/* Volumetric Warm Light Wash inside the Light Beam */}
          <linearGradient
            id="beamVolumetricWash"
            x1="260"
            y1="192"
            x2="700"
            y2="420"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="rgba(255, 246, 215, 0.42)" />
            <stop offset="26%" stopColor="rgba(255, 236, 190, 0.18)" />
            <stop offset="68%" stopColor="rgba(255, 245, 225, 0.05)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.0)" />
          </linearGradient>

          {/* Radial Bulb Flare from the Shade Opening */}
          <radialGradient id="bulbFlare" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="28%" stopColor="#ffe699" stopOpacity="0.92" />
            <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
          </radialGradient>

          {/* Golden Interior Reflector for Shade Rim */}
          <linearGradient id="interiorReflector" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff3cd" />
            <stop offset="45%" stopColor="#ffd27d" />
            <stop offset="100%" stopColor="#b87f22" />
          </linearGradient>

          {/* Soft Shadow & Glow Filters */}
          <filter id="coreShadowBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <filter id="ambientShadowBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="bulbGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ================= 1. THE ILLUMINATED LUXURY SALON (CLIPPED IN BEAM) ================= */}
        <g clipPath="url(#lampLightBeamClip)">
          {/* Moroccan Luxury Salon Image */}
          <image
            href="/images/about/about-salon-luxueux.jpg"
            x="200"
            y="135"
            width="565"
            height="390"
            preserveAspectRatio="xMidYMid slice"
            className="transition-transform duration-700 ease-out"
            style={{
              transform: isHovered ? "scale(1.03)" : "scale(1)",
              transformOrigin: "500px 340px",
            }}
          />

          {/* Volumetric Warm Light Overlay */}
          <polygon
            points="292,158 760,268 760,520 335,520 228,226"
            fill="url(#beamVolumetricWash)"
          />

          {/* Warm Ambient Halo emerging from the shade opening */}
          <circle
            cx="260"
            cy="192"
            r="175"
            fill="url(#bulbFlare)"
            className="transition-opacity duration-500"
            style={{ opacity: isHovered ? 0.65 : 0.45 }}
          />
        </g>

        {/* ================= 2. LUMINOUS LIGHT BEAM RAYS (EDGES) ================= */}
        {/* Top Edge Ray: Top Lip -> Right Edge */}
        <line
          x1="292"
          y1="158"
          x2="760"
          y2="268"
          stroke="rgba(255, 248, 222, 0.88)"
          strokeWidth="1.8"
        />
        {/* Bottom Edge Ray: Bottom Lip -> Floor Edge */}
        <line
          x1="228"
          y1="226"
          x2="335"
          y2="520"
          stroke="rgba(255, 248, 222, 0.72)"
          strokeWidth="1.8"
        />

        {/* ================= 3. CODED 3D ARCHITECT TASK LAMP ================= */}
        <g id="architectLamp" className="transition-transform duration-500 ease-out">
          {/* Floor Shadows (Ambient + Core Contact) */}
          <ellipse
            cx="175"
            cy="452"
            rx="65"
            ry="7"
            fill="rgba(30, 15, 5, 0.16)"
            filter="url(#ambientShadowBlur)"
          />
          <ellipse
            cx="172"
            cy="450"
            rx="42"
            ry="3.5"
            fill="rgba(20, 8, 2, 0.38)"
            filter="url(#coreShadowBlur)"
          />

          {/* 3D Perspective Base Plate */}
          {/* Top Surface */}
          <polygon
            points="138,440 212,440 220,448 130,448"
            fill="url(#baseTopGrad)"
            stroke="#1a0902"
            strokeWidth="0.8"
          />
          {/* Top Surface Specular Reflection */}
          <polygon
            points="140,441 185,441 178,447 133,447"
            fill="rgba(255,255,255,0.26)"
          />
          {/* Front Beveled Edge */}
          <polygon
            points="130,448 220,448 220,452 130,452"
            fill="url(#baseFrontGrad)"
            stroke="#140601"
            strokeWidth="0.6"
          />
          {/* Right Perspective Face */}
          <polygon
            points="212,440 220,448 220,452 212,444"
            fill="#301205"
          />

          {/* ================= TALL VERTICAL BASE STEM (Key Detail from Reference) ================= */}
          {/* Lower Copper Base Sleeve (y: 405 to 440) */}
          <rect
            x="170"
            y="405"
            width="10"
            height="36"
            rx="1.5"
            fill="url(#baseCollarGrad)"
            stroke="#260f05"
            strokeWidth="0.7"
          />
          <rect
            x="172"
            y="406"
            width="2"
            height="34"
            fill="rgba(255,255,255,0.35)"
          />

          {/* Brass Transition Ring */}
          <ellipse cx="175" cy="405" rx="6" ry="2" fill="url(#lampBrass)" stroke="#260f05" strokeWidth="0.5" />

          {/* Upper Dark Walnut / Gunmetal Post (y: 365 to 405) */}
          <rect
            x="171"
            y="365"
            width="8"
            height="40"
            rx="1.5"
            fill="url(#lampDarkWood)"
            stroke="#1b0d06"
            strokeWidth="0.7"
          />
          <rect
            x="172.5"
            y="366"
            width="1.8"
            height="38"
            fill="rgba(255,255,255,0.22)"
          />

          {/* Base Hinge 1 (at top of vertical post, y=365) */}
          <circle
            cx="175"
            cy="365"
            r="8.5"
            fill="url(#lampBrass)"
            stroke="#220e04"
            strokeWidth="0.8"
          />
          <circle cx="175" cy="365" r="3.5" fill="#180902" />
          <circle cx="175" cy="365" r="1.5" fill="#fef08a" />

          {/* Flexible Power Cord running down from upper arm into base */}
          <path
            d="M 175 365 C 150 340 100 290 98 235"
            fill="none"
            stroke="#18120e"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* ================= LOWER ARTICULATED ARM (Steep Angle: from (175,365) to (95,215)) ================= */}
          {/* Strut 1 */}
          <line
            x1="172"
            y1="366.5"
            x2="92"
            y2="216.5"
            stroke="url(#lampStrutGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="171.5"
            y1="366"
            x2="91.5"
            y2="216"
            stroke="rgba(255,255,255,0.32)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Strut 2 */}
          <line
            x1="178"
            y1="363.5"
            x2="98"
            y2="213.5"
            stroke="url(#lampStrutGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="177.5"
            y1="363"
            x2="97.5"
            y2="213"
            stroke="rgba(255,255,255,0.32)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Mid-arm Adjustment Clamp & Brass Knob */}
          <rect
            x="128"
            y="284"
            width="14"
            height="12"
            rx="2"
            transform="rotate(28 135 290)"
            fill="#1c140e"
            stroke="#2a1206"
            strokeWidth="0.8"
          />
          <circle cx="135" cy="290" r="3.5" fill="url(#lampBrass)" />

          {/* ================= ELBOW JOINT 2 & ICONIC CABLE LOOP (Key Detail from Reference) ================= */}
          {/* The Distinct Circular Cable Loop arching out to the left */}
          <path
            d="M 94 228 C 62 235 52 195 90 200"
            fill="none"
            stroke="#1c1612"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Elbow Hinge Discs */}
          <circle
            cx="95"
            cy="215"
            r="11"
            fill="url(#lampBrass)"
            stroke="#220e04"
            strokeWidth="0.9"
          />
          <circle cx="95" cy="215" r="7" fill="#1b0c04" />
          <circle cx="95" cy="215" r="3.5" fill="url(#lampBrass)" />
          {/* Tension Wing Nut */}
          <path
            d="M 84 210 C 75 212 75 218 84 220 Z"
            fill="url(#lampBrass)"
            stroke="#220e04"
            strokeWidth="0.8"
          />

          {/* ================= UPPER ARTICULATED ARM (from (95,215) to (225,128)) ================= */}
          {/* Strut 1 */}
          <line
            x1="93"
            y1="212"
            x2="223"
            y2="125"
            stroke="url(#lampStrutGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="93"
            y1="211"
            x2="223"
            y2="124"
            stroke="rgba(255,255,255,0.32)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Strut 2 */}
          <line
            x1="97"
            y1="218"
            x2="227"
            y2="131"
            stroke="url(#lampStrutGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="97"
            y1="217"
            x2="227"
            y2="130"
            stroke="rgba(255,255,255,0.32)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Upper Arm Cross-spacer Bracket */}
          <rect
            x="156"
            y="167"
            width="10"
            height="9"
            rx="1.5"
            transform="rotate(-34 161 171.5)"
            fill="#1c140e"
          />

          {/* ================= HEAD JOINT, SOCKET & TOP WIRE LOOP ================= */}
          {/* Swivel Pivot Hinge 3 */}
          <circle
            cx="225"
            cy="128"
            r="8.5"
            fill="url(#lampBrass)"
            stroke="#220e04"
            strokeWidth="0.8"
          />
          <circle cx="225" cy="128" r="3.2" fill="#1b0c04" />

          {/* Swivel Bracket */}
          <rect
            x="222"
            y="115"
            width="14"
            height="12"
            rx="2"
            transform="rotate(38 229 121)"
            fill="#22150e"
          />

          {/* Top Wire Cable Loop (Key Detail from Reference) */}
          <path
            d="M 230 90 C 224 72 238 72 242 88"
            fill="none"
            stroke="#1c1612"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Copper Socket Dome Cap */}
          <rect
            x="228"
            y="94"
            width="18"
            height="13"
            rx="3"
            transform="rotate(38 237 100)"
            fill="url(#lampBellCopper3D)"
            stroke="#260f05"
            strokeWidth="0.8"
          />

          {/* Black Collar Ring Band */}
          <rect
            x="232"
            y="106"
            width="22"
            height="10"
            rx="2"
            transform="rotate(38 243 111)"
            fill="#140f0c"
            stroke="#0a0705"
            strokeWidth="0.8"
          />
          <line
            x1="236"
            y1="109"
            x2="250"
            y2="118"
            stroke="rgba(255,255,255,0.26)"
            strokeWidth="1"
          />

          {/* ================= THE 3D COPPER BELL SHADE (Exact Profile from Reference) ================= */}
          {/* Flared Bell Body with Stepped Shoulder */}
          <path
            d="M 238 108 L 246 114 C 265 120 286 135 292 158 L 228 226 C 210 200 208 152 228 118 Z"
            fill="url(#lampBellCopper3D)"
            stroke="#260f05"
            strokeWidth="1.2"
          />

          {/* Stepped Shoulder Ridge Ring */}
          <ellipse
            cx="242"
            cy="111"
            rx="8"
            ry="3"
            transform="rotate(38 242 111)"
            fill="none"
            stroke="rgba(255,255,255,0.38)"
            strokeWidth="1.2"
          />

          {/* Curvature Specular Highlight along outer crest */}
          <path
            d="M 248 115 C 268 122 284 138 288 155"
            fill="none"
            stroke="rgba(255, 255, 255, 0.55)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 252 117 C 270 124 282 138 286 153"
            fill="none"
            stroke="rgba(255, 255, 255, 0.88)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Bell Opening Ellipse */}
          <ellipse
            cx="260"
            cy="192"
            rx="46.7"
            ry="13.5"
            transform="rotate(-46.7 260 192)"
            fill="#1c0b03"
            stroke="#120601"
            strokeWidth="1.2"
          />

          {/* Golden Interior Reflector Rim */}
          <ellipse
            cx="258"
            cy="190"
            rx="42"
            ry="11"
            transform="rotate(-46.7 258 190)"
            fill="url(#interiorReflector)"
            opacity="0.92"
          />

          {/* Radiant Glowing Bulb Core */}
          <circle
            cx="255"
            cy="187"
            r="16"
            fill="url(#bulbFlare)"
            filter="url(#bulbGlowFilter)"
          />
          <circle cx="255" cy="187" r="6" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
}
