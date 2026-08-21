import { describeCashfreeError, getCashfree } from "@/lib/cashfree";
import { sendOrderEmail } from "@/lib/mailer";

export type ConfirmationStatus = "paid" | "pending" | "failed" | "error";

export interface ConfirmationResult {
  status: ConfirmationStatus;
  emailed: boolean;
}

/**
 * Every order id this process has already confirmed paid and emailed.
 *
 * There is no database, so this is the only thing standing between a
 * customer getting two identical order emails and getting one. Two
 * different paths can both land here for the same order — the webhook and
 * the browser returning to the success page — and Cashfree itself can
 * retry a webhook delivery, so without this the same order could email
 * two or three times.
 *
 * Deliberately in-memory: it resets on a deploy or restart, at which point
 * a very unlucky, very precisely-timed retry could in theory cause one
 * duplicate email. That is a nuisance, not a lost order — the order and its
 * tags still exist on Cashfree regardless — so it is not worth a database
 * for. Capped so a long-running process can't grow this without bound.
 */
const confirmed = new Set<string>();
const CONFIRMED_CAP = 5000;

/**
 * Confirm an order is genuinely paid, and email it exactly once.
 *
 * Called from two places — the Cashfree webhook (the reliable path, works
 * even if the customer's browser never comes back) and the success page
 * (an immediate check for the common case, so the confirmation email is not
 * waiting on a webhook that usually arrives within seconds but is not
 * guaranteed to). Nothing here trusts anything the browser reported; both
 * paths land here and re-fetch the true state from Cashfree.
 */
export async function confirmOrderPaid(orderId: string): Promise<ConfirmationResult> {
  if (confirmed.has(orderId)) return { status: "paid", emailed: false };

  const cashfree = getCashfree();
  if (!cashfree) return { status: "error", emailed: false };

  try {
    const [orderRes, paymentsRes] = await Promise.all([
      cashfree.PGFetchOrder(orderId),
      cashfree.PGOrderFetchPayments(orderId),
    ]);
    const order = orderRes.data;
    const payments = paymentsRes.data ?? [];

    const successful = payments.find((p) => p.payment_status === "SUCCESS");
    if (!successful) {
      const terminal = ["EXPIRED", "TERMINATED"].includes(order.order_status ?? "");
      const anyFailed = payments.some((p) =>
        ["FAILED", "USER_DROPPED", "VOID", "CANCELLED"].includes(p.payment_status ?? "")
      );
      return { status: terminal || anyFailed ? "failed" : "pending", emailed: false };
    }

    // Re-confirming an already-confirmed order between the fetch above and
    // here is possible under concurrent requests; harmless, since the send
    // below is idempotent-in-effect via this same guard on the way out.
    if (confirmed.has(orderId)) return { status: "paid", emailed: false };

    const tags = order.order_tags ?? {};
    const emailed = await sendOrderEmail({
      orderNumber: orderId,
      items: (tags.items ?? "").split("; ").filter(Boolean),
      catalogueTotalUsd: Number(tags.catalogue_usd ?? 0),
      chargedAmount: Number(successful.payment_amount ?? order.order_amount ?? 0),
      chargedCurrency: successful.payment_currency ?? order.order_currency ?? "INR",
      customer: {
        name: tags.customer ?? "",
        email: tags.email ?? "",
        phone: tags.phone ?? "",
      },
      address: tags.address ?? "",
      engraving: tags.engraving === "—" ? "" : (tags.engraving ?? ""),
      gatewayOrderId: orderId,
      gatewayPaymentId: String(successful.cf_payment_id ?? ""),
    });

    confirmed.add(orderId);
    if (confirmed.size > CONFIRMED_CAP) {
      // Oldest-first eviction — Set preserves insertion order.
      confirmed.delete(confirmed.values().next().value as string);
    }

    return { status: "paid", emailed };
  } catch (err) {
    console.error(
      `[order-confirmation] Could not confirm ${orderId} — ` + describeCashfreeError(err)
    );
    return { status: "error", emailed: false };
  }
}
