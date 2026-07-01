import type { Metadata } from "next";
import Link from "next/link";
import PlaceholderArt from "@/components/placeholder-art";
import { categories } from "@/data/categories";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse the full Isvena collection of hand-braided leather goods.",
};

export default function ShopPage() {
  return (
    <div>
      <section className="border-b hairline px-6 py-16 text-center lg:px-10">
        <p className="eyebrow text-umber">The Collection</p>
        <h1 className="mt-4 font-display text-4xl italic sm:text-5xl">Shop Isvena</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
          Every category traces back to the same workshop bench in Ambur, Tamil Nadu.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link href={`/shop/${c.slug}`} key={c.slug} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden">
                <PlaceholderArt
                  tone={c.tone}
                  pattern="weave"
                  className="h-full w-full transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                  <p className="font-display text-2xl italic">{c.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest-plus text-cream/80">
                    {c.tagline}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
