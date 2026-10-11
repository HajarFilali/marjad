import React, { Suspense } from "react";
import { CategoryFormPage } from "@/components/admin/CategoryFormPage";

export const metadata = {
  title: "Nouvelle Catégorie | Admin MARJAD",
};

export default function NewCategoryAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-8 flex items-center justify-center text-xs text-neutral-400">
          Chargement du formulaire...
        </div>
      }
    >
      <CategoryFormPage mode="create" />
    </Suspense>
  );
}
