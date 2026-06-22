"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AcquisitionOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentDrop: { item: string; piecesRemaining: number; totalEditions: number; price: string };
}

export default function AcquisitionOverlay({ isOpen, onClose, currentDrop }: AcquisitionOverlayProps) {
  const [measurements, setMeasurements] = useState<Record<string, string>>({ height: '', shoulders: '', chest: '' });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end bg-[#0d0d0d]/80 backdrop-blur-md"
        >
          <div className="flex-1 cursor-pointer" onClick={onClose} />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-[600px] h-full bg-[#141414] border-l border-[#262626] p-8 md:p-16 flex flex-col overflow-y-auto text-[#f2f2f2]"
          >
            <div className="flex justify-between items-start mb-16 border-b border-[#262626] pb-6">
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#8c8c8c] block mb-2">ALLOCATION SECURED: 15:00 MINS</span>
                <h2 className="text-2xl font-light tracking-tight">Bespoke Acquisition</h2>
              </div>
              <button onClick={onClose} className="text-[#a6a6a6] hover:text-[#f2f2f2] text-[10px] uppercase tracking-widest transition-colors cursor-pointer">
                [ CLOSE ]
              </button>
            </div>

            <div className="mb-12 flex gap-6">
              <div className="w-24 h-32 bg-[#1a1a1a] border border-[#262626] flex items-center justify-center">
                <span className="text-[8px] text-[#595959]">[ ITEM ]</span>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-light mb-1">{currentDrop.item}</h3>
                <span className="text-xs text-[#a6a6a6] font-mono mb-3">SER_NO: {currentDrop.piecesRemaining.toString().padStart(2, '0')}/{currentDrop.totalEditions.toString().padStart(2, '0')}</span>
                <span className="text-sm">{currentDrop.price}</span>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-[11px] text-[#8c8c8c] uppercase tracking-widest mb-8 leading-relaxed">
                To maintain the integrity of the silhouette, this garment is tailored to your structural metrics. Please provide precise measurements.
              </p>

              <div className="space-y-8">
                {['height', 'shoulders', 'chest'].map((metric) => (
                  <div key={metric} className="relative">
                    <input
                      type="text"
                      id={metric}
                      value={measurements[metric]}
                      onChange={(e) => setMeasurements({ ...measurements, [metric]: e.target.value })}
                      className="w-full bg-transparent border-b border-[#404040] py-3 text-sm text-[#f2f2f2] font-mono focus:outline-none focus:border-[#f2f2f2] transition-colors peer"
                      placeholder=" "
                    />
                    <label 
                      htmlFor={metric}
                      className="absolute left-0 top-3 text-[10px] uppercase tracking-widest text-[#595959] transition-all peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-[#f2f2f2] peer-[&:not(:placeholder-shown)]:-top-4 peer-[&:not(:placeholder-shown)]:text-[9px]"
                    >
                      {metric} (INCHES)
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-[#262626]">
              <button className="w-full bg-[#f2f2f2] text-[#0d0d0d] py-5 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-[#d9d9d9] transition-colors cursor-pointer">
                PROCEED TO IDENTITY VERIFICATION
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
