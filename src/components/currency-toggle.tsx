"use client";

import { useCurrency } from "@/lib/currency-context";

/**
 * Lets the visitor price the collection in USD or in their own currency.
 *
 * Renders nothing until a local currency is actually known and differs from
 * USD — a switch offering "USD or USD" is just noise, and it would also
 * appear (then shift the layout) on every US visit.
 */
export default function CurrencyToggle({
  className = "",
}: {
  className?: string;
}) {
  const { mode, setMode, localCurrency, canChoose } = useCurrency();

  if (!canChoose) return null;

  const options = [
    { value: "usd" as const, label: "USD" },
    { value: "local" as const, label: localCurrency },
  ];

  return (
    <div
      className={`flex items-center rounded-full border hairline p-0.5 ${className}`}
      role="group"
      aria-label="Display currency"
    >
      {options.map((option) => {
        const active = mode === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setMode(option.value)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 text-[0.62rem] uppercase tracking-widest-plus transition-colors ${
              active
                ? "bg-ink text-cream"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
