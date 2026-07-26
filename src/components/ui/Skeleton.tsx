import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton h-4 w-full", className)} aria-hidden="true" />;
}

/** A loading placeholder that mimics a form card while the wizard hydrates. */
export function FormSkeleton() {
  return (
    <div className="card p-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="mt-2 h-3 w-2/3" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-11 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
