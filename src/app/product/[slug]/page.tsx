import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PlaceholderArt from "@/components/placeholder-art";
import ProductCard from "@/components/product-card";
import ProductPurchasePanel from "@/components/product-purchase-panel";
import { getCategory } from "@/data/categories";
import { getProduct, getProductsByCategory, products } from "@/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return { title: product.name, description: product.description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = getProductsByCategory(product.category).filter(
    (p) => p.slug !== product.slug
  );

  return (
    <div>
      <nav className="mx-auto max-w-7xl px-6 pt-8 text-xs uppercase tracking-widest-plus text-ink-soft lg:px-10">
        <Link href="/shop" className="hover:text-cognac">
          Shop
        </Link>
        {category && (
          <>
            {" / "}
            <Link href={`/shop/${category.slug}`} className="hover:text-cognac">
              {category.name}
            </Link>
          </>
        )}
        {" / "}
        <span className="text-ink">{product.name}</span>
      </nav>

      <section className="mx-auto mt-8 grid max-w-7xl gap-10 px-6 pb-24 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="relative col-span-2 aspect-[4/5]">
            <PlaceholderArt
              tone={product.tone}
              label={product.label}
              className="h-full w-full"
            />
          </div>
          <div className="relative aspect-square">
            <PlaceholderArt tone={product.tone} pattern="grain" className="h-full w-full" />
          </div>
          <div className="relative aspect-square">
            <PlaceholderArt tone={product.tone} pattern="plain" className="h-full w-full" />
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          {category && <p className="eyebrow text-umber">{category.name}</p>}
          <h1 className="mt-3 font-display text-3xl italic sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-lg">${product.price.toLocaleString()}</p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <div className="mt-8 border-t hairline pt-8">
            <ProductPurchasePanel product={product} />
          </div>

          <dl className="mt-10 space-y-5 border-t hairline pt-8 text-sm">
            <div>
              <dt className="eyebrow text-umber">Materials</dt>
              <dd className="mt-1 text-ink-soft">{product.materials}</dd>
            </div>
            <div>
              <dt className="eyebrow text-umber">Dimensions</dt>
              <dd className="mt-1 text-ink-soft">
                {product.dimensions}
                {product.weight ? ` · ${product.weight}` : ""}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-umber">Craftsmanship</dt>
              <dd className="mt-1 text-ink-soft">{product.craftsmanship}</dd>
            </div>
          </dl>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t hairline bg-cream">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
            <p className="eyebrow text-umber text-center">You May Also Like</p>
            <h2 className="mt-3 text-center font-display text-3xl italic sm:text-4xl">
              More from {category?.name}
            </h2>
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
