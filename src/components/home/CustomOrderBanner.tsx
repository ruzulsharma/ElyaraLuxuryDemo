"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PROCESS_STEPS } from "@/lib/data";

export default function CustomOrderBanner() {
  return (
    <section className="bg-[#1a2744] text-white py-20 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div>
              <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-medium mb-3">
                Bespoke Service
              </p>
              <h2 className="text-3xl sm:text-5xl font-serif font-light leading-tight mb-4">
                Made Exactly
                <br />
                <span className="text-[#c9a96e]">For Your Form</span>
              </h2>
              <p className="text-white/60 text-base leading-relaxed max-w-md">
                Every Elyara piece can be tailored to your exact measurements. Give us your waist, length, rise, and unique requirements — we&apos;ll modify the pattern to ensure a perfect fit.
              </p>
            </div>

            {/* Process Steps */}
            <div className="grid grid-cols-2 gap-5">
              {PROCESS_STEPS.map((step) => (
                <div key={step.num} className="space-y-1.5">
                  <span className="font-serif text-3xl font-light text-[#c9a96e]/40">{step.num}</span>
                  <h3 className="text-sm font-medium tracking-wide text-white">{step.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>

            <Link
              href="/custom-order"
              className="inline-flex items-center gap-3 bg-[#c9a96e] text-[#1a2744] text-xs tracking-[0.25em] uppercase font-bold px-8 py-4 hover:bg-[#b8935a] transition-colors"
            >
              Start Custom Order
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>

          {/* Right — Image Collage */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[500px] hidden lg:block"
          >
            <div className="absolute top-0 left-0 w-3/5 h-3/4 overflow-hidden border-4 border-[#c9a96e]/20">
              <Image
                src="/assets/hero_files/Hero1.jpg"
                alt="Custom tailoring at Elyara Atelier"
                fill
                className="object-cover"
                sizes="30vw"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-2/3 h-3/5 overflow-hidden border-4 border-[#c9a96e]/20">
              <Image
                src="/assets/hero_files/elyara.jpg"
                alt="Handcrafted Elyara garment"
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
            {/* Gold accent element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-[#c9a96e] rotate-45 opacity-30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
