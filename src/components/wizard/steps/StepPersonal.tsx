"use client";

import { useWizard } from "../WizardContext";
import { TextField, SelectField } from "@/components/ui/Field";
import { COUNTRIES } from "@/lib/countries";
import { GENDERS } from "@/lib/options";
import type { Gender } from "@/lib/types";

export function StepPersonal() {
  const { app, patchSection, setSharedField, errors } = useWizard();
  const p = app.personal;
  const countryOptions = COUNTRIES.map((c) => ({ value: c, label: c }));

  const prefilled = Boolean(
    app.account.fullName || app.account.email || app.account.phone || app.account.country,
  );

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {prefilled && (
        <p className="sm:col-span-2 rounded-lg bg-brand-50 p-3 text-sm text-[var(--text)] dark:bg-brand-950/60 dark:text-brand-100">
          Details from your account have been filled in automatically. Any change you make here
          updates them everywhere.
        </p>
      )}
      <TextField
        label="Full Name"
        required
        value={p.fullName}
        onChange={(e) => setSharedField("fullName", e.target.value)}
        error={errors.fullName}
        placeholder="Enter your full name"
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
        placeholder="Select your gender"
        options={GENDERS}
        value={p.gender}
        onChange={(e) => patchSection("personal", { gender: e.target.value as Gender })}
        error={errors.gender}
      />
      <SelectField
        label="Nationality"
        required
        placeholder="Select your nationality"
        options={countryOptions}
        value={p.nationality}
        onChange={(e) => patchSection("personal", { nationality: e.target.value })}
        error={errors.nationality}
      />
      <SelectField
        label="Country of Residence"
        required
        placeholder="Select your country"
        options={countryOptions}
        value={p.country}
        onChange={(e) => setSharedField("country", e.target.value)}
        error={errors.country}
      />
      <TextField
        label="County / State"
        required
        value={p.countyState}
        onChange={(e) => patchSection("personal", { countyState: e.target.value })}
        error={errors.countyState}
        placeholder="Enter your county or state"
      />
      <TextField
        label="City"
        required
        value={p.city}
        onChange={(e) => patchSection("personal", { city: e.target.value })}
        error={errors.city}
        placeholder="Enter your city"
      />
      <TextField
        label="National ID or Passport Number"
        required
        value={p.idOrPassportNumber}
        onChange={(e) => patchSection("personal", { idOrPassportNumber: e.target.value })}
        error={errors.idOrPassportNumber}
        placeholder="Enter your National ID or passport number"
      />
      <TextField
        label="Phone Number"
        required
        value={p.phone}
        onChange={(e) => setSharedField("phone", e.target.value)}
        error={errors.phone}
        placeholder="Enter your phone number"
      />
      <TextField
        label="Email Address"
        required
        type="email"
        value={p.email}
        onChange={(e) => setSharedField("email", e.target.value)}
        error={errors.email}
        placeholder="Enter your email address"
      />
    </div>
  );
}
