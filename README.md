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
- `src/app/api/webhooks/stripe` — Stripe webhook; on
  `checkout.session.completed` it creates the shipment order in Shiprocket
- `src/lib/shiprocket.ts` — minimal Shiprocket API client (auth + create
  order); a logged no-op until credentials are configured

## Payments & Shipping

Checkout is powered by **Stripe Checkout** and fulfilment by **Shiprocket**.
Copy `.env.example` to `.env.local` and fill in:

1. **Stripe** — `STRIPE_SECRET_KEY` from Dashboard → Developers → API keys.
   Then add a webhook endpoint pointing at `/api/webhooks/stripe` subscribed
   to `checkout.session.completed`, and paste its signing secret into
   `STRIPE_WEBHOOK_SECRET`. Until the key is set, the Checkout button
   politely falls back to the contact/concierge flow.
2. **Shiprocket** — create an API user (Settings → API → Configure) and set
   `SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD`, and
   `SHIPROCKET_PICKUP_LOCATION`. Orders are created as **Prepaid** (Stripe
   captures payment first) with default parcel dimensions; adjust per
   shipment in the Shiprocket panel. Note: item prices are forwarded in the
   store currency (USD) — set your Shiprocket account/channel up for
   international orders (Shiprocket X) or convert as needed.

## Imagery

Real product photography isn't available yet, so `PlaceholderArt` renders
art-directed panels (brand palette + a woven motif referencing the
hand-braiding technique) in its place. Swap these out for real photography
per product/category before launch.
