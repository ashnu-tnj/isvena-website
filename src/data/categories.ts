export type Tone = "cognac" | "umber" | "sand" | "ink" | "olive" | "cream";

export interface Category {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  tone: Tone;
  /** Representative product photo used for category tiles and hero. */
  image?: string;
}

export const categories: Category[] = [
  {
    slug: "totes-carryalls",
    name: "Totes & Carryalls",
    shortName: "Totes",
    tagline: "Everyday architecture, woven by hand",
    description:
      "The heart of the collection: six hand-woven carryalls in vegetable-tanned, chrome-free full-grain leather — from the tall, laptop-ready Verona to the grand forest-green Oliva. Each is interlaced strip by strip, unlined, and built to soften rather than wear out.",
    tone: "cognac",
    image: "/products/lucca-life.jpg",
  },
  {
    slug: "shoulder-hobo",
    name: "Shoulder & Hobo",
    shortName: "Shoulder",
    tagline: "Soft curves, worn close",
    description:
      "Bags that drape rather than sit. The slouching Sofia hobo, the moon-curved Luna, and the metallic Stella flap — shoulder silhouettes cut close to the body, woven in weaves fine enough to read as texture.",
    tone: "umber",
    image: "/products/sofia-life.jpg",
  },
  {
    slug: "crossbody-belt",
    name: "Crossbody & Belt",
    shortName: "Crossbody",
    tagline: "Hands-free, never careless",
    description:
      "For moving through the day: the miniature Piccola basket on a long braided strap, and the Vita belt bag with its antique-brass zip — worn at the waist or across the chest, and the most secure pieces we make.",
    tone: "ink",
    image: "/products/vita-life.jpg",
  },
  {
    slug: "clutches-minis",
    name: "Clutches & Minis",
    shortName: "Clutches",
    tagline: "Small rituals, done beautifully",
    description:
      "The smallest pieces carry the tightest weaves. The Sera wristlet clutch with its scalloped whip-stitched border, and the Gioia drawstring bucket finished with a hand-cut tassel.",
    tone: "sand",
    image: "/products/gioia-life.jpg",
  },
  {
    slug: "small-leather-goods",
    name: "Small Leather Goods",
    shortName: "Small Goods",
    tagline: "The everyday details, held to the same standard",
    description:
      "The house weave at its most disciplined scale: the Treccia belt, plaited from nine strands and adjustable at any point along its length, and the Milano bifold, woven outside and lined in plain nappa so cards slide rather than catch.",
    tone: "umber",
    image: "/products/treccia-hero.jpg",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
