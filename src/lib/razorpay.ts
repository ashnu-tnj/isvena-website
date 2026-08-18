import crypto from "node:crypto";
import Razorpay from "razorpay";
import { ZERO_DECIMAL } from "@/lib/currency";

/**
 * Server-side Razorpay client. Returns null when the keys are not configured,
 * so the site (and its build) still works without them — the order API then
 * answers 503 and the cart falls back to the concierge flow.
 */
let cached: Razorpay | null | undefined;

export function getRazorpay(): Razorpay | null {
  if (cached !== undefined) return cached;

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    // The customer only sees a polite fallback, so without this the cause is
    // invisible in the logs. Note .env.example is a template — Next.js reads
    // .env.local and the platform environment, never that file.
    console.error(
      "[razorpay] RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not both set — " +
        "checkout will return 503. Set them in .env.local (see SETUP.md)."
    );
    cached = null;
    return cached;
  }

  cached = new Razorpay({ key_id, key_secret });
  return cached;
}

/**
 * The currency the customer is actually charged in.
 *
 * Indian Razorpay accounts settle in INR unless International Payments has
 * been activated, so INR is the default. With it activated, setting
 * RAZORPAY_CURRENCY=USD bills the catalogue price directly and this whole
 * conversion step falls away.
 */
export const CHARGE_CURRENCY = (
  process.env.RAZORPAY_CURRENCY ?? "INR"
).toUpperCase();

/**
 * INR per USD used to bill, not to display.
 *
 * Unlike the indicative rates in `currency.ts`, this one decides what the
 * customer's card is debited, so it is deliberately an explicit setting
 * rather than a number buried in a table: it is the rate the house is
 * willing to sell at, and it should be reviewed whenever the rupee moves.
 * A live FX call is avoided on purpose — it would put a third-party outage
 * between the customer and the pay button.
 */
const INR_PER_USD = Number(process.env.RAZORPAY_INR_PER_USD ?? 88);

/** Catalogue USD → the charge currency, as a whole unit. */
export function toChargeCurrency(usd: number): number {
  if (CHARGE_CURRENCY === "USD") return usd;
  if (CHARGE_CURRENCY === "INR") return Math.round(usd * INR_PER_USD);
  // Any other currency means International Payments is on and the catalogue
  // is being billed in it directly; converting would be a guess.
  return usd;
}

/**
 * Whole units → the subunits Razorpay bills in (paise, cents).
 *
 * Razorpay's floor is 100 subunits, which the order route enforces; anything
 * in this catalogue clears it many times over.
 */
export function toSubunits(amount: number): number {
  if (ZERO_DECIMAL.has(CHARGE_CURRENCY)) return Math.round(amount);
  return Math.round(amount * 100);
}

/**
 * Razorpay's errors are plain objects, so `String(err)` renders the useless
 * "[object Object]". Pull out the parts worth reading, and fall back to JSON
 * rather than losing the reason entirely.
 */
export function describeRazorpayError(err: unknown): string {
  const e = err as {
    statusCode?: number;
    message?: string;
    error?: { code?: string; description?: string; reason?: string };
  };
  const detail =
    e?.error?.description ??
    e?.message ??
    (() => {
      try {
        return JSON.stringify(err);
      } catch {
        return String(err);
      }
    })();
  return (
    `status=${e?.statusCode ?? "?"} code=${e?.error?.code ?? "?"} ` +
    `reason=${e?.error?.reason ?? "?"}: ${detail}`
  );
}

/**
 * Is this callback genuinely from Razorpay?
 *
 * The browser reports its own success, so the three fields it posts back are
 * worth nothing until this passes: only Razorpay and this server know the
 * secret that produced the signature. Compared in constant time so a wrong
 * signature cannot be refined byte by byte from the response timing.
 */
export function verifyPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest();
  const given = Buffer.from(signature, "hex");

  // timingSafeEqual throws on a length mismatch, and the length itself is not
  // a secret, so check it first.
  if (given.length !== expected.length) return false;
  return crypto.timingSafeEqual(expected, given);
}
