import type { Metadata } from "next";
import Link from "next/link";
import ClearCartOnMount from "@/components/clear-cart-on-mount";
import { isOrderNumber } from "@/lib/order-number";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  // Shape-checked before it is rendered: this lands in the page straight from
  // the query string, and an order number is the one thing here a customer
  // may screenshot and quote back to us.
  const orderNumber = order && isOrderNumber(order) ? order : null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center lg:px-10">
      <ClearCartOnMount />
      <p className="reveal eyebrow text-gold">Order Confirmed</p>
      <h1 className="reveal type-display mt-5 font-display italic" style={{ animationDelay: "0.1s" }}>
        Thank you.
      </h1>

      {orderNumber && (
        <div
          className="reveal mt-8 border hairline px-8 py-5"
          style={{ animationDelay: "0.15s" }}
        >
          <p className="eyebrow text-gold">Your Order Number</p>
          <p className="mt-2 font-display text-xl tracking-wide">{orderNumber}</p>
        </div>
      )}

      <p
        className="reveal mt-6 max-w-md text-sm leading-relaxed text-ink-soft"
        style={{ animationDelay: "0.2s" }}
      >
        Your payment has been received and your piece is joining the workshop
        queue in Chennai. Because everything we make is woven or stitched to
        order, please allow 6–8 weeks before dispatch — we&rsquo;ll email you
        your tracking details the moment it ships.
      </p>
      <p
        className="reveal mt-4 max-w-md text-xs leading-relaxed text-ink-soft"
        style={{ animationDelay: "0.25s" }}
      >
        {orderNumber ? "Quote that number if you " : "If you "}
        need to reach us about this order —{" "}
        <a
          href={`mailto:${site.email}`}
          className="link-line transition-colors hover:text-ink"
        >
          {site.email}
        </a>
        .
      </p>
      <Link href="/shop" className="btn btn-solid mt-10">
        Continue Browsing
      </Link>
    </div>
  );
}
