/**
 * Minimal Shiprocket API client (https://apidocs.shiprocket.in).
 *
 * Configure with a Shiprocket "API user" (created under Settings → API in
 * the Shiprocket panel — not your main login):
 *   SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD, SHIPROCKET_PICKUP_LOCATION
 *
 * When credentials are absent every call becomes a logged no-op, so order
 * webhooks never fail because shipping isn't configured yet.
 */

const BASE = "https://apiv2.shiprocket.in/v1/external";

/**
 * Stripe charges in USD, but Shiprocket expects rupees — the figure it is
 * given becomes the declared value on the courier manifest and the customs
 * paperwork, so sending dollars understates a shipment roughly 88-fold.
 * Every amount crossing into Shiprocket is therefore converted here.
 *
 * Set SHIPROCKET_INR_PER_USD to the rate you want declared. It affects the
 * declared value only — never what the customer is charged.
 */
const DEFAULT_INR_PER_USD = 88;

function usdToInr(usd: number): number {
  const configured = Number(process.env.SHIPROCKET_INR_PER_USD);
  const rate =
    Number.isFinite(configured) && configured > 0
      ? configured
      : DEFAULT_INR_PER_USD;
  return Math.round(usd * rate);
}

interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

export function isShiprocketConfigured() {
  return Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD);
}

async function getToken(): Promise<string> {
  // Shiprocket tokens last 10 days; refresh after 9.
  if (tokenCache && tokenCache.expiresAt > Date.now()) return tokenCache.token;

  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  if (!res.ok) {
    throw new Error(`Shiprocket auth failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error("Shiprocket auth response had no token");

  tokenCache = { token: data.token, expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000 };
  return data.token;
}

export interface ShiprocketOrderItem {
  name: string;
  sku: string;
  units: number;
  /** Unit price in USD — converted to INR before it reaches Shiprocket. */
  selling_price: number;
}

export interface ShiprocketAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface CreateOrderInput {
  orderId: string;
  items: ShiprocketOrderItem[];
  shipTo: ShiprocketAddress;
  /** Order subtotal in USD — converted to INR before it reaches Shiprocket. */
  subTotal: number;
  /** Parcel defaults for made-to-order bags; override per shipment in the panel if needed. */
  parcel?: { length: number; breadth: number; height: number; weight: number };
}

/**
 * Create a prepaid order in Shiprocket (payment is captured by Stripe
 * before this runs). Returns the Shiprocket response, or null when the
 * integration isn't configured.
 */
export async function createShiprocketOrder(input: CreateOrderInput) {
  if (!isShiprocketConfigured()) {
    console.log(
      `[shiprocket] not configured — skipping order creation for ${input.orderId}`
    );
    return null;
  }

  const token = await getToken();
  const [firstName, ...rest] = input.shipTo.name.trim().split(/\s+/);
  const parcel = input.parcel ?? { length: 35, breadth: 30, height: 12, weight: 1 };

  const payload = {
    order_id: input.orderId,
    order_date: new Date().toISOString().slice(0, 16).replace("T", " "),
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION ?? "Primary",
    billing_customer_name: firstName || "Customer",
    billing_last_name: rest.join(" "),
    billing_address: input.shipTo.address,
    billing_address_2: input.shipTo.address2 ?? "",
    billing_city: input.shipTo.city,
    billing_pincode: input.shipTo.pincode,
    billing_state: input.shipTo.state,
    billing_country: input.shipTo.country,
    billing_email: input.shipTo.email,
    billing_phone: input.shipTo.phone,
    shipping_is_billing: true,
    order_items: input.items.map((item) => ({
      ...item,
      selling_price: usdToInr(item.selling_price),
    })),
    payment_method: "Prepaid",
    sub_total: usdToInr(input.subTotal),
    length: parcel.length,
    breadth: parcel.breadth,
    height: parcel.height,
    weight: parcel.weight,
  };

  const res = await fetch(`${BASE}/orders/create/adhoc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `Shiprocket order creation failed (${res.status}): ${JSON.stringify(body)}`
    );
  }
  console.log(`[shiprocket] order created for ${input.orderId}`, body);
  return body;
}
