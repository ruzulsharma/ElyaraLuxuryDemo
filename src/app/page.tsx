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
import { getFeaturedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Elyara by Sweety — Bespoke Indian Luxury Fashion",
  description:
    "Shop bespoke Indian luxury fashion by Elyara. Avant-garde silhouettes handcrafted to your measurements at our Noida atelier. Custom orders welcome.",
};

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <HeroSection />
      <ScrollMarquee className="bg-[#faf8f4] border-b border-[#e8e0d0]" />
      <FeaturedCollections />
      <GoldDivider />
      <FeaturedProducts products={featuredProducts} />
      <StatsSection />
      <ScrollMarquee className="bg-[#f5f0e8] border-y border-[#e8e0d0]" baseSpeed={0.3} />
      <CustomOrderBanner />
      <GoldDivider className="bg-[#faf8f4]" />
      <BrandStory />
      <GoldDivider className="bg-[#faf8f4]" />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
