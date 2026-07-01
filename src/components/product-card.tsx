import Link from "next/link";
import PlaceholderArt from "@/components/placeholder-art";
import type { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <PlaceholderArt
          tone={product.tone}
          label={product.name.split(" ")[0]}
          className="h-full w-full transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base leading-snug">{product.name}</h3>
          <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft">
            {product.materials.split(",")[0]}
          </p>
        </div>
        <p className="whitespace-nowrap text-sm">${product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}
