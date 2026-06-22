"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/types/types";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const savings = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-xs text-[#1a2744]/50 mb-8 flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#1a2744]">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#1a2744]">Shop</Link>
        <span>/</span>
        <span className="text-[#1a2744]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden bg-[#e8e0d0]">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-[#1a2744] text-white text-[9px] tracking-[0.2em] uppercase font-bold px-2 py-1">New</span>
            )}
            {savings > 0 && (
              <span className="absolute top-4 right-4 bg-[#c9a96e] text-[#1a2744] text-[9px] tracking-[0.2em] uppercase font-bold px-2 py-1">{savings}% Off</span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-24 overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    selectedImage === i ? "border-[#c9a96e]" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] font-medium mb-2">{product.collection}</p>
            <h1 className="text-3xl sm:text-4xl font-serif font-light text-[#1a2744] leading-snug mb-3">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl font-semibold text-[#1a2744]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-base text-[#1a2744]/40 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <p className="text-xs text-[#1a2744]/50 mt-1">Taxes Included · Shipping at checkout</p>
          </div>

          {/* Description */}
          <p className="text-sm text-[#3a3a3a] leading-relaxed border-t border-[#e8e0d0] pt-4">
            {product.description}
          </p>

          {/* Color */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-3">
                Colour: <span className="text-[#c9a96e] font-semibold">{selectedColor || "Select"}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-xs tracking-wide border transition-colors ${
                      selectedColor === color
                        ? "border-[#c9a96e] bg-[#c9a96e]/10 text-[#1a2744] font-semibold"
                        : "border-[#e8e0d0] text-[#1a2744]/60 hover:border-[#1a2744]/30"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium">
                  Size: <span className="text-[#c9a96e] font-semibold">{selectedSize || "Select"}</span>
                </p>
                <Link href="/size-guide" className="text-xs text-[#c9a96e] underline hover:no-underline">
                  Size Guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] px-3 py-2 text-xs tracking-wide border transition-colors ${
                      selectedSize === size
                        ? "border-[#c9a96e] bg-[#c9a96e]/10 text-[#1a2744] font-semibold"
                        : "border-[#e8e0d0] text-[#1a2744]/60 hover:border-[#1a2744]/30"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Measurements CTA */}
          {product.isCustomizable && (
            <div className="bg-[#f5f0e8] border border-[#e8e0d0] p-4 rounded-sm">
              <p className="text-xs font-medium text-[#1a2744] mb-1">🪡 This piece can be made to your measurements</p>
              <p className="text-xs text-[#1a2744]/60 mb-3">
                Let us know your waist, length, rise, and height. We&apos;ll modify the pattern to ensure it works perfectly for you.
              </p>
              <Link
                href={`/custom-order?product=${product.id}`}
                className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] font-semibold hover:underline"
              >
                Place Custom Order →
              </Link>
            </div>
          )}

          {/* Add to Cart */}
          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`w-full py-4 text-xs tracking-[0.25em] uppercase font-bold transition-colors ${
                !selectedSize
                  ? "bg-[#e8e0d0] text-[#1a2744]/40 cursor-not-allowed"
                  : addedToCart
                  ? "bg-emerald-600 text-white"
                  : "bg-[#1a2744] text-white hover:bg-[#c9a96e] hover:text-[#1a2744]"
              }`}
            >
              {!selectedSize ? "Select a Size" : addedToCart ? "Added to Bag ✓" : "Add to Bag"}
            </motion.button>
            <Link
              href={`/custom-order?product=${product.id}`}
              className="block w-full border-2 border-[#1a2744] text-[#1a2744] py-4 text-xs tracking-[0.25em] uppercase font-bold text-center hover:bg-[#1a2744] hover:text-white transition-colors"
            >
              Request Custom Fit
            </Link>
          </div>

          {/* Features */}
          <div className="border-t border-[#e8e0d0] pt-4 grid grid-cols-2 gap-3">
            {[
              { icon: "✂️", label: "Handcrafted" },
              { icon: "📦", label: "7–14 day delivery" },
              { icon: "🔄", label: "Easy returns" },
              { icon: "📏", label: "Custom sizing" },
            ].map((feat) => (
              <div key={feat.label} className="flex items-center gap-2 text-xs text-[#1a2744]/60">
                <span>{feat.icon}</span>
                <span>{feat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
