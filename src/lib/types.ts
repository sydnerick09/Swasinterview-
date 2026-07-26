// Central data model for the SWASTASK Application Portal.
// All persistence is client-side (localStorage for structured data, IndexedDB for files),
// but these types are storage-agnostic so the backend can be swapped later.

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "paid"
  | "approved"
  | "rejected";

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export type ProficiencyLevel = "none" | "basic" | "intermediate" | "advanced" | "expert";

export interface AccountInfo {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  username: string;
  password: string; // demo only — never store plaintext passwords in production
}

export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  gender: Gender | "";
  nationality: string;
  country: string;
  countyState: string;
  city: string;
  idOrPassportNumber: string;
  phone: string;
  email: string;
}

export interface SkillsExperience {
  educationLevel: string;
  fieldOfStudy: string;
  yearsOfExperience: string;
  currentJobTitle: string;
  currentEmployer: string;
  employmentStatus: string;
  primarySkillCategory: string;
  skills: string[];
  languages: string[];
  englishProficiency: ProficiencyLevel | "";
  professionalSummary: string;
  portfolioUrl: string;
  linkedinUrl: string;
  expectedHourlyRate: string;
}

export interface EquipmentInternet {
  deviceType: string;
  operatingSystem: string;
  ram: string;
  processor: string;
  hasWebcam: boolean;
  hasHeadset: boolean;
  internetType: string;
  internetSpeed: string;
  hasBackupPower: boolean;
  hasBackupInternet: boolean;
  hasDedicatedWorkspace: boolean;
}

export interface AssessmentAnswers {
  // Scored multiple-choice sections keyed by question id -> selected option index
  answers: Record<string, number>;
  // Self-rated proficiency sections
  ratings: Record<string, ProficiencyLevel>;
  // Free-text sections (copywriting, research, data entry)
  freeText: Record<string, string>;
  // Typing test result
  typing: {
    wpm: number;
    accuracy: number;
    completed: boolean;
  };
  // Personality Likert answers (1-5)
  personality: Record<string, number>;
  // Computed score summary (0-100 per scored section) — filled at submit
  score?: number;
}

export type DocumentType =
  | "national_id"
  | "passport"
  | "cv"
  | "academic_certificates"
  | "professional_certificates"
  | "portfolio"
  | "cover_letter";

export interface UploadedDocument {
  id: string; // IndexedDB key for the binary blob
  type: DocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface Availability {
  availableFrom: string;
  hoursPerWeek: string;
  preferredShift: string;
  timezone: string;
  daysAvailable: string[];
  noticePeriod: string;
  employmentType: string;
  willingToWorkWeekends: boolean;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface Reference {
  name: string;
  relationship: string;
  company: string;
  phone: string;
  email: string;
}

export interface PaymentInfo {
  amount: number;
  currency: "KES";
  paid: boolean;
  paidAt?: string;
  transactionRef?: string;
  method?: string;
}

export interface Application {
  id: string; // internal id (uuid-ish)
  applicationId?: string; // human-facing ID generated at submit (e.g. SWT-2026-XXXX)
  status: ApplicationStatus;
  currentStep: number;
  locked: boolean;

  account: AccountInfo;
  personal: PersonalInfo;
  skills: SkillsExperience;
  equipment: EquipmentInternet;
  assessment: AssessmentAnswers;
  documents: UploadedDocument[];
  availability: Availability;
  emergencyContact: EmergencyContact;
  references: Reference[];

  payment: PaymentInfo;

  createdAt: string;
  updatedAt: string;
  submittedAt?: string;

  // Admin fields
  reviewNote?: string;
}

export interface PortalSettings {
  // 4-day (configurable) application window
  openDate: string; // ISO timestamp when applications open
  windowDays: number; // duration of the window in days
  adminPassword: string; // demo-only admin gate
}
