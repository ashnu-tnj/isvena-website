"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { categories } from "@/data/categories";
import { useCart } from "@/lib/cart-context";
import CurrencyToggle from "@/components/currency-toggle";

const announcements = [
  "Handcrafted in Chennai",
  "A Family in Leather Since 1936",
  "Vegetable-Tanned · Chrome-Free",
  "Complimentary Worldwide Shipping",
  "Free Custom Name Engraving",
];

const navLink =
  "link-line whitespace-nowrap text-xs uppercase tracking-widest-plus text-ink-soft transition-colors hover:text-ink";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, openCart } = useCart();
  const shopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A click-opened menu needs both dismissals: Escape for the keyboard, and
  // a click anywhere outside for pointer and touch.
  useEffect(() => {
    if (!shopOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShopOpen(false);
    };
    const onPointer = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [shopOpen]);

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
        {/* Three tracks, not justify-between: the outer two are equal 1fr, so
            the wordmark in the auto-width centre track stays optically centred
            whatever the sides carry. */}
        <div
          className={`mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 transition-all duration-500 lg:px-10 ${
            scrolled ? "py-3" : "py-5"
          }`}
        >
          {/* ── Left: Heritage · Shop ─────────────────────────── */}
          <div className="flex min-w-0 items-center justify-start gap-7">
            <button
              className="flex items-center gap-2 text-xs uppercase tracking-widest-plus md:hidden"
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

            <Link href="/heritage" className={`hidden md:inline ${navLink}`}>
              Heritage
            </Link>

            {/* Deliberately click-driven, not hover-driven: opening on hover
                means the pointer arrives already-open and the click that
                follows reads as a toggle-shut, so the menu never appears.
                Click also behaves the same on touch, where hover does not
                exist. */}
            <div ref={shopRef} className="relative hidden md:block">
              <button
                onClick={() => setShopOpen((v) => !v)}
                aria-expanded={shopOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1.5 ${navLink}`}
              >
                Shop
                <span
                  aria-hidden="true"
                  className={`text-[0.55rem] transition-transform duration-300 ${
                    shopOpen ? "rotate-180" : ""
                  }`}
                >
                  &#9662;
                </span>
              </button>

              {/* Padding on the wrapper, not a margin, so the pointer never
                  crosses a dead gap on its way down to the panel. */}
              <div
                className={`absolute left-0 top-full z-50 w-60 pt-4 transition-all duration-200 ${
                  shopOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-1 opacity-0"
                }`}
              >
                <div className="border hairline bg-ivory py-2 shadow-[0_12px_40px_rgba(32,27,22,0.10)]">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/shop/${c.slug}`}
                      onClick={() => setShopOpen(false)}
                      className="block px-5 py-2.5 text-xs uppercase tracking-widest-plus text-ink-soft transition-colors hover:bg-cream hover:text-cognac"
                    >
                      {c.name}
                    </Link>
                  ))}
                  <Link
                    href="/shop"
                    onClick={() => setShopOpen(false)}
                    className="mt-1 block border-t hairline px-5 pb-1 pt-3 font-display text-sm italic text-ink transition-colors hover:text-cognac"
                  >
                    View All &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Centre: wordmark ──────────────────────────────── */}
          <Link
            href="/"
            className="justify-self-center px-6 transition-opacity hover:opacity-70"
            aria-label="Isvena — home"
          >
            <Image
              src="/brand/isvena-wordmark-ink.png"
              alt="Isvena"
              width={599}
              height={106}
              priority
              className={`w-auto transition-all duration-500 ${
                scrolled ? "h-5 sm:h-6" : "h-6 sm:h-7"
              }`}
            />
          </Link>

          {/* ── Right: Contact · Bag ──────────────────────────── */}
          <div className="flex min-w-0 items-center justify-end gap-5 lg:gap-7">
            <CurrencyToggle className="hidden lg:flex" />
            <Link href="/contact" className={`hidden md:inline ${navLink}`}>
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
        className={`overflow-hidden bg-ivory transition-[max-height] duration-500 ease-out md:hidden ${
          menuOpen ? "max-h-[80vh] border-b hairline" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-6 pb-6 pt-2">
          <p className="eyebrow pb-2 pt-3 text-gold">Shop</p>
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
            href="/shop"
            onClick={() => setMenuOpen(false)}
            className="border-b hairline py-4 font-display text-base italic text-ink transition-colors hover:text-cognac"
          >
            View All &rarr;
          </Link>
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
          {/* Narrow screens hide the toggle in the bar, so it lives here too. */}
          <CurrencyToggle className="mt-5 self-start lg:hidden" />
        </nav>
      </div>
    </header>
  );
}
