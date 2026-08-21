import { NextRequest } from "next/server";
import { verifyWebhookSignature } from "@/lib/cashfree";
import { confirmOrderPaid } from "@/lib/order-confirmation";

/**
 * Server-to-server order confirmation.
 *
 * This is the reliable path: it fires regardless of what the customer's
 * browser does, so a customer who pays and closes the tab immediately still
 * gets their order emailed. The browser returning to /checkout/success is a
 * second, faster path to the same confirmation for the common case — this
 * route exists so that isn't the *only* path.
 *
 * The body must be read as raw text before anything else touches it: the
 * signature is computed over the exact bytes Cashfree sent, and Next.js's
 * request.json() would parse and discard that exact byte sequence.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-webhook-signature");
  const timestamp = request.headers.get("x-webhook-timestamp");

  if (!signature || !timestamp) {
    return Response.json({ error: "Missing signature." }, { status: 400 });
  }
  if (!verifyWebhookSignature({ timestamp, rawBody, signature })) {
    console.error("[webhook:cashfree] Signature mismatch — ignoring.");
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: { type?: string; data?: { order?: { order_id?: string } } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid payload." }, { status: 400 });
  }

  const orderId = event.data?.order?.order_id;
  if (event.type === "PAYMENT_SUCCESS_WEBHOOK" && orderId) {
    const result = await confirmOrderPaid(orderId);
    console.log(
      `[webhook:cashfree] ${event.type} for ${orderId} — status=${result.status} emailed=${result.emailed}`
    );
  }

  // 200 regardless of what confirmOrderPaid found, so long as the signature
  // was valid: a 4xx/5xx here tells Cashfree to retry, and retrying is only
  // useful for a delivery problem, not because the payment turned out
  // pending or already handled.
  return Response.json({ ok: true });
}
