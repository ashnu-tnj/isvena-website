# Deploying Isvena on a VPS

The site is a Next.js 16 application running as a long-lived Node process
behind nginx. Payments run on **Razorpay Standard Checkout**; there is no
shipping integration, because delivery is complimentary worldwide and
arranged by hand from the details captured at checkout.

**Never put a real key in a file that git tracks.** Secrets live in
`.env.local` on the server, which is gitignored. `.env.example` is a
template listing variable *names* only.

---

## What happens on an order

1. Customer hits **Checkout** in the cart drawer and lands on `/checkout`.
2. They fill in **name, email, phone, delivery address** and, if they want
   it, the **engraving name**. Razorpay's payment window collects a payment
   method and nothing else, so this page is the only place those details are
   ever asked for.
3. `POST /api/create-order` prices the bag from `src/data/products.ts`
   **server-side** — the browser cannot set a price — and opens a Razorpay
   order carrying the address and engraving in its `notes`.
4. Razorpay's window opens over the page. Card details go straight to
   Razorpay and never touch this server.
5. `POST /api/verify-payment` checks the signature Razorpay hands back, then
   asks Razorpay directly whether the payment really succeeded. Only then is
   the order treated as paid.
6. The customer lands on `/checkout/success` and the cart clears.
7. You despatch using the **notes on the order** in the Razorpay dashboard.

Until `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are both set,
`/api/create-order` returns 503 and checkout tells the customer to order via
the contact page. The site is safe to leave in that state.

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
# Razorpay keys — Dashboard → Account & Settings → API Keys
RAZORPAY_KEY_ID=rzp_live_…
RAZORPAY_KEY_SECRET=…

# The key id again, for the browser. Razorpay's payment window needs it
# client-side and it is publishable by design. Must match RAZORPAY_KEY_ID.
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_…

# What the customer is charged in, and the rate used to get there from the
# USD catalogue. See section 6.
RAZORPAY_CURRENCY=INR
RAZORPAY_INR_PER_USD=88

# The public origin. Every canonical URL, sitemap entry and Open Graph tag.
NEXT_PUBLIC_SITE_URL=https://www.isvena.com

# Local-currency display (section 6).
NEXT_PUBLIC_LOCAL_PRICING=
```

> **`NEXT_PUBLIC_RAZORPAY_KEY_ID` is the only Razorpay value that may carry
> that prefix.** Anything named `NEXT_PUBLIC_*` is compiled into the
> JavaScript every visitor downloads. Giving the *secret* that prefix would
> publish it to the world.

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
  enough. `RAZORPAY_KEY_SECRET`, `RAZORPAY_CURRENCY` and
  `RAZORPAY_INR_PER_USD` are read at runtime, so those only need a restart.
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
`process.env.RAZORPAY_KEY_SECRET` reads.

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
the Dockerfile, as `NEXT_PUBLIC_SITE_URL` already is. Putting one only in
`.env.production` gets it to the server and never to the browser.

`NEXT_PUBLIC_RAZORPAY_KEY_ID` is the exception that needs none of this:
`/api/create-order` returns the key id in its response and the checkout form
prefers that over the compiled-in value, so the browser gets it at runtime.
Setting it is optional here.

### Checking what the container sees

```bash
docker exec isvena printenv | grep RAZORPAY
docker logs --tail 50 isvena | grep -i razorpay
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
`[razorpay] … not set` line naming the exact variable if checkout is
misconfigured, and the `[create-order]` and `[verify-payment]` lines carrying
Razorpay's own reason when it refuses something.

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
canonical URL points at a redirect.

## 6. Currency

**The catalogue is priced in USD. Razorpay bills in one currency.** Those
two facts have to be reconciled somewhere, and that somewhere is
`RAZORPAY_CURRENCY` plus `RAZORPAY_INR_PER_USD`.

An Indian Razorpay account settles in **INR** unless *International
Payments* has been activated on it (Dashboard → **Account & Settings →
Configuration → International Payments**; Razorpay reviews the request, it
is not a toggle). So:

| Situation | Set | Effect |
|---|---|---|
| International Payments **off** (the default) | `RAZORPAY_CURRENCY=INR` | A $365 bag is charged as ₹32,120 at the rate below. Foreign cards are converted by the customer's own bank. |
| International Payments **on** | `RAZORPAY_CURRENCY=USD` | The catalogue price is billed as-is and `RAZORPAY_INR_PER_USD` is ignored. |

`RAZORPAY_INR_PER_USD` is **the rate you sell at**, not a display estimate:
it decides what the customer's card is actually debited. It is deliberately
a setting rather than a live FX call, so a third-party outage can never sit
between a customer and the pay button — which means **you own keeping it
current**. Review it when the rupee moves; the default of 88 was set in
2026 and will drift.

Whatever it is set to, Razorpay's own payment window shows the customer the
exact amount before they confirm.

### Showing local prices on the site

Set `NEXT_PUBLIC_LOCAL_PRICING=on` and **rebuild**. Product pages, cards and the cart then show the visitor's
currency, and a **USD / local switch appears in the header** so they can
price the collection either way. The choice is remembered per browser.

The switch only appears when there is a real choice — a visitor whose
currency is already USD never sees it.

Those figures are **approximations**, marked `≈`, because the customer's own
bank sets the final conversion from whatever Razorpay bills. Rates live in
`src/lib/currency.ts`, rounded to clean numbers (`≈ £255`, not `£252.80`).

> These display rates are **separate** from `RAZORPAY_INR_PER_USD`, which is
> what gets charged. Keep the two roughly in step — the INR figure shown to
> an Indian visitor comes from `currency.ts`, the one Razorpay charges comes
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
stay in USD sitewide and the currency switch disappears. What Razorpay
charges is unaffected either way.

## 7. Razorpay notifications

Dashboard → **Account & Settings → Notifications** → enable emails for
**successful payments**. Nothing else tells you a sale happened; there is no
webhook and no order database.

Every order arrives with the customer's name, email, phone, full delivery
address and engraving name in its **Notes** (Dashboard → Transactions →
Orders → the order). That is what you despatch from.

## 8. Order notification email

Every paid order is emailed to `info@isvena.com` (override with
`ORDER_EMAIL_TO`). There is no database and no admin screen, so **that email
is the order**: it carries the order number, the pieces and colours, the
engraving name, the full delivery address, phone, and the Razorpay payment
id. Replying to it reaches the customer.

Add to `.env.production` and recreate the container:

```bash
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=info@isvena.com
SMTP_PASS=…
```

Port 465 is implicit TLS, 587 upgrades via STARTTLS; leave `SMTP_SECURE`
unset to derive it from the port. If your mailbox uses 2FA, this needs an
**app password**, not the account password.

**Nothing is lost if SMTP is unconfigured or the mail server is down.** The
full order is written to the container log instead, and the customer's
payment still succeeds — a mail outage must never turn a completed payment
into an error on their screen. Find those with:

```bash
docker logs isvena | grep -A25 '\[mail\]'
```

### Order numbers

Assigned at order creation as `ISV-260818-K4F7` — the date, then a suffix
drawn from an alphabet with no `0/O` or `1/I/5/S` in it, so a number read off
a screen and typed into an email survives the trip. It is written to the
Razorpay order's `receipt` and its notes, shown to the customer on the
confirmation page, and used as the email subject, so all four name the same
order.

There is no database, so uniqueness is probabilistic rather than enforced:
456,976 suffixes per day. At current volume a clash is far-fetched; it is
worth knowing rather than assuming.

### The gap worth knowing about

The email is sent when the browser returns from Razorpay and
`/api/verify-payment` runs. **If a customer pays and closes the tab
immediately, that never happens** — the money is captured, the order sits in
the Razorpay dashboard with its notes intact, and no email arrives.

Nothing is lost, but you would only find it by looking. If it ever happens,
the fix is a Razorpay webhook on `payment.captured` calling the same code,
which does not depend on the customer's browser at all.

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

---

## Testing

Use a **test** key pair (`rzp_test_…`) first. Add a bag, go to `/checkout`,
fill the form, and pay in the Razorpay window with card
`4111 1111 1111 1111`, any future expiry, any CVC, OTP `1234` — or use the
**UPI success** option, which needs no card at all. Confirm:

1. `/checkout` asks for address, phone and engraving, and shows **no
   shipping charge**.
2. The Razorpay window shows the expected amount in the expected currency.
3. You land on `/checkout/success` and the cart is empty.
4. The payment appears in the Razorpay dashboard, and the **order's Notes**
   carry the address, phone and engraving name.

Then close the window without paying — you should land back on the form with
everything still filled in and no error shouting at you.

Then swap in the live keys, **rebuild** (`NEXT_PUBLIC_RAZORPAY_KEY_ID` is
compiled in), restart, place one real low-value order and refund it.

If checkout returns 503, check `journalctl -u isvena` — the app logs exactly
which variable is missing. If it returns 500 or 401, the same log carries
Razorpay's own reason.

---

## Known gaps

**No order record of your own.** Orders live in Razorpay only, with the
delivery details in the order's `notes`. Fine at current volume; if it grows,
add a Razorpay webhook on `payment.captured` writing to a database.

**Verification depends on the customer's browser getting back to us.** If
someone pays and then closes the tab before `/api/verify-payment` runs, the
money is captured in Razorpay but the site never records the hand-off, and
they never see the confirmation page. The payment is still in the dashboard
with its notes, so nothing is lost — but you will only see it there. A
webhook is the proper fix if that starts happening.

**Taxes.** No GST/VAT is calculated. The FAQ states that import duties are
the recipient's responsibility.

**Free shipping is promised in three places** — the header announcement bar,
the cart drawer, and the product structured data (`shippingRate: 0`). If that
changes, all three need updating together, plus the FAQ.

**No staging environment.** Builds happen on the production box. If that
becomes uncomfortable, build elsewhere and rsync `.next/`.
