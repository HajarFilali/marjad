"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { INITIAL_ADMIN_ORDERS, AdminOrder } from "@/lib/adminData";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  ShoppingBag,
  Heart,
  PhoneCall,
  Settings,
  LogOut,
  Package,
  Calendar,
  CheckCircle2,
  Lock,
  X,
  ArrowRight,
  Home,
  Trash2,
  Clock,
  Truck,
  MessageCircle,
  ShieldCheck,
  User,
  Camera,
  AlertCircle,
  MoreVertical,
  Check,
  Headset,
  Sparkles,
  Menu,
  Eye,
  LayoutDashboard,
  Download,
  Loader2,
  Pencil,
} from "lucide-react";
import { generateInvoicePdf } from "@/lib/generateInvoicePdf";
import { getContactPhone, setContactPhone, DEFAULT_CONTACT_PHONE } from "@/lib/contactConfig";

type ProfileTab = "commandes" | "favoris" | "contact" | "parametres";

const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Tétouan",
  "Safi",
  "Mohammédia",
  "El Jadida",
  "Béni Mellal",
  "Nador",
  "Taza",
  "Khémisset",
  "Essaouira",
  "Chefchaouen",
  "Ouarzazate",
  "Dakhla",
  "Autre ville",
];

export default function ProfilePage() {
  const router = useRouter();
  const { wishlist, toggleWishlist } = useWishlist();
  const { items: cartItems, addItem, openCart } = useCart();

  const [activeTab, setActiveTab] = useState<ProfileTab>("commandes");
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ADMIN_ORDERS);
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [viewingOrderItems, setViewingOrderItems] = useState<AdminOrder | null>(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | number | null>(null);

  // Synchronized Contact Support Phone (Editable in Partie Contact)
  const [contactPhone, setContactPhoneState] = useState<string>(DEFAULT_CONTACT_PHONE);
  const [isEditingContactPhone, setIsEditingContactPhone] = useState(false);
  const [tempContactPhone, setTempContactPhone] = useState<string>(DEFAULT_CONTACT_PHONE);
  const [contactSavedMsg, setContactSavedMsg] = useState(false);

  useEffect(() => {
    const current = getContactPhone();
    setContactPhoneState(current);
    setTempContactPhone(current);

    const handleUpdate = () => {
      const updated = getContactPhone();
      setContactPhoneState(updated);
      setTempContactPhone(updated);
    };

    window.addEventListener("marjad_contact_updated", handleUpdate);
    return () => window.removeEventListener("marjad_contact_updated", handleUpdate);
  }, []);

  const handleSaveContactPhone = () => {
    if (!tempContactPhone.trim()) return;
    setContactPhone(tempContactPhone.trim());
    setContactPhoneState(tempContactPhone.trim());
    setIsEditingContactPhone(false);
    setContactSavedMsg(true);
    setTimeout(() => setContactSavedMsg(false), 3000);
  };

  // Invoice PDF generator function
  const handleDownloadInvoice = async (order: AdminOrder) => {
    try {
      setDownloadingInvoiceId(order.id);
      await generateInvoicePdf(order, {
        fullName,
        email,
        phone,
        city,
        address,
      });
    } catch (err) {
      console.error("Erreur lors de la génération de la facture PDF:", err);
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  // Settings State
  const [fullName, setFullName] = useState("Client Marjad");
  const [email, setEmail] = useState("client.marjad@gmail.com");
  const [phone, setPhone] = useState("+212 6 61 24 58 90");
  const [city, setCity] = useState("Marrakech");
  const [address, setAddress] = useState("Médina Ancienne, Derb Dabachi");
  const [gender, setGender] = useState<string>("Femme");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [settingsMsg, setSettingsMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("marjad_user_profile");
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.city) setCity(parsed.city);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.gender) setGender(parsed.gender);
        if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
      }

      const storedOrders = localStorage.getItem("marjad_admin_orders");
      if (storedOrders) {
        const parsedO = JSON.parse(storedOrders);
        if (Array.isArray(parsedO) && parsedO.length > 0) {
          // Merge with initial admin orders so customerEmail and latest fields are always populated
          const merged = parsedO.map((o: any) => {
            const initialMatch = INITIAL_ADMIN_ORDERS.find((init) => init.id === o.id);
            return {
              ...o,
              customerEmail: o.customerEmail || initialMatch?.customerEmail,
              customerPhone: o.customerPhone || initialMatch?.customerPhone,
              customerCity: o.customerCity || initialMatch?.customerCity,
              customerAddress: o.customerAddress || initialMatch?.customerAddress,
            };
          });
          setOrders(merged);
        }
      }
    } catch (e) {
      console.warn("Error loading profile data:", e);
    }
  }, []);

  // Filter Orders by Date
  const filteredOrders = useMemo(() => {
    if (dateFilter === "all") return orders;
    const now = new Date();
    return orders.filter((o) => {
      const oDate = new Date(o.date);
      if (isNaN(oDate.getTime())) return true;
      const diffDays = (now.getTime() - oDate.getTime()) / (1000 * 3600 * 24);
      if (dateFilter === "7days") return diffDays <= 7;
      if (dateFilter === "month") return diffDays <= 30;
      if (dateFilter === "3months") return diffDays <= 90;
      if (dateFilter === "year") return diffDays <= 365;
      return true;
    });
  }, [orders, dateFilter]);

  // Total spent in filtered orders
  const totalSpent = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  }, [filteredOrders]);

  // Unique products bought across orders
  const uniqueProductsBought = useMemo(() => {
    const map = new Map<string, { name: string; image: string; price: number }>();
    orders.forEach((o) => {
      o.items?.forEach((it) => {
        if (!map.has(it.name)) {
          map.set(it.name, {
            name: it.name,
            image: it.image || "/decor-honeycomb-calligraphy.webp",
            price: it.price,
          });
        }
      });
    });
    return Array.from(map.values());
  }, [orders]);

  // Check if item is already in cart
  const isItemInCart = (productId: string | number) => {
    return cartItems.some((it) => String(it.product.id) === String(productId));
  };

  // Avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
        try {
          const stored = localStorage.getItem("marjad_user_profile");
          const parsed = stored ? JSON.parse(stored) : {};
          parsed.avatarUrl = reader.result;
          localStorage.setItem("marjad_user_profile", JSON.stringify(parsed));
          setSettingsMsg({
            type: "success",
            text: "Photo de profil mise à jour avec succès.",
          });
        } catch (err) {
          console.warn("Error saving avatar:", err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarDelete = () => {
    setAvatarUrl("");
    try {
      const stored = localStorage.getItem("marjad_user_profile");
      const parsed = stored ? JSON.parse(stored) : {};
      parsed.avatarUrl = "";
      localStorage.setItem("marjad_user_profile", JSON.stringify(parsed));
      setSettingsMsg({
        type: "success",
        text: "Photo de profil supprimée.",
      });
    } catch (err) {
      console.warn("Error deleting avatar:", err);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMsg(null);

    if (newPassword || oldPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setSettingsMsg({
          type: "error",
          text: "Les nouveaux mots de passe ne correspondent pas.",
        });
        return;
      }
    }

    const finalCity = (city === "Autre" || city === "Autre ville") && customCity.trim() ? customCity.trim() : city;

    const updated = {
      fullName,
      email,
      phone,
      city: finalCity,
      address,
      gender,
      avatarUrl,
    };

    try {
      localStorage.setItem("marjad_user_profile", JSON.stringify(updated));
      setSettingsMsg({
        type: "success",
        text: "Votre profil a été mis à jour avec succès.",
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setSettingsMsg({
        type: "error",
        text: "Erreur lors de la sauvegarde du profil.",
      });
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("marjad_admin_auth");
      localStorage.removeItem("marjad_admin_email");
      document.cookie = "marjad_admin_auth=; path=/; max-age=0";
    }
    router.push("/login");
  };

  // Curved notches matching vinilia / roseabeauty & AdminSidebar seamlessly without border
  const renderActiveNotches = () => (
    <>
      <svg
        className="hidden lg:block absolute bottom-full right-0 translate-y-[1px] w-8 h-8 pointer-events-none z-30"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 32C17.673 32 32 14.327 32 0V32H0Z" fill="#FFFFFF" stroke="none" />
      </svg>
      <svg
        className="hidden lg:block absolute top-full right-0 -translate-y-[1px] w-8 h-8 pointer-events-none z-30"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0C17.673 0 32 17.673 32 32V0H0Z" fill="#FFFFFF" stroke="none" />
      </svg>
    </>
  );

  const navItems: { tab: ProfileTab; label: string; icon: any; badge?: string; badgeHighlight?: boolean }[] = [
    {
      tab: "commandes",
      label: "Commandes",
      icon: ShoppingBag,
      badge: filteredOrders.length > 0 ? `${filteredOrders.length}` : undefined,
      badgeHighlight: true,
    },
    {
      tab: "favoris",
      label: "Favoris",
      icon: Heart,
      badge: wishlist.length > 0 ? `${wishlist.length}` : undefined,
    },
    {
      tab: "contact",
      label: "Contact",
      icon: PhoneCall,
    },
    {
      tab: "parametres",
      label: "Paramètres",
      icon: Settings,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full bg-[#FAF6F0] text-[#6d381e] select-none relative overflow-y-auto lg:overflow-visible py-3">
      {/* Top Section: Logo & Sidebar Nav Links */}
      <div className="space-y-3">
        {/* Brand Logo Header */}
        <div className="px-4 pt-2.5 pb-1.5">
          <div className="flex items-center justify-center relative py-1">
            <Link href="/" className="flex items-center justify-center group" title="MARJAD - Artisanat d'Art">
              <Image
                src="/logo.png"
                alt="MARJAD"
                width={170}
                height={46}
                priority
                className="h-9 sm:h-10 w-auto object-contain group-hover:scale-102 transition-transform duration-200"
              />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden absolute right-0 p-1 text-[#6d381e]/70 hover:text-[#6d381e] rounded-lg hover:bg-white/40 transition"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="space-y-1.5 pt-1 relative">
          {navItems.map((item) => {
            const active = activeTab === item.tab;
            const Icon = item.icon;
            return (
              <div key={item.tab} className="relative">
                {active && renderActiveNotches()}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(item.tab);
                    setMobileOpen(false);
                  }}
                  className={`cursor-pointer ${
                    active
                      ? "bg-white text-[#ba4e1a] font-bold rounded-l-full ml-3 w-[calc(100%-0.75rem)] pl-4 pr-5 py-2.5 relative z-30 flex items-center justify-between shadow-none border-0 outline-none"
                      : "text-[#6d381e]/85 hover:text-[#6d381e] hover:bg-white/50 transition-colors duration-150 mx-3 w-[calc(100%-1.5rem)] px-3.5 py-2 rounded-2xl font-medium flex items-center justify-between"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        active ? "bg-[#FAF6F0] text-[#ba4e1a]" : "text-[#6d381e]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="tracking-wide text-[13px] font-semibold">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        active
                          ? item.badgeHighlight
                            ? "bg-[#ba4e1a] text-white shadow-2xs"
                            : "bg-[#FAF6F0] text-[#ba4e1a] border border-[#ebd8be]"
                          : item.badgeHighlight
                          ? "bg-[#ba4e1a] text-white shadow-xs"
                          : "bg-white/80 text-[#6d381e] border border-[#ebd8be]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Admin Dashboard, Return Home link & Déconnexion Button */}
      <div className="px-3 pb-3 space-y-2">
        {/* Lien direct Tableau de bord Admin */}
        <Link
          href="/admin"
          className="w-full py-2.5 px-4 rounded-2xl bg-white/80 hover:bg-white text-[#6d381e] border border-[#ebd8be] shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 font-bold text-xs cursor-pointer hover:border-[#6d381e]"
        >
          <LayoutDashboard className="w-4 h-4 text-[#ba4e1a]" />
          <span>Tableau de bord</span>
        </Link>

        <Link
          href="/"
          className="w-full py-2.5 px-4 rounded-2xl bg-white/80 hover:bg-white text-[#6d381e] border border-[#ebd8be] shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 font-bold text-xs cursor-pointer"
        >
          <Home className="w-4 h-4 text-[#ba4e1a]" />
          <span>Retour à l&apos;accueil</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-rose-200 shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 font-bold text-xs cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-[#FAF6F0] flex flex-col lg:flex-row antialiased selection:bg-white selection:text-[#6d381e] overflow-hidden font-sans">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#FAF6F0] text-[#6d381e] px-4 py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-xs border-b border-[#ebd8be]">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="MARJAD"
            width={130}
            height={36}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#6d381e] hover:bg-white/40 rounded-xl transition cursor-pointer"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-72 sm:w-80 h-full bg-[#FAF6F0] shadow-2xl ml-0" onClick={(e) => e.stopPropagation()}>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-68 xl:w-72 bg-[#FAF6F0] shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Main Content Area Canvas (White Rounded Box surrounded by Warm Beige Frame) */}
      <div className="flex-1 flex flex-col min-w-0 py-3.5 sm:py-4.5 lg:py-5 pr-3.5 sm:pr-4.5 lg:pr-5 pl-0 h-full">
        <main className="flex-1 flex flex-col min-w-0 bg-white rounded-[24px] sm:rounded-[30px] lg:rounded-[36px] overflow-y-auto overflow-x-hidden relative z-10 border-0 shadow-none h-full p-6 lg:p-8">
          {/* Top Bar Header inside White Canvas: Title + User Avatar Badge */}
          {activeTab !== "parametres" && (
            <div className="flex items-center justify-between pb-2 mb-4">
              <div>
                <h1 className="font-serif font-extrabold text-2xl lg:text-3xl text-[#1C1B1B]">
                  {activeTab === "commandes" && "Mes Commandes"}
                  {activeTab === "favoris" && "Mes Favoris"}
                  {activeTab === "contact" && "Contact & Support"}
                </h1>
              </div>

              {/* User Avatar Badge */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 bg-[#FAF7F2] px-3 py-1.5 rounded-2xl border border-[#EDE5E0]">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={fullName}
                      className="w-7 h-7 rounded-full object-cover border border-[#ba4e1a]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#6d381e] text-white font-extrabold flex items-center justify-center text-xs">
                      {(fullName || "M").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-bold text-xs text-[#1F2937]">{fullName || "Client Marjad"}</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 1: COMMANDES ================= */}
          {activeTab === "commandes" && (
            <div className="space-y-6">
              {/* 3 Top Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: Total Dépensé */}
                <div className="bg-white rounded-2xl border border-[#EDE5E0] p-4 shadow-2xs flex flex-col justify-center gap-1.5 min-h-[96px]">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Dépensé</p>
                  <h3 className="font-serif font-extrabold text-2xl text-[#1F2937]">{totalSpent.toFixed(2)} DH</h3>
                </div>

                {/* Card 2: Produits Achetés */}
                <div className="bg-white rounded-2xl border border-[#EDE5E0] p-4 shadow-2xs min-w-0 flex flex-col justify-center gap-1.5 min-h-[96px]">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Produits Achetés</p>
                    <span className="text-[9.5px] font-extrabold text-[#ba4e1a] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#EDE5E0]">
                      {uniqueProductsBought.length} produit{uniqueProductsBought.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  {uniqueProductsBought.length > 0 ? (
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 px-2 -mx-2 cursor-grab active:cursor-grabbing snap-x select-none">
                      {uniqueProductsBought.map((p, idx) => (
                        <div key={idx} className="shrink-0 snap-start p-0.5">
                          <img
                            src={p.image}
                            alt={p.name}
                            title={p.name}
                            className="w-11 h-11 rounded-xl object-contain border border-[#E9DCD5] bg-[#FAF7F2] hover:scale-105 hover:border-[#ba4e1a] transition-all cursor-pointer shadow-2xs p-0.5"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-1">
                      <p className="text-xs text-neutral-400 font-medium italic">Aucun produit acheté</p>
                    </div>
                  )}
                </div>

                {/* Card 3: Filtre par Date */}
                <div className="bg-white rounded-2xl border border-[#EDE5E0] p-4 shadow-2xs flex flex-col justify-center gap-1.5 min-h-[96px]">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Période</p>
                  <div className="w-full">
                    <CustomSelect
                      value={dateFilter}
                      onChange={(val) => setDateFilter(val)}
                      icon={Calendar}
                      options={[
                        { value: "all", label: "Toutes les dates" },
                        { value: "7days", label: "7 derniers jours" },
                        { value: "month", label: "Ce mois-ci (30 jours)" },
                        { value: "3months", label: "3 derniers mois" },
                        { value: "year", label: "Cette année (1 an)" },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Orders Table Container */}
              <div className="pt-2">
                <div className="flex items-center justify-between pb-1 mb-3">
                  <h3 className="font-serif font-bold text-base text-[#1F2937] flex items-center gap-2">
                    <Package className="w-4.5 h-4.5 text-[#ba4e1a]" />
                    <span>Historique des Commandes</span>
                  </h3>
                  <span className="text-xs font-bold text-neutral-400 bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#EDE5E0]">
                    {filteredOrders.length} commande{filteredOrders.length > 1 ? "s" : ""}
                  </span>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="py-12 text-center space-y-3 bg-white rounded-2xl border border-[#EDE5E0]">
                    <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#EDE5E0] text-[#ba4e1a] flex items-center justify-center mx-auto">
                      <Package className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-sm text-[#1F2937]">Aucune commande effectuée</h4>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      Vous n&apos;avez pas encore passé de commande. Découvrez notre collection exclusive d&apos;artisanat marocain !
                    </p>
                    <Link
                      href="/boutique"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#6d381e] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#542a15] transition"
                    >
                      Explorer la Boutique
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto w-full rounded-2xl border border-[#EDE5E0] bg-white scrollbar-none shadow-2xs">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                      <thead>
                        <tr className="border-b border-[#EDE5E0] text-[11px] font-bold text-neutral-400 uppercase tracking-wider bg-[#FAF7F2]">
                          <th className="py-3 px-4">DATE</th>
                          <th className="py-3 px-4">ARTICLES</th>
                          <th className="py-3 px-4 text-center whitespace-nowrap">NOMBRE DE PRODUITS</th>
                          <th className="py-3 px-4">MONTANT TOTAL</th>
                          <th className="py-3 px-4">STATUT</th>
                          <th className="py-3 px-4 text-center">FACTURE</th>
                          <th className="py-3 px-4 text-right">DÉTAILS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EDE5E0] text-xs">
                        {filteredOrders.map((ord: any, idx: number) => {
                          const status = ord.status || "pending";
                          const items = ord.items || [];
                          const orderTotal = typeof ord.total === "number" ? ord.total : parseFloat(ord.total || "0");

                          return (
                            <tr key={ord.id || idx} className="hover:bg-[#FAF7F2]/60 transition">
                              {/* 1. DATE */}
                              <td className="py-3.5 px-4 font-bold text-xs text-[#1F2937] whitespace-nowrap">
                                {ord.date || "14/10/2026"}
                                <span className="block text-[10px] text-neutral-400 font-mono mt-0.5">
                                  {ord.id}
                                </span>
                              </td>

                              {/* 2. ARTICLES */}
                              <td className="py-3.5 px-4 min-w-[140px]">
                                <div className="flex items-center gap-1.5 flex-nowrap">
                                  {items.length > 0 ? (
                                    <div
                                      onClick={() => setViewingOrderItems(ord)}
                                      className="relative w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#EDE9E6] shadow-xs shrink-0 group hover:scale-105 transition-all cursor-pointer p-1"
                                      title={`${items[0].name} - Cliquer pour détails`}
                                    >
                                      <img
                                        src={items[0].image || "/decor-honeycomb-calligraphy.webp"}
                                        alt={items[0].name}
                                        className="w-full h-full object-contain rounded-xl"
                                      />
                                      {/* Circular Quantity Badge */}
                                      <span
                                        className="absolute -top-2.5 -right-2.5 bg-[#ba4e1a] text-white text-[11px] font-extrabold flex items-center justify-center border-2 border-white shadow-xs z-20 shrink-0 leading-none"
                                        style={{
                                          width: "22px",
                                          height: "22px",
                                          borderRadius: "50%",
                                          aspectRatio: "1 / 1",
                                        }}
                                      >
                                        x{items[0].quantity || 1}
                                      </span>
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => setViewingOrderItems(ord)}
                                      className="relative w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#EDE9E6] shadow-xs shrink-0 cursor-pointer overflow-hidden p-1"
                                    >
                                      <img
                                        src="/decor-honeycomb-calligraphy.webp"
                                        alt="Marjad"
                                        className="w-full h-full object-contain rounded-xl"
                                      />
                                    </div>
                                  )}

                                  {/* 3 Dots button if multiple products */}
                                  {items.length >= 2 && (
                                    <button
                                      type="button"
                                      onClick={() => setViewingOrderItems(ord)}
                                      title="Voir tous les articles de la commande"
                                      className="p-1 text-neutral-400 hover:text-[#ba4e1a] transition-all cursor-pointer flex items-center justify-center hover:scale-110 rounded-lg hover:bg-[#FAF7F2] shrink-0"
                                    >
                                      <MoreVertical className="w-5 h-5" />
                                    </button>
                                  )}
                                </div>
                              </td>

                              {/* 3. NOMBRE DE PRODUITS */}
                              <td className="py-3.5 px-4 text-center font-bold text-neutral-700">
                                {items.length || 1}
                              </td>

                              {/* 4. MONTANT TOTAL */}
                              <td className="py-3.5 px-4 min-w-[150px]">
                                <div className="font-serif font-extrabold text-sm text-[#1F2937]">
                                  {orderTotal.toFixed(2)} DH
                                </div>
                                <div className="text-[10px] font-medium text-neutral-400">Paiement livraison</div>
                              </td>

                              {/* 5. STATUT */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                {status === "delivered" ? (
                                  <span className="inline-flex items-center gap-1.5 bg-[#E8FAF0] text-[#1E7245] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#86E6AC]">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Livrée</span>
                                  </span>
                                ) : status === "shipped" ? (
                                  <span className="inline-flex items-center gap-1.5 bg-[#FAF2EE] text-[#ba4e1a] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#F3D7CA]">
                                    <Truck className="w-3.5 h-3.5" />
                                    <span>Expédiée</span>
                                  </span>
                                ) : status === "confirmed" ? (
                                  <span className="inline-flex items-center gap-1.5 bg-[#F0F5F2] text-[#365A4C] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#D5E3DB]">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Confirmée</span>
                                  </span>
                                ) : status === "cancelled" ? (
                                  <span className="inline-flex items-center gap-1.5 bg-[#F4F4F4] text-[#555555] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#E2E2E2]">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>Annulée</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 bg-[#FAF7F2] text-[#6d381e] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#EDE5E0]">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>En attente</span>
                                  </span>
                                )}
                              </td>

                              {/* 6. FACTURE */}
                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleDownloadInvoice(ord)}
                                  disabled={downloadingInvoiceId === ord.id}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#6d381e] hover:text-white text-[#6d381e] font-bold text-[11px] border border-[#E9DCD5] transition cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed group"
                                  title="Télécharger la facture PDF"
                                >
                                  {downloadingInvoiceId === ord.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Download className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                                  )}
                                  <span>{downloadingInvoiceId === ord.id ? "Génération..." : "Facture"}</span>
                                </button>
                              </td>

                              {/* 7. DÉTAILS (Icône professionnelle marron) */}
                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => setViewingOrderItems(ord)}
                                  className="w-8 h-8 rounded-xl bg-[#FAF7F2] hover:bg-[#6d381e] text-[#6d381e] hover:text-white border border-[#E9DCD5] hover:border-[#6d381e] transition-all flex items-center justify-center cursor-pointer shadow-2xs ml-auto group"
                                  title="Voir les détails de la commande"
                                  aria-label="Voir les détails de la commande"
                                >
                                  <Eye className="w-4 h-4 transition-transform group-hover:scale-110" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 2: FAVORIS (4 Columns Grid) ================= */}
          {activeTab === "favoris" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE5E0]">
                <h3 className="font-serif font-bold text-base text-[#1F2937] flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#ba4e1a] fill-[#ba4e1a]" />
                  <span>Mes Produits Favoris</span>
                </h3>
                <span className="text-xs font-bold text-neutral-400 bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#EDE5E0]">
                  {wishlist.length} favoris
                </span>
              </div>

              {wishlist.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#EDE5E0] text-[#ba4e1a] flex items-center justify-center mx-auto">
                    <Heart className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-neutral-500 font-medium">Vous n&apos;avez pas encore ajouté de coups de cœur.</p>
                  <Link
                    href="/boutique"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#6d381e] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#542a15] transition"
                  >
                    Explorer le Catalogue Marjad
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {wishlist.map((prod) => {
                    const inCart = isItemInCart(prod.id);
                    return (
                      <div
                        key={prod.id}
                        className="bg-white rounded-2xl border border-[#EDE5E0] p-3 flex flex-col justify-between shadow-2xs hover:shadow-md transition group"
                      >
                        <div>
                          {/* Image Container */}
                          <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF7F2] mb-3 border border-[#F3EBE7] p-2 flex items-center justify-center">
                            <img
                              src={prod.images?.[0] || "/decor-honeycomb-calligraphy.webp"}
                              alt={prod.name}
                              className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform"
                            />
                            {/* Stock Badge */}
                            <span className="absolute top-2 right-2 bg-[#6d381e] text-white font-extrabold text-[9.5px] px-2 py-0.5 rounded-full shadow-xs z-10">
                              Artisanat d&apos;Art
                            </span>
                          </div>

                          {/* Category Tag */}
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider truncate">
                              {prod.category || "DÉCORATION"}
                            </span>
                            <span className="text-[10px] font-bold text-[#ba4e1a] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#EDE5E0]">
                              Fait Main
                            </span>
                          </div>

                          {/* Product Title */}
                          <h4 className="font-serif font-bold text-xs text-[#1F2937] line-clamp-2 min-h-[32px] mb-2 leading-tight">
                            {prod.name}
                          </h4>

                          {/* Price */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-extrabold text-sm text-[#ba4e1a]">{prod.price} DH</span>
                          </div>
                        </div>

                        {/* Bottom Row in 1 Single Line: Ajouter au panier + Delete Icon */}
                        <div className="flex items-center gap-2 pt-2 border-t border-[#F3EBE7]">
                          <button
                            type="button"
                            onClick={() => {
                              if (!inCart) {
                                addItem(prod, 1);
                                openCart();
                              }
                            }}
                            className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer ${
                              inCart
                                ? "bg-[#6d381e]/10 text-[#6d381e] border border-[#6d381e]/20 hover:bg-[#6d381e]/15"
                                : "bg-[#6d381e] text-white hover:bg-[#542a15] shadow-xs"
                            }`}
                          >
                            {inCart ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Dans le panier</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Ajouter au panier</span>
                              </>
                            )}
                          </button>

                          {/* Trash Delete Icon */}
                          <button
                            type="button"
                            onClick={() => toggleWishlist(prod)}
                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition border border-rose-200 cursor-pointer shrink-0"
                            title="Retirer des favoris"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: CONTACT & SUPPORT ================= */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              {/* Top Banner Card */}
              <div className="relative overflow-hidden rounded-3xl bg-white p-6 border border-[#EDE5E0] shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <h3 className="font-serif font-bold text-lg text-[#1F2937]">
                      Une question sur votre commande ou nos créations artisanales ?
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                      Notre équipe d&apos;artisans et maîtres d&apos;art est à votre entière disposition 7j/7 pour vous accompagner, suivre votre colis ou concevoir une pièce sur mesure.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-[#FAF7F2] px-4 py-2.5 rounded-2xl border border-[#EDE5E0] shrink-0 self-start sm:self-auto shadow-2xs">
                    <Clock className="w-4 h-4 text-[#ba4e1a]" />
                    <div className="text-xs">
                      <span className="font-bold text-[#1F2937] block leading-none">Service 7j/7</span>
                      <span className="text-[10px] text-neutral-500 font-medium">9h00 - 21h00 (Maroc)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Contact Cards (2 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Card 1: WhatsApp Service Client Direct */}
                <div className="bg-white rounded-3xl border border-[#EDE5E0] p-6 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-[#ba4e1a]/50 transition-all duration-300 group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#6d381e] text-white flex items-center justify-center shadow-md shadow-[#6d381e]/20">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <span className="bg-[#6d381e]/10 text-[#6d381e] font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#6d381e]/20">
                        Réponse rapide
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#1F2937] mb-1">
                      Service Client Direct
                    </h4>
                    <p className="text-xs text-neutral-500 mb-4 font-medium leading-relaxed">
                      Suivi de commandes, expéditions et conseils sur l&apos;entretien de vos pièces artisanales.
                    </p>

                    <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EDE5E0] mb-5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-neutral-600">WhatsApp & Factures :</span>
                        {!isEditingContactPhone && (
                          <button
                            type="button"
                            onClick={() => {
                              setTempContactPhone(contactPhone);
                              setIsEditingContactPhone(true);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ba4e1a] hover:text-[#6d381e] cursor-pointer bg-white px-2 py-0.5 rounded-lg border border-[#EDE5E0] hover:border-[#ba4e1a] transition shadow-2xs"
                            title="Modifier le numéro de contact"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Modifier</span>
                          </button>
                        )}
                      </div>

                      {isEditingContactPhone ? (
                        <div className="space-y-2 mt-2">
                          <input
                            type="text"
                            value={tempContactPhone}
                            onChange={(e) => setTempContactPhone(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs font-mono font-bold text-[#1F2937] bg-white border border-[#ba4e1a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ba4e1a]/20"
                            placeholder="+212 6 61 24 58 90"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleSaveContactPhone}
                              className="px-3 py-1 text-[11px] font-bold text-white bg-[#ba4e1a] hover:bg-[#6d381e] rounded-lg transition cursor-pointer shadow-2xs"
                            >
                              Enregistrer
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTempContactPhone(contactPhone);
                                setIsEditingContactPhone(false);
                              }}
                              className="px-3 py-1 text-[11px] font-bold text-neutral-600 bg-white hover:bg-neutral-100 rounded-lg border border-[#EDE5E0] transition cursor-pointer"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-extrabold text-sm text-[#ba4e1a] tracking-wide">
                            {contactPhone}
                          </span>
                          {contactSavedMsg && (
                            <span className="text-[10px] font-bold text-emerald-600 animate-in fade-in">
                              ✓ Synchronisé avec factures !
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#6d381e] hover:bg-[#542a15] text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-2 group-hover:shadow-md cursor-pointer"
                  >
                    <span>Discuter sur WhatsApp</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Card 2: Support VIP Atelier Marjad */}
                <div className="bg-white rounded-3xl border border-[#EDE5E0] p-6 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-[#ba4e1a]/50 transition-all duration-300 group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#ba4e1a] text-white flex items-center justify-center shadow-md shadow-[#ba4e1a]/20">
                        <Headset className="w-6 h-6 text-white" />
                      </div>
                      <span className="bg-[#ba4e1a]/10 text-[#ba4e1a] font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#ba4e1a]/20">
                        Atelier Sur Mesure
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#1F2937] mb-1">
                      Atelier VIP Marjad
                    </h4>
                    <p className="text-xs text-neutral-500 mb-4 font-medium leading-relaxed">
                      Commandes personnalisées, sculptures gravées sur commande et projets d&apos;architecture d&apos;intérieur.
                    </p>

                    <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EDE5E0] mb-5 flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-600">Ligne Atelier :</span>
                      <span className="font-mono font-extrabold text-sm text-[#ba4e1a] tracking-wide">{contactPhone}</span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#ba4e1a] hover:bg-[#963e14] text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-2 group-hover:shadow-md cursor-pointer"
                  >
                    <span>Ligne VIP Atelier</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Assistance Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-[#EDE5E0] flex items-start gap-3 shadow-2xs">
                  <div className="p-2 rounded-xl bg-[#ba4e1a]/10 text-[#ba4e1a] border border-[#ba4e1a]/20 shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#1F2937] mb-0.5">Livraison Express Partout au Maroc</h5>
                    <p className="text-[11px] text-neutral-500 leading-snug font-medium">
                      Colis sécurisé avec emballage premium protecteur.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EDE5E0] flex items-start gap-3 shadow-2xs">
                  <div className="p-2 rounded-xl bg-[#ba4e1a]/10 text-[#ba4e1a] border border-[#ba4e1a]/20 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#1F2937] mb-0.5">Artisanat 100% Authentique</h5>
                    <p className="text-[11px] text-neutral-500 leading-snug font-medium">
                      Façonné à la main par nos maîtres artisans à Fès et Marrakech.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EDE5E0] flex items-start gap-3 shadow-2xs">
                  <div className="p-2 rounded-xl bg-[#ba4e1a]/10 text-[#ba4e1a] border border-[#ba4e1a]/20 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#1F2937] mb-0.5">Personnalisation sur Mesure</h5>
                    <p className="text-[11px] text-neutral-500 leading-snug font-medium">
                      Dimensions et finitions adaptées à vos espaces intérieurs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: PARAMÈTRES ================= */}
          {activeTab === "parametres" && (
            <div>
              <form onSubmit={handleSaveSettings}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* LEFT COLUMN (Fixed / Sticky / Title + Avatar + Save Button) */}
                  <div className="lg:col-span-4 lg:sticky lg:top-0 space-y-4 shrink-0 bg-white z-20 pb-2">
                    <h1 className="font-serif font-extrabold text-2xl lg:text-3xl text-[#1C1B1B] pb-1">
                      Paramètres
                    </h1>

                    {/* Avatar Upload Card */}
                    <div className="flex flex-col items-center justify-center p-6 py-8 bg-white rounded-3xl border border-[#EDE5E0] shadow-2xs min-h-[220px]">
                      <div className="relative group">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#FAF7F2] border-2 border-[#ba4e1a]/30 shadow-md flex items-center justify-center relative">
                          {avatarUrl ? (
                            <>
                              <img
                                src={avatarUrl}
                                alt={fullName || "Photo de profil"}
                                className="w-full h-full object-cover rounded-full"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleAvatarDelete();
                                }}
                                className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full cursor-pointer z-10"
                                title="Supprimer la photo"
                              >
                                <Trash2 className="w-6 h-6 text-rose-400 hover:text-rose-300 transition-transform hover:scale-110" />
                                <span className="text-[10px] font-bold text-rose-200 mt-1">
                                  Supprimer
                                </span>
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full bg-[#6d381e] text-white font-serif font-bold text-2xl sm:text-3xl flex items-center justify-center rounded-full">
                              {(fullName || "M").slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <label
                          htmlFor="avatar-file-upload"
                          className="absolute bottom-0 right-0 w-8 h-8 sm:w-9 sm:h-9 bg-[#ba4e1a] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-[#963e14] hover:scale-110 transition-all cursor-pointer z-20"
                          title="Changer la photo de profil"
                        >
                          <Camera className="w-4 h-4 text-white" />
                          <input
                            id="avatar-file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <p className="text-xs font-bold text-[#1F2937] mt-3">
                        {fullName || "Client Marjad"}
                      </p>
                    </div>

                    {/* Save Button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 bg-[#6d381e] hover:bg-[#542a15] text-white font-bold text-xs rounded-2xl shadow-md transition cursor-pointer flex items-center justify-center"
                    >
                      <span>Enregistrer</span>
                    </button>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="lg:col-span-8 space-y-4">
                    {/* Notification Banner */}
                    {settingsMsg && (
                      <div
                        className={`py-2.5 px-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-2xs transition-all border ${
                          settingsMsg.type === "success"
                            ? "bg-emerald-50/80 text-emerald-900 border-emerald-200/80"
                            : "bg-rose-50/80 text-rose-900 border-rose-200/80"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs ${
                              settingsMsg.type === "success"
                                ? "bg-[#ba4e1a] text-white"
                                : "bg-rose-600 text-white"
                            }`}
                          >
                            {settingsMsg.type === "success" ? (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap text-xs">
                            <span className="font-extrabold text-[#1F2937]">
                              {settingsMsg.type === "success" ? "Succès :" : "Erreur :"}
                            </span>
                            <span className="text-neutral-700 font-semibold">
                              {settingsMsg.text}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSettingsMsg(null)}
                          className="p-1 rounded-lg hover:bg-black/5 text-neutral-400 hover:text-neutral-700 transition cursor-pointer"
                          title="Fermer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="bg-white rounded-3xl border border-[#EDE5E0] p-6 space-y-6 shadow-2xs">
                      {/* Personal Info Header */}
                      <div className="flex items-center justify-between border-b border-[#EDE5E0] pb-3">
                        <h4 className="font-serif font-bold text-sm text-[#1F2937] flex items-center gap-2">
                          <User className="w-4 h-4 text-[#ba4e1a]" />
                          <span>Informations Personnelles</span>
                        </h4>

                        <div className="flex items-center gap-2 bg-[#FAF7F2] px-3 py-1 rounded-2xl border border-[#EDE5E0]">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={fullName}
                              className="w-6 h-6 rounded-full object-cover border border-[#ba4e1a]"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-[#6d381e] text-white font-extrabold flex items-center justify-center text-[10px]">
                              {(fullName || "M").charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="font-bold text-xs text-[#1F2937]">{fullName || "Client Marjad"}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* ROW 1: Le nom complet & L'adresse email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-neutral-600 mb-1.5">
                              Le nom complet <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full bg-white border border-[#EDE5E0] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#ba4e1a]"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-neutral-600 mb-1.5">
                              L&apos;adresse email
                            </label>
                            <div className="relative">
                              <input
                                type="email"
                                value={email}
                                readOnly
                                disabled
                                className="w-full bg-white border border-[#EDE5E0] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-500 cursor-not-allowed select-none opacity-80"
                              />
                              <Lock className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>
                        </div>

                        {/* ROW 2: Numéro de téléphone & Genre */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                          <div>
                            <label className="block text-xs font-bold text-neutral-600 mb-1.5">
                              Numéro de téléphone
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="0600000000"
                              className="w-full bg-white border border-[#EDE5E0] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#ba4e1a]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-neutral-600 mb-2">
                              Genre
                            </label>
                            <div className="flex items-center gap-6 py-1">
                              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-[#1F2937]">
                                <input
                                  type="radio"
                                  name="gender"
                                  value="Femme"
                                  checked={gender === "Femme" || gender === "femme"}
                                  onChange={(e) => setGender(e.target.value)}
                                  className="w-4 h-4 text-[#ba4e1a] focus:ring-[#ba4e1a] accent-[#ba4e1a] cursor-pointer"
                                />
                                <span>Femme</span>
                              </label>

                              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-[#1F2937]">
                                <input
                                  type="radio"
                                  name="gender"
                                  value="Homme"
                                  checked={gender === "Homme" || gender === "homme"}
                                  onChange={(e) => setGender(e.target.value)}
                                  className="w-4 h-4 text-[#ba4e1a] focus:ring-[#ba4e1a] accent-[#ba4e1a] cursor-pointer"
                                />
                                <span>Homme</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* ROW 3 & ROW 4: La ville & L'adresse exacte */}
                        {city === "Autre" || city === "Autre ville" ? (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-neutral-600 mb-1.5">
                                  La ville
                                </label>
                                <CustomSelect
                                  value={city}
                                  onChange={(val) => setCity(val)}
                                  options={MOROCCAN_CITIES.map((c) => ({ value: c, label: c }))}
                                  searchable
                                  placeholder="Sélectionnez votre ville..."
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-neutral-600 mb-1.5">
                                  Nom de votre ville
                                </label>
                                <input
                                  type="text"
                                  value={customCity}
                                  onChange={(e) => setCustomCity(e.target.value)}
                                  placeholder="Entrez votre ville..."
                                  className="w-full bg-white border border-[#EDE5E0] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#ba4e1a]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-neutral-600 mb-1.5">
                                L&apos;adresse exacte
                              </label>
                              <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Numéro de maison, rue, quartier..."
                                className="w-full bg-white border border-[#EDE5E0] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#ba4e1a]"
                              />
                            </div>
                          </>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-neutral-600 mb-1.5">
                                La ville
                              </label>
                              <CustomSelect
                                value={city}
                                onChange={(val) => setCity(val)}
                                options={MOROCCAN_CITIES.map((c) => ({ value: c, label: c }))}
                                searchable
                                placeholder="Sélectionnez votre ville..."
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-neutral-600 mb-1.5">
                                L&apos;adresse exacte
                              </label>
                              <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Numéro de maison, rue, quartier..."
                                className="w-full bg-white border border-[#EDE5E0] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#ba4e1a]"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Password Change Section */}
                      <div className="pt-4 border-t border-[#EDE5E0] space-y-4">
                        <h4 className="font-serif font-bold text-sm text-[#1F2937] flex items-center gap-2">
                          <Lock className="w-4 h-4 text-[#ba4e1a]" />
                          <span>Changer le Mot de Passe</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-neutral-600 mb-1">
                              Ancien Mot de Passe
                            </label>
                            <input
                              type="password"
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              className="w-full bg-white border border-[#EDE5E0] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#ba4e1a]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-neutral-600 mb-1">
                              Nouveau Mot de Passe
                            </label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full bg-white border border-[#EDE5E0] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#ba4e1a]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-neutral-600 mb-1">
                              Confirmer le nouveau Mot de Passe
                            </label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full bg-white border border-[#EDE5E0] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#ba4e1a]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ORDER ITEMS MODAL */}
      {viewingOrderItems && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#EDE5E0] shadow-2xl max-w-md w-full max-h-[85vh] h-[480px] sm:h-[520px] p-6 flex flex-col justify-between relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#EDE5E0] shrink-0">
              <div>
                <h3 className="font-serif font-bold text-base text-[#1F2937] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#ba4e1a]" />
                  <span>Produits de la commande</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Date: {viewingOrderItems.date || "14/10/2026"} • N° {viewingOrderItems.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingOrderItems(null)}
                className="group w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#ba4e1a] bg-white text-[#ba4e1a] hover:bg-[#ba4e1a] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xs cursor-pointer shrink-0"
                title="Fermer"
              >
                <X className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto space-y-3 my-3 pr-1 scrollbar-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {(viewingOrderItems.items && viewingOrderItems.items.length > 0
                ? viewingOrderItems.items
                : [
                    {
                      name: "Artisanat Marjad",
                      quantity: 1,
                      price: viewingOrderItems.total || 450,
                      image: "/decor-honeycomb-calligraphy.webp",
                    },
                  ]
              ).map((it: any, idx: number) => {
                const itemPrice = typeof it.price === "number" ? it.price : parseFloat(it.price || viewingOrderItems.total || "0");
                const itemQty = it.quantity || 1;
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-[#EDE5E0]">
                    <div className="relative w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#EDE5E0] shrink-0 shadow-xs p-1 flex items-center justify-center">
                      <img
                        src={it.image || "/decor-honeycomb-calligraphy.webp"}
                        alt={it.name}
                        className="w-full h-full object-contain rounded-xl"
                      />
                      <span
                        className="absolute -top-2.5 -right-2.5 bg-[#ba4e1a] text-white text-[11px] font-extrabold flex items-center justify-center border-2 border-white shadow-xs z-20 shrink-0 leading-none"
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          aspectRatio: "1 / 1",
                        }}
                      >
                        x{itemQty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#1F2937] line-clamp-1">{it.name || "Création Artisanale"}</h4>
                      <p className="text-[11px] text-neutral-400 font-medium mt-0.5">Quantité : {itemQty}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-serif font-extrabold text-xs text-[#ba4e1a]">
                        {(itemPrice * itemQty).toFixed(2)} DH
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Total & Facture */}
            <div className="pt-3 border-t border-[#EDE5E0] flex items-center justify-between text-xs font-bold gap-3">
              <button
                type="button"
                onClick={() => handleDownloadInvoice(viewingOrderItems)}
                disabled={downloadingInvoiceId === viewingOrderItems.id}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#6d381e] hover:text-white text-[#6d381e] font-bold text-xs border border-[#E9DCD5] transition cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed group"
                title="Télécharger la facture PDF"
              >
                {downloadingInvoiceId === viewingOrderItems.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                )}
                <span>{downloadingInvoiceId === viewingOrderItems.id ? "Génération..." : "Facture PDF"}</span>
              </button>

              <div className="text-right">
                <span className="text-neutral-500 block text-[10px] font-medium uppercase">Montant Total</span>
                <span className="font-serif font-extrabold text-base text-[#1F2937]">
                  {(typeof viewingOrderItems.total === "number" ? viewingOrderItems.total : parseFloat(viewingOrderItems.total || "0")).toFixed(2)} DH
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
