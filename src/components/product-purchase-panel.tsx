"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { coloursFor } from "@/data/colors";
import type { Product } from "@/data/products";

export default function ProductPurchasePanel({ product }: { product: Product }) {
  // Every piece is woven to order, so the whole house range is on offer here —
  // led by the colour this one was photographed in, so the swatch selected on
  // arrival matches the leather in the images above.
  const colours = coloursFor(product.photographedIn);
  const [color, setColor] = useState(colours[0].name);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCart();

  return (
    <div>
      <div>
        <p className="eyebrow text-gold">Colour — {color}</p>
        {/* gap-2 rather than anything looser so the full range still sits on
            one line in the desktop column, and wraps evenly below it. */}
        <div className="mt-3 flex flex-wrap gap-2">
          {colours.map((c) => (
            <button
              key={c.name}
              onClick={() => setColor(c.name)}
              title={c.name}
              aria-label={c.name}
              aria-pressed={c.name === color}
              className={`h-8 w-8 rounded-full ring-1 ring-inset ring-black/15 transition-shadow duration-300 ${
                c.name === color
                  ? "shadow-[0_0_0_2px_var(--color-cream),0_0_0_3.5px_var(--color-ink)]"
                  : "hover:shadow-[0_0_0_2px_var(--color-cream),0_0_0_3.5px_var(--color-sand-line)]"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-soft">
          Made to order in any of our {colours.length} house colours. The
          photographs show {product.photographedIn}.
        </p>
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
