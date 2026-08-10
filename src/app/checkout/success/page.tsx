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
      <p className="reveal eyebrow text-gold">Order Confirmed</p>
      <h1 className="reveal type-display mt-5 font-display italic" style={{ animationDelay: "0.1s" }}>
        Thank you.
      </h1>
      <p
        className="reveal mt-6 max-w-md text-sm leading-relaxed text-ink-soft"
        style={{ animationDelay: "0.2s" }}
      >
        Your payment has been received and your piece is joining the workshop
        queue in Chennai. Because everything we make is woven or stitched to
        order, please allow 6–8 weeks before dispatch — we&rsquo;ll email you
        your tracking details the moment it ships.
      </p>
      <Link href="/shop" className="btn btn-solid mt-10">
        Continue Browsing
      </Link>
    </div>
  );
}
