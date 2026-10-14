import { DECOR_PRODUCTS, CATEGORIES as DEFAULT_CATEGORIES, PRODUCTS } from "@/data/mockProducts";
import { Product, Category } from "@/types/product";

export interface AdminProduct {
  id: string | number;
  name: string;
  nameAr?: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  price: number;
  oldPrice?: number;
  stock: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
  dateAdded: string; // YYYY-MM-DD
  salesCount: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images?: string[];
  shortDescription?: string;
  description?: string;
  artisanName?: string;
  artisanCity?: string;
  material?: string;
  dimensions?: string;
  dimensionsList?: string[];
  colors?: {
    id: string;
    name: string;
    hex: string;
    bgHex?: string;
    accentHex?: string;
    bgGradient?: string;
    textColor?: string;
    dimensions?: string;
    imageIndex?: number;
    imageUrl?: string;
  }[];
  imageVariants?: {
    id: string;
    url: string;
    dimensions?: string;
    colorName?: string;
    colorHex?: string;
    bgHex?: string;
    accentHex?: string;
  }[];
  finish?: string;
  origin?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isDeleted?: boolean;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCity: string;
  customerAddress: string;
  source?: string;
  items: {
    productId: string | number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  date: string;
  paymentMethod: string;
  notes?: string;
}

export interface AdminReview {
  id: string;
  productId: string | number;
  productName: string;
  productImage: string;
  customerName: string;
  customerCity: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: "approved" | "pending" | "rejected";
  helpfulCount: number;
}

export interface AdminTrendingVideo {
  id: string;
  title: string;
  author: string;
  views: string;
  likes: string;
  productId?: string | number;
  productName: string;
  category?: string;
  productSlug: string;
  productImage?: string;
  price: string;
  thumbnail: string;
  videoUrl?: string;
  active: boolean;
  dateAdded: string;
  customerName?: string;
  city?: string;
  quote?: string;
}

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  nameAr?: string;
  description: string;
  image: string;
  itemCount: number;
  dateAdded?: string;
}

const getCategorySlugForDecor = (catName?: string) => {
  if (!catName) return "calligraphie";
  const lower = catName.toLowerCase();
  if (lower.includes("calligraphie") || lower.includes("ruche") || lower.includes("tableau")) return "calligraphie";
  if (lower.includes("étagère") || lower.includes("etagere") || lower.includes("mobilier")) return "etagere";
  if (lower.includes("arche") || lower.includes("panneau")) return "arche";
  if (lower.includes("miroir")) return "miroir";
  if (lower.includes("médaillon") || lower.includes("medaillon") || lower.includes("relief")) return "medaillon";
  return "calligraphie";
};

const ALL_CATALOG_PRODUCTS: Product[] = [
  ...PRODUCTS,
  ...DECOR_PRODUCTS.filter((dp) => !PRODUCTS.some((p) => p.id === dp.id)),
];

export const INITIAL_ADMIN_PRODUCTS: AdminProduct[] = ALL_CATALOG_PRODUCTS.map((p, idx) => {
  const stock = p.stockCount ?? (idx % 3 === 0 ? 3 : 8);
  const status: "in_stock" | "low_stock" | "out_of_stock" =
    stock <= 0 ? "out_of_stock" : stock <= 4 ? "low_stock" : "in_stock";
  const catSlug = getCategorySlugForDecor(p.category);
  return {
    id: p.id,
    name: p.name,
    nameAr: p.nameAr,
    slug: p.slug,
    categorySlug: catSlug,
    categoryName: p.category || "Calligraphie Murale",
    price: p.price,
    oldPrice: p.originalPrice,
    stock,
    status,
    dateAdded: `2026-0${Math.min(9, (idx % 8) + 1)}-1${Math.min(8, (idx % 7) + 2)}`,
    salesCount: Math.floor(65 + (idx * 23) % 180),
    rating: p.rating || 4.9,
    reviewsCount: p.reviewCount || 24,
    image: p.images?.[0] || "/decor-honeycomb-calligraphy.webp",
    images: p.images || [],
    shortDescription: p.shortDescription,
    description: p.description,
    artisanName: p.artisan?.name || "Maâlem Artisan Marjad",
    artisanCity: p.artisan?.city || "Fès Médina",
    material: p.details?.material,
    origin: p.details?.origin,
    isFeatured: p.isFeatured,
    isBestSeller: p.isBestSeller,
  };
});

export const INITIAL_ADMIN_CATEGORIES: AdminCategory[] = [
  {
    id: "calligraphie",
    slug: "calligraphie",
    name: "Calligraphie Murale",
    nameAr: "خط عربي ولوحات مذهبة",
    description: "Compositions alvéolaires et calligraphies d'apparat en bois noble et feuilles d'or 24 carats.",
    image: "/decor-honeycomb-calligraphy.webp",
    itemCount: 2,
    dateAdded: "2026-01-15",
  },
  {
    id: "etagere",
    slug: "etagere",
    name: "Étagères & Mobilier Mural",
    nameAr: "رفوف جدارية فاخرة",
    description: "Consoles murales sculptées en noyer sauvage de l'Atlas et laiton doré ciselé.",
    image: "/decor-alhamdulillah-shelf.webp",
    itemCount: 2,
    dateAdded: "2026-01-15",
  },
  {
    id: "arche",
    slug: "arche",
    name: "Arches & Panneaux",
    nameAr: "أقواس أندلسية محفورة",
    description: "Arches mauresques cintrées et panneaux géométriques en cèdre parfumé de l'Atlas.",
    image: "/decor-ya-allah-arch.webp",
    itemCount: 2,
    dateAdded: "2026-01-15",
  },
  {
    id: "miroir",
    slug: "miroir",
    name: "Miroirs d'Art",
    nameAr: "مرايا شمسية أصيلة",
    description: "Miroirs solaires sculptés en bois précieux et sertissages de laiton doré étincelant.",
    image: "/decor-sunburst-mirror.webp",
    itemCount: 2,
    dateAdded: "2026-01-15",
  },
  {
    id: "medaillon",
    slug: "medaillon",
    name: "Médaillons & Reliefs",
    nameAr: "دروع وميداليات دائرية",
    description: "Disques et médaillons royaux ciselés en bas-relief à la main avec arabesques traditionnelles.",
    image: "/decor-gold-medallion.webp",
    itemCount: 2,
    dateAdded: "2026-01-15",
  },
];

export const INITIAL_ADMIN_ORDERS: AdminOrder[] = [
  {
    id: "CMD-MAR-8941",
    customerName: "Lalla Fatima-Zahra Benali",
    customerPhone: "0661245890",
    customerEmail: "fatimazahra.benali@gmail.com",
    customerCity: "Casablanca",
    customerAddress: "Angle Bd d'Anfa et Zerktouni, Résidence Les Palmiers, Étage 4",
    source: "Site Web",
    items: [
      {
        productId: "decor-1",
        name: "Tableau Ruche 'سبحان الله وبحمده'",
        price: 1350,
        quantity: 1,
        image: "/decor-honeycomb-calligraphy.webp",
      },
      {
        productId: "decor-5",
        name: "Médaillon Calligraphie Royale Ciselée",
        price: 980,
        quantity: 1,
        image: "/decor-gold-medallion.webp",
      },
    ],
    total: 2330,
    status: "confirmed",
    date: "2026-10-07 11:42",
    paymentMethod: "Paiement à la livraison (Cash on Delivery)",
    notes: "Appeler avant la livraison svp. Emballage luxe cadeau.",
  },
  {
    id: "CMD-MAR-8940",
    customerName: "Si Youssef Amrani",
    customerPhone: "0663456789",
    customerEmail: "youssef.amrani@gmail.com",
    customerCity: "Rabat",
    customerAddress: "Secteur 21, Rue Al Inara, Villa 12, Souissi",
    source: "Instagram Ads",
    items: [
      {
        productId: "decor-2",
        name: "Étagère Murale 'الحمد لله رب العالمين'",
        price: 1650,
        quantity: 1,
        image: "/decor-alhamdulillah-shelf.webp",
      },
      {
        productId: "decor-4",
        name: "Miroir Soleil Artisanal en Bois & Laiton",
        price: 1400,
        quantity: 1,
        image: "/decor-sunburst-mirror.webp",
      },
    ],
    total: 3050,
    status: "shipped",
    date: "2026-10-06 17:15",
    paymentMethod: "Paiement à la livraison (Cash on Delivery)",
    notes: "Livraison express en matinée demandée.",
  },
  {
    id: "CMD-MAR-8939",
    customerName: "Dr. Mehdi Tazi",
    customerPhone: "0661789012",
    customerEmail: "mehdi.tazi@gmail.com",
    customerCity: "Marrakech",
    customerAddress: "Palmeraie Circuit, Villa Dar Diafa, Porte 3",
    source: "Site Web",
    items: [
      {
        productId: "decor-3",
        name: "Arche Mauresque Cintrée 'يا الله'",
        price: 1850,
        quantity: 1,
        image: "/decor-ya-allah-arch.webp",
      },
    ],
    total: 1850,
    status: "delivered",
    date: "2026-10-05 14:20",
    paymentMethod: "Paiement à la livraison (Cash on Delivery)",
    notes: "Livré et payé en espèces.",
  },
  {
    id: "CMD-MAR-8938",
    customerName: "Salma El Mansouri",
    customerPhone: "0662890123",
    customerEmail: "salma.mansouri@gmail.com",
    customerCity: "Fès",
    customerAddress: "Route d'Imouzzer, Résidence Riad Al Andalus",
    source: "TikTok Ads",
    items: [
      {
        productId: "decor-1",
        name: "Tableau Ruche 'سبحان الله وبحمده'",
        price: 1350,
        quantity: 1,
        image: "/decor-honeycomb-calligraphy.webp",
      },
    ],
    total: 1350,
    status: "pending",
    date: "2026-10-07 10:10",
    paymentMethod: "Paiement à la livraison (Cash on Delivery)",
  },
  {
    id: "CMD-MAR-8937",
    customerName: "Kenza Berrada",
    customerPhone: "0664567890",
    customerEmail: "kenza.berrada@gmail.com",
    customerCity: "Tanger",
    customerAddress: "Malabata, Résidence Bay View, Tanger",
    source: "Site Web",
    items: [
      {
        productId: "decor-9",
        name: "Miroir Rayonnant Soleil de Fès",
        price: 1550,
        quantity: 1,
        image: "/decor-sunburst-mirror.webp",
      },
    ],
    total: 1550,
    status: "confirmed",
    date: "2026-10-06 09:30",
    paymentMethod: "Paiement à la livraison (Cash on Delivery)",
  },
  {
    id: "CMD-MAR-8936",
    customerName: "Amina Cherkaoui",
    customerPhone: "0665123456",
    customerEmail: "amina.cherkaoui@gmail.com",
    customerCity: "Agadir",
    customerAddress: "Baie des Palmiers, Sonaba, Agadir",
    source: "Facebook Ads",
    items: [
      {
        productId: "decor-10",
        name: "Disque Mural Calligraphique Royal Fassi",
        price: 1150,
        quantity: 1,
        image: "/decor-gold-medallion.webp",
      },
    ],
    total: 1150,
    status: "delivered",
    date: "2026-10-04 16:00",
    paymentMethod: "Paiement à la livraison (Cash on Delivery)",
  },
  {
    id: "CMD-MAR-8935",
    customerName: "Rachid Bennani",
    customerPhone: "0667894561",
    customerEmail: "rachid.bennani@gmail.com",
    customerCity: "Meknès",
    customerAddress: "Hamria, Rue Beyrouth, Immeuble Atlas",
    source: "Site Web",
    items: [
      {
        productId: "decor-3",
        name: "Arche Mauresque Cintrée 'يا الله'",
        price: 1850,
        quantity: 1,
        image: "/decor-ya-allah-arch.webp",
      },
    ],
    total: 1850,
    status: "cancelled",
    date: "2026-10-03 11:25",
    paymentMethod: "Paiement à la livraison (Cash on Delivery)",
    notes: "Client injoignable après 3 tentatives d'appel.",
  },
];

export const INITIAL_ADMIN_REVIEWS: AdminReview[] = [
  {
    id: "REV-101",
    productId: "decor-1",
    productName: "Tableau Ruche 'سبحان الله وبحمده'",
    productImage: "/decor-honeycomb-calligraphy.webp",
    customerName: "Lalla Kenza Chraïbi",
    customerCity: "Casablanca",
    rating: 5,
    title: "Qualité exceptionnelle et finition or 24 carats",
    comment:
      "Cette œuvre alvéolaire a illuminé notre salon. Le marbre noble et les lettres dorées sont d'une perfection rare. Bravo aux artisans pour ce chef-d'œuvre !",
    date: "2026-10-05",
    status: "approved",
    helpfulCount: 14,
  },
  {
    id: "REV-102",
    productId: "decor-3",
    productName: "Arche Mauresque Cintrée 'يا الله'",
    productImage: "/decor-ya-allah-arch.webp",
    customerName: "Si Omar El Fassi",
    customerCity: "Fès",
    rating: 5,
    title: "Le vrai savoir-faire mérinide chez soi",
    comment:
      "Le cèdre dégage une odeur apaisante authentique de l'Atlas. Les incrustations et la calligraphie sont travaillées avec une minutie d'orfèvre.",
    date: "2026-10-04",
    status: "approved",
    helpfulCount: 9,
  },
  {
    id: "REV-103",
    productId: "decor-2",
    productName: "Étagère Murale 'الحمد لله رب العالمين'",
    productImage: "/decor-alhamdulillah-shelf.webp",
    customerName: "Meryem Alaoui",
    customerCity: "Rabat",
    rating: 5,
    title: "Laiton brossé et noyer massif sublime",
    comment:
      "Une pièce monumentale qui attire tous les regards. Le laiton doré brossé apporte une lumière chaleureuse magnifique à notre entrée.",
    date: "2026-10-02",
    status: "approved",
    helpfulCount: 21,
  },
  {
    id: "REV-104",
    productId: "decor-1",
    productName: "Tableau Ruche 'سبحان الله وبحمده'",
    productImage: "/decor-honeycomb-calligraphy.webp",
    customerName: "Hicham Bouziane",
    customerCity: "Tanger",
    rating: 5,
    title: "Finition or et marbre majestueuse",
    comment:
      "La calligraphie en relief dorée est spectaculaire. C'est la première chose que mes invités remarquent en entrant dans le salon. 10/10 !",
    date: "2026-10-01",
    status: "approved",
    helpfulCount: 11,
  },
  {
    id: "REV-105",
    productId: "4",
    productName: "Pouf Traditionnel en Cuir de Chèvre Cognac",
    productImage: "/images/products/prod-pouf.jpg",
    customerName: "Soukaina Tazi",
    customerCity: "Marrakech",
    rating: 4,
    title: "Beau cuir véritable et broderie sabra soignée",
    comment:
      "Cuir de belle tenue avec tannage naturel de Marrakech. Il sent bon le cuir véritable et les coutures sont bien renforcées. Je recommande vivement.",
    date: "2026-09-29",
    status: "approved",
    helpfulCount: 7,
  },
  {
    id: "REV-106",
    productId: "6",
    productName: "Miroir d'Arche Sculpté en Bois de Cèdre",
    productImage: "/images/products/prod-miroir.jpg",
    customerName: "Zineb Bennis",
    customerCity: "Meknès",
    rating: 5,
    title: "Parfum délicat de cèdre et travail d'artiste",
    comment:
      "Le cèdre embaume toute la pièce à son ouverture. L'arche sculptée au ciseau à bois est d'une élégance intemporelle.",
    date: "2026-09-27",
    status: "pending",
    helpfulCount: 3,
  },
];

export const INITIAL_ADMIN_VIDEOS: AdminTrendingVideo[] = [
  {
    id: "1",
    title: "L'effet des ombres sur le mur du salon le soir est juste magique !",
    author: "@marjad_officiel",
    customerName: "Salma K.",
    city: "Casablanca",
    views: "148k",
    likes: "18.5k",
    productId: "2",
    productName: "Lanterne en Cuivre Ciselé",
    category: "Luminaires & Cuivre",
    productSlug: "lanterne-marrakech-cuivre-cisele",
    productImage: "/images/products/prod-lanterne.jpg",
    price: "1 250 DH",
    thumbnail: "/images/products/prod-lanterne.jpg",
    videoUrl: "/pinterest_video.mp4",
    active: true,
    dateAdded: "2026-10-01",
  },
  {
    id: "2",
    title: "Reçu en 24h à Rabat. Laine d'une douceur exceptionnelle.",
    author: "@marjad_officiel",
    customerName: "Youssef & Rita",
    city: "Rabat",
    views: "220k",
    likes: "24.1k",
    productId: "1",
    productName: "Tapis Beni Ourain Atlas",
    category: "Tapis & Tissage",
    productSlug: "tapis-beni-ourain-atlas-royal",
    productImage: "/images/products/prod-tapis.jpg",
    price: "3 400 DH",
    thumbnail: "/images/products/prod-tapis.jpg",
    videoUrl: "/pinterest_video.mp4",
    active: true,
    dateAdded: "2026-10-02",
  },
  {
    id: "3",
    title: "Parfaitement emballée, le vert émeraude du zellige est splendide.",
    author: "@marjad_officiel",
    customerName: "Nadia M.",
    city: "Marrakech",
    views: "185k",
    likes: "19.8k",
    productId: "3",
    productName: "Table Ronde en Zellige",
    category: "Zellige & Mosaïque",
    productSlug: "table-ronde-zellige-fes-vert-emeraude",
    productImage: "/images/products/prod-zellige.jpg",
    price: "2 800 DH",
    thumbnail: "/images/products/prod-zellige.jpg",
    videoUrl: "/pinterest_video.mp4",
    active: true,
    dateAdded: "2026-10-03",
  },
  {
    id: "4",
    title: "Deuxième commande chez Marjad, la qualité du cuir est irréprochable.",
    author: "@marjad_officiel",
    customerName: "Mehdi B.",
    city: "Tanger",
    views: "95k",
    likes: "11.2k",
    productId: "4",
    productName: "Poufs en Cuir Cognac",
    category: "Maroquinerie & Cuir",
    productSlug: "pouf-cuir-naturel-marrakech-cognac",
    productImage: "/images/products/prod-pouf.jpg",
    price: "420 DH",
    thumbnail: "/images/products/prod-pouf.jpg",
    videoUrl: "/pinterest_video.mp4",
    active: true,
    dateAdded: "2026-10-04",
  },
  {
    id: "5",
    title: "Une véritable œuvre d'art sur ma console d'entrée.",
    author: "@marjad_officiel",
    customerName: "Houda L.",
    city: "Fès",
    views: "110k",
    likes: "14.6k",
    productId: "5",
    productName: "Vase Céramique Bleu de Fès",
    category: "Poterie & Céramique",
    productSlug: "vase-ceramique-bleu-fes",
    productImage: "/images/products/prod-vase.jpg",
    price: "380 DH",
    thumbnail: "/images/products/prod-vase.jpg",
    videoUrl: "/pinterest_video.mp4",
    active: true,
    dateAdded: "2026-10-05",
  },
  {
    id: "6",
    title: "L'odeur naturelle du cèdre et la finesse de la sculpture, j'adore.",
    author: "@marjad_officiel",
    customerName: "Karim E.",
    city: "Agadir",
    views: "134k",
    likes: "16.3k",
    productId: "6",
    productName: "Miroir d'Arche en Cèdre",
    category: "Bois Sculpté & Cèdre",
    productSlug: "miroir-arche-cedre",
    productImage: "/images/products/prod-miroir.jpg",
    price: "890 DH",
    thumbnail: "/images/products/prod-miroir.jpg",
    videoUrl: "/pinterest_video.mp4",
    active: true,
    dateAdded: "2026-10-06",
  },
];

export function addAdminNotification(notif: {
  title: string;
  desc: string;
  type?: string;
  href?: string;
}) {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem("marjad_admin_notifications");
    const list = stored ? JSON.parse(stored) : [];
    list.unshift({
      id: `notif-${Date.now()}`,
      time: "À l'instant",
      ...notif,
    });
    localStorage.setItem("marjad_admin_notifications", JSON.stringify(list.slice(0, 20)));
    window.dispatchEvent(new Event("marjad_notifications_updated"));
  } catch {
    // fallback
  }
}
