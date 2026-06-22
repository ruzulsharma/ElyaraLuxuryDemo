"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { COLLECTIONS } from "@/lib/data";

export default function FeaturedCollections() {
  return (
    <section className="bg-[#faf8f4] py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-[#c9a96e] font-medium mb-2">Our Work</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1a2744] leading-tight">
              Collections
            </h2>
          </div>
          <Link
            href="/collections"
            className="text-xs tracking-[0.2em] uppercase text-[#1a2744]/60 hover:text-[#1a2744] transition-colors border-b border-[#1a2744]/20 pb-0.5 self-start sm:self-auto"
          >
            View All →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COLLECTIONS.map((collection, idx) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/collections/${collection.id}`} className="group block">
                <div className="relative overflow-hidden aspect-[3/4] sm:aspect-[4/3] bg-[#e8e0d0]">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a2744]/70 via-transparent to-transparent" />

                  {/* Overlay content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase font-medium mb-1">
                      {collection.pieceCount} Pieces · {collection.year}
                    </p>
                    <h3 className="text-white font-serif text-2xl font-light mb-1">{collection.name}</h3>
                    <p className="text-white/60 text-sm leading-relaxed hidden sm:block">{collection.tagline}</p>
                  </div>

                  {/* Hover CTA */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-[#c9a96e] text-[#1a2744] text-xs tracking-[0.25em] uppercase font-bold px-6 py-3">
                      Explore Collection
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
