import type { Tone } from "./categories";

export interface Product {
  slug: string;
  /** Catalogue reference, e.g. ISV-001. Also used as the warehouse SKU. */
  sku: string;
  /** House name — Verona, Siena, Luna. */
  name: string;
  /** Descriptive line beneath the name, e.g. "Tall Shoulder Tote — Espresso". */
  subName: string;
  category: string; // category slug
  price: number; // D2C retail price in USD
  currency: "USD";
  materials: string;
  dimensions: string;
  /** Strap or handle drop, and how the piece is carried. */
  strap: string;
  /**
   * Heading for the `strap` row. Defaults to "Strap"; the small leather
   * goods use it for sizing and interior layout instead.
   */
  strapLabel?: string;
  /** The weave used, and any structural detail of it. */
  weave: string;
  /** What the piece is sized to hold. */
  fits: string;
  weight?: string;
  craftsmanship: string;
  description: string;
  /**
   * The colour this piece was photographed in. Not a restriction — every
   * silhouette is made to order in any of the house colours (`colors.ts`).
   */
  photographedIn: string;
  tone: Tone;
  /** Closing detail from the catalogue — closure, finish, weight. */
  note?: string;
  /** Short word rendered on the placeholder art panel */
  label: string;
  featured?: boolean;
  /**
   * Real product photography under /public/products. First entry is the
   * primary image (cards, hero); the rest fill the detail-page gallery.
   * Each piece is shot three ways: packshot, lifestyle, weave macro.
   */
  images?: string[];
  /** Silent 360° turntable film under /public/video, and its poster frame. */
  video?: string;
  videoPoster?: string;
}

/** Base path for product photography in /public. */
const IMG = "/products";

/** Base path for the 360° turntable films in /public. */
const VID = "/video";

/** The 360° film and its poster frame for a piece. */
const spin = (slug: string) => ({
  video: `${VID}/${slug}-360.mp4`,
  videoPoster: `${VID}/${slug}-360.jpg`,
});

/** Photography set for a piece: packshot, styled shot, weave close-up. */
const shots = (slug: string) => [
  `${IMG}/${slug}-hero.jpg`,
  `${IMG}/${slug}-life.jpg`,
  `${IMG}/${slug}-weave.jpg`,
];

/**
 * The Signature Collection, 2026 — fifteen pieces, taken from the house
 * catalogue. Every specification here (dimensions, drops, weave, materials)
 * is quoted from that document; prices are D2C retail, scaled to size,
 * weave complexity and finishing.
 */
export const products: Product[] = [
  // ── Totes & Carryalls ─────────────────────────────────────────────
  {
    slug: "verona",
    sku: "ISV-001",
    name: "Verona",
    subName: "Tall Shoulder Tote — Espresso",
    category: "totes-carryalls",
    price: 385,
    currency: "USD",
    materials: "Full-grain vegetable-tanned leather, unlined",
    dimensions: "36 W × 38 H × 12 D cm (14.2″ × 15″ × 4.7″)",
    strap: "28 cm (11″) drop — shoulder carry",
    weave: "Fine diagonal intrecciato, hand-interlaced",
    fits: "14″ laptop, A4 documents, water bottle",
    weight: "approx. 780 g",
    craftsmanship:
      "Woven in a fine diagonal intrecciato that catches the light like polished wood, then set on slim double straps cut to sit flat on the shoulder rather than roll.",
    description:
      "A tall, quietly structured tote in deep espresso. The generous North–South body swallows a 14″ laptop, a book and everything in between. The workhorse of the collection — boardroom in the morning, aperitivo by evening.",
    photographedIn: "Espresso",
    tone: "umber",
    note: "Open top · interior slip pocket recommended",
    label: "Verona",
    images: shots("verona"),
    ...spin("verona"),
  },
  {
    slug: "siena",
    sku: "ISV-002",
    name: "Siena",
    subName: "Handheld Basket Tote — Cognac",
    category: "totes-carryalls",
    price: 365,
    currency: "USD",
    materials: "Full-grain vegetable-tanned leather, unlined",
    dimensions: "40 W × 24 H × 16 D cm (15.7″ × 9.4″ × 6.3″)",
    strap: "14 cm (5.5″) handle drop — hand or forearm carry",
    weave: "Wide-strap intrecciato, hand-interlaced",
    fits: "Long wallet, sunglasses case, small tablet, cosmetics pouch",
    craftsmanship:
      "A softly flared East–West basket gathered into a single rounded handle finished with a braided crown. The wide intrecciato gives it a supple, almost cushioned hand-feel that moulds to whatever it carries.",
    description:
      "The silhouette that defines the house. Warm cognac, effortless with linen in summer and a camel coat in winter.",
    photographedIn: "Cognac",
    tone: "cognac",
    note: "Softly slouches with wear · develops a rich patina over time",
    label: "Siena",
    featured: true,
    images: shots("siena"),
    ...spin("siena"),
  },
  {
    slug: "rosa",
    sku: "ISV-003",
    name: "Rosa",
    subName: "Wide-Weave Market Tote — Antique Rose",
    category: "totes-carryalls",
    price: 420,
    currency: "USD",
    materials:
      "Hand-dyed, hand-burnished vegetable-tanned leather; contrast handles",
    dimensions: "42 W × 28 H × 16 D cm (16.5″ × 11″ × 6.3″)",
    strap: "15 cm (6″) handle drop — hand or forearm carry",
    weave: "Oversized checkerboard weave, 5 cm straps",
    fits: "A4 documents, small laptop, market haul",
    craftsmanship:
      "Woven from extra-wide leather straps and hand-burnished so every panel carries its own cloud-like shading. Contrasting chocolate handles are anchored with exposed hand-stitching — a nod to traditional saddlery.",
    description:
      "Bold and sculptural in a faded antique rose. The statement piece: one colour, maximum presence.",
    photographedIn: "Antique Rose",
    tone: "sand",
    note: "Each bag is dyed individually — tonal variation is part of the design",
    label: "Rosa",
    images: shots("rosa"),
    ...spin("rosa"),
  },
  {
    slug: "lucca",
    sku: "ISV-004",
    name: "Lucca",
    subName: "Zigzag Basket Tote — Toffee",
    category: "totes-carryalls",
    price: 395,
    currency: "USD",
    materials: "Full-grain vegetable-tanned leather, unlined",
    dimensions: "44 W × 27 H × 15 D cm (17.3″ × 10.6″ × 5.9″)",
    strap: "20 cm (8″) handle drop — hand or shoulder carry",
    weave: "Tight zigzag herringbone, hand-loomed",
    fits: "Beach towel, A4, tablet, everything for a day out",
    weight: "approx. 650 g",
    craftsmanship:
      "Woven in a herringbone zigzag so fine it reads as fabric from a distance. Braided round handles, a whip-stitched rim and a wide, stable base make it as practical as it is beautiful.",
    description:
      "Our homage to the classic mercato basket, reimagined entirely in leather. The forever summer bag that refuses to stay seasonal.",
    photographedIn: "Toffee",
    tone: "cognac",
    note: "Whip-stitched rim · braided handles",
    label: "Lucca",
    images: shots("lucca"),
    ...spin("lucca"),
  },
  {
    slug: "oliva",
    sku: "ISV-005",
    name: "Oliva",
    subName: "Grand Basket Tote — Forest Green",
    category: "totes-carryalls",
    price: 450,
    currency: "USD",
    materials: "Triple-dipped vegetable-tanned leather, unlined",
    dimensions: "46 W × 30 H × 16 D cm (18.1″ × 11.8″ × 6.3″)",
    strap: "20 cm (8″) handle drop — hand or shoulder carry",
    weave: "Tight zigzag herringbone, hand-loomed",
    fits: "13″ laptop, A4 files, full day's carry",
    craftsmanship:
      "The saturated botanical hue is achieved through triple-dipped hand dyeing, giving the surface a lacquered depth that turns almost emerald in sunlight.",
    description:
      "The Lucca's grander, moodier sister — scaled up for real life: weekends, work, the market run.",
    photographedIn: "Forest Green",
    tone: "olive",
    note: "Our largest silhouette · rich patina develops with wear",
    label: "Oliva",
    featured: true,
    images: shots("oliva"),
    ...spin("oliva"),
  },
  {
    slug: "capri",
    sku: "ISV-006",
    name: "Capri",
    subName: "Shoulder Basket Tote — Caramel",
    category: "totes-carryalls",
    price: 330,
    currency: "USD",
    materials: "Full-grain vegetable-tanned leather, unlined",
    dimensions: "34 W × 24 H × 12 D cm (13.4″ × 9.4″ × 4.7″)",
    strap: "30 cm (11.8″) drop — comfortable shoulder carry",
    weave: "Tight zigzag herringbone; braided round straps",
    fits: "iPad, long wallet, paperback, small pouch",
    craftsmanship:
      "Long, fully braided straps tuck cleanly over the shoulder. The dense zigzag weave holds its shape without stiffness, and the compact footprint keeps it elegant on a crowded train or a café chair.",
    description:
      "The refined commuter — a neat East–West basket in golden caramel. Hands free, lines clean.",
    photographedIn: "Caramel",
    tone: "cognac",
    note: "Braided straps soften and settle to the shoulder within days",
    label: "Capri",
    images: shots("capri"),
    ...spin("capri"),
  },

  // ── Shoulder & Hobo ───────────────────────────────────────────────
  {
    slug: "sofia",
    sku: "ISV-007",
    name: "Sofia",
    subName: "Slouch Hobo — Tan",
    category: "shoulder-hobo",
    price: 310,
    currency: "USD",
    materials: "Full-grain vegetable-tanned leather, unlined",
    dimensions: "34 W × 26 H × 12 D cm (13.4″ × 10.2″ × 4.7″)",
    strap: "26 cm (10.2″) drop — shoulder carry",
    weave: "Wide intrecciato with braided strap",
    fits: "Long wallet, phone, sunglasses, small pouch",
    craftsmanship:
      "A wide intrecciato body gathers into a single braided strap, creating a deep-slouch profile under the arm. The tonal contrast within the weave — light straps over shadowed gaps — gives the surface a quiet zigzag rhythm at the edges.",
    description:
      "Relaxed and unhurried, the Sofia drapes rather than sits. The bag you reach for without thinking.",
    photographedIn: "Tan",
    tone: "cognac",
    note: "Designed to slouch — the drape is the design",
    label: "Sofia",
    featured: true,
    images: shots("sofia"),
    ...spin("sofia"),
  },
  {
    slug: "luna",
    sku: "ISV-008",
    name: "Luna",
    subName: "Crescent Shoulder Bag — Mahogany",
    category: "shoulder-hobo",
    price: 185,
    currency: "USD",
    materials: "Full-grain vegetable-tanned leather, unlined",
    dimensions: "24 W × 19 H × 6 D cm (9.4″ × 7.5″ × 2.4″)",
    strap: "28 cm (11″) drop — shoulder carry",
    weave: "Fine zigzag herringbone; knotted braided strap",
    fits: "Phone, cardholder, keys, lipstick",
    weight: "approx. 320 g",
    craftsmanship:
      "Woven in a whisper-fine zigzag, with a slender braided strap knotted at each end — a detail borrowed from fishermen's rope work.",
    description:
      "Named for its moon-curve silhouette. Small in footprint, exact in proportion; it holds the essentials and nothing that isn't.",
    photographedIn: "Mahogany",
    tone: "umber",
    note: "Signature knot detail at strap base",
    label: "Luna",
    images: shots("luna"),
    ...spin("luna"),
  },
  {
    slug: "stella",
    sku: "ISV-009",
    name: "Stella",
    subName: "Flap Shoulder Bag — Metallic Silver",
    category: "shoulder-hobo",
    price: 295,
    currency: "USD",
    materials: "Metallic-finished lambskin-soft leather",
    dimensions: "30 W × 17 H × 10 D cm (11.8″ × 6.7″ × 3.9″)",
    strap: "24 cm (9.4″) drop — shoulder carry",
    weave: "Micro-weave metallic intrecciato; front flap closure",
    fits: "Phone, compact wallet, keys, lipstick",
    craftsmanship:
      "A trapeze-line flap bag woven from metallic leather so fine it shimmers like chainmail. The tall triangular strap doubles as a sculptural element when the bag is set down.",
    description:
      "The evening star. Structured enough for dinner, luminous enough for midnight — and unexpectedly striking with denim at noon.",
    photographedIn: "Metallic Silver",
    tone: "ink",
    note: "Flap keeps contents secure · the collection's occasion piece",
    label: "Stella",
    images: shots("stella"),
    ...spin("stella"),
  },

  // ── Crossbody & Belt ──────────────────────────────────────────────
  {
    slug: "piccola",
    sku: "ISV-010",
    name: "Piccola",
    subName: "Mini Basket Crossbody — Nero",
    category: "crossbody-belt",
    price: 175,
    currency: "USD",
    materials: "Full-grain vegetable-tanned leather, unlined",
    dimensions: "18 W × 13 H × 8 D cm (7.1″ × 5.1″ × 3.1″)",
    strap: "Handles 6 cm; crossbody strap 55 cm (21.6″)",
    weave: "Dense zigzag; smooth leather handle mounts",
    fits: "Phone, cardholder, keys",
    craftsmanship:
      "A miniature basket complete with twin top handles, smooth leather trim and a long braided crossbody strap, woven in a dense zigzag that reads almost as texture rather than pattern.",
    description:
      "“Piccola” — the little one. Deceptively roomy for its size, and the easiest black bag you'll ever own.",
    photographedIn: "Nero",
    tone: "ink",
    note: "Wear crossbody, on the shoulder, or carried by hand",
    label: "Piccola",
    images: shots("piccola"),
    ...spin("piccola"),
  },
  {
    slug: "vita",
    sku: "ISV-011",
    name: "Vita",
    subName: "Woven Belt Bag — Cognac",
    category: "crossbody-belt",
    price: 265,
    currency: "USD",
    materials: "Full-grain vegetable-tanned leather, unlined",
    dimensions: "26 W × 15 H × 8 D cm (10.2″ × 5.9″ × 3.1″)",
    strap: "Adjustable, fits up to 110 cm (43″) — waist or crossbody",
    weave: "Diagonal intrecciato; antique-brass hardware",
    fits: "Phone, cardholder, keys, passport",
    craftsmanship:
      "A half-moon sling in burnished cognac with an antique-brass zip and a woven strap. The intrecciato surface takes on knocks and scuffs as character, not damage.",
    description:
      "In Italian, vita means both “waist” and “life” — fitting for a bag built to move through yours.",
    photographedIn: "Cognac",
    tone: "cognac",
    note: "Zip closure — the collection's most secure everyday piece",
    label: "Vita",
    featured: true,
    images: shots("vita"),
    ...spin("vita"),
  },

  // ── Clutches & Minis ──────────────────────────────────────────────
  {
    slug: "sera",
    sku: "ISV-012",
    name: "Sera",
    subName: "Wristlet Clutch — Dark Chocolate",
    category: "clutches-minis",
    price: 195,
    currency: "USD",
    materials: "Full-grain vegetable-tanned leather; zip top",
    dimensions: "26 W × 17 H × 2 D cm (10.2″ × 6.7″ × 0.8″)",
    strap: "18 cm (7″) braided wrist loop, clip-detachable",
    weave: "Dense zigzag; whip-stitched scalloped edge",
    fits: "Phone, cards, cash, keys, lipstick",
    craftsmanship:
      "Hand-woven edge to edge with a scalloped whip-stitched border and a braided wrist loop that slips over the hand like a bracelet.",
    description:
      "Named for the Italian evening. Carries phone, cards and keys on its own — or organises the inside of any larger Isvena tote.",
    photographedIn: "Dark Chocolate",
    tone: "umber",
    note: "Doubles as a pouch-organiser inside larger totes",
    label: "Sera",
    images: shots("sera"),
    ...spin("sera"),
  },
  {
    slug: "gioia",
    sku: "ISV-013",
    name: "Gioia",
    subName: "Drawstring Bucket — Chestnut",
    category: "clutches-minis",
    price: 245,
    currency: "USD",
    materials: "Full-grain vegetable-tanned leather, unlined",
    dimensions: "18 dia × 24 H cm (7.1″ dia × 9.4″)",
    strap: "8 cm (3.1″) top handle",
    weave: "Fine herringbone; braided drawstring with tassel",
    fits: "Phone, small wallet, keys, perfume atomiser",
    weight: "approx. 380 g",
    craftsmanship:
      "Cinched by a braided drawstring that ends in a hand-cut tassel, with a braided top handle for carrying like a lantern. The tightest weave in the collection.",
    description:
      "Pure joy in miniature — gioia means exactly that. Playful in shape, serious in craft.",
    photographedIn: "Chestnut",
    tone: "cognac",
    note: "Drawstring closure · hand-cut tassel",
    label: "Gioia",
    featured: true,
    images: shots("gioia"),
    ...spin("gioia"),
  },

  // ── Small Leather Goods ───────────────────────────────────────────
  {
    slug: "treccia",
    sku: "ISV-014",
    name: "Treccia",
    subName: "Hand-Braided Belt — Dark Brown",
    category: "small-leather-goods",
    price: 185,
    currency: "USD",
    materials:
      "Full-grain vegetable-tanned leather; smooth leather tip & keeper; solid antique-brass roller buckle, saddle-stitched",
    dimensions: "3.2 cm (1.25″) wide — fits standard belt loops",
    strap:
      "Sizes 85 / 90 / 95 / 100 / 105 / 110 cm — fits approx. 71–96 cm (28–38″) waist",
    strapLabel: "Sizes",
    weave: "Nine-strand flat hand braid; infinitely adjustable",
    fits: "Standard belt loops",
    craftsmanship:
      "Nine strands plaited by hand into a supple flat band. Because the prong passes between the strands rather than through punched holes, it adjusts at any point along its length — no eyelets, no wrong notch, no worn-out hole after a season.",
    description:
      "Its name means simply “the braid.” The softest belt in the collection, and the one that ages best.",
    photographedIn: "Dark Brown",
    tone: "umber",
    note:
      "No punched holes — the braid is the adjustment · softens noticeably within a week of wear",
    label: "Treccia",
    images: shots("treccia"),
    ...spin("treccia"),
  },
  {
    slug: "milano",
    sku: "ISV-015",
    name: "Milano",
    subName: "Woven Bifold Wallet — Oxblood",
    category: "small-leather-goods",
    price: 165,
    currency: "USD",
    materials:
      "Full-grain calfskin exterior; smooth nappa lining; burnished edges",
    dimensions:
      "Closed 11.5 W × 9.5 H × 2 D cm (4.5″ × 3.7″ × 0.8″) · open 23 W × 9.5 H cm (9″ × 3.7″)",
    strap:
      "8 card slots · 2 full-length note compartments · 2 hidden slip pockets",
    strapLabel: "Interior",
    weave: "Fine diagonal intrecciato, hand-interlaced exterior",
    fits: "Notes flat and uncreased, incl. euro, sterling & dollar",
    weight: "approx. 85 g",
    craftsmanship:
      "The exterior is hand-woven in a fine diagonal intrecciato and edged in smooth burnished leather; inside, everything switches to plain nappa so cards slide rather than catch.",
    description:
      "The house weave, reduced to its most disciplined scale. Enough for a full wallet, slim enough for a jacket pocket — our most-gifted piece.",
    photographedIn: "Oxblood",
    tone: "umber",
    note: "Hand-burnished edges · pairs with the Treccia belt as a gift set",
    label: "Milano",
    images: shots("milano"),
    ...spin("milano"),
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
