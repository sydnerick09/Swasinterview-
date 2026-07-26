"use client";

import { useState } from "react";
import Script from "next/script";
import { CreditCard, Lock, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { formatFee } from "@/lib/pricing";
import { updateStatus } from "@/lib/storage/applications";
import { sendConfirmationEmail } from "@/lib/email";
import { uid } from "@/lib/utils";
import {
  PAYSTACK_PUBLIC_KEY,
  PAYSTACK_SCRIPT_SRC,
  isPaystackConfigured,
  toSubunit,
  buildReference,
  verifyTransaction,
} from "@/lib/paystack";
import type { Application } from "@/lib/types";

export function PaymentPanel({ app, onPaid }: { app: Application; onPaid: () => void }) {
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  const country = app.account.country || app.personal.country;
  const email = app.account.email || app.personal.email;
  const currency = app.payment.currency;
  const paystackEnabled = isPaystackConfigured();

  // Persist a successful (and verified) payment.
  const markPaid = async (reference: string, method: string) => {
    const payment = {
      ...app.payment,
      paid: true,
      paidAt: new Date().toISOString(),
      transactionRef: reference,
      method,
    };
    updateStatus(app.id, "paid", { payment });
    await sendConfirmationEmail({ ...app, status: "paid", payment });
    toast("Payment successful! Confirmation email sent.", "success");
    onPaid();
  };

  const payWithPaystack = () => {
    if (!email) {
      toast("No email on file for this application — cannot start payment.", "error");
      return;
    }
    if (!scriptReady || !window.PaystackPop) {
      toast("Payment library is still loading. Please try again in a moment.", "info");
      return;
    }
    const reference = buildReference(app.applicationId);
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: toSubunit(app.payment.amount),
      currency,
      ref: reference,
      channels: ["card", "bank", "ussd", "bank_transfer", "mobile_money"],
      metadata: {
        application_id: app.applicationId,
        custom_fields: [
          { display_name: "Applicant", variable_name: "applicant", value: app.personal.fullName || app.account.fullName },
          { display_name: "Country", variable_name: "country", value: country },
        ],
      },
      callback: (response) => {
        // Verify server-side before trusting the result.
        setProcessing(true);
        verifyTransaction(response.reference)
          .then(async (result) => {
            if (result.success) {
              await markPaid(result.reference || response.reference, `Paystack (${result.channel ?? "card"})`);
            } else {
              toast(result.message || "We could not verify your payment. Please contact support.", "error");
            }
          })
          .catch(() => toast("Verification failed. If you were charged, contact support.", "error"))
          .finally(() => setProcessing(false));
      },
      onClose: () => toast("Payment window closed.", "info"),
    });
    handler.openIframe();
  };

  // Demo fallback used only when no Paystack public key is configured.
  const payDemo = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    await markPaid(uid("demo").toUpperCase(), "Demo");
    setProcessing(false);
  };

  return (
    <>
      {paystackEnabled && (
        <Script src={PAYSTACK_SCRIPT_SRC} onLoad={() => setScriptReady(true)} strategy="afterInteractive" />
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Payment action */}
        <div className="card p-6">
          <div className="mb-5 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-brand-600" />
            <h3 className="text-lg font-semibold">Secure Payment</h3>
          </div>

          {paystackEnabled ? (
            <>
              <p className="text-sm text-muted">
                Pay securely with your <strong>card</strong>, bank transfer or mobile money. You&apos;ll
                enter your details in Paystack&apos;s secure, PCI-compliant window — we never see or store
                your card information.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="rounded-md border border-[var(--border)] px-2 py-1">Visa</span>
                <span className="rounded-md border border-[var(--border)] px-2 py-1">Mastercard</span>
                <span className="rounded-md border border-[var(--border)] px-2 py-1">Verve</span>
                <span className="rounded-md border border-[var(--border)] px-2 py-1">Bank Transfer</span>
              </div>
              <Button
                className="mt-6 w-full"
                size="lg"
                loading={processing || !scriptReady}
                onClick={payWithPaystack}
              >
                <Lock className="h-4 w-4" /> Pay {formatFee(app.payment.amount, currency)} with Paystack
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
                <ShieldCheck className="h-3.5 w-3.5" /> Payments are processed and verified securely by Paystack.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Paystack is not configured (missing <code>NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY</code>). Using a
                  demo payment so you can test the flow.
                </span>
              </div>
              <Button className="mt-5 w-full" size="lg" loading={processing} onClick={payDemo}>
                <Lock className="h-4 w-4" /> Pay {formatFee(app.payment.amount, currency)} (Demo)
              </Button>
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
              <dt className="text-muted">Email</dt>
              <dd className="max-w-[180px] truncate font-medium" title={email}>{email}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-[var(--border)] pt-3">
              <dt className="font-semibold">Amount Due ({currency})</dt>
              <dd className="text-xl font-extrabold text-brand-700 dark:text-brand-200">
                {formatFee(app.payment.amount, currency)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}
