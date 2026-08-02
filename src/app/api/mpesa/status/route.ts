import { NextResponse } from "next/server";
import { queryStkPush, isMpesaConfigured, MpesaError } from "@/lib/mpesa";

// Verify the outcome of an STK Push using Safaricom's STK Push Query API.
// This is the authoritative source of truth the client uses before marking an
// application as paid (the async callback is only an acknowledgement here).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isMpesaConfigured()) {
    return NextResponse.json(
      { success: false, message: "M-Pesa payments are not configured yet." },
      { status: 503 },
    );
  }

  let checkoutRequestId = "";
  try {
    const body = await req.json();
    checkoutRequestId = String(body?.checkoutRequestId ?? "").trim();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  if (!checkoutRequestId) {
    return NextResponse.json({ success: false, message: "Missing checkoutRequestId." }, { status: 400 });
  }

  try {
    const result = await queryStkPush(checkoutRequestId);
    return NextResponse.json({
      success: true,
      status: result.status, // "success" | "pending" | "failed"
      resultCode: result.resultCode,
      resultDesc: result.resultDesc,
    });
  } catch (err) {
    const status = err instanceof MpesaError ? err.status : 502;
    const message = err instanceof MpesaError ? err.message : "Could not verify the payment.";
    console.error("[mpesa][status] error", message);
    return NextResponse.json({ success: false, message }, { status });
  }
}
