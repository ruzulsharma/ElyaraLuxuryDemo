"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Stat {
  /** The final numeric value to count up to */
  value: number;
  /** Suffix rendered after the number, e.g. "+" or "k+" */
  suffix: string;
  /** Short label below the number */
  label: string;
  /** Longer description line */
  description: string;
  /** Duration of the count-up animation in ms */
  duration?: number;
}

const STATS: Stat[] = [
  {
    value: 110,
    suffix: "+",
    label: "Styles",
    description: "Unique named designs crafted since founding",
    duration: 1800,
  },
  {
    value: 2400,
    suffix: "+",
    label: "Reach",
    description: "Customers styled across India and beyond",
    duration: 2200,
  },
  {
    value: 18,
    suffix: "+",
    label: "Variety",
    description: "Categories from bridal couture to everyday luxury",
    duration: 1400,
  },
];

/** Easing function — ease-out cubic */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function AnimatedNumber({ value, suffix, duration = 1800, inView }: {
  value: number;
  suffix: string;
  duration: number;
  inView: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const startTime = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;

    const tick = (now: number) => {
      if (startTime.current === null) startTime.current = now;
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setDisplay(Math.round(eased * value));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [inView, value, duration]);

  // Format with locale (e.g. 2400 → 2,400)
  const formatted =
    value >= 1000
      ? display.toLocaleString("en-IN")
      : display.toString();

  return (
    <span>
      {formatted}
      <span className="text-[#c9a96e]">{suffix}</span>
    </span>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="bg-[#1a2744] py-16 sm:py-20 px-4 sm:px-6"
      aria-label="Brand achievements"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center text-xs tracking-[0.4em] uppercase text-[#c9a96e] font-medium mb-12"
        >
          Elyara in Numbers
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: i * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-center sm:border-r sm:border-white/10 last:border-0 sm:px-6"
            >
              {/* Number */}
              <p className="font-serif text-5xl sm:text-6xl font-light text-white tabular-nums">
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  duration={stat.duration ?? 1800}
                  inView={inView}
                />
              </p>

              {/* Label */}
              <p className="mt-3 text-xs tracking-[0.3em] uppercase font-semibold text-white/80">
                {stat.label}
              </p>

              {/* Gold rule */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 + 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="h-px bg-[#c9a96e]/40 w-12 mx-auto my-3"
                style={{ transformOrigin: "center" }}
              />

              {/* Description */}
              <p className="text-xs text-white/45 leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
