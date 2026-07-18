import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProducts, getFeaturedProducts } from "@/lib/products";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: false },
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").toLowerCase();
  const allProducts = await getProducts();
  const featured = await getFeaturedProducts();

  const results = query
    ? allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.collection.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-serif text-[#1a2744] mb-8 uppercase tracking-wide">
        {query
          ? results.length > 0
            ? `Results for: "${q}"`
            : `No results for: "${q}"`
          : "Search"}
      </h1>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="group cursor-pointer block"
            >
              <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-[#e8e0d0]">
                {product.images[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                )}
              </div>
              <h3 className="font-medium text-[#1a2744]">{product.name}</h3>
              <p className="text-sm text-[#c9a96e]">₹{product.price.toLocaleString("en-IN")}</p>
            </Link>
          ))}
        </div>
      ) : query ? (
        <div className="flex flex-col items-center py-10 border border-[#e8e0d0] bg-[#faf8f4]">
          <p className="text-[#3a3a3a] mb-8">We couldn&apos;t find any products matching &quot;{q}&quot;.</p>
          <div className="w-full">
            <h2 className="text-center text-lg uppercase tracking-widest text-[#1a2744] mb-8">
              You might also like
            </h2>
            <FeaturedProducts products={featured} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
