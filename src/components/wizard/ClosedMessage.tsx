import { CalendarX, Clock } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";

export function ClosedMessage({
  variant,
  opensAt,
}: {
  variant: "closed" | "not-started";
  opensAt?: Date;
}) {
  const notStarted = variant === "not-started";
  return (
    <div className="container-page py-20">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
          {notStarted ? <Clock className="h-8 w-8" /> : <CalendarX className="h-8 w-8" />}
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">
          {notStarted ? "Applications Not Yet Open" : "Applications Closed"}
        </h1>
        <p className="mt-4 text-muted">
          {notStarted ? (
            <>
              The recruitment window has not started yet
              {opensAt ? (
                <>
                  . Applications open on{" "}
                  <span className="font-medium text-[var(--text)]">
                    {formatDateTime(opensAt.toISOString())}
                  </span>
                  .
                </>
              ) : (
                "."
              )}
            </>
          ) : (
            "Thank you for your interest in SWASTASK. The application period has ended. Please check back during the next recruitment cycle."
          )}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <LinkButton href="/" variant="outline">
            Back to Home
          </LinkButton>
          <LinkButton href="/status">Check Application Status</LinkButton>
        </div>
      </div>
    </div>
  );
}
