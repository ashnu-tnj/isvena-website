import type { Metadata } from "next";
import Link from "next/link";
import ClearCartOnMount from "@/components/clear-cart-on-mount";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center lg:px-10">
      <ClearCartOnMount />
      <p className="eyebrow text-umber">Order Confirmed</p>
      <h1 className="mt-4 font-display text-4xl italic sm:text-5xl">
        Thank you.
      </h1>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-soft">
        Your payment has been received and your piece is joining the workshop
        queue in Chennai. Because everything we make is woven or stitched to
        order, please allow 2–3 weeks before dispatch — we&rsquo;ll email you
        your tracking details the moment it ships.
      </p>
      <Link
        href="/shop"
        className="mt-10 inline-block border-b border-ink pb-1 text-xs uppercase tracking-widest-plus transition hover:border-cognac hover:text-cognac"
      >
        Continue Browsing
      </Link>
    </div>
  );
}
