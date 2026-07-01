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
}

/**
 * Catalog seeded from P.M. Rahamathulla & Co's public TradeIndia /
 * IndiaMART range (est. 2016, Periyamet, Chennai). Wholesale listings
 * don't publish full retail specs, so dimensions default to
 * made-to-order sizing and prices are proposed D2C retail — both
 * should be confirmed against the workshop's spec sheets.
 */
export const products: Product[] = [
  // Leather Totes
  {
    slug: "woven-braided-laptop-tote",
    label: "Braided",
    name: "Woven Braided Laptop Tote",
    category: "tote-bags",
    price: 345,
    currency: "USD",
    materials: "Hand-braided full-grain leather, reinforced base",
    dimensions: "Fits up to a 15″ laptop · standard & custom sizes",
    craftsmanship:
      "Our signature export piece: fine leather strips are interlaced entirely by hand into a weave strong enough to carry a working day, with a padded sleeve stitched in for the laptop.",
    description:
      "The bag our buyers abroad kept reordering — a hand-braided leather tote sized for a laptop, papers, and everything between.",
    colors: ["Tan", "Brown", "Black"],
    tone: "cognac",
    featured: true,
  },
  {
    slug: "leather-u-shape-tote",
    label: "U-Shape",
    name: "Leather U-Shape Tote",
    category: "tote-bags",
    price: 320,
    currency: "USD",
    materials: "Full-grain leather, tonal stitching",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "Cut on a rounded U-line pattern that lets the leather relax into a soft, open silhouette, with handles rolled and stitched by hand.",
    description:
      "A generous, curved everyday tote — the softer of our two signature tote lines, offered in a range of colours.",
    colors: ["Tan", "Brown", "Black", "Custom colours on request"],
    tone: "umber",
    featured: true,
  },
  {
    slug: "leather-v-shape-tote",
    label: "V-Shape",
    name: "Leather V-Shape Tote",
    category: "tote-bags",
    price: 320,
    currency: "USD",
    materials: "Full-grain leather, tonal stitching",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "The V-line pattern tapers toward the base for a sharper, more architectural profile that holds its shape empty or full.",
    description:
      "The structured counterpart to our U-shape tote — a tapered silhouette for those who like a cleaner line.",
    colors: ["Tan", "Brown", "Black", "Custom colours on request"],
    tone: "cognac",
  },

  // Basket & Woven Bags
  {
    slug: "leather-basket-bag",
    label: "Basket",
    name: "Leather Basket Bag",
    category: "woven-basket-bags",
    price: 290,
    currency: "USD",
    materials: "Full-grain leather, open basket weave",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "Traditional basketry technique worked in leather strips rather than cane — each basket is woven over a form, then edged and handled by hand.",
    description:
      "Our take on the market basket: the warmth of woven cane, rendered in leather that ages where straw would fray.",
    colors: ["Tan", "Natural", "Brown"],
    tone: "sand",
    featured: true,
  },
  {
    slug: "water-reed-bag",
    label: "Reed",
    name: "Water Reed Bag",
    category: "woven-basket-bags",
    price: 180,
    currency: "USD",
    materials: "Natural water reed, leather trim & handles",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "Water reed is soaked, woven, and sun-dried the way basket-makers here have always worked it, then finished with leather handles from our own bench.",
    description:
      "A natural-fibre carry-all that pairs hand-woven reed with the workshop's leather trim — light, breathable, and summer-ready.",
    colors: ["Natural", "Natural / Tan trim"],
    tone: "olive",
    featured: true,
  },
  {
    slug: "straw-market-bag",
    label: "Straw",
    name: "Straw Market Bag",
    category: "woven-basket-bags",
    price: 140,
    currency: "USD",
    materials: "Woven straw, leather handles",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "Woven from straw in an open checker pattern and bound at the rim by hand, with stitched leather handles set to sit flat on the shoulder.",
    description:
      "An easy, open market bag in woven straw — the most relaxed piece in the range.",
    colors: ["Natural"],
    tone: "cream",
  },
  {
    slug: "leather-bottle-bag",
    label: "Bottle",
    name: "Leather Bottle Bag",
    category: "woven-basket-bags",
    price: 120,
    currency: "USD",
    materials: "Full-grain leather, adjustable strap",
    dimensions: "Fits standard wine & water bottles",
    craftsmanship:
      "A single hide sleeve, wet-moulded to the bottle's curve and hand-stitched up one seam — no lining, no filler.",
    description:
      "A slim leather carrier for a bottle of wine or water — a small piece that shows the workshop's moulding and stitching at close range.",
    colors: ["Tan", "Brown"],
    tone: "umber",
  },

  // Clutches
  {
    slug: "ladies-leather-clutch-purse",
    label: "Clutch",
    name: "Ladies' Leather Clutch Purse",
    category: "clutches",
    price: 165,
    currency: "USD",
    materials: "Full-grain leather, secure closure",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "Built as a structured purse-clutch with interior card slots and a hand-set closure, edges burnished in multiple passes.",
    description:
      "The more finished of our two clutch lines — structured enough for evening, organised enough for every day.",
    colors: ["Black", "Brown", "Tan"],
    tone: "ink",
    featured: true,
  },
  {
    slug: "leather-clutch-bag",
    label: "Clutch",
    name: "Leather Clutch Bag",
    category: "clutches",
    price: 130,
    currency: "USD",
    materials: "Full-grain leather",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "A flat-pattern clutch cut from quality hide and finished by hand — the piece our workshop has produced at export scale for years.",
    description:
      "A clean, fold-flat clutch in quality leather — simple on purpose, made to disappear under an arm.",
    colors: ["Tan", "Brown", "Black", "Custom colours on request"],
    tone: "cognac",
  },

  // Leather Wallets
  {
    slug: "chrome-free-mens-wallet",
    label: "Bifold",
    name: "Chrome-Free Men's Wallet",
    category: "leather-wallets",
    price: 85,
    currency: "USD",
    materials: "Chrome-free tanned leather",
    dimensions: "Standard bifold sizing",
    craftsmanship:
      "Tanned without chromium salts — gentler on skin and on the tanneries' effluent — then cut, folded, and edge-finished by hand into a classic bifold.",
    description:
      "Our men's bifold in chrome-free leather: the same wallet we manufacture for export, with a cleaner tannage story.",
    colors: ["Brown", "Black", "Tan"],
    tone: "umber",
    featured: true,
  },
  {
    slug: "ladies-leather-wallet",
    label: "Wallet",
    name: "Ladies' Leather Wallet",
    category: "leather-wallets",
    price: 90,
    currency: "USD",
    materials: "Full-grain leather",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "A longer-format wallet with card rows and a zip coin section, saddle-stitched where machine seams would eventually give.",
    description:
      "The companion piece to our men's bifold — a full-size ladies' wallet from the same Chennai bench.",
    colors: ["Tan", "Brown", "Black"],
    tone: "cognac",
  },

  // Belts & Waist Bags
  {
    slug: "braided-leather-belt",
    label: "Braided",
    name: "Braided Leather Belt",
    category: "belts-waist-bags",
    price: 75,
    currency: "USD",
    materials: "Braided leather cord, metal buckle",
    dimensions: "Made to size",
    craftsmanship:
      "Leather cords braided under tension around a stitched core — the technique the rest of our woven range grew out of.",
    description:
      "The piece where our braid began. Every belt is braided to order and cut to your exact size.",
    colors: ["Tan", "Brown", "Black"],
    tone: "sand",
    featured: true,
  },
  {
    slug: "mens-leather-belt",
    label: "Classic",
    name: "Men's Leather Belt",
    category: "belts-waist-bags",
    price: 70,
    currency: "USD",
    materials: "Full-grain leather, metal buckle",
    dimensions: "Made to size",
    craftsmanship:
      "A single thickness of full-grain hide — no bonded layers — with edges dyed and burnished by hand.",
    description:
      "A plain, honest belt in full-grain leather, built to outlast the wardrobe around it.",
    colors: ["Brown", "Black", "Tan"],
    tone: "ink",
  },
  {
    slug: "ladies-belt",
    label: "Slim",
    name: "Ladies' Belt",
    category: "belts-waist-bags",
    price: 65,
    currency: "USD",
    materials: "Full-grain leather, metal buckle",
    dimensions: "Made to size",
    craftsmanship:
      "Cut narrower and finished with a lighter buckle, in the same single-hide construction as our men's line.",
    description:
      "A slim leather belt made to size, in the workshop's core colours or a custom shade on request.",
    colors: ["Tan", "Brown", "Black", "Custom colours on request"],
    tone: "cognac",
  },
  {
    slug: "leather-waist-bag",
    label: "Waist",
    name: "Leather Waist Bag",
    category: "belts-waist-bags",
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
