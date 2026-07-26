"use client";

import { useState } from "react";
import { Save, CalendarClock } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { getSettings, saveSettings } from "@/lib/storage/settings";
import { computeWindow } from "@/lib/config";
import { formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";

// Convert ISO string <-> value for <input type="datetime-local"> (local time, no seconds).
function toLocalInput(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
}

export function SettingsPanel() {
  const { toast } = useToast();
  const [settings, setSettings] = useState(() => getSettings());
  const [openLocal, setOpenLocal] = useState(() => toLocalInput(getSettings().openDate));

  const window = computeWindow(settings);

  const save = () => {
    const openDate = openLocal ? new Date(openLocal).toISOString() : settings.openDate;
    const next = {
      ...settings,
      openDate,
      windowDays: Math.max(1, Number(settings.windowDays) || 1),
    };
    saveSettings(next);
    setSettings(next);
    toast("Portal settings saved.", "success");
  };

  return (
    <Card>
      <CardHeader
        title="Recruitment Window & Settings"
        description="Configure the application window without changing code. Changes apply immediately."
        icon={<CalendarClock className="h-5 w-5" />}
      />
      <CardBody className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Applications Open Date & Time"
            type="datetime-local"
            value={openLocal}
            onChange={(e) => setOpenLocal(e.target.value)}
            hint="When the recruitment window begins."
          />
          <TextField
            label="Window Duration (days)"
            type="number"
            min={1}
            value={String(settings.windowDays)}
            onChange={(e) => setSettings({ ...settings, windowDays: Number(e.target.value) })}
            hint="Default is 4 days."
          />
          <TextField
            label="Admin Password"
            type="text"
            value={settings.adminPassword}
            onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
            hint="Used to access this dashboard."
            className="sm:col-span-2"
          />
        </div>

        <div className="rounded-lg bg-[var(--bg)] p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-muted">Current window status</span>
            <StatusBadge status={window.open ? "approved" : "rejected"} />
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-muted">Closes at</span>
            <span className="font-medium">{formatDateTime(window.closeDate.toISOString())}</span>
          </div>
        </div>

        <Button onClick={save}>
          <Save className="h-4 w-4" /> Save Settings
        </Button>
      </CardBody>
    </Card>
  );
}
