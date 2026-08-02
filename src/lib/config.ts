import type { PortalSettings } from "./types";

// Default portal configuration. The administrator can override these at runtime
// (persisted to localStorage) without changing source — see storage/settings.ts.
//
// NEXT_PUBLIC_* env vars provide the deploy-time defaults so the opening date can
// be configured on Vercel without a code change.

const envOpenDate = process.env.NEXT_PUBLIC_OPEN_DATE;
const envWindowDays = process.env.NEXT_PUBLIC_WINDOW_DAYS;
const envCloseDate = process.env.NEXT_PUBLIC_CLOSE_DATE;
const envAdminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

export const DEFAULT_SETTINGS: PortalSettings = {
  // Defaults to "now" the first time the portal is opened in a browser, giving a
  // live window. Overridden by env config.
  openDate: envOpenDate || new Date().toISOString(),
  windowDays: envWindowDays ? Number(envWindowDays) : 4,
  // A fixed, global closing deadline. When set (via NEXT_PUBLIC_CLOSE_DATE) it applies
  // to every visitor and overrides the per-browser openDate + windowDays window.
  closeDate: envCloseDate || undefined,
  adminPassword: envAdminPassword || "swastask-admin",
};

export interface WindowState {
  open: boolean;
  hasStarted: boolean;
  closeDate: Date;
  msRemaining: number;
}

/** Compute the state of the application window from settings and the current time. */
export function computeWindow(
  settings: PortalSettings,
  now: number = Date.now(),
): WindowState {
  const open = new Date(settings.openDate).getTime();
  // A fixed closeDate (global deadline) takes precedence over openDate + windowDays.
  const closeMs = settings.closeDate
    ? new Date(settings.closeDate).getTime()
    : open + settings.windowDays * 24 * 60 * 60 * 1000;
  const closeDate = new Date(closeMs);
  const hasStarted = now >= open;
  const msRemaining = Math.max(0, closeMs - now);
  return {
    open: hasStarted && msRemaining > 0,
    hasStarted,
    closeDate,
    msRemaining,
  };
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

/** Break a millisecond duration into days/hours/minutes/seconds. */
export function toCountdown(ms: number): Countdown {
  const total = Math.max(0, ms);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { days, hours, minutes, seconds, total };
}
