export interface Product {
  id: string | number;
  slug: string;
  name: string;
  nameAr?: string;
  category: string;
  categorySlug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  artisan?: {
    name: string;
    city: string;
    craft: string;
  };
  details?: {
    dimensions?: string;
    dimensionsList?: string[];
    material?: string;
    origin?: string;
    technique?: string;
  };
  colors?: ProductColor[];
  imageVariants?: ProductImageVariant[];
  tags?: string[];
}

export interface ProductColor {
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
}

export interface ProductImageVariant {
  id: string;
  url: string;
  dimensions?: string;
  colorName?: string;
  colorHex?: string;
  bgHex?: string;
  accentHex?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameAr?: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Review {
  id: string;
  author: string;
  city?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}
