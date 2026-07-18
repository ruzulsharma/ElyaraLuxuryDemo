"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/**
 * TransitionOverlay — shows the branded ELYARA animation during:
 * - Route navigations (triggered by pathname change)
 * - Logout / any action that causes a full-page transition
 *
 * Unlike PageIntro (once per session), this fires on EVERY route change
 * but with a shorter, more subtle timing.
 */
export default function TransitionOverlay() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  useEffect(() => {
    // Don't trigger on first mount (PageIntro handles that)
    if (pathname === prevPathname) return;

    setPrevPathname(pathname);
    setVisible(true);

    // Show for 800ms then dismiss
    const timer = setTimeout(() => setVisible(false), 800);
    return () => clearTimeout(timer);
  }, [pathname, prevPathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="transition-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none bg-[#faf8f4]"
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-center select-none"
          >
            {/* Gold rule top */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-px w-20 bg-[#c9a96e] mx-auto mb-4"
              style={{ transformOrigin: "center" }}
            />

            <p className="font-serif text-3xl font-light tracking-[0.3em] text-[#1a2744] uppercase">
              ELYARA
            </p>
            <p className="text-[10px] tracking-[0.4em] text-[#c9a96e] uppercase font-medium mt-1.5">
              By Sweety
            </p>

            {/* Gold rule bottom */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="h-px w-20 bg-[#c9a96e] mx-auto mt-4"
              style={{ transformOrigin: "center" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
