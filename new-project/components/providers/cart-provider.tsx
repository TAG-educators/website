'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type CartItem = {
  slug: string;
  name: string;
  levels: string[];
  selectedLevel: string;
  batchDays?: string;
  batchTime?: string;
  batchDuration?: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  hasItem: (key: string) => boolean;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'tag-educators-cart';

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.slug === 'string' &&
    typeof item.name === 'string' &&
    Array.isArray(item.levels) &&
    item.levels.every((level) => typeof level === 'string') &&
    typeof item.selectedLevel === 'string'
    // batchDays, batchTime, batchDuration are optional
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsedCart: unknown = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart.filter(isCartItem));
        }
      }
    } catch (error) {
      console.error('Unable to restore the saved cart.', error);
    } finally {
      setHasLoadedCart(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedCart) return;

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Unable to save the cart.', error);
    }
  }, [items, hasLoadedCart]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const key = `${item.slug}-${item.selectedLevel}`;
      if (prev.some((i) => `${i.slug}-${i.selectedLevel}` === key)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => `${i.slug}-${i.selectedLevel}` !== key));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const hasItem = useCallback(
    (key: string) => items.some((i) => `${i.slug}-${i.selectedLevel}` === key),
    [items]
  );

  const itemCount = items.length;

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, hasItem, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
