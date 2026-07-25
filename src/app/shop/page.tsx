import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { ogImage } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop the Full Collection",
  description:
    "Every Isvena piece in one place — hand-braided, vegetable-tanned leather totes, slings, clutches and baskets, made to order in Chennai and shipped worldwide.",
  alternates: { canonical: "/shop" },
  openGraph: {
    type: "website",
    title: "Shop the Full Collection — Isvena",
    description:
      "Every Isvena piece in one place — hand-braided, vegetable-tanned leather goods, made to order in Chennai.",
    url: "/shop",
    images: [ogImage],
  },
};

export default function ShopPage() {
  return (
    <div>
      <section className="border-b hairline px-6 py-20 text-center lg:px-10">
        <p className="reveal eyebrow text-gold">The Full Collection</p>
        <h1
          className="reveal type-display mt-5 font-display italic"
          style={{ animationDelay: "0.1s" }}
        >
          Every piece, one workshop
        </h1>
        <p
          className="reveal mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-soft"
          style={{ animationDelay: "0.2s" }}
        >
          The complete Isvena range — vegetable-tanned, chrome-free, and braided
          by hand in Chennai, Tamil Nadu. Filter by category, or browse it all.
        </p>
      </section>

      {/* Optional category filter — browsing all is the default */}
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-6 pt-12 lg:px-10">
        <span className="text-xs uppercase tracking-widest-plus text-cognac">
          All
        </span>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop/${c.slug}`}
            className="link-line text-xs uppercase tracking-widest-plus text-ink-soft transition-colors hover:text-ink"
          >
            {c.shortName}
          </Link>
        ))}
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
