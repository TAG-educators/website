"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Page-to-page fade transition.
 * One quiet, reused moment: the outgoing page fades down through a soft
 * plum wash, the incoming page fades up through the same wash.
 *
 * On mount: removes the `tag-arriving` class (set by a tiny inline script in
 * the layout head) so the page fades in.
 * On internal link click: adds `tag-leaving` to <body>, waits, then lets
 * the browser navigate.
 */
const LEAVE_MS = 260;

export function PageTransition() {
  const pathname = usePathname();

  // Reveal the arriving page (remove the pre-paint faded-out class).
  useEffect(() => {
    // Two rAFs so the browser actually paints the faded state first.
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => {
        document.documentElement.classList.remove("tag-arriving");
      });
      // Cancel guard not needed; r2 runs once.
      void r2;
    });
    void r1;
    try {
      sessionStorage.removeItem("tagEntering");
    } catch {
      /* ignore */
    }
  }, [pathname]);

  // Intercept same-site link clicks for a brief fade-out before navigating.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;

      const href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#") return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Same-page anchor — let the browser handle it.
      if (url.pathname === window.location.pathname && url.hash) return;

      e.preventDefault();
      try {
        sessionStorage.setItem("tagEntering", "1");
      } catch {
        /* ignore */
      }
      document.body.classList.add("tag-leaving");
      setTimeout(() => {
        window.location.href = url.href;
      }, LEAVE_MS);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Guard against being stuck faded-out if restored from bfcache.
  useEffect(() => {
    function onPageshow(e: PageTransitionEvent) {
      if (e.persisted) {
        document.body.classList.remove("tag-leaving");
      }
    }
    window.addEventListener("pageshow", onPageshow);
    return () => window.removeEventListener("pageshow", onPageshow);
  }, []);

  return null;
}
