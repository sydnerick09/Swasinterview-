"use client";

import { Users, Clock, CreditCard, CheckCircle2, XCircle } from "lucide-react";
import type { Application } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatCards({ apps }: { apps: Application[] }) {
  // Total counts submitted (non-draft) applications.
  const submitted = apps.filter((a) => a.status !== "draft");
  const stats = [
    {
      label: "Total Applications",
      value: submitted.length,
      icon: Users,
      color: "text-brand-600 bg-brand-50 dark:bg-brand-950",
    },
    {
      label: "Pending Payment",
      value: apps.filter((a) => a.status === "submitted").length,
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
    },
    {
      label: "Paid",
      value: apps.filter((a) => a.status === "paid").length,
      icon: CreditCard,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40",
    },
    {
      label: "Approved",
      value: apps.filter((a) => a.status === "approved").length,
      icon: CheckCircle2,
      color: "text-green-600 bg-green-50 dark:bg-green-950/40",
    },
    {
      label: "Rejected",
      value: apps.filter((a) => a.status === "rejected").length,
      icon: XCircle,
      color: "text-red-600 bg-red-50 dark:bg-red-950/40",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {stats.map((s) => (
        <div key={s.label} className="card p-4">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", s.color)}>
            <s.icon className="h-5 w-5" />
          </div>
          <p className="mt-3 text-2xl font-extrabold tabular-nums">{s.value}</p>
          <p className="text-xs text-muted">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
