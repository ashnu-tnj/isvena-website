import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

/**
 * Order notifications.
 *
 * There is no database and no admin screen, so this email *is* how the
 * workshop learns an order exists. Everything needed to make and despatch
 * the piece has to be in it, because the alternative is opening the payment
 * gateway's dashboard and reading the order's tags by hand.
 *
 * Sent over plain SMTP against the existing info@isvena.com mailbox (Titan
 * Mail), rather than a separate provider account. The original attempt at
 * this failed silently with no useful reason — the actual cause turned out
 * to be Titan's "third-party app access" setting being off, which is
 * exactly the class of failure a plain SMTP AUTH rejection is bad at
 * reporting. That is now enabled; the error handling below also logs every
 * field nodemailer gives back (code, SMTP response text) rather than just
 * the message, so a future auth or delivery problem is diagnosable from the
 * log alone rather than requiring a fresh round of guessing.
 */
let cached: Transporter | null | undefined;

function getTransport(): Transporter | null {
  if (cached !== undefined) return cached;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    const missing = [
      !host && "SMTP_HOST",
      !user && "SMTP_USER",
      !pass && "SMTP_PASS",
    ].filter(Boolean);
    console.error(
      `[mail] ${missing.join(", ")} not set — order emails will not be sent. ` +
        "Order details are written to this log instead, so nothing is lost; " +
        "see SETUP.md section 8."
    );
    cached = null;
    return cached;
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  cached = nodemailer.createTransport({
    host,
    port,
    // 465 is implicit TLS; 587 starts plain and upgrades via STARTTLS.
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465,
    auth: { user, pass },
  });
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
 * nodemailer's rejection is a plain Error by type, but SMTP transports
 * attach extra fields (code, the SMTP server's own response line, the
 * command that triggered it) that `.message` alone drops. Those extra
 * fields are exactly what would have named the "third-party app access"
 * setting as the cause the first time, instead of a bare "auth failed".
 */
function describeSmtpError(err: unknown): string {
  const e = err as {
    message?: string;
    code?: string;
    responseCode?: number;
    response?: string;
    command?: string;
  };
  return (
    `code=${e.code ?? "?"} responseCode=${e.responseCode ?? "?"} ` +
    `command=${e.command ?? "?"}: ${e.response ?? e.message ?? String(err)}`
  );
}

/**
 * Send the notification. Never throws and never rejects.
 *
 * The customer has already paid by the time this runs, so a mail server
 * having a bad afternoon must not turn a successful payment into a failure
 * on their screen. A send that fails is logged in full — the order details
 * go to the log, where they can be recovered.
 */
export async function sendOrderEmail(order: OrderEmail): Promise<boolean> {
  const transport = getTransport();
  const to = process.env.ORDER_EMAIL_TO ?? "info@isvena.com";

  if (!transport) {
    console.error(`[mail] NOT SENT — order details follow:\n${plainText(order)}`);
    return false;
  }

  try {
    await transport.sendMail({
      to,
      from: process.env.ORDER_EMAIL_FROM ?? process.env.SMTP_USER,
      // Replying to the notification reaches the customer, which is what you
      // want when you need to ask them something about the order.
      replyTo: order.customer.email,
      subject: `Order ${order.orderNumber} — ${order.items.length} piece${
        order.items.length === 1 ? "" : "s"
      }`,
      text: plainText(order),
      html: html(order),
    });
    console.log(`[mail] Order ${order.orderNumber} sent to ${to}.`);
    return true;
  } catch (err) {
    console.error(
      `[mail] Could not send order ${order.orderNumber} to ${to} — ` +
        `${describeSmtpError(err)}\nOrder details follow:\n${plainText(order)}`
    );
    return false;
  }
}
