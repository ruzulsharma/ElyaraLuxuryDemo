"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CustomCursor — a gold dot that follows the cursor on desktop.
 * Grows into a ring when hovering over interactive elements (links, buttons).
 * Hidden on touch devices and mobile viewports.
 */
export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Use motion values for butter-smooth tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring for slight lag (feels organic, not robotic)
  const springConfig = { damping: 28, stiffness: 300, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch device — hide custom cursor entirely
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Detect hover over interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input, select, textarea, [data-cursor='hover']");
      setIsHovering(!!interactive);
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleElementHover, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleElementHover);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  // Don't render on touch devices or mobile
  if (isTouch) return null;

  return (
    <>
      {/* Hide default cursor via global style */}
      <style jsx global>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>

      {/* Dot */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference hidden md:block"
        style={{ x, y }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 2.5 : 1,
        }}
        transition={{ scale: { type: "spring", stiffness: 400, damping: 25 } }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
            isHovering
              ? "w-10 h-10 border border-[#c9a96e] bg-transparent"
              : "w-3 h-3 bg-[#c9a96e]"
          }`}
        />
      </motion.div>
    </>
  );
}
