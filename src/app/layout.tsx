import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { Montserrat, Amiri } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { PromoBar } from "@/components/layout/PromoBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistDrawer } from "@/components/cart/WishlistDrawer";
import { MetaPixel } from "@/components/common/MetaPixel";

// 1. Font Éditorial Luxe & Titres (30%) : Georgia Regular, Italic & Bold
const georgia = localFont({
  src: [
    {
      path: "../../public/fonts/Georgia-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Georgia-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Georgia-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Georgia-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-georgia",
  display: "swap",
});

// 2. Font Principal UI, Textes & Navigation (70%) : Montserrat Regular, Medium, SemiBold & Bold
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// 3. Font Arabe (En attente du choix de l'utilisateur) : Amiri
const amiri = Amiri({
  variable: "--font-arabic",
  weight: ["400", "700"],
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "MARJAD | Artisanat & Décoration Traditionnelle Marocaine",
  description:
    "Boutique d'artisanat marocain d'exception : Tapis Beni Ourain, luminaires en cuivre ciselé, zellige de Fès, poterie et maroquinerie faits main.",
  keywords: [
    "artisanat marocain",
    "décoration marocaine",
    "tapis berbère",
    "beni ourain",
    "zellige fès",
    "lanterne cuivre marrakech",
    "pouf cuir marocain",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${georgia.variable} ${montserrat.variable} ${amiri.variable} h-full`}
    >
      <head>
        <Script
          id="scroll-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var y=window.scrollY;var hasHash=!!window.location.hash;if(y>40||hasHash){document.documentElement.classList.add('is-scrolled-page');}else{document.documentElement.classList.remove('is-scrolled-page');}var ticking=false;function updateClass(){if(window.scrollY>40||!!window.location.hash){document.documentElement.classList.add('is-scrolled-page');}else if(window.scrollY<35&&!window.location.hash){document.documentElement.classList.remove('is-scrolled-page');}ticking=false;}function saveY(){if(!ticking){window.requestAnimationFrame(updateClass);ticking=true;}}window.addEventListener('scroll',saveY,{passive:true});window.addEventListener('beforeunload',function(){try{sessionStorage.setItem('marjad_scrolled',String(window.scrollY));}catch(e){}});}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#ffffff] text-[#000000] antialiased">
        <CartProvider>
          <WishlistProvider>
            {/* Top Promo Bar (Black background with right-to-left marquee) */}
            <PromoBar />
            {/* Navbar (Logo, 4 Links in French, Cart, Wishlist, FR/AR toggle) */}
            <Navbar />
            <main className="flex-1">{children}</main>
            {/* Footer */}
            <Footer />
            {/* Interactive Cart Drawer */}
            <CartDrawer />
            {/* Interactive Wishlist Drawer */}
            <WishlistDrawer />
            {/* Dynamic Meta Pixel Script */}
            <MetaPixel />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
