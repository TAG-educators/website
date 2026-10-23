"use client";

import { useEffect } from "react";

/**
 * Wires the mobile menu toggle: clicking `.menu-btn` flips `.nav-links.open`,
 * and clicking a nav link closes it. Mirrors the static site's main.js.
 * Renders nothing — it's a behaviour-only component that queries the DOM
 * on mount (the nav markup lives in the public layout).
 */
export function MobileMenu() {
  useEffect(() => {
    const btn = document.querySelector<HTMLButtonElement>(".menu-btn");
    const nav = document.querySelector<HTMLUListElement>(".nav-links");
    if (!btn || !nav) return;

    function onBtn() {
      nav!.classList.toggle("open");
    }
    function onLinkClick(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest("a");
      if (a) nav!.classList.remove("open");
    }
    btn.addEventListener("click", onBtn);
    nav.addEventListener("click", onLinkClick);
    return () => {
      btn.removeEventListener("click", onBtn);
      nav.removeEventListener("click", onLinkClick);
    };
  }, []);

  return null;
}
