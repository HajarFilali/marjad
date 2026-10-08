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
    material?: string;
    origin?: string;
    technique?: string;
  };
  tags?: string[];
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
