"use client";

import Link from "next/link";
import { useState } from "react";
import { categories } from "@/data/categories";
import { useCart } from "@/lib/cart-context";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur">
      <div className="border-b hairline bg-ink py-2 text-center text-[0.65rem] uppercase tracking-widest-plus text-cream">
        Handcrafted in Tamil Nadu, India — Since 2016 · Worldwide Shipping
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <button
          className="text-sm uppercase tracking-widest-plus lg:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <nav className="hidden items-center gap-7 lg:flex">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              className="text-xs uppercase tracking-widest-plus text-ink-soft transition hover:text-cognac"
            >
              {c.shortName}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="font-display text-2xl italic tracking-wide sm:text-3xl"
        >
          Isvena
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/heritage"
            className="hidden text-xs uppercase tracking-widest-plus text-ink-soft transition hover:text-cognac lg:inline"
          >
            Heritage
          </Link>
          <Link
            href="/contact"
            className="hidden text-xs uppercase tracking-widest-plus text-ink-soft transition hover:text-cognac lg:inline"
          >
            Contact
          </Link>
          <button
            onClick={openCart}
            className="text-xs uppercase tracking-widest-plus text-ink-soft transition hover:text-cognac"
            aria-label="Open shopping bag"
          >
            Bag ({count})
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t hairline px-6 pb-6 lg:hidden">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              onClick={() => setMenuOpen(false)}
              className="border-b hairline py-3 text-sm uppercase tracking-widest-plus text-ink-soft"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/heritage"
            onClick={() => setMenuOpen(false)}
            className="border-b hairline py-3 text-sm uppercase tracking-widest-plus text-ink-soft"
          >
            Heritage
          </Link>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="py-3 text-sm uppercase tracking-widest-plus text-ink-soft"
          >
            Contact
          </Link>
        </nav>
      )}
    </header>
  );
}
