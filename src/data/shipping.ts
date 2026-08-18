/**
 * Where Isvena ships, and what it charges to get there.
 *
 * Shipping is complimentary worldwide, so this list is not about rates — it
 * is the set of countries the address form offers and the order API accepts.
 * Both read it from here so a country can never be selectable but rejected.
 */
export interface ShippingCountry {
  /** ISO 3166-1 alpha-2. */
  code: string;
  name: string;
}

export const shippingCountries: ShippingCountry[] = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "IE", name: "Ireland" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "PT", name: "Portugal" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "AT", name: "Austria" },
  { code: "CH", name: "Switzerland" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "QA", name: "Qatar" },
  { code: "KW", name: "Kuwait" },
  { code: "BH", name: "Bahrain" },
  { code: "OM", name: "Oman" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "HK", name: "Hong Kong" },
  { code: "IN", name: "India" },
  { code: "LK", name: "Sri Lanka" },
  { code: "ZA", name: "South Africa" },
];

export function isShippingCountry(code: string): boolean {
  return shippingCountries.some((c) => c.code === code.toUpperCase());
}
