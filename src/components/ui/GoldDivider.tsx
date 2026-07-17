"use client";

import { motion } from "framer-motion";

/**
 * A thin gold line that animates in from center when it scrolls into view.
 * Used between homepage sections for premium visual separation.
 */
export default function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`} aria-hidden="true">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="h-px w-24 bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent"
        style={{ transformOrigin: "center" }}
      />
    </div>
  );
}
