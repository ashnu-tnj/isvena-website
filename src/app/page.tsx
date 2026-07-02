import Link from "next/link";
import PlaceholderArt from "@/components/placeholder-art";
import ProductCard from "@/components/product-card";
import { categories } from "@/data/categories";
import { getFeaturedProducts } from "@/data/products";

const usps = [
  { title: "Full-Grain Leather", detail: "Chrome-free tannages, responsibly sourced" },
  { title: "Hand-Braided", detail: "Woven by artisans, strip by strip" },
  { title: "Made in Chennai", detail: "One workshop, since 2016" },
  { title: "Shipped Worldwide", detail: "From Tamil Nadu to your door" },
];

export default function Home() {
  const featured = getFeaturedProducts();
  const signature = featured[0];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
        <PlaceholderArt tone="umber" pattern="weave" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-ink/25" />
        <div className="relative flex h-full flex-col items-center justify-end px-6 pb-20 text-center text-cream">
          <p className="eyebrow text-cream/80">Since 2016 &middot; Chennai, Tamil Nadu</p>
          <h1 className="mt-5 max-w-2xl font-display text-4xl italic leading-tight sm:text-6xl">
            Leather, woven by hand to outlast the trend.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/85 sm:text-base">
            Isvena is the design house built on the workshop of P.M. Rahamathulla &amp; Co —
            hand-braided bags, wallets and accessories, made one hide at a time.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="bg-cream px-8 py-3 text-xs uppercase tracking-widest-plus text-ink transition hover:bg-cognac hover:text-cream"
            >
              Shop the Collection
            </Link>
            <Link
              href="/heritage"
              className="border border-cream/60 px-8 py-3 text-xs uppercase tracking-widest-plus text-cream transition hover:border-cream"
            >
              Our Heritage
            </Link>
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="border-b hairline bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-4 lg:px-10">
          {usps.map((u) => (
            <div key={u.title} className="text-center">
              <p className="font-display text-sm sm:text-base">{u.title}</p>
              <p className="mt-1 text-xs text-ink-soft">{u.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curated Collections */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mb-12 flex flex-col items-center text-center">
          <p className="eyebrow text-umber">Curated Collections</p>
          <h2 className="mt-3 font-display text-3xl italic sm:text-4xl">
            Six categories, one workshop
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Link
              href={`/shop/${c.slug}`}
              key={c.slug}
              className={`group relative block overflow-hidden ${
                i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <div className={`relative ${i === 0 ? "aspect-[4/3] lg:aspect-square" : "aspect-[4/3]"}`}>
                <PlaceholderArt
                  tone={c.tone}
                  pattern="weave"
                  className="h-full w-full transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                  <p className="font-display text-xl italic sm:text-2xl">{c.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest-plus text-cream/80">
                    {c.tagline}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Signature product editorial */}
      {signature && (
        <section className="bg-cream">
          <div className="mx-auto grid max-w-7xl items-center gap-0 lg:grid-cols-2">
            <div className="relative aspect-[4/5] lg:aspect-auto lg:h-[640px]">
              <PlaceholderArt
                tone={signature.tone}
                label={signature.label}
                caption="Signature Piece"
                className="h-full w-full"
              />
            </div>
            <div className="px-6 py-16 lg:px-20">
              <p className="eyebrow text-umber">The Signature Weave</p>
              <h2 className="mt-4 font-display text-3xl italic sm:text-4xl">
                {signature.name}
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-soft">
                {signature.craftsmanship}
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
                {signature.description}
              </p>
              <Link
                href={`/product/${signature.slug}`}
                className="mt-8 inline-block border-b border-ink pb-1 text-xs uppercase tracking-widest-plus transition hover:border-cognac hover:text-cognac"
              >
                Discover the Weave
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Heritage teaser */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="eyebrow text-umber">A Family in Leather Since 1936</p>
          <h2 className="mt-4 font-display text-3xl italic sm:text-4xl">
            A workshop, before it was a brand.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-soft">
            Our founder began as an apprentice leather trader in British Colombo in 1936.
            Four generations later, the same family runs the Chennai workshop of P.M.
            Rahamathulla &amp; Co — and Isvena is its next chapter: the same hands, the same
            hides, and the same braid, presented for a global home.
          </p>
          <Link
            href="/heritage"
            className="mt-8 inline-block border-b border-ink pb-1 text-xs uppercase tracking-widest-plus transition hover:border-cognac hover:text-cognac"
          >
            Read Our Story
          </Link>
        </div>
        <div className="relative aspect-[4/3]">
          <PlaceholderArt tone="olive" pattern="grain" caption="The Atelier" className="h-full w-full" />
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="mb-12 flex flex-col items-center text-center">
          <p className="eyebrow text-umber">Just Arrived</p>
          <h2 className="mt-3 font-display text-3xl italic sm:text-4xl">
            Favourites from the workshop
          </h2>
        </div>
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
