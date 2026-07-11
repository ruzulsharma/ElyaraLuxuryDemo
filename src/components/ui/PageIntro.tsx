"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PageIntro — full-screen brand splash that plays once per session.
 * Mimics the Smith/Snith brand intro: brand name centred, fades out,
 * page content slides up beneath it.
 *
 * Uses sessionStorage so the animation only plays on the first load
 * of a browser session, not on every route change.
 */
export default function PageIntro() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"logo" | "exit">("logo");

  useEffect(() => {
    // Only show once per session
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("elyara_intro_seen");
    if (seen) return;

    setVisible(true);

    // Phase 1 — hold the logo for 1.6 s
    const holdTimer = setTimeout(() => setPhase("exit"), 1600);
    // Phase 2 — exit animation runs for 900 ms, then unmount
    const unmountTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("elyara_intro_seen", "1");
    }, 1600 + 900);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-intro"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          {/* Cream background panel — slides up on exit */}
          <motion.div
            initial={{ scaleY: 1, originY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0, originY: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute inset-0 bg-[#faf8f4]"
            style={{ transformOrigin: "top" }}
          />

          {/* Brand mark — centred, fades out slightly before panel collapses */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: phase === "logo" ? 1 : 0, y: phase === "logo" ? 0 : -8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 text-center select-none"
          >
            {/* Gold horizontal rule — top */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase === "logo" ? 1 : 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="h-px w-32 bg-[#c9a96e] mx-auto mb-5"
              style={{ transformOrigin: "left" }}
            />

            <p className="font-serif text-4xl sm:text-5xl font-light tracking-[0.35em] text-[#1a2744] uppercase">
              ELYARA
            </p>
            <p className="text-[11px] tracking-[0.45em] text-[#c9a96e] uppercase font-medium mt-2">
              By Sweety
            </p>

            {/* Gold horizontal rule — bottom */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase === "logo" ? 1 : 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="h-px w-32 bg-[#c9a96e] mx-auto mt-5"
              style={{ transformOrigin: "right" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
