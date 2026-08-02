import { NextResponse } from "next/server";
import { initiateStkPush, isMpesaConfigured, normalizeKenyanPhone, MpesaError } from "@/lib/mpesa";
import { getKesChargeAmount } from "@/lib/pricing";

// Initiate a Lipa na M-Pesa Online (STK Push) payment.
// The amount is computed server-side from the country so it cannot be tampered with.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isMpesaConfigured()) {
    return NextResponse.json(
      { success: false, message: "M-Pesa payments are not configured yet." },
      { status: 503 },
    );
  }

  let body: { applicationId?: string; country?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const applicationId = String(body.applicationId ?? "").trim();
  const country = String(body.country ?? "").trim();
  const phone = normalizeKenyanPhone(String(body.phone ?? ""));

  if (!applicationId) {
    return NextResponse.json({ success: false, message: "Missing application reference." }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json(
      { success: false, message: "Enter a valid Safaricom / Kenyan phone number (e.g. 0712345678)." },
      { status: 400 },
    );
  }

  const amount = getKesChargeAmount(country);
  if (!amount || amount < 1) {
    return NextResponse.json({ success: false, message: "Could not determine the amount to charge." }, { status: 400 });
  }

  try {
    const result = await initiateStkPush({
      phone,
      amount,
      accountReference: applicationId,
      description: "SWASTASK fee",
    });
    console.info("[mpesa][stkpush] initiated", {
      applicationId,
      amount,
      checkoutRequestId: result.checkoutRequestId,
    });
    return NextResponse.json({
      success: true,
      amount,
      checkoutRequestId: result.checkoutRequestId,
      merchantRequestId: result.merchantRequestId,
      message: result.customerMessage,
    });
  } catch (err) {
    const status = err instanceof MpesaError ? err.status : 502;
    const message = err instanceof MpesaError ? err.message : "Payment could not be started.";
    console.error("[mpesa][stkpush] error", message, err instanceof MpesaError ? err.detail : err);
    return NextResponse.json({ success: false, message }, { status });
  }
}
