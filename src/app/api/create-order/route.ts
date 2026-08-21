import { NextRequest } from "next/server";
import {
  CHARGE_CURRENCY,
  customerIdFor,
  describeCashfreeError,
  getCashfree,
  toCashfreeAmount,
  toChargeCurrency,
} from "@/lib/cashfree";
import { getProduct } from "@/data/products";
import { isHouseColour } from "@/data/colors";
import { isShippingCountry } from "@/data/shipping";
import { newOrderNumber } from "@/lib/order-number";

interface OrderLine {
  slug: string;
  color: string;
  qty: number;
}

/** Cashfree's own minimum; the catalogue clears it many times over anyway. */
const MIN_CHARGE_AMOUNT = 1;

/** order_tags allows at most 10 keys and, conservatively, modest value lengths. */
function tag(value: string): string {
  return value.slice(0, 250);
}

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  const cashfree = getCashfree();
  if (!cashfree) {
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

  // Cashfree's Drop-in collects a card and nothing else — no address, no
  // custom fields — so unlike a hosted checkout page, everything the
  // workshop needs to despatch the piece has to be gathered here and carried
  // on the order itself. There is no database, so the order's tags are the
  // record.
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

  const amount = toCashfreeAmount(toChargeCurrency(usdTotal));
  if (amount < MIN_CHARGE_AMOUNT) {
    return Response.json({ error: "Order total is too small." }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

  // Assigned before payment, and used as Cashfree's own order_id, so the
  // reference exists even for a customer who never completes checkout, and
  // the customer, the confirmation email and the Cashfree dashboard all name
  // the same order — there is never a second, gateway-generated id to
  // reconcile against this one.
  const orderNumber = newOrderNumber();

  try {
    const order = await cashfree.PGCreateOrder({
      order_id: orderNumber,
      order_amount: amount,
      order_currency: CHARGE_CURRENCY,
      customer_details: {
        customer_id: customerIdFor(email),
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
      },
      order_meta: {
        return_url: `${origin}/checkout/success?order_id={order_id}`,
        // Requires a public HTTPS origin — silently omitted for local/dev
        // testing over http, where the browser-return path still works.
        notify_url: origin.startsWith("https://")
          ? `${origin}/api/webhooks/cashfree`
          : undefined,
      },
      order_tags: {
        customer: tag(name),
        email: tag(email),
        phone: tag(phone),
        address: tag(
          [line1, line2, city, region, postcode, country].filter(Boolean).join(", ")
        ),
        country,
        engraving: engraving || "—",
        items: tag(summary.join("; ")),
        // Kept so the charge can be reconciled against the catalogue.
        catalogue_usd: String(usdTotal),
      },
    });

    return Response.json({
      orderId: orderNumber,
      paymentSessionId: order.data.payment_session_id,
      amount: order.data.order_amount,
      currency: order.data.order_currency,
      // The client's SDK must be initialised against the same environment
      // the order was created in, or Cashfree rejects the session — server
      // the source of truth rather than a second env var the client would
      // have to be kept in sync with by hand.
      environment:
        (process.env.CASHFREE_ENV ?? "sandbox").toLowerCase() === "production"
          ? "production"
          : "sandbox",
    });
  } catch (err) {
    // The customer only ever sees a generic message, so Cashfree's own reason
    // has to be legible in the server log or the cause is unfindable.
    const e = err as { response?: { status?: number } };
    console.error(
      "[create-order] Cashfree rejected the order — " + describeCashfreeError(err)
    );

    // A bad key is the one failure the operator can fix immediately, so it is
    // worth distinguishing from Cashfree simply being unhappy or unreachable.
    if (e.response?.status === 401) {
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
