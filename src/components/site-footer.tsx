import Link from "next/link";
import { categories } from "@/data/categories";
import NewsletterForm from "@/components/newsletter-form";

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-display text-2xl italic">Isvena</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
              Hand-braided leather goods from a family workshop in Tamil Nadu,
              India, crafting premium bags, wallets and accessories for a
              global wardrobe since 2016.
            </p>
          </div>

          <div>
            <p className="eyebrow text-cream/60">Shop</p>
            <ul className="mt-4 space-y-2 text-sm text-cream/80">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/shop/${c.slug}`} className="transition hover:text-cognac">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-cream/60">Isvena</p>
            <ul className="mt-4 space-y-2 text-sm text-cream/80">
              <li>
                <Link href="/heritage" className="transition hover:text-cognac">
                  Our Heritage
                </Link>
              </li>
              <li>
                <Link href="/shop" className="transition hover:text-cognac">
                  Full Collection
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-cognac">
                  Contact &amp; Trade Enquiries
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-cream/60">Stay in Touch</p>
            <p className="mt-4 text-sm text-cream/70">
              Join our list for new releases and workshop stories.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/15 pt-6 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Isvena. A legacy of P.M. Rahamathulla &amp; Co., est. 2016.</p>
          <p>Chennai, Tamil Nadu, India — Shipping Worldwide</p>
        </div>
      </div>
    </footer>
  );
}
