import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PlaceholderArt from "@/components/placeholder-art";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import JsonLd from "@/components/json-ld";
import { categories, getCategory } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { collectionSchema, breadcrumbSchema } from "@/lib/structured-data";
import { ogImage } from "@/lib/site";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  const canonical = `/shop/${cat.slug}`;
  return {
    title: cat.name,
    description: cat.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: `${cat.name} — Isvena`,
      description: cat.description,
      url: canonical,
      images: [ogImage],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();
  const items = getProductsByCategory(cat.slug);

  const breadcrumbs = breadcrumbSchema([
    { name: "Shop", path: "/shop" },
    { name: cat.name, path: `/shop/${cat.slug}` },
  ]);

  return (
    <div>
      <JsonLd data={collectionSchema(cat, items)} />
      <JsonLd data={breadcrumbs} />
      <section className="relative h-[52vh] min-h-[360px] w-full overflow-hidden">
        <PlaceholderArt
          tone={cat.tone}
          pattern="weave"
          className="ken-burns absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/25 to-ink/50" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-cream">
          <p className="reveal eyebrow text-cream/80" style={{ animationDelay: "0.1s" }}>
            {cat.tagline}
          </p>
          <h1
            className="reveal type-display mt-5 font-display italic"
            style={{ animationDelay: "0.25s" }}
          >
            {cat.name}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pt-14 text-center lg:px-10">
        <p className="text-sm leading-relaxed text-ink-soft">{cat.description}</p>
      </section>

      <nav className="mx-auto mt-10 flex max-w-7xl flex-wrap justify-center gap-x-6 gap-y-3 px-6 lg:px-10">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop/${c.slug}`}
            className={`link-line text-xs uppercase tracking-widest-plus transition-colors ${
              c.slug === cat.slug ? "text-cognac" : "text-ink-soft hover:text-ink"
            }`}
          >
            {c.shortName}
          </Link>
        ))}
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        {items.length > 0 ? (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-ink-soft">
            New pieces in this category are on the bench. Check back soon.
          </p>
        )}
      </section>
    </div>
  );
}
