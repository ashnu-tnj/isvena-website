import Link from "next/link";
import Image from "next/image";
import PlaceholderArt from "@/components/placeholder-art";
import type { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  const photo = product.images?.[0];
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        {photo ? (
          <Image
            src={photo}
            alt={`${product.name} — ${product.materials}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        ) : (
          <PlaceholderArt
            tone={product.tone}
            label={product.label}
            alt={`${product.name} — ${product.materials}`}
            className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        )}

        {product.featured && (
          <span className="absolute left-3 top-3 bg-cream/90 px-2.5 py-1 text-[0.55rem] uppercase tracking-widest-plus text-ink">
            Signature
          </span>
        )}

        {/* View overlay on hover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-ink/85 py-3 text-center text-[0.62rem] uppercase tracking-widest-plus text-cream backdrop-blur-sm transition-transform duration-500 ease-out group-hover:translate-y-0">
          View Piece
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base leading-snug transition-colors group-hover:text-cognac">
            {product.name}
          </h3>
          <p className="mt-1 text-[0.68rem] uppercase tracking-widest-plus text-ink-soft">
            {product.materials.split(",")[0]}
          </p>
        </div>
        <p className="whitespace-nowrap font-display text-base">
          ${product.price.toLocaleString()}
        </p>
      </div>

      {/* Colour dots */}
      {product.colors.length > 0 && (
        <div className="mt-2.5 flex items-center gap-1.5">
          {product.colors.slice(0, 5).map((c) => (
            <span
              key={c}
              title={c}
              className="h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-black/10"
              style={{ backgroundColor: colorDot(c) }}
            />
          ))}
          {product.colors.length > 5 && (
            <span className="text-[0.6rem] text-ink-soft">
              +{product.colors.length - 5}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

function colorDot(name: string): string {
  const map: Record<string, string> = {
    Tan: "#c19a6b",
    Brown: "#6b4423",
    Black: "#1a1512",
    Red: "#8f2d23",
    Rose: "#c98a8a",
    Pink: "#d9a5b3",
    Green: "#4a5d3a",
    Blue: "#2f4a63",
    Yellow: "#c9a542",
    Silver: "#b8bcc0",
    White: "#f0ece3",
    Natural: "#d9c9ae",
    "Natural Brown": "#b89968",
    "Natural / Tan trim": "#cdb891",
  };
  return map[name] ?? "#a25a34";
}
