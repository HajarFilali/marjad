"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  Target,
  Activity,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
  Zap,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function AdminPixelPage() {
  const [pixelId, setPixelId] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("marjad_meta_pixel_settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setPixelId(parsed.pixelId || "");
          setEnabled(parsed.enabled !== undefined ? Boolean(parsed.enabled) : true);
        }
      }
    } catch (err) {
      console.warn("Error loading pixel settings:", err);
    }
  }, []);

  const handleSave = () => {
    const trimmedId = pixelId.trim();

    // Validation: if provided, Pixel ID must be numeric digits
    if (trimmedId && !/^\d+$/.test(trimmedId)) {
      setErrorMsg("Identifiant Meta Pixel invalide. Le Pixel ID doit contenir uniquement des chiffres (ex: 123456789012345).");
      showToast("Veuillez corriger le format du Pixel ID.", "error");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");

    try {
      const payload = {
        pixelId: trimmedId,
        enabled: Boolean(enabled),
      };

      localStorage.setItem("marjad_meta_pixel_settings", JSON.stringify(payload));
      window.dispatchEvent(new Event("marjad_pixel_updated"));

      showToast("Paramètres Meta Pixel enregistrés avec succès !", "success");
    } catch {
      showToast("Erreur lors de l'enregistrement des paramètres.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestPixel = () => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      try {
        (window as any).fbq("track", "PageView");
        showToast("Événement test Meta Pixel (PageView) envoyé avec succès !", "success");
      } catch {
        showToast("Erreur lors de l'envoi de l'événement test.", "error");
      }
    } else {
      showToast(
        "Meta Pixel non actif sur cette page. Enregistrez un Pixel ID valide pour le tester sur la boutique.",
        "info"
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-5 max-w-[1680px] w-full mx-auto pb-12 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-bold transition-all duration-300 animate-in slide-in-from-bottom-3 ${
            toast.type === "success"
              ? "bg-[#1F2937] text-white border-emerald-500/50"
              : toast.type === "error"
              ? "bg-rose-900 text-white border-rose-500"
              : "bg-[#6d381e] text-white border-[#E9DCD5]/30"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Admin Unified Header */}
      <AdminHeader
        title="Configuration Meta Pixel"
        subtitle={
          <span className="inline-flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#ba4e1a] shrink-0" />
            <span>Gérez et modifiez dynamiquement le Pixel ID de votre Meta Pixel en temps réel.</span>
          </span>
        }
      />

      {/* Main Settings Card & Actions */}
      <div className="space-y-3.5 sm:space-y-4">
        {/* Div 1: Paramètres principaux (paddings réduits) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E9DCD5] shadow-xs space-y-4">
          {/* Section 1: Enable / Disable Toggle Switch */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#EDE5E0] pb-3.5 sm:pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                  enabled
                    ? "bg-[#6d381e]/10 text-[#6d381e] border-[#6d381e]/20"
                    : "bg-stone-100 text-stone-400 border-stone-200"
                }`}
              >
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#1F2937]">
                    Statut du Meta Pixel sur la boutique
                  </h3>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-sans font-bold border ${
                      enabled
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-stone-100 text-stone-500 border-stone-200"
                    }`}
                  >
                    {enabled ? "Activé (Enabled)" : "Désactivé (Disabled)"}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Lorsque le suivi est activé, le script Meta Pixel est automatiquement chargé sur le site public de Marjad.
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6.5 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                enabled ? "bg-[#6d381e]" : "bg-stone-300"
              }`}
            >
              <span className="sr-only">Activer/Désactiver Meta Pixel</span>
              <span
                className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  enabled ? "translate-x-5.5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Section 2: Meta Pixel ID Input */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1F2937] uppercase tracking-wider">
                Identifiant Meta Pixel (Pixel ID)
              </label>
              <input
                type="text"
                value={pixelId}
                onChange={(e) => {
                  setPixelId(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                placeholder="Exemple: 123456789012345"
                className={`w-full bg-[#FAF7F2] border ${
                  errorMsg ? "border-rose-500 ring-2 ring-rose-500/20" : "border-[#E9DCD5]"
                } focus:border-[#6d381e] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1F2937] placeholder-stone-400 font-mono transition outline-none shadow-2xs`}
              />
              {errorMsg && (
                <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </p>
              )}
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Insérez uniquement votre Pixel ID numérique officiel (ex: 123456789012345).
              </p>
            </div>

            {/* Information Card */}
            <div className="bg-[#FAF7F2] p-3.5 sm:p-4 rounded-xl border border-[#E9DCD5] space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-[#6d381e] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#ba4e1a]" />
                  <span>Où trouver votre Pixel ID Meta ?</span>
                </h4>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Rendez-vous sur votre Meta Events Manager &gt; Source de données pour copier votre Pixel ID et le coller ici à tout moment pour suivre vos conversions et événements e-commerce.
                </p>
              </div>

              <div className="pt-1">
                <a
                  href="https://eventsmanager.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#ba4e1a] hover:underline cursor-pointer"
                >
                  <span>Ouvrir Meta Events Manager</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Div 2: Bottom Action Buttons (paddings réduits) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-[#E9DCD5] shadow-2xs">
          <button
            type="button"
            onClick={handleTestPixel}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#6d381e]/10 border border-[#E9DCD5] text-[#6d381e] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Zap className="w-4 h-4 text-[#ba4e1a]" />
            <span>Tester l&apos;événement PageView</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#6d381e] hover:bg-[#542a15] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#6d381e]/20 disabled:opacity-50 min-w-[190px]"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Enregistrement..." : "Enregistrer les modifications"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
