# Deploying Isvena on a VPS

The site is a Next.js 16 application running as a long-lived Node process
behind nginx. Payments run on **Stripe Checkout**; there is no shipping
integration, because delivery is complimentary worldwide and arranged by
hand from the details on the Stripe payment.

**Never put a real key in a file that git tracks.** Secrets live in
`.env.local` on the server, which is gitignored. `.env.example` is a
template listing variable *names* only.

---

## What happens on an order

1. Customer hits **Checkout** in the cart drawer.
2. `POST /api/checkout` builds a Stripe Checkout Session. Prices are read
   from `src/data/products.ts` **server-side** — the browser cannot set a
   price — and the customer goes to Stripe's hosted payment page.
3. Stripe collects card details, **full shipping address, email and phone**.
   No shipping cost is added or shown.
4. On success the customer returns to `/checkout/success` and the cart
   clears.
5. You despatch the order using the details on the Stripe payment.

Until `STRIPE_SECRET_KEY` is set, `/api/checkout` returns 503 and the cart
tells the customer to order via the contact page. The site is safe to leave
in that state.

---

## 1. Server requirements

- **Node.js 20.9 or newer** (`next` declares `>=20.9.0`); 22 LTS is a good
  default. Check with `node -v`.
- nginx, or another reverse proxy terminating TLS.
- A process manager so the app survives reboots and crashes — the examples
  below use **systemd**, which is already on the box.

## 2. Get the code and build

```bash
git clone https://github.com/ashnu-tnj/isvena-website.git /var/www/isvena
cd /var/www/isvena
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

Create `/var/www/isvena/.env.local`:

```bash
# Stripe secret key — Dashboard → Developers → API keys
STRIPE_SECRET_KEY=sk_live_…

# The public origin. Builds Stripe's return URL, and every canonical URL,
# sitemap entry and Open Graph tag.
NEXT_PUBLIC_SITE_URL=https://www.isvena.com

# Local-currency display. Leave unset until Adaptive Pricing is enabled
# in Stripe (section 6).
NEXT_PUBLIC_LOCAL_PRICING=
```

Then `chmod 600 .env.local` so only the owner can read it.

Two things that catch people:

- **`NEXT_PUBLIC_*` values are compiled into the JavaScript at build time.**
  Changing one means running `npm run build` again — restarting is not
  enough. `STRIPE_SECRET_KEY` is read at runtime, so that one only needs a
  restart.
- **A running Node process does not re-read `.env.local`.** Restart the
  service after any change.

## 4. Run it as a service

`/etc/systemd/system/isvena.service`:

```ini
[Unit]
Description=Isvena website
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/isvena
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
`[stripe] STRIPE_SECRET_KEY is not set` line if checkout is misconfigured.

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

## 6. Charging in the customer's currency

Stripe Dashboard → **Settings → Payments → Adaptive Pricing** → enable.

Stripe then detects the customer's location and presents the price in their
local currency, handling the conversion. Checkout Sessions are still created
in USD; no code changes.

**Confirm your account supports it before relying on it.** Adaptive Pricing
is not offered to every account, and yours is India-based. If the setting
isn't there, everyone is charged USD — leave `NEXT_PUBLIC_LOCAL_PRICING`
unset.

### Showing local prices on the site

Once Adaptive Pricing is live, set `NEXT_PUBLIC_LOCAL_PRICING=on` and
**rebuild**. Product pages, cards and the cart then show the visitor's
currency.

Those figures are **approximations**, marked `≈`, because Stripe does not
publish the rate it will use in advance. Rates live in `src/lib/currency.ts`,
rounded to clean numbers (`≈ £255`, not `£252.80`).

> Turning this on while Adaptive Pricing is off means the site quotes £255
> and Stripe charges $320. Enable Adaptive Pricing first.

Server-rendered HTML, page titles and structured data stay in USD, so search
engines and the canonical price are unaffected.

### Country detection behind nginx

`/api/geo` reads the visitor's country from an `x-geo-country` header. On a
VPS nothing sets that for you, so **without the step below every visitor is
treated as USD** and local pricing silently does nothing.

Install the GeoIP2 module (`apt install libnginx-mod-http-geoip2` and a
GeoLite2-Country database), then:

```nginx
geoip2 /usr/share/GeoIP/GeoLite2-Country.mmdb {
    $geoip2_country_code country iso_code;
}

# inside the location / block:
proxy_set_header X-Geo-Country $geoip2_country_code;
```

Verify with `curl -sI https://www.isvena.com/api/geo` and a request from a
non-Indian IP; the JSON should carry that country.

If you would rather not run GeoIP, leave `NEXT_PUBLIC_LOCAL_PRICING` unset.
Prices stay in USD sitewide and Adaptive Pricing still converts at checkout —
the site simply doesn't preview the local figure.

## 7. Stripe notifications

Dashboard → **Settings → Personal → Notifications** → enable emails for
**successful payments**. Nothing else tells you a sale happened; there is no
webhook and no order database.

---

## Deploying an update

```bash
cd /var/www/isvena
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

Use a **test** key (`sk_test_…`) first. Add a bag, check out, pay with
`4242 4242 4242 4242`, any future expiry, any CVC. Confirm:

1. Checkout shows **no shipping charge**, and asks for address and phone.
2. You land on `/checkout/success` and the cart is empty.
3. The payment appears in the Stripe dashboard with address and phone
   attached.

Then swap in the live key, restart, place one real low-value order and
refund it.

If checkout returns 503, check `journalctl -u isvena` — the app logs exactly
which variable is missing.

---

## Known gaps

**No order record of your own.** Orders live in Stripe only. Fine at current
volume; if it grows, add a webhook on `checkout.session.completed` writing to
a database.

**Taxes.** No GST/VAT is calculated. The FAQ states that import duties are
the recipient's responsibility. Stripe Tax can automate this if needed.

**Free shipping is promised in three places** — the header announcement bar,
the cart drawer, and the product structured data (`shippingRate: 0`). If that
changes, all three need updating together, plus the FAQ.

**No staging environment.** Builds happen on the production box. If that
becomes uncomfortable, build elsewhere and rsync `.next/`.
