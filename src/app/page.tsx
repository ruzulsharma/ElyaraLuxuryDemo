import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import StatsSection from "@/components/home/StatsSection";
import CustomOrderBanner from "@/components/home/CustomOrderBanner";
import BrandStory from "@/components/home/BrandStory";
import Testimonials from "@/components/home/Testimonials";
import NewsletterSection from "@/components/home/NewsletterSection";
import GoldDivider from "@/components/ui/GoldDivider";
import ScrollMarquee from "@/components/ui/ScrollMarquee";

export const metadata: Metadata = {
  title: "Elyara by Sweety — Bespoke Indian Luxury Fashion",
  description:
    "Shop bespoke Indian luxury fashion by Elyara. Avant-garde silhouettes handcrafted to your measurements at our Noida atelier. Custom orders welcome.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      {/* Scroll-velocity marquee strip */}
      <ScrollMarquee />
      <FeaturedCollections />
      <GoldDivider />
      <FeaturedProducts />
      <StatsSection />
      <CustomOrderBanner />
      <GoldDivider className="bg-[#faf8f4]" />
      <BrandStory />
      {/* Second marquee between brand story and testimonials */}
      <ScrollMarquee className="bg-[#f5f0e8] border-y border-[#e8e0d0]" />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
