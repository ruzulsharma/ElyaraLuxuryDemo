"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PRODUCTS } from "@/lib/data";

const STATUS_LABELS: Record<string, string> = {
  available: "Available",
  "made-to-order": "Made to Order",
  "sold-out": "Sold Out",
  limited: "Limited Pieces",
};

const STATUS_COLORS: Record<string, string> = {
  available: "text-emerald-700 bg-emerald-50",
  "made-to-order": "text-[#1a2744] bg-[#e8e0d0]",
  "sold-out": "text-red-600 bg-red-50",
  limited: "text-[#c9a96e] bg-[#c9a96e]/10",
};

export default function FeaturedProducts() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const featured = PRODUCTS.slice(0, 4);

  return (
    <section className="bg-[#f5f0e8] py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-[#c9a96e] font-medium mb-2">Curated For You</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1a2744] leading-tight">
              Featured Pieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs tracking-[0.2em] uppercase text-[#1a2744]/60 hover:text-[#1a2744] transition-colors border-b border-[#1a2744]/20 pb-0.5 self-start sm:self-auto"
          >
            Shop All →
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/shop/${product.id}`}
                className="group block"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#e8e0d0] mb-4">
                  <Image
                    src={
                      hoveredId === product.id && product.images[1]
                        ? product.images[1]
                        : product.images[0]
                    }
                    alt={product.name}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isNew && (
                      <span className="bg-[#1a2744] text-white text-[9px] tracking-[0.2em] uppercase font-bold px-2 py-1">
                        New
                      </span>
                    )}
                    {product.isBestseller && (
                      <span className="bg-[#c9a96e] text-[#1a2744] text-[9px] tracking-[0.2em] uppercase font-bold px-2 py-1">
                        Bestseller
                      </span>
                    )}
                  </div>

                  {/* Quick Add */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      className="w-full bg-[#1a2744] text-white text-xs tracking-[0.2em] uppercase font-medium py-3 hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        // Add to cart logic
                      }}
                    >
                      {product.isCustomizable ? "Customise & Buy" : "Quick Add"}
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a96e] font-medium">
                    {product.collection}
                  </p>
                  <h3 className="text-sm font-medium text-[#1a2744] leading-snug group-hover:text-[#c9a96e] transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#1a2744]">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-[#1a2744]/40 line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <span
                    className={`inline-block text-[9px] tracking-[0.15em] uppercase font-medium px-2 py-0.5 rounded-sm ${STATUS_COLORS[product.status]}`}
                  >
                    {STATUS_LABELS[product.status]}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
