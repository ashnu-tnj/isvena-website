import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PlaceholderArt from "@/components/placeholder-art";
import ProductCard from "@/components/product-card";
import { categories, getCategory } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";

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
  return { title: cat.name, description: cat.description };
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

  return (
    <div>
      <section className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
        <PlaceholderArt tone={cat.tone} pattern="weave" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-cream">
          <p className="eyebrow text-cream/80">{cat.tagline}</p>
          <h1 className="mt-4 font-display text-4xl italic sm:text-5xl">{cat.name}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pt-12 text-center lg:px-10">
        <p className="text-sm leading-relaxed text-ink-soft">{cat.description}</p>
      </section>

      <nav className="mx-auto mt-8 flex max-w-7xl flex-wrap justify-center gap-4 px-6 lg:px-10">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop/${c.slug}`}
            className={`text-xs uppercase tracking-widest-plus ${
              c.slug === cat.slug ? "text-cognac" : "text-ink-soft hover:text-cognac"
            }`}
          >
            {c.shortName}
          </Link>
        ))}
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        {items.length > 0 ? (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <ProductCard key={p.slug} product={p} />
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
