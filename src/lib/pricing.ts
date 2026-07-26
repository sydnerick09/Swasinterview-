// Dynamic country pricing. The application fee is derived from the selected country
// and displayed/charged in Kenyan Shillings (KES). The USD figures below are the
// canonical base; every KES amount is converted dynamically from them using the
// configurable exchange rate, so updating the rate updates the whole app.
// The UI must never allow manual editing of the fee.

export const CURRENCY = "KES";

// USD -> KES exchange rate. Configurable at deploy time via NEXT_PUBLIC_USD_TO_KES.
export const USD_TO_KES = Number(process.env.NEXT_PUBLIC_USD_TO_KES) || 130;

const DEFAULT_FEE_USD = 63; // "All other countries"

const COUNTRY_FEES_USD: Record<string, number> = {
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

/** Convert a USD amount to KES, rounded to the nearest 10 shillings for tidy figures. */
export function usdToKes(usd: number): number {
  return Math.round((usd * USD_TO_KES) / 10) * 10;
}

// Country fee table, dynamically converted to KES.
export const DEFAULT_FEE = usdToKes(DEFAULT_FEE_USD);

export const COUNTRY_FEES: Record<string, number> = Object.fromEntries(
  Object.entries(COUNTRY_FEES_USD).map(([country, usd]) => [country, usdToKes(usd)]),
);

/**
 * Returns the application fee (KES) for a given country.
 * Falls back to the default fee for any country not explicitly listed.
 */
export function getApplicationFee(country: string | undefined | null): number {
  if (!country) return DEFAULT_FEE;
  return COUNTRY_FEES[country] ?? DEFAULT_FEE;
}

/** Formats a KES amount for display, e.g. `KES 5,590`. */
export function formatFee(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}
