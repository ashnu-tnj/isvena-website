/**
 * The house colour range.
 *
 * Every piece is cut and woven to order, so any silhouette can be made in
 * any of these — the colour a piece was photographed in is simply the one
 * the studio shot, not the only one available.
 *
 * The swatches are sampled from the actual packshots rather than guessed,
 * so the dot on the site matches the leather in the photograph.
 */
export interface HouseColour {
  name: string;
  /** Swatch, taken from the piece photographed in this colour. */
  hex: string;
  /** The product shot in it — the reference for what the leather looks like. */
  shownOn: string;
}

export const houseColours: HouseColour[] = [
  { name: "Tan", hex: "#B57B4F", shownOn: "sofia" },
  { name: "Cognac", hex: "#9D6039", shownOn: "siena" },
  { name: "Caramel", hex: "#C37234", shownOn: "capri" },
  { name: "Toffee", hex: "#C69260", shownOn: "lucca" },
  { name: "Chestnut", hex: "#782D19", shownOn: "gioia" },
  { name: "Mahogany", hex: "#4A241C", shownOn: "luna" },
  { name: "Oxblood", hex: "#59302B", shownOn: "milano" },
  { name: "Dark Brown", hex: "#463024", shownOn: "treccia" },
  { name: "Dark Chocolate", hex: "#342521", shownOn: "sera" },
  { name: "Espresso", hex: "#4A3830", shownOn: "verona" },
  { name: "Nero", hex: "#201C19", shownOn: "piccola" },
  { name: "Forest Green", hex: "#265338", shownOn: "oliva" },
  { name: "Antique Rose", hex: "#D57171", shownOn: "rosa" },
  { name: "Metallic Silver", hex: "#BEB7B2", shownOn: "stella" },
];

export const colourNames = houseColours.map((c) => c.name);

export function colourHex(name: string): string {
  return houseColours.find((c) => c.name === name)?.hex ?? "#A25A34";
}

/** True when the name is one the workshop actually makes. */
export function isHouseColour(name: string): boolean {
  return houseColours.some((c) => c.name === name);
}

/**
 * The range, led by the colour this piece was photographed in — so a card
 * or a swatch row opens on the leather actually shown in its images.
 */
export function coloursFor(photographedIn: string): HouseColour[] {
  const shot = houseColours.find((c) => c.name === photographedIn);
  if (!shot) return houseColours;
  return [shot, ...houseColours.filter((c) => c !== shot)];
}
