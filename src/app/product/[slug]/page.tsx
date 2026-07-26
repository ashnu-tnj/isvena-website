import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PlaceholderArt from "@/components/placeholder-art";
import ProductCard from "@/components/product-card";
import ProductPurchasePanel from "@/components/product-purchase-panel";
import AutoVideo from "@/components/auto-video";
import JsonLd from "@/components/json-ld";
import Price from "@/components/price";
import { getCategory } from "@/data/categories";
import { getProduct, getProductsByCategory, products } from "@/data/products";
import { productSchema, breadcrumbSchema } from "@/lib/structured-data";
import { ogImage } from "@/lib/site";

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
  const canonical = `/product/${product.slug}`;
  const title = `${product.name} — $${product.price}`;
  return {
    title: product.name,
    description: product.description,
    keywords: [product.name, ...product.colors, product.materials],
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description: product.description,
      url: canonical,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.description,
      images: [ogImage.url],
    },
  };
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

  const breadcrumbs = breadcrumbSchema([
    { name: "Shop", path: "/shop" },
    ...(category
      ? [{ name: category.name, path: `/shop/${category.slug}` }]
      : []),
    { name: product.name, path: `/product/${product.slug}` },
  ]);

  return (
    <div>
      <JsonLd data={productSchema(product, category)} />
      <JsonLd data={breadcrumbs} />
      <nav className="mx-auto max-w-7xl px-6 pt-8 text-[0.68rem] uppercase tracking-widest-plus text-ink-soft lg:px-10">
        <Link href="/shop" className="link-line transition-colors hover:text-ink">
          Shop
        </Link>
        {category && (
          <>
            <span className="mx-2 text-gold-soft">/</span>
            <Link
              href={`/shop/${category.slug}`}
              className="link-line transition-colors hover:text-ink"
            >
              {category.name}
            </Link>
          </>
        )}
        <span className="mx-2 text-gold-soft">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <section className="mx-auto mt-8 grid max-w-7xl gap-10 px-6 pb-24 lg:grid-cols-2 lg:gap-16 lg:px-10">
        {product.images && product.images.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {product.video && product.videoPoster ? (
              <div className="col-span-2 overflow-hidden bg-sand">
                <AutoVideo
                  src={product.video}
                  poster={product.videoPoster}
                  label={`${product.name} turning slowly, showing the hand-braided weave from every side`}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="relative col-span-2 aspect-[4/5] overflow-hidden bg-sand">
                <Image
                  src={product.images[0]}
                  alt={`${product.name} in ${product.materials}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            )}
            {/* When a film leads the gallery, the primary still becomes a thumb */}
            {product.video && (
              <div className="relative aspect-square overflow-hidden bg-sand">
                <Image
                  src={product.images[0]}
                  alt={`${product.name} in ${product.materials}`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center"
                />
              </div>
            )}
            {product.images.slice(1, product.video ? 2 : 3).map((src, i) => (
              <div key={src} className="relative aspect-square overflow-hidden bg-sand">
                <Image
                  src={src}
                  alt={`${product.name} — view ${i + 2}`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center"
                />
              </div>
            ))}
            {/* Fill any remaining gallery slot with a woven motif panel */}
            {!product.video && product.images.length < 2 && (
              <>
                <div className="relative aspect-square">
                  <PlaceholderArt tone={product.tone} pattern="grain" className="h-full w-full" />
                </div>
                <div className="relative aspect-square">
                  <PlaceholderArt tone={product.tone} pattern="plain" className="h-full w-full" />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="relative col-span-2 aspect-[4/5]">
              <PlaceholderArt
                tone={product.tone}
                label={product.label}
                alt={`${product.name} in ${product.materials}`}
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
        )}

        <div className="lg:sticky lg:top-32 lg:self-start">
          {category && <p className="eyebrow text-gold">{category.name}</p>}
          <h1 className="mt-4 font-display text-3xl italic sm:text-[2.75rem] sm:leading-[1.05]">
            {product.name}
          </h1>
          <Price usd={product.price} className="mt-4 block font-display text-2xl" />
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <div className="mt-8 border-t hairline pt-8">
            <ProductPurchasePanel product={product} />
          </div>

          <dl className="mt-10 space-y-5 border-t hairline pt-8 text-sm">
            <div>
              <dt className="eyebrow text-gold">Materials</dt>
              <dd className="mt-1.5 text-ink-soft">{product.materials}</dd>
            </div>
            <div>
              <dt className="eyebrow text-gold">Dimensions</dt>
              <dd className="mt-1.5 text-ink-soft">
                {product.dimensions}
                {product.weight ? ` · ${product.weight}` : ""}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-gold">Craftsmanship</dt>
              <dd className="mt-1.5 text-ink-soft">{product.craftsmanship}</dd>
            </div>
          </dl>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t hairline bg-cream">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
            <p className="eyebrow text-gold text-center">You May Also Like</p>
            <h2 className="type-display mt-4 text-center font-display italic">
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
