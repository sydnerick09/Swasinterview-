// Dynamic country pricing. The application fee is derived from the selected country.
// This is the single source of truth — the UI must never allow manual editing of the fee.

export const DEFAULT_FEE = 63; // "All other countries"

export const COUNTRY_FEES: Record<string, number> = {
  "United States": 83,
  "United Kingdom": 76,
  Australia: 92,
  China: 170,
  Kenya: 43,
  Uganda: 32,
  Tanzania: 16,
  Nigeria: 87,
  Somalia: 2,
  Burundi: 19,
  England: 29,
};

/**
 * Returns the application fee (USD) for a given country.
 * Falls back to the default fee for any country not explicitly listed.
 */
export function getApplicationFee(country: string | undefined | null): number {
  if (!country) return DEFAULT_FEE;
  return COUNTRY_FEES[country] ?? DEFAULT_FEE;
}

/** Formats a USD amount for display, e.g. `$43 USD`. */
export function formatFee(amount: number): string {
  return `$${amount} USD`;
}
