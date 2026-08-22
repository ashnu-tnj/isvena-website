# Deploying Isvena on a VPS

The site is a Next.js 16 application running as a long-lived Node process
behind nginx. Payments run on **Cashfree Standard (Drop-in) Checkout**;
there is no shipping integration, because delivery is complimentary
worldwide and arranged by hand from the details captured at checkout.

**Never put a real key in a file that git tracks.** Secrets live in
`.env.local` on the server, which is gitignored. `.env.example` is a
template listing variable *names* only.

---

## What happens on an order

1. Customer hits **Checkout** in the cart drawer and lands on `/checkout`.
2. They fill in **name, email, phone, delivery address** and, if they want
   it, the **engraving name**. Cashfree's payment window collects a payment
   method and nothing else, so this page is the only place those details are
   ever asked for.
3. `POST /api/create-order` prices the bag from `src/data/products.ts`
   **server-side** — the browser cannot set a price — and opens a Cashfree
   order carrying the address and engraving in its `order_tags`. The order's
   own id, generated here, is a human-readable reference like
   `ISV-260821-K4F7` — there is no separate gateway-issued id to reconcile
   against it.
4. Cashfree's checkout opens in a modal over the page. Card details go
   straight to Cashfree and never touch this server.
5. Two independent things confirm the payment and email the order to
   `info@isvena.com` — see below. Neither trusts anything the browser
   reports; both re-check the true state against Cashfree's API.
6. The customer lands on `/checkout/success`, which shows **paid**,
   **still confirming** (rare — a few seconds' race with the webhook), or
   **not completed** (a decline or a closed window; the cart is left intact
   so nothing is lost).
7. You despatch using the **tags on the order** in the Cashfree dashboard,
   or straight from the confirmation email.

Until `CASHFREE_APP_ID` and `CASHFREE_SECRET_KEY` are both set,
`/api/create-order` returns 503 and checkout tells the customer to order via
the contact page. The site is safe to leave in that state.

### The two confirmation paths

- **The webhook** (`POST /api/webhooks/cashfree`) — Cashfree calls this
  server-to-server the moment a payment settles, regardless of what the
  customer's browser does. This is the reliable path: it still fires if
  someone pays and closes the tab immediately.
- **The success page** — when the browser does come back, it checks
  Cashfree directly too, so the confirmation email usually goes out within
  the same second rather than waiting on the webhook.

Both call the same idempotent check, so a webhook retry or a page refresh
never sends the order email twice. See section 7 for the one thing the
webhook needs to actually work.

---

## 1. Server requirements

- **Node.js 20.9 or newer** (`next` declares `>=20.9.0`); 22 LTS is a good
  default. Check with `node -v`.
- nginx, or another reverse proxy terminating TLS.
- A process manager so the app survives reboots and crashes — the examples
  below use **systemd**, which is already on the box.

## 2. Get the code and build

```bash
git clone https://github.com/ashnu-tnj/isvena-website.git /docker/isvena
cd /docker/isvena
npm ci
```

Create `.env.local` **before building** (see the next section), then:

```bash
npm run build
npm start          # serves on port 3000
```

`npm ci` — not `npm install` — installs exactly what `package-lock.json`
pins, so the server builds what was tested.

## 3. Environment variables

Create `/docker/isvena/.env.local`:

```bash
# Cashfree keys — Dashboard → Developers → API Keys. Sandbox and production
# are two entirely separate credential pairs.
CASHFREE_APP_ID=…
CASHFREE_SECRET_KEY=…
CASHFREE_ENV=production

# What the customer is charged in, and the rate used to get there from the
# USD catalogue. See section 6.
CASHFREE_CURRENCY=INR
CASHFREE_INR_PER_USD=88

# The public origin. Every canonical URL, sitemap entry, Open Graph tag, and
# the URL Cashfree's webhook is registered against (section 7) — that one
# needs this to be an https:// origin.
NEXT_PUBLIC_SITE_URL=https://www.isvena.com

# Local-currency display (section 6).
NEXT_PUBLIC_LOCAL_PRICING=
```

Then `chmod 600 .env.local` so only the owner can read it.

> **This file never arrives with a deploy.** It is gitignored — that is the
> point of it — so `git pull` will not create it and will not update it. On a
> new server, or the first deploy after a variable is added or renamed, you
> have to write it by hand. Symptom if you forget: checkout says *"Online
> payment is not configured yet"* and `journalctl -u isvena` names the
> missing variable.

Two things that catch people:

- **`NEXT_PUBLIC_*` values are compiled into the JavaScript at build time.**
  Changing one means running `npm run build` again — restarting is not
  enough. Every Cashfree variable above is read at runtime, so those only
  need a restart.
- **A running Node process does not re-read `.env.local`.** Restart the
  service after any change.

### How it is actually deployed

`/docker/isvena` holds a `Dockerfile`, a `docker-compose.yml`, and this
repository in `app/`. The image is built on the box, and traefik terminates
TLS in front of it — so nginx and systemd (sections 4 and 5) describe a
deployment that is **not** the one in use. They are kept for reference.

Two consequences follow, and both have bitten already:

**The env file is `.env.production`, not `.env.local`.** Compose names it:

```yaml
env_file:
  - .env.production
```

That path is relative to the compose file, so it is
`/docker/isvena/.env.production` — *outside* `app/`. A `.env.local` in either
directory is read by nobody: compose does not reference it, and the build
context copies only `app/`. Runtime variables go in `.env.production` and
reach the container as real environment variables, which is what
`process.env.CASHFREE_SECRET_KEY` reads.

**`output: "standalone"` is required.** The Dockerfile's runner stage copies
`/app/.next/standalone`, which Next.js only writes when `next.config.ts` asks
for it — it is not a default. Remove it and the image build fails on the
COPY.

### Which changes need a rebuild

| Change | Command |
|---|---|
| A value in `.env.production` | `docker compose up -d --force-recreate isvena` |
| Code, or any `NEXT_PUBLIC_*` | `docker compose up -d --build isvena` |

Runtime variables are injected when the container starts, so a value change
needs no rebuild. `NEXT_PUBLIC_*` values are compiled into the JavaScript
during `npm run build`, which happens *inside the image build* — so those
must be passed as build `args` in `docker-compose.yml` and given an `ARG` in
the Dockerfile, as `NEXT_PUBLIC_SITE_URL` already is.

Cashfree needs no `NEXT_PUBLIC_*` value at all: `/api/create-order` returns
everything the browser needs (the payment session id, and which of
sandbox/production to initialise the SDK against) in its response, so
nothing gateway-related has to be baked into the JavaScript bundle.

### Checking what the container sees

```bash
docker exec isvena printenv | grep CASHFREE
docker logs --tail 50 isvena | grep -i cashfree
```

## 4. Run it as a service

`/etc/systemd/system/isvena.service`:

```ini
[Unit]
Description=Isvena website
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/docker/isvena
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now isvena
sudo systemctl status isvena
journalctl -u isvena -f      # live logs
```

That last command is where the app's own diagnostics appear — including the
`[cashfree] … not set` line naming the exact variable if checkout is
misconfigured, and the `[create-order]`, `[webhook:cashfree]` and
`[order-confirmation]` lines carrying Cashfree's own reason when it refuses
something.

## 5. nginx

```nginx
server {
    listen 443 ssl http2;
    server_name isvena.com www.isvena.com;

    # ssl_certificate … managed by certbot

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   Upgrade           $http_upgrade;
        proxy_set_header   Connection        "upgrade";
    }
}

server {
    listen 80;
    server_name isvena.com www.isvena.com;
    return 301 https://$host$request_uri;
}
```

Get certificates with `sudo certbot --nginx -d isvena.com -d www.isvena.com`.
Decide whether `isvena.com` redirects to `www` or the other way round, and
make `NEXT_PUBLIC_SITE_URL` match the one you keep — otherwise every
canonical URL points at a redirect, **and the webhook URL registered with
Cashfree (section 7) points at one too.**

## 6. Currency

**The catalogue is priced in USD. Cashfree bills in one currency.** Those
two facts have to be reconciled somewhere, and that somewhere is
`CASHFREE_CURRENCY` plus `CASHFREE_INR_PER_USD`.

An Indian Cashfree account settles in **INR** unless *International
Payments* has been activated on it — this is a request Cashfree reviews, not
a self-service toggle. So:

| Situation | Set | Effect |
|---|---|---|
| International Payments **off** (the default, and where this account is right now) | `CASHFREE_CURRENCY=INR` | A $365 bag is charged as ₹32,120 at the rate below. Foreign cards are converted by the customer's own bank. |
| International Payments **on** | `CASHFREE_CURRENCY=USD` | The catalogue price is billed as-is and `CASHFREE_INR_PER_USD` is ignored. |

`CASHFREE_INR_PER_USD` is **the rate you sell at**, not a display estimate:
it decides what the customer's card is actually debited. It is deliberately
a setting rather than a live FX call, so a third-party outage can never sit
between a customer and the pay button — which means **you own keeping it
current**. Review it when the rupee moves; the default of 88 was set in
2026 and will drift.

Whatever it is set to, Cashfree's own payment window shows the customer the
exact amount before they confirm.

### Showing local prices on the site

Set `NEXT_PUBLIC_LOCAL_PRICING=on` and **rebuild**. Product pages, cards and
the cart then show the visitor's currency, and a **USD / local switch
appears in the header** so they can price the collection either way. The
choice is remembered per browser.

The switch only appears when there is a real choice — a visitor whose
currency is already USD never sees it.

Those figures are **approximations**, marked `≈`, because the customer's own
bank sets the final conversion from whatever Cashfree bills. Rates live in
`src/lib/currency.ts`, rounded to clean numbers (`≈ £255`, not `£252.80`).

> These display rates are **separate** from `CASHFREE_INR_PER_USD`, which is
> what gets charged. Keep the two roughly in step — the INR figure shown to
> an Indian visitor comes from `currency.ts`, the one Cashfree charges comes
> from the environment, and a visitor who compares them will notice.

Server-rendered HTML, page titles and structured data stay in USD, so search
engines and the canonical price are unaffected.

### Country detection behind nginx

Country is resolved in two steps: `/api/geo` reads an `x-geo-country`
header, and if nothing sets one the browser's own locale is used instead
(`en-GB` → GB). **So local pricing works out of the box on a plain VPS** —
the header is an accuracy upgrade, not a requirement.

Locale is weaker evidence: it reflects the device's language settings rather
than where the visitor is, so a British expat in Dubai sees GBP. The
currency switch in the header lets anyone correct it, and the choice is
remembered.

For IP-based accuracy, install the GeoIP2 module (`apt install
libnginx-mod-http-geoip2` and a GeoLite2-Country database), then:

```nginx
geoip2 /usr/share/GeoIP/GeoLite2-Country.mmdb {
    $geoip2_country_code country iso_code;
}

# inside the location / block:
proxy_set_header X-Geo-Country $geoip2_country_code;
```

Verify with `curl -sI https://www.isvena.com/api/geo` and a request from a
non-Indian IP; the JSON should carry that country.

Skipping GeoIP is fine — detection falls back to the browser locale. To turn
the feature off entirely, leave `NEXT_PUBLIC_LOCAL_PRICING` unset: prices
stay in USD sitewide and the currency switch disappears. What Cashfree
charges is unaffected either way.

## 7. The webhook

`/api/create-order` registers `{origin}/api/webhooks/cashfree` as the
order's `notify_url` — **but only when `NEXT_PUBLIC_SITE_URL` is an
`https://` address.** Cashfree requires HTTPS for this URL and silently
receives nothing if it were ever pointed at plain `http://`, so it is
omitted rather than sent and rejected — meaning **on a correctly deployed
production site this needs no setup at all.** It only matters for local
development over `http://localhost`, where the webhook path is simply
unreachable and the browser-return path (section "What happens on an order")
is the only one that runs. That is a fine way to test the checkout flow
itself; it does not exercise the webhook.

Every request to this endpoint is checked against Cashfree's HMAC-SHA256
signature (`x-webhook-signature` / `x-webhook-timestamp` headers) before
anything in the body is trusted — an unsigned or wrongly-signed POST is
rejected outright and never reaches the confirmation logic.

**Also enable Dashboard → Account & Settings → Notifications → emails for
successful payments**, as a second line of sight independent of this
application entirely.

Every order arrives with the customer's name, email, phone, full delivery
address and engraving name in its **tags** (Dashboard → Transactions →
Orders → the order). That is what you despatch from if the confirmation
email (section 8) is ever missing.

## 8. Order notification email

Every paid order is emailed to `info@isvena.com` (override with
`ORDER_EMAIL_TO`). There is no database and no admin screen, so **that email
is the order**: it carries the order number, the pieces and colours, the
engraving name, the full delivery address, phone, and the Cashfree payment
id. Replying to it reaches the customer.

Sent via **Resend's API**, not SMTP. SMTP was tried first and abandoned:
its only failure signal is a TCP connection going quiet — no structured
error, nothing to grep for beyond "it didn't arrive" — which is a bad
foundation for the one notification a no-database shop depends on entirely.

1. Sign up at [resend.com](https://resend.com) (free tier: 3,000 emails/month,
   comfortably more than this needs) and grab an API key from
   **Dashboard → API Keys**.
2. **Verify `isvena.com`** under **Domains** — Resend gives you a handful of
   DNS records (SPF, DKIM) to add wherever the domain's DNS is managed;
   verification usually completes within minutes of adding them. Skipping
   this step means Resend only delivers to the email address that owns the
   API key, and marks every send as a test — fine for confirming the wiring
   works, useless for real orders.
3. Add to `.env.production` and recreate the container:

```bash
RESEND_API_KEY=re_…
ORDER_EMAIL_FROM=Isvena <info@isvena.com>
```

`ORDER_EMAIL_FROM` doesn't need a separate mailbox — once the *domain* is
verified (step 2), Resend lets you send from any address `@isvena.com`,
whether or not it's a real inbox. Using the same address as `ORDER_EMAIL_TO`
(which defaults to `info@isvena.com`) is the simplest setup: the order
notification sends from your own mailbox to itself.

`ORDER_EMAIL_FROM` only works once step 2 is done — until then, leave it
unset and it falls back to Resend's shared sandbox sender, which is
sandbox-restricted as described above.

**Nothing is lost if Resend is unconfigured or unreachable.** The full order
is written to the container log instead, and the customer's payment still
succeeds — a mail outage must never turn a completed payment into an error
on their screen. Find those with:

```bash
docker logs isvena | grep -A25 '\[mail\]'
```

A rejection from Resend itself (bad `from` domain, quota, etc.) logs as
`[mail] Resend rejected order … — <reason>`, with the actual order details
right below it either way.

### Confirming Resend works, independent of a real order

```bash
docker exec -i isvena node <<'EOF'
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
resend.emails.send({
  to: process.env.ORDER_EMAIL_TO || 'info@isvena.com',
  from: process.env.ORDER_EMAIL_FROM || 'Isvena <onboarding@resend.dev>',
  subject: 'Isvena - Resend test (safe to delete)',
  text: 'Dummy test confirming Resend delivery works.',
}).then(r => console.log(r.error ? 'FAILED: ' + r.error.message : 'SENT: ' + r.data.id));
EOF
```

The heredoc form (`<<'EOF' … EOF`, all pasted as one block) survives being
pasted into a terminal far more reliably than a one-line `node -e "…"` with
nested quotes — worth using for any one-off script like this, not just this
one.

### Order numbers

Assigned at order creation as `ISV-260821-K4F7` — the date, then a suffix
drawn from an alphabet with no `0/O` or `1/I/5/S` in it, so a number read off
a screen and typed into an email survives the trip. It is used directly as
Cashfree's own `order_id`, shown to the customer on the confirmation page,
and used as the email subject, so all three name the same order — there is
no separate gateway-issued id to reconcile against it.

There is no database, so uniqueness is probabilistic rather than enforced:
456,976 suffixes per day. At current volume a clash is far-fetched; it is
worth knowing rather than assuming.

### Duplicate emails

The webhook and the success page both trigger the same confirmation check,
and Cashfree can retry a webhook delivery — so without a safeguard, one
order could email two or three times. Guarded against with an in-memory
"already confirmed" set: harmless and cheap, but it resets on a deploy or a
restart, so a very precisely-timed retry across exactly that moment could in
theory cause one duplicate email. A nuisance, not a lost order — the order
and its tags still exist on Cashfree regardless.

---

## Deploying an update

```bash
cd /docker/isvena
git pull
npm ci
npm run build
sudo systemctl restart isvena
```

`npm run build` writes to `.next/`. Next.js serves the previous build until
the restart, so the window where the site is inconsistent is short — but it
is not zero. Deploy when it's quiet.

(On the box as it is actually run, this is `docker compose up -d --build
isvena` instead — see "How it is actually deployed" in section 3.)

---

## Testing

Use the **sandbox** key pair first (`CASHFREE_ENV=sandbox`, App ID starting
`TEST…`). Add a bag, go to `/checkout`, fill the form, and pay in the
Cashfree window with test card `4111 1111 1111 1111`, any future expiry, CVV
`123`, OTP `123456` — or use the sandbox's UPI success option, which needs
no card at all. Confirm:

1. `/checkout` asks for address, phone and engraving, and shows **no
   shipping charge**.
2. The Cashfree window shows the expected amount in the expected currency.
3. You land on `/checkout/success` showing **paid**, with the order number.
4. The order appears in the Cashfree dashboard, and its **Tags** carry the
   address, phone and engraving name.
5. The confirmation email arrives at `info@isvena.com` (section 8).

Then close the window without paying — you should land back on the form with
everything still filled in and no error shouting at you, **and the bag
should still have your items in it** (a failed or cancelled payment must
never cost the customer their cart).

If you're testing over plain `http://localhost`, the webhook cannot reach
you (section 7) — the browser-return path alone still confirms the order and
sends the email, so this only means you haven't exercised the webhook path
specifically. Test that once from the real deployed domain.

Then swap in the live keys (`CASHFREE_ENV=production`, and the production
App ID / Secret Key pair from the dashboard with the environment switch set
to **live**, not test), restart, place one real low-value order and refund
it.

If checkout returns 503, check `journalctl -u isvena` — the app logs exactly
which variable is missing. If it returns 500 or 401, the same log carries
Cashfree's own reason.

---

## Known gaps

**No order record of your own.** Orders live in Cashfree only, with the
delivery details in the order's `order_tags`. Fine at current volume; if it
grows, the webhook already in place (section 7) is the natural point to also
write to a database.

**Taxes.** No GST/VAT is calculated. The FAQ states that import duties are
the recipient's responsibility.

**Free shipping is promised in three places** — the header announcement bar,
the cart drawer, and the product structured data (`shippingRate: 0`). If that
changes, all three need updating together, plus the FAQ.

**No staging environment.** Builds happen on the production box. If that
becomes uncomfortable, build elsewhere and rsync `.next/`.

**The `cashfree-pg` SDK reports client-side validation errors (not payment
or customer data) to a Sentry project Cashfree operates, on by default.**
This app disables it explicitly (`XEnableErrorAnalytics: false` in
`src/lib/cashfree.ts`) — worth knowing if the SDK is ever upgraded and that
call site changes shape, since nothing else re-enables it.
