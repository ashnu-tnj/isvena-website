import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProduct } from "@/data/products";

interface CheckoutLine {
  slug: string;
  color: string;
  qty: number;
}

// Countries Isvena ships to via Stripe Checkout's address collection.
//
// Shipping is complimentary worldwide, so no `shipping_options` are defined —
// Stripe then charges nothing for delivery and shows the customer no shipping
// line at all. The address and phone are still collected, because that is what
// the workshop needs to despatch the piece.
const SHIPPING_COUNTRIES = [
  "US", "CA", "GB", "IE", "AU", "NZ",
  "DE", "FR", "IT", "ES", "PT", "NL", "BE", "AT", "CH",
  "SE", "NO", "DK", "FI",
  "AE", "SA", "QA", "KW", "BH", "OM",
  "SG", "MY", "JP", "KR", "HK",
  "IN", "LK", "ZA",
] as const;

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return Response.json(
      {
        error:
          "Online payment is not configured yet. Please use the contact page to place your order.",
      },
      { status: 503 }
    );
  }

  let lines: CheckoutLine[];
  try {
    const body = await request.json();
    lines = body.lines;
    if (!Array.isArray(lines) || lines.length === 0) throw new Error("empty");
  } catch {
    return Response.json({ error: "Invalid checkout request." }, { status: 400 });
  }

  // Prices always come from the server-side catalog, never from the client.
  const lineItems = [];
  for (const line of lines) {
    const product = getProduct(line.slug);
    const qty = Math.floor(Number(line.qty));
    if (!product || !Number.isFinite(qty) || qty < 1 || qty > 50) {
      return Response.json(
        { error: `Unknown or invalid item: ${line.slug}` },
        { status: 400 }
      );
    }
    const color =
      product.colors.find((c) => c === line.color) ?? product.colors[0];
    lineItems.push({
      quantity: qty,
      price_data: {
        currency: "usd",
        unit_amount: product.price * 100,
        product_data: {
          name: product.name,
          description: `Colour: ${color} · Made to order in Chennai`,
          metadata: { slug: product.slug, color },
        },
      },
    });
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: [...SHIPPING_COUNTRIES],
      },
      phone_number_collection: { enabled: true },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
      metadata: { source: "isvena-web" },
    });
    return Response.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] failed to create session", err);
    return Response.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
