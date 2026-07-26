/**
 * Local-currency display.
 *
 * Catalogue prices live in USD (`src/data/products.ts`). Stripe's Adaptive
 * Pricing converts them on the hosted checkout page using Stripe's own rate,
 * which Stripe does not expose to us ahead of time — so the figures produced
 * here can never be guaranteed to match the final charge to the cent.
 *
 * They are therefore presented as approximations ("≈ £355"), rounded to clean
 * numbers, with the exact amount confirmed at checkout. That is also why the
 * whole feature is gated behind NEXT_PUBLIC_LOCAL_PRICING: showing a local
 * price while Stripe is still charging USD would be a straight lie, so the
 * flag must only be turned on once Adaptive Pricing is live.
 *
 * SEO is unaffected — structured data, page titles and the server-rendered
 * HTML all stay in USD.
 */

export const BASE_CURRENCY = "USD";

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
  INR: 88,
  LKR: 300,
  ZAR: 18.5,
};

/**
 * Country → currency, covering every country in SHIPPING_COUNTRIES
 * (`src/app/api/checkout/route.ts`). Anywhere else falls back to USD.
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

/** Currencies Stripe treats as zero-decimal — ¥1650, never 165000. */
const ZERO_DECIMAL = new Set(["JPY", "KRW"]);

export function currencyForCountry(country: string | null | undefined): string {
  if (!country) return BASE_CURRENCY;
  return COUNTRY_CURRENCY[country.toUpperCase()] ?? BASE_CURRENCY;
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

/** Approximate local-currency amount for a USD catalogue price. */
export function convert(usd: number, currency: string): number {
  const rate = RATES[currency];
  if (!rate) return usd;
  return roundNicely(usd * rate);
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

/** True when the amount is only an estimate of what Stripe will charge. */
export function isApproximate(currency: string): boolean {
  return currency !== BASE_CURRENCY;
}

export { ZERO_DECIMAL };
