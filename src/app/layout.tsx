import type { Metadata } from "next";
import { Cormorant, Jost } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import CartDrawer from "@/components/cart-drawer";
import JsonLd from "@/components/json-ld";
import { CartProvider } from "@/lib/cart-context";
import { site, SITE_URL } from "@/lib/site";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";

// Display / brand serif chosen to echo the Isvena wordmark — a delicate,
// high-contrast fashion serif.
const displaySerif = Cormorant({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

const bodySans = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Isvena — Hand-Braided, Vegetable-Tanned Leather Goods Since 1936",
    template: "%s — Isvena",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [...site.keywords],
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.name,
  category: "shopping",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title:
      "Isvena — Hand-Braided, Vegetable-Tanned Leather Goods Since 1936",
    description: site.description,
    url: SITE_URL,
    locale: site.locale,
    // og:image is supplied automatically by app/opengraph-image.tsx for
    // every route, so it is not repeated here.
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Isvena — Hand-Braided, Vegetable-Tanned Leather Goods Since 1936",
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displaySerif.variable} ${bodySans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-ink">
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
