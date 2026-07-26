"use client";

import { useState } from "react";
import { X, Mail, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import type { Application, ApplicationStatus } from "@/lib/types";
import { ApplicationSummary } from "@/components/ApplicationSummary";
import { DocumentDownloadList } from "@/components/DocumentDownloadList";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { updateStatus, deleteApplication } from "@/lib/storage/applications";
import { sendDecisionEmail, sendEmail } from "@/lib/email";
import { formatFee } from "@/lib/pricing";

export function ApplicationDrawer({
  app,
  onClose,
}: {
  app: Application;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [note, setNote] = useState(app.reviewNote ?? "");
  const [emailBody, setEmailBody] = useState("");
  const [busy, setBusy] = useState(false);

  const decide = async (status: ApplicationStatus) => {
    setBusy(true);
    updateStatus(app.id, status, { reviewNote: note });
    await sendDecisionEmail(app, status === "approved" ? "approved" : "rejected");
    setBusy(false);
    toast(
      `Application ${status} — notification email sent to ${app.account.email || app.personal.email}.`,
      status === "approved" ? "success" : "info",
    );
    onClose();
  };

  const sendCustomEmail = async () => {
    if (!emailBody.trim()) {
      toast("Write a message first.", "error");
      return;
    }
    await sendEmail({
      to: app.account.email || app.personal.email,
      subject: `SWASTASK — Regarding your application ${app.applicationId}`,
      body: emailBody,
    });
    setEmailBody("");
    toast("Email sent (recorded in outbox).", "success");
  };

  const remove = () => {
    if (confirm("Delete this application permanently? This cannot be undone.")) {
      deleteApplication(app.id);
      toast("Application deleted.", "info");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="relative z-10 flex h-full w-full max-w-2xl flex-col overflow-hidden bg-[var(--bg)] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] bg-[var(--card)] p-5">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold">{app.applicationId}</h2>
              <StatusBadge status={app.status} />
            </div>
            <p className="mt-1 text-sm text-muted">
              {app.personal.fullName || app.account.fullName} · {formatFee(app.payment.amount)} ·{" "}
              {app.payment.paid ? "Paid" : "Unpaid"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted hover:bg-gray-100 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Actions */}
          <div className="card mb-5 p-4">
            <h3 className="mb-3 text-sm font-semibold">Review Decision</h3>
            <TextArea
              label="Internal note (optional)"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this decision…"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="success" size="sm" loading={busy} onClick={() => decide("approved")}>
                <CheckCircle2 className="h-4 w-4" /> Approve
              </Button>
              <Button variant="danger" size="sm" loading={busy} onClick={() => decide("rejected")}>
                <XCircle className="h-4 w-4" /> Reject
              </Button>
              <Button variant="ghost" size="sm" onClick={remove} className="ml-auto text-red-600">
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>

          {/* Custom email */}
          <div className="card mb-5 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Mail className="h-4 w-4 text-brand-600" /> Send Email Notification
            </h3>
            <TextArea
              rows={3}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder={`Write a message to ${app.account.email || app.personal.email}…`}
            />
            <div className="mt-3">
              <Button size="sm" onClick={sendCustomEmail}>
                <Mail className="h-4 w-4" /> Send Email
              </Button>
            </div>
          </div>

          {/* Documents */}
          <div className="card mb-5 p-4">
            <h3 className="mb-3 text-sm font-semibold">Uploaded Documents</h3>
            <DocumentDownloadList documents={app.documents} />
          </div>

          {/* Full details */}
          <ApplicationSummary app={app} />
        </div>
      </aside>
    </div>
  );
}
