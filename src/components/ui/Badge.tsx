import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/types";

type Tone = "gray" | "blue" | "green" | "red" | "amber" | "purple";

const tones: Record<Tone, string> = {
  gray: "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-200",
  blue: "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200",
  green: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  red: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
};

export function Badge({
  children,
  tone = "gray",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const statusTone: Record<ApplicationStatus, Tone> = {
  draft: "gray",
  submitted: "amber",
  paid: "blue",
  approved: "green",
  rejected: "red",
};

const statusLabel: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Pending Payment",
  paid: "Paid",
  approved: "Approved",
  rejected: "Rejected",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>;
}
