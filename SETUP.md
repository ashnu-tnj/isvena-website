# Going live: Stripe + Shiprocket

The code for both integrations is already written and deployed. Nothing
works yet because no credentials are set — every key below is missing, and
the site is built to degrade quietly rather than crash:

- **No Stripe key** → the Checkout button returns a 503 and the cart shows
  "Online payment is not configured yet… use the contact page."
- **No Shiprocket credentials** → paid orders still succeed, the shipment
  creation is skipped and logged.

So the site is safe to leave as-is. This document is what to do when you
want real money to move.

**Do not paste any of these keys into a chat, a commit, or a ticket.** They
go in the Vercel dashboard and nowhere else. `.env*` is gitignored.

---

## What happens on an order

1. Customer hits **Checkout** in the cart drawer.
2. `POST /api/checkout` builds a Stripe Checkout Session. Prices are read
   from `src/data/products.ts` **server-side** — the browser can't set a
   price — and the customer is redirected to Stripe's hosted page.
3. Customer pays. Stripe redirects to `/checkout/success`, which clears the
   cart.
4. Stripe calls `POST /api/webhooks/stripe` with `checkout.session.completed`.
   The signature is verified, then the shipping address and paid line items
   are pushed to Shiprocket as a **Prepaid** order.

Step 4 is the one that needs the webhook secret. Without it the customer is
still charged correctly — you just have to create the shipment by hand.

---

## 1. Stripe

### 1a. API key

Dashboard → **Developers → API keys**.

Keep the **Test mode** toggle **on** for now. Copy the **Secret key**
(`sk_test_…`). This is `STRIPE_SECRET_KEY`.

> The publishable key is not needed — this site uses Stripe's hosted
> Checkout page, so no Stripe code runs in the browser.

### 1b. Webhook endpoint

Dashboard → **Developers → Webhooks → Add endpoint**.

- **Endpoint URL**: `https://<your-domain>/api/webhooks/stripe`
- **Events to send**: `checkout.session.completed` — just that one.

Save, then **Reveal** the signing secret (`whsec_…`). This is
`STRIPE_WEBHOOK_SECRET`.

> **Test mode and live mode are separate endpoints with separate signing
> secrets.** When you flip to live you must add the endpoint again in live
> mode and swap in the new `whsec_…`, or every live order will fail
> signature verification.

### 1c. A caveat worth checking before you flip to live

The site charges in **USD** and the business is registered in India. Stripe
India accounts have specific rules about accepting international payments
and about export documentation. Confirm with Stripe support that your
account is enabled to settle USD export transactions **before** you take a
real order — this is an account-configuration question, not a code one.

---

## 2. Shiprocket

### 2a. API user

Shiprocket panel → **Settings → API → Configure → Create an API User**.

This creates a **separate** login used only by the API. It is *not* your
main panel login, and the main login will not work here.

- `SHIPROCKET_EMAIL` — the API user's email
- `SHIPROCKET_PASSWORD` — the API user's password

### 2b. Pickup location

**Settings → Company → Pickup Addresses.** Each address has a *nickname*.

Copy that nickname **exactly** — including case — into
`SHIPROCKET_PICKUP_LOCATION`. If it doesn't match a real pickup address,
order creation fails with a validation error. The default in the code is
`Primary`.

### 2c. Declared value

Customers pay in USD; Shiprocket wants INR, and that number lands on the
courier manifest and customs paperwork. `src/lib/shiprocket.ts` converts
using `SHIPROCKET_INR_PER_USD` (default `88`).

Set it to a rate you're comfortable declaring and revisit it when the rupee
moves. It changes the declared value only — **never** what the customer is
charged.

---

## 3. Where the values go

Vercel → project **isvena-website** (team *aflatus*) →
**Settings → Environment Variables**:

<https://vercel.com/aflatus/isvena-website/settings/environment-variables>

| Variable | Value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_…` (later `sk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` from the endpoint you created |
| `NEXT_PUBLIC_SITE_URL` | The origin that actually serves the site |
| `SHIPROCKET_EMAIL` | API user email |
| `SHIPROCKET_PASSWORD` | API user password |
| `SHIPROCKET_PICKUP_LOCATION` | Pickup address nickname |
| `SHIPROCKET_INR_PER_USD` | e.g. `88` |

Two things people get wrong here:

- **`NEXT_PUBLIC_SITE_URL` must be the domain that is actually live.** It
  builds Stripe's success and cancel URLs. If it says `https://www.isvena.com`
  but the site is really on `isvena-website.vercel.app`, customers get
  dumped on a dead domain *after paying*.
- **Environment variables only apply to new deployments.** After saving,
  redeploy — otherwise the running deployment still has none of them.

---

## 4. Testing before real money

### Locally

Create `.env.local` in the project root (gitignored, never committed):

```bash
STRIPE_SECRET_KEY=sk_test_…
STRIPE_WEBHOOK_SECRET=whsec_…   # from `stripe listen`, see below
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SHIPROCKET_EMAIL=…
SHIPROCKET_PASSWORD=…
SHIPROCKET_PICKUP_LOCATION=Primary
SHIPROCKET_INR_PER_USD=88
```

Stripe can't reach `localhost`, so forward events with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

It prints a `whsec_…` — that is the one to use in `.env.local`, not the
dashboard's.

### A test order

Run `npm run dev`, add a bag, check out, and pay with Stripe's test card
`4242 4242 4242 4242`, any future expiry, any CVC.

Then confirm all four:

1. You land on `/checkout/success` and the cart is empty.
2. The payment appears in the Stripe dashboard (test mode).
3. The terminal logs `[shiprocket] order created for …`.
4. The order is visible in the Shiprocket panel, with a **sensible rupee
   value** and a SKU like `signature-hand-braided-tote-tan`.

If #3 says `not configured`, the Shiprocket credentials aren't loading.

### Going live

1. Flip the Stripe dashboard to live mode, get `sk_live_…`.
2. **Create the webhook endpoint again in live mode** and take its new
   `whsec_…`.
3. Update both in Vercel, redeploy.
4. Place one real low-value order and refund it.

---

## 5. Known gaps — decide before launch

**Shipping is not charged.** Checkout collects a shipping address but
defines no `shipping_options`, so every order ships free worldwide — while
the cart says "shipping and taxes are calculated at checkout." Either add
rates in `src/app/api/checkout/route.ts` or change the copy. I didn't
invent rates because international courier pricing from Chennai is your
call, not a guess I should make.

**Webhook retries could duplicate a shipment.** Stripe retries on any
non-2xx. If Shiprocket accepts an order but the response handling then
fails, the retry creates a second shipment for the same payment. Low
frequency, real when it happens. Fixing it properly needs somewhere to
record fulfilled session IDs.

**No order record of your own.** Orders exist in Stripe and Shiprocket, not
in this app. Fine at current volume; worth revisiting later.

**Taxes.** No GST/VAT handling. Stripe Tax can do this if you need it.
