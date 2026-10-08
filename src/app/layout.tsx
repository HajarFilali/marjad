import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Amiri, Cinzel } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { PromoBar } from "@/components/layout/PromoBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistDrawer } from "@/components/cart/WishlistDrawer";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

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
      className={`${jakartaSans.variable} ${playfair.variable} ${cinzel.variable} ${amiri.variable} h-full scroll-smooth`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var y=window.scrollY;var hasHash=!!window.location.hash;if(y>40||hasHash){document.documentElement.classList.add('is-scrolled-page');}else{document.documentElement.classList.remove('is-scrolled-page');}function saveY(){try{var sy=window.scrollY;sessionStorage.setItem('marjad_scrolled',String(sy));if(sy>40||!!window.location.hash){document.documentElement.classList.add('is-scrolled-page');}else if(sy<35&&!window.location.hash){document.documentElement.classList.remove('is-scrolled-page');}}catch(e){}}window.addEventListener('scroll',saveY,{passive:true});window.addEventListener('beforeunload',saveY);}catch(e){}})();`,
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
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
