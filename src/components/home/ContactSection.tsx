"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  User,
  Volume2,
  VolumeX,
  ArrowRight,
  Sparkles,
  Share2,
  Check,
  Ruler,
  Clock,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

export function ContactSection() {
  const [liked, setLiked] = useState<boolean>(true);
  const [likeCount, setLikeCount] = useState<number>(37);
  const [saved, setSaved] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showTag, setShowTag] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const toggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  return (
    <section
      id="atelier-sur-mesure"
      className="relative w-full bg-[#ffffff] py-10 sm:py-14 lg:py-18 overflow-hidden border-none"
    >
      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* ========================================================================= */}
        {/* LAYOUT SPLIT : GAUCHE (~68% VISUEL SALON) + DROITE (~32% TEXTE CONCIS)    */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10 xl:gap-14">
          
          {/* ----------------------------------------------------------------------- */}
          {/* PARTIE GAUCHE (LEFT) : ~68% LARGEUR AVEC SALON & POST INSTAGRAM         */}
          {/* Le post cadre les tableaux et s'arrête net aux vases sur la table       */}
          {/* ----------------------------------------------------------------------- */}
          <div className="w-full lg:w-[66%] xl:w-[68%] shrink-0">
            <div className="relative w-full aspect-[16/10.5] sm:aspect-[16/10] rounded-[24px] sm:rounded-[32px] overflow-hidden border border-neutral-200/90 shadow-[0_16px_45px_rgba(0,0,0,0.1)] flex items-center justify-center bg-[#181412] select-none">
              
              {/* 1. Image de fond : salon marocain clean en mode cover */}
              <Image
                src="/salon-marocain-clean.webp"
                alt="Salon Marocain d'Exception MARJAD"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 68vw"
                className="object-cover object-center pointer-events-none"
              />

              {/* 2. Cadre Instagram interactif : s'arrête exactement au niveau des vases */}
              <div className="relative z-10 w-[84%] sm:w-[62%] md:w-[52%] lg:w-[46%] xl:w-[42%] max-w-[410px] -translate-y-4 sm:-translate-y-5 lg:-translate-y-7">
                <div className="w-full rounded-[18px] sm:rounded-[22px] shadow-[0_12px_40px_rgba(0,0,0,0.35),0_4px_12px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col border-[2px] border-white bg-transparent">
                  
                  {/* HEADER DU POST INSTAGRAM (BLANC) */}
                  <div className="flex items-center justify-between px-3 sm:px-3.5 py-1.5 sm:py-2 bg-white border-b border-neutral-100 shrink-0">
                    <div className="flex items-center gap-2">
                      {/* Photo de profil : Fond marron (#b85822) avec Rosette MARJAD */}
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#b85822] p-1 flex items-center justify-center shrink-0 shadow-xs border border-[#a04818]/20">
                        <Image
                          src="/moroccan-logo-symbol.png"
                          alt="MARJAD"
                          width={20}
                          height={20}
                          className="w-full h-full object-contain brightness-110 drop-shadow-xs"
                        />
                      </div>

                      {/* Titre & Musique */}
                      <div className="flex flex-col">
                        <span className="text-[11.5px] sm:text-[12.5px] font-bold text-[#000000] tracking-tight leading-tight">
                          MARJAD
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-[#262626] font-normal leading-tight mt-0.5 flex items-center gap-1">
                          <span>♫</span>
                          <span>Nass El Ghiwane · Essiniya</span>
                        </span>
                      </div>
                    </div>

                    {/* Menu 3 points (•••) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowMenu((prev) => !prev)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[#262626] hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
                        aria-label="Options"
                      >
                        <MoreHorizontal className="w-4 h-4 text-black" />
                      </button>

                      {/* Dropdown Menu Rapide */}
                      {showMenu && (
                        <div className="absolute right-0 top-7 w-44 bg-white rounded-xl shadow-xl border border-neutral-200/80 py-1.5 z-30 text-xs text-[#1c1917] font-medium">
                          <Link
                            href="/contact"
                            className="flex items-center gap-2 px-3 py-1.5 hover:bg-neutral-100 transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#c4622d]" />
                            <span>Commander ce modèle</span>
                          </Link>
                          <button
                            type="button"
                            onClick={handleShare}
                            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-neutral-100 transition-colors text-left cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5 text-neutral-600" />
                            <span>{copiedLink ? "Lien copié !" : "Partager"}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* FENÊTRE CENTRALE 100% TRANSPARENTE (S'ARRÊTE AUX VASES DE LA TABLE) */}
                  <div className="relative w-full aspect-[4/3.55] bg-transparent flex items-center justify-center select-none">
                    
                    {/* TEXTE ARQUÉ "Tableaux muraux" placé directement sous les tableaux */}
                    <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[86%] max-w-[350px] pointer-events-none select-none z-10">
                      <svg
                        viewBox="0 0 520 140"
                        className="w-full h-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
                        style={{ overflow: "visible" }}
                      >
                        <defs>
                          <linearGradient id="goldGradientTableauxSplit" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#fff9ee" />
                            <stop offset="35%" stopColor="#f8e7cb" />
                            <stop offset="100%" stopColor="#cfab6c" />
                          </linearGradient>

                          <filter id="shadow3dTableauxSplit" x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="0" dy="2.5" stdDeviation="3" floodColor="#000000" floodOpacity="0.85" />
                            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.55" />
                          </filter>

                          <path
                            id="arcTableauxSplitPath"
                            d="M 20,112 Q 260,8 500,112"
                            fill="none"
                          />
                        </defs>

                        <text
                          fill="url(#goldGradientTableauxSplit)"
                          filter="url(#shadow3dTableauxSplit)"
                          style={{
                            fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif',
                            fontSize: "48px",
                            fontWeight: 900,
                            letterSpacing: "0.025em",
                          }}
                        >
                          <textPath
                            href="#arcTableauxSplitPath"
                            startOffset="50%"
                            textAnchor="middle"
                          >
                            Tableaux muraux
                          </textPath>
                        </text>
                      </svg>
                    </div>

                    {/* Icône Tag Personne (En bas à gauche, juste au-dessus des vases) */}
                    <div className="absolute bottom-2 left-2 z-20">
                      <button
                        type="button"
                        onClick={() => setShowTag((prev) => !prev)}
                        className="w-6.5 h-6.5 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-xs flex items-center justify-center text-white transition-transform active:scale-90 cursor-pointer shadow-md"
                        aria-label="Afficher les tags"
                      >
                        <User className="w-3 h-3 fill-white text-white" />
                      </button>

                      {showTag && (
                        <div className="absolute left-0 bottom-7 bg-black/85 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-1 rounded-lg shadow-xl whitespace-nowrap border border-white/15 animate-in fade-in zoom-in-95 duration-200">
                          <span>Tableaux Calligraphie Bois &amp; LED · MARJAD</span>
                        </div>
                      )}
                    </div>

                    {/* Icône Haut-Parleur / Audio (En bas à droite) */}
                    <div className="absolute bottom-2 right-2 z-20">
                      <button
                        type="button"
                        onClick={() => setIsMuted((prev) => !prev)}
                        className="w-6.5 h-6.5 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-xs flex items-center justify-center text-white transition-transform active:scale-90 cursor-pointer shadow-md"
                        aria-label={isMuted ? "Activer le son" : "Couper le son"}
                      >
                        {isMuted ? (
                          <VolumeX className="w-3 h-3 text-white" />
                        ) : (
                          <Volume2 className="w-3 h-3 text-white" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* FOOTER DU POST : ACTIONS INSTAGRAM (BLANC) */}
                  <div className="flex items-center justify-between px-3 sm:px-3.5 py-1.5 sm:py-2 bg-white border-t border-neutral-100 shrink-0">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      {/* 1. Like */}
                      <button
                        type="button"
                        onClick={toggleLike}
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#000000] hover:opacity-85 transition-opacity cursor-pointer group"
                        aria-label="J'aime"
                      >
                        <Heart
                          className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-active:scale-125 ${
                            liked
                              ? "fill-[#ed4956] text-[#ed4956]"
                              : "text-[#262626] hover:text-[#ed4956]"
                          }`}
                        />
                        <span className="font-bold text-[11px] sm:text-xs text-black">{likeCount}</span>
                      </button>

                      {/* 2. Commentaire */}
                      <Link
                        href="/contact"
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#000000] hover:opacity-85 transition-opacity cursor-pointer group"
                        aria-label="Commentaires"
                      >
                        <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#000000] -scale-x-100 group-hover:text-[#c4622d] transition-colors" />
                        <span className="font-bold text-[11px] sm:text-xs text-black">4</span>
                      </Link>

                      {/* 3. Repost */}
                      <button
                        type="button"
                        onClick={handleShare}
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#000000] hover:opacity-85 transition-opacity cursor-pointer group"
                        aria-label="Republier"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#000000] group-hover:text-[#c4622d] transition-colors"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 1l4 4-4 4" />
                          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                          <path d="M7 23l-4-4 4-4" />
                          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                        </svg>
                        <span className="font-bold text-[11px] sm:text-xs text-black">2</span>
                      </button>

                      {/* 4. Envoi / Partager */}
                      <button
                        type="button"
                        onClick={handleShare}
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#000000] hover:opacity-85 transition-opacity cursor-pointer group"
                        aria-label="Envoyer"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#000000] group-hover:text-[#c4622d] transition-colors -rotate-12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        <span className="font-bold text-[11px] sm:text-xs text-black">{copiedLink ? <Check className="w-3 h-3 text-emerald-600 inline" /> : 5}</span>
                      </button>
                    </div>

                    {/* Bookmark */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setSaved((prev) => !prev)}
                        className="w-5 h-5 flex items-center justify-center text-[#000000] hover:opacity-85 active:scale-90 transition-all cursor-pointer"
                        aria-label="Enregistrer"
                      >
                        <Bookmark
                          className={`w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2] ${
                            saved ? "fill-[#000000] text-[#000000]" : "text-[#000000]"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* PARTIE DROITE (RIGHT) : TEXTE ÉPURÉ NE DÉPASSANT PAS LA HAUTEUR GAUCHE   */}
          {/* ----------------------------------------------------------------------- */}
          <div className="w-full lg:w-[34%] xl:w-[32%] flex flex-col justify-center text-left py-2 lg:py-6">
            
            {/* 1. Pill Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c4622d]/10 border border-[#c4622d]/20 text-[#9a4316] text-[11px] font-bold uppercase tracking-wider mb-3.5 self-start">
              <Ruler className="w-3.5 h-3.5 text-[#c4622d]" />
              <span>Confection Sur-Mesure</span>
            </div>

            {/* 2. Titre Principal Concis */}
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-serif font-black text-[#1c1917] tracking-tight leading-[1.2] mb-3">
              Donnons Vie à <span className="text-[#c4622d]">Vos Projets</span>
            </h2>

            {/* 3. Description Courte (2 phrases max) */}
            <p className="text-[#57534e] text-sm sm:text-[15px] leading-relaxed font-normal mb-5 max-w-md">
              Commandez ces Tableaux Muraux rétro-éclairés ou confiez à nos maîtres artisans la confection personnalisée de votre salon marocain d&apos;exception.
            </p>

            {/* 4. Bouton Principal */}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#c4622d] hover:bg-[#a8471b] text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 group whitespace-nowrap cursor-pointer mb-3.5 self-start"
            >
              <span>Contacter l&apos;Atelier &amp; Devis</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* 5. Garantie Réponse */}
            <div className="flex items-center gap-2 text-xs text-[#78716c] font-medium">
              <Clock className="w-3.5 h-3.5 text-[#c4622d]" />
              <span>Réponse garantie sous 2h ouvrées</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

