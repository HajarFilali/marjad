import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, ALL_PRODUCTS } from "@/data/mockProducts";
import { ProductDetailView } from "@/components/product/ProductDetailView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Pièce introuvable | MARJAD",
      description: "La pièce artisanale demandée n'a pas été trouvée.",
    };
  }

  return {
    title: `${product.name} | MARJAD Artisanat Marocain`,
    description: product.description,
    openGraph: {
      title: `${product.name} | MARJAD`,
      description: product.description,
      images: [
        {
          url: product.images[0] || "/logo.png",
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
