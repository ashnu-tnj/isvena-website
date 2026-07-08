"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function CartDrawer() {
  const { lines, isOpen, closeCart, removeItem, updateQty, subtotal } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function startCheckout() {
    setCheckingOut(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({ slug: l.slug, color: l.color, qty: l.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setCheckoutError(
          data.error ?? "Could not start checkout. Please try again."
        );
        return;
      }
      window.location.href = data.url;
    } catch {
      setCheckoutError("Could not start checkout. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-ink/40 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md transform flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping bag"
      >
        <div className="flex items-center justify-between border-b hairline px-6 py-5">
          <h2 className="eyebrow text-gold">Your Bag ({lines.reduce((s, l) => s + l.qty, 0)})</h2>
          <button
            onClick={closeCart}
            className="text-sm tracking-wide text-ink-soft hover:text-cognac"
            aria-label="Close bag"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {lines.length === 0 ? (
            <p className="text-sm text-ink-soft">
              Your bag is empty. Explore the{" "}
              <Link href="/shop" onClick={closeCart} className="text-cognac underline underline-offset-4">
                full collection
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-6">
              {lines.map((line) => (
                <li key={`${line.slug}-${line.color}`} className="flex gap-4 border-b hairline pb-6">
                  <div className="h-20 w-16 shrink-0 bg-sand" />
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${line.slug}`}
                        onClick={closeCart}
                        className="font-display text-base leading-tight hover:text-cognac"
                      >
                        {line.name}
                      </Link>
                      <span className="whitespace-nowrap text-sm">
                        ${(line.price * line.qty).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs uppercase tracking-wide text-ink-soft">{line.color}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center border hairline">
                        <button
                          className="px-2 py-1 text-sm"
                          onClick={() => updateQty(line.slug, line.color, line.qty - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-2 text-sm">{line.qty}</span>
                        <button
                          className="px-2 py-1 text-sm"
                          onClick={() => updateQty(line.slug, line.color, line.qty + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(line.slug, line.color)}
                        className="text-xs uppercase tracking-wide text-ink-soft underline underline-offset-4 hover:text-cognac"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t hairline px-6 py-6">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="eyebrow text-gold">Subtotal</span>
              <span className="font-display text-lg">${subtotal.toLocaleString()}</span>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-ink-soft">
              Each piece is woven or stitched to order and ships in 2–3 weeks.
              Secure payment by card via Stripe; shipping and taxes are
              calculated at checkout.
            </p>
            {checkoutError && (
              <p className="mb-3 text-xs leading-relaxed text-cognac-dark">
                {checkoutError}{" "}
                <Link
                  href="/contact"
                  onClick={closeCart}
                  className="underline underline-offset-4"
                >
                  Order via our concierge instead
                </Link>
                .
              </p>
            )}
            <button
              onClick={startCheckout}
              disabled={checkingOut}
              className="btn btn-solid w-full disabled:opacity-60"
            >
              {checkingOut ? "Preparing Checkout…" : "Checkout"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
