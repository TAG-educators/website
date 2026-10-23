"use client";

import { useState } from "react";
import type { Course } from "@/lib/types";

interface AddToCartButtonProps {
  course: Course;
}

export function AddToCartButton({ course }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  function addToCart() {
    try {
      const raw = sessionStorage.getItem("tag-cart");
      const cart: Course[] = raw ? JSON.parse(raw) : [];
      if (cart.some((c) => c.id === course.id)) {
        setAdded(true);
        return;
      }
      cart.push(course);
      sessionStorage.setItem("tag-cart", JSON.stringify(cart));
      setAdded(true);
    } catch {
      // ignore
    }
  }

  if (added) {
    return (
      <a href="/cart" className="btn-primary" style={{ justifyContent: "center" }}>
        View Cart
        <svg className="go-arc" viewBox="0 0 20 14" fill="none">
          <path className="horizon" d="M0 7h18" />
          <path className="sun" d="M14 1l4 6-4 6" />
        </svg>
      </a>
    );
  }

  return (
    <button onClick={addToCart} className="btn-primary" style={{ justifyContent: "center" }}>
      Add to Cart
      <svg className="go-arc" viewBox="0 0 20 14" fill="none">
        <path className="horizon" d="M0 7h18" />
        <path className="sun" d="M14 1l4 6-4 6" />
      </svg>
    </button>
  );
}
