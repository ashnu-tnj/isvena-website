import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your Isvena order — complimentary worldwide shipping and free custom name engraving on every piece.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <p className="eyebrow text-gold">Checkout</p>
      <h1 className="type-display mt-4 font-display italic">Your order.</h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-soft">
        Card details are entered on Cashfree&rsquo;s secure payment window —
        they never touch this site.
      </p>
      <div className="mt-14 border-t hairline pt-14">
        <CheckoutForm />
      </div>
    </div>
  );
}
