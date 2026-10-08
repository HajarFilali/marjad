import React, { Suspense } from "react";
import { ProductFormPage } from "@/components/admin/ProductFormPage";

export const metadata = {
  title: "Modifier la Pièce | Admin MARJAD",
};

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductAdminPage({ params }: EditProductPageProps) {
  const resolvedParams = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-8 flex items-center justify-center text-xs text-neutral-400">
          Chargement de la pièce...
        </div>
      }
    >
      <ProductFormPage mode="edit" productId={resolvedParams.id} />
    </Suspense>
  );
}
