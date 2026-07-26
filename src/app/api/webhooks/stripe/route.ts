import { NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createShiprocketOrder } from "@/lib/shiprocket";

/**
 * Stripe webhook endpoint. Point a webhook at /api/webhooks/stripe with the
 * `checkout.session.completed` event and set STRIPE_WEBHOOK_SECRET.
 * On successful payment it creates the shipment order in Shiprocket.
 */
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return Response.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    try {
      await fulfillOrder(stripe, session);
    } catch (err) {
      // Log and return 500 so Stripe retries the delivery.
      console.error(`[stripe-webhook] fulfillment failed for ${session.id}`, err);
      return Response.json({ error: "Fulfillment failed" }, { status: 500 });
    }
  }

  return Response.json({ received: true });
}

/**
 * Warehouse SKU for a paid line: `<slug>-<colour>`, read from the product
 * metadata set in /api/checkout. Falls back to the bare slug, then to a
 * constant, so a shipment is never blocked by a missing SKU.
 */
function skuFor(item: Stripe.LineItem): string {
  const product = item.price?.product;
  const metadata =
    typeof product === "object" && product !== null && "metadata" in product
      ? product.metadata
      : null;

  const slug = metadata?.slug;
  if (!slug) return "isvena";

  const color = metadata.color?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return color ? `${slug}-${color}` : slug;
}

async function fulfillOrder(
  stripe: Stripe,
  session: Stripe.Checkout.Session
) {
  // Expand the product so the catalog slug and colour we stashed in metadata
  // at checkout come back with the line item; they become the warehouse SKU.
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
    expand: ["data.price.product"],
  });

  const customer = session.customer_details;
  const shipping = session.collected_information?.shipping_details;
  const address = shipping?.address ?? customer?.address;
  const name = shipping?.name ?? customer?.name ?? "Customer";

  if (!address?.line1 || !address.city || !address.postal_code || !address.country) {
    throw new Error(`Session ${session.id} has no usable shipping address`);
  }

  const items = lineItems.data.map((item) => ({
    name: item.description ?? "Isvena piece",
    sku: skuFor(item),
    units: item.quantity ?? 1,
    selling_price: (item.amount_total ?? 0) / 100 / (item.quantity || 1),
  }));

  await createShiprocketOrder({
    orderId: session.id.slice(-24),
    items,
    shipTo: {
      name,
      email: customer?.email ?? "",
      phone: customer?.phone?.replace(/[^\d+]/g, "") ?? "",
      address: address.line1,
      address2: address.line2 ?? undefined,
      city: address.city,
      state: address.state ?? address.city,
      country: address.country,
      pincode: address.postal_code,
    },
    subTotal: (session.amount_subtotal ?? 0) / 100,
  });
}
