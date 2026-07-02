"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";

/**
 * Empties the bag after a successful checkout. Waits for the cart to
 * hydrate from localStorage first — clearing before hydration would be
 * undone when the stored cart loads.
 */
export default function ClearCartOnMount() {
  const { clearCart, hydrated } = useCart();
  useEffect(() => {
    if (hydrated) clearCart();
  }, [hydrated, clearCart]);
  return null;
}
