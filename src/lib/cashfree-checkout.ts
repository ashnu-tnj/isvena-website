/**
 * The browser half of Cashfree's Drop-in Checkout.
 *
 * A hosted script rather than a package, so it is loaded on demand — the tag
 * is injected the first time someone reaches the pay button, not on every
 * page of the site.
 */
const SCRIPT_SRC = "https://sdk.cashfree.com/js/v3/cashfree.js";

export interface CashfreeCheckoutResult {
  // Present on cancellation, a declined payment, or the modal being closed
  // before completion. Its exact shape isn't documented in a way worth
  // trusting, so it is only ever used for a soft "something didn't finish"
  // signal — never for deciding whether the order was actually paid. That
  // decision is always made server-side, against Cashfree's own API.
  error?: { message?: string; code?: string };
  paymentDetails?: unknown;
}

export interface CashfreeInstance {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: "_modal" | "_self" | "_blank";
  }) => Promise<CashfreeCheckoutResult>;
}

declare global {
  interface Window {
    Cashfree?: (options: { mode: "sandbox" | "production" }) => CashfreeInstance;
  }
}

let loading: Promise<void> | null = null;

/** Resolves once `window.Cashfree` exists; rejects if the script won't load. */
export function loadCashfreeCheckout(): Promise<void> {
  if (typeof window !== "undefined" && window.Cashfree) return Promise.resolve();
  // Share one promise, so a double click doesn't inject the tag twice.
  if (loading) return loading;

  loading = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => {
      // Let a later attempt retry rather than caching the failure forever.
      loading = null;
      reject(new Error("Cashfree checkout script failed to load"));
    });
    if (!existing) {
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  });
  return loading;
}
