"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Course } from "@/lib/types";
import "../public.css";

interface CartItem extends Course {}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tag-cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, []);

  function removeItem(id: string) {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    sessionStorage.setItem("tag-cart", JSON.stringify(next));
  }

  function clearCart() {
    setItems([]);
    sessionStorage.removeItem("tag-cart");
  }

  const total = items.reduce((sum, i) => sum + i.price, 0);
  const currency = items[0]?.currency || "PKR";

  if (!loaded) {
    return (
      <div className="catalog-page">
        <div className="wrap">
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <div className="wrap">
        <div className="section-head" style={{ textAlign: "left", marginBottom: 48 }}>
          <span className="eyebrow">Enrollment</span>
          <h1 style={{ fontSize: "var(--fs-h2)" }}>Your Cart</h1>
          <p>Review your selected courses before proceeding to registration.</p>
        </div>

        {items.length === 0 ? (
          <div className="public-empty">
            <div className="empty-cart">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18l-2 12H5L3 6z" stroke="currentColor" strokeWidth="1.2" />
                <path d="M3 6L2 2H0" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="9" cy="20" r="1.5" fill="currentColor" />
                <circle cx="17" cy="20" r="1.5" fill="currentColor" />
              </svg>
              <h3>Your cart is empty</h3>
              <p>Browse our courses and add the ones you'd like to enroll in.</p>
              <Link href="/courses" className="btn-primary">
                Browse Courses
                <svg className="go-arc" viewBox="0 0 20 14" fill="none">
                  <path className="horizon" d="M0 7h18" />
                  <path className="sun" d="M14 1l4 6-4 6" />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <span className="course-level-badge">{item.level}</span>
                    <h3>{item.title}</h3>
                    <p>{item.subject}</p>
                  </div>
                  <div className="cart-item-right">
                    {item.price > 0 && (
                      <span className="cart-item-price">{item.currency} {item.price.toLocaleString()}</span>
                    )}
                    <button onClick={() => removeItem(item.id)} className="cart-remove" aria-label="Remove">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={clearCart} className="cart-clear">Clear all</button>
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Courses</span>
                <span>{items.length}</span>
              </div>
              {total > 0 && (
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{currency} {total.toLocaleString()}</span>
                </div>
              )}
              <div className="summary-divider" />
              <Link
                href={`/register?courses=${items.map((i) => i.slug).join(",")}`}
                className="btn-primary cart-checkout"
              >
                Proceed to Registration
                <svg className="go-arc" viewBox="0 0 20 14" fill="none">
                  <path className="horizon" d="M0 7h18" />
                  <path className="sun" d="M14 1l4 6-4 6" />
                </svg>
              </Link>
              <Link href="/courses" className="btn-ghost cart-continue">Continue browsing</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
