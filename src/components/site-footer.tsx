import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/categories";
import NewsletterForm from "@/components/newsletter-form";
import SocialLinks from "@/components/social-links";
import { site } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      <div className="grain" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Image
              src="/brand/isvena-wordmark-cream.png"
              alt="Isvena"
              width={599}
              height={106}
              className="h-7 w-auto"
            />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/65">
              Hand-braided, vegetable-tanned leather goods from a family workshop
              in Tamil Nadu, India — crafting premium totes, slings, clutches and
              baskets for a global wardrobe since 2016.
            </p>
            <SocialLinks
              className="-ml-2.5 mt-6"
              linkClassName="text-cream/60 hover:text-gold-soft"
            />
          </div>

          <div>
            <p className="eyebrow text-gold-soft">Shop</p>
            <ul className="mt-5 space-y-3 text-sm text-cream/80">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/shop/${c.slug}`} className="link-line">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-gold-soft">Isvena</p>
            <ul className="mt-5 space-y-3 text-sm text-cream/80">
              <li>
                <Link href="/heritage" className="link-line">
                  Our Heritage
                </Link>
              </li>
              <li>
                <Link href="/shop" className="link-line">
                  Full Collection
                </Link>
              </li>
              <li>
                <Link href="/faq" className="link-line">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="link-line">
                  Contact &amp; Trade Enquiries
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-gold-soft">Stay in Touch</p>
            <p className="mt-5 text-sm text-cream/65">
              Join our list for new releases and workshop stories.
            </p>
            <NewsletterForm />
            <p className="mt-6 text-sm text-cream/65">
              Orders and enquiries —{" "}
              <a
                href={`mailto:${site.email}`}
                className="link-line text-cream/85 hover:text-gold-soft"
              >
                {site.email}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-cream/15 pt-7 text-xs text-cream/50">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p>
              © {new Date().getFullYear()} Isvena. A legacy of P.M.
              Rahamathulla &amp; Co. — in leather since 1936.
            </p>
            <p>Chennai, Tamil Nadu, India — Shipping Worldwide</p>
          </div>
          <p className="mt-4 text-center">
            Isvena is a brand of Black Box Traders, Thanjavur, Tamil Nadu.
          </p>
          <p className="mt-6 text-center text-[0.66rem] tracking-wide text-cream/35">
            Designed &amp; Developed by AFLATUS OPC PVT LTD, Chennai
          </p>
        </div>
      </div>
    </footer>
  );
}
