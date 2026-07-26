"use client";

import { useMemo, useState } from "react";
import { Search, FileSpreadsheet, FileDown, LogOut, RefreshCw } from "lucide-react";
import type { Application, ApplicationStatus } from "@/lib/types";
import { useApplications } from "@/hooks/useApplications";
import { StatCards } from "./StatCards";
import { ApplicationsTable } from "./ApplicationsTable";
import { ApplicationDrawer } from "./ApplicationDrawer";
import { SettingsPanel } from "./SettingsPanel";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";
import { exportCsv, exportExcel } from "@/lib/export";
import { COUNTRIES } from "@/lib/countries";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Pending Payment" },
  { value: "paid", label: "Paid" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { apps, ready, refresh } = useApplications();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "all">("all");
  const [country, setCountry] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);
  const [tab, setTab] = useState<"applications" | "settings">("applications");

  // Only show submitted (non-draft) applications in the admin.
  const submitted = useMemo(() => apps.filter((a) => a.status !== "draft"), [apps]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return submitted
      .filter((a) => (status === "all" ? true : a.status === status))
      .filter((a) =>
        country ? (a.account.country || a.personal.country) === country : true,
      )
      .filter((a) => {
        if (!q) return true;
        const name = (a.personal.fullName || a.account.fullName).toLowerCase();
        const email = (a.account.email || a.personal.email).toLowerCase();
        const appId = (a.applicationId || "").toLowerCase();
        return name.includes(q) || email.includes(q) || appId.includes(q);
      })
      .sort((a, b) => (b.submittedAt || "").localeCompare(a.submittedAt || ""));
  }, [submitted, query, status, country]);

  const usedCountries = useMemo(
    () =>
      Array.from(
        new Set(submitted.map((a) => a.account.country || a.personal.country).filter(Boolean)),
      ),
    [submitted],
  );

  return (
    <div className="container-page py-8">
      {/* Header row */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted">Manage and review applications.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={refresh}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-[var(--border)]">
        {(["applications", "settings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium capitalize transition",
              tab === t
                ? "border-b-2 border-brand-600 text-brand-600"
                : "text-muted hover:text-[var(--text)]",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "settings" ? (
        <SettingsPanel />
      ) : (
        <>
          <StatCards apps={apps} />

          {/* Filters + exports */}
          <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid flex-1 gap-3 sm:grid-cols-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-9 h-4 w-4 text-muted" />
                <TextField
                  label="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Name, email or Application ID"
                  className="[&_input]:pl-9"
                />
              </div>
              <SelectField
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus | "all")}
                options={STATUS_FILTERS}
              />
              <SelectField
                label="Country"
                placeholder="All countries"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                options={(usedCountries.length ? usedCountries : COUNTRIES).map((c) => ({
                  value: c,
                  label: c,
                }))}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCsv(filtered)}
                disabled={!filtered.length}
              >
                <FileDown className="h-4 w-4" /> CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportExcel(filtered)}
                disabled={!filtered.length}
              >
                <FileSpreadsheet className="h-4 w-4" /> Excel
              </Button>
            </div>
          </div>

          <div className="mt-4">
            {ready && (
              <p className="mb-2 text-xs text-muted">
                Showing {filtered.length} of {submitted.length} applications
              </p>
            )}
            <ApplicationsTable apps={filtered} onSelect={setSelected} />
          </div>
        </>
      )}

      {selected && (
        <ApplicationDrawer app={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
