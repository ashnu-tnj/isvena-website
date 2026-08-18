import { NextRequest } from "next/server";
import {
  describeRazorpayError,
  getRazorpay,
  verifyPaymentSignature,
} from "@/lib/razorpay";
import { sendOrderEmail } from "@/lib/mailer";

/**
 * Confirm a payment the browser claims succeeded.
 *
 * Nothing the browser sends is trusted: it reports its own success, so the
 * order is only treated as paid once the signature proves Razorpay produced
 * it, and Razorpay's own record of the payment agrees. A mismatch is a hard
 * 400 — never a soft pass.
 */
export async function POST(request: NextRequest) {
  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const orderId = body.razorpay_order_id;
  const paymentId = body.razorpay_payment_id;
  const signature = body.razorpay_signature;

  if (!orderId || !paymentId || !signature) {
    return Response.json(
      { error: "Missing payment details." },
      { status: 400 }
    );
  }

  if (!verifyPaymentSignature({ orderId, paymentId, signature })) {
    console.error(
      `[verify-payment] Signature mismatch for order=${orderId} payment=${paymentId} — not marking as paid.`
    );
    return Response.json(
      { error: "We could not verify that payment." },
      { status: 400 }
    );
  }

  // The signature proves the pair came from Razorpay; it does not prove the
  // payment actually went through. Ask Razorpay directly before saying so.
  const razorpay = getRazorpay();
  if (!razorpay) {
    return Response.json({ error: "Payment is not configured." }, { status: 503 });
  }

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    const settled = payment.status === "captured" || payment.status === "authorized";
    if (payment.order_id !== orderId || !settled) {
      console.error(
        `[verify-payment] Razorpay disagrees — payment=${paymentId} ` +
          `status=${payment.status} order=${payment.order_id} expected=${orderId}`
      );
      return Response.json(
        { error: "That payment has not completed." },
        { status: 400 }
      );
    }

    // The address, engraving and order number were written onto the order at
    // creation, so read them back from there rather than trusting the browser
    // to send them again after payment.
    const order = await razorpay.orders.fetch(orderId);
    const notes = (order.notes ?? {}) as Record<string, string>;
    const orderNumber = notes.order_number ?? String(order.receipt ?? orderId);

    console.log(
      `[verify-payment] Paid — ${orderNumber} order=${orderId} payment=${paymentId} ` +
        `${payment.currency} ${Number(payment.amount) / 100} status=${payment.status}`
    );

    // The workshop has no admin screen, so this email is how it learns the
    // order exists. It is deliberately awaited — the confirmation page should
    // not claim success before the notification has at least been attempted —
    // but it can never fail the request: the customer has already paid, and
    // sendOrderEmail logs the full order rather than throwing.
    const emailed = await sendOrderEmail({
      orderNumber,
      items: (notes.items ?? "").split("; ").filter(Boolean),
      catalogueTotalUsd: Number(notes.catalogue_usd ?? 0),
      chargedAmount: Number(payment.amount) / 100,
      chargedCurrency: payment.currency,
      customer: {
        name: notes.customer ?? "",
        email: notes.email ?? "",
        phone: notes.phone ?? "",
      },
      address: notes.address ?? "",
      engraving: notes.engraving === "—" ? "" : (notes.engraving ?? ""),
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
    });

    return Response.json({ ok: true, orderNumber, orderId, paymentId, emailed });
  } catch (err) {
    console.error(
      "[verify-payment] Could not fetch the payment — " + describeRazorpayError(err)
    );
    return Response.json(
      { error: "We could not confirm that payment. Please contact us." },
      { status: 502 }
    );
  }
}
