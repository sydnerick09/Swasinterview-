"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useWizard } from "../WizardContext";
import { TextField, SelectField } from "@/components/ui/Field";
import { FeeDisplay } from "../FeeDisplay";
import { COUNTRIES } from "@/lib/countries";
import type { AccountInfo, PersonalInfo } from "@/lib/types";

// Account fields that also appear on the Personal Information step. Filling them here
// carries them over so the applicant doesn't have to retype them.
const SHARED_FIELDS: Partial<Record<keyof AccountInfo, keyof PersonalInfo>> = {
  fullName: "fullName",
  email: "email",
  phone: "phone",
  country: "country",
};

export function StepAccount() {
  const { app, setApp, patchSection, errors } = useWizard();
  const a = app.account;
  const [showPassword, setShowPassword] = useState(false);
  const [confirm, setConfirm] = useState(a.password);

  // Update an account field and mirror it into the matching Personal field — but only
  // while that Personal field is still empty or still equals the previous account value.
  // This keeps the two in sync without ever overwriting a value the applicant edited by hand.
  const setAccountField = (field: keyof AccountInfo, value: string) => {
    setApp((prev) => {
      const account = { ...prev.account, [field]: value };
      let personal = prev.personal;
      const target = SHARED_FIELDS[field];
      if (target) {
        const current = prev.personal[target];
        const previous = prev.account[field] as string;
        if (!current || current === previous) {
          personal = { ...personal, [target]: value };
        }
        // Default nationality to the selected country the first time one is chosen.
        if (field === "country" && !prev.personal.nationality) {
          personal = { ...personal, nationality: value };
        }
      }
      return { ...prev, account, personal };
    });
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextField
        label="Full Name"
        required
        value={a.fullName}
        onChange={(e) => setAccountField("fullName", e.target.value)}
        error={errors.fullName}
        placeholder="Jane Doe"
        autoComplete="name"
      />
      <TextField
        label="Email"
        required
        type="email"
        value={a.email}
        onChange={(e) => setAccountField("email", e.target.value)}
        error={errors.email}
        placeholder="jane@example.com"
        autoComplete="email"
      />
      <TextField
        label="Phone Number"
        required
        value={a.phone}
        onChange={(e) => setAccountField("phone", e.target.value)}
        error={errors.phone}
        placeholder="+254 700 000000"
        autoComplete="tel"
      />
      <SelectField
        label="Country"
        required
        placeholder="Select your country"
        options={COUNTRIES.map((c) => ({ value: c, label: c }))}
        value={a.country}
        onChange={(e) => setAccountField("country", e.target.value)}
        error={errors.country}
      />

      {/* Dynamic country pricing */}
      <div className="sm:col-span-2">
        <FeeDisplay country={a.country} />
      </div>

      <TextField
        label="Username"
        required
        value={a.username}
        onChange={(e) => patchSection("account", { username: e.target.value })}
        error={errors.username}
        placeholder="janedoe"
        autoComplete="username"
      />
      <div />

      <div className="relative">
        <TextField
          label="Password"
          required
          type={showPassword ? "text" : "password"}
          value={a.password}
          onChange={(e) => patchSection("account", { password: e.target.value })}
          error={errors.password}
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="absolute right-3 top-9 text-muted hover:text-brand-600"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <TextField
        label="Confirm Password"
        required
        type={showPassword ? "text" : "password"}
        value={confirm}
        onChange={(e) => {
          setConfirm(e.target.value);
        }}
        error={
          confirm && confirm !== a.password
            ? "Passwords do not match"
            : errors.confirmPassword
        }
        placeholder="Re-enter your password"
        autoComplete="new-password"
      />
    </div>
  );
}
