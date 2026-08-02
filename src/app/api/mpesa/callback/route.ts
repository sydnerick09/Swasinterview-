import { NextResponse } from "next/server";

// Safaricom STK Push result callback endpoint.
//
// Safaricom POSTs the outcome of every STK Push here. Because this deployment has no
// server-side database (payment state lives in the applicant's browser), we cannot
// persist the callback — the client confirms the result via the STK Push Query
// (/api/mpesa/status) instead. This handler validates the payload, logs it for
// observability, and returns the acknowledgement Safaricom expects.
//
// Security: set DARAJA_CALLBACK_TOKEN and include it as ?token=... in DARAJA_CALLBACK_URL
// so only requests carrying the secret token are accepted.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACK = { ResultCode: 0, ResultDesc: "Accepted" };

export async function POST(req: Request) {
  const requiredToken = process.env.DARAJA_CALLBACK_TOKEN;
  if (requiredToken) {
    const token = new URL(req.url).searchParams.get("token");
    if (token !== requiredToken) {
      console.warn("[mpesa][callback] rejected: invalid or missing token");
      // Still return 200 with ack shape so Safaricom does not retry indefinitely,
      // but do not process the (untrusted) payload.
      return NextResponse.json(ACK);
    }
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    console.error("[mpesa][callback] invalid JSON body");
    return NextResponse.json(ACK);
  }

  try {
    const stk = (payload as { Body?: { stkCallback?: Record<string, unknown> } })?.Body?.stkCallback;
    if (stk) {
      const meta = (stk.CallbackMetadata as { Item?: { Name: string; Value?: unknown }[] })?.Item ?? [];
      const get = (name: string) => meta.find((i) => i.Name === name)?.Value;
      console.info("[mpesa][callback]", {
        merchantRequestId: stk.MerchantRequestID,
        checkoutRequestId: stk.CheckoutRequestID,
        resultCode: stk.ResultCode,
        resultDesc: stk.ResultDesc,
        mpesaReceipt: get("MpesaReceiptNumber"),
        amount: get("Amount"),
        phone: get("PhoneNumber"),
      });
    } else {
      console.warn("[mpesa][callback] unexpected payload shape");
    }
  } catch (e) {
    console.error("[mpesa][callback] processing error", e);
  }

  return NextResponse.json(ACK);
}
