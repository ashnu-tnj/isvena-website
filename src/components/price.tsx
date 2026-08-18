"use client";

import { useCurrency } from "@/lib/currency-context";

/**
 * A catalogue price, shown in the visitor's currency where one is known.
 *
 * Renders USD on the server and on first paint, so crawlers, no-JS visitors
 * and the structured data all agree on the canonical price. When a local
 * currency is active the figure is prefixed with "≈", because Razorpay bills
 * in a single currency and the customer's bank sets the final conversion.
 */
export default function Price({
  usd,
  className,
}: {
  usd: number;
  className?: string;
}) {
  const { format, approximate, currency } = useCurrency();

  return (
    <span className={className}>
      {approximate && (
        <span aria-hidden="true" className="mr-0.5">
          ≈
        </span>
      )}
      {format(usd)}
      {approximate && (
        <span className="sr-only">
          {" "}
          approximately, in {currency}. The exact amount is confirmed at
          checkout.
        </span>
      )}
    </span>
  );
}
