"use client";

import { Plus, Trash2 } from "lucide-react";
import { useWizard } from "../WizardContext";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { Reference } from "@/lib/types";

const emptyRef: Reference = { name: "", relationship: "", company: "", phone: "", email: "" };

export function StepReferences() {
  const { app, setApp } = useWizard();
  const refs = app.references;

  const add = () => setApp((prev) => ({ ...prev, references: [...prev.references, { ...emptyRef }] }));

  const update = (i: number, patch: Partial<Reference>) =>
    setApp((prev) => ({
      ...prev,
      references: prev.references.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    }));

  const remove = (i: number) =>
    setApp((prev) => ({ ...prev, references: prev.references.filter((_, idx) => idx !== i) }));

  return (
    <div>
      <p className="mb-4 rounded-lg bg-gray-50 p-3 text-sm text-muted dark:bg-slate-800/60">
        Optional. Add professional references who can speak to your work. You can add more than one.
      </p>

      {refs.length === 0 && (
        <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center">
          <p className="text-sm text-muted">No references added yet.</p>
        </div>
      )}

      <div className="space-y-5">
        {refs.map((r, i) => (
          <div key={i} className="rounded-xl border border-[var(--border)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold">Reference {i + 1}</h4>
              <button
                type="button"
                onClick={() => remove(i)}
                className="flex items-center gap-1 text-xs text-red-600 hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Name"
                value={r.name}
                onChange={(e) => update(i, { name: e.target.value })}
                placeholder="Full name"
              />
              <TextField
                label="Relationship"
                value={r.relationship}
                onChange={(e) => update(i, { relationship: e.target.value })}
                placeholder="e.g. Former Manager"
              />
              <TextField
                label="Company / Organisation"
                value={r.company}
                onChange={(e) => update(i, { company: e.target.value })}
                placeholder="Company name"
              />
              <TextField
                label="Phone"
                value={r.phone}
                onChange={(e) => update(i, { phone: e.target.value })}
                placeholder="+254 700 000000"
              />
              <TextField
                label="Email"
                type="email"
                value={r.email}
                onChange={(e) => update(i, { email: e.target.value })}
                placeholder="reference@example.com"
                className="sm:col-span-2"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button type="button" variant="outline" onClick={add}>
          <Plus className="h-4 w-4" /> Add Reference
        </Button>
      </div>
    </div>
  );
}
