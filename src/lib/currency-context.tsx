"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BASE_CURRENCY,
  convert,
  countryFromLocale,
  currencyForCountry,
  formatMoney,
} from "@/lib/currency";

export type CurrencyMode = "usd" | "local";

interface CurrencyContextValue {
  /** Active display currency. */
  currency: string;
  /** The visitor's local currency, whether or not it is currently shown. */
  localCurrency: string;
  mode: CurrencyMode;
  setMode: (mode: CurrencyMode) => void;
  /** True when there is a genuine choice to offer — i.e. show the switch. */
  canChoose: boolean;
  /** True when the figures shown are estimates rather than the exact charge. */
  approximate: boolean;
  format: (usd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const COUNTRY_KEY = "isvena-country";
const MODE_KEY = "isvena-currency-mode";
const ENABLED = process.env.NEXT_PUBLIC_LOCAL_PRICING === "on";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Both start neutral so the first client render matches the server HTML;
  // the real values are resolved after mount.
  const [localCurrency, setLocalCurrency] = useState(BASE_CURRENCY);
  const [mode, setModeState] = useState<CurrencyMode>("local");

  useEffect(() => {
    if (!ENABLED) return;

    const stored = window.localStorage.getItem(MODE_KEY);
    if (stored === "usd" || stored === "local") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModeState(stored);
    }

    const apply = (country: string | null) => {
      // Falls back to the browser's locale when the server sends no country,
      // which is the usual case without a GeoIP module in front of the app.
      const resolved = country ?? countryFromLocale(navigator.language);
      setLocalCurrency(currencyForCountry(resolved));
    };

    const cached = window.sessionStorage.getItem(COUNTRY_KEY);
    if (cached) {
      apply(cached);
      return;
    }

    let cancelled = false;
    fetch("/api/geo")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.country) window.sessionStorage.setItem(COUNTRY_KEY, data.country);
        apply(data?.country ?? null);
      })
      .catch(() => {
        if (!cancelled) apply(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setMode = useCallback((next: CurrencyMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(MODE_KEY, next);
    } catch {
      // Private browsing with storage denied — the choice just won't persist.
    }
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    const canChoose = ENABLED && localCurrency !== BASE_CURRENCY;
    const currency = canChoose && mode === "local" ? localCurrency : BASE_CURRENCY;
    return {
      currency,
      localCurrency,
      mode,
      setMode,
      canChoose,
      approximate: currency !== BASE_CURRENCY,
      format: (usd: number) => formatMoney(convert(usd, currency), currency),
    };
  }, [localCurrency, mode, setMode]);

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
      localCurrency: BASE_CURRENCY,
      mode: "usd",
      setMode: () => {},
      canChoose: false,
      approximate: false,
      format: (usd: number) => formatMoney(usd, BASE_CURRENCY),
    };
  }
  return ctx;
}
