import { NextResponse } from "next/server";

// Server-side Paystack verification. The secret key is read from PAYSTACK_SECRET_KEY
// (server env only) and is never sent to the browser. This endpoint confirms that a
// transaction reference genuinely succeeded before the client marks an application as paid.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let reference: string | undefined;
  try {
    const body = await req.json();
    reference = body?.reference;
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
  }

  if (!reference || typeof reference !== "string") {
    return NextResponse.json({ success: false, message: "Missing transaction reference" }, { status: 400 });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { success: false, message: "Payment is not configured on the server." },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
        cache: "no-store",
      },
    );
    const data = await res.json();

    if (!res.ok || !data?.status) {
      return NextResponse.json(
        { success: false, message: data?.message || "Verification failed" },
        { status: 400 },
      );
    }

    const tx = data.data;
    const success = tx?.status === "success";

    return NextResponse.json({
      success,
      reference: tx?.reference,
      amount: tx?.amount, // smallest unit
      currency: tx?.currency,
      channel: tx?.channel,
      paidAt: tx?.paid_at,
      message: success ? "Payment verified" : `Payment status: ${tx?.status ?? "unknown"}`,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the payment provider." },
      { status: 502 },
    );
  }
}
