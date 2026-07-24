export type Tone = "cognac" | "umber" | "sand" | "ink" | "olive" | "cream";

export interface Category {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  tone: Tone;
}

export const categories: Category[] = [
  {
    slug: "tote-bags",
    name: "Hand-Braided Totes",
    shortName: "Totes",
    tagline: "Vegetable-tanned, chrome-free, woven strip by strip",
    description:
      "Our signature line and the heart of the workshop: totes braided by hand from vegetable-tanned, chrome-free, full-grain leather strips — safe for your skin, fully biodegradable, and woven to outlast a lifetime. From the classic open carryall to laptop-ready silhouettes in red, tan, rose, brown, black and green.",
    tone: "cognac",
  },
  {
    slug: "sling-crossbody",
    name: "Sling & Crossbody",
    shortName: "Slings",
    tagline: "Vegetable-tanned, hands-free, braided light",
    description:
      "Braided vegetable-tanned, chrome-free leather slings, crossbody and waist bags — compact companions that carry the essentials, leave your hands free, and are safe for daily wear against your skin.",
    tone: "umber",
  },
  {
    slug: "woven-basket-bags",
    name: "Baskets & Home",
    shortName: "Baskets",
    tagline: "Basketry for the wardrobe and the hallway",
    description:
      "Leather baskets and box bags for the home, sea grass and water reed totes for the market, the bottle bag for the table — and our woven leather wall tiles, the workshop's quietest surprise.",
    tone: "olive",
  },
  {
    slug: "clutches",
    name: "Clutches & Potli",
    shortName: "Clutches",
    tagline: "Evening structure, quiet detail",
    description:
      "Hand-finished clutch purses in the workshop's full colour range — pink, red, blue, yellow, green and brown — alongside the braided clutch and the traditional potli bag.",
    tone: "ink",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
