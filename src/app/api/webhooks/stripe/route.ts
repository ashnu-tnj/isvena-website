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

async function fulfillOrder(
  stripe: Stripe,
  session: Stripe.Checkout.Session
) {
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
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
    sku: item.description?.slice(0, 40) ?? "isvena",
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
