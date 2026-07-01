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
    name: "Leather Totes",
    shortName: "Totes",
    tagline: "Woven and stitched, shaped by hand",
    description:
      "Our tote silhouettes — the U-shape, the V-shape, and the hand-braided laptop tote — have anchored our export range for years. Full-grain leather, structured to carry a working day and soften into your own.",
    tone: "cognac",
  },
  {
    slug: "woven-basket-bags",
    name: "Basket & Woven Bags",
    shortName: "Baskets",
    tagline: "Basketry, reimagined in leather and reed",
    description:
      "A tribute to traditional Indian basketry: leather basket bags, water reed and straw weaves, and our bottle bag — natural materials interlaced by hand in the Chennai workshop.",
    tone: "olive",
  },
  {
    slug: "clutches",
    name: "Clutches",
    shortName: "Clutches",
    tagline: "Evening structure, quiet detail",
    description:
      "Compact, considered pieces finished entirely by hand — from the everyday leather clutch to our structured ladies' clutch purse.",
    tone: "ink",
  },
  {
    slug: "leather-wallets",
    name: "Leather Wallets",
    shortName: "Wallets",
    tagline: "Chrome-free leather, precisely built",
    description:
      "Wallets cut from chrome-free, naturally tanned hide — kinder to skin and to the tanneries' water — edge-finished by hand to a soft sheen that deepens with use.",
    tone: "umber",
  },
  {
    slug: "belts-waist-bags",
    name: "Belts & Waist Bags",
    shortName: "Belts",
    tagline: "The original hand-braid",
    description:
      "Where our workshop's braid began: men's and ladies' belts — plain and hand-braided — alongside the leather waist bag built on our export pattern.",
    tone: "sand",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
