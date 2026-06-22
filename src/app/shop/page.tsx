import type { Metadata } from "next";
import ProductGrid from "@/components/shop/ProductGrid";

export const metadata: Metadata = {
  title: "Shop — All Pieces",
  description:
    "Browse Elyara's complete collection of handcrafted bespoke Indian fashion. Filter by category and discover pieces made to order for your exact form.",
};

interface ShopPageProps {
  searchParams: Promise<{ filter?: string; category?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const { filter, category } = params;

  const titleMap: Record<string, string> = {
    new: "New Arrivals",
    bestseller: "Bestsellers",
  };

  const pageTitle = filter ? titleMap[filter] : category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Pieces";

  return (
    <div className="bg-[#faf8f4] min-h-screen">
      {/* Page Header */}
      <div className="bg-[#1a2744] py-16 px-6 text-center">
        <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-medium mb-2">Elyara Atelier</p>
        <h1 className="text-4xl font-serif font-light text-white">{pageTitle}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <ProductGrid initialCategory={category || "all"} initialFilter={filter} />
      </div>
    </div>
  );
}
