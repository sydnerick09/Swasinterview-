// Safaricom Daraja — Lipa na M-Pesa Online (STK Push / C2B) server-side helper.
//
// SERVER ONLY. This module reads secret credentials from the environment and must
// never be imported into client components. It implements exactly three operations:
//   1. OAuth access-token generation
//   2. STK Push (Lipa na M-Pesa Online) request
//   3. STK Push Query (to confirm the result of a push)
// It deliberately does NOT implement B2C, B2B, Account Balance, Reversal or the
// Transaction Status API.

import "server-only";

type DarajaEnv = "production" | "sandbox";

const ENV: DarajaEnv = process.env.DARAJA_ENV === "sandbox" ? "sandbox" : "production";

const BASE_URL =
  ENV === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";

// Paybill ("CustomerPayBillOnline") or Till/Buy Goods ("CustomerBuyGoodsOnline").
const TRANSACTION_TYPE =
  process.env.DARAJA_TRANSACTION_TYPE === "CustomerBuyGoodsOnline"
    ? "CustomerBuyGoodsOnline"
    : "CustomerPayBillOnline";

function credentials() {
  return {
    consumerKey: process.env.DARAJA_CONSUMER_KEY ?? "",
    consumerSecret: process.env.DARAJA_CONSUMER_SECRET ?? "",
    shortcode: process.env.DARAJA_SHORTCODE ?? "",
    passkey: process.env.DARAJA_PASSKEY ?? "",
    callbackUrl: process.env.DARAJA_CALLBACK_URL ?? "",
  };
}

/** True only when every credential required to initiate a push is present. */
export function isMpesaConfigured(): boolean {
  const c = credentials();
  return Boolean(c.consumerKey && c.consumerSecret && c.shortcode && c.passkey && c.callbackUrl);
}

export class MpesaError extends Error {
  constructor(
    message: string,
    public readonly status = 502,
    public readonly detail?: unknown,
  ) {
    super(message);
    this.name = "MpesaError";
  }
}

/** Format the current time as YYYYMMDDHHmmss (used for the STK password + Timestamp). */
function timestamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}` +
    `${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
  );
}

function stkPassword(shortcode: string, passkey: string, ts: string): string {
  return Buffer.from(`${shortcode}${passkey}${ts}`).toString("base64");
}

/**
 * Normalize a Kenyan phone number to the Safaricom MSISDN format 2547XXXXXXXX / 2541XXXXXXXX.
 * Returns null if it is not a valid Kenyan mobile number.
 */
export function normalizeKenyanPhone(input: string): string | null {
  const digits = (input || "").replace(/\D/g, "");
  let msisdn = digits;
  if (msisdn.startsWith("0")) msisdn = "254" + msisdn.slice(1);
  else if (msisdn.startsWith("7") || msisdn.startsWith("1")) msisdn = "254" + msisdn;
  else if (msisdn.startsWith("254")) {
    /* already ok */
  } else if (msisdn.startsWith("2540")) msisdn = "254" + msisdn.slice(4);
  else return null;
  // 254 + (7 or 1) + 8 digits = 12 digits total
  return /^254(7|1)\d{8}$/.test(msisdn) ? msisdn : null;
}

async function getAccessToken(): Promise<string> {
  const { consumerKey, consumerSecret } = credentials();
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store",
    });
  } catch (e) {
    throw new MpesaError("Could not reach Safaricom to obtain an access token.", 502, e);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.access_token) {
    throw new MpesaError("Failed to obtain M-Pesa access token (check consumer key/secret).", 502, data);
  }
  return data.access_token as string;
}

export interface StkPushResult {
  merchantRequestId: string;
  checkoutRequestId: string;
  customerMessage: string;
}

/** Initiate an STK Push. `amount` is whole KES; `phone` is any Kenyan format. */
export async function initiateStkPush(params: {
  phone: string;
  amount: number;
  accountReference: string;
  description: string;
}): Promise<StkPushResult> {
  if (!isMpesaConfigured()) throw new MpesaError("M-Pesa is not configured on the server.", 500);

  const msisdn = normalizeKenyanPhone(params.phone);
  if (!msisdn) throw new MpesaError("Enter a valid Safaricom / Kenyan phone number.", 400);

  const amount = Math.round(params.amount);
  if (!Number.isFinite(amount) || amount < 1) throw new MpesaError("Invalid amount.", 400);

  const { shortcode, passkey, callbackUrl } = credentials();
  const ts = timestamp();
  const token = await getAccessToken();

  const body = {
    BusinessShortCode: shortcode,
    Password: stkPassword(shortcode, passkey, ts),
    Timestamp: ts,
    TransactionType: TRANSACTION_TYPE,
    Amount: amount,
    PartyA: msisdn,
    PartyB: shortcode,
    PhoneNumber: msisdn,
    CallBackURL: callbackUrl,
    AccountReference: params.accountReference.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12) || "SWASTASK",
    TransactionDesc: params.description.slice(0, 13) || "Application",
  };

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch (e) {
    throw new MpesaError("Could not reach Safaricom to start the payment.", 502, e);
  }

  const data = await res.json().catch(() => ({}));
  // ResponseCode "0" means the push was accepted for processing.
  if (!res.ok || data?.ResponseCode !== "0") {
    throw new MpesaError(
      data?.errorMessage || data?.ResponseDescription || "Failed to initiate M-Pesa payment.",
      400,
      data,
    );
  }

  return {
    merchantRequestId: data.MerchantRequestID,
    checkoutRequestId: data.CheckoutRequestID,
    customerMessage: data.CustomerMessage ?? "A payment prompt has been sent to your phone.",
  };
}

export interface StkQueryResult {
  resultCode: string; // "0" = success
  resultDesc: string;
  status: "success" | "pending" | "failed";
}

/** Query the outcome of an STK Push by its CheckoutRequestID. */
export async function queryStkPush(checkoutRequestId: string): Promise<StkQueryResult> {
  if (!isMpesaConfigured()) throw new MpesaError("M-Pesa is not configured on the server.", 500);

  const { shortcode, passkey } = credentials();
  const ts = timestamp();
  const token = await getAccessToken();

  const body = {
    BusinessShortCode: shortcode,
    Password: stkPassword(shortcode, passkey, ts),
    Timestamp: ts,
    CheckoutRequestID: checkoutRequestId,
  };

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/mpesa/stkpushquery/v1/query`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch (e) {
    throw new MpesaError("Could not reach Safaricom to verify the payment.", 502, e);
  }

  const data = await res.json().catch(() => ({}));

  // While the customer is still being prompted, Safaricom returns errorCode 500.001.1001
  // ("transaction is being processed"). Treat that as still pending.
  if (data?.errorCode === "500.001.1001") {
    return { resultCode: "", resultDesc: "Payment is being processed.", status: "pending" };
  }
  if (!res.ok || data?.ResponseCode === undefined) {
    throw new MpesaError(
      data?.errorMessage || data?.ResponseDescription || "Could not verify the payment.",
      400,
      data,
    );
  }

  const resultCode = String(data.ResultCode ?? "");
  return {
    resultCode,
    resultDesc: data.ResultDesc ?? "",
    status: resultCode === "0" ? "success" : "failed",
  };
}
