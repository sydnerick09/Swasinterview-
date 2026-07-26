"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Mail,
  XCircle,
  ChevronDown,
  SearchX,
} from "lucide-react";
import { getApplication, getApplicationByPublicId } from "@/lib/storage/applications";
import type { Application } from "@/lib/types";
import { PaymentPanel } from "./PaymentPanel";
import { DocumentDownloadList } from "@/components/DocumentDownloadList";
import { ApplicationSummary } from "@/components/ApplicationSummary";
import { StatusBadge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { FormSkeleton } from "@/components/ui/Skeleton";
import { formatFee } from "@/lib/pricing";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function StatusView({ idOrPublicId }: { idOrPublicId: string }) {
  const [app, setApp] = useState<Application | null | undefined>(undefined);
  const [showDetails, setShowDetails] = useState(false);

  const load = () => {
    const found =
      getApplication(idOrPublicId) ?? getApplicationByPublicId(idOrPublicId) ?? null;
    setApp(found);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idOrPublicId]);

  if (app === undefined) {
    return (
      <div className="container-page py-8">
        <FormSkeleton />
      </div>
    );
  }

  if (app === null) {
    return (
      <div className="container-page py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-muted dark:bg-slate-800">
          <SearchX className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Application not found</h1>
        <p className="mt-3 text-muted">
          We couldn&apos;t find an application with that ID in this browser.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <LinkButton href="/status" variant="outline">
            Try Again
          </LinkButton>
          <LinkButton href="/apply">Start an Application</LinkButton>
        </div>
      </div>
    );
  }

  const name = app.personal.fullName || app.account.fullName;
  const isUnpaid = app.status === "submitted";

  return (
    <div className="container-page py-8">
      {/* Status header */}
      <div className="card mb-6 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Application {app.applicationId}</h1>
            <StatusBadge status={app.status} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {name} · Submitted {formatDateTime(app.submittedAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-muted">Application Fee</p>
          <p className="text-lg font-bold">{formatFee(app.payment.amount)}</p>
        </div>
      </div>

      {isUnpaid ? (
        <>
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            <Clock className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              Your application is submitted and <strong>locked</strong>. Complete the payment below
              to finalize it. A confirmation email will be sent once payment succeeds.
            </p>
          </div>
          <PaymentPanel app={app} onPaid={load} />
        </>
      ) : (
        <ConfirmationView app={app} />
      )}

      {/* Documents */}
      <Card className="mt-6">
        <CardBody>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Uploaded Documents
          </h3>
          <DocumentDownloadList documents={app.documents} />
        </CardBody>
      </Card>

      {/* Collapsible full details */}
      <div className="mt-6">
        <button
          onClick={() => setShowDetails((s) => !s)}
          className="flex w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-medium"
        >
          View full application details
          <ChevronDown className={cn("h-5 w-5 transition-transform", showDetails && "rotate-180")} />
        </button>
        {showDetails && (
          <div className="mt-4">
            <ApplicationSummary app={app} />
          </div>
        )}
      </div>
    </div>
  );
}

function ConfirmationView({ app }: { app: Application }) {
  if (app.status === "rejected") {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <XCircle className="h-8 w-8 text-red-500" />
          <div>
            <h2 className="text-lg font-semibold">Application Update</h2>
            <p className="text-sm text-muted">
              After review, we&apos;re unable to proceed with your application at this time. Thank you
              for your interest in SWASTASK.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const approved = app.status === "approved";
  return (
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 text-white">
        <CheckCircle2 className="h-10 w-10" />
        <h2 className="mt-3 text-2xl font-bold">
          {approved ? "Application Approved!" : "Application Submitted & Paid"}
        </h2>
        <p className="mt-1 text-white/90">
          {approved
            ? "Congratulations! Our team will contact you shortly with onboarding details."
            : "Thank you! Your payment was received and your application is now complete."}
        </p>
      </div>
      <div className="p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Application ID</dt>
            <dd className="font-mono text-sm font-semibold">{app.applicationId}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Payment</dt>
            <dd className="text-sm font-semibold">
              {formatFee(app.payment.amount)} · {app.payment.transactionRef}
            </dd>
          </div>
        </dl>
        <div className="mt-5 flex items-start gap-3 rounded-lg bg-brand-50 p-4 text-sm text-brand-800 dark:bg-brand-950/40 dark:text-brand-200">
          <Mail className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Your uploaded documents will be reviewed by our recruitment team. Any further
            communication will be sent to <strong>{app.account.email || app.personal.email}</strong>.
            Please keep your Application ID safe.
          </p>
        </div>
      </div>
    </div>
  );
}
