"use client";

import { useEffect, useState } from "react";
import { computeWindow, toCountdown, type Countdown, type WindowState } from "@/lib/config";
import { ensureSettingsInitialized, getSettings } from "@/lib/storage/settings";
import type { PortalSettings } from "@/lib/types";

export interface ApplicationWindow {
  ready: boolean; // true once client has hydrated settings
  settings: PortalSettings;
  window: WindowState;
  countdown: Countdown;
}

/**
 * Live application-window state. Reads admin-configurable settings from localStorage,
 * ticks every second, and reacts to settings changes made in the admin panel.
 */
export function useApplicationWindow(): ApplicationWindow {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<PortalSettings>(() => getSettings());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setSettings(ensureSettingsInitialized());
    setReady(true);

    const onSettingsChange = () => setSettings(getSettings());
    window.addEventListener("swastask:settings-changed", onSettingsChange);
    window.addEventListener("storage", onSettingsChange);

    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("swastask:settings-changed", onSettingsChange);
      window.removeEventListener("storage", onSettingsChange);
    };
  }, []);

  const windowState = computeWindow(settings, now);
  const countdown = toCountdown(windowState.msRemaining);

  return { ready, settings, window: windowState, countdown };
}
