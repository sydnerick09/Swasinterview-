"use client";

import { Download, FileText } from "lucide-react";
import { downloadFile } from "@/lib/storage/idb";
import { useToast } from "@/components/ui/Toast";
import { formatBytes } from "@/lib/utils";
import type { UploadedDocument } from "@/lib/types";

const DOC_LABELS: Record<string, string> = {
  national_id: "National ID",
  passport: "Passport",
  cv: "CV / Résumé",
  academic_certificates: "Academic Certificates",
  professional_certificates: "Professional Certificates",
  portfolio: "Portfolio",
  cover_letter: "Cover Letter",
};

export function DocumentDownloadList({ documents }: { documents: UploadedDocument[] }) {
  const { toast } = useToast();

  if (documents.length === 0) {
    return <p className="text-sm text-muted">No documents uploaded.</p>;
  }

  const handleDownload = async (doc: UploadedDocument) => {
    try {
      await downloadFile(doc.id, doc.fileName);
    } catch {
      toast("File not found in this browser's storage.", "error");
    }
  };

  return (
    <ul className="divide-y divide-[var(--border)]">
      {documents.map((doc) => (
        <li key={doc.id} className="flex items-center justify-between gap-3 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <FileText className="h-5 w-5 shrink-0 text-brand-600" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{DOC_LABELS[doc.type] ?? doc.type}</p>
              <p className="truncate text-xs text-muted">
                {doc.fileName} · {formatBytes(doc.fileSize)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleDownload(doc)}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium transition hover:border-brand-400 hover:text-brand-600"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </button>
        </li>
      ))}
    </ul>
  );
}
