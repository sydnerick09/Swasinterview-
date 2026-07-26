"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Cloud, CheckCircle2 } from "lucide-react";
import { useWizard } from "./WizardContext";
import { ProgressRail } from "./ProgressRail";
import { STEPS, TOTAL_STEPS } from "./steps-meta";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import { StepAccount } from "./steps/StepAccount";
import { StepPersonal } from "./steps/StepPersonal";
import { StepSkills } from "./steps/StepSkills";
import { StepEquipment } from "./steps/StepEquipment";
import { StepAssessment } from "./steps/StepAssessment";
import { StepDocuments } from "./steps/StepDocuments";
import { StepAvailability } from "./steps/StepAvailability";
import { StepEmergency } from "./steps/StepEmergency";
import { StepReferences } from "./steps/StepReferences";
import { StepReview } from "./steps/StepReview";
import { StepSubmit } from "./steps/StepSubmit";

const STEP_COMPONENTS = [
  StepAccount,
  StepPersonal,
  StepSkills,
  StepEquipment,
  StepAssessment,
  StepDocuments,
  StepAvailability,
  StepEmergency,
  StepReferences,
  StepReview,
  StepSubmit,
];

function SaveIndicator() {
  const { saveState } = useWizard();
  if (saveState === "idle") return null;
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted">
      {saveState === "saving" ? (
        <>
          <Cloud className="h-3.5 w-3.5 animate-pulse" /> Saving…
        </>
      ) : (
        <>
          <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> Progress saved
        </>
      )}
    </span>
  );
}

export function Wizard() {
  const { step, next, back } = useWizard();
  const meta = STEPS[step];
  const StepComponent = STEP_COMPONENTS[step];
  const isFirst = step === 0;
  const isSubmitStep = step === TOTAL_STEPS - 1;
  const isReview = step === TOTAL_STEPS - 2;

  return (
    <div className="container-page grid gap-6 py-8 lg:grid-cols-[280px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <ProgressRail />
      </aside>

      <div>
        <Card>
          <CardHeader
            title={meta.title}
            description={meta.description}
            action={<SaveIndicator />}
          />
          <CardBody>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <StepComponent />
              </motion.div>
            </AnimatePresence>
          </CardBody>
        </Card>

        {/* Navigation */}
        {!isSubmitStep && (
          <div className="mt-5 flex items-center justify-between gap-3">
            <Button variant="outline" onClick={back} disabled={isFirst}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-muted sm:inline">
                Step {step + 1} of {TOTAL_STEPS}
              </span>
              <Button onClick={next}>
                {isReview ? (
                  <>
                    Continue to Submit <Check className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Save &amp; Continue <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
        {isSubmitStep && (
          <div className="mt-5">
            <Button variant="outline" onClick={back}>
              <ArrowLeft className="h-4 w-4" /> Back to Review
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
