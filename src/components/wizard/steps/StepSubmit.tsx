"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";
import { useWizard } from "../WizardContext";
import { Button } from "@/components/ui/Button";
import { CheckboxField } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { formatFee, getApplicationFee, getApplicationCurrency } from "@/lib/pricing";
import { computeAssessmentScore } from "@/lib/assessment";
import { saveApplication, setCurrentDraftId } from "@/lib/storage/applications";
import { generateApplicationId } from "@/lib/utils";
import type { Application } from "@/lib/types";

export function StepSubmit() {
  const { app } = useWizard();
  const router = useRouter();
  const { toast } = useToast();
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const country = app.account.country || app.personal.country;
  const fee = getApplicationFee(country);
  const currency = getApplicationCurrency(country);

  const submit = async () => {
    if (!agree) {
      toast("Please confirm the declaration before submitting.", "error");
      return;
    }
    setSubmitting(true);
    const applicationId = generateApplicationId();
    const now = new Date().toISOString();

    // Trim whitespace from text fields before saving the final record (spec §6).
    const submitted: Application = {
      ...app,
      account: {
        ...app.account,
        fullName: app.account.fullName.trim(),
        email: app.account.email.trim(),
        phone: app.account.phone.trim(),
        username: app.account.username.trim(),
        country: app.account.country.trim(),
      },
      personal: {
        ...app.personal,
        fullName: app.personal.fullName.trim(),
        email: app.personal.email.trim(),
        phone: app.personal.phone.trim(),
        nationality: app.personal.nationality.trim(),
        country: app.personal.country.trim(),
        countyState: app.personal.countyState.trim(),
        city: app.personal.city.trim(),
        idOrPassportNumber: app.personal.idOrPassportNumber.trim(),
      },
      emergencyContact: {
        ...app.emergencyContact,
        name: app.emergencyContact.name.trim(),
        phone: app.emergencyContact.phone.trim(),
        email: app.emergencyContact.email.trim(),
      },
      applicationId,
      status: "submitted",
      locked: true,
      submittedAt: now,
      assessment: {
        ...app.assessment,
        score: computeAssessmentScore(app.assessment.answers),
      },
      payment: { ...app.payment, amount: fee, currency, paid: false },
    };
    saveApplication(submitted);
    setCurrentDraftId(null); // start a fresh draft next time
    toast("Application submitted — proceed to payment.", "success");
    // Small delay so the toast is visible before navigation.
    setTimeout(() => router.push(`/status/${submitted.id}`), 400);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5 dark:border-brand-900 dark:bg-brand-950/40">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
          Application Fee Summary
        </h4>
        <div className="mt-3 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Applicant</span>
            <span className="font-medium">{app.personal.fullName || app.account.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Country</span>
            <span className="font-medium">{country || "—"}</span>
          </div>
          <div className="flex justify-between border-t border-brand-200 pt-2 dark:border-brand-900">
            <span className="font-semibold">Amount Due</span>
            <span className="text-lg font-extrabold text-brand-700 dark:text-brand-200">
              {formatFee(fee, currency)}
            </span>
          </div>
        </div>
      </div>

      <CheckboxField
        label="I confirm the information provided is accurate and complete."
        description="I understand my application will be locked after submission and cannot be edited."
        checked={agree}
        onChange={setAgree}
      />

      <div className="flex flex-col items-start gap-3 rounded-lg bg-gray-50 p-4 text-sm text-muted dark:bg-slate-800/60">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-green-600" /> After payment you will receive a
          confirmation email with your Application ID.
        </div>
      </div>

      <Button size="lg" className="w-full" loading={submitting} onClick={submit}>
        <Lock className="h-4 w-4" /> Submit Application &amp; Continue to Payment
      </Button>
    </div>
  );
}
