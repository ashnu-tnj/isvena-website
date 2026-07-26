"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BASE_CURRENCY,
  convert,
  currencyForCountry,
  formatMoney,
  isApproximate,
} from "@/lib/currency";

interface CurrencyContextValue {
  /** Active display currency; always USD until the visitor's country is known. */
  currency: string;
  /** True once a non-USD currency is in use, i.e. figures are estimates. */
  approximate: boolean;
  /** Render a USD catalogue price in the visitor's currency. */
  format: (usd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const STORAGE_KEY = "isvena-country";
const ENABLED = process.env.NEXT_PUBLIC_LOCAL_PRICING === "on";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Starts as USD on both server and client so the markup matches on
  // hydration; the local currency is swapped in afterwards.
  const [currency, setCurrency] = useState(BASE_CURRENCY);

  useEffect(() => {
    if (!ENABLED) return;

    const cached = window.sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      // Deliberate: the first render must be USD to match the server HTML,
      // so the switch can only happen after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrency(currencyForCountry(cached));
      return;
    }

    let cancelled = false;
    fetch("/api/geo")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.country) return;
        window.sessionStorage.setItem(STORAGE_KEY, data.country);
        setCurrency(currencyForCountry(data.country));
      })
      .catch(() => {
        // Geo lookup is best-effort — prices simply stay in USD.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      approximate: isApproximate(currency),
      format: (usd: number) => formatMoney(convert(usd, currency), currency),
    }),
    [currency]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  // Usable outside the provider (e.g. in isolated tests) — falls back to USD.
  if (!ctx) {
    return {
      currency: BASE_CURRENCY,
      approximate: false,
      format: (usd: number) => formatMoney(usd, BASE_CURRENCY),
    };
  }
  return ctx;
}
