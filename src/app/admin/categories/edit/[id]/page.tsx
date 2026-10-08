import React, { Suspense } from "react";
import { CategoryFormPage } from "@/components/admin/CategoryFormPage";

export const metadata = {
  title: "Modifier la Collection | Admin MARJAD",
};

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryAdminPage({ params }: EditCategoryPageProps) {
  const resolvedParams = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-8 flex items-center justify-center text-xs text-neutral-400">
          Chargement de la collection...
        </div>
      }
    >
      <CategoryFormPage mode="edit" categoryId={resolvedParams.id} />
    </Suspense>
  );
}
