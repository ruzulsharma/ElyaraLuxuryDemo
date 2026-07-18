import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import CartSidebar from "@/components/cart/CartSidebar";
import { CartProvider } from "@/context/CartContext";
import PageIntro from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Elyara by Sweety — Bespoke Indian Luxury Fashion",
    template: "%s | Elyara by Sweety",
  },
  description:
    "Elyara by Sweety is a Noida-based luxury atelier crafting bespoke Indian fashion. Avant-garde silhouettes, handcrafted to your measurements. Shop our curated collections.",
  keywords: [
    "Elyara by Sweety",
    "bespoke Indian fashion",
    "luxury women's clothing India",
    "custom tailored garments Noida",
    "avant-garde Indian fashion",
    "handcrafted designer wear",
    "made to order clothing India",
    "custom fashion Noida atelier",
  ],
  authors: [{ name: "Sweety — Elyara" }],
  creator: "Elyara by Sweety",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://elyarabysweety.com",
    siteName: "Elyara by Sweety",
    title: "Elyara by Sweety — Bespoke Indian Luxury Fashion",
    description:
      "Avant-garde bespoke Indian fashion. Handcrafted to your exact measurements at our Noida atelier.",
    images: [
      {
        url: "/assets/Logo.jpg",
        width: 1200,
        height: 630,
        alt: "Elyara by Sweety",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elyara by Sweety — Bespoke Indian Luxury Fashion",
    description: "Avant-garde bespoke Indian fashion. Handcrafted to your exact measurements.",
    images: ["/assets/Logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/assets/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data — Organization + Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ClothingStore",
              name: "Elyara by Sweety",
              alternateName: "Elyara",
              description:
                "Bespoke Indian luxury fashion atelier specializing in custom-tailored avant-garde silhouettes, coord sets, and designer couture.",
              url: "https://elyarabysweety.com",
              logo: "https://elyarabysweety.com/assets/Logo.jpg",
              image: "https://elyarabysweety.com/assets/hero_files/main1.jpg",
              telephone: "+918796134073",
              email: "elyarabysweety@gmail.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Noida",
                addressRegion: "Uttar Pradesh",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 28.5355,
                longitude: 77.391,
              },
              sameAs: [
                "https://instagram.com/elyarabysweety",
              ],
              priceRange: "₹₹₹",
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "11:00",
                closes: "20:00",
              },
            }),
          }}
        />
      </head>
      <body className="bg-[#faf8f4] text-[#1a2744] antialiased">
        <PageIntro />
        <CartProvider>
          <Navbar />
          <CartSidebar />
          {/* pb-16 on mobile for bottom nav clearance */}
          <main id="main-content" className="pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
