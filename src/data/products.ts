import type { Tone } from "./categories";

export interface Product {
  slug: string;
  name: string;
  category: string; // category slug
  price: number; // proposed D2C retail price in USD — adjust before launch
  currency: "USD";
  materials: string;
  dimensions: string;
  weight?: string;
  craftsmanship: string;
  description: string;
  colors: string[];
  tone: Tone;
  /** Short word rendered on the placeholder art panel */
  label: string;
  featured?: boolean;
  /**
   * Real product photography under /public/products. First entry is the
   * primary image (cards, hero); the rest fill the detail-page gallery.
   * When absent, the woven PlaceholderArt is shown instead.
   */
  images?: string[];
  /**
   * Silent looping product film (slow turntable / push-in), shown as the
   * first item in the detail-page gallery. `videoPoster` is its first
   * frame, used before playback and for reduced-motion visitors.
   */
  video?: string;
  videoPoster?: string;
}

/** Base path for product photography in /public. */
const IMG = "/products";
/** Base path for product films in /public. */
const VID = "/video";

/**
 * Catalog populated from P.M. Rahamathulla & Co's own listings — the
 * TradeIndia catalogue (Google Doc) and the 48-product IndiaMART
 * catalogue PDF supplied by the owner. Specs, colours, and dimensions
 * come from those listings; USD prices are proposed D2C retail
 * (wholesale INR prices are in the source catalogues) — confirm before
 * launch.
 */
export const products: Product[] = [
  // ── Hand-Braided Totes ────────────────────────────────────────────
  {
    slug: "signature-hand-braided-tote",
    images: [`${IMG}/dark-tote_packshot.jpg`, `${IMG}/dark-tote_lifestyle.jpg`, `${IMG}/detail_signature-hand-braided-tote.jpg`],
    label: "Braided",
    name: "Signature Hand-Braided Tote",
    category: "tote-bags",
    price: 320,
    currency: "USD",
    materials: "Vegetable-tanned, chrome-free full-grain leather, hand-braided",
    dimensions: "46 × 46 × 30 cm (18 × 18 × 12 in)",
    weight: "≈ 2 kg",
    craftsmanship:
      "Vegetable-tanned, chrome-free leather strips are interlaced entirely by hand into the workshop's signature open weave — safe for your skin, fully biodegradable, soft and pliable from the first carry, and developing a deeper patina with every year.",
    description:
      "The bag the workshop is known for, made in every house colour — red, tan, rose, brown, black and green. Chrome-free and safe to wear against your skin daily.",
    colors: ["Tan", "Brown", "Black", "Red", "Rose", "Green"],
    tone: "cognac",
    featured: true,
  },
  {
    slug: "woven-braided-laptop-tote",
    images: [`${IMG}/set2_tan-shoulder-tote_packshot.jpg`, `${IMG}/detail_woven-braided-laptop-tote.jpg`],
    video: `${VID}/tan-shoulder-tote.mp4`,
    videoPoster: `${VID}/tan-shoulder-tote.jpg`,
    label: "Laptop",
    name: "Braided Laptop Tote",
    category: "tote-bags",
    price: 345,
    currency: "USD",
    materials: "Chrome-free braided leather, padded laptop sleeve",
    dimensions: "Fits up to a 15″ laptop",
    craftsmanship:
      "The signature weave built for the working day: lightweight yet sturdy, with a padded laptop sleeve and small interior pockets stitched in by hand.",
    description:
      "Spacious and thoughtfully organised — a hand-braided tote that pairs style with a working day's practicality.",
    colors: ["Brown", "Tan", "Black"],
    tone: "umber",
    featured: true,
  },
  {
    slug: "mini-laptop-tote",
    images: [`${IMG}/mini-tote_packshot.jpg`, `${IMG}/mini-tote_lifestyle.jpg`],
    video: `${VID}/black-mini.mp4`,
    videoPoster: `${VID}/black-mini.jpg`,
    label: "Mini",
    name: "Mini Laptop Tote",
    category: "tote-bags",
    price: 295,
    currency: "USD",
    materials: "Hand-braided leather",
    dimensions: "Fits up to a 13″ laptop",
    craftsmanship:
      "The laptop tote's weave scaled down for smaller machines and lighter days, with the same hand-braided body and stitched-in sleeve.",
    description:
      "Our braided laptop bag in miniature — for those who carry a smaller laptop, or simply less.",
    colors: ["Brown"],
    tone: "sand",
  },
  {
    slug: "rose-rectangular-tote",
    images: [`${IMG}/rose-tote.jpg`, `${IMG}/detail_rose-rectangular-tote.jpg`],
    label: "Rose",
    name: "Rectangular Tote in Rose",
    category: "tote-bags",
    price: 310,
    currency: "USD",
    materials: "Chrome-free braided leather",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "A clean rectangular pattern braided from pure chrome-free leather — the same hand-weave as our signature tote, cut to a sharper geometry.",
    description:
      "The wide-open tote silhouette in the workshop's rose pink — easy to dress up or down.",
    colors: ["Rose", "Pink"],
    tone: "cream",
    featured: true,
  },
  {
    slug: "woven-leather-tote",
    images: [`${IMG}/set2_black-hobo_packshot.jpg`, `${IMG}/detail_woven-leather-tote.jpg`],
    label: "Woven",
    name: "Woven Leather Tote",
    category: "tote-bags",
    price: 330,
    currency: "USD",
    materials: "Full-grain woven leather, leather shoulder straps",
    dimensions: "30–40 × 20–30 × 10–20 cm",
    craftsmanship:
      "A sturdy woven body over comfortable shoulder straps, with a spacious interior and multiple pockets — built for daily use, work, or travel.",
    description:
      "The full-grain woven tote in classic tan — a timeless everyday piece whose weave only improves with wear.",
    colors: ["Tan", "Brown"],
    tone: "cognac",
  },

  // ── Sling & Crossbody ─────────────────────────────────────────────
  {
    slug: "braided-sling-bag",
    images: [`${IMG}/set2_tan-tote_packshot.jpg`, `${IMG}/detail_braided-sling-bag.jpg`],
    label: "Sling",
    name: "Braided Sling Bag",
    category: "sling-crossbody",
    price: 195,
    currency: "USD",
    materials: "Vegetable-tanned, chrome-free braided leather, adjustable shoulder strap",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "The house braid worked into a compact crossover body with an adjustable shoulder strap — light on the shoulder, generous inside, and safe to wear against your skin daily.",
    description:
      "Room for everything you actually need — keys, phone, cards and cosmetics — braided into one hands-free carry. Vegetable-tanned and chrome-free for ultimate comfort.",
    colors: ["Brown", "Tan", "Black"],
    tone: "umber",
    featured: true,
  },
  {
    slug: "sling-clutch-convertible",
    images: [`${IMG}/hobo_packshot.jpg`, `${IMG}/hobo_lifestyle.jpg`],
    video: `${VID}/brown-hobo.mp4`,
    videoPoster: `${VID}/brown-hobo.jpg`,
    label: "Duet",
    name: "Sling-Clutch Convertible",
    category: "sling-crossbody",
    price: 185,
    currency: "USD",
    materials: "Chrome-free braided leather, detachable strap",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "One braided body, two bags: worn crossbody on its strap by day, carried as a clutch by night — made in every style and colour of the house.",
    description:
      "Our braided sling and clutch in one — detach the strap and the day bag becomes the evening one.",
    colors: ["Brown", "Tan", "Black"],
    tone: "ink",
  },
  {
    slug: "green-crossbody",
    images: [`${IMG}/green-tote.jpg`, `${IMG}/detail_green-crossbody.jpg`],
    label: "Green",
    name: "Crossbody in Green",
    category: "sling-crossbody",
    price: 210,
    currency: "USD",
    materials: "Full-grain leather",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "A structured little crossbody in the workshop's deep green, cut plain to let the grain of the leather do the talking.",
    description:
      "The plainest bag we make, in the boldest colour — a modern crossbody in leaf green.",
    colors: ["Green", "Brown", "Black"],
    tone: "olive",
  },

  // ── Baskets & Home ────────────────────────────────────────────────
  {
    slug: "leather-basket",
    images: [`${IMG}/set2_brown-bucket_packshot.jpg`, `${IMG}/detail_leather-basket.jpg`],
    video: `${VID}/tan-basket-tote.mp4`,
    videoPoster: `${VID}/tan-basket-tote.jpg`,
    label: "Basket",
    name: "Leather Basket",
    category: "woven-basket-bags",
    price: 290,
    currency: "USD",
    materials: "Vegetable-tanned, chrome-free full-grain leather, plain weave",
    dimensions: "46 × 30 × 30 cm (18 × 12 × 12 in)",
    weight: "≈ 2 kg",
    craftsmanship:
      "Traditional basketry worked in vegetable-tanned leather over a holding form — a hallway catch-all that will outlast any cane basket it replaces, fully biodegradable and safe for the home.",
    description:
      "For the hall table: a vegetable-tanned, chrome-free leather basket for keys, cards and phone, in green, white or black. Built to last generations.",
    colors: ["Green", "White", "Black"],
    tone: "olive",
    featured: true,
  },
  {
    slug: "leather-box-bag",
    images: [`${IMG}/set2_espresso-tote_packshot.jpg`, `${IMG}/detail_leather-box-bag.jpg`],
    label: "Box",
    name: "Leather Box Bag",
    category: "woven-basket-bags",
    price: 220,
    currency: "USD",
    materials: "Full-grain leather",
    dimensions: "Various sizes available",
    craftsmanship:
      "Cut and folded into a crisp box silhouette, with corners set by hand — a modern shape from a traditional bench.",
    description:
      "A structured box bag in plain leather — architectural, compact, and quietly striking.",
    colors: ["Tan", "Brown", "Black"],
    tone: "ink",
  },

  // ── Clutches & Potli ──────────────────────────────────────────────
  {
    slug: "ladies-leather-clutch-purse",
    images: [`${IMG}/ladies-clutch.jpg`, `${IMG}/detail_ladies-leather-clutch-purse.jpg`],
    label: "Clutch",
    name: "Leather Clutch Purse",
    category: "clutches",
    price: 165,
    currency: "USD",
    materials: "Vegetable-tanned, chrome-free full-grain leather",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "A slim, primarily hand-held silhouette finished entirely by hand — made in the workshop's full colour range, twenty pieces per colour at a time. Vegetable-tanned and safe for your skin.",
    description:
      "The casual clutch in pink, red, blue, yellow, green or brown — flat enough to disappear under an arm. Vegetable-tanned, chrome-free, and built to age beautifully.",
    colors: ["Brown", "Pink", "Red", "Blue", "Yellow", "Green"],
    tone: "ink",
    featured: true,
  },
  {
    slug: "braided-leather-clutch",
    images: [`${IMG}/braided-clutch.jpg`, `${IMG}/detail_braided-leather-clutch.jpg`],
    label: "Braided",
    name: "Braided Leather Clutch",
    category: "clutches",
    price: 175,
    currency: "USD",
    materials: "Chrome-free braided leather",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "The signature braid scaled down to an evening panel — pure vegetable, chrome-free leather, woven and mounted by hand.",
    description:
      "Our hand-braid at its most concentrated: a full woven face on a clean evening clutch — including a soft metallic silver for evening.",
    colors: ["Silver", "Brown", "Tan", "Black"],
    tone: "cognac",
  },
  {
    slug: "potli-bag",
    images: [`${IMG}/potli.jpg`, `${IMG}/detail_potli-bag.jpg`],
    label: "Potli",
    name: "Potli Bag",
    category: "clutches",
    price: 95,
    currency: "USD",
    materials: "Leather, drawstring closure",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "The traditional Indian drawstring pouch, rendered in workshop leather — gathered, corded, and finished by hand.",
    description:
      "A heritage silhouette from our own part of the world: the potli, for evenings, weddings, and small precious things.",
    colors: ["Tan", "Brown"],
    tone: "sand",
  },

  {
    slug: "leather-waist-bag",
    images: [`${IMG}/waist-bag.jpg`, `${IMG}/waist-bag_2.jpg`, `${IMG}/detail_leather-waist-bag.jpg`],
    label: "Waist",
    name: "Leather Waist Bag",
    category: "sling-crossbody",
    price: 150,
    currency: "USD",
    materials: "Full-grain leather, metal buckle",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "Built on our long-running export waist-bag pattern, refined with a hand-finished edge and interior zip pocket.",
    description:
      "A hands-free companion for travel days — sized for a phone, cards, and a passport.",
    colors: ["Tan", "Brown", "Black"],
    tone: "umber",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((p) => p.category === categorySlug);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}
