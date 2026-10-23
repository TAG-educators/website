"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  /** Target numeric value to count up to. */
  target: number;
  /** Optional suffix appended after the number (e.g. "+", "%"). */
  suffix?: string;
  /** Optional prefix prepended before the number (e.g. "$"). */
  prefix?: string;
  /** Duration of the count-up in ms. Default 1200. */
  duration?: number;
}

/**
 * Count-up animation for a single stat value. Starts at 0 and eases up to
 * `target` when the element scrolls into view (IntersectionObserver,
 * threshold 0.4). Respects prefers-reduced-motion (jumps to final value).
 * Mirrors the static site's main.js stat-counter logic.
 */
export function StatCounter({ target, suffix = "", prefix = "", duration = 1200 }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion → show final value immediately.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target);
      setDone(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const start = performance.now();
          function tick(now: number) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setDisplay(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          setDone(true);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return (
    <div ref={ref} className="stat-value" aria-label={`${prefix}${target}${suffix}`}>
      {prefix}{display}{suffix}
    </div>
  );
}
