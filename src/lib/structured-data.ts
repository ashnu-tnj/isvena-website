import { site, absoluteUrl, ogImage } from "@/lib/site";
import type { Product } from "@/data/products";
import type { Category } from "@/data/categories";

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

/** Postal address block reused by Organization and LocalBusiness. */
function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  };
}

/** The brand as an entity — the anchor for SEO/GEO knowledge-graph linking. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    email: site.email,
    foundingDate: site.foundingYear,
    slogan: site.tagline,
    description: site.description,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon.svg"),
    },
    image: absoluteUrl(ogImage.url),
    address: postalAddress(),
    areaServed: "Worldwide",
    knowsAbout: [
      "hand-braided leather",
      "vegetable-tanned leather",
      "chrome-free leather goods",
      "leatherworking",
    ],
    sameAs: site.sameAs,
  };
}

/** The site itself, enabling sitelinks search box eligibility. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Physical workshop — helps local + map/answer-engine results. */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#localbusiness`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    email: site.email,
    image: absoluteUrl(ogImage.url),
    priceRange: "$$–$$$",
    address: postalAddress(),
    parentOrganization: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productSchema(product: Product, category?: Category) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${absoluteUrl(`/product/${product.slug}`)}#product`,
    name: product.name,
    description: product.description,
    image: (product.images && product.images.length > 0
      ? product.images
      : [ogImage.url]
    ).map((src) => absoluteUrl(src)),
    sku: product.slug,
    category: category?.name,
    material: product.materials,
    color: product.colors,
    brand: { "@type": "Brand", name: site.name },
    manufacturer: { "@id": ORG_ID },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: product.currency,
      price: product.price,
      availability: "https://schema.org/MadeToOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ORG_ID },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          name: "Worldwide",
        },
        // Shipping is complimentary on every order, everywhere.
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: product.currency,
        },
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Tanning",
        value: "Vegetable-tanned, chrome-free",
      },
      {
        "@type": "PropertyValue",
        name: "Production",
        value: "Made to order, hand-braided in Chennai; ships in 6–8 weeks",
      },
      {
        "@type": "PropertyValue",
        name: "Personalisation",
        value: "Free custom name engraving, up to 20 characters",
      },
      product.dimensions && {
        "@type": "PropertyValue",
        name: "Dimensions",
        value: product.dimensions,
      },
      product.weight && {
        "@type": "PropertyValue",
        name: "Weight",
        value: product.weight,
      },
    ].filter(Boolean),
  };
}

/** Category listing as an ItemList for richer collection results. */
export function collectionSchema(category: Category, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(`/shop/${category.slug}`)}#collection`,
    name: category.name,
    description: category.description,
    url: absoluteUrl(`/shop/${category.slug}`),
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/product/${p.slug}`),
        name: p.name,
      })),
    },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
