"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";

/**
 * Scroll-velocity text marquee — a horizontal ticker that speeds up
 * the faster the user scrolls. Luxury brand detail.
 */

const MARQUEE_TEXT =
  "HANDCRAFTED IN INDIA  ·  BESPOKE FIT  ·  MADE TO ORDER  ·  ELYARA BY SWEETY  ·  PREMIUM FABRICS  ·  CUSTOM TAILORED  ·  ";

// Repeat text enough to fill wide screens
const REPEATED = MARQUEE_TEXT.repeat(4);

interface ScrollMarqueeProps {
  /** Base speed in px/frame (default 0.5) */
  baseSpeed?: number;
  /** Extra class names on the wrapper */
  className?: string;
}

export default function ScrollMarquee({
  baseSpeed = 0.5,
  className = "",
}: ScrollMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const scrollVelocity = useRef(0);
  const lastScrollY = useRef(0);
  const [x, setX] = useState(0);

  // Track scroll velocity
  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY.current);
      scrollVelocity.current = delta;
      lastScrollY.current = window.scrollY;
    };

    // Decay velocity over time
    const decay = () => {
      scrollVelocity.current *= 0.92;
      rafId = requestAnimationFrame(decay);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(decay);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Animate position
  useAnimationFrame(() => {
    const speed = baseSpeed + scrollVelocity.current * 0.15;
    xRef.current -= speed;

    // Reset to avoid infinite negative values — loop seamlessly
    const container = containerRef.current;
    if (container) {
      const halfWidth = container.scrollWidth / 2;
      if (Math.abs(xRef.current) >= halfWidth) {
        xRef.current = 0;
      }
    }

    setX(xRef.current);
  });

  return (
    <div
      className={`overflow-hidden select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <motion.div
        ref={containerRef}
        className="flex whitespace-nowrap"
        style={{ x }}
      >
        <span className="text-xs sm:text-sm tracking-[0.4em] uppercase font-medium text-[#1a2744]/15 py-5">
          {REPEATED}
        </span>
        <span className="text-xs sm:text-sm tracking-[0.4em] uppercase font-medium text-[#1a2744]/15 py-5">
          {REPEATED}
        </span>
      </motion.div>
    </div>
  );
}
