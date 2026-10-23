"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NavItem } from "@/lib/navigation";

interface ScrollHeaderProps {
  nav: NavItem[];
  siteName: string;
  tagline: string;
}

/**
 * Modern scroll-aware header.
 * - Starts tall and transparent over the hero
 * - Shrinks to a compact glass bar after scrolling 80px
 * - Shows a scroll progress bar at the very top
 * - Cart indicator with item count
 * - Smooth transitions throughout
 */
export function ScrollHeader({ nav, siteName, tagline }: ScrollHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);

      // Scroll progress for the top bar
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (y / docHeight) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Read cart count from sessionStorage
  useEffect(() => {
    function updateCartCount() {
      try {
        const raw = sessionStorage.getItem("tag-cart");
        const cart = raw ? JSON.parse(raw) : [];
        setCartCount(cart.length);
      } catch {
        setCartCount(0);
      }
    }
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    // Poll for changes (sessionStorage doesn't trigger storage event in same tab)
    const interval = setInterval(updateCartCount, 1000);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      clearInterval(interval);
    };
  }, []);

  // Close mobile menu on route change (hash change)
  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "header-scrolled" : "header-top"}`}>
      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ width: `${progress}%` }} />

      <nav className="site-nav">
        <Link href="/" className="brand" onClick={() => setMobileOpen(false)}>
          <img src="/logo.png" alt={`${siteName} logo`} className="brand-logo" />
          <span className="brand-text">
            <strong>{siteName}</strong>
            <em>{tagline}</em>
          </span>
        </Link>

        <ul className={`nav-links ${mobileOpen ? "open" : ""}`}>
          {nav.map((item) => (
            <li key={item.id}>
              <Link href={item.href} onClick={() => setMobileOpen(false)}>{item.label}</Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          {/* Cart indicator */}
          <Link href="/cart" className="nav-cart" onClick={() => setMobileOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18l-2 12H5L3 6z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 6L2 2H0" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" />
              <circle cx="17" cy="20" r="1.5" fill="currentColor" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <Link href="/courses" className="nav-cta" onClick={() => setMobileOpen(false)}>
            View Courses
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <button
          className={`menu-btn ${mobileOpen ? "open" : ""}`}
          aria-label="Open menu"
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
    </header>
  );
}
