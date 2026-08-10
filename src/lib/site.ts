/**
 * Single source of truth for brand facts used across metadata, structured
 * data (SEO/AEO/GEO), the sitemap, robots, and the llms.txt manifest.
 * Keeping these here means search engines, answer engines, and generative
 * engines all receive consistent, unambiguous entity information.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.isvena.com"
).replace(/\/$/, "");

export const site = {
  name: "Isvena",
  legalName: "P.M. Rahamathulla & Co.",
  url: SITE_URL,
  /** Short, factual one-liner reused as the default meta description. */
  description:
    "Isvena crafts hand-woven, vegetable-tanned leather goods — totes, shoulder bags, crossbody and belt bags, clutches, buckets, belts and wallets — made to order by artisans in Chennai, Tamil Nadu, India, with free custom name engraving and complimentary worldwide shipping. A family in leather since 1936.",
  tagline: "Hand-braided, vegetable-tanned leather, woven by hand since 1936.",
  foundingYear: "1936",
  brandLaunchYear: "2016",
  email: "hello@isvena.com",
  gst: "33ATYPS6349H1ZV",
  locale: "en_US",
  address: {
    street: "No: 16/14, M.V. Badran Street, Periyamet",
    city: "Chennai",
    region: "Tamil Nadu",
    postalCode: "600003",
    country: "IN",
    countryName: "India",
  },
  /** Social profiles, rendered as icon links in the footer and on contact. */
  social: [
    { name: "Instagram", handle: "@isvenaofficial", url: "https://www.instagram.com/isvenaofficial" },
    { name: "Facebook", handle: "isvenaofficial", url: "https://www.facebook.com/isvenaofficial" },
  ],
  /** Public profiles / external references that reinforce entity identity. */
  sameAs: [
    "https://www.instagram.com/isvenaofficial",
    "https://www.facebook.com/isvenaofficial",
    "https://www.tradeindia.com/p-m-rahamathulla-co-363125/",
  ],
  keywords: [
    "hand-braided leather bags",
    "vegetable-tanned leather",
    "chrome-free leather goods",
    "leather totes",
    "handcrafted leather India",
    "artisan leather Chennai",
    "woven leather tote",
    "made-to-order leather bags",
    "Isvena",
    "P.M. Rahamathulla",
  ],
} as const;

export const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Isvena — hand-braided, vegetable-tanned leather goods since 1936",
};

/** Absolute URL helper for canonicals and structured data. */
export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
