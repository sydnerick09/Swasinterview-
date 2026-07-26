"use client";

import { Eye } from "lucide-react";
import type { Application } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";
import { formatFee } from "@/lib/pricing";
import { formatDateTime } from "@/lib/utils";

export function ApplicationsTable({
  apps,
  onSelect,
}: {
  apps: Application[];
  onSelect: (app: Application) => void;
}) {
  if (apps.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-sm text-muted">No applications match your filters.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--bg)] text-left text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Application ID</th>
              <th className="px-4 py-3 font-semibold">Applicant</th>
              <th className="px-4 py-3 font-semibold">Country</th>
              <th className="px-4 py-3 font-semibold">Fee</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Submitted</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {apps.map((app) => (
              <tr
                key={app.id}
                className="cursor-pointer transition hover:bg-[var(--bg)]"
                onClick={() => onSelect(app)}
              >
                <td className="px-4 py-3 font-mono text-xs font-medium">{app.applicationId}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">
                    {app.personal.fullName || app.account.fullName || "—"}
                  </div>
                  <div className="text-xs text-muted">
                    {app.account.email || app.personal.email}
                  </div>
                </td>
                <td className="px-4 py-3">{app.account.country || app.personal.country}</td>
                <td className="px-4 py-3 tabular-nums">{formatFee(app.payment.amount)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {formatDateTime(app.submittedAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(app);
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs font-medium hover:border-brand-400 hover:text-brand-600"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
