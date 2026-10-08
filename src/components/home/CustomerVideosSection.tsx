"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Play, CheckCircle2, X, Video, MessageSquare, Send, Heart, Pin } from "lucide-react";
import {
  MOROCCAN_ARCH_VIEWBOX,
  MOROCCAN_ARCH_WIDTH,
  MOROCCAN_ARCH_HEIGHT,
  MOROCCAN_ARCH_PATH,
} from "./MoroccanArchPath";

interface CustomerComment {
  id: string;
  userName: string;
  avatar: string;
  avatarBg: string;
  isOfficial?: boolean;
  time: string;
  text: string;
  likes: number;
}

interface CustomerVideo {
  id: string;
  customerName: string;
  city: string;
  productName: string;
  category: string;
  price: string;
  duration: string;
  thumbnail: string;
  productImage: string;
  quote: string;
  initialComments: CustomerComment[];
}

interface LightBulbData {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  glowColor: string;
  restingColor: string;
  glassStroke: string;
  glowGradId: string;
  name: "red" | "amber" | "green";
  pulseDelay: number;
}

const VIDEOS: CustomerVideo[] = [
  {
    id: "1",
    customerName: "Salma K.",
    city: "Casablanca",
    productName: "Lanterne en Cuivre Ciselé",
    category: "Luminaires & Cuivre",
    price: "1 250 DH",
    duration: "0:04",
    thumbnail: "/images/products/prod-lanterne.jpg",
    productImage: "/images/products/prod-lanterne.jpg",
    quote: "L'effet des ombres sur le mur du salon le soir est juste magique !",
    initialComments: [
      {
        id: "c1-1",
        userName: "Amina R.",
        avatar: "A",
        avatarBg: "bg-[#78350f]",
        time: "Il y a 2h",
        text: "تبارك الله! النحاس المتقون كيبان جودة عالية بزاف 😍",
        likes: 14,
      },
      {
        id: "c1-2",
        userName: "Yassine B.",
        avatar: "Y",
        avatarBg: "bg-[#78350f]",
        time: "Il y a 5h",
        text: "Est-ce qu'elle est livrée avec le câble électrique et la douille ?",
        likes: 5,
      },
      {
        id: "c1-3",
        userName: "Marjad Artisans",
        avatar: "M",
        avatarBg: "bg-[#78350f]",
        isOfficial: true,
        time: "Il y a 4h",
        text: "Bonjour Yassine ! Oui, câble tressé traditionnel et douille aux normes inclus ✨",
        likes: 9,
      },
    ],
  },
  {
    id: "2",
    customerName: "Youssef & Rita",
    city: "Rabat",
    productName: "Tapis Beni Ourain Atlas",
    category: "Tapis & Tissage",
    price: "3 400 DH",
    duration: "0:04",
    thumbnail: "/images/products/prod-tapis.jpg",
    productImage: "/images/products/prod-tapis.jpg",
    quote: "Reçu en 24h à Rabat. Laine d'une douceur exceptionnelle.",
    initialComments: [
      {
        id: "c2-1",
        userName: "Leila H.",
        avatar: "L",
        avatarBg: "bg-[#78350f]",
        time: "Il y a 1j",
        text: "Beni Ourain authentique ! Les motifs géométriques et la laine de l'Atlas sont superbes.",
        likes: 19,
      },
      {
        id: "c2-2",
        userName: "Amine S.",
        avatar: "A",
        avatarBg: "bg-[#78350f]",
        time: "Il y a 2j",
        text: "صوف طبيعي 100%، باينة الخدمة ديال حرايريات الأطلس ماشاء الله",
        likes: 8,
      },
    ],
  },
  {
    id: "3",
    customerName: "Nadia M.",
    city: "Marrakech",
    productName: "Table Ronde en Zellige",
    category: "Zellige & Mosaïque",
    price: "2 800 DH",
    duration: "0:04",
    thumbnail: "/images/products/prod-zellige.jpg",
    productImage: "/images/products/prod-zellige.jpg",
    quote: "Parfaitement emballée, le vert émeraude du zellige est splendide.",
    initialComments: [
      {
        id: "c3-1",
        userName: "Khadija F.",
        avatar: "K",
        avatarBg: "bg-[#78350f]",
        time: "Il y a 3h",
        text: "تبارك الله هاد اللون الزمردي كيحمق فالحقيقة! بصحتك وراحتك أختي نادية 💚",
        likes: 27,
      },
      {
        id: "c3-2",
        userName: "Tarik M.",
        avatar: "T",
        avatarBg: "bg-[#78350f]",
        time: "Il y a 6h",
        text: "Le travail du Maâlem sur le motif central et la symétrie du zellige est exceptionnel.",
        likes: 12,
      },
      {
        id: "c3-3",
        userName: "Marjad Artisans",
        avatar: "M",
        avatarBg: "bg-[#78350f]",
        isOfficial: true,
        time: "Il y a 5h",
        text: "Merci Nadia pour votre confiance ! Taillée méticuleusement au menqach à Fès ✨",
        likes: 16,
      },
    ],
  },
  {
    id: "4",
    customerName: "Mehdi B.",
    city: "Tanger",
    productName: "Poufs en Cuir Cognac",
    category: "Maroquinerie & Cuir",
    price: "420 DH",
    duration: "0:04",
    thumbnail: "/images/products/prod-pouf.jpg",
    productImage: "/images/products/prod-pouf.jpg",
    quote: "Deuxième commande chez Marjad, la qualité du cuir est irréprochable.",
    initialComments: [
      {
        id: "c4-1",
        userName: "Saad N.",
        avatar: "S",
        avatarBg: "bg-[#78350f]",
        time: "Il y a 4h",
        text: "الجلد الطبيعي المدبوغ بدون مواد كيماوية، ريحتو نقية وكيصبر سنين",
        likes: 11,
      },
      {
        id: "c4-2",
        userName: "Zineb E.",
        avatar: "Z",
        avatarBg: "bg-[#78350f]",
        time: "Il y a 8h",
        text: "Couleur cognac superbe qui va avec tous les styles de salon !",
        likes: 6,
      },
    ],
  },
  {
    id: "5",
    customerName: "Houda L.",
    city: "Fès",
    productName: "Vase Céramique Bleu de Fès",
    category: "Poterie & Céramique",
    price: "380 DH",
    duration: "0:04",
    thumbnail: "/images/products/prod-vase.jpg",
    productImage: "/images/products/prod-vase.jpg",
    quote: "Une véritable œuvre d'art sur ma console d'entrée.",
    initialComments: [
      {
        id: "c5-1",
        userName: "Meryem C.",
        avatar: "M",
        avatarBg: "bg-[#78350f]",
        time: "Il y a 12h",
        text: "Le cobalt de Fès est intemporel, la finesse du pinceau au crin est bluffante.",
        likes: 15,
      },
    ],
  },
  {
    id: "6",
    customerName: "Karim E.",
    city: "Agadir",
    productName: "Miroir d'Arche en Cèdre",
    category: "Bois Sculpté & Cèdre",
    price: "890 DH",
    duration: "0:04",
    thumbnail: "/images/products/prod-miroir.jpg",
    productImage: "/images/products/prod-miroir.jpg",
    quote: "L'odeur naturelle du cèdre et la finesse de la sculpture, j'adore.",
    initialComments: [
      {
        id: "c6-1",
        userName: "Anas D.",
        avatar: "A",
        avatarBg: "bg-[#78350f]",
        time: "Il y a 1j",
        text: "خشب الأرز المغربي والأقواس الأندلسية لمسة لا تقدر بثمن فالصالون",
        likes: 13,
      },
    ],
  },
];

// Pure Vector Code: Generates continuous dashed flight path with whimsical loops kissing each arch apex
interface Point {
  x: number;
  y: number;
}

// Exact mathematical evaluation of Cubic Bézier curve B(t) and its tangent derivative
function evalCubicBezier(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number
): { x: number; y: number; tangentAngle: number } {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  const x = mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x;
  const y = mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y;

  const dx = 3 * mt2 * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t2 * (p3.x - p2.x);
  const dy = 3 * mt2 * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t2 * (p3.y - p2.y);

  const tangentAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return { x, y, tangentAngle };
}

interface FlightGeometry {
  pathD: string;
  bulbs: LightBulbData[];
}

const BULB_COLOR_CONFIGS = {
  amber: {
    name: "amber" as const,
    color: "#ffaa00",
    glowColor: "rgba(255, 170, 0, 0.85)",
    restingColor: "#6b3506",
    glassStroke: "#381701",
    glowGradId: "fairy-glow-amber",
  },
  green: {
    name: "green" as const,
    color: "#22c55e",
    glowColor: "rgba(34, 197, 94, 0.8)",
    restingColor: "#084724",
    glassStroke: "#022110",
    glowGradId: "fairy-glow-green",
  },
  red: {
    name: "red" as const,
    color: "#ff2a3b",
    glowColor: "rgba(255, 42, 59, 0.8)",
    restingColor: "#66141a",
    glassStroke: "#38070a",
    glowGradId: "fairy-glow-red",
  },
};

// Unified Geometry Engine: Generates both the SVG dashed path and the exact light bulbs
// Every single bulb position (x, y) is mathematically guaranteed to lie 100.0% on the dashed curve!
function computeFlightGeometry(
  pts: { x: number; y: number; isDown: boolean }[],
  totalWidth: number
): FlightGeometry {
  if (!pts || pts.length === 0) return { pathD: "", bulbs: [] };

  let d = "";
  const bulbs: LightBulbData[] = [];
  let bulbId = 0;

  // 1. ENTRANCE WIRE: smooth sweep from left edge (x = 0) to first arch apex (p0)
  const p0 = pts[0];
  const entranceStart: Point = { x: 0, y: p0.y - 12 };
  const entranceCp1: Point = { x: p0.x * 0.35, y: p0.y + 24 };
  const entranceCp2: Point = { x: p0.x * 0.7, y: p0.y - 10 };
  const entranceEnd: Point = { x: p0.x, y: p0.y };

  d += `M 0,${(p0.y - 12).toFixed(1)} `;
  d += `C ${(p0.x * 0.35).toFixed(1)},${(p0.y + 24).toFixed(1)} ${(p0.x * 0.7).toFixed(1)},${(p0.y - 10).toFixed(1)} ${p0.x.toFixed(1)},${p0.y.toFixed(1)} `;

  // Entrance wire bulb 1 (Red) - evaluated at t = 0.28, hanging gracefully
  const entPt1 = evalCubicBezier(entranceStart, entranceCp1, entranceCp2, entranceEnd, 0.28);
  bulbs.push({
    id: bulbId++,
    x: Number(entPt1.x.toFixed(1)),
    y: Number(entPt1.y.toFixed(1)),
    rotation: 0,
    ...BULB_COLOR_CONFIGS.red,
    pulseDelay: 0.1,
  });

  // Entrance wire bulb 2 (Green) - evaluated at t = 0.65, standing upright
  const entPt2 = evalCubicBezier(entranceStart, entranceCp1, entranceCp2, entranceEnd, 0.65);
  bulbs.push({
    id: bulbId++,
    x: Number(entPt2.x.toFixed(1)),
    y: Number(entPt2.y.toFixed(1)),
    rotation: 180,
    ...BULB_COLOR_CONFIGS.green,
    pulseDelay: 0.2,
  });

  // 2. CARD APEXES AND INTER-CARD LOOPS
  for (let i = 0; i < pts.length; i++) {
    const pt = pts[i];

    // Card Apex Bulb: Amber bulb resting right on the Moroccan Arch Apex
    bulbs.push({
      id: bulbId++,
      x: Number(pt.x.toFixed(1)),
      y: Number(pt.y.toFixed(1)),
      rotation: pt.isDown ? 180 : 0,
      ...BULB_COLOR_CONFIGS.amber,
      pulseDelay: Number(((bulbId % 5) * 0.45).toFixed(2)),
    });

    if (i < pts.length - 1) {
      const from = pts[i];
      const to = pts[i + 1];
      const dx = to.x - from.x;
      const xm = from.x + dx * 0.5;
      const ym = (from.y + to.y) * 0.5;

      if (!from.isDown) {
        // TRANSITION: HIGH to LOW card (Upward Loop)
        const loopCenterY = ym - 24;
        const enterX = xm - 18;
        const enterY = loopCenterY + 18;
        const topX = xm + 4;
        const topY = loopCenterY - 26;
        const exitX = xm + 18;
        const exitY = loopCenterY + 22;

        const segA_p0: Point = { x: from.x, y: from.y };
        const segA_p1: Point = { x: from.x + dx * 0.18, y: from.y + 4 };
        const segA_p2: Point = { x: enterX - 16, y: enterY + 15 };
        const segA_p3: Point = { x: enterX, y: enterY };

        const segB_p0: Point = { x: enterX, y: enterY };
        const segB_p1: Point = { x: xm + 18, y: enterY - 8 };
        const segB_p2: Point = { x: xm + 20, y: topY + 6 };
        const segB_p3: Point = { x: topX, y: topY };

        const segC_p0: Point = { x: topX, y: topY };
        const segC_p1: Point = { x: xm - 18, y: topY + 6 };
        const segC_p2: Point = { x: xm - 22, y: exitY - 4 };
        const segC_p3: Point = { x: exitX, y: exitY };

        const segD_p0: Point = { x: exitX, y: exitY };
        const segD_p1: Point = { x: exitX + 22, y: exitY + 16 };
        const segD_p2: Point = { x: to.x - dx * 0.18, y: to.y - 12 };
        const segD_p3: Point = { x: to.x, y: to.y };

        d += `C ${segA_p1.x.toFixed(1)},${segA_p1.y.toFixed(1)} ${segA_p2.x.toFixed(1)},${segA_p2.y.toFixed(1)} ${segA_p3.x.toFixed(1)},${segA_p3.y.toFixed(1)} `;
        d += `C ${segB_p1.x.toFixed(1)},${segB_p1.y.toFixed(1)} ${segB_p2.x.toFixed(1)},${segB_p2.y.toFixed(1)} ${segB_p3.x.toFixed(1)},${segB_p3.y.toFixed(1)} `;
        d += `C ${segC_p1.x.toFixed(1)},${segC_p1.y.toFixed(1)} ${segC_p2.x.toFixed(1)},${segC_p2.y.toFixed(1)} ${segC_p3.x.toFixed(1)},${segC_p3.y.toFixed(1)} `;
        d += `C ${segD_p1.x.toFixed(1)},${segD_p1.y.toFixed(1)} ${segD_p2.x.toFixed(1)},${segD_p2.y.toFixed(1)} ${segD_p3.x.toFixed(1)},${segD_p3.y.toFixed(1)} `;

        // Bulb 1 (Red): on the descending arch shoulder (segA at t = 0.46), hanging gracefully
        const redPt1 = evalCubicBezier(segA_p0, segA_p1, segA_p2, segA_p3, 0.46);
        bulbs.push({
          id: bulbId++,
          x: Number(redPt1.x.toFixed(1)),
          y: Number(redPt1.y.toFixed(1)),
          rotation: 0,
          ...BULB_COLOR_CONFIGS.red,
          pulseDelay: Number(((bulbId % 5) * 0.45).toFixed(2)),
        });

        // Bulb 2 (Green): perched right on the peak crest of the loop (topX, topY), standing proud
        bulbs.push({
          id: bulbId++,
          x: Number(topX.toFixed(1)),
          y: Number(topY.toFixed(1)),
          rotation: 180,
          ...BULB_COLOR_CONFIGS.green,
          pulseDelay: Number(((bulbId % 5) * 0.45).toFixed(2)),
        });

        // Bulb 3 (Red): on descending exit wire (segD at t = 0.40), hanging gracefully
        const redPt2 = evalCubicBezier(segD_p0, segD_p1, segD_p2, segD_p3, 0.40);
        bulbs.push({
          id: bulbId++,
          x: Number(redPt2.x.toFixed(1)),
          y: Number(redPt2.y.toFixed(1)),
          rotation: 0,
          ...BULB_COLOR_CONFIGS.red,
          pulseDelay: Number(((bulbId % 5) * 0.45).toFixed(2)),
        });
      } else {
        // TRANSITION: LOW to HIGH card (Downward Loop)
        const loopCenterY = ym + 18;
        const enterX = xm - 18;
        const enterY = loopCenterY - 18;
        const botX = xm + 4;
        const botY = loopCenterY + 26;
        const exitX = xm + 18;
        const exitY = loopCenterY - 22;

        const segA_p0: Point = { x: from.x, y: from.y };
        const segA_p1: Point = { x: from.x + dx * 0.18, y: from.y - 4 };
        const segA_p2: Point = { x: enterX - 16, y: enterY - 15 };
        const segA_p3: Point = { x: enterX, y: enterY };

        const segB_p0: Point = { x: enterX, y: enterY };
        const segB_p1: Point = { x: xm + 18, y: enterY + 8 };
        const segB_p2: Point = { x: xm + 20, y: botY - 6 };
        const segB_p3: Point = { x: botX, y: botY };

        const segC_p0: Point = { x: botX, y: botY };
        const segC_p1: Point = { x: xm - 18, y: botY - 6 };
        const segC_p2: Point = { x: xm - 22, y: exitY + 4 };
        const segC_p3: Point = { x: exitX, y: exitY };

        const segD_p0: Point = { x: exitX, y: exitY };
        const segD_p1: Point = { x: exitX + 22, y: exitY - 16 };
        const segD_p2: Point = { x: to.x - dx * 0.18, y: to.y + 12 };
        const segD_p3: Point = { x: to.x, y: to.y };

        d += `C ${segA_p1.x.toFixed(1)},${segA_p1.y.toFixed(1)} ${segA_p2.x.toFixed(1)},${segA_p2.y.toFixed(1)} ${segA_p3.x.toFixed(1)},${segA_p3.y.toFixed(1)} `;
        d += `C ${segB_p1.x.toFixed(1)},${segB_p1.y.toFixed(1)} ${segB_p2.x.toFixed(1)},${segB_p2.y.toFixed(1)} ${segB_p3.x.toFixed(1)},${segB_p3.y.toFixed(1)} `;
        d += `C ${segC_p1.x.toFixed(1)},${segC_p1.y.toFixed(1)} ${segC_p2.x.toFixed(1)},${segC_p2.y.toFixed(1)} ${segC_p3.x.toFixed(1)},${segC_p3.y.toFixed(1)} `;
        d += `C ${segD_p1.x.toFixed(1)},${segD_p1.y.toFixed(1)} ${segD_p2.x.toFixed(1)},${segD_p2.y.toFixed(1)} ${segD_p3.x.toFixed(1)},${segD_p3.y.toFixed(1)} `;

        // Bulb 1 (Red): at the bottom apex crest of the downward loop (botX, botY), hanging gracefully
        bulbs.push({
          id: bulbId++,
          x: Number(botX.toFixed(1)),
          y: Number(botY.toFixed(1)),
          rotation: 0,
          ...BULB_COLOR_CONFIGS.red,
          pulseDelay: Number(((bulbId % 5) * 0.45).toFixed(2)),
        });

        // Bulb 2 (Green): on ascending exit wire (segD at t = 0.38), standing upright
        const greenPt = evalCubicBezier(segD_p0, segD_p1, segD_p2, segD_p3, 0.38);
        bulbs.push({
          id: bulbId++,
          x: Number(greenPt.x.toFixed(1)),
          y: Number(greenPt.y.toFixed(1)),
          rotation: 180,
          ...BULB_COLOR_CONFIGS.green,
          pulseDelay: Number(((bulbId % 5) * 0.45).toFixed(2)),
        });
      }
    }
  }

  // 3. EXIT WIRE: trailing smooth sweep to end of scroll track
  const last = pts[pts.length - 1];
  const endX = Math.max(totalWidth, last.x + 120);
  const exitP0: Point = { x: last.x, y: last.y };
  const exitP1: Point = { x: last.x + (endX - last.x) * 0.35, y: last.y - 12 };
  const exitP2: Point = { x: endX - 30, y: last.y + 16 };
  const exitP3: Point = { x: endX, y: last.y - 5 };

  d += `C ${exitP1.x.toFixed(1)},${exitP1.y.toFixed(1)} ${exitP2.x.toFixed(1)},${exitP2.y.toFixed(1)} ${exitP3.x.toFixed(1)},${exitP3.y.toFixed(1)}`;

  // Exit wire bulb (Green) at t = 0.45, standing upright
  const exitPt1 = evalCubicBezier(exitP0, exitP1, exitP2, exitP3, 0.45);
  bulbs.push({
    id: bulbId++,
    x: Number(exitPt1.x.toFixed(1)),
    y: Number(exitPt1.y.toFixed(1)),
    rotation: 180,
    ...BULB_COLOR_CONFIGS.green,
    pulseDelay: Number(((bulbId % 5) * 0.45).toFixed(2)),
  });

  return { pathD: d, bulbs };
}

// Initial estimated geometry rendered synchronously on SSR and first millisecond
function getEstimatedInitialGeometry(): FlightGeometry {
  const cardWidth = 225;
  const cardGap = 36;
  const paddingX = 24;
  const count = 12;
  const pts: { x: number; y: number; isDown: boolean }[] = [];
  for (let i = 0; i < count; i++) {
    const isDown = i % 2 !== 0;
    const x = paddingX + i * (cardWidth + cardGap) + cardWidth / 2;
    const y = isDown ? 36 : -28;
    pts.push({ x, y, isDown });
  }
  const totalWidth = paddingX * 2 + count * cardWidth + (count - 1) * cardGap;
  return computeFlightGeometry(pts, totalWidth);
}

interface ReelCardProps {
  video: CustomerVideo;
  idx: number;
  isDown: boolean;
  onCardClick: () => void;
  handleLineEnter: () => void;
  handleLineLeave: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
}

function ReelCard({
  video,
  idx,
  isDown,
  onCardClick,
  handleLineEnter,
  handleLineLeave,
  cardRef,
}: ReelCardProps) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Parse initial duration in seconds from video.duration (e.g. "0:04" -> 4)
  const parseSeconds = useCallback((str: string) => {
    const parts = str.split(":");
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 4;
  }, []);

  const [totalSeconds, setTotalSeconds] = useState<number>(() => parseSeconds(video.duration));
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => parseSeconds(video.duration));

  // Sync dynamically with actual video file metadata
  const syncDuration = useCallback(() => {
    if (videoRef.current) {
      const d = videoRef.current.duration;
      if (d && !isNaN(d) && isFinite(d) && d > 0) {
        const exactSec = Math.round(d);
        setTotalSeconds(exactSec);
        setRemainingSeconds(exactSec);
      }
    }
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.readyState >= 1) {
      syncDuration();
    }
  }, [syncDuration]);

  const handleLoadedMetadata = () => {
    syncDuration();
  };

  // Countdown seconds while video plays on hover; automatically resets on loop
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const v = videoRef.current;
      const current = Math.floor(v.currentTime);
      const total = (v.duration && !isNaN(v.duration) && isFinite(v.duration) && v.duration > 0)
        ? Math.round(v.duration)
        : totalSeconds;
      const left = Math.max(0, total - current);
      setRemainingSeconds(left);
    }
  };

  const handleMouseEnter = () => {
    setIsCardHovered(true);
    handleLineEnter();
    if (videoRef.current) {
      syncDuration();
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsCardHovered(false);
    handleLineLeave();
    if (videoRef.current) {
      videoRef.current.pause();
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          setRemainingSeconds(totalSeconds);
        }
      }, 300);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onCardClick}
      className={`group relative shrink-0 w-[190px] sm:w-[210px] lg:w-[225px] aspect-[219/476] cursor-pointer drop-shadow-xs select-none transition-transform duration-300 active:scale-95 ${
        isDown ? "translate-y-7 sm:translate-y-9" : "-translate-y-5 sm:-translate-y-7"
      }`}
    >
      {/* Vector Drawn Moroccan Arch with Clipped Video & Thumbnail */}
      <svg
        viewBox={MOROCCAN_ARCH_VIEWBOX}
        className="w-full h-full drop-shadow-sm select-none overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={`arch-clip-${video.id}-${idx}`}>
            <path d={MOROCCAN_ARCH_PATH} />
          </clipPath>
          <linearGradient id={`arch-grad-${video.id}-${idx}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
            <stop offset="25%" stopColor="#000000" stopOpacity="0" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Embedded Video clipped to Moroccan Arch - shows initial frame by default, plays on hover */}
        <foreignObject
          x="0"
          y="0"
          width={MOROCCAN_ARCH_WIDTH}
          height={MOROCCAN_ARCH_HEIGHT}
          clipPath={`url(#arch-clip-${video.id}-${idx})`}
          style={{ pointerEvents: "none" }}
        >
          <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative", background: "#1a2e1d" }}>
            {/* Immediate synchronous background image: prevents black silhouette on page refresh */}
            <img
              src="/pinterest-ref.jpg"
              alt={video.productName}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <video
              ref={videoRef}
              src="/pinterest_video.mp4"
              poster="/pinterest-ref.jpg"
              muted
              playsInline
              loop
              preload="auto"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </foreignObject>

        {/* 3. Soft Dark Vignette for Text Contrast */}
        <path
          d={MOROCCAN_ARCH_PATH}
          fill={`url(#arch-grad-${video.id}-${idx})`}
          pointerEvents="none"
        />

        {/* 4. Hand-Drawn Moroccan Arch Vector Border (#c4622d Terracotta) */}
        <path
          d={MOROCCAN_ARCH_PATH}
          fill="none"
          stroke="#c4622d"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ paintOrder: "stroke fill" }}
          pointerEvents="none"
        />
      </svg>

      {/* Overlaid UI Controls: Duration Countdown & Play Button */}
      {/* Duration Tag at Arch Apex - counts down when playing on hover */}
      <div className="absolute top-8 inset-x-0 flex justify-center pointer-events-none transition-all duration-300 z-10">
        <span
          className={`px-2.5 py-0.5 rounded-full backdrop-blur-xs text-[10px] font-bold tracking-wider inline-flex items-center shadow-sm transition-all duration-300 ${
            isCardHovered
              ? "bg-black/85 text-[#d4a853] border border-[#d4a853]/40 scale-105"
              : "bg-black/65 text-white border border-white/10"
          }`}
        >
          {formatSeconds(isCardHovered ? remainingSeconds : totalSeconds)}
        </span>
      </div>

      {/* Center Play Button - fades & scales out when hovered so video is seen clearly */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${
          isCardHovered ? "opacity-0 scale-75" : "opacity-100 scale-100"
        }`}
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#c4622d]/90 text-white flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-xs">
          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
        </div>
      </div>
    </div>
  );
}

export function CustomerVideosSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const [activeVideo, setActiveVideo] = useState<CustomerVideo | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [flightPath, setFlightPath] = useState<string>(() => getEstimatedInitialGeometry().pathD);
  const [bulbs, setBulbs] = useState<LightBulbData[]>(() => getEstimatedInitialGeometry().bulbs);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Modal Video Player State (TikTok / Reels Style)
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isModalPlaying, setIsModalPlaying] = useState(true);

  const toggleModalVideoPlay = () => {
    if (modalVideoRef.current) {
      if (modalVideoRef.current.paused) {
        modalVideoRef.current.play().catch(() => {});
        setIsModalPlaying(true);
      } else {
        modalVideoRef.current.pause();
        setIsModalPlaying(false);
      }
    }
  };

  useEffect(() => {
    if (activeVideo) {
      setIsModalPlaying(true);
    }
  }, [activeVideo]);

  // TikTok-style Comments State
  const [commentsByVideo, setCommentsByVideo] = useState<Record<string, CustomerComment[]>>(() => {
    const initial: Record<string, CustomerComment[]> = {};
    VIDEOS.forEach((v) => {
      initial[v.id] = v.initialComments || [];
    });
    return initial;
  });
  const [newCommentText, setNewCommentText] = useState("");
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(new Set());

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVideo || !newCommentText.trim()) return;

    const newComment: CustomerComment = {
      id: `c-${Date.now()}`,
      userName: "Vous",
      avatar: "V",
      avatarBg: "bg-[#78350f]",
      time: "À l'instant",
      text: newCommentText.trim(),
      likes: 0,
    };

    setCommentsByVideo((prev) => ({
      ...prev,
      [activeVideo.id]: [...(prev[activeVideo.id] || []), newComment],
    }));

    setNewCommentText("");
  };

  const handleToggleLike = (commentId: string) => {
    setLikedCommentIds((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  // Close modal on Escape key
  useEffect(() => {
    if (!activeVideo) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeVideo]);

  const handleLineEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (scrollContainerRef.current) {
      setScrollLeftPos(scrollContainerRef.current.scrollLeft);
      setViewportWidth(scrollContainerRef.current.clientWidth);
    }
    setIsHovered(true);
  }, []);

  const handleLineLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 100);
  }, []);

  // Mouse Drag-to-Scroll refs
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const sl = scrollContainerRef.current.scrollLeft;
      setCanScrollLeft(sl > 10);
      setScrollLeftPos(sl);
      setViewportWidth(scrollContainerRef.current.clientWidth);
    }
  };


  // Mouse Drag Handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const onMouseUp = () => {
    isDraggingRef.current = false;
  };

  const onMouseLeave = () => {
    isDraggingRef.current = false;
  };

  // Measure card apex coordinates relative to inner track
  const updateFlightPath = useCallback(() => {
    if (!trackRef.current) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const pts: { x: number; y: number; isDown: boolean }[] = [];

    const totalCards = VIDEOS.length * 2;
    for (let i = 0; i < totalCards; i++) {
      const cardEl = cardRefs.current[i];
      if (!cardEl) continue;
      const cardRect = cardEl.getBoundingClientRect();
      // Exact horizontal center and top apex of the card's Moroccan arch
      const x = cardRect.left - trackRect.left + cardRect.width / 2;
      const y = cardRect.top - trackRect.top;
      const isDown = i % 2 !== 0;
      pts.push({ x, y, isDown });
    }

    if (pts.length < 2) return;
    const totalTrackWidth = trackRef.current.scrollWidth || trackRect.width;
    const geo = computeFlightGeometry(pts, totalTrackWidth);
    setFlightPath(geo.pathD);
    setBulbs(geo.bulbs);
  }, []);

  // Synchronize bulbs with measured card positions
  const updateBulbs = useCallback(() => {
    updateFlightPath();
  }, [updateFlightPath]);

  useEffect(() => {
    updateFlightPath();
    updateBulbs();

    const rAF = requestAnimationFrame(() => {
      updateFlightPath();
      updateBulbs();
    });
    const timer1 = setTimeout(() => {
      updateFlightPath();
      updateBulbs();
    }, 50);
    const timer2 = setTimeout(() => {
      updateFlightPath();
      updateBulbs();
    }, 150);
    const timer3 = setTimeout(() => {
      updateFlightPath();
      updateBulbs();
    }, 350);

    const handleResize = () => {
      updateFlightPath();
      updateBulbs();
    };

    window.addEventListener("resize", handleResize);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && trackRef.current) {
      observer = new ResizeObserver(() => {
        updateFlightPath();
        updateBulbs();
      });
      observer.observe(trackRef.current);
    }

    return () => {
      cancelAnimationFrame(rAF);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener("resize", handleResize);
      if (observer) observer.disconnect();
    };
  }, [updateFlightPath, updateBulbs]);

  // Recalculate bulb coordinates whenever flightPath changes
  useEffect(() => {
    updateBulbs();
    const t = setTimeout(updateBulbs, 60);
    return () => clearTimeout(t);
  }, [flightPath, updateBulbs]);

  return (
    <section className="pt-8 sm:pt-10 pb-16 sm:pb-20 bg-[#ffffff] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Centered */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-9 flex flex-col items-center">
          <div className="mb-2.5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ba4e1a] inline-flex items-center gap-1.5 bg-[#ba4e1a]/8 px-3.5 py-1.5 rounded-full border border-[#ba4e1a]/15">
              <Video className="w-3.5 h-3.5 text-[#ba4e1a] stroke-[2.2]" />
              Expériences Clients en Vidéo
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-black text-[#1c1917] tracking-tight">
            Nos Pièces Installées Chez Vous
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#1c1917]/70 font-medium max-w-xl mx-auto">
            Découvrez les réceptions de colis et installations réelles filmées par nos clients aux quatre coins du Maroc.
          </p>
        </div>
      </div>

      {/* Full-width Carousel Area with minimal left padding & soft white edge shadow fades */}
      <div
        className="relative w-full"
        onMouseEnter={handleLineEnter}
        onMouseLeave={handleLineLeave}
      >
        {/* Left White Gradient Shadow Fade - only active when scrolled */}
        <div
          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-r from-white/60 to-transparent z-30 transition-opacity duration-300 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Right White Gradient Shadow Fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-l from-white/60 to-transparent z-30" />

        {/* Scrollable Carousel Viewport */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onMouseEnter={handleLineEnter}
          className="overflow-x-auto pt-18 sm:pt-20 pb-14 sm:pb-18 scrollbar-none cursor-grab active:cursor-grabbing select-none w-full"
        >
          {/* Inner Track: Moves as a single layer so SVG line scrolls 100% in lockstep with the cards */}
          <div
            ref={trackRef}
            onMouseEnter={handleLineEnter}
            onMouseLeave={handleLineLeave}
            className="relative min-w-max flex items-center gap-7 sm:gap-8 lg:gap-9 px-4 sm:px-6"
          >
            {/* Pure Code SVG Dashed Flight Line Touching Every Arch Apex with Loops + Interactive Sequential Fairy Lights */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
              onMouseEnter={handleLineEnter}
              onMouseLeave={handleLineLeave}
            >
              <defs>
                {/* Radiant Glow Gradients for Red, Amber, and Green Bulbs on Hover */}
                <radialGradient id="fairy-glow-red" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff2a3b" stopOpacity="0.88" />
                  <stop offset="35%" stopColor="#ff2a3b" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#ff2a3b" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ff2a3b" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="fairy-glow-amber" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffaa00" stopOpacity="0.92" />
                  <stop offset="35%" stopColor="#ff9900" stopOpacity="0.5" />
                  <stop offset="70%" stopColor="#ff8800" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#ff7700" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="fairy-glow-green" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.88" />
                  <stop offset="35%" stopColor="#16a34a" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#15803d" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#166534" stopOpacity="0" />
                </radialGradient>

                {/* 3D Glass Inner Shading Gradients */}
                <linearGradient id="bulb-glass-red" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b78" />
                  <stop offset="40%" stopColor="#ff2a3b" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>

                <linearGradient id="bulb-glass-amber" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="40%" stopColor="#ffaa00" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>

                <linearGradient id="bulb-glass-green" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#86efac" />
                  <stop offset="40%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
              </defs>

              <style>{`
                @keyframes fairyBreathe {
                  0%, 100% {
                    opacity: 0.55;
                    transform: scale(0.96);
                  }
                  50% {
                    opacity: 0.95;
                    transform: scale(1.08);
                  }
                }
                .fairy-halo-pulse {
                  transform-origin: center;
                  transform-box: fill-box;
                  animation: fairyBreathe 2.6s ease-in-out infinite;
                }
              `}</style>

              {/* 1. Wide Invisible Hit Area along the flight path for effortless hover */}
              <path
                d={flightPath}
                fill="none"
                stroke="transparent"
                strokeWidth="60"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-auto cursor-pointer"
                onMouseEnter={handleLineEnter}
                onMouseLeave={handleLineLeave}
                onClick={() => setIsHovered((prev) => !prev)}
              />

              {/* 2. Visible Dashed Flight Line */}
              <path
                ref={pathRef}
                d={flightPath}
                fill="none"
                stroke="#1e1e1e"
                strokeWidth="2.5"
                strokeDasharray="8 6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-85 pointer-events-auto cursor-pointer transition-opacity duration-300"
                onMouseEnter={handleLineEnter}
                onMouseLeave={handleLineLeave}
                onClick={() => setIsHovered((prev) => !prev)}
              />

              {/* 3. Pure Code Festive Light Bulbs with Wave Cascade (Left-to-Right on hover, Right-to-Left on leave) */}
              {(() => {
                // Find visible bulbs in current scroll viewport
                const visibleBulbs = bulbs.filter(
                  (b) => b.x >= scrollLeftPos - 60 && b.x <= scrollLeftPos + viewportWidth + 60
                );
                const firstVis = visibleBulbs.length > 0 ? visibleBulbs[0].id : 0;
                const lastVis =
                  visibleBulbs.length > 0 ? visibleBulbs[visibleBulbs.length - 1].id : bulbs.length - 1;

                // Distinct step delay (115ms on enter, 90ms on leave) ensures each bulb's ignition is clearly perceived!
                const STEP_ON = 115;
                const STEP_OFF = 90;

                return bulbs.map((bulb) => {
                  let delayMs = 0;
                  if (isHovered) {
                    if (bulb.id >= firstVis) {
                      delayMs = (bulb.id - firstVis) * STEP_ON;
                    } else {
                      delayMs = 0;
                    }
                  } else {
                    if (bulb.id <= lastVis) {
                      delayMs = (lastVis - bulb.id) * STEP_OFF;
                    } else {
                      delayMs = 0;
                    }
                  }

                  const transitionDelay = `${delayMs}ms`;

                  return (
                    <g
                      key={bulb.id}
                      transform={`translate(${bulb.x}, ${bulb.y}) rotate(${bulb.rotation})`}
                      className="pointer-events-auto cursor-pointer"
                      onMouseEnter={handleLineEnter}
                      onMouseLeave={handleLineLeave}
                      onClick={() => setIsHovered((prev) => !prev)}
                    >
                      {/* Outer Diffuse Radiant Halo (Pops to life with snappy delay in wave) */}
                      <circle
                        cx="0"
                        cy="16"
                        r="22"
                        fill={`url(#${bulb.glowGradId})`}
                        className={isHovered ? "fairy-halo-pulse" : ""}
                        style={{
                          opacity: isHovered ? 0.9 : 0,
                          transform: isHovered ? "scale(1)" : "scale(0.25)",
                          transformOrigin: "center",
                          transformBox: "fill-box",
                          transition: "opacity 0.15s ease-out, transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          transitionDelay,
                          animationDelay: `${bulb.pulseDelay}s`,
                        }}
                      />

                      {/* Core Intense Inner Halo */}
                      <ellipse
                        cx="0"
                        cy="16"
                        rx="12"
                        ry="14"
                        fill={bulb.glowColor}
                        style={{
                          opacity: isHovered ? 0.35 : 0,
                          transition: "opacity 0.15s ease-out",
                          transitionDelay,
                        }}
                      />

                      {/* Socket Clamp over the wire */}
                      <rect
                        x="-4"
                        y="-1.5"
                        width="8"
                        height="5"
                        rx="1.2"
                        fill="#182218"
                        stroke="#0f160f"
                        strokeWidth="0.8"
                      />
                      {/* Socket Collar / Neck */}
                      <rect
                        x="-5"
                        y="3"
                        width="10"
                        height="3.5"
                        rx="1"
                        fill="#243826"
                      />

                      {/* Glass Bulb Body (Teardrop shape) - Turns from dark resting glass to radiant light */}
                      <path
                        d="M -4,6.5 C -6.5,9.5 -8.5,14 -7.5,18.5 C -6.5,23 -3,26 0,26 C 3,26 6.5,23 7.5,18.5 C 8.5,14 6.5,9.5 4,6.5 Z"
                        fill={isHovered ? `url(#bulb-glass-${bulb.name})` : bulb.restingColor}
                        stroke={bulb.glassStroke}
                        strokeWidth="0.8"
                        style={{
                          filter: isHovered
                            ? `drop-shadow(0 0 5px ${bulb.color}) drop-shadow(0 0 14px ${bulb.glowColor})`
                            : "drop-shadow(0 1px 2px rgba(0,0,0,0.25))",
                          transition: "filter 0.14s ease-out, fill 0.14s ease-out",
                          transitionDelay,
                        }}
                      />

                      {/* Filament Center - Ignites white-hot on hover */}
                      <ellipse
                        cx="0"
                        cy="16"
                        rx="2"
                        ry="4.5"
                        fill="#ffffff"
                        style={{
                          opacity: isHovered ? 1 : 0,
                          transition: "opacity 0.12s ease-out",
                          transitionDelay,
                        }}
                      />

                      {/* Specular Surface Arc Reflection */}
                      <path
                        d="M -4.5,10 C -5.5,13 -5,17 -3.5,20"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        style={{
                          opacity: isHovered ? 0.9 : 0.25,
                          transition: "opacity 0.14s ease-out",
                          transitionDelay,
                        }}
                      />
                    </g>
                  );
                });
              })()}
            </svg>

            {/* Staggered Moroccan Arch Reel Cards */}
            {[...VIDEOS, ...VIDEOS].map((video, idx) => {
              const isDown = idx % 2 !== 0;

              return (
                <ReelCard
                  key={`${video.id}-${idx}`}
                  video={video}
                  idx={idx}
                  isDown={isDown}
                  handleLineEnter={handleLineEnter}
                  handleLineLeave={handleLineLeave}
                  onCardClick={() => {
                    if (!hasMovedRef.current) {
                      setActiveVideo(video);
                    }
                  }}
                  cardRef={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                />
              );
            })}
          </div>
        </div>

      </div>

      {/* Video Modal Reel Player with TikTok-style Split Panel */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] h-[88vh] bg-[#141210] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ================= LEFT: REEL VIDEO CONTAINER ================= */}
            <div className="relative w-full md:w-[48%] lg:w-[46%] h-[48vh] md:h-full bg-black shrink-0 flex flex-col justify-between overflow-hidden">
              {/* Top Bar: Customer Info + Verified Badge */}
              <div className="absolute top-0 inset-x-0 z-20 p-4 bg-gradient-to-b from-black/85 via-black/45 to-transparent flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2.5 pointer-events-auto">
                  <div className="w-9 h-9 rounded-full bg-[#c4622d] text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {activeVideo.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {activeVideo.customerName}
                      </h4>
                      <CheckCircle2 className="w-3.5 h-3.5 fill-[#d4a853] text-black" />
                    </div>
                    <p className="text-[11px] text-white/75 font-medium">
                      {activeVideo.city} • Achat Vérifié
                    </p>
                  </div>
                </div>

                {/* Mobile Close Button */}
                <button
                  onClick={() => setActiveVideo(null)}
                  className="md:hidden pointer-events-auto group w-8 h-8 rounded-full bg-black/60 hover:bg-[#ba4e1a] text-white/90 hover:text-white border border-white/20 flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
                  aria-label="Fermer la vidéo"
                >
                  <X className="w-4 h-4 stroke-[2] transition-transform duration-300 group-hover:rotate-90" />
                </button>
              </div>

              {/* Reel Video Player (Clean TikTok / Reels Player - No Native Progress Bar or 3-Dots) */}
              <div
                className="relative w-full h-full cursor-pointer select-none"
                onClick={toggleModalVideoPlay}
              >
                <video
                  ref={modalVideoRef}
                  src="/pinterest_video.mp4"
                  poster={activeVideo.thumbnail}
                  autoPlay
                  playsInline
                  loop
                  disablePictureInPicture
                  controlsList="nodownload noplaybackrate nofullscreen"
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-full object-cover"
                />

                {/* Subtle Play Overlay if user paused the video */}
                {!isModalPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-all">
                    <div className="w-13 h-13 rounded-full bg-black/65 text-white flex items-center justify-center shadow-xl border border-white/20">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Overlay: Full Width (95%) Product Tag Banner */}
              <div className="absolute bottom-0 inset-x-0 z-20 p-3 sm:p-3.5 bg-gradient-to-t from-black/90 via-black/55 to-transparent pointer-events-none flex justify-center">
                <div className="w-[95%] flex items-center gap-3 p-2 sm:p-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 shadow-xl">
                  {/* Product Thumbnail */}
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-white/25 shrink-0 bg-black/40">
                    <Image
                      src={activeVideo.productImage || activeVideo.thumbnail}
                      alt={activeVideo.productName}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>

                  {/* Product Metadata */}
                  <div className="flex-1 min-w-0 pr-1">
                    <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#d4a853] leading-none mb-1 truncate">
                      {activeVideo.category}
                    </span>
                    <h5 className="text-xs sm:text-[13px] font-bold text-white truncate leading-snug drop-shadow-xs">
                      {activeVideo.productName}
                    </h5>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= RIGHT: TIKTOK COMMENTS (FULL WHITE BACKGROUND) ================= */}
            <div className="relative flex-1 h-[52vh] md:h-full flex flex-col bg-white border-t md:border-t-0 md:border-l border-[#f0e6dc] overflow-hidden">
              {/* Top Header of Right Panel: Commentaires + Count + Close Button */}
              <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-[#f0e6dc] flex items-center justify-between shrink-0 bg-white">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#ba4e1a]" />
                  <span className="text-sm font-bold text-[#1c1917] tracking-tight">
                    Commentaires
                  </span>
                  <span className="text-[11px] font-bold text-[#ba4e1a] bg-[#ba4e1a]/10 px-2 py-0.5 rounded-full border border-[#ba4e1a]/15">
                    {(commentsByVideo[activeVideo.id] || []).length + 1}
                  </span>
                </div>

                {/* Signature Rotating Close Button (Desktop) */}
                <button
                  onClick={() => setActiveVideo(null)}
                  className="hidden md:flex group w-8.5 h-8.5 rounded-full bg-[#faf6f2] hover:bg-[#ba4e1a] text-[#1c1917]/60 hover:text-white border border-[#ebd8be] hover:border-[#ba4e1a] items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-2xs shrink-0"
                  aria-label="Fermer la vidéo"
                  title="Fermer (Échap)"
                >
                  <X className="w-4 h-4 stroke-[2] transition-transform duration-300 group-hover:rotate-90" />
                </button>
              </div>

              {/* Scrollable TikTok Comments Feed (Full Height) */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-white">
                {/* 📌 Pinned Buyer Review Comment (Integrated in comments feed) */}
                <div className="flex items-start gap-2.5">
                  {/* Avatar */}
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#78350f] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs ring-2 ring-white">
                    {activeVideo.customerName.charAt(0)}
                  </div>

                  {/* Comment Bubble (Beige background, stable on hover) */}
                  <div className="flex-1 min-w-0 bg-[#faf6f2] rounded-2xl rounded-tl-xs px-3.5 py-2.5 border border-[#ebd8be]/55">
                    <div className="flex items-center justify-between gap-1.5 mb-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-[#1c1917]">
                          {activeVideo.customerName}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#ba4e1a] bg-[#ba4e1a]/10 px-2 py-0.5 rounded-full border border-[#ba4e1a]/20">
                          Acheteur Vérifié
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 text-[#1c1917]/45">
                        <span className="text-[10px] font-medium">
                          Il y a 1j
                        </span>
                        <span className="flex items-center text-stone-400" title="Commentaire épinglé">
                          <Pin className="w-3 h-3 text-stone-400 rotate-45" />
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#1c1917]/90 leading-relaxed font-medium italic break-words">
                      « {activeVideo.quote} »
                    </p>
                  </div>

                  {/* TikTok Heart Like Button for Buyer's Review */}
                  <button
                    onClick={() => handleToggleLike(`buyer-${activeVideo.id}`)}
                    className="flex flex-col items-center gap-0.5 text-[#1c1917]/35 hover:text-rose-500 transition-colors shrink-0 cursor-pointer pt-2 px-1"
                    aria-label="Aimer ce commentaire"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-transform duration-200 active:scale-125 ${
                        likedCommentIds.has(`buyer-${activeVideo.id}`)
                          ? "fill-rose-500 text-rose-500 scale-110"
                          : "text-[#1c1917]/35 hover:text-rose-500"
                      }`}
                    />
                    <span
                      className={`text-[10px] font-bold ${
                        likedCommentIds.has(`buyer-${activeVideo.id}`)
                          ? "text-rose-500"
                          : "text-[#1c1917]/45"
                      }`}
                    >
                      {34 + (likedCommentIds.has(`buyer-${activeVideo.id}`) ? 1 : 0)}
                    </span>
                  </button>
                </div>
                {(commentsByVideo[activeVideo.id] || []).map((comment) => {
                  const isLiked = likedCommentIds.has(comment.id);
                  const likesCount = comment.likes + (isLiked ? 1 : 0);

                  return (
                    <div key={comment.id} className="flex items-start gap-2.5">
                      {/* Avatar */}
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#78350f] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs ring-2 ring-white">
                        {comment.avatar}
                      </div>

                      {/* Comment Bubble (Uniform beige background, stable on hover) */}
                      <div className="flex-1 min-w-0 bg-[#faf6f2] rounded-2xl rounded-tl-xs px-3.5 py-2.5 border border-[#ebd8be]/55">
                        <div className="flex items-center justify-between gap-1.5 mb-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-[#1c1917]">
                              {comment.userName}
                            </span>
                            {comment.isOfficial && (
                              <span
                                className="text-[9px] font-bold uppercase tracking-wider text-[#ba4e1a] bg-[#ba4e1a]/12 px-2 py-0.5 rounded-full border border-[#ba4e1a]/25"
                                title="Boutique Officielle Marjad"
                              >
                                Boutique Officielle
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#1c1917]/45 font-medium shrink-0">
                            {comment.time}
                          </span>
                        </div>
                        <p className="text-xs text-[#1c1917]/85 leading-relaxed break-words">
                          {comment.text}
                        </p>
                      </div>

                      {/* TikTok Heart Like Button */}
                      <button
                        onClick={() => handleToggleLike(comment.id)}
                        className="flex flex-col items-center gap-0.5 text-[#1c1917]/35 hover:text-rose-500 transition-colors shrink-0 cursor-pointer pt-2 px-1"
                        aria-label="Aimer ce commentaire"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-transform duration-200 active:scale-125 ${
                            isLiked
                              ? "fill-rose-500 text-rose-500 scale-110"
                              : "text-[#1c1917]/35 hover:text-rose-500"
                          }`}
                        />
                        <span
                          className={`text-[10px] font-bold ${
                            isLiked ? "text-rose-500" : "text-[#1c1917]/45"
                          }`}
                        >
                          {likesCount}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Bottom TikTok Comment Input Bar */}
              <div className="p-3 sm:p-4 border-t border-[#f0e6dc] bg-white shrink-0">
                <form onSubmit={handleAddComment} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#78350f] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    V
                  </div>
                  <div className="relative flex-1 flex items-center">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Ajouter un commentaire..."
                      className="w-full bg-[#faf6f2] hover:bg-[#f6eee5] focus:bg-white border border-[#ebd8be] focus:border-[#ba4e1a] focus:ring-2 focus:ring-[#ba4e1a]/15 text-xs sm:text-sm text-[#1c1917] placeholder-[#1c1917]/40 rounded-full pl-4 pr-10 py-2.5 outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="absolute right-1.5 w-7 h-7 rounded-full bg-[#ba4e1a] hover:bg-[#9e3e12] disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                      title="Publier"
                    >
                      <Send className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
