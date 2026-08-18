import crypto from "node:crypto";

/**
 * A human-readable reference for an order: `ISV-260818-K4F7`.
 *
 * Generated at order creation and carried on the Razorpay order — as the
 * `receipt` and in the notes — so the customer, the confirmation email and
 * the Razorpay dashboard all name the same order. There is no database, so
 * this is the only handle anyone has on it.
 *
 * The date makes it sortable and tells you at a glance when it was placed;
 * the suffix keeps two orders on the same day apart.
 */

// No I/O/0/1/S/5/Z/2 — the pairs people mistype when reading a number off a
// screen and into an email.
const ALPHABET = "ACDEFGHJKLMNPQRTUVWXY34679";
const SUFFIX_LENGTH = 4;

export function newOrderNumber(now = new Date()): string {
  const yy = String(now.getUTCFullYear()).slice(2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");

  let suffix = "";
  for (let i = 0; i < SUFFIX_LENGTH; i++) {
    // randomInt rather than Math.random: unbiased, and this is the only thing
    // separating two orders placed on the same day.
    suffix += ALPHABET[crypto.randomInt(ALPHABET.length)];
  }

  return `ISV-${yy}${mm}${dd}-${suffix}`;
}

/** Shape check for a reference quoted back to us in an email or a search. */
export function isOrderNumber(value: string): boolean {
  return new RegExp(`^ISV-\\d{6}-[${ALPHABET}]{${SUFFIX_LENGTH}}$`).test(value);
}
