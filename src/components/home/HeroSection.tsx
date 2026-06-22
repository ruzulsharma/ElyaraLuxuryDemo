"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const HERO_SLIDES = [
  {
    image: "/assets/hero_files/main1.jpg",
    heading: "Wear What\nYou Imagine",
    subheading: "Bespoke Indian fashion, handcrafted for your form.",
    cta: { label: "Explore Collections", href: "/collections" },
  },
  {
    image: "/assets/hero_files/Hero2.jpg",
    heading: "Sculpted\nWith Intention",
    subheading: "Avant-garde silhouettes born in our Noida atelier.",
    cta: { label: "Custom Order", href: "/custom-order" },
  },
  {
    image: "/assets/hero_files/main2.jpg",
    heading: "Your Form,\nOur Art",
    subheading: "Every stitch is a conversation between craft and you.",
    cta: { label: "Shop Now", href: "/shop" },
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden bg-[#1a2744]" aria-label="Hero">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.heading}
            fill
            className="object-cover object-center"
            priority={currentSlide === 0}
            sizes="100vw"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2744]/80 via-[#1a2744]/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl"
            >
              <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-medium mb-4">
                Elyara by Sweety
              </p>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-white leading-[1.1] whitespace-pre-line mb-6">
                {slide.heading}
              </h1>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-10 max-w-sm">
                {slide.subheading}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={slide.cta.href}
                  className="inline-block bg-[#c9a96e] text-[#1a2744] text-xs tracking-[0.25em] uppercase font-bold px-8 py-4 hover:bg-[#b8935a] transition-colors"
                >
                  {slide.cta.label}
                </Link>
                <Link
                  href="/custom-order"
                  className="inline-block border border-white/50 text-white text-xs tracking-[0.25em] uppercase font-medium px-8 py-4 hover:bg-white/10 transition-colors"
                >
                  Custom Order
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === currentSlide ? "w-8 h-2 bg-[#c9a96e]" : "w-2 h-2 bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Scroll Hint */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2 text-white/40"
      >
        <span className="text-[9px] tracking-[0.3em] uppercase rotate-90 origin-center mb-4">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}
