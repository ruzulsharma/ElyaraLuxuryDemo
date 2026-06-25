"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const HERO_CONTENT = [
  {
    heading: "Wear What\nYou Imagine",
    subheading: "Bespoke Indian fashion, handcrafted for your form.",
    cta: { label: "Explore Collection", href: "/shop" },
  },
  {
    heading: "Sculpted\nWith Intention",
    subheading: "Avant-garde silhouettes born in our Noida atelier.",
    cta: { label: "Custom Order", href: "/custom-order" },
  },
  {
    heading: "Your Form,\nOur Art",
    subheading: "Every stitch is a conversation between craft and you.",
    cta: { label: "View Lookbook", href: "/collections" },
  },
];

// Rotate text overlay every 5s independently of the video loop
export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [textIdx, setTextIdx] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Cycle text
  useEffect(() => {
    const t = setInterval(() => {
      setTextIdx((prev) => (prev + 1) % HERO_CONTENT.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Try to play the video; handles autoplay policy gracefully
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.play().catch(() => {
      // Autoplay blocked — video will show poster/static
    });
  }, []);

  const content = HERO_CONTENT[textIdx];

  return (
    <section
      className="relative h-[90vh] min-h-[600px] overflow-hidden bg-[#1a2744]"
      aria-label="Hero"
    >
      {/* ── Video background ── */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
        src="/assets/Vid/Vid1.MP4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/assets/hero_files/main1.jpg"
        onCanPlay={() => setVideoLoaded(true)}
        aria-hidden="true"
      />

      {/* Fallback gradient while video loads */}
      {!videoLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2744] via-[#2d3f6b] to-[#1a2744]" />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a2744]/80 via-[#1a2744]/50 to-[#1a2744]/20" />

      {/* ── Text content ── */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={textIdx}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl"
            >
              <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-medium mb-4">
                Elyara by Sweety
              </p>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-white leading-[1.1] whitespace-pre-line mb-6">
                {content.heading}
              </h1>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-10 max-w-sm">
                {content.subheading}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={content.cta.href}
                  className="inline-block bg-[#c9a96e] text-[#1a2744] text-xs tracking-[0.25em] uppercase font-bold px-8 py-4 hover:bg-[#b8935a] transition-colors"
                >
                  {content.cta.label}
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

      {/* ── Text dots ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {HERO_CONTENT.map((_, i) => (
          <button
            key={i}
            onClick={() => setTextIdx(i)}
            aria-label={`Show slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === textIdx ? "w-8 h-2 bg-[#c9a96e]" : "w-2 h-2 bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* ── Scroll hint ── */}
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
