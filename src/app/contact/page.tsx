"use client";

import React, { useState } from "react";
import {
  Send,
  Check,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Copy,
  Ruler,
  Truck,
  Building2,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  PackageCheck,
  RotateCcw,
  Compass,
} from "lucide-react";
import { CustomSelect } from "@/components/ui/CustomSelect";

type ContactSubject = "sur-mesure" | "suivi" | "b2b" | "general";

interface SubjectOption {
  id: ContactSubject;
  label: string;
  badge: string;
  icon: React.ElementType;
  placeholder: string;
}

const SUBJECT_OPTIONS: SubjectOption[] = [
  {
    id: "sur-mesure",
    label: "Création Sur-Mesure",
    badge: "Personnalisation",
    icon: Ruler,
    placeholder:
      "Ex : Bonjour, je souhaite faire réaliser une console murale ou un miroir aux dimensions spécifiques (ex: 120 x 45 cm). Pourriez-vous m'indiquer le délai de fabrication et le tarif ?",
  },
  {
    id: "suivi",
    label: "Suivi & Livraison",
    badge: "Commandes",
    icon: Truck,
    placeholder:
      "Ex : Bonjour, j'ai passé commande pour une création artisanale à Casablanca. Quel est le créneau estimé de livraison du transporteur ?",
  },
  {
    id: "b2b",
    label: "Architecte & Riad",
    badge: "Projets Pro",
    icon: Building2,
    placeholder:
      "Ex : Nous décorons un riad de charme / boutique-hôtel à Marrakech. Nous souhaitons commander un ensemble de pièces murales et luminaires en bois noble sculpté...",
  },
  {
    id: "general",
    label: "Conseil & Entretien",
    badge: "Information",
    icon: HelpCircle,
    placeholder:
      "Ex : Bonjour, pouvez-vous me préciser les conseils d'entretien pour le bois de cèdre et les fixations recommandées pour les murs en plâtre ou brique ?",
  },
];

const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Tétouan",
  "Kénitra",
  "Autre / International",
];

const MINI_FAQS = [
  {
    q: "Quels sont les délais pour une confection sur-mesure ?",
    a: "Nos créations personnalisées nécessitent entre 7 et 18 jours selon la complexité de la sculpture sur bois ou du travail de ciselure.",
  },
  {
    q: "Le paiement à la livraison (Cash on Delivery) est-il accepté ?",
    a: "Oui, absolument ! Vous réglez directement auprès du livreur à la réception de votre colis partout au Maroc.",
  },
  {
    q: "Proposez-vous des visites d'atelier ou du showroom ?",
    a: "Nos maîtres artisans vous accueillent sur rendez-vous à Sidi Ghanem (Marrakech) et au cœur de la Médina de Fès.",
  },
  {
    q: "Comment se déroule la livraison pour les pièces délicates (miroirs, sculptures) ?",
    a: "Chaque pièce est emballée sous caisson protecteur haute densité renforcé avec coins amortisseurs pour garantir une arrivée impeccable.",
  },
  {
    q: "Quelle est votre politique de retours et d'échanges ?",
    a: "Vous bénéficiez d'une garantie sérénité de 7 jours après réception. Si la pièce ne convient pas, notre transporteur organise la récupération directement à votre domicile pour un échange ou un remboursement complet.",
  },
];

export default function ContactPage() {
  const [selectedSubject, setSelectedSubject] = useState<ContactSubject>("sur-mesure");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Casablanca",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const currentOption = SUBJECT_OPTIONS.find((s) => s.id === selectedSubject) || SUBJECT_OPTIONS[0];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@marjad.ma");
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 700);
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setFormData({
      name: "",
      phone: "",
      email: "",
      city: "Casablanca",
      message: "",
    });
  };

  const whatsappUrl = `https://wa.me/212661000000?text=${encodeURIComponent(
    `Bonjour MARJAD, je vous contacte concernant : ${currentOption.label}.`
  )}`;

  return (
    <div className="bg-white text-[#1c1917] pt-32 sm:pt-[132px] pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= EN-TÊTE ÉPURÉ & PROFESSIONNEL (SANS FIL D'ARIANE) ================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ba4e1a]/8 border border-[#ba4e1a]/20 text-[#ba4e1a] text-xs font-bold uppercase tracking-wider mb-3.5 shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-[#ba4e1a]" />
            <span>Conciergerie & Ateliers MARJAD</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-black text-[#1c1917] tracking-tight leading-[1.18]">
            À votre écoute pour donner vie à vos projets
          </h1>

          <p className="mt-3.5 text-sm sm:text-base text-[#1c1917]/70 max-w-2xl mx-auto font-medium leading-relaxed">
            Pour une confection sur-mesure, des conseils d&apos;aménagement ou le suivi attentif de votre commande, nos maîtres artisans et conseillers déco vous répondent avec soin.
          </p>
        </div>

        {/* ================= GRILLE PRINCIPALE (2 COLONNES HARMONIEUSES) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ================= GAUCHE (5 COLONNES) : WHATSAPP, COORDONNÉES & ATELIERS ================= */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* VIP WhatsApp Card */}
            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-[#1c1917] text-white shadow-lg border border-[#2e2a27]">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>En ligne à l&apos;atelier</span>
                </div>
                <span className="text-xs text-stone-400">Réponse &lt; 15 min</span>
              </div>

              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white leading-snug">
                    Conseil Instantané sur WhatsApp
                  </h3>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                    Envoyez photos de votre mur, croquis ou dimensions. Nos artisans vous guident en direct.
                  </p>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <span>Discuter avec un Artisan</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Direct Contact Coordinates Card */}
            <div className="rounded-3xl p-6 sm:p-7 bg-white border border-[#ebd8be] shadow-xs space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#ba4e1a]">
                Coordonnées Directes
              </h4>

              {/* Phone */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-[#faf6f0] border border-[#ebd8be] text-[#ba4e1a] flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#ba4e1a] group-hover:text-white">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#78716c] font-semibold">Téléphone & Atelier</div>
                  <a
                    href="tel:+212524332211"
                    className="text-sm font-bold text-[#1c1917] hover:text-[#ba4e1a] transition-colors"
                  >
                    +212 (0) 5 24 33 22 11
                  </a>
                  <div className="text-xs text-[#78716c] mt-0.5">Lun – Sam : 09h00 – 19h30</div>
                </div>
              </div>

              {/* Email with copy button */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-[#faf6f0] border border-[#ebd8be] text-[#ba4e1a] flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#ba4e1a] group-hover:text-white">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-[#78716c] font-semibold">Email Conciergerie</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-bold text-[#1c1917] truncate">contact@marjad.ma</span>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="px-2 py-0.5 rounded-md bg-[#faf8f5] hover:bg-[#ebd8be]/40 border border-[#ebd8be] text-[10px] font-bold text-[#1c1917] transition-all cursor-pointer flex items-center gap-1 shrink-0"
                      title="Copier l'adresse email"
                    >
                      {emailCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#78716c]" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-xs text-[#78716c] mt-0.5">Réponse garantie sous 2h ouvrées</div>
                </div>
              </div>

              {/* Showroom & Ateliers */}
              <div className="flex items-start gap-3.5 group pt-3 border-t border-[#ebd8be]/50">
                <div className="w-10 h-10 rounded-xl bg-[#faf6f0] border border-[#ebd8be] text-[#1c1917] flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#1c1917] group-hover:text-white">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#78716c] font-semibold">Nos Ateliers & Showroom</div>
                  <div className="text-xs text-[#1c1917] font-medium leading-relaxed mt-1">
                    <strong>Marrakech :</strong> Sidi Ghanem, Voie Principale <br />
                    <strong>Fès :</strong> Derb El Miter, Médina Historique (Spécialité Zellige & Bois)
                  </div>
                  <div className="text-[11px] text-[#ba4e1a] font-semibold mt-1">
                    Visites & retraits sur rendez-vous
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Engagements de Service (Grille 2x2) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ebd8be] shadow-2xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#ebd8be] text-[#ba4e1a] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1c1917]">Réactivité</div>
                  <div className="text-[11px] text-[#78716c]">Sous 2h ouvrées</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ebd8be] shadow-2xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#ebd8be] text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1c1917]">Paiement COD</div>
                  <div className="text-[11px] text-[#78716c]">À la livraison</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ebd8be] shadow-2xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#ebd8be] text-[#ba4e1a] flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1c1917]">Livraison Offerte</div>
                  <div className="text-[11px] text-[#78716c]">Dès 800 MAD</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ebd8be] shadow-2xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#ebd8be] text-amber-700 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1c1917]">Garantie 7j</div>
                  <div className="text-[11px] text-[#78716c]">Échange serein</div>
                </div>
              </div>
            </div>

          </div>

          {/* ================= DROITE (7 COLONNES) : FORMULAIRE & FAQ ================= */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl p-6 sm:p-8 lg:p-9 bg-white border border-[#ebd8be] shadow-xs relative">
              
              {isSuccess ? (
                /* Success View */
                <div className="py-12 px-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center border-2 border-emerald-200 shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1917]">
                    Choukrane, {formData.name} !
                  </h3>
                  <p className="text-sm text-[#1c1917]/70 max-w-md mx-auto leading-relaxed">
                    Votre demande concernant <strong>{currentOption.label}</strong> a bien été transmise à notre atelier. Un conseiller dédié vous recontactera sous 2 heures ouvrées par téléphone ou WhatsApp.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-6 py-3 rounded-xl bg-[#ba4e1a] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#9c3a0c] transition-colors shadow-md cursor-pointer"
                    >
                      Envoyer une autre demande
                    </button>
                  </div>
                </div>
              ) : (
                /* Main Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Category Pills Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1c1917]/75 mb-3">
                      1. Objet de votre démarche
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SUBJECT_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = selectedSubject === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedSubject(opt.id)}
                            className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#ba4e1a] text-white border-[#ba4e1a] shadow-sm scale-[1.01]"
                                : "bg-[#faf8f5] hover:bg-[#ebd8be]/30 text-[#1c1917] border-[#ebd8be]"
                            }`}
                          >
                            <Icon className={`w-4 h-4 mb-2 ${isSelected ? "text-white" : "text-[#ba4e1a]"}`} />
                            <div>
                              <div className="text-[10px] uppercase tracking-wider opacity-75 font-semibold">
                                {opt.badge}
                              </div>
                              <div className="text-xs font-bold leading-tight mt-0.5">
                                {opt.label}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Client Info Grid */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1c1917]/75 mb-3">
                      2. Vos Coordonnées
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-[11px] font-semibold text-[#1c1917]/70 mb-1">
                          Nom & Prénom *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ex : Karim Bennani"
                          className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#faf8f5] border border-[#ebd8be] text-sm text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a] focus:bg-white transition-all"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-[11px] font-semibold text-[#1c1917]/70 mb-1">
                          Numéro WhatsApp / Mobile *
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-xs font-bold text-[#ba4e1a] select-none">
                            🇲🇦 +212
                          </span>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="6 61 23 45 67"
                            className="w-full pl-20 pr-4 py-2.5 sm:py-3 rounded-xl bg-[#faf8f5] border border-[#ebd8be] text-sm text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a] focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[11px] font-semibold text-[#1c1917]/70 mb-1">
                          Adresse Email (optionnelle)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="karim@exemple.com"
                          className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#faf8f5] border border-[#ebd8be] text-sm text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a] focus:bg-white transition-all"
                        />
                      </div>

                      {/* City Selector */}
                      <div>
                        <label className="block text-[11px] font-semibold text-[#1c1917]/70 mb-1">
                          Ville de Résidence
                        </label>
                        <CustomSelect
                          value={formData.city}
                          onChange={(val) => setFormData({ ...formData, city: val })}
                          options={MOROCCAN_CITIES.map((city) => ({
                            value: city,
                            label: city,
                            icon: MapPin,
                          }))}
                          icon={MapPin}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message Field with Dynamic Context Placeholder */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-[#1c1917]/70">
                        Votre Message & Détails *
                      </label>
                      <span className="text-[10px] text-[#78716c]">
                        Dimensions, coloris, questions...
                      </span>
                    </div>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={currentOption.placeholder}
                      className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#ebd8be] text-sm text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a] focus:bg-white transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 sm:py-4 px-6 bg-gradient-to-r from-[#ba4e1a] to-[#9c3a0c] hover:from-[#9c3a0c] hover:to-[#822f08] text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-md shadow-[#ba4e1a]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed group"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Transmission à l&apos;atelier...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          <span>Transmettre ma demande aux artisans</span>
                        </>
                      )}
                    </button>
                    <p className="text-center text-[11px] text-[#78716c] mt-2.5">
                      🔒 Confidentialité garantie • Vos informations ne sont jamais partagées.
                    </p>
                  </div>
                </form>
              )}

              {/* Micro-FAQ Quick Accordion */}
              <div className="mt-8 pt-6 border-t border-[#ebd8be]/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#ba4e1a] mb-3 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#ba4e1a]" />
                  <span>Questions Fréquentes de nos Clients</span>
                </h4>
                <div className="space-y-2">
                  {MINI_FAQS.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-[#ebd8be] bg-[#faf8f5] overflow-hidden transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full py-2.5 px-3.5 flex items-center justify-between text-left text-xs font-semibold text-[#1c1917] hover:text-[#ba4e1a] transition-colors cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-[#78716c] transition-transform duration-200 shrink-0 ${
                              isOpen ? "rotate-180 text-[#ba4e1a]" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-3.5 pb-3 text-[11px] text-[#1c1917]/75 leading-relaxed border-t border-[#ebd8be]/40 pt-2 bg-white">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ================= 3 ENGAGEMENTS MAJEURS DE SERVICE CLIENT (BAS DE PAGE) ================= */}
        <div className="mt-14 sm:mt-18 pt-10 border-t border-[#ebd8be]/50">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c1917]">
              Nos Engagements &amp; Conciergerie Artisanale
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#1c1917]/70">
              Toutes les garanties de la Maison MARJAD pour une expérience d&apos;artisanat d&apos;art sereine et haut de gamme.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* 1. Suivi de Commande */}
            <div className="rounded-3xl p-6 bg-white border border-[#ebd8be] shadow-2xs space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#ba4e1a]/10 text-[#ba4e1a] flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1c1917]">
                Suivi de Commande en Direct
              </h3>
              <p className="text-xs text-[#1c1917]/70 leading-relaxed">
                Suivez chaque étape : de la confection en atelier (Fès, Marrakech) jusqu&apos;à la remise par notre livreur. Notification SMS et assistance dédiée via WhatsApp.
              </p>
            </div>

            {/* 2. Livraison Express */}
            <div className="rounded-3xl p-6 bg-white border border-[#ebd8be] shadow-2xs space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <PackageCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1c1917]">
                Livraison Express Partout au Maroc
              </h3>
              <p className="text-xs text-[#1c1917]/70 leading-relaxed">
                24h à 48h sur l&apos;axe Casablanca-Rabat, 48h à 72h pour les grandes villes. <strong>Livraison GRATUITE</strong> dès 800 MAD avec emballage haute protection anti-chocs.
              </p>
            </div>

            {/* 3. Retours & Échanges */}
            <div className="rounded-3xl p-6 bg-white border border-[#ebd8be] shadow-2xs space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1c1917]">
                Garantie Sérénité 7 Jours
              </h3>
              <p className="text-xs text-[#1c1917]/70 leading-relaxed">
                Vous disposez de 7 jours après réception pour demander un échange ou un remboursement. Notre transporteur vient récupérer le colis directement chez vous.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
