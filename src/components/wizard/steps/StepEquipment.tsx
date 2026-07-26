"use client";

import { useWizard } from "../WizardContext";
import { TextField, SelectField, CheckboxField } from "@/components/ui/Field";
import {
  DEVICE_TYPES,
  OPERATING_SYSTEMS,
  RAM_OPTIONS,
  INTERNET_TYPES,
  INTERNET_SPEEDS,
} from "@/lib/options";

export function StepEquipment() {
  const { app, patchSection, errors } = useWizard();
  const e = app.equipment;

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <SelectField
        label="Primary Device"
        required
        placeholder="Select device"
        options={DEVICE_TYPES}
        value={e.deviceType}
        onChange={(ev) => patchSection("equipment", { deviceType: ev.target.value })}
        error={errors.deviceType}
      />
      <SelectField
        label="Operating System"
        required
        placeholder="Select OS"
        options={OPERATING_SYSTEMS}
        value={e.operatingSystem}
        onChange={(ev) => patchSection("equipment", { operatingSystem: ev.target.value })}
        error={errors.operatingSystem}
      />
      <SelectField
        label="RAM"
        required
        placeholder="Select RAM"
        options={RAM_OPTIONS}
        value={e.ram}
        onChange={(ev) => patchSection("equipment", { ram: ev.target.value })}
        error={errors.ram}
      />
      <TextField
        label="Processor"
        required
        value={e.processor}
        onChange={(ev) => patchSection("equipment", { processor: ev.target.value })}
        error={errors.processor}
        placeholder="e.g. Intel Core i5, Apple M2"
      />
      <SelectField
        label="Internet Connection Type"
        required
        placeholder="Select type"
        options={INTERNET_TYPES}
        value={e.internetType}
        onChange={(ev) => patchSection("equipment", { internetType: ev.target.value })}
        error={errors.internetType}
      />
      <SelectField
        label="Internet Speed"
        required
        placeholder="Select speed"
        options={INTERNET_SPEEDS}
        value={e.internetSpeed}
        onChange={(ev) => patchSection("equipment", { internetSpeed: ev.target.value })}
        error={errors.internetSpeed}
      />

      <div className="sm:col-span-2">
        <p className="mb-2 text-sm font-medium">Additional equipment & setup</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <CheckboxField
            label="I have a webcam"
            checked={e.hasWebcam}
            onChange={(v) => patchSection("equipment", { hasWebcam: v })}
          />
          <CheckboxField
            label="I have a headset / microphone"
            checked={e.hasHeadset}
            onChange={(v) => patchSection("equipment", { hasHeadset: v })}
          />
          <CheckboxField
            label="I have backup power (generator / UPS / inverter)"
            checked={e.hasBackupPower}
            onChange={(v) => patchSection("equipment", { hasBackupPower: v })}
          />
          <CheckboxField
            label="I have a backup internet connection"
            checked={e.hasBackupInternet}
            onChange={(v) => patchSection("equipment", { hasBackupInternet: v })}
          />
          <CheckboxField
            label="I have a quiet, dedicated workspace"
            checked={e.hasDedicatedWorkspace}
            onChange={(v) => patchSection("equipment", { hasDedicatedWorkspace: v })}
          />
        </div>
      </div>
    </div>
  );
}
