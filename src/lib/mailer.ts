import { Resend } from "resend";

/**
 * Order notifications.
 *
 * There is no database and no admin screen, so this email *is* how the
 * workshop learns an order exists. Everything needed to make and despatch
 * the piece has to be in it, because the alternative is opening the payment
 * gateway's dashboard and reading the order's tags by hand.
 *
 * Sent through Resend's API rather than raw SMTP. SMTP was tried first, but
 * a protocol whose only failure signal is a TCP connection going quiet
 * — no structured error, nothing to grep for beyond "it didn't arrive" — is
 * a bad foundation for the one notification a no-database shop depends on.
 * An API call either succeeds with a message id or fails with a reason in
 * the response body, in both cases without needing to guess at a mail
 * server's specific TLS/port/auth quirks.
 */
let cached: Resend | null | undefined;

function getClient(): Resend | null {
  if (cached !== undefined) return cached;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error(
      "[mail] RESEND_API_KEY not set — order emails will not be sent. " +
        "Order details are written to this log instead, so nothing is lost; " +
        "see SETUP.md section 8."
    );
    cached = null;
    return cached;
  }

  cached = new Resend(key);
  return cached;
}

export interface OrderEmail {
  orderNumber: string;
  items: string[];
  catalogueTotalUsd: number;
  chargedAmount: number;
  chargedCurrency: string;
  customer: { name: string; email: string; phone: string };
  address: string;
  engraving: string;
  gatewayOrderId: string;
  gatewayPaymentId: string;
}

function plainText(o: OrderEmail): string {
  return [
    `ORDER ${o.orderNumber}`,
    "",
    `Placed        ${new Date().toUTCString()}`,
    `Paid          ${o.chargedCurrency} ${o.chargedAmount.toLocaleString()}`,
    `Catalogue     USD ${o.catalogueTotalUsd.toLocaleString()}`,
    "",
    "PIECES",
    ...o.items.map((i) => `  · ${i}`),
    "",
    `ENGRAVING     ${o.engraving || "— none —"}`,
    "",
    "SHIP TO",
    `  ${o.customer.name}`,
    `  ${o.address}`,
    `  ${o.customer.phone}`,
    `  ${o.customer.email}`,
    "",
    "PAYMENT GATEWAY",
    `  Payment  ${o.gatewayPaymentId}`,
    `  Order    ${o.gatewayOrderId}`,
    "",
    "Made to order — due to ship in 6–8 weeks.",
  ].join("\n");
}

function html(o: OrderEmail): string {
  const esc = (s: string) =>
    s.replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string
    );
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#8a7f76;white-space:nowrap;vertical-align:top">${esc(label)}</td>` +
    `<td style="padding:6px 0;color:#241d18">${value}</td></tr>`;

  return `<div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:640px;color:#241d18">
<h1 style="font-size:20px;margin:0 0 4px">Order ${esc(o.orderNumber)}</h1>
<p style="margin:0 0 24px;color:#8a7f76;font-size:14px">Paid — due to ship in 6–8 weeks.</p>
<table style="border-collapse:collapse;font-size:14px;width:100%">
${row("Pieces", o.items.map(esc).join("<br>"))}
${row("Engraving", o.engraving ? `<strong>${esc(o.engraving)}</strong>` : "<em>none</em>")}
${row("Paid", `<strong>${esc(o.chargedCurrency)} ${o.chargedAmount.toLocaleString()}</strong> (catalogue USD ${o.catalogueTotalUsd.toLocaleString()})`)}
</table>
<h2 style="font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:#8a7f76;margin:28px 0 8px">Ship to</h2>
<table style="border-collapse:collapse;font-size:14px;width:100%">
${row("Name", esc(o.customer.name))}
${row("Address", esc(o.address))}
${row("Phone", esc(o.customer.phone))}
${row("Email", `<a href="mailto:${esc(o.customer.email)}">${esc(o.customer.email)}</a>`)}
</table>
<h2 style="font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:#8a7f76;margin:28px 0 8px">Payment gateway</h2>
<table style="border-collapse:collapse;font-size:14px;width:100%">
${row("Payment", esc(o.gatewayPaymentId))}
${row("Order", esc(o.gatewayOrderId))}
</table>
</div>`;
}

/**
 * Send the notification. Never throws and never rejects.
 *
 * The customer has already paid by the time this runs, so a mail provider
 * having a bad afternoon must not turn a successful payment into a failure
 * on their screen. A send that fails is logged in full — the order details
 * go to the log, where they can be recovered.
 */
export async function sendOrderEmail(order: OrderEmail): Promise<boolean> {
  const resend = getClient();
  const to = process.env.ORDER_EMAIL_TO ?? "info@isvena.com";
  // resend.dev is Resend's own shared sandbox domain — it sends, but only
  // to the address that owns the API key, and marks every message as a test
  // send. Real delivery to info@isvena.com needs isvena.com verified in the
  // Resend dashboard (a couple of DNS records); ORDER_EMAIL_FROM then
  // becomes something like "Isvena <orders@isvena.com>".
  const from = process.env.ORDER_EMAIL_FROM ?? "Isvena <onboarding@resend.dev>";

  if (!resend) {
    console.error(`[mail] NOT SENT — order details follow:\n${plainText(order)}`);
    return false;
  }

  try {
    const { data, error } = await resend.emails.send({
      to,
      from,
      // Replying to the notification reaches the customer, which is what you
      // want when you need to ask them something about the order.
      replyTo: order.customer.email,
      subject: `Order ${order.orderNumber} — ${order.items.length} piece${
        order.items.length === 1 ? "" : "s"
      }`,
      text: plainText(order),
      html: html(order),
    });

    if (error) {
      console.error(
        `[mail] Resend rejected order ${order.orderNumber} to ${to} — ` +
          `${error.name}: ${error.message}\nOrder details follow:\n${plainText(order)}`
      );
      return false;
    }
    console.log(`[mail] Order ${order.orderNumber} sent to ${to} (id ${data?.id}).`);
    return true;
  } catch (err) {
    console.error(
      `[mail] Could not reach Resend for order ${order.orderNumber} to ${to}: ` +
        `${(err as Error).message}\nOrder details follow:\n${plainText(order)}`
    );
    return false;
  }
}
