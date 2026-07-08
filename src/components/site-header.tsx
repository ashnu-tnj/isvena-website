"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categories } from "@/data/categories";
import { useCart } from "@/lib/cart-context";

const announcements = [
  "Handcrafted in Tamil Nadu",
  "A Family in Leather Since 1936",
  "Vegetable-Tanned · Chrome-Free",
  "Complimentary Worldwide Shipping",
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement marquee */}
      <div className="overflow-hidden bg-ink py-2 text-cream">
        <div className="marquee-track text-[0.62rem] uppercase tracking-widest-plus">
          {[...announcements, ...announcements].map((a, i) => (
            <span key={i} className="mx-8 inline-flex items-center gap-8">
              {a}
              <span className="text-gold-soft">&bull;</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`bg-ivory/90 backdrop-blur transition-all duration-500 ${
          scrolled ? "border-b hairline shadow-[0_1px_20px_rgba(32,27,22,0.05)]" : ""
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 lg:px-10 ${
            scrolled ? "py-3" : "py-5"
          }`}
        >
          <button
            className="flex items-center gap-2 text-xs uppercase tracking-widest-plus lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="flex flex-col gap-1">
              <span
                className={`block h-px w-5 bg-ink transition-transform duration-300 ${
                  menuOpen ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-ink transition-transform duration-300 ${
                  menuOpen ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </span>
            {menuOpen ? "Close" : "Menu"}
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            {categories.slice(0, 4).map((c) => (
              <Link
                key={c.slug}
                href={`/shop/${c.slug}`}
                className="link-line text-xs uppercase tracking-widest-plus text-ink-soft transition-colors hover:text-ink"
              >
                {c.shortName}
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="font-display text-2xl italic tracking-wide transition-colors hover:text-cognac sm:text-[1.7rem]"
          >
            Isvena
          </Link>

          <div className="flex items-center gap-7">
            <Link
              href="/heritage"
              className="link-line hidden text-xs uppercase tracking-widest-plus text-ink-soft transition-colors hover:text-ink lg:inline"
            >
              Heritage
            </Link>
            <Link
              href="/contact"
              className="link-line hidden text-xs uppercase tracking-widest-plus text-ink-soft transition-colors hover:text-ink lg:inline"
            >
              Contact
            </Link>
            <button
              onClick={openCart}
              className="group relative text-xs uppercase tracking-widest-plus text-ink-soft transition-colors hover:text-ink"
              aria-label={`Open shopping bag, ${count} items`}
            >
              Bag
              <span
                className={`ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[0.62rem] transition-colors ${
                  count > 0 ? "bg-cognac text-cream" : "bg-sand text-ink-soft"
                }`}
              >
                {count}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden bg-ivory transition-[max-height] duration-500 ease-out lg:hidden ${
          menuOpen ? "max-h-[70vh] border-b hairline" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-6 pb-6 pt-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between border-b hairline py-4 text-sm uppercase tracking-widest-plus text-ink-soft transition-colors hover:text-cognac"
            >
              {c.name}
              <span className="text-gold-soft">&rarr;</span>
            </Link>
          ))}
          <Link
            href="/heritage"
            onClick={() => setMenuOpen(false)}
            className="border-b hairline py-4 text-sm uppercase tracking-widest-plus text-ink-soft transition-colors hover:text-cognac"
          >
            Heritage
          </Link>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="py-4 text-sm uppercase tracking-widest-plus text-ink-soft transition-colors hover:text-cognac"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
