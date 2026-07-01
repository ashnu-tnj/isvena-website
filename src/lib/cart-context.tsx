"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/data/products";

export interface CartLine {
  slug: string;
  name: string;
  price: number;
  color: string;
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, color: string, qty?: number) => void;
  removeItem: (slug: string, color: string) => void;
  updateQty: (slug: string, color: string, qty: number) => void;
  subtotal: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "isvena-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage on mount; not a reactive sync.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addItem = useCallback((product: Product, color: string, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find(
        (l) => l.slug === product.slug && l.color === color
      );
      if (existing) {
        return prev.map((l) =>
          l.slug === product.slug && l.color === color
            ? { ...l, qty: l.qty + qty }
            : l
        );
      }
      return [
        ...prev,
        { slug: product.slug, name: product.name, price: product.price, color, qty },
      ];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((slug: string, color: string) => {
    setLines((prev) => prev.filter((l) => !(l.slug === slug && l.color === color)));
  }, []);

  const updateQty = useCallback((slug: string, color: string, qty: number) => {
    setLines((prev) =>
      prev
        .map((l) => (l.slug === slug && l.color === color ? { ...l, qty } : l))
        .filter((l) => l.qty > 0)
    );
  }, []);

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.qty, 0),
    [lines]
  );
  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);

  const value: CartContextValue = {
    lines,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    removeItem,
    updateQty,
    subtotal,
    count,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
