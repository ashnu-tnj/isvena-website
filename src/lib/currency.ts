/**
 * Local-currency display.
 *
 * Catalogue prices live in USD (`src/data/products.ts`). Cashfree currently
 * charges every customer in INR regardless of where they are — International
 * Payments isn't active on the account, and Cashfree's own KYC review
 * flagged showing anything other than INR as a mismatch against that. So
 * INR is the default (`BASE_CURRENCY`), and the local-currency toggle stays
 * off (`NEXT_PUBLIC_LOCAL_PRICING` unset) until international payments is
 * live and a genuinely multi-currency price makes sense again — at which
 * point this file, and only this file plus `NEXT_PUBLIC_LOCAL_PRICING`,
 * needs revisiting.
 *
 * `RATES.INR` reads the same NEXT_PUBLIC_INR_PER_USD value
 * `src/lib/cashfree.ts` bills with, rather than its own hardcoded number —
 * so the default price shown and the amount actually charged can never
 * drift apart from two copies of a rate quietly going out of sync.
 *
 * SEO is unaffected by the toggle either way — structured data and the
 * server-rendered HTML are handled directly in the pages that need them.
 */

export const BASE_CURRENCY = "INR";

/**
 * The one rate that has to match a real charge exactly — shared with
 * `src/lib/cashfree.ts`, which bills at this same value, rather than each
 * file keeping its own copy that could quietly drift out of sync.
 */
export const INR_PER_USD = Number(process.env.NEXT_PUBLIC_INR_PER_USD ?? 88);

/**
 * Indicative USD → local rates. Deliberately static: an FX call on the render
 * path would add a failure mode for a number that is already approximate.
 *
 * Gulf currencies (AED, SAR, QAR, BHD, OMR) and HKD are pegged, so those
 * barely move. The floating ones are worth a glance every few months.
 */
const RATES: Record<string, number> = {
  USD: 1,
  CAD: 1.37,
  GBP: 0.79,
  EUR: 0.92,
  AUD: 1.52,
  NZD: 1.65,
  CHF: 0.88,
  SEK: 10.6,
  NOK: 10.8,
  DKK: 6.9,
  AED: 3.67,
  SAR: 3.75,
  QAR: 3.64,
  KWD: 0.31,
  BHD: 0.377,
  OMR: 0.385,
  SGD: 1.34,
  MYR: 4.4,
  JPY: 152,
  KRW: 1350,
  HKD: 7.8,
  INR: INR_PER_USD,
  LKR: 300,
  ZAR: 18.5,
};

/**
 * Country → currency, covering every country in `src/data/shipping.ts`.
 * Anywhere else falls back to USD.
 */
const COUNTRY_CURRENCY: Record<string, string> = {
  US: "USD",
  CA: "CAD",
  GB: "GBP",
  AU: "AUD",
  NZ: "NZD",
  CH: "CHF",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  AE: "AED",
  SA: "SAR",
  QA: "QAR",
  KW: "KWD",
  BH: "BHD",
  OM: "OMR",
  SG: "SGD",
  MY: "MYR",
  JP: "JPY",
  KR: "KRW",
  HK: "HKD",
  IN: "INR",
  LK: "LKR",
  ZA: "ZAR",
  // Eurozone
  IE: "EUR",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  PT: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  FI: "EUR",
};

/** Zero-decimal currencies — ¥1650 is billed as 1650, never 165000. */
const ZERO_DECIMAL = new Set(["JPY", "KRW"]);

export function currencyForCountry(country: string | null | undefined): string {
  if (!country) return BASE_CURRENCY;
  return COUNTRY_CURRENCY[country.toUpperCase()] ?? BASE_CURRENCY;
}

/**
 * Country from a BCP 47 locale ("en-GB" → "GB").
 *
 * Used when the server sends no country header — which is the normal case
 * when self-hosting without a GeoIP module. Weaker evidence than an IP
 * lookup (it reflects the device's language settings, not its location), but
 * it means the currency choice works out of the box, and the visitor can
 * override it either way.
 */
export function countryFromLocale(locale: string | null | undefined): string | null {
  if (!locale) return null;
  try {
    return new Intl.Locale(locale).region ?? null;
  } catch {
    const match = /^[A-Za-z]{2,3}[-_]([A-Za-z]{2})\b/.exec(locale);
    return match ? match[1].toUpperCase() : null;
  }
}

/**
 * Round to a figure that looks priced rather than converted: £354.87 reads as
 * a conversion artefact, £355 reads as a price. Coarser as the number grows,
 * so ¥68,400 doesn't end in stray digits either.
 */
function roundNicely(value: number): number {
  if (value >= 10000) return Math.round(value / 500) * 500;
  if (value >= 1000) return Math.round(value / 50) * 50;
  if (value >= 100) return Math.round(value / 5) * 5;
  return Math.round(value);
}

/**
 * USD catalogue price → a display amount in `currency`.
 *
 * The default currency (BASE_CURRENCY, currently INR) is what Cashfree
 * actually charges — not an estimate — so it gets rounded to the nearest
 * whole unit only, matching the real charge to within a fraction of a rupee.
 * Any other currency is a genuine estimate (the customer's bank sets the
 * real conversion when the toggle is live), where roundNicely's coarser,
 * price-shaped rounding is the point rather than a problem.
 */
export function convert(usd: number, currency: string): number {
  const rate = RATES[currency];
  if (!rate) return usd;
  const amount = usd * rate;
  return currency === BASE_CURRENCY ? Math.round(amount) : roundNicely(amount);
}

/**
 * Format an amount for display. Intl handles the symbol, separators and
 * decimal conventions per currency; we force whole numbers because every
 * figure here is already rounded.
 */
export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Unknown currency code — fall back to a plain, unambiguous rendering.
    return `${currency} ${amount.toLocaleString()}`;
  }
}

/** True when the amount is only an estimate of what will be charged. */
export function isApproximate(currency: string): boolean {
  return currency !== BASE_CURRENCY;
}

export { ZERO_DECIMAL };
