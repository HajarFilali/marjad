"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

const ADMIN_EMAIL = "contact.marjad@gmail.com";
const ADMIN_PASSWORD = "admin123@";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage("Veuillez renseigner votre email et mot de passe administrateur.");
      return;
    }

    if (cleanEmail !== ADMIN_EMAIL.toLowerCase() || cleanPassword !== ADMIN_PASSWORD) {
      setErrorMessage("Identifiants incorrects. Veuillez vérifier votre adresse email et votre mot de passe.");
      return;
    }

    setIsLoading(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("marjad_admin_auth", "true");
      localStorage.setItem("marjad_admin_email", ADMIN_EMAIL);
      document.cookie = "marjad_admin_auth=true; path=/; max-age=86400";
    }

    // Redirection directe vers le tableau de bord admin sans page intermédiaire
    router.replace("/admin");
  };

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden relative flex items-center justify-center select-none bg-white p-4 sm:p-6 lg:p-10">
      
      {/* Styles de protection anti-autofill pour garantir un fond blanc pur sans cassure de couleur */}
      <style dangerouslySetInnerHTML={{ __html: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
          -webkit-text-fill-color: #1c1917 !important;
          box-shadow: 0 0 0 1000px #ffffff inset !important;
          caret-color: #1c1917 !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}} />

      {/* Conteneur principal 2 colonnes (Partie Left: Formulaire | Partie Right: Photo Tableaux avec Cadre Viseur) */}
      <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 relative z-10">
        
        {/* ================= LA PARTIE LEFT : CARTE FORMULAIRE AVEC BORDER ET SHADOW ================= */}
        <div className="w-full sm:w-[420px] lg:w-[440px] bg-white rounded-3xl border border-[#ebd8be] shadow-[0_20px_60px_-15px_rgba(28,25,23,0.08)] p-8 sm:p-10 flex flex-col justify-between shrink-0">
          
          {/* Logo officiel MARJAD agrandi pour une présence majestueuse */}
          <div className="flex justify-center pt-2 mb-2">
            <Image
              src="/logo.png"
              alt="MARJAD - Sélection artisanale"
              width={185}
              height={50}
              priority
              className="h-11 sm:h-12 w-auto object-contain"
            />
          </div>

          {/* Description allongée sur exactement 2 lignes (Titre 'Connexion MARJAD' retiré comme demandé) */}
          <div className="text-center mb-6">
            <p className="text-xs text-[#78716c] font-medium leading-relaxed max-w-[340px] mx-auto">
              Espace d&apos;accès sécurisé réservé aux gestionnaires de la Maison pour le suivi et la gestion exclusive de l&apos;artisanat d&apos;art.
            </p>
          </div>

          {/* Formulaire Admin */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Alerte d'erreur si identifiants incorrects */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2 shadow-2xs">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Champ Email avec Label encastré en marron (#ba4e1a) sur le border */}
            <div className="relative group">
              <label className="absolute -top-2.5 left-4 z-10 bg-white px-2 py-0.5 text-xs font-bold text-[#ba4e1a] pointer-events-none tracking-wide leading-none select-none">
                Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-stone-400 group-focus-within:text-[#ba4e1a] transition-colors pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact.marjad@gmail.com"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white border border-[#ebd8be] focus:border-[#ba4e1a] focus:ring-2 focus:ring-[#ba4e1a]/20 text-xs sm:text-sm text-[#1c1917] placeholder:text-stone-300 font-medium transition-all outline-none"
                />
              </div>
            </div>

            {/* Champ Mot de Passe avec Label encastré en marron (#ba4e1a) sur le border */}
            <div className="relative group">
              <label className="absolute -top-2.5 left-4 z-10 bg-white px-2 py-0.5 text-xs font-bold text-[#ba4e1a] pointer-events-none tracking-wide leading-none select-none">
                Mot de passe
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-stone-400 group-focus-within:text-[#ba4e1a] transition-colors pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3.5 rounded-xl bg-white border border-[#ebd8be] focus:border-[#ba4e1a] focus:ring-2 focus:ring-[#ba4e1a]/20 text-xs sm:text-sm text-[#1c1917] placeholder:text-stone-300 font-medium transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 p-1 text-stone-400 hover:text-[#ba4e1a] transition-colors cursor-pointer"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox Mémoriser cette session */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#ebd8be] text-[#ba4e1a] focus:ring-[#ba4e1a] cursor-pointer accent-[#ba4e1a]"
                />
                <span className="text-xs text-[#78716c] font-medium hover:text-[#1c1917] transition-colors">
                  Mémoriser cette session
                </span>
              </label>
            </div>

            {/* Bouton Se connecter stylisé premium avec dégradé chaud et relief doré */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative overflow-hidden w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ba4e1a] via-[#c4622d] to-[#9c3a0c] hover:from-[#9c3a0c] hover:via-[#ba4e1a] hover:to-[#822f08] text-white font-bold text-xs sm:text-sm uppercase tracking-[0.16em] transition-all duration-300 shadow-lg shadow-[#ba4e1a]/25 hover:shadow-xl hover:shadow-[#ba4e1a]/35 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2.5 border border-white/20 disabled:opacity-75"
              >
                {/* Effet shimmer lumineux */}
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none animate-cta-shimmer" />

                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="pt-1" />
        </div>

        {/* ================= LA PARTIE RIGHT : PHOTO TABLEAUX FOURNIE PAR LE CLIENT (SANS FOND SOMBRE) ================= */}
        {/* Le fond sombre a été complètement retiré conformément à la demande du client ("had bg dark hiydha") */}
        <div className="hidden lg:flex w-[420px] lg:w-[460px] h-[580px] relative items-center justify-center shrink-0 group">
          
          {/* Les 4 repères d'angles architecturaux marron (#6d381e) qui encadrent élégamment la photo sur fond blanc */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-[#6d381e] pointer-events-none transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-[#6d381e] pointer-events-none transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-[#6d381e] pointer-events-none transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-[#6d381e] pointer-events-none transition-transform duration-300 group-hover:scale-105" />

          {/* Wrapper de la photo avec coins arrondis, bordure dorée chaleureuse et ombre douce */}
          <div className="relative w-[calc(100%-22px)] h-[calc(100%-22px)] rounded-3xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(109,56,30,0.12)] border border-[#ebd8be]">
            <Image
              src="/images/login-tableau.jpg"
              alt="Tableaux Calligraphie Bois & Dorure - MARJAD Artisanat"
              fill
              priority
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          </div>

        </div>

      </div>

    </div>
  );
}
