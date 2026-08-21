import type { Metadata } from "next";
import Link from "next/link";
import ClearCartOnMount from "@/components/clear-cart-on-mount";
import { confirmOrderPaid } from "@/lib/order-confirmation";
import { isOrderNumber } from "@/lib/order-number";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id } = await searchParams;
  // Shape-checked before it is used for anything: this arrives straight from
  // the query string, which Cashfree's return_url populates but which
  // anyone can also type by hand.
  const orderId = order_id && isOrderNumber(order_id) ? order_id : null;

  // Cashfree's redirect back here is a UX hint, not proof of payment — it
  // fires on a cancelled or failed attempt too. The true state, and whether
  // the workshop has been emailed, is decided here by asking Cashfree
  // directly. This also means a customer who returns before the webhook has
  // landed still gets confirmed and emailed — the webhook and this page are
  // two paths to the same idempotent check.
  const result = orderId ? await confirmOrderPaid(orderId) : null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center lg:px-10">
      <ClearCartOnMount when={result?.status === "paid"} />

      {result?.status === "paid" && (
        <>
          <p className="reveal eyebrow text-gold">Order Confirmed</p>
          <h1 className="reveal type-display mt-5 font-display italic" style={{ animationDelay: "0.1s" }}>
            Thank you.
          </h1>
          <div className="reveal mt-8 border hairline px-8 py-5" style={{ animationDelay: "0.15s" }}>
            <p className="eyebrow text-gold">Your Order Number</p>
            <p className="mt-2 font-display text-xl tracking-wide">{orderId}</p>
          </div>
          <p className="reveal mt-6 max-w-md text-sm leading-relaxed text-ink-soft" style={{ animationDelay: "0.2s" }}>
            Your payment has been received and your piece is joining the
            workshop queue in Chennai. Because everything we make is woven or
            stitched to order, please allow 6–8 weeks before dispatch —
            we&rsquo;ll email you your tracking details the moment it ships.
          </p>
          <p className="reveal mt-4 max-w-md text-xs leading-relaxed text-ink-soft" style={{ animationDelay: "0.25s" }}>
            Quote that number if you need to reach us about this order —{" "}
            <a href={`mailto:${site.email}`} className="link-line transition-colors hover:text-ink">
              {site.email}
            </a>
            .
          </p>
        </>
      )}

      {result?.status === "pending" && (
        <>
          <p className="reveal eyebrow text-gold">Confirming Payment</p>
          <h1 className="reveal type-display mt-5 font-display italic" style={{ animationDelay: "0.1s" }}>
            Almost there.
          </h1>
          <p className="reveal mt-6 max-w-md text-sm leading-relaxed text-ink-soft" style={{ animationDelay: "0.2s" }}>
            We haven&rsquo;t received confirmation of your payment yet — this
            is usually just a few seconds behind. Refresh this page in a
            moment; if it still hasn&rsquo;t confirmed after a few minutes,
            reach us at{" "}
            <a href={`mailto:${site.email}`} className="link-line transition-colors hover:text-ink">
              {site.email}
            </a>{" "}
            with order number <strong>{orderId}</strong>.
          </p>
        </>
      )}

      {(result?.status === "failed" || result?.status === "error" || !result) && (
        <>
          <p className="reveal eyebrow text-gold">Payment Not Completed</p>
          <h1 className="reveal type-display mt-5 font-display italic" style={{ animationDelay: "0.1s" }}>
            That didn&rsquo;t go through.
          </h1>
          <p className="reveal mt-6 max-w-md text-sm leading-relaxed text-ink-soft" style={{ animationDelay: "0.2s" }}>
            Your card wasn&rsquo;t charged. Your bag is still here — head back
            and try again, or{" "}
            <Link href="/contact" className="link-line transition-colors hover:text-ink">
              contact us
            </Link>{" "}
            if you&rsquo;d like help placing the order.
          </p>
        </>
      )}

      <Link href="/shop" className="btn btn-solid mt-10">
        Continue Browsing
      </Link>
    </div>
  );
}
