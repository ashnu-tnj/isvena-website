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
    label: "Braided",
    name: "Signature Hand-Braided Tote",
    category: "tote-bags",
    price: 320,
    currency: "USD",
    materials: "Chrome-free full-grain leather, hand-braided",
    dimensions: "46 × 46 × 30 cm (18 × 18 × 12 in)",
    weight: "≈ 2 kg",
    craftsmanship:
      "Chrome-free leather strips are interlaced entirely by hand into the workshop's signature open weave — soft and pliable from the first carry, and more so with every year.",
    description:
      "The bag the workshop is known for, made in every house colour — red, tan, rose, brown, black and green.",
    colors: ["Tan", "Brown", "Black", "Red", "Rose", "Green"],
    tone: "cognac",
    featured: true,
  },
  {
    slug: "woven-braided-laptop-tote",
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
    label: "Sling",
    name: "Braided Sling Bag",
    category: "sling-crossbody",
    price: 195,
    currency: "USD",
    materials: "Chrome-free braided leather, adjustable shoulder strap",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "The house braid worked into a compact crossover body with an adjustable shoulder strap — light on the shoulder, generous inside.",
    description:
      "Room for everything you actually need — keys, phone, cards and cosmetics — braided into one hands-free carry.",
    colors: ["Brown", "Tan", "Black"],
    tone: "umber",
    featured: true,
  },
  {
    slug: "sling-clutch-convertible",
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
    label: "Basket",
    name: "Leather Basket",
    category: "woven-basket-bags",
    price: 290,
    currency: "USD",
    materials: "Full-grain leather, plain weave",
    dimensions: "46 × 30 × 30 cm (18 × 12 × 12 in)",
    weight: "≈ 2 kg",
    craftsmanship:
      "Traditional basketry worked in leather over a holding form — a hallway catch-all that will outlast any cane basket it replaces.",
    description:
      "For the hall table: a leather basket for keys, wallet and phone, in green, white or black.",
    colors: ["Green", "White", "Black"],
    tone: "olive",
    featured: true,
  },
  {
    slug: "leather-box-bag",
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
      "A single hide sleeve, moulded to the bottle's curve and hand-stitched up one seam — no lining, no filler.",
    description:
      "A slim leather carrier for a bottle of wine or water — a small piece that shows the workshop's stitching at close range.",
    colors: ["Tan", "Brown"],
    tone: "umber",
  },
  {
    slug: "water-reed-bag",
    label: "Reed",
    name: "Water Reed Bag",
    category: "woven-basket-bags",
    price: 180,
    currency: "USD",
    materials: "Natural water reed, leather trim & handles",
    dimensions: "Various sizes available",
    craftsmanship:
      "Water reed is soaked, woven and sun-dried the way basket-makers here have always worked it, then finished with leather handles from our own bench.",
    description:
      "A natural-fibre carry-all pairing hand-woven reed with the workshop's leather trim — light, breathable, summer-ready.",
    colors: ["Natural", "Natural / Tan trim"],
    tone: "sand",
  },
  {
    slug: "sea-grass-straw-tote",
    label: "Straw",
    name: "Sea Grass Straw Tote",
    category: "woven-basket-bags",
    price: 95,
    currency: "USD",
    materials: "Woven sea grass (150–170 GSM)",
    dimensions: "46 × 30 × 30 cm (18 × 12 × 12 in)",
    craftsmanship:
      "Sea grass woven into an open square tote and bound at the rim by hand — sized for the market, the picnic, or the beach.",
    description:
      "The most relaxed piece in the range: a woven sea grass tote for groceries, travel days and everything in between.",
    colors: ["Natural Brown"],
    tone: "cream",
  },
  {
    slug: "woven-leather-wall-tile",
    label: "Tile",
    name: "Woven Leather Wall Tile",
    category: "woven-basket-bags",
    price: 45,
    currency: "USD",
    materials: "Woven leather, matte finish, 2 mm",
    dimensions: "46 × 46 cm (18 × 18 in) per tile",
    craftsmanship:
      "The house weave flattened into a matte wall tile — leather's warmth for interiors, and a natural softener for rooms where noise is an issue.",
    description:
      "The workshop's quietest product, literally: woven leather tiles that dress a wall and soften its sound.",
    colors: ["Brown"],
    tone: "umber",
  },

  // ── Clutches & Potli ──────────────────────────────────────────────
  {
    slug: "ladies-leather-clutch-purse",
    label: "Clutch",
    name: "Leather Clutch Purse",
    category: "clutches",
    price: 165,
    currency: "USD",
    materials: "Full-grain leather",
    dimensions: "Standard & custom sizes available",
    craftsmanship:
      "A slim, primarily hand-held silhouette finished entirely by hand — made in the workshop's full colour range, twenty pieces per colour at a time.",
    description:
      "The casual clutch in pink, red, blue, yellow, green or brown — flat enough to disappear under an arm.",
    colors: ["Brown", "Pink", "Red", "Blue", "Yellow", "Green"],
    tone: "ink",
    featured: true,
  },
  {
    slug: "braided-leather-clutch",
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
      "Our hand-braid at its most concentrated: a full woven face on a clean evening clutch.",
    colors: ["Brown", "Tan", "Black"],
    tone: "cognac",
  },
  {
    slug: "potli-bag",
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

  // ── Leather Wallets ───────────────────────────────────────────────
  {
    slug: "woven-top-mens-wallet",
    label: "Woven",
    name: "Woven-Top Men's Wallet",
    category: "leather-wallets",
    price: 95,
    currency: "USD",
    materials: "Premium leather, woven top layer, button snap",
    dimensions: "9 × 11.5 cm closed (3.5 × 4.5 in) · ≈ 115 g",
    craftsmanship:
      "A woven leather top layer over a classic body: six card slots, two cash compartments, and a button-snap close — texture where most wallets are plain.",
    description:
      "Our most finished wallet — the house weave on the outside, six slots of organisation within.",
    colors: ["Dark Brown", "Black", "Tan"],
    tone: "umber",
    featured: true,
  },
  {
    slug: "mens-braided-bifold",
    label: "Bifold",
    name: "Men's Braided Bifold",
    category: "leather-wallets",
    price: 85,
    currency: "USD",
    materials: "Chrome-free braided leather",
    dimensions: "Standard bifold sizing",
    craftsmanship:
      "The braid worked into a bifold face, in colours few wallet racks carry — sea blue among them — with edges burnished by hand.",
    description:
      "A braided bifold in sea blue, tan, brown or black — the everyday wallet with the workshop's signature texture.",
    colors: ["Sea Blue", "Tan", "Brown", "Black"],
    tone: "cognac",
  },
  {
    slug: "classic-mens-bifold",
    label: "Classic",
    name: "Classic Men's Bifold",
    category: "leather-wallets",
    price: 70,
    currency: "USD",
    materials: "Chrome-free leather",
    dimensions: "Standard bifold sizing · 4 card slots",
    craftsmanship:
      "Chrome-free hide folded into the simplest possible bifold: four card slots, one note compartment, edges finished in multiple hand passes.",
    description:
      "The plain, honest bifold — A-grade chrome-free leather and nothing it doesn't need.",
    colors: ["Brown", "Blue"],
    tone: "sand",
  },

  // ── Belts & Waist Bags ────────────────────────────────────────────
  {
    slug: "braided-leather-belt",
    label: "Braided",
    name: "Braided Leather Belt",
    category: "belts-waist-bags",
    price: 75,
    currency: "USD",
    materials: "Braided leather, metal buckle",
    dimensions: "Made to size · 3 cm width",
    craftsmanship:
      "Leather cords braided under tension around a stitched core — the casual alternative to the classic belt, and the technique our whole woven range grew from.",
    description:
      "The unisex braided belt in brown or black — braided to order and cut to your exact size.",
    colors: ["Brown", "Black"],
    tone: "cream",
    featured: true,
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
