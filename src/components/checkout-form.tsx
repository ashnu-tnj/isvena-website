"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useCurrency } from "@/lib/currency-context";
import Price from "@/components/price";
import { shippingCountries } from "@/data/shipping";
import {
  loadRazorpayCheckout,
  type RazorpayFailure,
  type RazorpaySuccess,
} from "@/lib/razorpay-checkout";

const FIELD =
  "mt-2 w-full border-b hairline bg-transparent py-2.5 text-sm transition-colors focus:border-cognac focus:outline-none";

type Stage = "idle" | "creating" | "paying" | "verifying";

export default function CheckoutForm() {
  const { lines, subtotal, hydrated } = useCart();
  const { approximate, currency } = useCurrency();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);

  const busy = stage !== "idle";

  async function pay(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const value = (key: string) => String(form.get(key) ?? "").trim();
    const customer = {
      name: value("name"),
      email: value("email"),
      phone: value("phone"),
    };
    const payload = {
      lines: lines.map((l) => ({ slug: l.slug, color: l.color, qty: l.qty })),
      customer,
      address: {
        line1: value("line1"),
        line2: value("line2"),
        city: value("city"),
        region: value("region"),
        postcode: value("postcode"),
        country: value("country"),
      },
      engraving: value("engraving"),
    };

    setStage("creating");
    let order: {
      orderId: string;
      amount: number;
      currency: string;
      keyId?: string;
    };
    try {
      // The order is priced and created on the server; the browser only ever
      // says what was chosen, never what it costs.
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.orderId) {
        setError(data.error ?? "Could not start checkout. Please try again.");
        setStage("idle");
        return;
      }
      order = data;
      await loadRazorpayCheckout();
    } catch {
      setError(
        "Could not reach the payment provider. Check your connection and try again."
      );
      setStage("idle");
      return;
    }

    const key = order.keyId ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!key || !window.Razorpay) {
      setError("Payment is not available right now. Please contact us to order.");
      setStage("idle");
      return;
    }

    setStage("paying");
    const rzp = new window.Razorpay({
      key,
      amount: order.amount,
      currency: order.currency,
      name: "Isvena",
      description:
        lines.length === 1
          ? `${lines[0].name} — made to order`
          : `${lines.length} pieces — made to order`,
      order_id: order.orderId,
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone,
      },
      theme: { color: "#7B3F2E" },
      modal: {
        // Closing the window is a decision, not a failure — say nothing and
        // leave the form filled in so paying is one click away.
        ondismiss: () => setStage("idle"),
      },
      handler: async (response: RazorpaySuccess) => {
        setStage("verifying");
        try {
          // The browser claiming success proves nothing; the server checks
          // the signature against Razorpay before the order counts as paid.
          const res = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const data = await res.json();
          if (!res.ok || !data.ok) {
            setError(
              (data.error ?? "We could not verify that payment.") +
                ` Your payment reference is ${response.razorpay_payment_id} — ` +
                "please send it to us and we will sort it out."
            );
            setStage("idle");
            return;
          }
          // The success page clears the bag, so it is still intact if
          // anything above went wrong. The order number rides in the URL —
          // it is the only reference the customer gets, and there is no
          // account for them to look it up in later.
          router.push(
            data.orderNumber
              ? `/checkout/success?order=${encodeURIComponent(data.orderNumber)}`
              : "/checkout/success"
          );
        } catch {
          setError(
            "Your payment went through but we could not confirm it. Reference " +
              `${response.razorpay_payment_id} — please contact us and we will follow it up.`
          );
          setStage("idle");
        }
      },
    });

    rzp.on("payment.failed", (failure: RazorpayFailure) => {
      setError(
        failure.error?.description ??
          "That payment did not go through. Please try again or use another card."
      );
      setStage("idle");
    });

    rzp.open();
  }

  if (hydrated && lines.length === 0) {
    return (
      <p className="text-sm text-ink-soft">
        Your bag is empty. Explore the{" "}
        <Link href="/shop" className="text-cognac underline underline-offset-4">
          full collection
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="grid gap-14 lg:grid-cols-[1fr_22rem] lg:gap-20">
      <form className="space-y-10" onSubmit={pay}>
        <fieldset disabled={busy} className="space-y-6 disabled:opacity-60">
          <legend className="eyebrow text-gold">Your Details</legend>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="eyebrow text-gold" htmlFor="name">
                Full Name
              </label>
              <input id="name" name="name" type="text" required autoComplete="name" className={FIELD} />
            </div>
            <div>
              <label className="eyebrow text-gold" htmlFor="email">
                Email
              </label>
              <input id="email" name="email" type="email" required autoComplete="email" className={FIELD} />
            </div>
          </div>
          <div>
            <label className="eyebrow text-gold" htmlFor="phone">
              Phone
            </label>
            <input id="phone" name="phone" type="tel" required autoComplete="tel" className={FIELD} />
            <p className="mt-2 text-xs text-ink-soft">
              For the courier — international deliveries need a number.
            </p>
          </div>
        </fieldset>

        <fieldset disabled={busy} className="space-y-6 disabled:opacity-60">
          <legend className="eyebrow text-gold">Delivery Address</legend>
          <div>
            <label className="eyebrow text-gold" htmlFor="line1">
              Address
            </label>
            <input id="line1" name="line1" type="text" required autoComplete="address-line1" className={FIELD} />
          </div>
          <div>
            <label className="eyebrow text-gold" htmlFor="line2">
              Apartment, Suite <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <input id="line2" name="line2" type="text" autoComplete="address-line2" className={FIELD} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="eyebrow text-gold" htmlFor="city">
                City
              </label>
              <input id="city" name="city" type="text" required autoComplete="address-level2" className={FIELD} />
            </div>
            <div>
              <label className="eyebrow text-gold" htmlFor="region">
                State / County
              </label>
              <input id="region" name="region" type="text" autoComplete="address-level1" className={FIELD} />
            </div>
            <div>
              <label className="eyebrow text-gold" htmlFor="postcode">
                Postcode
              </label>
              <input id="postcode" name="postcode" type="text" autoComplete="postal-code" className={FIELD} />
            </div>
            <div>
              <label className="eyebrow text-gold" htmlFor="country">
                Country
              </label>
              <select id="country" name="country" required defaultValue="" autoComplete="country" className={FIELD}>
                <option value="" disabled>
                  Select a country
                </option>
                {shippingCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset disabled={busy} className="disabled:opacity-60">
          <legend className="eyebrow text-gold">Engraving</legend>
          <label className="sr-only" htmlFor="engraving">
            Name to engrave
          </label>
          <input
            id="engraving"
            name="engraving"
            type="text"
            maxLength={20}
            placeholder="Leave blank for none"
            className={FIELD}
          />
          <p className="mt-2 text-xs leading-relaxed text-ink-soft">
            <span className="font-display text-sm italic text-ink">Free.</span>{" "}
            Hand-embossed into the leather, up to 20 characters.
          </p>
        </fieldset>

        {error && (
          <p className="border-l-2 border-cognac pl-3 text-xs leading-relaxed text-cognac-dark">
            {error}{" "}
            <Link href="/contact" className="underline underline-offset-4">
              Contact our concierge
            </Link>
            .
          </p>
        )}

        <button type="submit" disabled={busy} className="btn btn-solid w-full disabled:opacity-60">
          {stage === "creating" && "Preparing…"}
          {stage === "paying" && "Complete Payment"}
          {stage === "verifying" && "Confirming Payment…"}
          {stage === "idle" && "Pay Securely"}
        </button>
      </form>

      <aside className="lg:sticky lg:top-32 lg:self-start">
        <h2 className="eyebrow text-gold">Your Order</h2>
        <ul className="mt-6 space-y-4 border-t hairline pt-6">
          {lines.map((line) => (
            <li key={`${line.slug}-${line.color}`} className="flex justify-between gap-4 text-sm">
              <span>
                <Link href={`/product/${line.slug}`} className="font-display hover:text-cognac">
                  {line.name}
                </Link>
                <span className="mt-0.5 block text-xs uppercase tracking-wide text-ink-soft">
                  {line.color} · ×{line.qty}
                </span>
              </span>
              <Price usd={line.price * line.qty} className="whitespace-nowrap" />
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between border-t hairline pt-6">
          <span className="eyebrow text-gold">Total</span>
          <Price usd={subtotal} className="font-display text-lg" />
        </div>
        <p className="mt-6 text-xs leading-relaxed text-ink-soft">
          Shipping is complimentary worldwide. Every piece is made to order and
          ships in 6–8 weeks from our Chennai workshop.
          {approximate && (
            <>
              {" "}
              Totals are shown in {currency} as a guide.
            </>
          )}{" "}
          Payment is taken in Indian rupees — the payment window shows the exact
          amount before you confirm.
        </p>
      </aside>
    </div>
  );
}
