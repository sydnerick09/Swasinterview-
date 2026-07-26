"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useWizard } from "../WizardContext";
import { TextField, SelectField } from "@/components/ui/Field";
import { FeeDisplay } from "../FeeDisplay";
import { COUNTRIES } from "@/lib/countries";

export function StepAccount() {
  const { app, patchSection, errors } = useWizard();
  const a = app.account;
  const [showPassword, setShowPassword] = useState(false);
  const [confirm, setConfirm] = useState(a.password);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextField
        label="Full Name"
        required
        value={a.fullName}
        onChange={(e) => patchSection("account", { fullName: e.target.value })}
        error={errors.fullName}
        placeholder="Jane Doe"
        autoComplete="name"
      />
      <TextField
        label="Email"
        required
        type="email"
        value={a.email}
        onChange={(e) => patchSection("account", { email: e.target.value })}
        error={errors.email}
        placeholder="jane@example.com"
        autoComplete="email"
      />
      <TextField
        label="Phone Number"
        required
        value={a.phone}
        onChange={(e) => patchSection("account", { phone: e.target.value })}
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
        onChange={(e) => patchSection("account", { country: e.target.value })}
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
