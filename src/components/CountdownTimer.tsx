"use client";

import { useApplicationWindow } from "@/hooks/useApplicationWindow";
import { cn } from "@/lib/utils";

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-lg font-bold tabular-nums text-white shadow-inner xs:h-14 xs:w-14 xs:text-xl sm:h-20 sm:w-20 sm:rounded-xl sm:text-3xl">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1.5 text-[9px] font-semibold uppercase tracking-widest text-white/70 sm:mt-2 sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer({ className }: { className?: string }) {
  const { ready, window: win, countdown } = useApplicationWindow();

  if (!ready) {
    return (
      <div className={cn("flex justify-center gap-3", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 w-16 animate-pulse rounded-xl bg-white/10 sm:w-20" />
        ))}
      </div>
    );
  }

  if (!win.open) {
    return (
      <div
        className={cn(
          "rounded-xl bg-white/10 px-6 py-4 text-center text-sm font-semibold text-white",
          className,
        )}
      >
        Applications are currently closed.
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-4", className)}>
      <Unit value={countdown.days} label="Days" />
      <span className="pb-5 text-lg font-bold text-white/50 sm:pb-6 sm:text-2xl">:</span>
      <Unit value={countdown.hours} label="Hours" />
      <span className="pb-5 text-lg font-bold text-white/50 sm:pb-6 sm:text-2xl">:</span>
      <Unit value={countdown.minutes} label="Minutes" />
      <span className="pb-5 text-lg font-bold text-white/50 sm:pb-6 sm:text-2xl">:</span>
      <Unit value={countdown.seconds} label="Seconds" />
    </div>
  );
}
