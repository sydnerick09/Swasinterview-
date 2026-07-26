"use client";

import { useWizard } from "../WizardContext";
import { TextField, SelectField } from "@/components/ui/Field";
import { RELATIONSHIPS } from "@/lib/options";

export function StepEmergency() {
  const { app, patchSection } = useWizard();
  const ec = app.emergencyContact;

  return (
    <div>
      <p className="mb-4 rounded-lg bg-gray-50 p-3 text-sm text-muted dark:bg-slate-800/60">
        This step is optional but recommended. We only use this information in case of an emergency.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Contact Name"
          value={ec.name}
          onChange={(e) => patchSection("emergencyContact", { name: e.target.value })}
          placeholder="Full name"
        />
        <SelectField
          label="Relationship"
          placeholder="Select relationship"
          options={RELATIONSHIPS}
          value={ec.relationship}
          onChange={(e) => patchSection("emergencyContact", { relationship: e.target.value })}
        />
        <TextField
          label="Phone Number"
          value={ec.phone}
          onChange={(e) => patchSection("emergencyContact", { phone: e.target.value })}
          placeholder="+254 700 000000"
        />
        <TextField
          label="Email"
          type="email"
          value={ec.email}
          onChange={(e) => patchSection("emergencyContact", { email: e.target.value })}
          placeholder="contact@example.com"
        />
      </div>
    </div>
  );
}
