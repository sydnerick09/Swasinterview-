import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M5 8.5c0-1.5 1.4-2.5 3.5-2.5S12 7 12 7m0 10s-1.4 1-3.5 1S5 16.9 5 15.5M12 7c0-1 1.4-2 3.5-2S19 6 19 7.5c0 3-7 2-7 5s7 2 7 5c0 1.5-1.4 2.5-3.5 2.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-base font-extrabold tracking-tight">SWASTASK</span>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
          Application Portal
        </span>
      </span>
    </Link>
  );
}
