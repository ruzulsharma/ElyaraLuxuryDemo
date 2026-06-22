import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS, PRODUCTS } from "@/lib/data";

interface CollectionPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { id } = await params;
  const collection = COLLECTIONS.find((c) => c.id === id);
  if (!collection) return { title: "Collection Not Found" };
  return {
    title: collection.name,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { id } = await params;
  const collection = COLLECTIONS.find((c) => c.id === id);
  if (!collection) notFound();

  const products = PRODUCTS.filter((p) => p.collection.toLowerCase().replace(/\s+/g, "-") === id || p.collection === collection.name);

  return (
    <div className="bg-[#faf8f4] min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden bg-[#1a2744]">
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          className="object-cover opacity-50"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2744]/80 to-[#1a2744]/20" />
        <div className="relative z-10 h-full flex items-end pb-12 px-6">
          <div className="max-w-7xl mx-auto w-full">
            <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-medium mb-2">
              {collection.year} · {collection.pieceCount} Pieces
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-light text-white mb-2">{collection.name}</h1>
            <p className="text-white/60 text-lg font-serif italic">{collection.tagline}</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/shop/${product.id}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#e8e0d0] mb-4">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] font-medium mb-1">{product.collection}</p>
              <h3 className="text-sm font-medium text-[#1a2744] group-hover:text-[#c9a96e] transition-colors mb-1">{product.name}</h3>
              <p className="text-sm font-semibold text-[#1a2744]">₹{product.price.toLocaleString("en-IN")}</p>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#1a2744]/40 font-serif text-xl">Coming soon.</p>
            <Link href="/custom-order" className="mt-6 inline-block text-sm text-[#c9a96e] underline">
              Place a custom order →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
