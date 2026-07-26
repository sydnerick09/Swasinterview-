"use client";

import { useWizard } from "../WizardContext";
import { ApplicationSummary } from "@/components/ApplicationSummary";

export function StepReview() {
  const { app, goTo } = useWizard();
  return (
    <div>
      <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
        Please review everything below carefully. You can edit any section now — after you submit,
        your application will be <strong>locked</strong> and can no longer be changed.
      </p>
      <ApplicationSummary app={app} onEdit={goTo} />
    </div>
  );
}
