import type { Metadata } from "next";
import Link from "next/link";
import PlaceholderArt from "@/components/placeholder-art";
import Reveal from "@/components/reveal";
import { categories } from "@/data/categories";
import { ogImage } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop All Leather Goods",
  description:
    "Browse the full Isvena collection of hand-braided, vegetable-tanned leather goods — totes, slings, clutches and baskets, made to order in Chennai and shipped worldwide.",
  alternates: { canonical: "/shop" },
  openGraph: {
    type: "website",
    title: "Shop All Leather Goods — Isvena",
    description:
      "The full Isvena collection of hand-braided, vegetable-tanned leather goods, made to order in Chennai.",
    url: "/shop",
    images: [ogImage],
  },
};

export default function ShopPage() {
  return (
    <div>
      <section className="border-b hairline px-6 py-20 text-center lg:px-10">
        <p className="reveal eyebrow text-gold">The Collection</p>
        <h1 className="reveal type-display mt-5 font-display italic" style={{ animationDelay: "0.1s" }}>
          Shop Isvena
        </h1>
        <p
          className="reveal mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-soft"
          style={{ animationDelay: "0.2s" }}
        >
          Every category traces back to the same workshop bench in Chennai,
          Tamil Nadu — vegetable-tanned, chrome-free, and braided by hand.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 4) * 80}>
              <Link href={`/shop/${c.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <PlaceholderArt
                    tone={c.tone}
                    pattern="weave"
                    className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-cream">
                    <div>
                      <p className="font-display text-2xl italic">{c.name}</p>
                      <p className="mt-1 text-[0.62rem] uppercase tracking-widest-plus text-cream/75">
                        {c.tagline}
                      </p>
                    </div>
                    <span className="mb-1 shrink-0 translate-x-2 text-lg opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                      &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
