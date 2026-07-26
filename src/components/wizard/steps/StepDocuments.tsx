"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileText, X, CheckCircle2 } from "lucide-react";
import { useWizard } from "../WizardContext";
import { useToast } from "@/components/ui/Toast";
import { putFile, deleteFile } from "@/lib/storage/idb";
import { formatBytes, uid } from "@/lib/utils";
import type { DocumentType, UploadedDocument } from "@/lib/types";
import { cn } from "@/lib/utils";

const DOC_TYPES: { type: DocumentType; label: string; hint: string; required?: boolean }[] = [
  { type: "national_id", label: "National ID", hint: "Government-issued national ID", required: true },
  { type: "passport", label: "Passport", hint: "If available" },
  { type: "cv", label: "CV / Résumé", hint: "Your latest CV", required: true },
  { type: "academic_certificates", label: "Academic Certificates", hint: "Degrees, diplomas" },
  { type: "professional_certificates", label: "Professional Certificates", hint: "Any professional qualifications" },
  { type: "portfolio", label: "Portfolio", hint: "Samples of your work" },
  { type: "cover_letter", label: "Cover Letter", hint: "Tell us why you're a great fit" },
];

const ACCEPTED = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
const ACCEPTED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/jpg",
  "image/png",
];
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

function DocRow({
  def,
  existing,
  onUpload,
  onRemove,
}: {
  def: (typeof DOC_TYPES)[number];
  existing?: UploadedDocument;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const validate = (file: File): boolean => {
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (!ACCEPTED.includes(ext) && !ACCEPTED_MIME.includes(file.type)) {
      toast(`Unsupported file type: ${file.name}. Allowed: PDF, DOC, DOCX, JPG, PNG.`, "error");
      return false;
    }
    if (file.size > MAX_SIZE) {
      toast(`${file.name} is ${formatBytes(file.size)} — max is 20 MB.`, "error");
      return false;
    }
    return true;
  };

  const handleFile = async (file: File) => {
    if (!validate(file)) return;
    setBusy(true);
    try {
      await onUpload(file);
      toast(`${def.label} uploaded.`, "success");
    } catch {
      toast("Upload failed. Please try again.", "error");
    } finally {
      setBusy(false);
    }
  };

  if (existing) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-300 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/30">
        <div className="flex min-w-0 items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{def.label}</p>
            <p className="truncate text-xs text-muted">
              {existing.fileName} · {formatBytes(existing.fileSize)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 rounded-md p-1.5 text-muted hover:bg-white hover:text-red-600 dark:hover:bg-slate-800"
          aria-label={`Remove ${def.label}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
      }}
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border border-dashed p-3 transition",
        dragOver ? "border-brand-500 bg-brand-50 dark:bg-brand-950/40" : "border-[var(--border)]",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <FileText className="h-5 w-5 shrink-0 text-muted" />
        <div className="min-w-0">
          <p className="text-sm font-medium">
            {def.label}
            {def.required && <span className="ml-1 text-red-500">*</span>}
          </p>
          <p className="text-xs text-muted">{def.hint}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        <UploadCloud className="h-4 w-4" /> {busy ? "Uploading…" : "Upload"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function StepDocuments() {
  const { app, setApp } = useWizard();

  const upload = async (type: DocumentType, file: File) => {
    const id = uid("doc");
    await putFile(id, file);
    const doc: UploadedDocument = {
      id,
      type,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
    };
    setApp((prev) => ({
      ...prev,
      documents: [...prev.documents.filter((d) => d.type !== type), doc],
    }));
  };

  const remove = async (type: DocumentType) => {
    const existing = app.documents.find((d) => d.type === type);
    if (existing) await deleteFile(existing.id).catch(() => {});
    setApp((prev) => ({ ...prev, documents: prev.documents.filter((d) => d.type !== type) }));
  };

  return (
    <div>
      <p className="mb-4 rounded-lg bg-brand-50 p-3 text-sm text-brand-800 dark:bg-brand-950/40 dark:text-brand-200">
        Accepted formats: <strong>PDF, DOC, DOCX, JPG, JPEG, PNG</strong> · Max <strong>20 MB</strong> each.
        Files are stored securely in your browser until you submit.
      </p>
      <div className="space-y-3">
        {DOC_TYPES.map((def) => (
          <DocRow
            key={def.type}
            def={def}
            existing={app.documents.find((d) => d.type === def.type)}
            onUpload={(file) => upload(def.type, file)}
            onRemove={() => remove(def.type)}
          />
        ))}
      </div>
    </div>
  );
}
