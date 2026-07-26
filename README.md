# Isvena

A luxury D2C website for Isvena, a hand-braided leather goods house carrying
forward the workshop of P.M. Rahamathulla & Co (est. 2016, Chennai, Tamil Nadu).

Built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `src/app` — routes: home, `/shop`, `/shop/[category]`, `/product/[slug]`,
  `/heritage`, `/contact`
- `src/data` — product and category content (`products.ts`, `categories.ts`),
  seeded from P.M. Rahamathulla & Co's public TradeIndia/IndiaMART range;
  prices are proposed D2C retail and dimensions default to made-to-order
  sizing — confirm both against the workshop's spec sheets before launch
- `src/components` — header, footer, product card, cart drawer, and the
  `PlaceholderArt` component used for stand-in product photography
- `src/lib/cart-context.tsx` — client-side shopping bag (persisted to
  `localStorage`)
- `src/app/api/checkout` — creates a Stripe Checkout Session (prices are
  always read from the server-side catalog, never trusted from the client)

## Payments & Shipping

Checkout is powered by **Stripe Checkout**. Shipping is complimentary
worldwide, so no carrier integration is involved: Stripe collects the
shipping address, email and phone, and orders are despatched manually from
the details on the payment.

Set `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_SITE_URL` (copy `.env.example` to
`.env.local` for local work). Until the key is set, the Checkout button
politely falls back to the contact/concierge flow.

See [SETUP.md](./SETUP.md) for the full go-live walkthrough.

## Imagery

Real product photography isn't available yet, so `PlaceholderArt` renders
art-directed panels (brand palette + a woven motif referencing the
hand-braiding technique) in its place. Swap these out for real photography
per product/category before launch.
