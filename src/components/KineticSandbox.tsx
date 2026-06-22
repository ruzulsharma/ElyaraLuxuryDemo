"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOOKBOOK_ITEMS = [
  {
    id: "01",
    collection: "COLLECTION 01 // ARTIFACTS",
    title: "THE ASYMMETRIC MOTO CAPE",
    description: "Sculpted with premium heavy twill structure and an ultra-fluid raw silk lining. Designed to react beautifully to movement while maintaining an imposing, sharp posture.",
    valuation: "Ref // 48,000 INR",
    image: "public/assets/hero_files/elyara.jpg"
  },
  {
    id: "02",
    collection: "COLLECTION 01 // ARTIFACTS",
    title: "THE SHARP GEOMETRIC COAT",
    description: "Crafted from highly rigid sculpted wool. Features signature asymmetric clean lines, hand-tailored seams, and raw edge finishing that subverts traditional tailoring standards.",
    valuation: "Ref // 65,000 INR",
    image: "public/assets/hero_files/Hero2.jpg"
  },
  {
    id: "03",
    collection: "COLLECTION 01 // ARTIFACTS",
    title: "THE OBSIDIAN DRAPE LAYER",
    description: "Constructed with lightweight matte obsidian fabric. It cascades fluidly across physical geometry, casting deep architectural shadows with every stride.",
    valuation: "Ref // 42,000 INR",
    image: "public/assets/hero_files/main2.jpg"
  }
];

export default function KineticSandbox() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % LOOKBOOK_ITEMS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + LOOKBOOK_ITEMS.length) % LOOKBOOK_ITEMS.length);
  };

  const currentItem = LOOKBOOK_ITEMS[currentIndex];

  return (
    <section className="bg-[#090909] text-white py-16 md:py-24 border-t border-[#2e2e2e]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* RUNWAY ROW HEADER */}
        <div className="flex justify-between items-center border-b-2 border-[#2e2e2e] pb-6 mb-12">
          <div>
            <span className="text-xs font-mono tracking-[0.3em] text-[#ff5252] uppercase block font-bold mb-1">
              ATELIER EXHIBITION
            </span>
            <span className="text-sm uppercase tracking-widest text-[#e5e5e5]">
              {currentItem.collection}
            </span>
          </div>
          <div className="font-mono text-sm font-bold text-[#ff5252]">
            {currentItem.id} // 0{LOOKBOOK_ITEMS.length}
          </div>
        </div>

        {/* FULL HORIZONTAL LANDSCAPE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
          
          {/* LEFT PANEL: TALL CINEMATIC MEDIA CONTAINER (Takes 7/12th of screen width) */}
          <div className="md:col-span-7 w-full aspect-[4/5] sm:aspect-[16/10] md:aspect-[4/5] bg-[#121212] border-2 border-[#2e2e2e] overflow-hidden shadow-2xl relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={currentItem.image}
                alt={currentItem.title}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full h-full object-cover brightness-[0.85] contrast-[1.05]"
              />
            </AnimatePresence>
          </div>

          {/* RIGHT PANEL: BALANCED TEXT DETAILS (Takes 5/12th of screen width) */}
          <div className="md:col-span-5 flex flex-col justify-between h-full py-4 space-y-8 md:space-y-12">
            
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="font-mono text-xs text-[#ff5252] uppercase tracking-widest block font-bold">
                  DESIGN PROFILE // INDEXED
                </span>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight uppercase text-white leading-tight">
                  {currentItem.title}
                </h3>
              </div>

              <div className="font-mono text-xl text-white font-semibold border-b border-[#2e2e2e] pb-4">
                {currentItem.valuation}
              </div>

              <p className="text-base sm:text-lg text-[#cbd5e1] font-normal leading-relaxed">
                {currentItem.description}
              </p>
            </div>

            {/* INTERACTIVE ROW NAVIGATION SYSTEM */}
            <div className="pt-8 border-t border-[#2e2e2e] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <span className="text-xs font-mono tracking-widest text-[#a3a3a3]">
                STU_RECORD // ED_VAR_01
              </span>
              
              <div className="flex gap-4 w-full sm:w-auto">
                <button 
                  onClick={prevSlide}
                  className="flex-1 sm:flex-none border-2 border-white text-white hover:bg-white hover:text-black transition-colors px-6 py-3 text-xs font-mono font-bold uppercase cursor-pointer text-center"
                >
                  ← PREV
                </button>
                <button 
                  onClick={nextSlide}
                  className="flex-1 sm:flex-none border-2 border-white text-white hover:bg-white hover:text-black transition-colors px-6 py-3 text-xs font-mono font-bold uppercase cursor-pointer text-center"
                >
                  NEXT →
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}