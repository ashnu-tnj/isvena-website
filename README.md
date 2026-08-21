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
- `src/app/api/create-order` — prices the bag and opens a Cashfree order
  (prices are always read from the server-side catalog, never trusted from
  the client); `src/app/api/webhooks/cashfree` and the success page both
  independently confirm a payment against Cashfree's API — see
  `src/lib/order-confirmation.ts` — before an order counts as paid or gets
  emailed
- `src/app/checkout` — the delivery-details form that precedes payment
- `src/lib/currency.ts` + `src/app/api/geo` — approximate local-currency
  display by visitor country, off unless `NEXT_PUBLIC_LOCAL_PRICING=on`

## Payments & Shipping

Checkout is powered by **Cashfree Standard (Drop-in) Checkout** — cards,
UPI, net banking and wallets, in a modal served by Cashfree, so card details
never reach this site.

Cashfree's window collects payment and nothing else, so `/checkout` gathers
the delivery address, phone and engraving name first and carries them on the
order's `order_tags`. There is no database: those tags and the Cashfree
dashboard are the order record. Confirmation runs two ways — a webhook that
fires regardless of the customer's browser, and a check the success page
runs itself — both idempotent, both feeding the same order-confirmation
email. Shipping is complimentary worldwide, so no carrier integration is
involved and orders are despatched by hand from those details.

Set `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_ENV` and
`NEXT_PUBLIC_SITE_URL` (copy `.env.example` to `.env.local` for local work).
Until the keys are set, the order API returns 503 and checkout falls back to
the contact/concierge flow.

The catalogue is priced in USD but Cashfree bills a single currency — INR
unless International Payments is activated on the account — so
`CASHFREE_INR_PER_USD` sets the rate the house sells at.

See [SETUP.md](./SETUP.md) for the full go-live walkthrough.

## Deployment

Self-hosted on a VPS: a Node process behind nginx, managed by systemd. See
[SETUP.md](./SETUP.md) for the build, service, nginx and TLS setup, and for
how to deploy an update.

## Imagery

Products are shot for real; `PlaceholderArt` remains as the fallback for any
product added without a photograph, rendering an art-directed panel (brand
palette plus a woven motif referencing the hand-braiding technique) so a new
entry never lands with a broken image.

Product photography and the catalogue itself are edited through a Google
Sheet — see [CATALOGUE.md](./CATALOGUE.md).
