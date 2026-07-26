// Per-country pricing. Each country resolves to an { amount, currency } pair that is
// both displayed to the applicant and charged via Paystack — display and charge always match.
//
// Currency rules:
//   Kenya                  -> KES 200 (fixed)
//   Uganda                 -> UGX (≈ KES 500 equivalent)
//   Tanzania               -> TZS (≈ KES 400 equivalent)
//   England / United Kingdom -> KES 7,000
//   Burundi                -> USD
//   Every other country    -> USD
// No country other than Kenya and England is ever shown in KES.

export type Currency = "KES" | "UGX" | "TZS" | "USD";

export interface CountryPrice {
  currency: Currency;
  amount: number;
}

// KES -> local-currency conversion rates (configurable at deploy time). Used only to
// derive the Uganda/Tanzania local amounts from their KES equivalents.
const KES_TO_UGX = Number(process.env.NEXT_PUBLIC_KES_TO_UGX) || 29;
const KES_TO_TZS = Number(process.env.NEXT_PUBLIC_KES_TO_TZS) || 20;

const UGANDA_KES_EQUIVALENT = 500;
const TANZANIA_KES_EQUIVALENT = 400;

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

export const DEFAULT_PRICE: CountryPrice = { currency: "USD", amount: 63 };

// Explicit per-country prices. Countries not listed fall back to DEFAULT_PRICE (USD).
export const COUNTRY_PRICING: Record<string, CountryPrice> = {
  Kenya: { currency: "KES", amount: 200 },
  England: { currency: "KES", amount: 7000 },
  "United Kingdom": { currency: "KES", amount: 7000 },
  Uganda: { currency: "UGX", amount: roundTo(UGANDA_KES_EQUIVALENT * KES_TO_UGX, 500) },
  Tanzania: { currency: "TZS", amount: roundTo(TANZANIA_KES_EQUIVALENT * KES_TO_TZS, 500) },
  Burundi: { currency: "USD", amount: 19 },
  "United States": { currency: "USD", amount: 83 },
  China: { currency: "USD", amount: 170 },
  Nigeria: { currency: "USD", amount: 87 },
  Australia: { currency: "USD", amount: 92 },
  Somalia: { currency: "USD", amount: 2 },
};

/** Resolve the { amount, currency } for a country, defaulting to USD. */
export function getCountryPrice(country?: string | null): CountryPrice {
  if (!country) return DEFAULT_PRICE;
  return COUNTRY_PRICING[country] ?? DEFAULT_PRICE;
}

/** The fee amount for a country (in that country's currency). */
export function getApplicationFee(country?: string | null): number {
  return getCountryPrice(country).amount;
}

/** The currency a country is charged/displayed in. */
export function getApplicationCurrency(country?: string | null): Currency {
  return getCountryPrice(country).currency;
}

/** Format an amount in a given currency, e.g. `KES 200`, `UGX 14,500`, `$63`. */
export function formatMoney(amount: number, currency: string): string {
  const value = amount.toLocaleString("en-US");
  return currency === "USD" ? `$${value}` : `${currency} ${value}`;
}

/** Format a country's fee, e.g. `KES 200` for Kenya or `$63` for the default. */
export function formatFeeForCountry(country?: string | null): string {
  const price = getCountryPrice(country);
  return formatMoney(price.amount, price.currency);
}

/** Format a stored payment amount + currency. */
export function formatFee(amount: number, currency: string = "USD"): string {
  return formatMoney(amount, currency);
}

// Rows for the public pricing table (special countries + the default fallback).
export const PRICING_TABLE: { label: string; price: CountryPrice }[] = [
  { label: "Kenya", price: COUNTRY_PRICING.Kenya },
  { label: "Uganda", price: COUNTRY_PRICING.Uganda },
  { label: "Tanzania", price: COUNTRY_PRICING.Tanzania },
  { label: "England (United Kingdom)", price: COUNTRY_PRICING.England },
  { label: "Burundi", price: COUNTRY_PRICING.Burundi },
  { label: "United States", price: COUNTRY_PRICING["United States"] },
  { label: "China", price: COUNTRY_PRICING.China },
  { label: "Nigeria", price: COUNTRY_PRICING.Nigeria },
  { label: "All other countries", price: DEFAULT_PRICE },
];
