// Paystack client-side configuration.
//
// - The PUBLIC key (pk_...) is safe to expose in the browser and is read from
//   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY.
// - The SECRET key (sk_...) must NEVER be referenced here or anywhere client-side.
//   It lives only in PAYSTACK_SECRET_KEY (server env) and is used by the verify route.

export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";

// Currency to charge in. Your Paystack account must have this currency enabled.
// Application fees are displayed and charged in Kenyan Shillings by default.
export const PAYSTACK_CURRENCY = process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY ?? "KES";

export const PAYSTACK_SCRIPT_SRC = "https://js.paystack.co/v1/inline.js";

export function isPaystackConfigured(): boolean {
  return PAYSTACK_PUBLIC_KEY.startsWith("pk_");
}

/** Convert a major-unit amount (e.g. 43 USD) to Paystack's smallest unit (cents/kobo). */
export function toSubunit(amount: number): number {
  return Math.round(amount * 100);
}

/** Build a unique, Paystack-safe transaction reference for an application. */
export function buildReference(applicationId: string | undefined): string {
  const base = (applicationId ?? "SWT").replace(/[^a-zA-Z0-9._-]/g, "");
  return `${base}-${Date.now()}`;
}

export interface VerifyResult {
  success: boolean;
  reference?: string;
  amount?: number;
  currency?: string;
  channel?: string;
  paidAt?: string;
  message?: string;
}

/** Ask our server to verify a transaction reference with Paystack (uses the secret key). */
export async function verifyTransaction(reference: string): Promise<VerifyResult> {
  const res = await fetch("/api/paystack/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reference }),
  });
  return (await res.json()) as VerifyResult;
}
