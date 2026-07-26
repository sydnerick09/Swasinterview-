import { DEFAULT_SETTINGS } from "../config";
import type { PortalSettings } from "../types";

const KEY = "swastask:settings";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getSettings(): PortalSettings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<PortalSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: PortalSettings): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("swastask:settings-changed"));
}

/** Ensure a first-run openDate is persisted so the countdown is stable across reloads. */
export function ensureSettingsInitialized(): PortalSettings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) {
    saveSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
  return getSettings();
}
