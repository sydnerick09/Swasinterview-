import * as XLSX from "xlsx";
import type { Application } from "./types";
import { formatDateTime } from "./utils";

// Flatten an application into a single row for tabular export.
function toRow(app: Application): Record<string, string | number> {
  return {
    "Application ID": app.applicationId ?? "",
    Status: app.status,
    "Full Name": app.personal.fullName || app.account.fullName,
    Email: app.account.email || app.personal.email,
    Phone: app.account.phone || app.personal.phone,
    Country: app.account.country || app.personal.country,
    "County/State": app.personal.countyState,
    City: app.personal.city,
    Nationality: app.personal.nationality,
    "Date of Birth": app.personal.dateOfBirth,
    Gender: app.personal.gender,
    "ID/Passport": app.personal.idOrPassportNumber,
    Education: app.skills.educationLevel,
    "Field of Study": app.skills.fieldOfStudy,
    Experience: app.skills.yearsOfExperience,
    "Primary Category": app.skills.primarySkillCategory,
    Skills: app.skills.skills.join("; "),
    Languages: app.skills.languages.join("; "),
    "English Level": app.skills.englishProficiency,
    "Expected Rate (USD/hr)": app.skills.expectedHourlyRate,
    "Assessment Score": app.assessment.score ?? "",
    "Typing WPM": app.assessment.typing.wpm,
    Device: app.equipment.deviceType,
    "Internet Speed": app.equipment.internetSpeed,
    "Hours/Week": app.availability.hoursPerWeek,
    Timezone: app.availability.timezone,
    Documents: app.documents.length,
    "Fee (USD)": app.payment.amount,
    Paid: app.payment.paid ? "Yes" : "No",
    "Transaction Ref": app.payment.transactionRef ?? "",
    "Submitted At": formatDateTime(app.submittedAt),
  };
}

export function exportCsv(apps: Application[], filename = "swastask-applications.csv") {
  const rows = apps.map(toRow);
  const headers = rows.length ? Object.keys(rows[0]) : [];
  const escape = (v: string | number) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename);
}

export function exportExcel(apps: Application[], filename = "swastask-applications.xlsx") {
  const rows = apps.map(toRow);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
  XLSX.writeFile(workbook, filename);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
