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
        <p className="eyebrow text-gold">Colour — {color}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`border px-4 py-2 text-[0.7rem] uppercase tracking-wide transition-colors duration-300 ${
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
            className="px-3.5 py-3 text-sm transition-colors hover:text-cognac"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-8 px-2 text-center text-sm">{qty}</span>
          <button
            className="px-3.5 py-3 text-sm transition-colors hover:text-cognac"
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
          className={`btn flex-1 ${justAdded ? "bg-cognac text-cream" : "btn-solid"}`}
        >
          {justAdded ? "Added to Bag ✓" : "Add to Bag"}
        </button>
      </div>
      <p className="mt-4 border-l-2 border-gold/50 pl-3 text-xs leading-relaxed text-ink-soft">
        <span className="font-display text-sm italic text-ink">
          Free custom name engraving.
        </span>{" "}
        Have your name — or someone else&rsquo;s — hand-embossed into the
        leather at no cost. Add it at checkout, up to 20 characters.
      </p>
      <p className="mt-3 text-xs text-ink-soft">
        Made to order · Ships in 6–8 weeks from our Chennai workshop.
      </p>
    </div>
  );
}
