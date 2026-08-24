import crypto from "node:crypto";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { INR_PER_USD } from "@/lib/currency";

/**
 * Server-side Cashfree client. Returns null when the keys are not
 * configured, so the site (and its build) still works without them — the
 * order API then answers 503 and the cart falls back to the concierge flow.
 */
let cached: Cashfree | null | undefined;

export function getCashfree(): Cashfree | null {
  if (cached !== undefined) return cached;

  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  if (!appId || !secretKey) {
    const missing = [
      !appId && "CASHFREE_APP_ID",
      !secretKey && "CASHFREE_SECRET_KEY",
    ].filter(Boolean);
    console.error(
      `[cashfree] ${missing.join(" and ")} not set — checkout will return ` +
        "503. These go in .env.local (or, on the VPS, .env.production — see " +
        "SETUP.md section 3)."
    );
    cached = null;
    return cached;
  }

  const env =
    (process.env.CASHFREE_ENV ?? "sandbox").toLowerCase() === "production"
      ? CFEnvironment.PRODUCTION
      : CFEnvironment.SANDBOX;

  cached = new Cashfree(
    env,
    appId,
    secretKey,
    undefined, // XPartnerKey — not a partner integration
    undefined, // XClientSignature
    undefined, // XPartnerMerchantId
    // The SDK defaults to reporting every client-side validation error to a
    // Sentry project Cashfree operates, on by default. Nothing sensitive was
    // found flowing through it in the version this was checked against — the
    // captured errors are "field X was missing", not request/response bodies
    // — but a payment integration has no business sending anything to a
    // third party that was not explicitly asked for. Off.
    false
  );
  return cached;
}

/**
 * What the customer is actually charged in.
 *
 * An Indian Cashfree account settles in INR unless International Payments
 * has been activated. Setting CASHFREE_CURRENCY=USD once it is removes the
 * conversion below entirely.
 */
export const CHARGE_CURRENCY = (
  process.env.CASHFREE_CURRENCY ?? "INR"
).toUpperCase();

/**
 * INR per USD used to bill, not to display — imported from currency.ts
 * (which reads NEXT_PUBLIC_INR_PER_USD) rather than a second copy here, so
 * the price a visitor sees and the amount actually charged read the same
 * value and can never quietly drift apart. It has to be a NEXT_PUBLIC_
 * variable rather than a server-only one because currency.ts also renders
 * prices client-side, and a non-public env var is invisible in
 * browser-executed code — a Next.js constraint, not a choice made here. The
 * rate itself isn't a secret, so making it public costs nothing. Review it
 * when the rupee moves.
 */

/** Catalogue USD → the charge currency, as a whole unit. */
export function toChargeCurrency(usd: number): number {
  if (CHARGE_CURRENCY === "USD") return usd;
  if (CHARGE_CURRENCY === "INR") return usd * INR_PER_USD;
  // Any other currency means International Payments is on and the catalogue
  // is being billed in it directly; converting would be a guess.
  return usd;
}

/**
 * Cashfree bills in major units — 10.15 means ₹10 and 15 paise, not 1015
 * paise — unlike gateways that want the amount in subunits. Two decimals,
 * as the API requires.
 */
export function toCashfreeAmount(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/**
 * A stable customer_id Cashfree will accept.
 *
 * Cashfree requires alphanumeric-only, and there is no account system here
 * to draw a real customer id from — so this is a deterministic hash of the
 * email rather than the email itself, which would fail validation (the `@`
 * and `.` are not alphanumeric) and would otherwise put a raw email address
 * inside an identifier field with looser handling guarantees than the
 * customer_email field it already has.
 */
export function customerIdFor(email: string): string {
  return crypto.createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 24);
}

/**
 * Cashfree's SDK throws axios errors, whose default string form
 * ("[object Object]" via String(err), or a wall of request/response config
 * via JSON.stringify) is useless in a log. Pull out what Cashfree actually
 * said.
 */
export function describeCashfreeError(err: unknown): string {
  const e = err as {
    response?: { status?: number; data?: { code?: string; message?: string; type?: string } };
    message?: string;
  };
  const body = e?.response?.data;
  return (
    `status=${e?.response?.status ?? "?"} code=${body?.code ?? "?"} ` +
    `type=${body?.type ?? "?"}: ${body?.message ?? e?.message ?? String(err)}`
  );
}

/**
 * Is this webhook genuinely from Cashfree?
 *
 * Cashfree signs `timestamp + rawBody` with HMAC-SHA256 under the secret
 * key, base64-encoded. Verified in constant time so a wrong signature can't
 * be refined byte by byte from response timing. The raw body has to be the
 * exact bytes Cashfree sent — re-serialising parsed JSON would very likely
 * change whitespace and break the signature even for a genuine webhook.
 */
export function verifyWebhookSignature({
  timestamp,
  rawBody,
  signature,
}: {
  timestamp: string;
  rawBody: string;
  signature: string;
}): boolean {
  const secret = process.env.CASHFREE_SECRET_KEY;
  if (!secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(timestamp + rawBody)
    .digest("base64");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
