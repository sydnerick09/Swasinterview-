"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STEPS, TOTAL_STEPS } from "./steps-meta";
import { useWizard } from "./WizardContext";

export function ProgressRail() {
  const { step, goTo } = useWizard();
  const pct = Math.round(((step + 1) / TOTAL_STEPS) * 100);

  return (
    <>
      {/* Desktop vertical rail */}
      <nav aria-label="Application steps" className="hidden lg:block">
        <div className="card p-5">
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted">
              <span>Progress</span>
              <span>{pct}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-brand-600 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <ol className="space-y-1">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <li key={s.key}>
                  <button
                    onClick={() => i <= step && goTo(i)}
                    disabled={i > step}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition",
                      active && "bg-brand-50 dark:bg-brand-950/50",
                      i <= step ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800" : "cursor-not-allowed opacity-60",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                        done && "bg-brand-600 text-white",
                        active && "bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-900",
                        !done && !active && "bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-slate-300",
                      )}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span className={cn("font-medium", active && "text-brand-700 dark:text-brand-200")}>
                      {s.label}
                      {s.optional && (
                        <span className="ml-1 text-[10px] font-normal text-muted">(optional)</span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>

      {/* Mobile compact progress */}
      <div className="lg:hidden">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="font-semibold">
            Step {step + 1} of {TOTAL_STEPS}
          </span>
          <span className="text-muted">{STEPS[step].label}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </>
  );
}
