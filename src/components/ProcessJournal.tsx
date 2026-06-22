"use client";
import React from 'react';
import { motion } from 'framer-motion';

const journalChapters = [
  {
    num: "01",
    phase: "CHAPTER I // THE GENESIS SKETCH",
    title: "CHARCOAL & VISION",
    metric: "REF // SK_092 // GURUGRAM STUDIO",
    description: "Every piece begins in complete silence. We draft raw architectural lines on heavy-gauge vellum, deliberately distorting human proportions to create striking modern postures. This is where passion transforms into mathematical form before a single needle is ever threaded.",
    image: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTqDDcGsbbd_rtkk3ai9K8JPPVTT-Ar5uGqhOSqGGUgT1OPj8e-lkjvsU2k_YRwcT-rolbeNWvce0oJx8Y"
  },
  {
    num: "02",
    phase: "CHAPTER II // TEXTILE CURATION",
    title: "TACTILE RIGOR",
    metric: "MAT // SLK_TWL_400 // EXCLUSIVE",
    description: "Sourcing is a relentless pursuit of weight and behavior. We curate custom textiles that absorb light completely rather than reflecting it, establishing absolute obsidian depths along structural folds and preserving a sculpture-like silhouette.",
    image: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSOFJOJU6Llpecm0R3QbBsAU_xHwSoG-Dv9M0mD1gh5CvAhZBSICtamjgLK66nOOfqzim0401469KxW9hI"
  },
  {
    num: "03",
    phase: "CHAPTER III // PATTERN DESIGN",
    title: "GEOMETRIC DRAPE",
    metric: "CUT // GEO_BLOC // ATELIER HANDS",
    description: "Hand-drafting dimensional panels with rigid architectural geometry. Fabric sheets are carefully manipulated down to the millimeter, allowing them to drape naturally under their own gravity without resorting to unnecessary structural stitching.",
    image: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcSZRhUpcnxsqGq9pVHqiK-znzpUNuCW3b-rDyaduupNEJzO0nW9pL7HJXA1ayE3ufVIVOywfnN-kW7KrqM"
  }
];

export default function ProcessJournal() {
  return (
    <section className="bg-[#090909] text-white px-6 sm:px-12 md:px-24 py-32 border-t border-[#2e2e2e]">
      <div className="max-w-6xl mx-auto">
        
        {/* INTRODUCTORY MANIFESTO ZONE */}
        <div className="min-h-[45vh] flex flex-col justify-center border-b-2 border-[#2e2e2e] pb-24 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 max-w-3xl"
          >
            <span className="text-sm font-mono tracking-[0.4em] text-[#ff5252] uppercase block font-bold">
              THE BEHIND-THE-SCENES TIMELINE
            </span>
            <h2 className="text-4xl sm:text-6xl font-normal tracking-tight uppercase text-white leading-tight">
              A CRITIQUE OF PURE CRAFT.
            </h2>
            <p className="text-lg sm:text-xl text-[#e5e5e5] font-normal leading-relaxed pt-4">
              We do not produce fashion; we assemble physical architecture for the body. Every cut, drape, and stitch is documented here—an untamed testament to authentic haute couture mechanics.
            </p>
          </motion.div>
        </div>

        {/* HIGH-FASHION EDITORIAL CHRONOLOGY */}
        <div className="space-y-48 md:space-y-64">
          {journalChapters.map((chapter, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={idx}
                className="flex flex-col lg:flex-row items-center gap-12 md:gap-24 w-full"
              >
                {/* 1. TEXT METRICS INTERACTION BLOCK */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-full lg:w-5/12 space-y-6 ${!isEven ? 'lg:order-2' : ''}`}
                >
                  {/* Phase Label */}
                  <div className="flex items-center gap-4 font-mono text-xs text-[#e5e5e5] tracking-widest font-semibold">
                    <span className="text-white text-xl font-medium">({chapter.num})</span>
                    <span>{chapter.phase}</span>
                  </div>

                  {/* Chapter Heading */}
                  <h3 className="text-3xl sm:text-5xl font-normal tracking-tight text-white uppercase leading-none">
                    {chapter.title}
                  </h3>

                  {/* Main Paragraph - Changed to pure text-white and normal weight */}
                  <p className="text-base sm:text-lg text-white font-normal leading-relaxed pt-2">
                    {chapter.description}
                  </p>

                  {/* Metric Footer Code Line */}
                  <div className="text-xs font-mono text-[#ff5252] border-t-2 border-[#2e2e2e] pt-4 uppercase tracking-[0.2em] font-bold">
                    {chapter.metric}
                  </div>
                </motion.div>

                {/* 2. THE LARGE FRAMED EXPOSITION IMAGE */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-full lg:w-7/12 ${!isEven ? 'lg:order-1' : ''}`}
                >
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] bg-[#121212] border-2 border-[#2e2e2e] overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40 z-10 pointer-events-none mix-blend-multiply" />
                    
                    <motion.img 
                      src={chapter.image} 
                      alt={chapter.title}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full object-cover brightness-[0.9] contrast-[1.05]"
                    />
                    
                    <div className="absolute bottom-6 left-6 z-20 text-[10px] font-mono text-white/80 bg-black/60 px-3 py-1 tracking-[0.3em] uppercase">
                      ELYARA ATELIER // PROPERTY OF SWEETY
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* CLOSING INSCRIPTION FOOTER */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="text-center mt-64 pt-16 border-t-2 border-[#2e2e2e] font-mono text-xs tracking-[0.5em] uppercase text-[#e5e5e5] font-semibold"
        >
          END OF PROCESS CHRONICLE — SIGNED BY SWEETY
        </motion.div>

      </div>
    </section>
  );
}