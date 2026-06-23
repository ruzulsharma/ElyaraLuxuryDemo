"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BrandStory() {
  return (
    <section className="bg-[#f5f0e8] py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-square max-w-lg mx-auto lg:mx-0"
        >
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src="/assets/hero_files/elyara.jpg"
              alt="Sweety Chauhan — Designer and Founder of ELYARA"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 45vw"
            />
          </div>
          {/* Accent box */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-[#c9a96e] -z-10" />
          <div className="absolute -top-4 -left-4 w-16 h-16 border border-[#1a2744]/20 -z-10" />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <p className="text-xs tracking-[0.35em] uppercase text-[#c9a96e] font-medium">The Story</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1a2744] leading-snug">
            Elyara was born from<br />an obsession with form.
          </h2>
          <div className="space-y-4 text-[#3a3a3a] leading-relaxed">
            <p>
              Founded by Sweety, Elyara is a Noida-based atelier that believes fashion is architecture for the body. Every piece starts as a raw sketch on vellum, evolves through meticulous pattern-making, and is finished entirely by hand.
            </p>
            <p>
              We fuse the rich heritage of Indian textile craft with avant-garde structural silhouettes — creating garments that feel as significant as they look. No mass production. No shortcuts. Just craft.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 py-6 border-t border-b border-[#1a2744]/10">
            {[
              { value: "100%", label: "Handcrafted" },
              { value: "7–14", label: "Days per piece" },
              { value: "∞", label: "Custom fits" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-serif font-light text-[#1a2744]">{stat.value}</p>
                <p className="text-xs tracking-wide text-[#1a2744]/50 uppercase mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1a2744] hover:text-[#c9a96e] transition-colors group"
          >
            Read Our Story
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
