"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PRODUCTS, CATEGORIES } from "@/lib/data";

const STATUS_LABELS: Record<string, string> = {
  available: "Available",
  "made-to-order": "Made to Order",
  "sold-out": "Sold Out",
  limited: "Limited",
};

const STATUS_COLORS: Record<string, string> = {
  available: "text-emerald-700 bg-emerald-50",
  "made-to-order": "text-[#1a2744] bg-[#e8e0d0]",
  "sold-out": "text-red-600 bg-red-50",
  limited: "text-[#c9a96e] bg-[#c9a96e]/10",
};

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "new", label: "New Arrivals" },
];

interface ProductGridProps {
  initialCategory?: string;
  initialFilter?: string;
}

export default function ProductGrid({ initialCategory = "all", initialFilter }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sort, setSort] = useState("featured");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) =>
      activeCategory === "all" ? true : p.category === activeCategory
    );

    if (initialFilter === "new") list = list.filter((p) => p.isNew);
    if (initialFilter === "bestseller") list = list.filter((p) => p.isBestseller);

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "new") list = [...list].filter((p) => p.isNew).concat(list.filter((p) => !p.isNew));

    return list;
  }, [activeCategory, sort, initialFilter]);

  return (
    <div>
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8 pb-6 border-b border-[#e8e0d0]">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-xs tracking-[0.15em] uppercase font-medium px-4 py-2 transition-colors ${
                activeCategory === cat.id
                  ? "bg-[#1a2744] text-white"
                  : "bg-transparent text-[#1a2744]/60 hover:text-[#1a2744] border border-[#e8e0d0] hover:border-[#1a2744]/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <label htmlFor="sort" className="text-xs text-[#1a2744]/50 uppercase tracking-wide whitespace-nowrap">Sort by</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-xs text-[#1a2744] border border-[#e8e0d0] bg-transparent px-3 py-2 focus:outline-none focus:border-[#c9a96e] cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-[#1a2744]/50 tracking-wide mb-6">
        {filtered.length} piece{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-[#1a2744]/40 text-lg font-serif">No pieces found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
            >
              <Link
                href={`/shop/${product.id}`}
                className="group block"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
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
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isNew && (
                      <span className="bg-[#1a2744] text-white text-[9px] tracking-[0.2em] uppercase font-bold px-2 py-1">New</span>
                    )}
                    {product.isBestseller && (
                      <span className="bg-[#c9a96e] text-[#1a2744] text-[9px] tracking-[0.2em] uppercase font-bold px-2 py-1">Bestseller</span>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      type="button"
                      onClick={() => window.location.href = `/shop/${product.id}`}
                      className="block w-full bg-[#1a2744] text-white text-xs tracking-[0.2em] uppercase font-medium py-3 text-center hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
                    >
                      {product.isCustomizable ? "Customise & Buy" : "View Piece"}
                    </button>
                  </div>
                  {/* <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Link
                      href={`/shop/${product.id}`}
                      className="block w-full bg-[#1a2744] text-white text-xs tracking-[0.2em] uppercase font-medium py-3 text-center hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
                    >
                      {product.isCustomizable ? "Customise & Buy" : "View Piece"}
                    </Link>
                  </div> */}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a96e] font-medium">{product.collection}</p>
                  <h3 className="text-sm font-medium text-[#1a2744] leading-snug group-hover:text-[#c9a96e] transition-colors">{product.name}</h3>
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
                  <span className={`inline-block text-[9px] tracking-[0.15em] uppercase font-medium px-2 py-0.5 rounded-sm ${STATUS_COLORS[product.status]}`}>
                    {STATUS_LABELS[product.status]}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
