"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll reveal wrapper.
 * Adds the `reveal` or `reveal-stagger` class, then toggles `in-view` when
 * the element enters the viewport (IntersectionObserver). Mirrors the
 * static site's transitions.js behavior.
 */
export function Reveal({
  children,
  stagger = false,
  as: Tag = "section",
  className = "",
}: {
  children: ReactNode;
  stagger?: boolean;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const base = stagger ? "reveal-stagger" : "reveal";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If user prefers reduced motion, show immediately.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in-view");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("in-view");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Combine classes. We cast Tag to any to allow ref assignment across element types.
  const Component = Tag as unknown as React.ElementType;
  return (
    <Component
      ref={ref as unknown as React.Ref<HTMLElement>}
      className={`${base} ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
