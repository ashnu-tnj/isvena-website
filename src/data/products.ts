import type { Tone } from "./categories";

export interface Product {
  slug: string;
  name: string;
  category: string; // category slug
  price: number;
  currency: "USD";
  materials: string;
  dimensions: string;
  weight?: string;
  craftsmanship: string;
  description: string;
  colors: string[];
  tone: Tone;
  featured?: boolean;
}

export const products: Product[] = [
  // Hand-Braided Totes
  {
    slug: "amara-hand-braided-tote",
    name: "Amara Hand-Braided Tote",
    category: "hand-braided-totes",
    price: 380,
    currency: "USD",
    materials: "Full-grain vegetable-tanned leather, brass hardware",
    dimensions: "40 x 30 x 14 cm",
    weight: "0.9 kg",
    craftsmanship:
      "Over 900 individual leather strips are cut, conditioned, and interlaced by hand across roughly 14 hours of weaving per bag.",
    description:
      "Our signature tote, woven from a single hide in an open basket pattern that softens and relaxes beautifully with wear.",
    colors: ["Cognac", "Umber", "Black"],
    tone: "cognac",
    featured: true,
  },
  {
    slug: "kavya-market-tote",
    name: "Kavya Market Tote",
    category: "hand-braided-totes",
    price: 340,
    currency: "USD",
    materials: "Full-grain leather, cotton-canvas lining",
    dimensions: "38 x 28 x 12 cm",
    weight: "0.8 kg",
    craftsmanship:
      "A tighter, closed weave for structure, hand-stitched at every seam and finished with a rolled top edge.",
    description:
      "An everyday companion built on the same braiding technique as our Amara tote, sized for the daily commute.",
    colors: ["Sand", "Cognac"],
    tone: "sand",
  },
  {
    slug: "meera-oversized-tote",
    name: "Meera Oversized Tote",
    category: "hand-braided-totes",
    price: 420,
    currency: "USD",
    materials: "Full-grain leather, reinforced braided handles",
    dimensions: "45 x 34 x 16 cm",
    weight: "1.1 kg",
    craftsmanship:
      "Handles are braided from six cords rather than two for extra strength, a detail unique to our larger totes.",
    description:
      "Room for a laptop, a change of shoes, and everything in between — without losing the hand of the leather.",
    colors: ["Umber", "Black"],
    tone: "umber",
  },

  // Leather Wallets
  {
    slug: "rahim-bifold-wallet",
    name: "Rahim Bifold Wallet",
    category: "leather-wallets",
    price: 85,
    currency: "USD",
    materials: "Vegetable-tanned leather, hand-burnished edges",
    dimensions: "11 x 9 cm",
    craftsmanship:
      "Edges are sanded, dyed, and burnished by hand in four passes for a rounded, glass-smooth finish.",
    description:
      "A slim six-card bifold cut from a single piece of hide, named for the founder of our workshop.",
    colors: ["Black", "Umber", "Cognac"],
    tone: "umber",
    featured: true,
  },
  {
    slug: "arjun-cardholder",
    name: "Arjun Cardholder",
    category: "leather-wallets",
    price: 55,
    currency: "USD",
    materials: "Full-grain leather",
    dimensions: "10 x 7 cm",
    craftsmanship:
      "A single fold, four pockets, and one continuous line of saddle stitching for a minimal everyday carry.",
    description:
      "For those who carry less. Fits flush in a front pocket and ages into a personal patina within weeks.",
    colors: ["Cognac", "Black", "Sand"],
    tone: "sand",
  },
  {
    slug: "zainab-braided-trifold",
    name: "Zainab Braided Trifold",
    category: "leather-wallets",
    price: 95,
    currency: "USD",
    materials: "Vegetable-tanned leather, braided trim",
    dimensions: "12 x 9.5 cm",
    craftsmanship:
      "A narrow hand-braided panel runs along the spine, a nod to our totes in a smaller, everyday form.",
    description:
      "Three-panel construction with a coin pocket, finished with the same braid used across our bag collection.",
    colors: ["Umber", "Cognac"],
    tone: "cognac",
  },

  // Clutches
  {
    slug: "nadia-evening-clutch",
    name: "Nadia Evening Clutch",
    category: "clutches",
    price: 210,
    currency: "USD",
    materials: "Full-grain leather, brass frame clasp",
    dimensions: "26 x 16 x 4 cm",
    craftsmanship:
      "A solid brass frame is hand-set into the leather shell, then lined in raw silk sourced from a family-run weaver.",
    description:
      "Structured enough to hold its shape, soft enough to fold flat — designed for evenings that run long.",
    colors: ["Black", "Umber"],
    tone: "ink",
    featured: true,
  },
  {
    slug: "leela-braided-clutch",
    name: "Leela Braided Clutch",
    category: "clutches",
    price: 195,
    currency: "USD",
    materials: "Full-grain leather, hand-braided front panel",
    dimensions: "28 x 15 x 3 cm",
    craftsmanship:
      "The front panel alone takes close to three hours to weave before it's mounted onto the clutch body.",
    description:
      "Our tote's signature weave, scaled down into a flat evening silhouette with a discreet magnetic close.",
    colors: ["Cognac", "Sand"],
    tone: "cognac",
  },

  // Bags
  {
    slug: "safiya-crossbody",
    name: "Safiya Crossbody",
    category: "bags",
    price: 260,
    currency: "USD",
    materials: "Full-grain leather, adjustable braided strap",
    dimensions: "24 x 18 x 8 cm",
    craftsmanship:
      "A single hide is used per bag to keep grain and color consistent across the body and strap.",
    description:
      "A compact city bag with a fully adjustable, hand-braided strap and a structured base that keeps its shape.",
    colors: ["Olive", "Umber", "Black"],
    tone: "olive",
    featured: true,
  },
  {
    slug: "ishaan-waist-bag",
    name: "Ishaan Waist Bag",
    category: "bags",
    price: 150,
    currency: "USD",
    materials: "Full-grain leather, solid brass buckle",
    dimensions: "20 x 14 x 6 cm",
    craftsmanship:
      "Built on the same pattern as our export waist bags, refined with a hand-finished edge and interior zip.",
    description:
      "A hands-free companion for travel days, sized for a phone, cards, and a passport.",
    colors: ["Cognac", "Black"],
    tone: "umber",
  },
  {
    slug: "priya-woven-basket-bag",
    name: "Priya Woven Basket Bag",
    category: "bags",
    price: 300,
    currency: "USD",
    materials: "Full-grain leather, structured base",
    dimensions: "30 x 22 x 16 cm",
    craftsmanship:
      "A rounded, basket-inspired silhouette built over a reinforced base for shape that holds without stiffening the leather.",
    description:
      "Rooted in traditional basket weaving, reinterpreted in leather for a softer, everyday shoulder bag.",
    colors: ["Sand", "Cognac"],
    tone: "sand",
  },

  // Belts
  {
    slug: "vikram-braided-belt",
    name: "Vikram Braided Belt",
    category: "belts",
    price: 75,
    currency: "USD",
    materials: "Leather cord, solid brass buckle",
    dimensions: "Made to size, 3 cm width",
    craftsmanship:
      "Eight leather cords are braided under tension around a stitched core for a belt that won't stretch out of shape.",
    description:
      "The piece our workshop was founded on. Every belt is braided to order and cut to your exact size.",
    colors: ["Black", "Umber", "Cognac"],
    tone: "sand",
    featured: true,
  },
  {
    slug: "farah-reversible-belt",
    name: "Farah Reversible Belt",
    category: "belts",
    price: 90,
    currency: "USD",
    materials: "Full-grain leather, rotating brass buckle",
    dimensions: "Made to size, 3.5 cm width",
    craftsmanship:
      "Two hides are laminated back-to-back by hand and pressed under weight for 48 hours before cutting.",
    description:
      "Black on one side, cognac on the other — one belt, finished to switch with a simple twist of the buckle.",
    colors: ["Black / Cognac"],
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
