import { NextRequest } from "next/server";
import {
  CHARGE_CURRENCY,
  describeRazorpayError,
  getRazorpay,
  toChargeCurrency,
  toSubunits,
} from "@/lib/razorpay";
import { getProduct } from "@/data/products";
import { isHouseColour } from "@/data/colors";
import { isShippingCountry } from "@/data/shipping";
import { newOrderNumber } from "@/lib/order-number";

interface OrderLine {
  slug: string;
  color: string;
  qty: number;
}

/** Razorpay refuses anything under 100 subunits. */
const MIN_SUBUNITS = 100;

/** Razorpay truncates note values at 256 characters; stay inside it. */
function note(value: string): string {
  return value.slice(0, 250);
}

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  const razorpay = getRazorpay();
  if (!razorpay) {
    return Response.json(
      {
        error:
          "Online payment is not configured yet. Please use the contact page to place your order.",
      },
      { status: 503 }
    );
  }

  let body: {
    lines?: OrderLine[];
    customer?: Record<string, unknown>;
    address?: Record<string, unknown>;
    engraving?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid checkout request." }, { status: 400 });
  }

  const lines = body.lines;
  if (!Array.isArray(lines) || lines.length === 0) {
    return Response.json({ error: "Your bag is empty." }, { status: 400 });
  }

  // Razorpay's modal collects a card and nothing else — no address, no
  // custom fields — so unlike a hosted checkout page, everything the workshop
  // needs to despatch the piece has to be gathered here and carried on the
  // order itself. There is no database, so the order's notes are the record.
  const customer = body.customer ?? {};
  const address = body.address ?? {};

  const name = str(customer.name, 100);
  const email = str(customer.email, 120);
  const phone = str(customer.phone, 30);
  const line1 = str(address.line1, 120);
  const line2 = str(address.line2, 120);
  const city = str(address.city, 60);
  const region = str(address.region, 60);
  const postcode = str(address.postcode, 20);
  const country = str(address.country, 2).toUpperCase();
  const engraving = str(body.engraving, 20);

  const missing = [
    !name && "name",
    !email && "email",
    !phone && "phone",
    !line1 && "address",
    !city && "city",
    !country && "country",
  ].filter(Boolean);
  if (missing.length > 0) {
    return Response.json(
      { error: `Please complete: ${missing.join(", ")}.` },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: "That email doesn't look right." }, { status: 400 });
  }
  if (!isShippingCountry(country)) {
    return Response.json(
      { error: "We don't ship to that country yet — please contact us." },
      { status: 400 }
    );
  }

  // Prices always come from the server-side catalogue, never from the client:
  // the browser sends what was chosen, not what it costs.
  let usdTotal = 0;
  const summary: string[] = [];
  for (const line of lines) {
    const product = getProduct(line.slug);
    const qty = Math.floor(Number(line.qty));
    if (!product || !Number.isFinite(qty) || qty < 1 || qty > 50) {
      return Response.json(
        { error: `Unknown or invalid item: ${line.slug}` },
        { status: 400 }
      );
    }
    // Any piece can be woven in any house colour, so the check is against the
    // range rather than the product, falling back to the photographed colour.
    const color = isHouseColour(line.color) ? line.color : product.photographedIn;
    usdTotal += product.price * qty;
    summary.push(`${product.name} ×${qty} (${color})`);
  }

  const amount = toSubunits(toChargeCurrency(usdTotal));
  if (amount < MIN_SUBUNITS) {
    return Response.json({ error: "Order total is too small." }, { status: 400 });
  }

  // Assigned before payment, so the reference exists on the Razorpay order
  // itself even for a customer who never comes back to complete it.
  const orderNumber = newOrderNumber();

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: CHARGE_CURRENCY,
      // Receipts must be unique and at most 40 characters.
      receipt: orderNumber,
      notes: {
        order_number: orderNumber,
        customer: note(name),
        email: note(email),
        phone: note(phone),
        address: note(
          [line1, line2, city, region, postcode, country].filter(Boolean).join(", ")
        ),
        country,
        engraving: engraving || "—",
        items: note(summary.join("; ")),
        // Kept so the rupee charge can be reconciled against the catalogue.
        catalogue_usd: String(usdTotal),
      },
    });

    return Response.json({
      orderId: order.id,
      orderNumber,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    // The customer only ever sees a generic message, so Razorpay's own reason
    // has to be legible in the server log or the cause is unfindable.
    const e = err as { statusCode?: number };
    console.error(
      "[create-order] Razorpay rejected the order — " + describeRazorpayError(err)
    );

    // A bad key is the one failure the operator can fix immediately, so it is
    // worth distinguishing from Razorpay simply being unhappy or unreachable.
    if (e.statusCode === 401) {
      return Response.json(
        { error: "Payment is misconfigured. Please contact us to order." },
        { status: 401 }
      );
    }
    return Response.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
