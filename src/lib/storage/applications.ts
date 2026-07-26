import { getApplicationFee } from "../pricing";
import type { Application, ApplicationStatus } from "../types";
import { uid } from "../utils";

const LIST_KEY = "swastask:applications";
const DRAFT_KEY = "swastask:current-draft";
const CHANGE_EVENT = "swastask:applications-changed";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function emitChange() {
  if (isBrowser()) window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export const APPLICATIONS_CHANGE_EVENT = CHANGE_EVENT;

export function createEmptyApplication(): Application {
  const now = new Date().toISOString();
  return {
    id: uid("app"),
    status: "draft",
    currentStep: 0,
    locked: false,
    account: { fullName: "", email: "", phone: "", country: "", username: "", password: "" },
    personal: {
      fullName: "",
      dateOfBirth: "",
      gender: "",
      nationality: "",
      country: "",
      countyState: "",
      city: "",
      idOrPassportNumber: "",
      phone: "",
      email: "",
    },
    skills: {
      educationLevel: "",
      fieldOfStudy: "",
      yearsOfExperience: "",
      currentJobTitle: "",
      currentEmployer: "",
      employmentStatus: "",
      primarySkillCategory: "",
      skills: [],
      languages: [],
      englishProficiency: "",
      professionalSummary: "",
      portfolioUrl: "",
      linkedinUrl: "",
      expectedHourlyRate: "",
    },
    equipment: {
      deviceType: "",
      operatingSystem: "",
      ram: "",
      processor: "",
      hasWebcam: false,
      hasHeadset: false,
      internetType: "",
      internetSpeed: "",
      hasBackupPower: false,
      hasBackupInternet: false,
      hasDedicatedWorkspace: false,
    },
    assessment: {
      answers: {},
      ratings: {},
      freeText: {},
      typing: { wpm: 0, accuracy: 0, completed: false },
      personality: {},
    },
    documents: [],
    availability: {
      availableFrom: "",
      hoursPerWeek: "",
      preferredShift: "",
      timezone: "",
      daysAvailable: [],
      noticePeriod: "",
      employmentType: "",
      willingToWorkWeekends: false,
    },
    emergencyContact: { name: "", relationship: "", phone: "", email: "" },
    references: [],
    payment: { amount: 0, currency: "USD", paid: false },
    createdAt: now,
    updatedAt: now,
  };
}

export function listApplications(): Application[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(LIST_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Application[];
  } catch {
    return [];
  }
}

function writeAll(apps: Application[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(LIST_KEY, JSON.stringify(apps));
  emitChange();
}

export function getApplication(id: string): Application | undefined {
  return listApplications().find((a) => a.id === id);
}

export function getApplicationByPublicId(applicationId: string): Application | undefined {
  return listApplications().find(
    (a) => a.applicationId?.toLowerCase() === applicationId.toLowerCase(),
  );
}

export function saveApplication(app: Application): void {
  const apps = listApplications();
  const idx = apps.findIndex((a) => a.id === app.id);
  const updated: Application = { ...app, updatedAt: new Date().toISOString() };
  // Keep the fee in sync with the selected country (single source of truth).
  updated.payment = {
    ...updated.payment,
    amount: getApplicationFee(updated.account.country || updated.personal.country),
  };
  if (idx >= 0) apps[idx] = updated;
  else apps.push(updated);
  writeAll(apps);
}

export function deleteApplication(id: string): void {
  writeAll(listApplications().filter((a) => a.id !== id));
}

export function updateStatus(
  id: string,
  status: ApplicationStatus,
  patch?: Partial<Application>,
): void {
  const apps = listApplications();
  const idx = apps.findIndex((a) => a.id === id);
  if (idx < 0) return;
  apps[idx] = { ...apps[idx], ...patch, status, updatedAt: new Date().toISOString() };
  writeAll(apps);
}

// ----- Current draft pointer (resume in-progress application) -----

export function getCurrentDraftId(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(DRAFT_KEY);
}

export function setCurrentDraftId(id: string | null): void {
  if (!isBrowser()) return;
  if (id) window.localStorage.setItem(DRAFT_KEY, id);
  else window.localStorage.removeItem(DRAFT_KEY);
}

/** Return the active draft, creating one if none exists. */
export function getOrCreateDraft(): Application {
  const draftId = getCurrentDraftId();
  if (draftId) {
    const existing = getApplication(draftId);
    if (existing && !existing.locked) return existing;
  }
  const fresh = createEmptyApplication();
  saveApplication(fresh);
  setCurrentDraftId(fresh.id);
  return fresh;
}
