import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
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
    url: "https://elyara.in",
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
    icon: "assets/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#faf8f4] text-[#1a2744] antialiased">
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
