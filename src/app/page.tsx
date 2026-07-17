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

export const metadata: Metadata = {
  title: "Elyara by Sweety — Bespoke Indian Luxury Fashion",
  description:
    "Shop bespoke Indian luxury fashion by Elyara. Avant-garde silhouettes handcrafted to your measurements at our Noida atelier. Custom orders welcome.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCollections />
      <GoldDivider />
      <FeaturedProducts />
      <StatsSection />
      <CustomOrderBanner />
      <GoldDivider className="bg-[#faf8f4]" />
      <BrandStory />
      <GoldDivider className="bg-[#faf8f4]" />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
