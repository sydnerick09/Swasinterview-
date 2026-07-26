"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Application } from "@/lib/types";
import {
  getOrCreateDraft,
  saveApplication,
  setCurrentDraftId,
} from "@/lib/storage/applications";
import { validateStep } from "@/lib/validation";
import { TOTAL_STEPS } from "./steps-meta";

type SectionKey = Exclude<
  keyof Application,
  | "id"
  | "applicationId"
  | "status"
  | "currentStep"
  | "locked"
  | "createdAt"
  | "updatedAt"
  | "submittedAt"
  | "reviewNote"
>;

export type SaveState = "idle" | "saving" | "saved";

interface WizardContextValue {
  app: Application;
  step: number;
  errors: Record<string, string>;
  saveState: SaveState;
  ready: boolean;
  // updates
  setApp: (updater: (prev: Application) => Application) => void;
  patchSection: <K extends SectionKey>(section: K, patch: Partial<Application[K]>) => void;
  replaceSection: <K extends SectionKey>(section: K, value: Application[K]) => void;
  // navigation
  goTo: (step: number) => void;
  next: () => boolean;
  back: () => void;
  validateCurrent: () => boolean;
  clearErrors: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [app, setAppState] = useState<Application | null>(null);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load or create the draft on mount.
  useEffect(() => {
    const draft = getOrCreateDraft();
    setAppState(draft);
    setStep(draft.currentStep ?? 0);
  }, []);

  const persist = useCallback((next: Application) => {
    setSaveState("saving");
    saveApplication(next);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaveState("saved"), 300);
  }, []);

  const setApp = useCallback(
    (updater: (prev: Application) => Application) => {
      setAppState((prev) => {
        if (!prev) return prev;
        const next = updater(prev);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const patchSection = useCallback(
    <K extends SectionKey>(section: K, patch: Partial<Application[K]>) => {
      setApp((prev) => ({
        ...prev,
        [section]: { ...(prev[section] as object), ...patch },
      }));
    },
    [setApp],
  );

  const replaceSection = useCallback(
    <K extends SectionKey>(section: K, value: Application[K]) => {
      setApp((prev) => ({ ...prev, [section]: value }));
    },
    [setApp],
  );

  const clearErrors = useCallback(() => setErrors({}), []);

  const validateCurrent = useCallback(() => {
    if (!app) return false;
    const result = validateStep(step, app);
    if (result.ok) {
      setErrors({});
      return true;
    }
    setErrors(result.errors);
    return false;
  }, [app, step]);

  const goTo = useCallback(
    (target: number) => {
      const clamped = Math.max(0, Math.min(TOTAL_STEPS - 1, target));
      setStep(clamped);
      setErrors({});
      setApp((prev) => ({ ...prev, currentStep: clamped }));
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setApp],
  );

  const next = useCallback(() => {
    if (!validateCurrent()) return false;
    goTo(step + 1);
    return true;
  }, [validateCurrent, goTo, step]);

  const back = useCallback(() => goTo(step - 1), [goTo, step]);

  // If this draft becomes locked (submitted elsewhere), stop pointing to it.
  useEffect(() => {
    if (app?.locked) setCurrentDraftId(null);
  }, [app?.locked]);

  const value = useMemo<WizardContextValue | null>(() => {
    if (!app) return null;
    return {
      app,
      step,
      errors,
      saveState,
      ready: true,
      setApp,
      patchSection,
      replaceSection,
      goTo,
      next,
      back,
      validateCurrent,
      clearErrors,
    };
  }, [
    app,
    step,
    errors,
    saveState,
    setApp,
    patchSection,
    replaceSection,
    goTo,
    next,
    back,
    validateCurrent,
    clearErrors,
  ]);

  if (!value) {
    return <WizardContext.Provider value={null}>{children}</WizardContext.Provider>;
  }
  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("Wizard is still loading");
  return ctx;
}

export function useWizardOptional(): WizardContextValue | null {
  return useContext(WizardContext);
}
