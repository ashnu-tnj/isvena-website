import Stripe from "stripe";

/**
 * Server-side Stripe client. Returns null when STRIPE_SECRET_KEY is not
 * configured so the site (and its build) works without payment keys —
 * the checkout API responds 503 and the UI falls back to the contact flow.
 */
let cached: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  cached = key ? new Stripe(key) : null;
  return cached;
}
