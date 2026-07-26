"use client";

import { useWizard } from "../WizardContext";
import { TextField, SelectField } from "@/components/ui/Field";
import { COUNTRIES } from "@/lib/countries";
import { GENDERS } from "@/lib/options";
import type { Gender } from "@/lib/types";

export function StepPersonal() {
  const { app, patchSection, errors } = useWizard();
  const p = app.personal;
  const countryOptions = COUNTRIES.map((c) => ({ value: c, label: c }));

  const prefilled = Boolean(
    app.account.fullName || app.account.email || app.account.phone || app.account.country,
  );

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {prefilled && (
        <p className="sm:col-span-2 rounded-lg bg-brand-50 p-3 text-sm text-brand-800 dark:bg-brand-950/40 dark:text-brand-200">
          Some details were carried over from your account. Feel free to edit any of them.
        </p>
      )}
      <TextField
        label="Full Name"
        required
        value={p.fullName}
        onChange={(e) => patchSection("personal", { fullName: e.target.value })}
        error={errors.fullName}
        placeholder="Jane Doe"
      />
      <TextField
        label="Date of Birth"
        required
        type="date"
        value={p.dateOfBirth}
        onChange={(e) => patchSection("personal", { dateOfBirth: e.target.value })}
        error={errors.dateOfBirth}
        max={new Date().toISOString().slice(0, 10)}
      />
      <SelectField
        label="Gender"
        required
        placeholder="Select gender"
        options={GENDERS}
        value={p.gender}
        onChange={(e) => patchSection("personal", { gender: e.target.value as Gender })}
        error={errors.gender}
      />
      <SelectField
        label="Nationality"
        required
        placeholder="Select nationality"
        options={countryOptions}
        value={p.nationality}
        onChange={(e) => patchSection("personal", { nationality: e.target.value })}
        error={errors.nationality}
      />
      <SelectField
        label="Country of Residence"
        required
        placeholder="Select country"
        options={countryOptions}
        value={p.country}
        onChange={(e) => patchSection("personal", { country: e.target.value })}
        error={errors.country}
      />
      <TextField
        label="County / State"
        required
        value={p.countyState}
        onChange={(e) => patchSection("personal", { countyState: e.target.value })}
        error={errors.countyState}
        placeholder="e.g. Nairobi"
      />
      <TextField
        label="City"
        required
        value={p.city}
        onChange={(e) => patchSection("personal", { city: e.target.value })}
        error={errors.city}
        placeholder="e.g. Westlands"
      />
      <TextField
        label="National ID or Passport Number"
        required
        value={p.idOrPassportNumber}
        onChange={(e) => patchSection("personal", { idOrPassportNumber: e.target.value })}
        error={errors.idOrPassportNumber}
        placeholder="ID / Passport No."
      />
      <TextField
        label="Phone Number"
        required
        value={p.phone}
        onChange={(e) => patchSection("personal", { phone: e.target.value })}
        error={errors.phone}
        placeholder="+254 700 000000"
      />
      <TextField
        label="Email"
        required
        type="email"
        value={p.email}
        onChange={(e) => patchSection("personal", { email: e.target.value })}
        error={errors.email}
        placeholder="jane@example.com"
      />
    </div>
  );
}
