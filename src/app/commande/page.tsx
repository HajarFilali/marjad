"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  Truck,
  Check,
  ShoppingBag,
  Lock,
  PackageCheck,
  CheckCircle2,
  ArrowRight,
  MapPin,
} from "lucide-react";

const MOROCCAN_CITIES = [
  "Agadir",
  "Al Hoceïma",
  "Asilah",
  "Azemmour",
  "Azrou",
  "Ben Guerir",
  "Béni Mellal",
  "Benslimane",
  "Berkane",
  "Berrechid",
  "Boujniba",
  "Boulemane",
  "Bouskoura",
  "Bouznika",
  "Casablanca",
  "Chefchaouen",
  "Chichaoua",
  "Dakhla",
  "Dar Bouazza",
  "Demnate",
  "El Hajeb",
  "El Jadida",
  "El Kelaa des Sraghna",
  "Errachidia",
  "Essaouira",
  "Fès",
  "Figuig",
  "Fnideq",
  "Fquih Ben Salah",
  "Goulmima",
  "Guelmim",
  "Guercif",
  "Had Soualem",
  "Ifrane",
  "Imzouren",
  "Inezgane",
  "Jerada",
  "Kalaat M'Gouna",
  "Kénitra",
  "Khemisset",
  "Khenifra",
  "Khouribga",
  "Ksar El Kebir",
  "Laâyoune",
  "Larache",
  "Marrakech",
  "Martil",
  "M'diq",
  "Médiouna",
  "Mehdya",
  "Meknès",
  "Midelt",
  "Mohammédia",
  "Moulay Bousselham",
  "Nador",
  "Nouaceur",
  "Ouarzazate",
  "Oued Zem",
  "Ouezzane",
  "Oujda",
  "Rabat",
  "Safi",
  "Saïdia",
  "Salé",
  "Sefrou",
  "Settat",
  "Sidi Bennour",
  "Sidi Ifni",
  "Sidi Kacem",
  "Sidi Rahal",
  "Sidi Slimane",
  "Sidi Yahya El Gharb",
  "Skhirat",
  "Souk El Arbaa",
  "Tahannaout",
  "Tan-Tan",
  "Tanger",
  "Taounate",
  "Taourirt",
  "Tarfaya",
  "Taroudant",
  "Tata",
  "Taza",
  "Témara",
  "Tétouan",
  "Tiflet",
  "Tinghir",
  "Tiznit",
  "Youssoufia",
  "Zagora",
];

const cityOptions = MOROCCAN_CITIES.map((c) => ({
  value: c,
  label: c,
  icon: MapPin,
}));

export default function CheckoutPage() {
  const { items, subtotal, totalItems, clearCart } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Casablanca");
  const [customCity, setCustomCity] = useState("");
  const [address, setAddress] = useState("");

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = subtotal >= 800 || subtotal === 0 ? 0 : 35;
  const discountAmount = subtotal * discount;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    if (!promoCode.trim()) return;

    if (promoCode.trim().toUpperCase() === "MARJAD10") {
      setDiscount(0.1);
      setPromoSuccess("Code promo appliqué (-10%) !");
    } else if (promoCode.trim().toUpperCase() === "BIENVENUE") {
      setDiscount(0.15);
      setPromoSuccess("Code promo appliqué (-15%) !");
    } else {
      setPromoError("Code promo invalide.");
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) return;
    if (city === "Autre ville" && !customCity.trim()) return;

    const deliveryCity = city === "Autre ville" && customCity.trim() ? customCity.trim() : city;

    setIsSubmitting(true);
    const newOrder = {
      id: `CMD-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
      date: new Date().toISOString().split("T")[0],
      customerName: fullName,
      city: deliveryCity,
      address: address,
      items: items.map((it) => ({
        name: it.product.name,
        quantity: it.quantity,
        price: it.product.price * it.quantity,
      })),
      total: finalTotal,
      status: "En attente",
    };

    try {
      const existing = localStorage.getItem("marjad_orders");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newOrder);
      localStorage.setItem("marjad_orders", JSON.stringify(list));
    } catch (err) {}

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      clearCart();
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#ffffff] min-h-screen pt-28 pb-20">
        <div className="w-[94%] sm:w-[92%] max-w-xl mx-auto">
          <div className="bg-white rounded-3xl border border-[#ebd8be] p-8 sm:p-12 text-center shadow-md animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-[#ba4e1a] block mb-1">
              Commande Confirmée
            </span>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#1c1917] mb-2">
              Chokran {fullName} !
            </h1>
            <p className="text-xs sm:text-sm text-[#1c1917]/70 leading-relaxed mb-6">
              Votre commande d&apos;artisanat d&apos;art a été enregistrée avec succès. Notre atelier vous contactera au <strong>{phone}</strong> pour l&apos;expédition vers <strong>{city === "Autre ville" && customCity.trim() ? customCity.trim() : city}</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-[#faf6f0] border border-[#ebd8be] mb-6 text-left space-y-1.5 text-xs text-[#1c1917]/80">
              <div className="flex justify-between font-bold text-[#1c1917]">
                <span>Paiement :</span>
                <span>Espèces à la livraison (COD)</span>
              </div>
              <div className="flex justify-between font-bold text-[#ba4e1a] text-sm pt-2 border-t border-[#ebd8be]/50">
                <span>Total à régler :</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ba4e1a] to-[#9c3a0c] hover:from-[#9c3a0c] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <span>Retour à l&apos;accueil</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] min-h-screen pt-[124px] sm:pt-[132px] pb-10">
      <div className="w-[94%] sm:w-[92%] max-w-7xl mx-auto">
        
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#ebd8be] p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto my-8">
            <div className="w-14 h-14 rounded-full bg-[#faf6f0] border border-[#ebd8be] flex items-center justify-center mx-auto mb-3 text-[#ba4e1a]">
              <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h1 className="font-serif font-black text-2xl text-[#1c1917] mb-2">
              Votre panier est vide
            </h1>
            <p className="text-xs text-[#1c1917]/70 mb-5">
              Veuillez ajouter des articles avant de finaliser votre commande.
            </p>
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ba4e1a] text-white text-xs font-bold rounded-xl shadow-md"
            >
              <span>Découvrir la boutique</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            
            {/* ================= LEFT COLUMN: INFORMATIONS DE LIVRAISON ================= */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl border border-[#ebd8be] p-5 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-[#ebd8be]/60 mb-4">
                  <div>
                    <h1 className="font-serif font-black text-xl text-[#1c1917]">
                      Informations de Livraison
                    </h1>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Remplissez vos coordonnées pour recevoir votre colis partout au Maroc
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1c543f] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 shadow-2xs shrink-0 self-start sm:self-auto">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Livraison Express 24h–48h</span>
                  </div>
                </div>

                {/* Form */}
                <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#1c1917] block mb-1">
                        Nom Complet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ex: Hajar Filali"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#1c1917] block mb-1">
                        Numéro de Téléphone (WhatsApp) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: 06 12 34 56 78"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a]"
                      />
                    </div>
                  </div>

                  {/* Ville de Livraison & Précisez votre ville (sur la même ligne si "Autre ville") */}
                  <div className={`grid gap-3 ${city === "Autre ville" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                    <div>
                      <label className="text-[11px] font-bold text-[#1c1917] block mb-1">
                        Ville de Livraison <span className="text-red-500">*</span>
                      </label>
                      <CustomSelect
                        value={city}
                        onChange={(val) => {
                          setCity(val);
                          if (val !== "Autre ville") {
                            setCustomCity("");
                          }
                        }}
                        options={cityOptions}
                        footerOption={{
                          value: "Autre ville",
                          label: "Autre ville",
                          icon: MapPin,
                        }}
                        icon={MapPin}
                        searchable={true}
                        searchPlaceholder="Rechercher une ville..."
                        placeholder="Sélectionnez votre ville"
                        className="w-full"
                      />
                    </div>

                    {city === "Autre ville" && (
                      <div className="animate-in fade-in slide-in-from-left-2 duration-200">
                        <label className="text-[11px] font-bold text-[#1c1917] block mb-1">
                          Précisez votre ville <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="w-3.5 h-3.5 text-[#ba4e1a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={customCity}
                            onChange={(e) => setCustomCity(e.target.value)}
                            placeholder="Entrez le nom de votre ville..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1c1917] block mb-1">
                      Adresse de livraison <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Quartier, rue, numéro d'immeuble ou d'appartement..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a]"
                    />
                  </div>

                  {/* Banner: Mode de paiement (COD) directly below address field (No blank hole) */}
                  <div className="p-3 rounded-2xl bg-[#faf6f0] border border-[#ebd8be] flex items-center gap-3 mt-3.5">
                    <div className="w-8 h-8 rounded-xl bg-[#ba4e1a]/15 text-[#ba4e1a] flex items-center justify-center shrink-0 shadow-2xs">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1c1917]">
                        Paiement à la Livraison
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Paiement sécurisé en espèces à la livraison après vérification du colis.
                      </p>
                    </div>
                  </div>
                </form>
              </div>

              {/* Revenir au Panier Link (Under Informations de Livraison div as requested) */}
              <div className="mt-3.5 pl-1">
                <Link
                  href="/panier"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#ba4e1a] transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  <span>Revenir au Panier</span>
                </Link>
              </div>
            </div>

            {/* ================= RIGHT COLUMN: ARTICLES DE LA COMMANDE (Matching Vinillia Screenshot 4) ================= */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#ebd8be] p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-3.5 border-b border-[#ebd8be]/60 mb-3">
                <PackageCheck className="w-4 h-4 text-[#ba4e1a]" />
                <h2 className="font-serif font-black text-lg text-[#1c1917]">
                  Articles de la Commande ({totalItems})
                </h2>
              </div>

              {/* Scrollable Items List */}
              <div className="space-y-2.5 max-h-[160px] sm:max-h-[180px] overflow-y-auto pr-1 mb-3.5">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor || ""}-${item.selectedSize || ""}`}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-2xl border border-stone-200/80 bg-white"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#ebd8be] shrink-0 flex items-center justify-center shadow-2xs">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          sizes="48px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold font-serif text-[#1c1917] truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Quantité : <strong className="text-stone-800">{item.quantity}</strong>
                          {item.selectedColor ? ` • ${item.selectedColor}` : ""}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-stone-900 shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Input (Matching Vinillia styling) */}
              <form onSubmit={handleApplyPromo} className="mb-3.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="CODE PROMO"
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/30 focus:border-[#ba4e1a] uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#6b7280] hover:bg-[#ba4e1a] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    Appliquer
                  </button>
                </div>
                {promoSuccess && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>{promoSuccess}</span>
                  </p>
                )}
                {promoError && (
                  <p className="text-[11px] text-red-500 font-bold mt-1">
                    {promoError}
                  </p>
                )}
              </form>

              {/* Summary */}
              <div className="space-y-2 text-xs pb-3 border-b border-[#ebd8be]/60">
                <div className="flex justify-between text-stone-600">
                  <span>Sous-total</span>
                  <span className="font-bold text-stone-900">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Remise ({discount * 100}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>Frais de Livraison</span>
                  <span className="font-bold text-stone-900">
                    {deliveryFee === 0 ? "Gratuit (Offert)" : formatPrice(deliveryFee)}
                  </span>
                </div>
              </div>

              {/* Total to pay */}
              <div className="flex items-baseline justify-between py-3">
                <span className="font-serif font-black text-base text-[#1c1917]">
                  Total à Payer
                </span>
                <span className="font-serif font-black text-2xl text-[#ba4e1a]">
                  {formatPrice(finalTotal)}
                </span>
              </div>

              {/* Confirm Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#ba4e1a] hover:bg-[#9c3a0c] disabled:opacity-60 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#ba4e1a]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isSubmitting ? "Traitement..." : `Confirmer la commande • ${formatPrice(finalTotal)}`}
                </span>
              </button>

              {/* Subtext */}
              <p className="text-[10px] text-center text-stone-500 mt-2 font-medium">
                Paiement 100% à la livraison • Vérifiez vos produits avant de payer
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
