import { NextRequest } from "next/server";
import {
  describeRazorpayError,
  getRazorpay,
  verifyPaymentSignature,
} from "@/lib/razorpay";

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

    // No database, so this line is the order record. Razorpay's dashboard
    // holds the rest: the notes on the order carry the address and engraving.
    console.log(
      `[verify-payment] Paid — order=${orderId} payment=${paymentId} ` +
        `${payment.currency} ${Number(payment.amount) / 100} status=${payment.status}`
    );
    return Response.json({ ok: true, orderId, paymentId });
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
