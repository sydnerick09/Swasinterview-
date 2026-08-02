"use client";

import { useEffect, useRef, useState } from "react";
import { Smartphone, Lock, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { formatFee, formatMoney, getKesChargeAmount, getCountryPrice } from "@/lib/pricing";
import { updateStatus } from "@/lib/storage/applications";
import { sendConfirmationEmail } from "@/lib/email";
import { uid } from "@/lib/utils";
import type { Application } from "@/lib/types";

// Set NEXT_PUBLIC_MPESA_ENABLED=true once the Daraja credentials are configured.
const MPESA_ENABLED = process.env.NEXT_PUBLIC_MPESA_ENABLED === "true";

const POLL_INTERVAL_MS = 4000;
const POLL_ATTEMPTS = 24; // ~96s

export function PaymentPanel({ app, onPaid }: { app: Application; onPaid: () => void }) {
  const { toast } = useToast();
  const country = app.account.country || app.personal.country;
  const price = getCountryPrice(country);
  const kes = getKesChargeAmount(country);
  const isKes = price.currency === "KES";

  const [phone, setPhone] = useState(
    app.payment.phone || app.account.phone || app.personal.phone || "",
  );
  const [stage, setStage] = useState<"idle" | "prompting" | "failed">("idle");
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  const cancelled = useRef(false);
  useEffect(() => {
    cancelled.current = false;
    return () => {
      cancelled.current = true;
    };
  }, []);

  // Persist a completed payment to the local application record.
  const markPaid = async (reference: string, method: string) => {
    const payment = {
      ...app.payment,
      paid: true,
      paidAt: new Date().toISOString(),
      transactionRef: reference,
      method,
      chargedKes: kes,
      phone,
    };
    updateStatus(app.id, "paid", { payment });
    await sendConfirmationEmail({ ...app, status: "paid", payment });
    toast("Payment received! Confirmation email sent.", "success");
    onPaid();
  };

  // Poll Safaricom (via our server) for the authoritative result of the push.
  const poll = async (checkoutRequestId: string) => {
    for (let i = 0; i < POLL_ATTEMPTS && !cancelled.current; i++) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      if (cancelled.current) return;
      try {
        const res = await fetch("/api/mpesa/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkoutRequestId }),
        });
        const data = await res.json();
        if (data.status === "success") {
          await markPaid(checkoutRequestId, "M-Pesa");
          return;
        }
        if (data.status === "failed") {
          setStage("failed");
          setMessage(data.resultDesc || "The payment was cancelled or failed. Please try again.");
          setProcessing(false);
          return;
        }
        // "pending" — keep waiting
      } catch {
        // transient error — keep waiting
      }
    }
    if (!cancelled.current) {
      setStage("failed");
      setMessage(
        "We didn't receive a confirmation in time. If you completed the payment, check your status again shortly — otherwise try once more.",
      );
      setProcessing(false);
    }
  };

  const payWithMpesa = async () => {
    setProcessing(true);
    setStage("idle");
    setMessage("");
    try {
      const res = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: app.applicationId, country, phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStage("failed");
        setMessage(data.message || "Could not start the M-Pesa payment.");
        setProcessing(false);
        return;
      }
      // Save the CheckoutRequestID so the payment can be verified/resumed.
      updateStatus(app.id, "submitted", {
        payment: { ...app.payment, checkoutRequestId: data.checkoutRequestId, phone, chargedKes: kes },
      });
      setStage("prompting");
      setMessage(data.message || "Check your phone and enter your M-Pesa PIN to complete payment.");
      poll(data.checkoutRequestId);
    } catch {
      setStage("failed");
      setMessage("Network error. Please try again.");
      setProcessing(false);
    }
  };

  const payDemo = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1000));
    await markPaid(uid("demo").toUpperCase(), "Demo (test)");
    setProcessing(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Payment action */}
      <div className="card p-6">
        <div className="mb-5 flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-brand-600" />
          <h3 className="text-lg font-semibold">Pay with M-Pesa</h3>
        </div>

        {!MPESA_ENABLED ? (
          <>
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                M-Pesa is not configured yet (<code>NEXT_PUBLIC_MPESA_ENABLED</code> is off). Using a
                demo payment so you can test the flow.
              </span>
            </div>
            <Button className="mt-5 w-full" size="lg" loading={processing} onClick={payDemo}>
              <Lock className="h-4 w-4" /> Pay {formatMoney(kes, "KES")} (Demo)
            </Button>
          </>
        ) : stage === "prompting" ? (
          <div className="rounded-xl border border-[var(--border)] p-5 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-600" />
            <p className="mt-3 font-medium">STK push sent to {phone}</p>
            <p className="mt-1 text-sm text-muted">{message}</p>
            <p className="mt-3 text-xs text-muted">
              Waiting for confirmation… please don&apos;t close this page.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted">
              Enter your Safaricom number and we&apos;ll send a payment prompt (STK push) to your
              phone. Approve it with your M-Pesa PIN to complete your application.
            </p>
            <div className="mt-4">
              <TextField
                label="M-Pesa Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XX XXX XXX"
                inputMode="tel"
                autoComplete="tel"
              />
            </div>
            {stage === "failed" && message && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}
            <Button
              className="mt-5 w-full"
              size="lg"
              loading={processing}
              disabled={!phone.trim()}
              onClick={payWithMpesa}
            >
              <Smartphone className="h-4 w-4" />{" "}
              {stage === "failed" ? "Try Again" : `Pay ${formatMoney(kes, "KES")} with M-Pesa`}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
              <ShieldCheck className="h-3.5 w-3.5" /> Payments are processed securely by Safaricom
              M-Pesa.
            </p>
          </>
        )}
      </div>

      {/* Order summary */}
      <div className="card h-fit p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Payment Summary</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Application ID</dt>
            <dd className="font-mono font-medium">{app.applicationId}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Applicant</dt>
            <dd className="font-medium">{app.personal.fullName || app.account.fullName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Country</dt>
            <dd className="font-medium">{country}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Fee</dt>
            <dd className="font-medium">{formatFee(app.payment.amount, app.payment.currency)}</dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-[var(--border)] pt-3">
            <dt className="font-semibold">Charged via M-Pesa</dt>
            <dd className="text-xl font-extrabold text-brand-700 dark:text-brand-200">
              {formatMoney(kes, "KES")}
            </dd>
          </div>
          {!isKes && (
            <p className="text-xs text-muted">
              M-Pesa charges in KES — this is the equivalent of your {price.currency} fee.
            </p>
          )}
        </dl>
      </div>
    </div>
  );
}
