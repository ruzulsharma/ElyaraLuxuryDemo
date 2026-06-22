"use client";
import { LuxuryHeroProps } from "../types/types";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LuxuryHero({ onRequestAcquisition, currentDrop }: LuxuryHeroProps) {
  const [isHovered, setIsHovered] = useState(false);
  // FIX 1: Added the missing time state
  const [time, setTime] = useState<string>(""); 

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#090909] text-[#f5f5f5] font-sans p-8 md:p-16 flex flex-col justify-between">
      
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#2e2e2e] pb-8 gap-6 text-xs md:text-sm tracking-[0.25em] uppercase text-[#a3a3a3]"
      >
        <div className="flex flex-wrap items-center gap-6 md:gap-12">
          <span className="font-semibold text-white tracking-[0.3em] text-sm md:text-base">{currentDrop.designer}</span>
          <span className="text-[#737373] hidden sm:inline">LOC // 28.4595° N, 77.0266° E</span>
        </div>
        <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-12">
          <span className="font-medium text-[#c2c2c2]">{currentDrop.collection}</span>
          <span className="tabular-nums font-mono font-medium text-white bg-[#1c1c1c] px-3 py-1 border border-[#3a3a3a] rounded-sm">{time} IST</span>
        </div>
      </motion.header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 my-auto pt-16 pb-16 items-center w-full max-w-7xl mx-auto">
        <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 bg-[#1a1313] border border-[#4a1d1d] text-[#ff7373] px-4 py-2 text-xs md:text-sm tracking-[0.2em] font-mono uppercase font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse"></span>
              LIMITED LEAF // {currentDrop.piecesRemaining.toString().padStart(2, '0')} OF {currentDrop.totalEditions.toString().padStart(2, '0')} PIECES LEFT
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.1] uppercase">
              {currentDrop.item}
            </h1>
            
            <p className="text-base sm:text-lg text-[#d4d4d4] leading-relaxed font-light max-w-xl">
              {currentDrop.details}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-8 border-t border-[#2e2e2e] pt-8 mt-4">
              <div className="flex flex-col min-w-[140px]">
                <span className="text-xs tracking-widest text-[#737373] uppercase mb-1 font-medium">VALUATION</span>
                <span className="text-2xl sm:text-3xl font-light text-white font-mono tracking-wide">{currentDrop.price}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#ffffff", color: "#000000" }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={onRequestAcquisition}
                className="flex-1 bg-transparent border-2 border-white text-white py-5 px-8 text-sm uppercase tracking-[0.25em] font-bold transition-colors duration-300 cursor-pointer shadow-lg active:scale-95"
              >
                REQUEST ACQUISITION
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full aspect-[3/4] max-w-lg lg:max-w-2xl bg-[#141414] border-2 border-[#2e2e2e] overflow-hidden shadow-2xl"
          >
            {/* ... rest of your UI elements ... */}
            
            <div className="w-full h-full relative">
              <motion.img 
                // FIX 2: Removed "src/" from the path. Next.js serves from /public/ automatically.
                src="/assets/hero_files/main1.jpg" 
                alt="Bespoke Avant-Garde Tailored Garment"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full object-cover brightness-[0.9] contrast-[1.1]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-[#2e2e2e] pt-8 text-xs tracking-widest text-[#737373] uppercase font-medium">
        {/* Footer content remains same */}
      </footer>
    </div>
  );
}