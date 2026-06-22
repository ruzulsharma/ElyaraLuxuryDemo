import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore Elyara's curated collections — avant-garde Indian fashion handcrafted at our Noida atelier. Each collection tells a story of structure, silhouette, and soul.",
};

export default function CollectionsPage() {
  return (
    <div className="bg-[#faf8f4] min-h-screen">
      {/* Header */}
      <div className="bg-[#1a2744] py-20 px-6 text-center">
        <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-medium mb-2">Our Work</p>
        <h1 className="text-4xl sm:text-5xl font-serif font-light text-white mb-4">Collections</h1>
        <p className="text-white/50 text-sm max-w-md mx-auto">
          Each Elyara collection is a chapter — a study in structure, silhouette, and the art of slow fashion.
        </p>
      </div>

      {/* Collections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {COLLECTIONS.map((collection, idx) => (
          <div
            key={collection.id}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
          >
            {/* Image */}
            <div className={`${idx % 2 === 1 ? "lg:order-2" : ""}`}>
              <Link href={`/collections/${collection.id}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e0d0]">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-[#1a2744]/20 group-hover:bg-[#1a2744]/30 transition-colors" />
                </div>
              </Link>
            </div>

            {/* Text */}
            <div className={`space-y-5 ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] font-medium mb-1">
                  {collection.year} · {collection.pieceCount} Pieces
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1a2744] mb-2">{collection.name}</h2>
                <p className="text-lg text-[#c9a96e] font-serif italic">{collection.tagline}</p>
              </div>
              <p className="text-[#3a3a3a] leading-relaxed">{collection.description}</p>
              <div className="flex gap-4">
                <Link
                  href={`/collections/${collection.id}`}
                  className="inline-block bg-[#1a2744] text-white text-xs tracking-[0.25em] uppercase font-bold px-8 py-4 hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
                >
                  Explore Collection
                </Link>
                <Link
                  href="/custom-order"
                  className="inline-block border-2 border-[#1a2744] text-[#1a2744] text-xs tracking-[0.25em] uppercase font-bold px-6 py-4 hover:bg-[#1a2744] hover:text-white transition-colors"
                >
                  Custom Order
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
