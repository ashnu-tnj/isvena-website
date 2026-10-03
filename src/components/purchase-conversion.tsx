"use client";

import { useEffect } from "react";

const SEND_TO = "AW-18491382828/ghe0CN7q7Y4dEKy4sPFE";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Reports a completed purchase to Google Ads.
 *
 * Rendered only when the order is genuinely confirmed paid — the
 * confirmation page also renders for declined and abandoned payments, since
 * Cashfree's return_url comes back here whatever the outcome, and counting
 * those as conversions would quietly teach Google Ads to optimise for
 * people who don't buy.
 *
 * `transaction_id` is the real order number rather than blank: it is how
 * Google de-duplicates, so a customer refreshing this page — or returning to
 * it later — is counted once rather than once per view. The value is what
 * Cashfree actually charged, in the currency it charged, so bidding
 * optimises against real revenue instead of a placeholder.
 */
export default function PurchaseConversion({
  orderNumber,
  amount,
  currency,
}: {
  orderNumber: string;
  amount: number;
  currency: string;
}) {
  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    // Google de-duplicates server-side on transaction_id, so this guard is
    // only to avoid firing a redundant beacon on a reload in the same tab.
    const key = `isvena-conversion-${orderNumber}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // Private mode with storage denied — fall through and let Google's own
      // transaction_id de-duplication do the work.
    }

    window.gtag("event", "conversion", {
      send_to: SEND_TO,
      value: amount,
      currency,
      transaction_id: orderNumber,
    });
  }, [orderNumber, amount, currency]);

  return null;
}
