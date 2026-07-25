import Link from "next/link";
import Image from "next/image";
import PlaceholderArt from "@/components/placeholder-art";
import ProductCard from "@/components/product-card";
import AutoVideo from "@/components/auto-video";
import Reveal from "@/components/reveal";
import { categories } from "@/data/categories";
import { getFeaturedProducts } from "@/data/products";

const usps = [
  { n: "01", title: "Vegetable-Tanned", detail: "Chrome-free, safe for skin, fully biodegradable" },
  { n: "02", title: "Hand-Braided", detail: "Woven by artisans, one strip at a time" },
  { n: "03", title: "Made in Chennai", detail: "One family workshop, four generations" },
  { n: "04", title: "Shipped Worldwide", detail: "From Tamil Nadu to your door" },
];

export default function Home() {
  const featured = getFeaturedProducts();
  const signature = featured[0];

  return (
    <div>
      {/* ─── Hero (split editorial) ───────────────────────────── */}
      <section className="border-b hairline">
        <div className="mx-auto grid max-w-[1600px] lg:grid-cols-2">
          {/* Copy panel */}
          <div className="order-2 flex flex-col justify-center px-6 py-16 sm:px-10 lg:order-1 lg:px-20 lg:py-24">
            <p className="reveal eyebrow text-gold" style={{ animationDelay: "0.1s" }}>
              Since 1936 &middot; Chennai, Tamil Nadu
            </p>
            <h1
              className="reveal mt-6 font-display italic leading-[1.03] tracking-[-0.01em] text-[clamp(2.5rem,4.6vw,4.75rem)]"
              style={{ animationDelay: "0.25s" }}
            >
              Leather, woven by hand to outlast the trend.
            </h1>
            <p
              className="reveal mt-7 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base"
              style={{ animationDelay: "0.45s" }}
            >
              Isvena is the design house built on the workshop of P.M. Rahamathulla
              &amp; Co — hand-braided totes, slings, clutches and baskets, made one
              hide at a time.
            </p>
            <div
              className="reveal mt-9 flex flex-wrap items-center gap-4"
              style={{ animationDelay: "0.6s" }}
            >
              <Link href="/shop" className="btn btn-solid">
                Shop the Collection
              </Link>
              <Link href="/heritage" className="btn btn-outline">
                Our Heritage
              </Link>
            </div>
          </div>

          {/* Editorial image — rendered at its own 3:4 ratio so the model and
              bag are never cropped. */}
          <div className="order-1 w-full overflow-hidden lg:order-2">
            <Image
              src="/products/hero-editorial.jpg"
              alt="A model carrying the Isvena tan hand-braided woven leather shoulder bag"
              width={896}
              height={1200}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* ─── USP band ─────────────────────────────────────────── */}
      <section className="border-b hairline bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-sand-line px-0 sm:grid-cols-4 sm:divide-y-0 lg:px-0">
          {usps.map((u, i) => (
            <Reveal
              key={u.title}
              delay={i * 90}
              className="px-6 py-10 text-center"
            >
              <p className="font-display text-sm italic text-gold">{u.n}</p>
              <p className="mt-2 font-display text-base sm:text-lg">{u.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                {u.detail}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Curated Collections ──────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="mb-14 flex flex-col items-center text-center">
          <p className="eyebrow text-gold">Curated Collections</p>
          <h2 className="type-display mt-4 font-display italic">
            Four categories, one workshop
          </h2>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 4) * 80}>
              <Link
                href={`/shop/${c.slug}`}
                className="group relative block h-full overflow-hidden"
              >
                <div className="relative aspect-[4/5]">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                  ) : (
                    <PlaceholderArt
                      tone={c.tone}
                      pattern="weave"
                      className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/5" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-cream">
                    <div>
                      <p className="font-display text-xl italic sm:text-2xl">
                        {c.name}
                      </p>
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

      {/* ─── Signature editorial ──────────────────────────────── */}
      {signature && (
        <section className="bg-cream">
          <div className="mx-auto grid max-w-7xl items-stretch gap-0 lg:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:min-h-[680px]">
              {signature.images && signature.images.length > 0 ? (
                <Image
                  src={signature.images[signature.images.length - 1]}
                  alt={`${signature.name} — ${signature.materials}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              ) : (
                <PlaceholderArt
                  tone={signature.tone}
                  label={signature.label}
                  caption="Signature Piece"
                  className="h-full w-full"
                />
              )}
            </div>
            <Reveal className="flex flex-col justify-center px-6 py-16 lg:px-20">
              <p className="eyebrow text-gold">The Signature Weave</p>
              <h2 className="type-display mt-5 font-display italic">
                {signature.name}
              </h2>
              <p className="mt-7 max-w-md text-sm leading-relaxed text-ink-soft">
                {signature.craftsmanship}
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
                {signature.description}
              </p>
              <div className="mt-9 flex items-center gap-6">
                <Link href={`/product/${signature.slug}`} className="btn btn-solid">
                  Discover the Weave
                </Link>
                <span className="font-display text-lg">
                  ${signature.price.toLocaleString()}
                </span>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ─── The weave, in motion ─────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink">
        <AutoVideo
          src="/video/red-crossbody.mp4"
          poster="/video/red-crossbody.jpg"
          label="A hand-braided Isvena bag turning slowly on an ivory studio surface"
          className="h-[46vw] max-h-[560px] min-h-[300px] w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-10 text-center text-cream sm:pb-14 lg:px-10">
          <p className="eyebrow text-gold-soft">In Motion</p>
          <h2 className="mt-3 font-display text-2xl italic sm:text-4xl">
            Every side, braided by hand.
          </h2>
          <Link href="/shop" className="btn btn-ghost pointer-events-auto mt-6">
            Shop the Collection
          </Link>
        </div>
      </section>

      {/* ─── Heritage teaser ──────────────────────────────────── */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-10">
        <Reveal>
          <p className="eyebrow text-gold">A Family in Leather Since 1936</p>
          <h2 className="type-display mt-5 font-display italic">
            A workshop, before it was a brand.
          </h2>
          <p className="mt-7 max-w-md text-sm leading-relaxed text-ink-soft">
            Our founder began as an apprentice leather trader in British Colombo in
            1936. Four generations later, the same family runs the Chennai workshop
            of P.M. Rahamathulla &amp; Co — and Isvena is its next chapter: the same
            hands, the same hides, and the same braid, presented for a global home.
          </p>
          <Link
            href="/heritage"
            className="link-line mt-8 inline-block pb-1 text-xs uppercase tracking-widest-plus text-ink transition-colors hover:text-cognac"
          >
            Read Our Story
          </Link>
        </Reveal>
        <Reveal delay={120} className="relative aspect-[4/3] overflow-hidden">
          <Image
            src="/products/workshop.jpg"
            alt="The family leather workshop — the atelier where Isvena pieces are made"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </Reveal>
      </section>

      {/* ─── Quote ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink py-24 text-center text-cream">
        <div className="grain" />
        <Reveal className="relative mx-auto max-w-3xl px-6">
          <p className="font-display text-2xl italic leading-relaxed sm:text-4xl">
            &ldquo;A machine can stitch a bag. It cannot braid one.&rdquo;
          </p>
          <p className="mt-8 eyebrow text-gold-soft">
            P.M. Rahamathulla &amp; Co. — In leather since 1936
          </p>
        </Reveal>
      </section>

      {/* ─── Featured products ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="mb-14 flex flex-col items-center text-center">
          <p className="eyebrow text-gold">The Collection</p>
          <h2 className="type-display mt-4 font-display italic">
            Favourites from the workshop
          </h2>
        </Reveal>
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-16 text-center">
          <Link href="/shop" className="btn btn-solid">
            View the Full Collection
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
