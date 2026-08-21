"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";

/**
 * Empties the bag after a successful checkout. Waits for the cart to
 * hydrate from localStorage first — clearing before hydration would be
 * undone when the stored cart loads.
 *
 * Takes an explicit `when` flag rather than clearing unconditionally: the
 * success page renders for cancelled and failed payments too — Cashfree's
 * return_url comes back here regardless of outcome — and a failed payment
 * must not cost the customer their bag along with it.
 */
export default function ClearCartOnMount({ when }: { when: boolean }) {
  const { clearCart, hydrated } = useCart();
  useEffect(() => {
    if (hydrated && when) clearCart();
  }, [hydrated, when, clearCart]);
  return null;
}
