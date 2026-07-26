"use client";

import { Pencil, FileText } from "lucide-react";
import type { Application } from "@/lib/types";
import { formatDate, formatBytes } from "@/lib/utils";
import { formatFee } from "@/lib/pricing";
import { computeAssessmentScore } from "@/lib/assessment";

const DOC_LABELS: Record<string, string> = {
  national_id: "National ID",
  passport: "Passport",
  cv: "CV / Résumé",
  academic_certificates: "Academic Certificates",
  professional_certificates: "Professional Certificates",
  portfolio: "Portfolio",
  cover_letter: "Cover Letter",
};

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-1.5 sm:flex-row sm:gap-4">
      <dt className="w-56 shrink-0 text-sm text-muted">{label}</dt>
      <dd className="text-sm font-medium">{value || <span className="text-muted">—</span>}</dd>
    </div>
  );
}

function Section({
  title,
  step,
  onEdit,
  children,
}: {
  title: string;
  step?: number;
  onEdit?: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-brand-600">{title}</h4>
        {onEdit && step !== undefined && (
          <button
            type="button"
            onClick={() => onEdit(step)}
            className="flex items-center gap-1 text-xs text-brand-600 hover:underline"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
        )}
      </div>
      <dl className="divide-y divide-[var(--border)]">{children}</dl>
    </div>
  );
}

export function ApplicationSummary({
  app,
  onEdit,
}: {
  app: Application;
  onEdit?: (step: number) => void;
}) {
  const yn = (b: boolean) => (b ? "Yes" : "No");
  const score = computeAssessmentScore(app.assessment.answers);

  return (
    <div className="space-y-4">
      <Section title="Account" step={0} onEdit={onEdit}>
        <Row label="Full Name" value={app.account.fullName} />
        <Row label="Email" value={app.account.email} />
        <Row label="Phone" value={app.account.phone} />
        <Row label="Country" value={app.account.country} />
        <Row label="Username" value={app.account.username} />
        <Row label="Application Fee" value={formatFee(app.payment.amount, app.payment.currency)} />
      </Section>

      <Section title="Personal Information" step={1} onEdit={onEdit}>
        <Row label="Full Name" value={app.personal.fullName} />
        <Row label="Date of Birth" value={formatDate(app.personal.dateOfBirth)} />
        <Row label="Gender" value={app.personal.gender} />
        <Row label="Nationality" value={app.personal.nationality} />
        <Row label="Country" value={app.personal.country} />
        <Row label="County / State" value={app.personal.countyState} />
        <Row label="City" value={app.personal.city} />
        <Row label="ID / Passport No." value={app.personal.idOrPassportNumber} />
        <Row label="Phone" value={app.personal.phone} />
        <Row label="Email" value={app.personal.email} />
      </Section>

      <Section title="Skills & Experience" step={2} onEdit={onEdit}>
        <Row label="Education Level" value={app.skills.educationLevel} />
        <Row label="Field of Study" value={app.skills.fieldOfStudy} />
        <Row label="Experience" value={app.skills.yearsOfExperience} />
        <Row label="Employment Status" value={app.skills.employmentStatus} />
        <Row label="Job Title" value={app.skills.currentJobTitle} />
        <Row label="Employer" value={app.skills.currentEmployer} />
        <Row label="Primary Category" value={app.skills.primarySkillCategory} />
        <Row label="Skills" value={app.skills.skills.join(", ")} />
        <Row label="Languages" value={app.skills.languages.join(", ")} />
        <Row label="English Proficiency" value={app.skills.englishProficiency} />
        <Row label="Expected Rate (KES/hr)" value={app.skills.expectedHourlyRate} />
        <Row label="Portfolio" value={app.skills.portfolioUrl} />
        <Row label="LinkedIn" value={app.skills.linkedinUrl} />
        <Row label="Summary" value={app.skills.professionalSummary} />
      </Section>

      <Section title="Equipment & Internet" step={3} onEdit={onEdit}>
        <Row label="Device" value={app.equipment.deviceType} />
        <Row label="Operating System" value={app.equipment.operatingSystem} />
        <Row label="RAM" value={app.equipment.ram} />
        <Row label="Processor" value={app.equipment.processor} />
        <Row label="Internet Type" value={app.equipment.internetType} />
        <Row label="Internet Speed" value={app.equipment.internetSpeed} />
        <Row label="Webcam" value={yn(app.equipment.hasWebcam)} />
        <Row label="Headset / Mic" value={yn(app.equipment.hasHeadset)} />
        <Row label="Backup Power" value={yn(app.equipment.hasBackupPower)} />
        <Row label="Backup Internet" value={yn(app.equipment.hasBackupInternet)} />
        <Row label="Dedicated Workspace" value={yn(app.equipment.hasDedicatedWorkspace)} />
      </Section>

      <Section title="Assessment" step={4} onEdit={onEdit}>
        <Row label="Knowledge Score" value={`${score}%`} />
        <Row
          label="Typing Test"
          value={
            app.assessment.typing.completed
              ? `${app.assessment.typing.wpm} WPM · ${app.assessment.typing.accuracy}% accuracy`
              : "Not completed"
          }
        />
      </Section>

      <Section title="Documents" step={5} onEdit={onEdit}>
        {app.documents.length === 0 ? (
          <Row label="Uploaded" value="No documents uploaded" />
        ) : (
          app.documents.map((d) => (
            <Row
              key={d.id}
              label={DOC_LABELS[d.type] ?? d.type}
              value={
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted" />
                  {d.fileName} · {formatBytes(d.fileSize)}
                </span>
              }
            />
          ))
        )}
      </Section>

      <Section title="Availability" step={6} onEdit={onEdit}>
        <Row label="Available From" value={formatDate(app.availability.availableFrom)} />
        <Row label="Hours / Week" value={app.availability.hoursPerWeek} />
        <Row label="Preferred Shift" value={app.availability.preferredShift} />
        <Row label="Timezone" value={app.availability.timezone} />
        <Row label="Days Available" value={app.availability.daysAvailable.join(", ")} />
        <Row label="Notice Period" value={app.availability.noticePeriod} />
        <Row label="Employment Type" value={app.availability.employmentType} />
        <Row label="Works Weekends" value={yn(app.availability.willingToWorkWeekends)} />
      </Section>

      <Section title="Emergency Contact" step={7} onEdit={onEdit}>
        <Row label="Name" value={app.emergencyContact.name} />
        <Row label="Relationship" value={app.emergencyContact.relationship} />
        <Row label="Phone" value={app.emergencyContact.phone} />
        <Row label="Email" value={app.emergencyContact.email} />
      </Section>

      <Section title="References" step={8} onEdit={onEdit}>
        {app.references.length === 0 ? (
          <Row label="References" value="None provided" />
        ) : (
          app.references.map((r, i) => (
            <Row
              key={i}
              label={`Reference ${i + 1}`}
              value={`${r.name}${r.relationship ? ` (${r.relationship})` : ""}${
                r.email ? ` · ${r.email}` : ""
              }`}
            />
          ))
        )}
      </Section>
    </div>
  );
}
