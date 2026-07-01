"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/data/products";

export default function ProductPurchasePanel({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCart();

  return (
    <div>
      <div>
        <p className="eyebrow text-umber">{color}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`border px-4 py-2 text-xs uppercase tracking-wide transition ${
                c === color
                  ? "border-ink bg-ink text-cream"
                  : "border-sand-line text-ink-soft hover:border-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex items-center border hairline">
          <button
            className="px-3 py-2 text-sm"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="px-3 text-sm">{qty}</span>
          <button
            className="px-3 py-2 text-sm"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          onClick={() => {
            addItem(product, color, qty);
            setJustAdded(true);
            setTimeout(() => setJustAdded(false), 2000);
          }}
          className="flex-1 bg-ink py-3 text-xs uppercase tracking-widest-plus text-cream transition hover:bg-cognac-dark"
        >
          {justAdded ? "Added to Bag" : "Add to Bag"}
        </button>
      </div>
      <p className="mt-3 text-xs text-ink-soft">
        Made to order · Ships in 2–3 weeks from our Chennai workshop.
      </p>
    </div>
  );
}
