"use client";
import React from 'react';

const CATALOGUE_ITEMS = [
  { id: "ELY-01", name: "THE ASYMMETRIC MOTO CAPE", price: "₹48,000", status: "3 PIECES REMAINING" },
  { id: "ELY-02", name: "THE SHARP GEOMETRIC COAT", price: "₹65,000", status: "LOW STOCK // 01 LEFT" },
  { id: "ELY-03", name: "THE OBSIDIAN DRAPE LAYER", price: "₹42,000", status: "AVAILABLE TO MEASURE" },
  { id: "ELY-04", name: "SCULPTED TAPERED TROUSER", price: "₹28,000", status: "MADE TO ORDER" }
];

export default function AtelierExtensions({ onAddToCart }: { onAddToCart: (item: { id: string; name: string; price: string }) => void }) {
  // Direct explicit pin drop for Golf Course Road, Sector 43, Gurugram
  const googleMapsUrl = "https://www.google.com/maps/place/H%26M/@28.5672447,77.3186497,17z/data=!3m1!4b1!4m6!3m5!1s0x390ce448813ee723:0x23037967b7bbd386!8m2!3d28.5672447!4d77.3212246!16s%2Fg%2F11b_2wgq3x?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D";

  return (
    <div className="bg-[#090909] text-white">
      
      {/* ================= SECTION A: THE DESIGNER MANIFESTO ================= */}
      <section className="px-6 md:px-12 py-24 border-t border-[#2e2e2e] max-w-4xl mx-auto">
        <div className="space-y-6">
          <span className="text-xs font-mono tracking-[0.4em] text-[#ff5252] uppercase block font-bold">
            THE DESIGNER MANIFESTO
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-tight uppercase text-white">
            ELYARA BY SWEETY
          </h2>
          <p className="text-base sm:text-lg text-[#e5e5e5] font-normal leading-relaxed">
            The brand stems from an uncompromising obsession with raw lines, sculptural silhouettes, and structural geometry. Under the creative direction of Sweety, Elyara subverts traditional Indian garment boundaries by fusing avant-garde drapes with modern tech-wear utility frameworks.
          </p>
          <p className="text-sm text-[#a3a3a3] font-normal font-mono uppercase tracking-widest">
            // STATUS: UNTAMED / PERMANENT RATIONALE
          </p>
        </div>
      </section>

      {/* ================= SECTION B: THE CATALOGUE RAIL ================= */}
      <section className="px-6 md:px-12 py-24 border-t border-[#2e2e2e] max-w-4xl mx-auto">
        <div className="border-b-2 border-[#2e2e2e] pb-6 mb-12">
          <span className="text-xs font-mono tracking-[0.3em] text-[#ff5252] uppercase block font-bold mb-1">
            DIGITAL FLUSH
          </span>
          <h3 className="text-2xl sm:text-4xl font-normal tracking-tight uppercase text-white">
            COLLECTION ACQUISITION CATALOGUE
          </h3>
        </div>

        <div className="divide-y-2 divide-[#2e2e2e]">
          {CATALOGUE_ITEMS.map((item) => (
            <div 
              key={item.id} 
              className="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:bg-[#121212] px-4 transition-colors duration-300"
            >
              <div className="space-y-1">
                <span className="block font-mono text-xs text-[#ff5252] font-bold">{item.id}</span>
                <h4 className="text-lg font-normal tracking-wide text-white uppercase">{item.name}</h4>
                <span className="block text-xs font-mono text-[#a3a3a3] tracking-widest uppercase">{item.status}</span>
              </div>
              
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <span className="font-mono text-base font-bold text-white">{item.price}</span>
                <button 
                  onClick={() => onAddToCart({ id: item.id, name: item.name, price: item.price })}
                  className="border-2 border-white text-white hover:bg-white hover:text-black transition-colors px-4 py-2 text-xs font-mono font-bold uppercase cursor-pointer"
                >
                  ADD TO BAG
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SECTION C: CLICKABLE PHYSICAL FLAGSHIP MAP ANCHOR ================= */}
      <section className="px-6 md:px-12 py-24 border-t border-[#2e2e2e] max-w-4xl mx-auto">
        <a 
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block group space-y-6 bg-[#121212] hover:bg-[#171717] border-2 border-[#2e2e2e] hover:border-white p-8 md:p-12 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 font-mono text-[10px] text-[#ff5252] font-bold border border-[#ff5252] px-2 py-1 uppercase group-hover:bg-[#ff5252] group-hover:text-white transition-colors">
            LAUNCH MAP LINK ↗
          </div>
          
          <span className="text-xs font-mono tracking-[0.4em] text-[#ff5252] uppercase block font-bold">
            GEOGRAPHIC ANCHOR
          </span>
          <h3 className="text-2xl sm:text-4xl font-normal tracking-tight uppercase text-white group-hover:text-[#ff5252] transition-colors">
            NOIDA ATELIER HQ
          </h3>
          <div className="space-y-2 text-base sm:text-lg text-white font-normal leading-relaxed">
            <p className="font-semibold">Main Exhibition Floor & Production Studio</p>
            <p className="text-[#a3a3a3] text-sm font-mono uppercase group-hover:text-white transition-colors">
              Sector 18, DLF mall of India, Noida, UP ,India
            </p>
          </div>
          <div className="pt-4 border-t border-[#2e2e2e] flex flex-wrap gap-6 text-xs font-mono text-[#e5e5e5] tracking-widest uppercase">
            <div>HOURS // 11:00 - 20:00 IST</div>
            <div>ENTRY // BY APPOINTMENT ONLY</div>
          </div>
        </a>
      </section>

    </div>
  );
}