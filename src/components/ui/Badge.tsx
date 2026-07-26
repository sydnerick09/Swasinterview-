import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/types";

type Tone = "gray" | "blue" | "green" | "red" | "amber" | "purple";

// Monochrome tones — distinguished by fill/shade/outline rather than hue.
const tones: Record<Tone, string> = {
  gray: "bg-[var(--border)] text-[var(--muted)]", // draft
  amber: "border border-dashed border-[var(--muted)] text-[var(--text)] bg-transparent", // pending
  blue: "bg-[var(--muted)] text-[var(--card)]", // paid
  green: "bg-[var(--text)] text-[var(--card)]", // approved
  red: "border border-[var(--text)] text-[var(--text)] bg-transparent", // rejected
  purple: "bg-[var(--border)] text-[var(--text)]",
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
