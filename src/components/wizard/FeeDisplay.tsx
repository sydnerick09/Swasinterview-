"use client";

import { Lock } from "lucide-react";
import { getApplicationFee } from "@/lib/pricing";

/**
 * Read-only display of the application fee derived from the selected country.
 * The value is never editable — it is computed from the pricing table.
 */
export function FeeDisplay({ country }: { country: string }) {
  const fee = getApplicationFee(country);
  return (
    <div className="flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-5 py-4 dark:border-brand-900 dark:bg-brand-950/40">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
          Application Fee
        </p>
        <p className="mt-0.5 text-sm text-muted">
          {country ? (
            <>
              For <span className="font-medium text-[var(--text)]">{country}</span>
            </>
          ) : (
            "Select a country to see your fee"
          )}
        </p>
      </div>
      <div className="text-right">
        <p className="text-3xl font-extrabold tabular-nums text-brand-700 dark:text-brand-200">
          ${fee}
          <span className="ml-1 text-base font-semibold text-muted">USD</span>
        </p>
        <p className="flex items-center justify-end gap-1 text-[11px] text-muted">
          <Lock className="h-3 w-3" /> Auto-calculated
        </p>
      </div>
    </div>
  );
}
