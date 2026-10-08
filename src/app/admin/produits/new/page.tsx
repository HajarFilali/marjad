import React, { Suspense } from "react";
import { ProductFormPage } from "@/components/admin/ProductFormPage";

export const metadata = {
  title: "Ajouter une Création | Admin MARJAD",
};

export default function NewProductAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-8 flex items-center justify-center text-xs text-neutral-400">
          Chargement du formulaire de création...
        </div>
      }
    >
      <ProductFormPage mode="create" />
    </Suspense>
  );
}
