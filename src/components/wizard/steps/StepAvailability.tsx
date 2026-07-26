"use client";

import { useWizard } from "../WizardContext";
import { TextField, SelectField, CheckboxField } from "@/components/ui/Field";
import {
  HOURS_PER_WEEK,
  SHIFTS,
  TIMEZONES,
  NOTICE_PERIODS,
  EMPLOYMENT_TYPES,
  DAYS_OF_WEEK,
} from "@/lib/options";
import { cn } from "@/lib/utils";

export function StepAvailability() {
  const { app, patchSection, errors } = useWizard();
  const av = app.availability;

  const toggleDay = (day: string) => {
    const has = av.daysAvailable.includes(day);
    patchSection("availability", {
      daysAvailable: has
        ? av.daysAvailable.filter((d) => d !== day)
        : [...av.daysAvailable, day],
    });
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextField
        label="Available From"
        required
        type="date"
        value={av.availableFrom}
        onChange={(e) => patchSection("availability", { availableFrom: e.target.value })}
        error={errors.availableFrom}
        min={new Date().toISOString().slice(0, 10)}
      />
      <SelectField
        label="Hours Available Per Week"
        required
        placeholder="Select hours"
        options={HOURS_PER_WEEK}
        value={av.hoursPerWeek}
        onChange={(e) => patchSection("availability", { hoursPerWeek: e.target.value })}
        error={errors.hoursPerWeek}
      />
      <SelectField
        label="Preferred Shift"
        required
        placeholder="Select shift"
        options={SHIFTS}
        value={av.preferredShift}
        onChange={(e) => patchSection("availability", { preferredShift: e.target.value })}
        error={errors.preferredShift}
      />
      <SelectField
        label="Timezone"
        required
        placeholder="Select timezone"
        options={TIMEZONES}
        value={av.timezone}
        onChange={(e) => patchSection("availability", { timezone: e.target.value })}
        error={errors.timezone}
      />
      <SelectField
        label="Notice Period"
        required
        placeholder="Select notice period"
        options={NOTICE_PERIODS}
        value={av.noticePeriod}
        onChange={(e) => patchSection("availability", { noticePeriod: e.target.value })}
        error={errors.noticePeriod}
      />
      <SelectField
        label="Preferred Employment Type"
        required
        placeholder="Select type"
        options={EMPLOYMENT_TYPES}
        value={av.employmentType}
        onChange={(e) => patchSection("availability", { employmentType: e.target.value })}
        error={errors.employmentType}
      />

      <div className="sm:col-span-2">
        <p className="mb-2 text-sm font-medium">
          Days Available <span className="text-red-500">*</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {DAYS_OF_WEEK.map((day) => {
            const active = av.daysAvailable.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition",
                  active
                    ? "border-brand-500 bg-brand-600 text-white"
                    : "border-[var(--border)] hover:border-brand-300",
                )}
              >
                {day.slice(0, 3)}
              </button>
            );
          })}
        </div>
        {errors.daysAvailable && (
          <p className="mt-1.5 text-xs text-red-600">{errors.daysAvailable}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <CheckboxField
          label="I am willing to work weekends"
          checked={av.willingToWorkWeekends}
          onChange={(v) => patchSection("availability", { willingToWorkWeekends: v })}
        />
      </div>
    </div>
  );
}
