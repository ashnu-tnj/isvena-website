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
  if (!key) {
    // The customer only sees a polite fallback, so without this the cause is
    // invisible in the logs. Note .env.example is a template — Next.js reads
    // .env.local and the platform environment, never that file.
    console.error(
      "[stripe] STRIPE_SECRET_KEY is not set — checkout will return 503. " +
        "Set it in the Vercel project's Environment Variables (then redeploy), " +
        "or in .env.local for local development."
    );
    cached = null;
    return cached;
  }

  cached = new Stripe(key);
  return cached;
}
