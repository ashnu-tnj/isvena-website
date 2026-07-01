# Isvena

A luxury D2C website for Isvena, a hand-braided leather goods house carrying
forward the workshop of P.M. Rahamathulla & Co (est. 2016, Ambur, Tamil Nadu).

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
- `src/data` — product and category content (`products.ts`, `categories.ts`)
- `src/components` — header, footer, product card, cart drawer, and the
  `PlaceholderArt` component used for stand-in product photography
- `src/lib/cart-context.tsx` — client-side shopping bag (persisted to
  `localStorage`); "Request Checkout" hands off to the contact page rather
  than a live payment flow, since no payment backend is wired up yet

## Imagery

Real product photography isn't available yet, so `PlaceholderArt` renders
art-directed panels (brand palette + a woven motif referencing the
hand-braiding technique) in its place. Swap these out for real photography
per product/category before launch.
