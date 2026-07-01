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
    slug: "hand-braided-totes",
    name: "Hand-Braided Totes",
    shortName: "Totes",
    tagline: "Woven by hand, strip by strip",
    description:
      "Our signature silhouette. Full-grain leather is cut into fine strips and interlaced entirely by hand, a technique passed down through generations of Tamil Nadu artisans, giving every tote a structure and texture no machine can replicate.",
    tone: "cognac",
  },
  {
    slug: "leather-wallets",
    name: "Leather Wallets",
    shortName: "Wallets",
    tagline: "Everyday carry, precisely built",
    description:
      "Slim bifolds and cardholders cut from vegetable-tanned hide, edge-painted and hand-burnished to a soft sheen that only deepens with use.",
    tone: "umber",
  },
  {
    slug: "clutches",
    name: "Clutches",
    shortName: "Clutches",
    tagline: "Evening structure, quiet detail",
    description:
      "Compact, considered pieces for evenings out — braided panels and clean edges finished entirely by hand in our Ambur atelier.",
    tone: "ink",
  },
  {
    slug: "bags",
    name: "Crossbody & Shoulder Bags",
    shortName: "Bags",
    tagline: "Built for the everyday commute",
    description:
      "From market baskets to structured shoulder bags, each piece balances the durability our workshop is known for with a lighter, city-ready silhouette.",
    tone: "olive",
  },
  {
    slug: "belts",
    name: "Braided Belts",
    shortName: "Belts",
    tagline: "The original hand-braid",
    description:
      "Where our workshop began. Narrow leather cords, braided tight and finished with solid brass hardware, built to outlast the wardrobe around them.",
    tone: "sand",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
