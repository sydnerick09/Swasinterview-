import { getSettings } from "./storage/settings";

// Demo-only admin gate. This is NOT real authentication — it simply checks a shared
// password and stores a session flag. For production, replace with a proper auth
// provider and server-side session.

const SESSION_KEY = "swastask:admin-session";

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(SESSION_KEY) === "1";
}

export function adminLogin(password: string): boolean {
  const settings = getSettings();
  if (password === settings.adminPassword) {
    window.sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  }
  return false;
}

export function adminLogout(): void {
  window.sessionStorage.removeItem(SESSION_KEY);
}
