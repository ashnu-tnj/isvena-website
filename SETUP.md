# Going live: Stripe

Payments run on **Stripe Checkout**. There is no shipping integration —
delivery is complimentary worldwide and arranged manually from the Stripe
dashboard, which holds every detail the workshop needs.

Two environment variables and you are live.

**Do not paste your secret key into a chat, a commit, or a ticket.** It goes
in the Vercel dashboard and nowhere else. `.env*` is gitignored.

---

## What happens on an order

1. Customer hits **Checkout** in the cart drawer.
2. `POST /api/checkout` builds a Stripe Checkout Session. Prices are read
   from `src/data/products.ts` **server-side** — the browser cannot set a
   price — and the customer goes to Stripe's hosted payment page.
3. Stripe collects card details, **full shipping address, email and phone
   number**. No shipping cost is added or shown.
4. On success the customer returns to `/checkout/success` and the cart
   clears.
5. You despatch the order using the details on the Stripe payment.

Until `STRIPE_SECRET_KEY` is set, the Checkout button returns a 503 and the
cart tells the customer to order via the contact page. The site is safe to
leave in that state.

---

## 1. Get your Stripe key

Dashboard → **Developers → API keys**.

Leave the **Test mode** toggle **on** for now. Copy the **Secret key**
(`sk_test_…`).

The publishable key is not needed — this site uses Stripe's hosted Checkout,
so no Stripe code runs in the browser.

## 2. Turn on order notifications

This matters, because nothing else tells you a sale happened.

Dashboard → **Settings → Personal → Notifications** → enable emails for
**successful payments**. Without it you are relying on remembering to check
the dashboard.

## 3. Put the values in Vercel

Project **isvena-website** (team *aflatus*) → **Settings → Environment
Variables**:

<https://vercel.com/aflatus/isvena-website/settings/environment-variables>

| Variable | Value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_…`, later `sk_live_…` |
| `NEXT_PUBLIC_SITE_URL` | The origin that actually serves the site |

Two traps:

- **`NEXT_PUBLIC_SITE_URL` must be the live domain.** It builds Stripe's
  return URL. If it says `https://www.isvena.com` while the site really runs
  on `isvena-website.vercel.app`, customers land on a dead domain *after
  paying*.
- **Environment variables only apply to new deployments.** Save, then
  redeploy — the running deployment does not pick them up.

## 4. A caveat before real money

The site charges in **USD** and the business is registered in India. Stripe
India accounts have specific rules about accepting international payments
and about export documentation. Confirm with Stripe support that your
account can settle USD export transactions **before** taking a real order.
That is an account-configuration question, not a code one.

---

## Testing

### Locally

Create `.env.local` in the project root (gitignored, never committed):

```bash
STRIPE_SECRET_KEY=sk_test_…
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Run `npm run dev`, add a bag, check out, pay with Stripe's test card
`4242 4242 4242 4242`, any future expiry, any CVC.

Confirm:

1. Checkout shows **no shipping charge**, and asks for address and phone.
2. You land on `/checkout/success` and the cart is empty.
3. The payment appears in the Stripe dashboard in test mode, with the
   shipping address and phone attached.

### Going live

1. Flip the dashboard to live mode, copy `sk_live_…`.
2. Update `STRIPE_SECRET_KEY` in Vercel, redeploy.
3. Place one real low-value order, check the details come through, refund it.

---

## Fulfilling an order

Everything you need is on the payment in the Stripe dashboard: customer
name, email, phone, shipping address, and the item and colour of each line.
Book the courier yourself and email the tracking number — the site promises
tracking on despatch (see the FAQ and the success page).

---

## Known gaps

**No order record of your own.** Orders live in Stripe only. Fine at current
volume; if it grows, the thing to add is a webhook on
`checkout.session.completed` writing to a database.

**Taxes.** No GST/VAT is calculated. The FAQ states that import duties are
the recipient's responsibility. Stripe Tax can automate this if you ever
need it.

**Free shipping is now a promise in three places** — the header announcement
bar, the cart drawer, and the product structured data (`shippingRate: 0`).
If that ever changes, all three need updating together, plus the FAQ.
